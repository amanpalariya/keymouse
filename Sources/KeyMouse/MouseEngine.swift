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
  private var permissionTimer: Timer?
  private var subscriptions = Set<AnyCancellable>()
  private var observers: [NSObjectProtocol] = []
  private var input = InputState()
  private var activation = ActivationState()
  private var recordingBinding = false
  private var lastInteraction = ProcessInfo.processInfo.systemUptime
  private let badge = CursorBadge()
  private let pointer = PointerOutput()
  private lazy var frames = DisplayRefreshLoop { [weak self] elapsed in
    self?.tick(elapsed: elapsed)
  }

  init(preferences: Preferences) {
    self.preferences = preferences
  }

  func start() {
    guard permissionTimer == nil else { return }
    observeConfiguration()
    observeSessionChanges()
    startPermissionPolling()
    observeDisplayChanges()
    refreshPermission()
  }

  private func observeDisplayChanges() {
    pointer.refreshDisplays()
    observers.append(
      NotificationCenter.default.addObserver(
        forName: NSApplication.didChangeScreenParametersNotification, object: nil, queue: .main
      ) { [weak self] _ in
        self?.pointer.refreshDisplays()
        self?.frames.stop()
        if let self, self.active, let point = self.pointer.position {
          self.frames.followCursor(at: point)
        }
      })
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

  private func startPermissionPolling() {
    let permissionTimer = Timer(timeInterval: 1, repeats: true) { [weak self] _ in
      self?.refreshPermission()
    }
    RunLoop.main.add(permissionTimer, forMode: .common)
    self.permissionTimer = permissionTimer
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
    let hasPermission = AXIsProcessTrusted()
    if trusted != hasPermission { trusted = hasPermission }
    if trusted {
      eventTap.start { [weak self] type, event in
        self?.handle(type: type, event: event) ?? false
      }
      eventTap.enable()
      if connected != eventTap.isEnabled { connected = eventTap.isEnabled }
    } else {
      if active { deactivate() }
      eventTap.stop()
      if connected { connected = false }
    }
  }

  func reconnect() {
    deactivate()
    activation.reset()
    eventTap.stop()
    start()
    refreshPermission()
  }

  func toggle() { active ? deactivate() : activate() }

  func setRecordingBinding(_ recording: Bool) {
    recordingBinding = recording
    activation.reset()
    if recording { deactivate() }
  }
  func activate() {
    guard connected else { return }
    active = true
    lastInteraction = ProcessInfo.processInfo.systemUptime
    guard let point = CGEvent(source: nil)?.location else {
      active = false
      return
    }
    pointer.synchronize(to: point)
    frames.followCursor(at: point)
    updateBadge()
  }
  func deactivate() {
    // A matching up is required even when Escape, timeout, or a lost tap stops a drag.
    for button in [CGMouseButton.left, .right, .center] where input.holdsButton(button.rawValue) {
      pointer.postButton(button, down: false)
    }
    input.clear()
    frames.stop()
    pointer.resetScroll()
    active = false
    scrolling = false
    badge.hide()
  }
  func shutdown() {
    deactivate()
    eventTap.stop()
    permissionTimer?.invalidate()
    permissionTimer = nil
    subscriptions.removeAll()
    for observer in observers {
      NSWorkspace.shared.notificationCenter.removeObserver(observer)
      NotificationCenter.default.removeObserver(observer)
    }
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
    if [.mouseMoved, .leftMouseDragged, .rightMouseDragged, .otherMouseDragged].contains(type) {
      pointer.synchronize(to: event.location)
      return false
    }
    if type == .flagsChanged {
      guard !recordingBinding else { return false }
      handleModifiers(event.flags)
      handleModifierBinding(event)
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
    case .none: break
    }
  }

  private func handleModifierBinding(_ event: CGEvent) {
    let key = UInt16(event.getIntegerValueField(.keyboardEventKeycode))
    guard let modifier = ActivationModifier.forKey(key) else { return }
    if event.flags.contains(modifier.flag) {
      _ = pressKey(modifier.keyCode, interruptActivation: false)
    } else {
      _ = releaseKey(modifier.keyCode)
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

  private func pressKey(_ key: UInt16, interruptActivation: Bool = true) -> Bool {
    let config = preferences.configuration
    if interruptActivation { activation.interrupt() }
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

  private func tick(elapsed: TimeInterval) {
    guard active else { return }
    let now = ProcessInfo.processInfo.systemUptime
    let config = preferences.configuration
    if !input.pressed.isEmpty { lastInteraction = now }
    if config.timeoutEnabled && now - lastInteraction >= config.idleTimeout {
      deactivate()
      return
    }
    let isScrolling = input.contains(.scroll)
    if scrolling != isScrolling { scrolling = isScrolling }
    pointer.update(input: input, configuration: config, elapsed: elapsed)
    if let point = pointer.position { frames.followCursor(at: point) }
    updateBadge()
  }

  private func updateBadge() {
    guard preferences.configuration.showBadge, let point = pointer.position else {
      badge.hide()
      return
    }
    badge.show(at: point)
  }
}
