import SwiftUI

struct SettingsView: View {
  @ObservedObject var preferences: Preferences
  @ObservedObject var engine: MouseEngine
  @ObservedObject var loginItem: LoginItem
  @AppStorage("showMenuBarIcon") private var showMenuBarIcon = true
  @SceneStorage("settingsPane") private var selectedPane = "general"
  @Environment(\.scenePhase) private var scenePhase
  @StateObject private var bindingEditor = KeyBindingEditor()

  var body: some View {
    TabView(selection: $selectedPane) {
      pane { general }.tabItem { Label("General", systemImage: "gearshape") }.tag("general")
      pane { controls }.tabItem { Label("Controls", systemImage: "command") }.tag("controls")
      pane { motion }.tabItem { Label("Motion", systemImage: "speedometer") }.tag("motion")
    }
    .frame(width: 500, height: 590)
    .onAppear {
      loginItem.refresh()
      engine.deactivate()
    }
    .onChange(of: scenePhase) { _, phase in
      if phase == .active {
        loginItem.refresh()
        engine.refreshPermission()
      }
    }
  }

  private func pane<Content: View>(@ViewBuilder content: () -> Content) -> some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 18) { content() }
        .padding(20)
    }
  }

  private var general: some View {
    Group {
      if !engine.trusted {
        AccessibilitySetupView(engine: engine)
      }
      if engine.trusted && !engine.connected {
        PreferenceCard {
          PreferenceRow(title: "Keyboard Connection", symbol: "keyboard", color: .orange) {
            Button("Reconnect") { engine.reconnect() }
          }
        }
      }
      PreferenceCard {
        PreferenceToggle(
          title: "Launch at Login", symbol: "power", color: .green,
          isOn: Binding(get: { loginItem.enabled }, set: { loginItem.setEnabled($0) }))
        PreferenceDivider()
        PreferenceToggle(
          title: "Show in Menu Bar", symbol: "menubar.rectangle", color: .purple,
          isOn: $showMenuBarIcon)
        PreferenceDivider()
        PreferenceToggle(
          title: "Cursor Badge", symbol: "cursorarrow", color: .blue,
          isOn: $preferences.configuration.showBadge)
      }
      if loginItem.needsApproval {
        Button("Allow in Login Items…") { loginItem.openSystemSettings() }
      }
      if let message = loginItem.errorMessage {
        Text(message).font(.callout).foregroundStyle(.red)
        Button("Retry Launch at Login") { loginItem.setEnabled(true) }
      }
      PreferenceCard {
        PreferenceToggle(
          title: "Escape to Cancel", symbol: "escape", color: .red,
          isOn: $preferences.configuration.escapeCancels)
        PreferenceDivider()
        PreferenceToggle(
          title: "Stop After Inactivity", symbol: "timer", color: .orange,
          isOn: $preferences.configuration.timeoutEnabled)
        if preferences.configuration.timeoutEnabled {
          PreferenceDivider()
          PreferenceRow(title: "Timeout", symbol: "clock", color: .orange) {
            Stepper(value: $preferences.configuration.idleTimeout, in: 5...300, step: 5) {
              Text("\(Int(preferences.configuration.idleTimeout)) s").monospacedDigit()
            }.fixedSize()
          }
        }
      }
      HStack {
        Text("Kbd Mouse · 1.0").foregroundStyle(.tertiary)
        Spacer()
        Button("Reset All Settings") { preferences.configuration = Configuration() }
          .buttonStyle(.link)
      }.font(.caption)
    }
  }

  private var controls: some View {
    Group {
      PreferenceCard {
        PreferenceRow(title: "Activate With", symbol: "hand.tap", color: .purple) {
          Picker("Gesture", selection: $preferences.configuration.gesture) {
            ForEach(ActivationGesture.allCases) { Text($0.title).tag($0) }
          }.labelsHidden().frame(width: 150)
        }
        PreferenceDivider()
        PreferenceRow(title: "Activation Key", symbol: "command", color: .purple) {
          Picker("Activation Key", selection: $preferences.configuration.modifier) {
            ForEach(ActivationModifier.allCases) { Text($0.title).tag($0) }
          }.labelsHidden().frame(width: 150)
        }
        if preferences.configuration.gesture == .doubleTap {
          PreferenceDivider()
          PreferenceSlider(
            title: "Tap Interval", symbol: "metronome", color: .purple,
            value: $preferences.configuration.doubleTapInterval, range: 0.2...0.6, format: "%.2f s")
        }
      }
      Text(bindingEditor.message).font(.caption).foregroundStyle(.secondary)
      PreferenceCard {
        PreferenceToggle(
          title: "Arrow Keys Also Move", symbol: "arrowkeys", color: .blue,
          isOn: $preferences.configuration.arrowsEnabled)
      }
      bindingCard(
        [.left, .down, .up, .right],
        color: .blue)
      bindingCard(
        [.primary, .alternatePrimary, .middle, .secondary], color: .pink)
      bindingCard([.fast, .slow, .scroll], color: .orange)
      Button("Reset Keys") {
        bindingEditor.reset(in: preferences)
      }.buttonStyle(.link).font(.caption)
    }
  }

  private func bindingCard(_ actions: [MouseAction], color: Color) -> some View {
    PreferenceCard {
      ForEach(actions) { action in
        if action != actions.first { PreferenceDivider() }
        PreferenceRow(title: action.title, symbol: action.systemImage, color: color) {
          KeyRecorder(
            keyCode: preferences.configuration.bindings[action] ?? 0, title: action.title,
            onRecord: { bindingEditor.bind(action, to: $0, in: preferences) },
            onRecordingChanged: engine.setRecordingBinding
          )
          .frame(width: 112, height: 26)
        }
      }
    }
  }

  private var motion: some View {
    Group {
      PreferenceCard {
        PreferenceSlider(
          title: "Pointer Speed", symbol: "cursorarrow.motionlines", color: .blue,
          value: $preferences.configuration.moveSpeed, range: 100...2000, format: "%.0f pt/s")
        PreferenceDivider()
        PreferenceSlider(
          title: "Scroll Speed", symbol: "scroll", color: .blue,
          value: $preferences.configuration.scrollSpeed, range: 50...2000, format: "%.0f px/s")
      }
      PreferenceCard {
        PreferenceToggle(
          title: "Acceleration", symbol: "speedometer", color: .purple,
          isOn: $preferences.configuration.acceleration.enabled)
        if preferences.configuration.acceleration.enabled {
          PreferenceDivider()
          PreferenceSlider(
            title: "Ramp Time", symbol: "chart.line.uptrend.xyaxis", color: .purple,
            value: $preferences.configuration.acceleration.rampTime, range: 0.1...1,
            format: "%.2f s")
          PreferenceDivider()
          PreferenceSlider(
            title: "Initial Speed", symbol: "tortoise", color: .purple,
            value: $preferences.configuration.acceleration.initialSpeed, range: 0.1...0.6,
            format: "%.2f×")
        }
      }
      PreferenceCard {
        PreferenceSlider(
          title: "Fast", symbol: "hare", color: .orange,
          value: $preferences.configuration.fastMultiplier, range: 1.25...6, format: "%.2f×")
        PreferenceDivider()
        PreferenceSlider(
          title: "Slow", symbol: "tortoise", color: .orange,
          value: $preferences.configuration.slowMultiplier, range: 0.05...0.8, format: "%.2f×")
      }
      PreferenceCard {
        PreferenceToggle(
          title: "Reverse Scrolling", symbol: "arrow.up.arrow.down", color: .green,
          isOn: $preferences.configuration.reverseScroll)
      }
    }
  }
}
