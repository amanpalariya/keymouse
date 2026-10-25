import XCTest

@testable import KeyMouse

final class AccelerationTests: XCTestCase {
  private let right = CGVector(dx: 1, dy: 0)

  func testStartsGentlyAndReachesFullSpeed() {
    var motion = MotionAcceleration()
    let settings = AccelerationSettings()
    let first = motion.distance(direction: right, speed: 650, elapsed: 0.05, settings: settings)
    XCTAssertTrue(first < 650 * 0.05 * 0.3)
    _ = motion.distance(direction: right, speed: 650, elapsed: 0.5, settings: settings)
    let steady = motion.distance(direction: right, speed: 650, elapsed: 0.05, settings: settings)
    XCTAssertEqual(steady, 32.5, accuracy: 0.0001)
  }

  func testDisabledAccelerationUsesConstantSpeed() {
    var motion = MotionAcceleration()
    var settings = AccelerationSettings()
    settings.enabled = false
    XCTAssertEqual(
      motion.distance(direction: right, speed: 650, elapsed: 0.1, settings: settings), 65)
  }

  func testAccelerationTravelIsIndependentOfRefreshRate() {
    let settings = AccelerationSettings()
    let expected = 650 * (1 - settings.rampTime * (1 - settings.initialSpeed) / 2)
    for refreshRate in [60, 120, 144] {
      var motion = MotionAcceleration()
      var distance = 0.0
      for _ in 0..<refreshRate {
        distance += motion.distance(
          direction: right, speed: 650,
          elapsed: 1 / Double(refreshRate), settings: settings)
      }
      XCTAssertEqual(distance, expected, accuracy: 0.0001)
    }
  }

  func testReleasingOrReversingRestartsAcceleration() {
    var motion = MotionAcceleration()
    let settings = AccelerationSettings()
    let first = motion.distance(direction: right, speed: 650, elapsed: 0.05, settings: settings)
    _ = motion.distance(direction: right, speed: 650, elapsed: 1, settings: settings)
    _ = motion.distance(direction: .zero, speed: 650, elapsed: 0.05, settings: settings)
    XCTAssertEqual(
      motion.distance(direction: right, speed: 650, elapsed: 0.05, settings: settings), first)
    _ = motion.distance(direction: right, speed: 650, elapsed: 1, settings: settings)
    XCTAssertEqual(
      motion.distance(
        direction: CGVector(dx: -1, dy: 0), speed: 650,
        elapsed: 0.05, settings: settings), first)
  }

  func testOldSettingsKeepTheirBindingsWhenAccelerationIsAdded() throws {
    var old = Configuration()
    old.modifier = .command
    old.gesture = .tap
    old.moveSpeed = 900
    old.bind(.primary, to: 12)
    let encoded = try JSONEncoder().encode(old)
    var json = try JSONSerialization.jsonObject(with: encoded) as! [String: Any]
    json.removeValue(forKey: "acceleration")
    let decoded = try JSONDecoder().decode(
      Configuration.self,
      from: JSONSerialization.data(withJSONObject: json))
    XCTAssertEqual(decoded, old)
  }

  func testRecordedArrowBindingOverridesMovementAlias() {
    var configuration = Configuration()
    configuration.bind(.secondary, to: 123)
    XCTAssertEqual(configuration.action(for: 123), .secondary)
  }
}
