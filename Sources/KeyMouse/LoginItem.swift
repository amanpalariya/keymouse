import Combine
import Foundation
import ServiceManagement

/// Keeps the setting aligned with macOS, including changes made in System Settings.
final class LoginItem: ObservableObject {
  @Published private(set) var enabled = false
  @Published private(set) var needsApproval = false
  @Published private(set) var errorMessage: String?

  private let service: SMAppService
  private let defaults: UserDefaults
  private static let configuredKey = "loginItemConfigured"

  init(service: SMAppService = .mainApp, defaults: UserDefaults = .standard) {
    self.service = service
    self.defaults = defaults
  }

  func configureDefault() {
    guard !defaults.bool(forKey: Self.configuredKey) else {
      refresh()
      return
    }
    // Register once. Never undo a later choice made by the user in macOS settings.
    defaults.set(true, forKey: Self.configuredKey)
    setEnabled(true)
  }

  func refresh() {
    enabled = service.status == .enabled || service.status == .requiresApproval
    needsApproval = service.status == .requiresApproval
  }

  func setEnabled(_ enabled: Bool) {
    errorMessage = nil
    do {
      if enabled && service.status != .enabled && service.status != .requiresApproval {
        try service.register()
      } else if !enabled && service.status != .notRegistered {
        try service.unregister()
      }
    } catch {
      errorMessage = error.localizedDescription
    }
    defaults.set(true, forKey: Self.configuredKey)
    refresh()
  }

  func openSystemSettings() { SMAppService.openSystemSettingsLoginItems() }
}
