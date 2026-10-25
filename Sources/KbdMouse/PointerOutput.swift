import AppKit

/// The only component that creates and posts synthetic mouse events.
final class PointerOutput {
  static let eventMarker: Int64 = 0x4B42_444D
  private let source = CGEventSource(stateID: .hidSystemState)
  private var scrollRemainder = CGVector.zero
  private var clickCounts: [UInt32: Int64] = [:]
  private var lastClicks: [UInt32: (time: TimeInterval, point: CGPoint)] = [:]

  func resetScroll() { scrollRemainder = .zero }

  func update(input: InputState, configuration config: Configuration, elapsed dt: TimeInterval) {
    let multiplier = input.speedMultiplier(config)
    if input.contains(.scroll) {
      scroll(
        direction: input.direction, speed: config.scrollSpeed * multiplier * dt,
        reversed: config.reverseScroll)
    } else {
      resetScroll()
      move(input: input, distance: config.moveSpeed * multiplier * dt)
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
    guard direction != .zero, let current = CGEvent(source: nil)?.location else { return }
    let next = clamped(
      CGPoint(
        x: current.x + direction.dx * distance,
        y: current.y + direction.dy * distance))
    let button = heldButton(in: input)
    let type = movementType(for: button)
    let event = CGEvent(
      mouseEventSource: source, mouseType: type, mouseCursorPosition: next,
      mouseButton: button ?? .left)
    event?.setIntegerValueField(.mouseEventDeltaX, value: Int64((next.x - current.x).rounded()))
    event?.setIntegerValueField(.mouseEventDeltaY, value: Int64((next.y - current.y).rounded()))
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

  private func clamped(_ point: CGPoint) -> CGPoint {
    let bounds = NSScreen.screens.compactMap { screen -> CGRect? in
      guard let id = screen.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? UInt32
      else { return nil }
      return CGDisplayBounds(id)
    }
    if bounds.contains(where: { $0.contains(point) }) { return point }
    return bounds.map {
      CGPoint(
        x: min(max(point.x, $0.minX), $0.maxX - 1), y: min(max(point.y, $0.minY), $0.maxY - 1))
    }.min { hypot($0.x - point.x, $0.y - point.y) < hypot($1.x - point.x, $1.y - point.y) } ?? point
  }

  func postButton(_ button: CGMouseButton, down: Bool) {
    guard let point = CGEvent(source: nil)?.location else { return }
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
