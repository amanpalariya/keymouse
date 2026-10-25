import AppKit

/// A keycap and pointer mark shared by the app, menu bar, and cursor badge.
enum BrandArtwork {
  static func symbol(size: CGFloat, color: NSColor = .labelColor, template: Bool = false) -> NSImage
  {
    let image = NSImage(size: NSSize(width: size, height: size), flipped: false) { rect in
      let transform = NSAffineTransform()
      transform.scale(by: rect.width / 32)
      transform.concat()
      drawMark(color: color)
      return true
    }
    image.isTemplate = template
    return image
  }

  static func appIcon(size: CGFloat) -> NSImage {
    NSImage(size: NSSize(width: size, height: size), flipped: false) { rect in
      let surface = NSBezierPath(
        roundedRect: rect.insetBy(dx: size * 0.06, dy: size * 0.06),
        xRadius: size * 0.2, yRadius: size * 0.2)
      NSGradient(
        starting: NSColor(srgbRed: 0.35, green: 0.35, blue: 0.98, alpha: 1),
        ending: NSColor(srgbRed: 0.52, green: 0.16, blue: 0.91, alpha: 1))?.draw(
          in: surface, angle: -70)
      let transform = NSAffineTransform()
      transform.translateX(by: size * 0.19, yBy: size * 0.19)
      transform.scale(by: size * 0.62 / 32)
      transform.concat()
      drawMark(color: .white)
      return true
    }
  }

  private static func drawMark(color: NSColor) {
    color.setStroke()
    let key = NSBezierPath(
      roundedRect: NSRect(x: 2, y: 8, width: 23, height: 22), xRadius: 5, yRadius: 5)
    key.lineWidth = 2
    key.stroke()
    let lines = NSBezierPath()
    lines.lineWidth = 2
    lines.lineCapStyle = .round
    for x in [7.0, 12.0, 17.0] {
      lines.move(to: CGPoint(x: x, y: 23))
      lines.line(to: CGPoint(x: x + 1, y: 23))
    }
    lines.move(to: CGPoint(x: 7, y: 17))
    lines.line(to: CGPoint(x: 13, y: 17))
    lines.stroke()
    let pointer = NSBezierPath()
    pointer.move(to: CGPoint(x: 17, y: 19))
    for point in [
      CGPoint(x: 30, y: 9), CGPoint(x: 24, y: 8), CGPoint(x: 27, y: 2),
      CGPoint(x: 23, y: 0), CGPoint(x: 20, y: 7), CGPoint(x: 16, y: 3),
    ] {
      pointer.line(to: point)
    }
    pointer.close()
    color.setFill()
    pointer.fill()
  }
}
