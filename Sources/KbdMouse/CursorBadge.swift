import AppKit

final class CursorBadge {
  private static let size = NSSize(width: 20, height: 20)
  private var panel: NSPanel?
  private var lastOrigin: CGPoint?

  func show(at point: CGPoint) {
    if panel == nil { createPanel() }
    let origin = badgeOrigin(for: point)
    if origin != lastOrigin {
      panel?.setFrame(NSRect(origin: origin, size: Self.size), display: false, animate: false)
      lastOrigin = origin
    }
    if panel?.isVisible == false { panel?.orderFrontRegardless() }
  }

  func hide() { panel?.orderOut(nil) }

  private func badgeOrigin(for point: CGPoint) -> CGPoint {
    // CGEvent uses a top-left origin; AppKit uses the primary screen's bottom-left.
    let top = NSScreen.screens.first?.frame.maxY ?? 0
    var origin = CGPoint(x: point.x + 18, y: top - point.y - 26)
    if let screen = NSScreen.screens.first(where: {
      $0.frame.contains(CGPoint(x: point.x, y: top - point.y))
    }) {
      origin.x = min(max(origin.x, screen.frame.minX), screen.frame.maxX - Self.size.width)
      origin.y = min(max(origin.y, screen.frame.minY), screen.frame.maxY - Self.size.height)
      let scale = screen.backingScaleFactor
      origin.x = (origin.x * scale).rounded() / scale
      origin.y = (origin.y * scale).rounded() / scale
    }
    return origin
  }

  private func createPanel() {
    let frame = NSRect(origin: .zero, size: Self.size)
    let panel = NSPanel(
      contentRect: frame,
      styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
    panel.isOpaque = false
    panel.backgroundColor = .clear
    panel.hasShadow = false
    panel.animationBehavior = .none
    panel.hidesOnDeactivate = false
    panel.ignoresMouseEvents = true
    panel.level = .screenSaver
    panel.collectionBehavior = [
      .canJoinAllSpaces, .fullScreenAuxiliary, .stationary, .ignoresCycle,
    ]
    panel.contentView = CursorKeycapView(frame: frame)
    self.panel = panel
  }
}

final class CursorKeycapView: NSView {
  override var isOpaque: Bool { false }

  override func draw(_ dirtyRect: NSRect) {
    let shape = NSBezierPath(roundedRect: bounds.insetBy(dx: 0.5, dy: 0.5), xRadius: 4, yRadius: 4)
    NSColor.windowBackgroundColor.withAlphaComponent(0.95).setFill()
    shape.fill()
    NSColor.separatorColor.setStroke()
    shape.lineWidth = 1
    shape.stroke()

    let label = "K" as NSString
    let attributes: [NSAttributedString.Key: Any] = [
      .font: NSFont.monospacedSystemFont(ofSize: 11, weight: .medium),
      .foregroundColor: NSColor.labelColor,
    ]
    let size = label.size(withAttributes: attributes)
    label.draw(
      at: CGPoint(
        x: (bounds.width - size.width) / 2,
        y: (bounds.height - size.height) / 2), withAttributes: attributes)
  }

  override func viewDidChangeEffectiveAppearance() { needsDisplay = true }
}
