import AppKit
import ApplicationServices
import Combine

final class MouseEngine: ObservableObject {
  @Published private(set) var active = false
  @Published private(set) var connected = false
  @Published private(set) var trusted = false
  @Published private(set) var scrolling = false
  let preferences: Preferences
  private let eventTap = KeyboardEventTap()
  private var timer: Timer?
  private var permissionTimer: Timer?
  private var subscriptions = Set<AnyCancellable>()
  private var observers: [NSObjectProtocol] = []
  private var input = InputState()
  private var activation = ActivationState()
  private var lastTick = ProcessInfo.processInfo.systemUptime
  private var lastInteraction = ProcessInfo.processInfo.systemUptime
  private let badge = CursorBadge()
  private let pointer = PointerOutput()

  init(preferences: Preferences) {
    self.preferences = preferences
  }

  func start() {
    guard timer == nil else { return }
    observeConfiguration()
    observeSessionChanges()
    startTimers()
    refreshPermission()
  }

  private func observeConfiguration() {
    preferences.$configuration.dropFirst().sink { [weak self] _ in
      self?.deactivate()
      self?.activation.reset()
    }.store(in: &subscriptions)
  }

  private func observeSessionChanges() {
    for name in [
      NSWorkspace.willSleepNotification, NSWorkspace.sessionDidResignActiveNotification,
      NSWorkspace.screensDidSleepNotification,
    ] {
      observers.append(
        NSWorkspace.shared.notificationCenter.addObserver(forName: name, object: nil, queue: .main)
        { [weak self] _ in
          self?.deactivate()
          self?.activation.reset()
        })
    }
  }

  private func startTimers() {
    permissionTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
      self?.refreshPermission()
    }
    let timer = Timer(timeInterval: 1 / 120, repeats: true) { [weak self] _ in self?.tick() }
    timer.tolerance = 0.002
    RunLoop.main.add(timer, forMode: .common)
    self.timer = timer
  }

  func requestPermission() {
    let options =
      [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
    _ = AXIsProcessTrustedWithOptions(options)
    refreshPermission()
  }

  func openAccessibility() {
    NSWorkspace.shared.open(
      URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!)
  }

  func refreshPermission() {
    trusted = AXIsProcessTrusted()
    if trusted {
      eventTap.start { [weak self] type, event in
        self?.handle(type: type, event: event) ?? false
      }
      eventTap.enable()
      connected = eventTap.isEnabled
    } else {
      deactivate()
      eventTap.stop()
      connected = false
    }
  }

  func toggle() { active ? deactivate() : activate() }
  func activate() {
    guard connected else { return }
    active = true
    lastInteraction = ProcessInfo.processInfo.systemUptime
    lastTick = lastInteraction
    updateBadge()
  }
  func deactivate() {
    // A matching up is required even when Escape, timeout, or a lost tap stops a drag.
    for button in [CGMouseButton.left, .right, .center] where input.holdsButton(button.rawValue) {
      pointer.postButton(button, down: false)
    }
    input.clear()
    pointer.resetScroll()
    active = false
    scrolling = false
    badge.hide()
  }
  func shutdown() {
    deactivate()
    eventTap.stop()
    timer?.invalidate()
    timer = nil
    permissionTimer?.invalidate()
    permissionTimer = nil
    for observer in observers { NSWorkspace.shared.notificationCenter.removeObserver(observer) }
    observers.removeAll()
  }

  private func handle(type: CGEventType, event: CGEvent) -> Bool {
    if type == .tapDisabledByTimeout || type == .tapDisabledByUserInput {
      deactivate()
      activation.reset()
      eventTap.enable()
      return false
    }
    guard event.getIntegerValueField(.eventSourceUserData) != PointerOutput.eventMarker else {
      return false
    }
    if type == .flagsChanged {
      handleModifiers(event.flags)
      return false
    }
    let key = UInt16(event.getIntegerValueField(.keyboardEventKeycode))
    if type == .keyUp { return releaseKey(key) }
    guard type == .keyDown else { return false }
    return pressKey(key)
  }

  private func handleModifiers(_ flags: CGEventFlags) {
    let config = preferences.configuration
    let relevant: CGEventFlags = [.maskCommand, .maskAlternate, .maskControl, .maskShift]
    let others = flags.intersection(relevant).subtracting(config.modifier.flag)
    let transition = activation.update(
      down: flags.contains(config.modifier.flag), otherModifiers: !others.isEmpty,
      now: ProcessInfo.processInfo.systemUptime, config: config)
    switch transition {
    case .toggle: toggle()
    case .activate: activate()
    case .deactivate: deactivate()
    case .none: break
    }
  }

  private func releaseKey(_ key: UInt16) -> Bool {
    let released = input.release(key)
    if let button = released.action?.button, !input.holdsButton(button.rawValue) {
      pointer.postButton(button, down: false)
    }
    if active { lastInteraction = ProcessInfo.processInfo.systemUptime }
    return released.consumed
  }

  private func pressKey(_ key: UInt16) -> Bool {
    let config = preferences.configuration
    activation.interrupt()
    guard active else { return input.isSwallowed(key) }
    lastInteraction = ProcessInfo.processInfo.systemUptime
    if key == 53 && config.escapeCancels {
      input.swallow(key)
      deactivate()
      return true
    }
    guard let action = config.action(for: key) else { return false }
    let alreadyHeld = action.button.map { input.holdsButton($0.rawValue) } ?? false
    if input.press(key, action: action), let button = action.button, !alreadyHeld {
      pointer.postButton(button, down: true)
    }
    return true
  }

  private func tick() {
    guard active else { return }
    let now = ProcessInfo.processInfo.systemUptime
    let dt = min(0.05, max(0, now - lastTick))
    lastTick = now
    let config = preferences.configuration
    if !input.pressed.isEmpty { lastInteraction = now }
    if config.timeoutEnabled && now - lastInteraction >= config.idleTimeout {
      deactivate()
      return
    }
    scrolling = input.contains(.scroll)
    pointer.update(input: input, configuration: config, elapsed: dt)
    updateBadge()
  }

  private func updateBadge() {
    guard preferences.configuration.showBadge, let point = CGEvent(source: nil)?.location else {
      badge.hide()
      return
    }
    badge.show(at: point, scrolling: scrolling)
  }
}
