import Combine
import SwiftUI

@main
struct KeyMouseApp: App {
  @NSApplicationDelegateAdaptor(AppDelegate.self) private var delegate

  var body: some Scene {
    Window("KeyMouse Settings", id: "settings") {
      SettingsWindow(delegate: delegate)
    }
    .windowResizability(.contentSize)
    .windowToolbarStyle(.expanded)
    .commands {
      CommandGroup(replacing: .appSettings) {
        OpenSettingsButton(title: "Settings…").keyboardShortcut(",")
      }
    }
  }
}

/// Owns the keyboard service independently of the settings window's lifetime.
final class AppDelegate: NSObject, NSApplicationDelegate {
  let preferences: Preferences
  let engine: MouseEngine
  let menuBar: MenuBarController
  let loginItem: LoginItem
  var reopenWindow: (() -> Void)?
  private var defaultsSubscription: AnyCancellable?

  override init() {
    DefaultsMigration.importLegacyIfNeeded(into: .standard)
    let preferences = Preferences()
    let engine = MouseEngine(preferences: preferences)
    self.preferences = preferences
    self.engine = engine
    menuBar = MenuBarController(engine: engine, preferences: preferences)
    loginItem = LoginItem()
    super.init()
  }

  func applicationDidFinishLaunching(_ notification: Notification) {
    engine.start()
    loginItem.configureDefault()
    menuBar.configure(isVisible: menuBarIsVisible) { [weak self] in
      self?.reopenWindow?()
    }
    defaultsSubscription = NotificationCenter.default.publisher(
      for: UserDefaults.didChangeNotification, object: UserDefaults.standard
    ).receive(on: RunLoop.main).sink { [weak self] _ in
      guard let self else { return }
      self.menuBar.setVisible(self.menuBarIsVisible)
    }
  }

  private var menuBarIsVisible: Bool {
    UserDefaults.standard.object(forKey: "showMenuBarIcon") as? Bool ?? true
  }

  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows: Bool) -> Bool {
    reopenWindow?()
    return true
  }

  func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { false }

  func applicationWillTerminate(_ notification: Notification) {
    defaultsSubscription = nil
    engine.shutdown()
  }
}

private struct SettingsWindow: View {
  let delegate: AppDelegate
  @Environment(\.openWindow) private var openWindow

  var body: some View {
    SettingsView(
      preferences: delegate.preferences, engine: delegate.engine, loginItem: delegate.loginItem)
      .onAppear {
        delegate.reopenWindow = {
          openWindow(id: "settings")
          NSApp.activate(ignoringOtherApps: true)
        }
      }
  }
}
