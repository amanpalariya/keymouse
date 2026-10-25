import XCTest

@testable import KbdMouse

final class InputTests: XCTestCase {
  func testCombinedSlowScrollAndDirection() {
    let config = Configuration()
    var state = InputState()
    for key: UInt16 in [1, 3, 38] { _ = state.press(key, action: config.action(for: key)!) }
    XCTAssertTrue(state.contains(.scroll))
    XCTAssertEqual(state.direction.dy, 1)
    XCTAssertEqual(state.direction.dx, 0)
    XCTAssertEqual(state.speedMultiplier(config), 0.25)
  }

  func testDiagonalSpeedAndOppositeKeys() {
    var state = InputState()
    _ = state.press(4, action: .left)
    _ = state.press(40, action: .up)
    XCTAssertEqual(hypot(state.direction.dx, state.direction.dy), 1, accuracy: 0.0001)
    _ = state.press(37, action: .right)
    XCTAssertEqual(state.direction.dx, 0)
    XCTAssertEqual(state.direction.dy, -1)
  }

  func testBothLeftButtonKeysStayHeldUntilBothRelease() {
    var state = InputState()
    XCTAssertTrue(state.press(49, action: .primary))
    XCTAssertFalse(state.press(49, action: .primary))
    _ = state.press(13, action: .alternatePrimary)
    XCTAssertTrue(state.release(49).consumed)
    XCTAssertTrue(state.holdsButton(0))
    _ = state.release(13)
    XCTAssertFalse(state.holdsButton(0))
  }

  func testCancellationStillSwallowsMatchingKeyUp() {
    var state = InputState()
    _ = state.press(49, action: .primary)
    state.clear()
    XCTAssertFalse(state.holdsButton(0))
    let released = state.release(49)
    XCTAssertTrue(released.consumed)
    XCTAssertNil(released.action)
    XCTAssertFalse(state.release(49).consumed)
  }

  func testBindingSwapAndArrowFallback() throws {
    var config = Configuration()
    config.bind(.left, to: 38)
    XCTAssertEqual(config.action(for: 38), .left)
    XCTAssertEqual(config.action(for: 4), .down)
    XCTAssertEqual(Set(config.bindings.values).count, MouseAction.allCases.count)
    XCTAssertEqual(config.action(for: 123), .left)
    config.arrowsEnabled = false
    XCTAssertNil(config.action(for: 123))
    XCTAssertEqual(
      try JSONDecoder().decode(Configuration.self, from: JSONEncoder().encode(config)), config)
  }

  func testDoubleTapRequiresTwoStandaloneTaps() {
    var activation = ActivationState()
    let config = Configuration()
    XCTAssertEqual(
      activation.update(down: true, otherModifiers: false, now: 1, config: config), .none)
    XCTAssertEqual(
      activation.update(down: false, otherModifiers: false, now: 1.05, config: config), .none)
    _ = activation.update(down: true, otherModifiers: false, now: 1.15, config: config)
    XCTAssertEqual(
      activation.update(down: false, otherModifiers: false, now: 1.2, config: config), .toggle)
  }

  func testShortcutDoesNotActivate() {
    var activation = ActivationState()
    var config = Configuration()
    config.gesture = .tap
    _ = activation.update(down: true, otherModifiers: false, now: 1, config: config)
    activation.interrupt()
    XCTAssertEqual(
      activation.update(down: false, otherModifiers: false, now: 1.1, config: config), .none)
    _ = activation.update(down: true, otherModifiers: true, now: 2, config: config)
    XCTAssertEqual(
      activation.update(down: false, otherModifiers: false, now: 2.1, config: config), .none)
  }

  func testHoldReleaseAndExpiredDoubleTap() {
    var activation = ActivationState()
    var config = Configuration()
    config.gesture = .hold
    XCTAssertEqual(
      activation.update(down: true, otherModifiers: false, now: 1, config: config), .activate)
    XCTAssertEqual(
      activation.update(down: false, otherModifiers: false, now: 2, config: config), .deactivate)
    config.gesture = .doubleTap
    _ = activation.update(down: true, otherModifiers: false, now: 3, config: config)
    _ = activation.update(down: false, otherModifiers: false, now: 3.1, config: config)
    _ = activation.update(down: true, otherModifiers: false, now: 4, config: config)
    XCTAssertEqual(
      activation.update(down: false, otherModifiers: false, now: 4.1, config: config), .none)
  }
}
