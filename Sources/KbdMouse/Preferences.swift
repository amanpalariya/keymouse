import Combine
import Foundation

final class Preferences: ObservableObject {
  @Published var configuration: Configuration {
    didSet {
      if let data = try? JSONEncoder().encode(configuration) {
        UserDefaults.standard.set(data, forKey: Self.storageKey)
      }
    }
  }
  private static let storageKey = "configuration.v1"
  init() {
    configuration =
      UserDefaults.standard.data(forKey: Self.storageKey)
      .flatMap { try? JSONDecoder().decode(Configuration.self, from: $0) } ?? Configuration()
  }
}
