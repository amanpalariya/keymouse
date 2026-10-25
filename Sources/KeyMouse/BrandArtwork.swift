import AppKit

/// A cursor contained in a keycap, shared by the app and menu bar.
enum BrandArtwork {
  static let accent = NSColor(srgbRed: 0.44, green: 0.25, blue: 0.95, alpha: 1)
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
      roundedRect: NSRect(x: 2, y: 2, width: 28, height: 28), xRadius: 6, yRadius: 6)
    key.lineWidth = 2
    key.stroke()
    let pointer = NSBezierPath()
    pointer.move(to: CGPoint(x: 11, y: 25))
    for point in [
      CGPoint(x: 23, y: 14), CGPoint(x: 17.8, y: 13.1), CGPoint(x: 20.7, y: 7.1),
      CGPoint(x: 17.5, y: 5.5), CGPoint(x: 14.4, y: 11.8), CGPoint(x: 10.8, y: 8.4),
    ] {
      pointer.line(to: point)
    }
    pointer.close()
    color.setFill()
    pointer.fill()
  }
}
