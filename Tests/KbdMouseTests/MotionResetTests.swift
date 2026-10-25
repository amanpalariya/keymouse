import XCTest

@testable import KbdMouse

final class MotionResetTests: XCTestCase {
  func testMotionResetKeepsBindingsAndGeneralSettings() {
    var expected = Configuration()
    expected.modifier = .command
    expected.gesture = .tap
    expected.bind(.left, to: 12)
    expected.idleTimeout = 90
    expected.showBadge = false

    var configuration = expected
    configuration.moveSpeed = 1500
    configuration.scrollSpeed = 1100
    configuration.fastMultiplier = 5
    configuration.slowMultiplier = 0.1
    configuration.reverseScroll = true
    configuration.acceleration.enabled = false
    configuration.acceleration.decelerationEnabled = false
    configuration.acceleration.rampTime = 0.9
    configuration.acceleration.stopTime = 0.3
    configuration.resetMotion()

    XCTAssertEqual(configuration, expected)
  }
}
