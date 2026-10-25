import AppKit
import QuartzCore

/// Runs on the main run loop at the refresh rate of the display containing the pointer.
final class DisplayRefreshLoop: NSObject {
  private var link: CADisplayLink?
  private var displayID: CGDirectDisplayID?
  private var previousTarget: CFTimeInterval?
  private let onFrame: (TimeInterval) -> Void

  init(onFrame: @escaping (TimeInterval) -> Void) { self.onFrame = onFrame }

  func followCursor(at point: CGPoint) {
    let screen =
      NSScreen.screens.first { screen in
        guard let id = screen.displayID else { return false }
        return CGDisplayBounds(id).contains(point)
      } ?? NSScreen.screens.first
    guard let screen else { return }
    guard link == nil || displayID != screen.displayID else { return }
    stop()
    displayID = screen.displayID
    let link = screen.displayLink(target: self, selector: #selector(frame(_:)))
    let refreshRate = Float(screen.maximumFramesPerSecond)
    link.preferredFrameRateRange = CAFrameRateRange(
      minimum: refreshRate, maximum: refreshRate, preferred: refreshRate)
    link.add(to: .main, forMode: .common)
    self.link = link
  }

  func stop() {
    link?.invalidate()
    link = nil
    displayID = nil
    previousTarget = nil
  }

  @objc private func frame(_ link: CADisplayLink) {
    let previous = previousTarget ?? link.timestamp
    previousTarget = link.targetTimestamp
    onFrame(min(0.05, max(0, link.targetTimestamp - previous)))
  }
}

extension NSScreen {
  var displayID: CGDirectDisplayID? {
    deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? CGDirectDisplayID
  }
}
