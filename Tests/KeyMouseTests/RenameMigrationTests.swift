import XCTest

@testable import KeyMouse

final class RenameMigrationTests: XCTestCase {
  func testRenameImportsSettingsWithoutCopyingOldLoginRegistration() throws {
    try withDefaults { defaults in
      var configuration = Configuration()
      configuration.modifier = .command
      configuration.moveSpeed = 920
      configuration.bind(.slow, to: 1)
      let data = try JSONEncoder().encode(configuration)
      DefaultsMigration.importLegacyIfNeeded(
        into: defaults,
        legacy: [
          "configuration.v1": data, "showMenuBarIcon": false, "loginItemConfigured": true,
        ])
      XCTAssertEqual(Preferences(defaults: defaults).configuration, configuration)
      XCTAssertFalse(defaults.bool(forKey: "showMenuBarIcon"))
      XCTAssertNil(defaults.object(forKey: "loginItemConfigured"))
    }
  }

  func testRenameDoesNotOverwriteNewSettings() throws {
    try withDefaults { defaults in
      var configuration = Configuration()
      configuration.moveSpeed = 880
      let data = try JSONEncoder().encode(configuration)
      defaults.set(data, forKey: "configuration.v1")
      DefaultsMigration.importLegacyIfNeeded(
        into: defaults,
        legacy: [
          "configuration.v1": try JSONEncoder().encode(Configuration())
        ])
      XCTAssertEqual(defaults.data(forKey: "configuration.v1"), data)
    }
  }

  func testSavedDoubleTapIntervalIsIgnored() throws {
    var saved =
      try JSONSerialization.jsonObject(with: JSONEncoder().encode(Configuration()))
      as! [String: Any]
    saved["gesture"] = ActivationGesture.doubleTap.rawValue
    saved["doubleTapInterval"] = 10
    let configuration = try JSONDecoder().decode(
      Configuration.self,
      from: JSONSerialization.data(withJSONObject: saved))
    let encoded =
      try JSONSerialization.jsonObject(with: JSONEncoder().encode(configuration)) as! [String: Any]
    XCTAssertNil(encoded["doubleTapInterval"])
    var activation = ActivationState()
    _ = activation.update(down: true, otherModifiers: false, now: 1, config: configuration)
    _ = activation.update(down: false, otherModifiers: false, now: 1.05, config: configuration)
    _ = activation.update(down: true, otherModifiers: false, now: 1.6, config: configuration)
    XCTAssertEqual(
      activation.update(down: false, otherModifiers: false, now: 1.65, config: configuration), .none
    )
  }

  private func withDefaults(_ test: (UserDefaults) throws -> Void) rethrows {
    let name = "KeyMouseTests.\(UUID().uuidString)"
    let defaults = UserDefaults(suiteName: name)!
    defer { defaults.removePersistentDomain(forName: name) }
    try test(defaults)
  }
}
