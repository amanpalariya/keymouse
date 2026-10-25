import AppKit

enum MouseAction: String, Codable, CaseIterable, Identifiable {
  case left, down, up, right, primary, middle, secondary, fast, slow, scroll
  var id: String { rawValue }
  var title: String {
    switch self {
    case .left: "Move left"
    case .down: "Move down"
    case .up: "Move up"
    case .right: "Move right"
    case .primary: "Left click"
    case .middle: "Middle click"
    case .secondary: "Right click"
    case .fast: "Speed up"
    case .slow: "Slow down"
    case .scroll: "Scroll"
    }
  }
  var button: CGMouseButton? {
    switch self {
    case .primary: .left
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
  var symbol: String {
    switch self {
    case .option: "⌥"
    case .command: "⌘"
    case .control: "⌃"
    case .shift: "⇧"
    }
  }
  var systemImage: String { rawValue }
  var keyCode: UInt16 {
    switch self {
    case .option: 58
    case .command: 55
    case .control: 59
    case .shift: 56
    }
  }
  static func forKey(_ key: UInt16) -> Self? {
    switch key {
    case 58, 61: .option
    case 55, 54: .command
    case 59, 62: .control
    case 56, 60: .shift
    default: nil
    }
  }
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
  case doubleTap, tap
  var id: String { rawValue }
  var title: String {
    switch self {
    case .doubleTap: "Double tap"
    case .tap: "Tap"
    }
  }
  init(from decoder: Decoder) throws {
    let value = try decoder.singleValueContainer().decode(String.self)
    self = Self(rawValue: value) ?? .tap
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
  var acceleration = AccelerationSettings()

  init() {}

  private enum CodingKeys: String, CodingKey {
    case modifier, gesture, doubleTapInterval, escapeCancels, timeoutEnabled, idleTimeout
    case showBadge, arrowsEnabled, moveSpeed, scrollSpeed, fastMultiplier, slowMultiplier
    case reverseScroll, bindings, acceleration
  }

  init(from decoder: Decoder) throws {
    self.init()
    let values = try decoder.container(keyedBy: CodingKeys.self)
    modifier = try values.decodeIfPresent(ActivationModifier.self, forKey: .modifier) ?? modifier
    gesture = try values.decodeIfPresent(ActivationGesture.self, forKey: .gesture) ?? gesture
    doubleTapInterval =
      try values.decodeIfPresent(Double.self, forKey: .doubleTapInterval) ?? doubleTapInterval
    escapeCancels = try values.decodeIfPresent(Bool.self, forKey: .escapeCancels) ?? escapeCancels
    timeoutEnabled =
      try values.decodeIfPresent(Bool.self, forKey: .timeoutEnabled) ?? timeoutEnabled
    idleTimeout = try values.decodeIfPresent(Double.self, forKey: .idleTimeout) ?? idleTimeout
    showBadge = try values.decodeIfPresent(Bool.self, forKey: .showBadge) ?? showBadge
    arrowsEnabled = try values.decodeIfPresent(Bool.self, forKey: .arrowsEnabled) ?? arrowsEnabled
    moveSpeed = try values.decodeIfPresent(Double.self, forKey: .moveSpeed) ?? moveSpeed
    scrollSpeed = try values.decodeIfPresent(Double.self, forKey: .scrollSpeed) ?? scrollSpeed
    fastMultiplier =
      try values.decodeIfPresent(Double.self, forKey: .fastMultiplier) ?? fastMultiplier
    slowMultiplier =
      try values.decodeIfPresent(Double.self, forKey: .slowMultiplier) ?? slowMultiplier
    reverseScroll = try values.decodeIfPresent(Bool.self, forKey: .reverseScroll) ?? reverseScroll
    if values.contains(.bindings) {
      var saved = try values.nestedUnkeyedContainer(forKey: .bindings)
      var legacy: [String: UInt16] = [:]
      while !saved.isAtEnd {
        let action = try saved.decode(String.self)
        legacy[action] = try saved.decode(UInt16.self)
      }
      bindings = Self.migratedBindings(legacy)
    }
    acceleration =
      try values.decodeIfPresent(AccelerationSettings.self, forKey: .acceleration) ?? acceleration
  }

  static let defaultBindings: [MouseAction: UInt16] = [
    .left: 4, .down: 38, .up: 40, .right: 37,
    .primary: 13, .middle: 14, .secondary: 15,
    .fast: 3, .slow: 2, .scroll: 56,
  ]

  static let spaceKey: UInt16 = 49

  mutating func resetMotion() {
    let defaults = Configuration()
    moveSpeed = defaults.moveSpeed
    scrollSpeed = defaults.scrollSpeed
    fastMultiplier = defaults.fastMultiplier
    slowMultiplier = defaults.slowMultiplier
    reverseScroll = defaults.reverseScroll
    acceleration = defaults.acceleration
  }

  func action(for key: UInt16) -> MouseAction? {
    if key == Self.spaceKey { return .primary }
    let key = ActivationModifier.forKey(key)?.keyCode ?? key
    if let action = bindings.first(where: { $0.value == key })?.key { return action }
    if arrowsEnabled, let action = Self.arrows[key] { return action }
    return nil
  }

  static let arrows: [UInt16: MouseAction] = [123: .left, 124: .right, 125: .down, 126: .up]

  @discardableResult
  mutating func bind(_ action: MouseAction, to key: UInt16) -> Bool {
    let key = ActivationModifier.forKey(key)?.keyCode ?? key
    guard key != Self.spaceKey,
      !bindings.contains(where: { $0.value == key && $0.key != action })
    else { return false }
    bindings[action] = key
    return true
  }
  private static func migratedBindings(_ saved: [String: UInt16]) -> [MouseAction: UInt16] {
    var saved = saved
    if saved["primary"] == spaceKey { saved["primary"] = saved["alternatePrimary"] }
    if saved["fast"] == 0 && saved["slow"] == 1 && saved["scroll"] == 3 {
      saved["fast"] = 3
      saved["slow"] = 2
      saved["scroll"] = 56
    }
    var result: [MouseAction: UInt16] = [:]
    var used: Set<UInt16> = [spaceKey]
    for action in MouseAction.allCases {
      let candidates = [saved[action.rawValue], defaultBindings[action]].compactMap { $0 }
      let key =
        candidates.first { !used.contains($0) }
        ?? (UInt16(0)..<spaceKey).first { !used.contains($0) }!
      result[action] = key
      used.insert(key)
    }
    return result
  }
}
