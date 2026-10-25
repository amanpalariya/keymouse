import SwiftUI

struct BindingKeycap: View {
  let action: MouseAction
  @ObservedObject var preferences: Preferences
  @ObservedObject var engine: MouseEngine
  @ObservedObject var editor: KeyBindingEditor

  private var conflict: BindingConflict? {
    editor.conflict?.action == action ? editor.conflict : nil
  }

  var body: some View {
    KeyRecorder(
      keyCode: preferences.configuration.bindings[action] ?? 0, title: action.title,
      rejectedKey: conflict?.key, onBeginRecording: editor.dismissConflict,
      onRecord: { editor.bind(action, to: $0, in: preferences) },
      onRecordingChanged: engine.setRecordingBinding
    )
    .frame(width: 112, height: 26)
    .overlay {
      RoundedRectangle(cornerRadius: 6).strokeBorder(.red, lineWidth: conflict == nil ? 0 : 1.5)
        .allowsHitTesting(false)
    }
    .popover(
      isPresented: Binding(
        get: { conflict != nil },
        set: { if !$0 { editor.dismissConflict() } }
      )
    ) {
      if let conflict {
        VStack(alignment: .leading, spacing: 12) {
          Label("Key already in use", systemImage: "exclamationmark.circle.fill")
            .font(.headline).foregroundStyle(.red)
          Text(conflict.message).fixedSize(horizontal: false, vertical: true)
          HStack {
            Spacer()
            Button("OK", action: editor.dismissConflict).keyboardShortcut(.defaultAction)
          }
        }.padding(16).frame(width: 270)
      }
    }
  }
}
