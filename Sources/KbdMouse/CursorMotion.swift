import Foundation

/// Keeps fractional movement rather than feeding rounded system coordinates back into the next frame.
struct CursorMotion {
  private(set) var position: CGPoint?

  mutating func synchronize(to point: CGPoint) { position = point }

  mutating func advance(direction: CGVector, distance: Double, displays: [CGRect]) -> CGPoint? {
    guard let position else { return nil }
    let target = CGPoint(
      x: position.x + direction.dx * distance,
      y: position.y + direction.dy * distance)
    let next = Self.clamped(target, to: displays)
    self.position = next
    return next
  }

  static func clamped(_ point: CGPoint, to displays: [CGRect]) -> CGPoint {
    if displays.contains(where: { $0.contains(point) }) { return point }
    return displays.map {
      CGPoint(
        x: min(max(point.x, $0.minX), $0.maxX - 1),
        y: min(max(point.y, $0.minY), $0.maxY - 1))
    }.min { hypot($0.x - point.x, $0.y - point.y) < hypot($1.x - point.x, $1.y - point.y) } ?? point
  }
}
