import AppKit

/// The only component that creates and posts synthetic mouse events.
final class PointerOutput {
  static let eventMarker: Int64 = 0x4B42_444D
  private let source = CGEventSource(stateID: .hidSystemState)
  private var scrollRemainder = CGVector.zero
  private var motion = CursorMotion()
  private var acceleration = MotionAcceleration()
  private var displays: [CGRect] = []
  private var clickCounts: [UInt32: Int64] = [:]
  private var lastClicks: [UInt32: (time: TimeInterval, point: CGPoint)] = [:]

  func resetScroll() { scrollRemainder = .zero }

  var position: CGPoint? { motion.position }

  func synchronize(to point: CGPoint) {
    motion.synchronize(to: point)
    acceleration.reset()
  }

  func refreshDisplays() {
    displays = NSScreen.screens.compactMap(\.displayID).map { CGDisplayBounds($0) }
  }

  func update(input: InputState, configuration config: Configuration, elapsed dt: TimeInterval) {
    let multiplier = input.speedMultiplier(config)
    if input.contains(.scroll) {
      acceleration.reset()
      scroll(
        direction: input.direction, speed: config.scrollSpeed * multiplier * dt,
        reversed: config.reverseScroll)
    } else {
      resetScroll()
      let distance = acceleration.distance(
        direction: input.direction,
        speed: config.moveSpeed * multiplier, elapsed: dt, settings: config.acceleration)
      move(input: input, distance: distance)
    }
  }

  private func scroll(direction: CGVector, speed: Double, reversed: Bool) {
    let sign = reversed ? -1.0 : 1.0
    scrollRemainder.dx += -direction.dx * speed * sign
    scrollRemainder.dy += -direction.dy * speed * sign
    let x = Int32(scrollRemainder.dx.rounded(.towardZero))
    let y = Int32(scrollRemainder.dy.rounded(.towardZero))
    if x != 0 || y != 0 {
      post(
        CGEvent(
          scrollWheelEvent2Source: source, units: .pixel, wheelCount: 2, wheel1: y, wheel2: x,
          wheel3: 0))
      scrollRemainder.dx -= Double(x)
      scrollRemainder.dy -= Double(y)
    }
  }

  private func move(input: InputState, distance: Double) {
    let direction = input.direction
    guard direction != .zero,
      let next = motion.advance(direction: direction, distance: distance, displays: displays)
    else { return }
    let button = heldButton(in: input)
    let type = movementType(for: button)
    let event = CGEvent(
      mouseEventSource: source, mouseType: type, mouseCursorPosition: next,
      mouseButton: button ?? .left)
    post(event)
  }

  private func heldButton(in input: InputState) -> CGMouseButton? {
    [.left, .right, .center].first { input.holdsButton($0.rawValue) }
  }

  private func movementType(for button: CGMouseButton?) -> CGEventType {
    switch button {
    case .left: return .leftMouseDragged
    case .right: return .rightMouseDragged
    case .center: return .otherMouseDragged
    default: return .mouseMoved
    }
  }

  func postButton(_ button: CGMouseButton, down: Bool) {
    guard let point = position else { return }
    let type: CGEventType
    switch button {
    case .left: type = down ? .leftMouseDown : .leftMouseUp
    case .right: type = down ? .rightMouseDown : .rightMouseUp
    default: type = down ? .otherMouseDown : .otherMouseUp
    }
    if down { updateClickCount(for: button, at: point) }
    let event = CGEvent(
      mouseEventSource: source, mouseType: type, mouseCursorPosition: point, mouseButton: button)
    event?.setIntegerValueField(.mouseEventClickState, value: clickCounts[button.rawValue] ?? 1)
    post(event)
  }

  private func updateClickCount(for button: CGMouseButton, at point: CGPoint) {
    let now = ProcessInfo.processInfo.systemUptime
    if let last = lastClicks[button.rawValue], now - last.time <= NSEvent.doubleClickInterval,
      hypot(point.x - last.point.x, point.y - last.point.y) < 4
    {
      clickCounts[button.rawValue] = (clickCounts[button.rawValue] ?? 1) + 1
    } else {
      clickCounts[button.rawValue] = 1
    }
    lastClicks[button.rawValue] = (now, point)
  }

  private func post(_ event: CGEvent?) {
    event?.flags = []
    event?.setIntegerValueField(.eventSourceUserData, value: Self.eventMarker)
    event?.post(tap: .cghidEventTap)
  }

}
