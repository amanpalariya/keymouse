import SwiftUI

struct MenuBarView: View {
  @ObservedObject var engine: MouseEngine
  @ObservedObject var preferences: Preferences

  var body: some View {
    VStack(spacing: 18) {
      header
      VStack(spacing: 12) {
        Image(nsImage: BrandArtwork.appIcon(size: 64)).accessibilityHidden(true)
        Text(statusTitle).font(.system(size: 18, weight: .semibold))
        if engine.connected {
          Text(activationHint).font(.callout).foregroundStyle(.secondary)
          Button(engine.active ? "Stop" : "Start") { engine.toggle() }
            .buttonStyle(.borderedProminent).controlSize(.large)
            .tint(.purple).frame(maxWidth: .infinity)
        } else {
          OpenSettingsButton(title: engine.trusted ? "Reconnect…" : "Enable Accessibility…")
            .buttonStyle(.borderedProminent).tint(.purple)
        }
      }.padding(.vertical, 6)
      VStack(spacing: 0) {
        shortcutRow(
          "Move", symbol: "arrow.up.and.down.and.arrow.left.and.right", color: .purple,
          keys: [.left, .down, .up, .right])
        Divider().padding(.leading, 45)
        shortcutRow(
          "Click", symbol: "computermouse", color: .blue, keys: [.primary, .middle, .secondary])
        Divider().padding(.leading, 45)
        shortcutRow(
          "Speed / Scroll", symbol: "speedometer", color: .orange, keys: [.fast, .slow, .scroll])
      }
      Text("Hold a click key to drag. Escape to stop.")
        .font(.caption).foregroundStyle(.secondary)
    }
    .padding(18)
    .frame(width: 340)
  }

  private var header: some View {
    ZStack {
      Text("Key Mouse").font(.headline)
      HStack {
        Menu {
          OpenSettingsButton(title: "Settings…").keyboardShortcut(",")
          Divider()
          Button("Quit Key Mouse") {
            engine.shutdown()
            NSApp.terminate(nil)
          }.keyboardShortcut("q")
        } label: {
          Image(systemName: "gearshape").font(.system(size: 17))
        }.menuStyle(.borderlessButton).menuIndicator(.hidden).fixedSize()
        Spacer()
        Circle().fill(engine.active ? .green : .secondary.opacity(0.35)).frame(width: 7, height: 7)
          .accessibilityLabel(engine.active ? "Active" : "Inactive")
      }
    }
  }

  private func shortcutRow(
    _ title: String, symbol: String, color: Color,
    keys: [MouseAction]
  ) -> some View {
    HStack(spacing: 10) {
      PreferenceIcon(symbol: symbol, color: color)
      Text(title).font(.callout)
      Spacer(minLength: 4)
      HStack(spacing: 3) {
        if keys.contains(.primary) {
          Text("Space").font(.system(size: 11, weight: .medium, design: .monospaced))
            .padding(.horizontal, 5).padding(.vertical, 4)
            .background(.quaternary.opacity(0.45), in: RoundedRectangle(cornerRadius: 4))
        }
        ForEach(keys) { action in
          Text(KeyChoice.title(for: preferences.configuration.bindings[action] ?? 0))
            .font(.system(size: 11, weight: .medium, design: .monospaced))
            .help(action.title)
            .padding(.horizontal, 5).padding(.vertical, 4)
            .background(.quaternary.opacity(0.45), in: RoundedRectangle(cornerRadius: 4))
        }
      }
    }.padding(.vertical, 10)
  }

  private var statusTitle: String {
    if engine.active { return "Keyboard control on" }
    return engine.connected ? "Ready" : "Accessibility required"
  }

  private var activationHint: String {
    let config = preferences.configuration
    return
      "\(config.gesture.title) \(config.modifier.symbol) to \(engine.active ? "stop" : "start")"
  }
}
