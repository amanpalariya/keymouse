import SwiftUI

struct SettingsTabButton: View {
  let title: String
  let symbol: String
  let isSelected: Bool
  let action: () -> Void
  @StateObject private var interaction = TabInteraction()

  var body: some View {
    Button(action: action) {
      VStack(spacing: 4) {
        Image(systemName: symbol).font(.system(size: 22))
        Text(title).font(.callout)
      }
      .frame(width: 68, height: 50)
      .foregroundStyle(isSelected ? Color.accentColor : Color.secondary)
      .background(
        Color.primary.opacity(isSelected ? 0.08 : interaction.hovered ? 0.04 : 0),
        in: RoundedRectangle(cornerRadius: 8)
      )
      .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .onHover { interaction.hovered = $0 }
    .animation(.easeOut(duration: 0.12), value: interaction.hovered)
    .help(title)
    .accessibilityLabel(title)
    .accessibilityValue(isSelected ? "Selected" : "")
  }
}

private final class TabInteraction: ObservableObject {
  @Published var hovered = false
}
