import SwiftUI

struct SettingsView: View {
  @ObservedObject var preferences: Preferences
  @ObservedObject var engine: MouseEngine
  @ObservedObject var loginItem: LoginItem
  @AppStorage("showMenuBarIcon") private var showMenuBarIcon = true
  @Environment(\.scenePhase) private var scenePhase

  var body: some View {
    TabView {
      general.tabItem { Label("General", systemImage: "switch.2") }
      keys.tabItem { Label("Keys", systemImage: "keyboard") }
      motion.tabItem { Label("Motion", systemImage: "cursorarrow.motionlines") }
    }
    .frame(width: 540, height: 650)
    .onAppear { loginItem.refresh() }
    .onChange(of: scenePhase) { _, phase in
      if phase == .active {
        loginItem.refresh()
        engine.refreshPermission()
      }
    }
  }

  private var general: some View {
    Form {
      ControlStatusView(engine: engine, preferences: preferences)
      AccessibilitySetupView(engine: engine)
      Section("App") {
        Toggle("Show in menu bar", isOn: $showMenuBarIcon)
        Toggle(
          "Launch at login",
          isOn: Binding(
            get: { loginItem.enabled }, set: { loginItem.setEnabled($0) }))
        if loginItem.needsApproval {
          Text("Allow Kbd Mouse in Login Items to finish enabling launch at login.")
            .font(.callout).foregroundStyle(.secondary)
          Button("Open Login Items") { loginItem.openSystemSettings() }
        }
        if let message = loginItem.errorMessage {
          Text(message).font(.callout).foregroundStyle(.red)
          Button("Retry Launch at Login") { loginItem.setEnabled(true) }
        }
      }
      Section("Activation") {
        Picker("Gesture", selection: $preferences.configuration.gesture) {
          ForEach(ActivationGesture.allCases) { Text($0.title).tag($0) }
        }
        Picker("Key", selection: $preferences.configuration.modifier) {
          ForEach(ActivationModifier.allCases) { Text($0.title).tag($0) }
        }
        if preferences.configuration.gesture == .doubleTap {
          valueSlider(
            "Tap interval", value: $preferences.configuration.doubleTapInterval, range: 0.2...0.6,
            format: "%.2f s")
        }
        Text(
          preferences.configuration.gesture == .hold
            ? "Hold the key to control the pointer. Release to stop."
            : "Use the gesture again to stop. Tap the key on its own."
        )
        .font(.callout).foregroundStyle(.secondary)
      }
      Section("Stop") {
        Toggle("Escape to cancel", isOn: $preferences.configuration.escapeCancels)
        Toggle("Stop after inactivity", isOn: $preferences.configuration.timeoutEnabled)
        if preferences.configuration.timeoutEnabled {
          Stepper(value: $preferences.configuration.idleTimeout, in: 5...300, step: 5) {
            LabeledContent(
              "Timeout", value: "\(Int(preferences.configuration.idleTimeout)) seconds")
          }
        }
      }
      Section {
        Toggle("Show badge beside cursor", isOn: $preferences.configuration.showBadge)
      }
    }.formStyle(.grouped)
  }

  private var keys: some View {
    Form {
      Section {
        Toggle("Arrow keys also move", isOn: $preferences.configuration.arrowsEnabled)
        Text("Hold click keys to drag. Combine speed, scroll, and direction keys.")
          .font(.callout).foregroundStyle(.secondary)
      }
      Section("Movement") {
        ForEach([MouseAction.left, .down, .up, .right]) { keyPicker($0) }
      }
      Section("Buttons") {
        ForEach([MouseAction.primary, .alternatePrimary, .middle, .secondary]) { keyPicker($0) }
      }
      Section("Hold modifiers") {
        ForEach([MouseAction.fast, .slow, .scroll]) { keyPicker($0) }
      }
      Section {
        Text("Bindings use physical keys. Assigning a used key swaps the two bindings.")
          .font(.caption).foregroundStyle(.secondary)
        Button("Reset Keys") { preferences.configuration.bindings = Configuration.defaultBindings }
      }
    }.formStyle(.grouped)
  }

  private var motion: some View {
    Form {
      Section("Speed") {
        valueSlider(
          "Pointer", value: $preferences.configuration.moveSpeed, range: 100...2000,
          format: "%.0f pt/s")
        valueSlider(
          "Scroll", value: $preferences.configuration.scrollSpeed, range: 50...2000,
          format: "%.0f px/s")
      }
      Section("Hold modifiers") {
        valueSlider(
          "Fast", value: $preferences.configuration.fastMultiplier, range: 1.25...6, format: "%.2f×"
        )
        valueSlider(
          "Slow", value: $preferences.configuration.slowMultiplier, range: 0.05...0.8,
          format: "%.2f×")
      }
      Section("Scrolling") {
        Toggle("Reverse scroll direction", isOn: $preferences.configuration.reverseScroll)
        Text("Hold \(keyName(.scroll)) with a direction. Add \(keyName(.slow)) for precision.")
          .font(.callout).foregroundStyle(.secondary)
      }
      Section {
        Button("Reset All Settings") { preferences.configuration = Configuration() }
      }
    }.formStyle(.grouped)
  }

  private func keyName(_ action: MouseAction) -> String {
    KeyChoice.title(for: preferences.configuration.bindings[action] ?? 0)
  }

  private func keyPicker(_ action: MouseAction) -> some View {
    Picker(
      action.title,
      selection: Binding(
        get: { preferences.configuration.bindings[action] ?? 0 },
        set: { preferences.configuration.bind(action, to: $0) }
      )
    ) {
      ForEach(KeyChoice.all) { Text($0.title).tag($0.id) }
    }
  }

  private func valueSlider(
    _ title: String, value: Binding<Double>, range: ClosedRange<Double>, format: String
  ) -> some View {
    VStack(alignment: .leading, spacing: 6) {
      LabeledContent(title, value: String(format: format, value.wrappedValue))
      Slider(value: value, in: range).accessibilityLabel(title)
    }.padding(.vertical, 4)
  }
}
