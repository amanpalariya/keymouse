import Combine
import Foundation

final class Preferences: ObservableObject {
  @Published var configuration: Configuration {
    didSet {
      if let data = try? JSONEncoder().encode(configuration) {
        defaults.set(data, forKey: Self.storageKey)
      }
    }
  }
  private static let storageKey = "configuration.v1"
  private let defaults: UserDefaults

  init(defaults: UserDefaults = .standard) {
    self.defaults = defaults
    configuration =
      defaults.data(forKey: Self.storageKey)
      .flatMap { try? JSONDecoder().decode(Configuration.self, from: $0) } ?? Configuration()
  }
}
