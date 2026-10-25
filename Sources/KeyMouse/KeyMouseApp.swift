import SwiftUI

@main
struct KeyMouseApp: App {
  @NSApplicationDelegateAdaptor(AppDelegate.self) private var delegate
  @StateObject private var preferences: Preferences
  @StateObject private var engine: MouseEngine
  @StateObject private var loginItem = LoginItem()
  @AppStorage("showMenuBarIcon") private var showMenuBarIcon = true

  init() {
    DefaultsMigration.importLegacyIfNeeded(into: .standard)
    let preferences = Preferences()
    let engine = MouseEngine(preferences: preferences)
    _preferences = StateObject(wrappedValue: preferences)
    _engine = StateObject(wrappedValue: engine)
  }

  var body: some Scene {
    Window("Key Mouse Settings", id: "settings") {
      SettingsWindow(
        preferences: preferences, engine: engine, loginItem: loginItem, delegate: delegate)
    }
    .windowResizability(.contentSize)
    .windowToolbarStyle(.expanded)
    .commands {
      CommandGroup(replacing: .appSettings) {
        OpenSettingsButton(title: "Settings…").keyboardShortcut(",")
      }
    }
    MenuBarExtra(isInserted: $showMenuBarIcon) {
      MenuBarView(engine: engine, preferences: preferences)
    } label: {
      Image(nsImage: BrandArtwork.symbol(size: 20, template: true))
        .accessibilityLabel("Key Mouse")
        .task {
          delegate.engine = engine
          engine.start()
        }
    }.menuBarExtraStyle(.window)
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
      }
  }
}
