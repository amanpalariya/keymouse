import SwiftUI

@main
struct KeyMouseApp: App {
  @NSApplicationDelegateAdaptor(AppDelegate.self) private var delegate
  @StateObject private var preferences: Preferences
  @StateObject private var engine: MouseEngine
  @StateObject private var menuBar: MenuBarController
  @StateObject private var loginItem = LoginItem()
  @AppStorage("showMenuBarIcon") private var showMenuBarIcon = true

  init() {
    DefaultsMigration.importLegacyIfNeeded(into: .standard)
    let preferences = Preferences()
    let engine = MouseEngine(preferences: preferences)
    _preferences = StateObject(wrappedValue: preferences)
    _engine = StateObject(wrappedValue: engine)
    _menuBar = StateObject(wrappedValue: MenuBarController(engine: engine, preferences: preferences))
  }

  var body: some Scene {
    Window("Key Mouse Settings", id: "settings") {
      SettingsWindow(
        preferences: preferences, engine: engine, loginItem: loginItem, delegate: delegate,
        menuBar: menuBar, showMenuBarIcon: showMenuBarIcon)
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

final class AppDelegate: NSObject, NSApplicationDelegate {
  weak var engine: MouseEngine?
  var reopenWindow: (() -> Void)?

  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows: Bool) -> Bool {
    reopenWindow?()
    return true
  }

  func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { false }
  func applicationWillTerminate(_ notification: Notification) { engine?.shutdown() }
}

private struct SettingsWindow: View {
  let preferences: Preferences
  let engine: MouseEngine
  @ObservedObject var loginItem: LoginItem
  let delegate: AppDelegate
  let menuBar: MenuBarController
  let showMenuBarIcon: Bool
  @Environment(\.openWindow) private var openWindow

  var body: some View {
    SettingsView(preferences: preferences, engine: engine, loginItem: loginItem)
      .onAppear {
        delegate.engine = engine
        delegate.reopenWindow = {
          openWindow(id: "settings")
          NSApp.activate(ignoringOtherApps: true)
        }
        engine.start()
        loginItem.configureDefault()
        menuBar.configure(isVisible: showMenuBarIcon) {
          openWindow(id: "settings")
          NSApp.activate(ignoringOtherApps: true)
        }
      }
      .onChange(of: showMenuBarIcon) { _, visible in menuBar.setVisible(visible) }
  }
}
