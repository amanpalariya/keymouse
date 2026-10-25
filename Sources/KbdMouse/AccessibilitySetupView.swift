import SwiftUI

struct AccessibilitySetupView: View {
  @ObservedObject var engine: MouseEngine

  var body: some View {
    if !engine.trusted {
      Section("Set up Accessibility") {
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
          "Already enabled? Remove Kbd Mouse with −, then add it again from Applications. macOS may require this after a local rebuild."
        )
        .font(.caption).foregroundStyle(.secondary)
      }
    }
  }
}
