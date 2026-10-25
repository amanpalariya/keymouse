import Foundation

struct AccelerationSettings: Codable, Equatable {
  var enabled = true
  var rampTime: Double = 0.45
  var initialSpeed: Double = 0.18
}

/// Integrates the speed curve so travel distance doesn't depend on frame rate.
struct MotionAcceleration {
  private var heldTime: TimeInterval = 0
  private var previousDirection = CGVector.zero

  mutating func reset() {
    heldTime = 0
    previousDirection = .zero
  }

  mutating func distance(
    direction: CGVector, speed: Double, elapsed: TimeInterval,
    settings: AccelerationSettings
  ) -> Double {
    guard direction != .zero else {
      reset()
      return 0
    }
    if direction.dx * previousDirection.dx + direction.dy * previousDirection.dy < 0 {
      heldTime = 0
    }
    previousDirection = direction
    guard settings.enabled else {
      heldTime = 0
      return speed * elapsed
    }
    let nextTime = heldTime + elapsed
    let distance =
      speed
      * (integratedSpeed(at: nextTime, settings: settings)
        - integratedSpeed(at: heldTime, settings: settings))
    heldTime = min(nextTime, settings.rampTime)
    return distance
  }

  private func integratedSpeed(at time: TimeInterval, settings: AccelerationSettings) -> Double {
    let ramp = max(0.01, settings.rampTime)
    let fraction = min(time / ramp, 1)
    let eased = pow(fraction, 3) - 0.5 * pow(fraction, 4)
    return settings.initialSpeed * min(time, ramp)
      + (1 - settings.initialSpeed) * ramp * eased + max(0, time - ramp)
  }
}
