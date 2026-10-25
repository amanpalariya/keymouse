import AppKit

/// Shared app artwork and the menu bar's template symbol.
enum BrandArtwork {
  static let accent = NSColor(srgbRed: 0.15, green: 0.4, blue: 0.96, alpha: 1)

  static func symbol(size: CGFloat, color: NSColor = .labelColor, template: Bool = false) -> NSImage
  {
    let image = NSImage(size: NSSize(width: size, height: size), flipped: false) { rect in
      let transform = NSAffineTransform()
      transform.scale(by: rect.width / 32)
      transform.concat()
      drawOutline(color: color)
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

  private static func drawOutline(color: NSColor) {
    color.setFill()
    let frame = NSBezierPath(
      roundedRect: NSRect(x: 3, y: 3, width: 26, height: 26), xRadius: 6, yRadius: 6)
    frame.windingRule = .evenOdd
    frame.append(
      NSBezierPath(
        roundedRect: NSRect(x: 5, y: 7, width: 22, height: 20), xRadius: 4, yRadius: 4))
    frame.fill()
    color.setStroke()
    let cursor = cursorPath()
    cursor.lineWidth = 1.5
    cursor.lineJoinStyle = .round
    cursor.stroke()
  }

  private static func cursorPath() -> NSBezierPath {
    let path = NSBezierPath()
    path.move(to: CGPoint(x: 11, y: 24))
    for point in [
      CGPoint(x: 22, y: 16), CGPoint(x: 17.6, y: 15.5), CGPoint(x: 19.6, y: 11.5),
      CGPoint(x: 17.5, y: 10.5), CGPoint(x: 15.4, y: 14.5), CGPoint(x: 11, y: 11),
    ] { path.line(to: point) }
    path.close()
    return path
  }
}
