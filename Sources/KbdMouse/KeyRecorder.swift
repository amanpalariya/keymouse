import AppKit
import SwiftUI

/// Captures a physical key only while its keycap has keyboard focus.
struct KeyRecorder: NSViewRepresentable {
  let keyCode: UInt16
  let title: String
  let onRecord: (UInt16) -> Void
  let onRecordingChanged: (Bool) -> Void

  func makeNSView(context: Context) -> KeyRecorderButton { KeyRecorderButton() }

  func updateNSView(_ button: KeyRecorderButton, context: Context) {
    button.keyTitle = KeyChoice.title(for: keyCode)
    button.onRecord = onRecord
    button.onRecordingChanged = onRecordingChanged
    button.setAccessibilityLabel("\(title): \(button.keyTitle)")
    button.setAccessibilityHelp("Press to record a new key. Escape cancels.")
    button.refreshTitle()
  }
}

final class KeyRecorderButton: NSButton {
  var keyTitle = ""
  var onRecord: ((UInt16) -> Void)?
  var onRecordingChanged: ((Bool) -> Void)?
  private var recording = false
  private var clickMonitor: Any?
  private var modifierCandidate: ActivationModifier?

  init() {
    super.init(frame: .zero)
    bezelStyle = .rounded
    font = .monospacedSystemFont(ofSize: 12, weight: .medium)
    target = self
    action = #selector(beginRecording)
  }

  required init?(coder: NSCoder) { fatalError("init(coder:) is unavailable") }
  override var acceptsFirstResponder: Bool { true }

  @objc private func beginRecording() {
    if recording {
      finishRecording()
      return
    }
    guard window?.makeFirstResponder(self) == true else { return }
    recording = true
    onRecordingChanged?(true)
    clickMonitor = NSEvent.addLocalMonitorForEvents(matching: .leftMouseDown) { [weak self] event in
      guard let self else { return event }
      let point = self.convert(event.locationInWindow, from: nil)
      if event.window != self.window || !self.bounds.contains(point) { self.finishRecording() }
      return event
    }
    refreshTitle()
  }

  override func keyDown(with event: NSEvent) {
    guard recording else {
      super.keyDown(with: event)
      return
    }
    if event.keyCode == 53 {
      finishRecording()
      return
    }
    guard !event.isARepeat else { return }
    modifierCandidate = nil
    let modifiers = event.modifierFlags.intersection([.command, .control, .option, .shift])
    guard modifiers.isEmpty else {
      title = "Single key only"
      return
    }
    let key = event.keyCode
    finishRecording()
    onRecord?(key)
  }

  override func flagsChanged(with event: NSEvent) {
    guard recording, let modifier = ActivationModifier.forKey(event.keyCode) else { return }
    if event.modifierFlags.rawValue & UInt(modifier.flag.rawValue) != 0 {
      let flags = event.modifierFlags.intersection([.command, .control, .option, .shift])
      modifierCandidate = flags.rawValue.nonzeroBitCount == 1 ? modifier : nil
      return
    }
    guard modifierCandidate == modifier else { return }
    finishRecording()
    onRecord?(modifier.keyCode)
  }

  override func resignFirstResponder() -> Bool {
    finishRecording()
    return super.resignFirstResponder()
  }

  override func performKeyEquivalent(with event: NSEvent) -> Bool {
    guard recording else { return super.performKeyEquivalent(with: event) }
    keyDown(with: event)
    return true
  }

  override func viewWillMove(toWindow newWindow: NSWindow?) {
    if newWindow == nil { finishRecording() }
    super.viewWillMove(toWindow: newWindow)
  }

  func refreshTitle() { title = recording ? "Press a key…" : keyTitle }

  private func finishRecording() {
    guard recording else { return }
    recording = false
    modifierCandidate = nil
    if let clickMonitor { NSEvent.removeMonitor(clickMonitor) }
    clickMonitor = nil
    onRecordingChanged?(false)
    refreshTitle()
  }
}
