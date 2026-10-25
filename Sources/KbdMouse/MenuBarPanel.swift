import SwiftUI

struct MenuBarPanel: View {
  @ObservedObject var engine: MouseEngine
  @ObservedObject var preferences: Preferences

  var body: some View {
    VStack(spacing: 0) {
      HStack(spacing: 8) {
        Circle().fill(engine.active ? .green : .secondary.opacity(0.35))
          .frame(width: 6, height: 6).accessibilityHidden(true)
        Text(engine.active ? "Stop" : "Start").fontWeight(.semibold)
        Spacer()
        Text(
          "\(preferences.configuration.gesture.title) \(preferences.configuration.modifier.symbol)"
        )
        .fontWeight(.semibold)
      }.padding(.vertical, 10)
      if !engine.connected {
        Text(engine.trusted ? "Keyboard connection unavailable" : "Accessibility required")
          .font(.caption).foregroundStyle(.orange)
          .frame(maxWidth: .infinity, alignment: .leading).padding(.bottom, 8)
      }
      Divider().padding(.vertical, 5)
      bindingRow("Move", actions: [.left, .down, .up, .right])
      bindingRow("Left click", actions: [.primary], fixedKey: "Space")
      bindingRow("Middle click", actions: [.middle])
      bindingRow("Right click", actions: [.secondary])
      bindingRow("Fast", actions: [.fast])
      bindingRow("Slow", actions: [.slow])
      bindingRow("Scroll", actions: [.scroll])
      if preferences.configuration.escapeCancels {
        bindingRow("Cancel", actions: [], fixedKey: "Esc")
      }
      Divider().padding(.vertical, 5)
      SettingsLink {
        Label("Settings…", systemImage: "gearshape").frame(maxWidth: .infinity, alignment: .leading)
      }
      .keyboardShortcut(",")
      .buttonStyle(.plain).padding(.vertical, 7)
      Button {
        engine.shutdown()
        NSApp.terminate(nil)
      } label: {
        Label("Quit Kbd Mouse", systemImage: "power").frame(
          maxWidth: .infinity, alignment: .leading)
      }.keyboardShortcut("q").buttonStyle(.plain).padding(.vertical, 7)
    }.font(.callout).padding(.horizontal, 14).padding(.vertical, 6).frame(width: 285)
  }

  private func bindingRow(_ title: String, actions: [MouseAction], fixedKey: String? = nil)
    -> some View
  {
    HStack {
      Text(title).foregroundStyle(.secondary)
      Spacer()
      if let fixedKey { keycap(fixedKey) }
      ForEach(actions) { action in
        keycap(KeyChoice.title(for: preferences.configuration.bindings[action] ?? 0))
      }
    }.padding(.vertical, 5)
  }

  private func keycap(_ text: String) -> some View {
    Text(text).font(.system(size: 11, weight: .medium, design: .monospaced))
      .padding(.horizontal, 5).padding(.vertical, 3)
      .background(.quaternary.opacity(0.45), in: RoundedRectangle(cornerRadius: 4))
  }
}
