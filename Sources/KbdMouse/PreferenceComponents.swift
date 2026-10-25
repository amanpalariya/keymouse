import SwiftUI

extension MouseAction {
  var systemImage: String {
    switch self {
    case .left: "arrow.left"
    case .down: "arrow.down"
    case .up: "arrow.up"
    case .right: "arrow.right"
    case .primary: "cursorarrow.click"
    case .middle: "computermouse"
    case .secondary: "contextualmenu.and.cursorarrow"
    case .fast: "hare"
    case .slow: "tortoise"
    case .scroll: "scroll"
    }
  }
}

struct PreferenceIcon: View {
  let symbol: String
  var color: Color = .blue

  var body: some View {
    Image(systemName: symbol)
      .font(.system(size: 13, weight: .semibold))
      .foregroundStyle(.white)
      .frame(width: 26, height: 26)
      .background(color.gradient, in: RoundedRectangle(cornerRadius: 6))
      .accessibilityHidden(true)
  }
}

struct PreferenceCard<Content: View>: View {
  @ViewBuilder let content: Content

  var body: some View {
    VStack(spacing: 0) { content }
      .frame(maxWidth: .infinity, alignment: .leading)
      .padding(.vertical, 3)
      .background(.quaternary.opacity(0.3), in: RoundedRectangle(cornerRadius: 10))
      .overlay(RoundedRectangle(cornerRadius: 10).strokeBorder(.primary.opacity(0.07)))
  }
}

struct PreferenceRow<Control: View>: View {
  let title: String
  let symbol: String
  var color: Color = .blue
  var subtitle: String? = nil
  @ViewBuilder let control: Control

  var body: some View {
    HStack(spacing: 11) {
      PreferenceIcon(symbol: symbol, color: color)
      VStack(alignment: .leading, spacing: 3) {
        Text(title)
        if let subtitle { Text(subtitle).font(.caption).foregroundStyle(.secondary) }
      }
      Spacer(minLength: 12)
      control
    }
    .padding(.horizontal, 12)
    .padding(.vertical, 10)
  }
}

struct PreferenceDivider: View {
  var body: some View { Divider().padding(.leading, 49).padding(.trailing, 12) }
}

struct PreferenceToggle: View {
  let title: String
  let symbol: String
  var color: Color = .blue
  @Binding var isOn: Bool

  var body: some View {
    PreferenceRow(title: title, symbol: symbol, color: color) {
      Toggle(title, isOn: $isOn).labelsHidden().toggleStyle(.switch).controlSize(.small)
    }
  }
}

struct PreferenceSlider: View {
  let title: String
  let symbol: String
  var color: Color = .blue
  @Binding var value: Double
  let range: ClosedRange<Double>
  let format: String

  var body: some View {
    PreferenceRow(title: title, symbol: symbol, color: color) {
      VStack(alignment: .trailing, spacing: 5) {
        Text(String(format: format, value)).font(.callout).monospacedDigit().foregroundStyle(
          .secondary)
        Slider(value: $value, in: range).accessibilityLabel(title)
      }.frame(width: 175)
    }
  }
}
