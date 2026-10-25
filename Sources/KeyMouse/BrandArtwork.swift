import AppKit

/// Shared app artwork and the menu bar's template symbol.
enum BrandArtwork {
  static let accent = NSColor(srgbRed: 0.15, green: 0.4, blue: 0.96, alpha: 1)
  static let activeGradient = NSGradient(
    starting: NSColor(srgbRed: 0.08, green: 0.75, blue: 0.98, alpha: 1),
    ending: NSColor(srgbRed: 0.02, green: 0.2, blue: 0.96, alpha: 1))!

  static func symbol(
    size: CGFloat, color: NSColor = .labelColor, template: Bool = false, filled: Bool = true
  ) -> NSImage
  {
    let image = NSImage(size: NSSize(width: size, height: size), flipped: false) { rect in
      let transform = NSAffineTransform()
      transform.scale(by: rect.width / 28)
      transform.translateX(by: -2, yBy: -2)
      transform.concat()
      drawOutline(color: color, filled: filled)
      return true
    }
    image.isTemplate = template
    return image
  }

  static func appIcon(size: CGFloat) -> NSImage {
    let image = iconResource().flatMap { NSImage(contentsOf: $0) } ?? NSImage()
    image.size = NSSize(width: size, height: size)
    return image
  }

  private static func iconResource() -> URL? {
    if let url = Bundle.main.url(forResource: "AppIcon", withExtension: "png") {
      return url
    }
    #if SWIFT_PACKAGE
      return Bundle.module.url(forResource: "AppIcon", withExtension: "png")
    #else
      return nil
    #endif
  }

  private static func drawOutline(color: NSColor, filled: Bool) {
    color.setFill()
    let frame = NSBezierPath(
      roundedRect: NSRect(x: 3, y: 3, width: 26, height: 26), xRadius: 6, yRadius: 6)
    frame.windingRule = .evenOdd
    frame.append(
      NSBezierPath(
        roundedRect: NSRect(x: 4.4, y: 5.8, width: 23.2, height: 21.8), xRadius: 4.6, yRadius: 4.6))
    frame.fill()
    let cursor = cursorPath()
    if filled {
      cursor.fill()
    } else {
      color.setStroke()
      cursor.lineWidth = 1.4
      cursor.lineJoinStyle = .round
      cursor.stroke()
    }
  }

  private static func cursorPath() -> NSBezierPath {
    let path = NSBezierPath()
    path.move(to: CGPoint(x: 11, y: 24))
    for point in [
      CGPoint(x: 22, y: 16), CGPoint(x: 17, y: 15.4), CGPoint(x: 19.3, y: 10.7),
      CGPoint(x: 16.8, y: 9.5), CGPoint(x: 14.5, y: 14.2), CGPoint(x: 11, y: 10.8),
    ] { path.line(to: point) }
    path.close()
    return path
  }
}
