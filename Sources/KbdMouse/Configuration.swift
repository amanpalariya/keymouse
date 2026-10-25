import AppKit

enum MouseAction: String, Codable, CaseIterable, Identifiable {
  case left, down, up, right, primary, alternatePrimary, middle, secondary, fast, slow, scroll
  var id: String { rawValue }
  var title: String {
    switch self {
    case .left: "Move left"
    case .down: "Move down"
    case .up: "Move up"
    case .right: "Move right"
    case .primary: "Left click"
    case .alternatePrimary: "Left click · alternate"
    case .middle: "Middle click"
    case .secondary: "Right click"
    case .fast: "Speed up"
    case .slow: "Slow down"
    case .scroll: "Scroll"
    }
  }
  var button: CGMouseButton? {
    switch self {
    case .primary, .alternatePrimary: .left
    case .middle: .center
    case .secondary: .right
    default: nil
    }
  }
}

enum ActivationModifier: String, Codable, CaseIterable, Identifiable {
  case option, command, control, shift
  var id: String { rawValue }
  var title: String { rawValue.capitalized }
  var flag: CGEventFlags {
    switch self {
    case .option: .maskAlternate
    case .command: .maskCommand
    case .control: .maskControl
    case .shift: .maskShift
    }
  }
}

enum ActivationGesture: String, Codable, CaseIterable, Identifiable {
  case doubleTap, tap, hold
  var id: String { rawValue }
  var title: String {
    switch self {
    case .doubleTap: "Double tap"
    case .tap: "Tap"
    case .hold: "Hold"
    }
  }
}

struct Configuration: Codable, Equatable {
  var modifier: ActivationModifier = .option
  var gesture: ActivationGesture = .doubleTap
  var doubleTapInterval: Double = 0.35
  var escapeCancels = true
  var timeoutEnabled = true
  var idleTimeout: Double = 30
  var showBadge = true
  var arrowsEnabled = true
  var moveSpeed: Double = 650
  var scrollSpeed: Double = 650
  var fastMultiplier: Double = 3
  var slowMultiplier: Double = 0.25
  var reverseScroll = false
  var bindings: [MouseAction: UInt16] = Self.defaultBindings

  static let defaultBindings: [MouseAction: UInt16] = [
    .left: 4, .down: 38, .up: 40, .right: 37,
    .primary: 49, .alternatePrimary: 13, .middle: 14, .secondary: 15,
    .fast: 0, .slow: 1, .scroll: 3,
  ]

  func action(for key: UInt16) -> MouseAction? {
    if arrowsEnabled, let action = Self.arrows[key] { return action }
    return bindings.first(where: { $0.value == key })?.key
  }

  static let arrows: [UInt16: MouseAction] = [123: .left, 124: .right, 125: .down, 126: .up]

  mutating func bind(_ action: MouseAction, to key: UInt16) {
    if let other = bindings.first(where: { $0.value == key && $0.key != action })?.key {
      bindings[other] = bindings[action]
    }
    bindings[action] = key
  }
}
