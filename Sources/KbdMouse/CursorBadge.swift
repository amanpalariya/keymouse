import AppKit

final class CursorBadge {
  private var panel: NSPanel?
  private var imageView: NSImageView?
  private var scrollMode = false

  func show(at point: CGPoint, scrolling: Bool) {
    if panel == nil { createPanel(scrolling: scrolling) }
    if scrolling != scrollMode { setSymbol(scrolling) }
    // CGEvent uses a top-left origin; AppKit uses the primary screen's bottom-left.
    let top = NSScreen.screens.first?.frame.maxY ?? 0
    var origin = CGPoint(x: point.x + 18, y: top - point.y - 32)
    if let screen = NSScreen.screens.first(where: {
      $0.frame.contains(CGPoint(x: point.x, y: top - point.y))
    }) {
      origin.x = min(max(origin.x, screen.frame.minX), screen.frame.maxX - 28)
      origin.y = min(max(origin.y, screen.frame.minY), screen.frame.maxY - 24)
    }
    panel?.setFrameOrigin(origin)
    if panel?.isVisible == false { panel?.orderFrontRegardless() }
  }
  private func createPanel(scrolling: Bool) {
    let panel = NSPanel(
      contentRect: NSRect(x: 0, y: 0, width: 28, height: 24),
      styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
    panel.isOpaque = false
    panel.backgroundColor = .clear
    panel.hasShadow = true
    panel.ignoresMouseEvents = true
    panel.level = .screenSaver
    panel.collectionBehavior = [
      .canJoinAllSpaces, .fullScreenAuxiliary, .stationary, .ignoresCycle,
    ]
    let background = NSView(frame: NSRect(x: 0, y: 0, width: 28, height: 24))
    background.wantsLayer = true
    background.layer?.cornerRadius = 7
    background.layer?.backgroundColor = NSColor.controlAccentColor.cgColor
    let image = NSImageView(frame: NSRect(x: 5, y: 5, width: 18, height: 14))
    image.contentTintColor = .white
    background.addSubview(image)
    panel.contentView = background
    self.panel = panel
    imageView = image
    setSymbol(scrolling)
  }

  private func setSymbol(_ scrolling: Bool) {
    scrollMode = scrolling
    imageView?.image = NSImage(
      systemSymbolName: scrolling ? "scroll" : "keyboard",
      accessibilityDescription: "Keyboard mouse active")
  }
  func hide() { panel?.orderOut(nil) }
}
