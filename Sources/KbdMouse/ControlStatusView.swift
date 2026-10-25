import SwiftUI

/// Runtime status is independent of the Accessibility setup flow.
struct ControlStatusView: View {
  @ObservedObject var engine: MouseEngine
  @ObservedObject var preferences: Preferences

  var body: some View {
    Section {
      HStack {
        Label(title, systemImage: engine.active ? "keyboard.fill" : "keyboard")
        Spacer()
        Button(engine.active ? "Stop" : "Start") { engine.toggle() }
          .disabled(!engine.connected)
      }
      if engine.connected {
        Text(activationHint)
          .font(.callout).foregroundStyle(.secondary)
      } else if engine.trusted {
        Text("Accessibility is enabled. The keyboard connection needs to restart.")
          .font(.callout).foregroundStyle(.secondary)
        Button("Reconnect") { engine.reconnect() }
      }
    }
  }

  private var title: String {
    if engine.active { return "Keyboard control on" }
    return engine.connected ? "Ready" : "Keyboard control unavailable"
  }

  private var activationHint: String {
    let config = preferences.configuration
    if engine.active && config.gesture == .hold {
      return "Release \(config.modifier.title) to stop"
    }
    return "\(config.gesture.title) \(config.modifier.title) to \(engine.active ? "stop" : "start")"
  }
}
