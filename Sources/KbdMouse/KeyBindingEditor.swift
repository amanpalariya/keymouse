import Combine

struct BindingConflict: Equatable {
  let action: MouseAction
  let key: UInt16
  let owner: MouseAction

  var message: String {
    if key == Configuration.spaceKey {
      return "Space is fixed to left click. Choose another key."
    }
    return
      "\(KeyChoice.title(for: key)) is assigned to \(owner.title.lowercased()). Choose another key."
  }
}

final class KeyBindingEditor: ObservableObject {
  @Published private(set) var conflict: BindingConflict?

  func bind(_ action: MouseAction, to key: UInt16, in preferences: Preferences) {
    let key = ActivationModifier.forKey(key)?.keyCode ?? key
    let existing =
      key == Configuration.spaceKey
      ? MouseAction.primary
      : preferences.configuration.bindings.first {
        $0.value == key && $0.key != action
      }?.key
    if let existing {
      conflict = BindingConflict(action: action, key: key, owner: existing)
      return
    }
    guard preferences.configuration.bind(action, to: key) else { return }
    conflict = nil
  }

  func dismissConflict() { conflict = nil }

  func reset(in preferences: Preferences) {
    preferences.configuration.bindings = Configuration.defaultBindings
    conflict = nil
  }
}
