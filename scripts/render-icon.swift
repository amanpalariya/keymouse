import AppKit

@main
struct RenderIcon {
  static func main() throws {
    let source = NSImage(contentsOfFile: CommandLine.arguments[2])!
    let destination = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
    try FileManager.default.createDirectory(at: destination, withIntermediateDirectories: true)
    for size in [16, 32, 128, 256, 512] {
      for scale in [1, 2] {
        let pixels = size * scale
        let image = source
        let bitmap = NSBitmapImageRep(
          bitmapDataPlanes: nil, pixelsWide: pixels, pixelsHigh: pixels,
          bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
          colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
        image.draw(in: NSRect(x: 0, y: 0, width: pixels, height: pixels))
        NSGraphicsContext.restoreGraphicsState()
        let suffix = scale == 2 ? "@2x" : ""
        let data = bitmap.representation(using: .png, properties: [:])!
        try data.write(to: destination.appendingPathComponent("icon_\(size)x\(size)\(suffix).png"))
      }
    }
  }
}
