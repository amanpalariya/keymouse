import AppKit
import Combine
import SwiftUI

/// A standard AppKit popover anchored to the menu bar item.
final class MenuBarController: NSObject, ObservableObject {
  private let engine: MouseEngine
  private let preferences: Preferences
  private var statusItem: NSStatusItem?
  private let popover = NSPopover()
  private var openSettings: (() -> Void)?
  private var activitySubscription: AnyCancellable?
  private var localEventMonitor: Any?
  private var globalEventMonitor: Any?
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

  private func preparePopover() {
    guard popover.contentViewController == nil else { return }
    let hosting = NSHostingController(rootView: MenuBarView(engine: engine, preferences: preferences) {
      [weak self] in
      self?.popover.performClose(nil)
      self?.openSettings?()
    })
    hosting.sizingOptions = [.preferredContentSize]
    // Own dismissal so the status button cannot close and immediately reopen
    // the popover during the same click.
    popover.behavior = .applicationDefined
    popover.delegate = self
    popover.contentViewController = hosting
    popover.contentSize = hosting.view.fittingSize
  }

  func configure(isVisible: Bool, openSettings: @escaping () -> Void) {
    self.openSettings = openSettings
    setVisible(isVisible)
  }

  func setVisible(_ visible: Bool) {
    if !visible {
      popover.performClose(nil)
      if let statusItem { NSStatusBar.system.removeStatusItem(statusItem) }
      statusItem = nil
      return
    }
    guard statusItem == nil else { return }
    let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
    if let button = item.button {
      button.target = self
      button.action = #selector(togglePopover)
      button.sendAction(on: [.leftMouseDown])
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

  @objc private func togglePopover() {
    if popover.isShown {
      popover.performClose(nil)
    } else {
      showPopover()
    }
  }

  private func showPopover() {
    guard let button = statusItem?.button else { return }
    preparePopover()
    popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
    startDismissalMonitoring()
  }

  private func startDismissalMonitoring() {
    stopDismissalMonitoring()
    let clicks: NSEvent.EventTypeMask = [.leftMouseDown, .rightMouseDown, .otherMouseDown]
    globalEventMonitor = NSEvent.addGlobalMonitorForEvents(matching: clicks) { [weak self] _ in
      self?.popover.performClose(nil)
    }
    localEventMonitor = NSEvent.addLocalMonitorForEvents(matching: [clicks, .keyDown]) {
      [weak self] event in
      guard let self, self.popover.isShown else { return event }
      if event.type == .keyDown {
        if event.keyCode == 53 {
          self.popover.performClose(nil)
          return nil
        }
        return event
      }
      // Let the status button handle its own click exactly once.
      if let button = self.statusItem?.button, event.window === button.window,
        button.bounds.contains(button.convert(event.locationInWindow, from: nil)) {
        return event
      }
      if let window = self.popover.contentViewController?.view.window {
        var clickedWindow = event.window
        while let candidate = clickedWindow {
          if candidate === window { return event }
          clickedWindow = candidate.parent
        }
      }
      self.popover.performClose(nil)
      return event
    }
  }

  private func stopDismissalMonitoring() {
    if let localEventMonitor { NSEvent.removeMonitor(localEventMonitor) }
    if let globalEventMonitor { NSEvent.removeMonitor(globalEventMonitor) }
    localEventMonitor = nil
    globalEventMonitor = nil
  }

  deinit { stopDismissalMonitoring() }
}

extension MenuBarController: NSPopoverDelegate {
  func popoverDidClose(_ notification: Notification) {
    stopDismissalMonitoring()
  }
}
