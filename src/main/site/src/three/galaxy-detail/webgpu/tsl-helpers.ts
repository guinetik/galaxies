/**
 * TSL Shader Helper Functions for Galaxy Simulation
 *
 * Reusable GPU functions written in Three.js Shading Language (TSL).
 * These compile to GPU code and run on the GPU.
 */

import {
  vec3,
  float,
  Fn,
  length,
  normalize,
  sin,
  cos,
  fract,
  max,
  min,
  pow,
} from 'three/tsl'

// ==============================================================================
// RANDOM NUMBER GENERATION
// ==============================================================================

/**
 * Improved hash function for pseudo-random number generation.
 * Avoids precision loss with large seed values by normalizing first.
 */
export const hash = Fn(([seed]: [any]) => {
  const p = fract(seed.mul(0.1031))
  const h = p.add(19.19)
  const x = fract(h.mul(h.add(47.43)).mul(p))
  return x
})

// ==============================================================================
// ROTATION & PHYSICS
// ==============================================================================

/**
 * Rotates a position (x, z) around the Y-axis.
 */
export const rotateXZ = Fn(([position, angle]: [any, any]) => {
  const cosTheta = cos(angle)
  const sinTheta = sin(angle)
  const newX = position.x.mul(cosTheta).sub(position.z.mul(sinTheta))
  const newZ = position.x.mul(sinTheta).add(position.z.mul(cosTheta))
  return vec3(newX, position.y, newZ)
})

/**
 * Applies differential rotation based on distance from center.
 * Uses the project's Keplerian-like formula:
 *   baseSpeed / pow(max(r, refRadius) / refRadius, 0.35)
 */
export const applyDifferentialRotation = Fn(
  ([position, rotationSpeed, deltaTime]: [any, any, any]) => {
    const distFromCenter = length(vec3(position.x, float(0), position.z))
    const refRadius = float(20.0)
    const normalizedR = max(distFromCenter, refRadius).div(refRadius)
    const rotationFactor = float(1.0).div(pow(normalizedR, float(0.35)))
    const angularSpeed = rotationSpeed.mul(rotationFactor).mul(deltaTime).negate()
    return rotateXZ(position, angularSpeed)
  },
)

/**
 * Calculates mouse interaction force (repulsion).
 */
export const applyMouseForce = Fn(
  ([position, mouse, mouseActive, mouseForce, mouseRadius, deltaTime]: [
    any, any, any, any, any, any,
  ]) => {
    const toMouse = mouse.sub(position)
    const distToMouse = length(toMouse)
    const mouseInfluence = mouseActive.mul(
      max(float(0.0), float(1.0).sub(distToMouse.div(mouseRadius))),
    )
    const mouseDir = normalize(toMouse)
    return mouseDir.mul(mouseForce).mul(mouseInfluence).mul(deltaTime).negate()
  },
)

/**
 * Applies spring force to restore particle to original position (Hooke's law).
 */
export const applySpringForce = Fn(
  ([currentPos, targetPos, strength, deltaTime]: [any, any, any, any]) => {
    const toTarget = targetPos.sub(currentPos)
    return toTarget.mul(strength).mul(deltaTime)
  },
)

// ==============================================================================
// COLOR CONVERSION
// ==============================================================================

/**
 * HSL to RGB conversion in TSL.
 * h: 0-1, s: 0-1, l: 0-1 → returns vec3 RGB
 */
export const hslToRgb = Fn(([h, s, l]: [any, any, any]) => {
  const a = s.mul(min(l, float(1.0).sub(l)))

  // f(n) = l - a * max(min(k-3, 9-k, 1), -1) where k = (n + h*12) % 12
  const k0 = fract(h.mul(12.0).add(0.0).div(12.0)).mul(12.0)
  const k8 = fract(h.mul(12.0).add(8.0).div(12.0)).mul(12.0)
  const k4 = fract(h.mul(12.0).add(4.0).div(12.0)).mul(12.0)

  const f0 = l.sub(a.mul(max(min(min(k0.sub(3.0), float(9.0).sub(k0)), float(1.0)), float(-1.0))))
  const f8 = l.sub(a.mul(max(min(min(k8.sub(3.0), float(9.0).sub(k8)), float(1.0)), float(-1.0))))
  const f4 = l.sub(a.mul(max(min(min(k4.sub(3.0), float(9.0).sub(k4)), float(1.0)), float(-1.0))))

  return vec3(f0, f8, f4)
})
