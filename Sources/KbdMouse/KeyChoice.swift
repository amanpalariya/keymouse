import Foundation

struct KeyChoice: Identifiable {
  let id: UInt16
  let title: String
  // Physical keys keep controls predictable across input languages.
  static let all: [KeyChoice] = [
    .init(id: 49, title: "Space"),
    .init(id: 0, title: "A"), .init(id: 11, title: "B"), .init(id: 8, title: "C"),
    .init(id: 2, title: "D"), .init(id: 14, title: "E"), .init(id: 3, title: "F"),
    .init(id: 5, title: "G"), .init(id: 4, title: "H"), .init(id: 34, title: "I"),
    .init(id: 38, title: "J"), .init(id: 40, title: "K"), .init(id: 37, title: "L"),
    .init(id: 46, title: "M"), .init(id: 45, title: "N"), .init(id: 31, title: "O"),
    .init(id: 35, title: "P"), .init(id: 12, title: "Q"), .init(id: 15, title: "R"),
    .init(id: 1, title: "S"), .init(id: 17, title: "T"), .init(id: 32, title: "U"),
    .init(id: 9, title: "V"), .init(id: 13, title: "W"), .init(id: 7, title: "X"),
    .init(id: 16, title: "Y"), .init(id: 6, title: "Z"),
    .init(id: 18, title: "1"), .init(id: 19, title: "2"), .init(id: 20, title: "3"),
    .init(id: 21, title: "4"), .init(id: 23, title: "5"), .init(id: 22, title: "6"),
    .init(id: 26, title: "7"), .init(id: 28, title: "8"), .init(id: 25, title: "9"),
    .init(id: 29, title: "0"), .init(id: 43, title: ","), .init(id: 47, title: "."),
    .init(id: 44, title: "/"), .init(id: 41, title: ";"), .init(id: 39, title: "'"),
    .init(id: 33, title: "["), .init(id: 30, title: "]"), .init(id: 42, title: "\\"),
    .init(id: 27, title: "−"), .init(id: 24, title: "="), .init(id: 50, title: "`"),
    .init(id: 48, title: "Tab"), .init(id: 36, title: "Return"), .init(id: 51, title: "Delete"),
  ]
  static func title(for code: UInt16) -> String {
    let special: [UInt16: String] = [
      123: "←", 124: "→", 125: "↓", 126: "↑",
      122: "F1", 120: "F2", 99: "F3", 118: "F4", 96: "F5", 97: "F6",
      98: "F7", 100: "F8", 101: "F9", 109: "F10", 103: "F11", 111: "F12",
    ]
    return special[code] ?? all.first { $0.id == code }?.title ?? "Key \(code)"
  }
}
