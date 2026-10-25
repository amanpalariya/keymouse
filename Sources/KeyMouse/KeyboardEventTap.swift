import CoreGraphics

/// Owns the main-run-loop event tap and its callback lifetime.
final class KeyboardEventTap {
  typealias Handler = (CGEventType, CGEvent) -> Bool
  private var port: CFMachPort?
  private var source: CFRunLoopSource?
  private var handler: Handler?

  var isEnabled: Bool { port.map { CGEvent.tapIsEnabled(tap: $0) } ?? false }

  func start(handler: @escaping Handler) {
    guard port == nil else { return }
    self.handler = handler
    let types: [CGEventType] = [
      .keyDown, .keyUp, .flagsChanged,
      .mouseMoved, .leftMouseDragged, .rightMouseDragged, .otherMouseDragged,
    ]
    let mask = types.reduce(CGEventMask(0)) { $0 | (CGEventMask(1) << $1.rawValue) }
    port = CGEvent.tapCreate(
      tap: .cgSessionEventTap, place: .headInsertEventTap,
      options: .defaultTap, eventsOfInterest: mask,
      callback: { _, type, event, context in
        guard let context else { return Unmanaged.passUnretained(event) }
        let tap = Unmanaged<KeyboardEventTap>.fromOpaque(context).takeUnretainedValue()
        let consumed = tap.handler?(type, event) ?? false
        return consumed ? nil : Unmanaged.passUnretained(event)
      }, userInfo: Unmanaged.passUnretained(self).toOpaque())
    guard let port else { return }
    source = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, port, 0)
    CFRunLoopAddSource(CFRunLoopGetMain(), source, .commonModes)
    enable()
  }

  func enable() {
    if let port { CGEvent.tapEnable(tap: port, enable: true) }
  }

  func stop() {
    if let source { CFRunLoopRemoveSource(CFRunLoopGetMain(), source, .commonModes) }
    if let port { CFMachPortInvalidate(port) }
    source = nil
    port = nil
    handler = nil
  }

  deinit { stop() }
}
