import AppKit
import Combine
import SwiftUI

/// An arrowless menu bar panel backed by the system's current glass material.
final class MenuBarController: NSObject, ObservableObject {
  private let engine: MouseEngine
  private let preferences: Preferences
  private var prepared = false
  private var statusItem: NSStatusItem?
  private let panel = MenuBarPanel()
  private var hostingView: NSView?
  private var openSettings: (() -> Void)?
  private var localMonitor: Any?
  private var globalMonitor: Any?
  private var activitySubscription: AnyCancellable?
  private let inactiveImage = BrandArtwork.symbol(size: 20, template: true, filled: false)
  private let activeImage = BrandArtwork.symbol(size: 20, template: true, filled: true)

  init(engine: MouseEngine, preferences: Preferences) {
    self.engine = engine
    self.preferences = preferences
    super.init()
    activitySubscription = engine.$active.removeDuplicates().sink { [weak self] active in
      self?.updateStatusAppearance(active: active)
    }
  }

  private func preparePanel() {
    guard !prepared else { return }
    prepared = true
    let hosting = NSHostingView(rootView: MenuBarView(engine: engine, preferences: preferences) {
      [weak self] in
      self?.closePanel()
      self?.openSettings?()
    })
    hosting.sizingOptions = [.intrinsicContentSize]
    hostingView = hosting
    let background: NSView
    if #available(macOS 26, *) {
      let glass = NSGlassEffectView()
      glass.style = .regular
      glass.cornerRadius = 26
      glass.contentView = hosting
      background = glass
    } else {
      let material = NSVisualEffectView()
      material.material = .popover
      material.blendingMode = .behindWindow
      material.state = .active
      material.wantsLayer = true
      material.layer?.cornerRadius = 12
      material.layer?.masksToBounds = true
      material.addSubview(hosting)
      background = material
    }
    hosting.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      hosting.leadingAnchor.constraint(equalTo: background.leadingAnchor),
      hosting.trailingAnchor.constraint(equalTo: background.trailingAnchor),
      hosting.topAnchor.constraint(equalTo: background.topAnchor),
      hosting.bottomAnchor.constraint(equalTo: background.bottomAnchor),
    ])
    panel.contentView = background
    panel.setContentSize(hosting.fittingSize)
  }

  func configure(isVisible: Bool, openSettings: @escaping () -> Void) {
    self.openSettings = openSettings
    setVisible(isVisible)
  }

  func setVisible(_ visible: Bool) {
    if !visible {
      closePanel()
      if let statusItem { NSStatusBar.system.removeStatusItem(statusItem) }
      statusItem = nil
      return
    }
    guard statusItem == nil else { return }
    let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
    if let button = item.button {
      if #available(macOS 27, *) {
        // Let the menu bar own selection, tracking, and keyboard navigation.
        item.expandedInterfaceDelegate = self
      } else {
        (button.cell as? NSButtonCell)?.showsStateBy = [.changeBackgroundCellMask]
        button.target = self
        button.action = #selector(togglePanel)
      }
    }
    statusItem = item
    updateStatusAppearance(active: engine.active)
  }

  private func updateStatusAppearance(active: Bool) {
    guard let button = statusItem?.button else { return }
    button.image = active ? activeImage : inactiveImage
    let description = active ? "KeyMouse — Active" : "KeyMouse — Inactive"
    button.setAccessibilityLabel(description)
    button.toolTip = description
  }

  @objc private func togglePanel() {
    guard !panel.isVisible else {
      closePanel()
      return
    }
    showPanel()
  }

  private func showPanel() {
    guard let button = statusItem?.button, let window = button.window,
      let screen = window.screen
    else {
      closePanel()
      return
    }
    preparePanel()
    let anchor = window.convertToScreen(button.convert(button.bounds, to: nil))
    let size = hostingView?.fittingSize ?? panel.frame.size
    let bounds = screen.visibleFrame.insetBy(dx: 8, dy: 0)
    let x = min(max(anchor.maxX - size.width, bounds.minX), bounds.maxX - size.width)
    let y = max(bounds.minY, anchor.minY - 6 - size.height)
    panel.setFrame(NSRect(origin: NSPoint(x: x, y: y), size: size), display: false)
    panel.makeKeyAndOrderFront(nil)
    if #unavailable(macOS 27) {
      button.state = .on
      // Mouse tracking clears the pressed highlight after the action returns.
      DispatchQueue.main.async { [weak self] in
        guard let self else { return }
        self.statusItem?.button?.highlight(self.panel.isVisible)
      }
    }
    installDismissalMonitors()
  }

  private func installDismissalMonitors() {
    globalMonitor = NSEvent.addGlobalMonitorForEvents(
      matching: [.leftMouseDown, .rightMouseDown, .otherMouseDown]
    ) { [weak self] _ in self?.closePanel() }
    localMonitor = NSEvent.addLocalMonitorForEvents(
      matching: [.leftMouseDown, .rightMouseDown, .otherMouseDown, .keyDown]
    ) { [weak self] event in
      guard let self else { return event }
      if event.type == .keyDown {
        if event.keyCode == 53 {
          self.closePanel()
          return nil
        }
      } else if event.window !== self.panel,
        event.window !== self.statusItem?.button?.window,
        event.window?.level != .popUpMenu
      {
        self.closePanel()
      }
      return event
    }
  }

  private func closePanel() {
    if #available(macOS 27, *) {
      statusItem?.expandedInterfaceSession?.cancel()
    }
    hidePanel()
  }

  private func hidePanel() {
    panel.orderOut(nil)
    if #unavailable(macOS 27) {
      statusItem?.button?.state = .off
      statusItem?.button?.highlight(false)
    }
    if let localMonitor { NSEvent.removeMonitor(localMonitor) }
    if let globalMonitor { NSEvent.removeMonitor(globalMonitor) }
    localMonitor = nil
    globalMonitor = nil
  }

  deinit {
    if let localMonitor { NSEvent.removeMonitor(localMonitor) }
    if let globalMonitor { NSEvent.removeMonitor(globalMonitor) }
  }
}

@available(macOS 27, *)
extension MenuBarController: NSStatusItemExpandedInterfaceDelegate {
  func statusItem(
    _ statusItem: NSStatusItem,
    didBegin expandedInterfaceSession: NSStatusItemExpandedInterfaceSession
  ) {
    showPanel()
  }

  func statusItemDidEndExpandedInterfaceSession(_ statusItem: NSStatusItem, animated: Bool) {
    hidePanel()
  }
}

private final class MenuBarPanel: NSPanel {
  init() {
    super.init(
      contentRect: .zero, styleMask: [.borderless, .nonactivatingPanel],
      backing: .buffered, defer: false)
    isOpaque = false
    backgroundColor = .clear
    hasShadow = true
    level = .popUpMenu
    collectionBehavior = [.moveToActiveSpace, .fullScreenAuxiliary]
    isReleasedWhenClosed = false
    animationBehavior = .utilityWindow
    setAccessibilityLabel("KeyMouse")
  }

  override var canBecomeKey: Bool { true }
  override var canBecomeMain: Bool { false }
}
