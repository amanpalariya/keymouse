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
    delegate.engine = engine
  }

  var body: some Scene {
    Window("Kbd Mouse", id: "main") {
      AppWindow(preferences: preferences, engine: engine, loginItem: loginItem, delegate: delegate)
    }
    .windowResizability(.contentSize)
    .commands {
      CommandGroup(replacing: .appSettings) {
        OpenAppButton(title: "Settings…").keyboardShortcut(",")
      }
    }
    MenuBarExtra(isInserted: $showMenuBarIcon) {
      MenuContent(engine: engine, preferences: preferences)
    } label: {
      Label("Kbd Mouse", systemImage: engine.active ? "keyboard.fill" : "keyboard")
    }
  }
}

final class AppDelegate: NSObject, NSApplicationDelegate {
  weak var engine: MouseEngine?
  var reopenWindow: (() -> Void)?

  func applicationDidFinishLaunching(_ notification: Notification) {
    engine?.start()
  }

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
    SettingsView(preferences: preferences, engine: engine, loginItem: loginItem)
      .onAppear {
        delegate.reopenWindow = { openWindow(id: "main") }
        engine.deactivate()
        loginItem.configureDefault()
      }
  }
}

private struct OpenAppButton: View {
  let title: String
  @Environment(\.openWindow) private var openWindow

  var body: some View {
    Button(title) {
      openWindow(id: "main")
      NSApp.activate(ignoringOtherApps: true)
    }
  }
}

struct MenuContent: View {
  @ObservedObject var engine: MouseEngine
  @ObservedObject var preferences: Preferences

  var body: some View {
    Text(engine.active ? "Keyboard control on" : "Keyboard control off")
    if engine.connected {
      Button(engine.active ? "Stop" : "Start") { engine.toggle() }
      Text("\(preferences.configuration.gesture.title) \(preferences.configuration.modifier.title)")
    } else {
      OpenAppButton(title: "Set Up Accessibility…")
    }
    Divider()
    OpenAppButton(title: "Open Kbd Mouse…")
    OpenAppButton(title: "Settings…").keyboardShortcut(",")
    Divider()
    Button("Quit Kbd Mouse") {
      engine.shutdown()
      NSApp.terminate(nil)
    }.keyboardShortcut("q")
  }
}
