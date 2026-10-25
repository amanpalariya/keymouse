import SwiftUI

@main
struct KbdMouseApp: App {
  @NSApplicationDelegateAdaptor(AppDelegate.self) private var delegate
  @StateObject private var preferences: Preferences
  @StateObject private var engine: MouseEngine
  @StateObject private var loginItem = LoginItem()
  @AppStorage("showMenuBarIcon") private var showMenuBarIcon = true

  init() {
    let preferences = Preferences()
    let engine = MouseEngine(preferences: preferences)
    _preferences = StateObject(wrappedValue: preferences)
    _engine = StateObject(wrappedValue: engine)
  }

  var body: some Scene {
    Window("Kbd Mouse", id: "main") {
      AppWindow(preferences: preferences, engine: engine, loginItem: loginItem, delegate: delegate)
    }
    .windowResizability(.contentSize)
    .windowStyle(.hiddenTitleBar)
    Settings {
      SettingsView(preferences: preferences, engine: engine, loginItem: loginItem)
    }
    MenuBarExtra(isInserted: $showMenuBarIcon) {
      MenuBarPanel(engine: engine, preferences: preferences)
    } label: {
      Image(nsImage: BrandArtwork.symbol(size: 20, template: true))
        .accessibilityLabel("Kbd Mouse")
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
    if !hasVisibleWindows { reopenWindow?() }
    return true
  }

  func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { false }
  func applicationWillTerminate(_ notification: Notification) { engine?.shutdown() }
}

private struct AppWindow: View {
  let preferences: Preferences
  let engine: MouseEngine
  @ObservedObject var loginItem: LoginItem
  let delegate: AppDelegate
  @Environment(\.openWindow) private var openWindow

  var body: some View {
    DashboardView(engine: engine, preferences: preferences)
      .onAppear {
        delegate.engine = engine
        delegate.reopenWindow = { openWindow(id: "main") }
        engine.start()
        loginItem.configureDefault()
      }
  }
}
