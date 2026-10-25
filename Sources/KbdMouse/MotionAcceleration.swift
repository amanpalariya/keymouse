import Foundation

struct AccelerationSettings: Codable, Equatable {
  var enabled = true
  var rampTime: Double = 0.45
  var initialSpeed: Double = 0.18
  var decelerationEnabled = true
  var stopTime: Double = 0.12

  init() {}

  private enum CodingKeys: String, CodingKey {
    case enabled, rampTime, initialSpeed, decelerationEnabled, stopTime
  }

  init(from decoder: Decoder) throws {
    self.init()
    let values = try decoder.container(keyedBy: CodingKeys.self)
    enabled = try values.decodeIfPresent(Bool.self, forKey: .enabled) ?? enabled
    rampTime = try values.decodeIfPresent(Double.self, forKey: .rampTime) ?? rampTime
    initialSpeed = try values.decodeIfPresent(Double.self, forKey: .initialSpeed) ?? initialSpeed
    decelerationEnabled =
      try values.decodeIfPresent(Bool.self, forKey: .decelerationEnabled) ?? decelerationEnabled
    stopTime = try values.decodeIfPresent(Double.self, forKey: .stopTime) ?? stopTime
  }
}

/// Integrates the speed curve so travel distance doesn't depend on frame rate.
struct MotionAcceleration {
  private var heldTime: TimeInterval = 0
  private var previousDirection = CGVector.zero
  private var velocity = CGVector.zero
  private var releaseVelocity = CGVector.zero
  private var releaseTime: TimeInterval = 0

  mutating func reset() {
    heldTime = 0
    previousDirection = .zero
    velocity = .zero
    releaseVelocity = .zero
    releaseTime = 0
  }

  mutating func displacement(
    direction: CGVector, speed: Double, elapsed: TimeInterval,
    settings: AccelerationSettings
  ) -> CGVector {
    guard direction != .zero else { return decelerate(elapsed: elapsed, settings: settings) }
    resumeIfNeeded(direction: direction, speed: speed, settings: settings)
    let travel = distance(direction: direction, speed: speed, elapsed: elapsed, settings: settings)
    let fraction = settings.enabled ? speedFraction(at: heldTime, settings: settings) : 1
    velocity = CGVector(dx: direction.dx * speed * fraction, dy: direction.dy * speed * fraction)
    return CGVector(dx: direction.dx * travel, dy: direction.dy * travel)
  }

  private mutating func resumeIfNeeded(
    direction: CGVector, speed: Double,
    settings: AccelerationSettings
  ) {
    guard releaseTime > 0 else { return }
    let projected = (velocity.dx * direction.dx + velocity.dy * direction.dy) / max(1, speed)
    if projected > settings.initialSpeed && settings.enabled {
      let normalized = min(1, (projected - settings.initialSpeed) / (1 - settings.initialSpeed))
      heldTime = settings.rampTime * (0.5 - sin(asin(1 - 2 * normalized) / 3))
      previousDirection = direction
    }
    releaseTime = 0
    releaseVelocity = .zero
  }

  private mutating func decelerate(elapsed: TimeInterval, settings: AccelerationSettings)
    -> CGVector
  {
    guard settings.decelerationEnabled, velocity != .zero else {
      reset()
      return .zero
    }
    if releaseTime == 0 {
      releaseVelocity = velocity
      heldTime = 0
      previousDirection = .zero
    }
    let duration = max(0.01, settings.stopTime)
    let next = releaseTime + elapsed
    let integral =
      brakingIntegral(at: next, duration: duration)
      - brakingIntegral(at: releaseTime, duration: duration)
    let travel = CGVector(dx: releaseVelocity.dx * integral, dy: releaseVelocity.dy * integral)
    let progress = min(1, next / duration)
    let fraction = 1 - 3 * progress * progress + 2 * progress * progress * progress
    velocity = CGVector(dx: releaseVelocity.dx * fraction, dy: releaseVelocity.dy * fraction)
    releaseTime = next
    if next >= duration { reset() }
    return travel
  }

  private func brakingIntegral(at time: TimeInterval, duration: TimeInterval) -> Double {
    let t = min(1, time / duration)
    return duration * (t - pow(t, 3) + 0.5 * pow(t, 4))
  }

  private func speedFraction(at time: TimeInterval, settings: AccelerationSettings) -> Double {
    let t = min(1, time / max(0.01, settings.rampTime))
    return settings.initialSpeed + (1 - settings.initialSpeed) * (3 * t * t - 2 * t * t * t)
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
