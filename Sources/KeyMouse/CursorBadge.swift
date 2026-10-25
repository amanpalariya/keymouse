import AppKit

final class CursorBadge {
  private static let size = NSSize(width: 8, height: 8)
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
    var origin = CGPoint(x: point.x + 16, y: top - point.y - 18)
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
    // Let WindowServer hide the overlay in Mission Control. A separate window
    // cannot track the hardware cursor reliably during its compositor animations.
    panel.collectionBehavior = [
      .canJoinAllSpaces, .fullScreenAuxiliary, .transient, .ignoresCycle,
    ]
    panel.contentView = CursorDotView(frame: frame)
    self.panel = panel
  }
}

final class CursorDotView: NSView {
  override var isOpaque: Bool { false }

  override func draw(_ dirtyRect: NSRect) {
    let dot = NSBezierPath(ovalIn: bounds.insetBy(dx: 0.5, dy: 0.5))
    BrandArtwork.activeGradient.draw(in: dot, angle: -65)
    // A fine white edge keeps the blue visible over dark and blue backgrounds.
    NSColor.white.withAlphaComponent(0.85).setStroke()
    dot.lineWidth = 0.75
    dot.stroke()
  }
}
