import Foundation

enum DefaultsMigration {
  // Compatibility with the previous bundle identifier; never used for the new app's identity.
  private static let legacyDomain = "com.aman.kbdmouse"
  private static let migrationKey = "migratedLegacyPreferences"

  static func importLegacyIfNeeded(into defaults: UserDefaults, legacy: [String: Any]? = nil) {
    guard !defaults.bool(forKey: migrationKey) else { return }
    let saved = legacy ?? defaults.persistentDomain(forName: legacyDomain) ?? [:]
    for key in ["configuration.v1", "showMenuBarIcon"] where defaults.object(forKey: key) == nil {
      if let value = saved[key] { defaults.set(value, forKey: key) }
    }
    // Login registration belongs to the new bundle and must be performed again.
    defaults.set(true, forKey: migrationKey)
  }
}
