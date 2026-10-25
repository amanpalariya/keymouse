import XCTest

@testable import KeyMouse

final class BindingConflictTests: XCTestCase {
  func testConflictDoesNotChangeEitherBinding() {
    withPreferences { preferences in
      let editor = KeyBindingEditor()
      let original = preferences.configuration
      editor.bind(.left, to: 38, in: preferences)
      XCTAssertEqual(preferences.configuration, original)
      XCTAssertEqual(editor.conflict, BindingConflict(action: .left, key: 38, owner: .down))
    }
  }

  func testFreeKeyCommitsAndClearsPreviousConflict() {
    withPreferences { preferences in
      let editor = KeyBindingEditor()
      editor.bind(.left, to: 38, in: preferences)
      editor.bind(.left, to: 12, in: preferences)
      XCTAssertNil(editor.conflict)
      XCTAssertEqual(preferences.configuration.bindings[.left], 12)
      XCTAssertEqual(preferences.configuration.bindings[.down], 38)
    }
  }

  func testSpaceAndRightShiftConflictsAreReported() {
    withPreferences { preferences in
      let editor = KeyBindingEditor()
      editor.bind(.left, to: 49, in: preferences)
      XCTAssertEqual(editor.conflict?.owner, .primary)
      editor.bind(.fast, to: 60, in: preferences)
      XCTAssertEqual(editor.conflict?.owner, .scroll)
      XCTAssertEqual(preferences.configuration.bindings[.fast], 3)
      editor.dismissConflict()
      XCTAssertNil(editor.conflict)
    }
  }

  private func withPreferences(_ test: (Preferences) -> Void) {
    let name = "KeyMouseTests.\(UUID().uuidString)"
    let defaults = UserDefaults(suiteName: name)!
    defer { defaults.removePersistentDomain(forName: name) }
    test(Preferences(defaults: defaults))
  }
}
