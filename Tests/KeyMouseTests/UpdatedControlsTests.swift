import XCTest

@testable import KeyMouse

final class UpdatedControlsTests: XCTestCase {
  func testNewDefaultsAndFixedSpaceShortcut() {
    var config = Configuration()
    XCTAssertEqual(config.action(for: 3), .fast)
    XCTAssertEqual(config.action(for: 2), .slow)
    XCTAssertEqual(config.action(for: 56), .scroll)
    XCTAssertEqual(config.action(for: 60), .scroll)
    XCTAssertEqual(config.action(for: 49), .primary)
    XCTAssertEqual(config.action(for: 13), .primary)
    config.bind(.secondary, to: 49)
    XCTAssertEqual(config.bindings[.secondary], 15)
    XCTAssertEqual(config.action(for: 49), .primary)
    XCTAssertEqual(ActivationGesture.allCases.count, 2)
  }

  func testLegacyDefaultsMigrateWithoutDuplicateLeftClick() throws {
    let legacy: [String: Any] = [
      "gesture": "hold", "modifier": "command",
      "bindings": ["primary", 49, "alternatePrimary", 13, "fast", 0, "slow", 1, "scroll", 3],
      "acceleration": ["enabled": true, "rampTime": 0.6, "initialSpeed": 0.2],
    ]
    let config = try JSONDecoder().decode(
      Configuration.self,
      from: JSONSerialization.data(withJSONObject: legacy))
    XCTAssertEqual(config.gesture, .tap)
    XCTAssertEqual(config.modifier, .command)
    XCTAssertEqual(config.bindings[.primary], 13)
    XCTAssertEqual(config.bindings[.fast], 3)
    XCTAssertEqual(config.bindings[.slow], 2)
    XCTAssertEqual(config.bindings[.scroll], 56)
    XCTAssertEqual(config.bindings.count, MouseAction.allCases.count)
    XCTAssertTrue(config.acceleration.decelerationEnabled)
    XCTAssertEqual(config.acceleration.rampTime, 0.6)
  }

  func testCustomBindingsSurviveMigration() throws {
    let legacy: [String: Any] = [
      "bindings": [
        "primary", 12, "alternatePrimary", 13,
        "fast", 5, "slow", 1, "scroll", 3,
      ]
    ]
    let config = try JSONDecoder().decode(
      Configuration.self,
      from: JSONSerialization.data(withJSONObject: legacy))
    XCTAssertEqual(config.bindings[.primary], 12)
    XCTAssertEqual(config.bindings[.fast], 5)
    XCTAssertEqual(config.bindings[.slow], 1)
    XCTAssertEqual(config.bindings[.scroll], 3)
  }

  func testDecelerationSlowsAndStopsWithinConfiguredTime() {
    var profile = MotionAcceleration()
    var settings = AccelerationSettings()
    settings.enabled = false
    _ = profile.displacement(
      direction: CGVector(dx: 1, dy: 0), speed: 650, elapsed: 0.01, settings: settings)
    let first = profile.displacement(
      direction: .zero, speed: 650, elapsed: 0.02, settings: settings)
    let second = profile.displacement(
      direction: .zero, speed: 650, elapsed: 0.02, settings: settings)
    XCTAssertTrue(first.dx > second.dx && second.dx > 0)
    _ = profile.displacement(direction: .zero, speed: 650, elapsed: 0.2, settings: settings)
    XCTAssertEqual(
      profile.displacement(direction: .zero, speed: 650, elapsed: 0.02, settings: settings), .zero)
  }

  func testStoppingDistanceIsIndependentOfRefreshRate() {
    var settings = AccelerationSettings()
    settings.enabled = false
    for rate in [60, 120, 144] {
      var profile = MotionAcceleration()
      _ = profile.displacement(
        direction: CGVector(dx: 1, dy: 0), speed: 650, elapsed: 0.01, settings: settings)
      var distance = 0.0
      for _ in 0..<(Int(ceil(settings.stopTime * Double(rate))) + 2) {
        distance +=
          profile.displacement(
            direction: .zero, speed: 650, elapsed: 1 / Double(rate), settings: settings
          ).dx
      }
      XCTAssertEqual(distance, 650 * settings.stopTime / 2, accuracy: 0.0001)
    }
  }

  func testDecelerationCanBeDisabledAndResetStopsImmediately() {
    var profile = MotionAcceleration()
    var settings = AccelerationSettings()
    settings.decelerationEnabled = false
    _ = profile.displacement(
      direction: CGVector(dx: 1, dy: 0), speed: 650, elapsed: 1, settings: settings)
    XCTAssertEqual(
      profile.displacement(direction: .zero, speed: 650, elapsed: 0.02, settings: settings), .zero)
    settings.decelerationEnabled = true
    _ = profile.displacement(
      direction: CGVector(dx: 1, dy: 0), speed: 650, elapsed: 1, settings: settings)
    profile.reset()
    XCTAssertEqual(
      profile.displacement(direction: .zero, speed: 650, elapsed: 0.02, settings: settings), .zero)
  }

  func testPressingDirectionDuringBrakingResumesWithoutDroppingToInitialSpeed() {
    var profile = MotionAcceleration()
    let settings = AccelerationSettings()
    _ = profile.displacement(
      direction: CGVector(dx: 1, dy: 0), speed: 650, elapsed: 1, settings: settings)
    _ = profile.displacement(direction: .zero, speed: 650, elapsed: 0.03, settings: settings)
    let resumed = profile.displacement(
      direction: CGVector(dx: 1, dy: 0), speed: 650, elapsed: 0.01, settings: settings)
    XCTAssertTrue(resumed.dx > 650 * settings.initialSpeed * 0.01)
    XCTAssertTrue(resumed.dx <= 6.5)
  }
}
