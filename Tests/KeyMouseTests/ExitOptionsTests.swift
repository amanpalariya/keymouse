import XCTest

@testable import KeyMouse

final class ExitOptionsTests: XCTestCase {
  func testExistingSettingsEnableBothExitOptions() throws {
    let config = try JSONDecoder().decode(
      Configuration.self, from: Data(#"{"escapeCancels":false,"moveSpeed":900}"#.utf8))
    XCTAssertTrue(config.exitOnUnboundKey)
    XCTAssertTrue(config.exitOnPointerMovement)
    XCTAssertFalse(config.escapeCancels)
    XCTAssertEqual(config.moveSpeed, 900)
  }

  func testExitOptionsPersistIndependently() throws {
    for unboundKey in [false, true] {
      for pointerMovement in [false, true] {
        var config = Configuration()
        config.exitOnUnboundKey = unboundKey
        config.exitOnPointerMovement = pointerMovement
        let restored = try JSONDecoder().decode(
          Configuration.self, from: JSONEncoder().encode(config))
        XCTAssertEqual(restored, config)
      }
    }
  }

  func testBindingsAndActivationKeysDoNotExit() {
    var config = Configuration()
    for key in Array(config.bindings.values) + [49, 60, 123, 124, 125, 126] {
      XCTAssertFalse(config.shouldExit(forUnboundKey: key), "Key \(key)")
    }
    for modifier in ActivationModifier.allCases {
      config.modifier = modifier
      XCTAssertFalse(config.shouldExit(forUnboundKey: modifier.keyCode))
      let rightKey: UInt16 = switch modifier {
      case .option: 61
      case .command: 54
      case .control: 62
      case .shift: 60
      }
      XCTAssertFalse(config.shouldExit(forUnboundKey: rightKey))
    }
  }

  func testExitFollowsCustomBindingsAndArrowSetting() {
    var config = Configuration()
    XCTAssertTrue(config.shouldExit(forUnboundKey: 0))
    XCTAssertTrue(config.shouldExit(forUnboundKey: 55))
    XCTAssertTrue(config.shouldExit(forUnboundKey: 57))
    XCTAssertTrue(config.shouldExit(forUnboundKey: 63))
    XCTAssertTrue(config.bind(.left, to: 0))
    XCTAssertFalse(config.shouldExit(forUnboundKey: 0))
    XCTAssertTrue(config.shouldExit(forUnboundKey: 4))
    config.arrowsEnabled = false
    XCTAssertTrue(config.shouldExit(forUnboundKey: 123))
    config.exitOnUnboundKey = false
    for key: UInt16 in [4, 55, 57, 63, 123] {
      XCTAssertFalse(config.shouldExit(forUnboundKey: key))
    }
  }
}
