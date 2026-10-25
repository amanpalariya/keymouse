import Foundation

struct InputState {
  private(set) var pressed: [UInt16: MouseAction] = [:]
  // Retain swallowed keys until their real key-up, including after cancellation.
  private var swallowed: Set<UInt16> = []

  mutating func press(_ key: UInt16, action: MouseAction) -> Bool {
    swallowed.insert(key)
    guard pressed[key] == nil else { return false }
    pressed[key] = action
    return true
  }
  mutating func release(_ key: UInt16) -> (consumed: Bool, action: MouseAction?) {
    (swallowed.remove(key) != nil, pressed.removeValue(forKey: key))
  }
  mutating func swallow(_ key: UInt16) { swallowed.insert(key) }
  mutating func clear() { pressed.removeAll() }
  func isSwallowed(_ key: UInt16) -> Bool { swallowed.contains(key) }
  func contains(_ action: MouseAction) -> Bool { pressed.values.contains(action) }
  func holdsButton(_ button: UInt32) -> Bool {
    pressed.values.contains { $0.button?.rawValue == button }
  }

  var direction: CGVector {
    let x = (contains(.right) ? 1.0 : 0) - (contains(.left) ? 1.0 : 0)
    let y = (contains(.down) ? 1.0 : 0) - (contains(.up) ? 1.0 : 0)
    let length = max(1, hypot(x, y))
    return CGVector(dx: x / length, dy: y / length)
  }

  func speedMultiplier(_ config: Configuration) -> Double {
    (contains(.fast) ? config.fastMultiplier : 1) * (contains(.slow) ? config.slowMultiplier : 1)
  }
}

struct ActivationState {
  private var isDown = false
  private var candidate = false
  private var pressedAt: TimeInterval = 0
  private var lastTap: TimeInterval?

  mutating func interrupt() {
    candidate = false
    lastTap = nil
  }
  mutating func reset() { self = ActivationState() }

  enum Transition: Equatable { case none, toggle, activate, deactivate }
  mutating func update(down: Bool, otherModifiers: Bool, now: TimeInterval, config: Configuration)
    -> Transition
  {
    guard down != isDown else {
      if otherModifiers { interrupt() }
      return .none
    }
    isDown = down
    if down {
      candidate = !otherModifiers
      pressedAt = now
      return config.gesture == .hold && candidate ? .activate : .none
    }
    if config.gesture == .hold { return .deactivate }
    guard candidate, !otherModifiers, now - pressedAt < 0.4 else {
      interrupt()
      return .none
    }
    candidate = false
    if config.gesture == .tap { return .toggle }
    if let lastTap, now - lastTap <= config.doubleTapInterval {
      self.lastTap = nil
      return .toggle
    }
    lastTap = now
    return .none
  }
}
