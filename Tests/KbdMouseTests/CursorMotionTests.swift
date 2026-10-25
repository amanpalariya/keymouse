import XCTest

@testable import KbdMouse

final class CursorMotionTests: XCTestCase {
  private let display = CGRect(x: 0, y: 0, width: 1920, height: 1080)

  func testFractionalMovementAccumulatesAcrossFrames() {
    var motion = CursorMotion()
    motion.synchronize(to: CGPoint(x: 100, y: 100))
    for _ in 0..<120 {
      _ = motion.advance(direction: CGVector(dx: 1, dy: 0), distance: 0.125, displays: [display])
    }
    XCTAssertEqual(motion.position!.x, 115, accuracy: 0.0001)
  }

  func testDistanceIsIndependentOfDisplayRefreshRate() {
    for refreshRate in [60, 120, 144] {
      var motion = CursorMotion()
      motion.synchronize(to: CGPoint(x: 100, y: 100))
      for _ in 0..<refreshRate {
        _ = motion.advance(
          direction: CGVector(dx: 1, dy: 0),
          distance: 650 / Double(refreshRate), displays: [display])
      }
      XCTAssertEqual(motion.position!.x, 750, accuracy: 0.0001)
    }
  }

  func testPhysicalMovementResetsTheMovementOrigin() {
    var motion = CursorMotion()
    motion.synchronize(to: CGPoint(x: 100, y: 100))
    _ = motion.advance(direction: CGVector(dx: 1, dy: 0), distance: 10, displays: [display])
    motion.synchronize(to: CGPoint(x: 500, y: 500))
    let next = motion.advance(direction: CGVector(dx: 0, dy: 1), distance: 5, displays: [display])
    XCTAssertEqual(next, CGPoint(x: 500, y: 505))
  }

  func testClampingSupportsNegativeDisplayCoordinatesAndGaps() {
    let left = CGRect(x: -1280, y: 0, width: 1280, height: 800)
    XCTAssertEqual(
      CursorMotion.clamped(CGPoint(x: -100, y: 50), to: [left, display]),
      CGPoint(x: -100, y: 50))
    XCTAssertEqual(
      CursorMotion.clamped(CGPoint(x: -1400, y: 50), to: [left, display]),
      CGPoint(x: -1280, y: 50))
    XCTAssertEqual(
      CursorMotion.clamped(CGPoint(x: 3000, y: 50), to: [left, display]),
      CGPoint(x: 1919, y: 50))
  }
}
