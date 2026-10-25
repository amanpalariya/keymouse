import SwiftUI

struct AccessibilitySetupView: View {
  @ObservedObject var engine: MouseEngine

  var body: some View {
    if !engine.trusted {
      PreferenceCard {
        VStack(alignment: .leading, spacing: 12) {
          HStack(spacing: 10) {
            PreferenceIcon(symbol: "hand.raised.fill", color: .blue)
            Text("Accessibility").font(.headline)
          }
          Text("Allow Key Mouse to move and click the pointer.")
          Text("Enable it in System Settings → Privacy & Security → Accessibility.")
            .font(.callout).foregroundStyle(.secondary)
          HStack {
            Button("Allow Access") { engine.requestPermission() }
              .buttonStyle(.borderedProminent)
            Button("System Settings…") { engine.openAccessibility() }
          }
        }.padding(14)
      }
    }
  }
}
