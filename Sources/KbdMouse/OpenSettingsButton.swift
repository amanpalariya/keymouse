import SwiftUI

/// Every settings entry opens the same singleton window.
struct OpenSettingsButton: View {
  let title: String
  @Environment(\.openWindow) private var openWindow

  var body: some View {
    Button(title) {
      openWindow(id: "settings")
      NSApp.activate(ignoringOtherApps: true)
    }
  }
}
