import Combine

final class KeyBindingEditor: ObservableObject {
  @Published private(set) var message = "Click a keycap, then press a key. Escape cancels."

  func bind(_ action: MouseAction, to key: UInt16, in preferences: Preferences) {
    guard key != Configuration.spaceKey else {
      message = "Space always left-clicks. Choose another key."
      return
    }
    let existing = preferences.configuration.bindings.first {
      $0.value == key && $0.key != action
    }?.key
    preferences.configuration.bind(action, to: key)
    message =
      existing.map {
        "Swapped \(action.title.lowercased()) and \($0.title.lowercased())."
      } ?? "\(action.title) set to \(KeyChoice.title(for: key))."
  }

  func reset(in preferences: Preferences) {
    preferences.configuration.bindings = Configuration.defaultBindings
    message = "Keys restored to defaults."
  }
}
