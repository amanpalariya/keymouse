import SwiftUI

struct AccessibilitySetupView: View {
  @ObservedObject var engine: MouseEngine

  var body: some View {
    Section(engine.connected ? "Accessibility · Ready" : "Set up Accessibility") {
      if engine.connected {
        Label("Keyboard control is ready", systemImage: "checkmark.circle.fill")
          .foregroundStyle(.green)
      } else {
        Text("Kbd Mouse needs Accessibility access to move and click the pointer.")
        Text(
          "1. Click Allow Access below.\n2. In Privacy & Security → Accessibility, turn on Kbd Mouse.\n3. Return here. Access is checked automatically."
        )
        .font(.callout).foregroundStyle(.secondary)
        HStack {
          Button("Allow Access") { engine.requestPermission() }
            .buttonStyle(.borderedProminent)
          Button("Open Accessibility Settings") { engine.openAccessibility() }
        }
        Text(
          "If it’s missing, use + to add Kbd Mouse from Applications. If access is on but control isn’t ready, quit and reopen the app."
        )
        .font(.caption).foregroundStyle(.secondary)
        if engine.trusted {
          Button("Reconnect") { engine.refreshPermission() }
        }
      }
    }
  }
}
