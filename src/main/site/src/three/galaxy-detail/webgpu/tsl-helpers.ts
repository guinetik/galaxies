/**
 * TSL Shader Helper Functions for Galaxy Simulation
 *
 * Reusable GPU functions written in Three.js Shading Language (TSL).
 * These compile to GPU code and run on the GPU.
 */

import {
  vec2,
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
  dot,
  floor,
  mix,
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

/**
 * 3D hash for ray jitter — maps vec3 → float.
 */
export const hash13 = Fn(([p]: [any]) => {
  const fp: any = fract(p.mul(vec3(0.16532, 0.17369, 0.15787))).toVar()
  fp.addAssign(dot(fp, fp.yzx.add(19.19)))
  return fract(fp.x.mul(fp.y).mul(fp.z))
})

/**
 * 2D hash — maps vec2 → float.
 */
export const hash2d = Fn(([p]: [any]) => {
  return fract(cos(dot(p, vec2(2.31, 53.21)).mul(124.123)).mul(412.0))
})

// ==============================================================================
// NOISE
// ==============================================================================

/**
 * 2D value noise with smooth bilinear interpolation.
 */
export const noise2d = Fn(([p]: [any]) => {
  const i: any = floor(p)
  const f: any = fract(p)
  const u: any = f.mul(f).mul(float(3.0).sub(f.mul(2.0)))
  return mix(
    mix(hash2d(i), hash2d(i.add(vec2(1.0, 0.0))), u.x),
    mix(hash2d(i.add(vec2(0.0, 1.0))), hash2d(i.add(vec2(1.0, 1.0))), u.x),
    u.y,
  )
})

/**
 * 3D value noise with smooth trilinear interpolation.
 * Returns approximately -1..1, matching the GLSL helper used by the BH shader.
 */
export const noise3d = Fn(([p]: [any]) => {
  const i: any = floor(p)
  const f: any = fract(p)
  const u: any = f.mul(f).mul(float(3.0).sub(f.mul(2.0)))

  const n000 = hash13(i.add(vec3(0.0, 0.0, 0.0)))
  const n100 = hash13(i.add(vec3(1.0, 0.0, 0.0)))
  const n010 = hash13(i.add(vec3(0.0, 1.0, 0.0)))
  const n110 = hash13(i.add(vec3(1.0, 1.0, 0.0)))
  const n001 = hash13(i.add(vec3(0.0, 0.0, 1.0)))
  const n101 = hash13(i.add(vec3(1.0, 0.0, 1.0)))
  const n011 = hash13(i.add(vec3(0.0, 1.0, 1.0)))
  const n111 = hash13(i.add(vec3(1.0, 1.0, 1.0)))

  const nx00 = mix(n000, n100, u.x)
  const nx10 = mix(n010, n110, u.x)
  const nx01 = mix(n001, n101, u.x)
  const nx11 = mix(n011, n111, u.x)
  const nxy0 = mix(nx00, nx10, u.y)
  const nxy1 = mix(nx01, nx11, u.y)

  return mix(nxy0, nxy1, u.z).mul(2.0).sub(1.0)
})

// ==============================================================================
// SIGNED DISTANCE FIELDS
// ==============================================================================

/**
 * Sphere SDF — distance from point to sphere surface.
 */
export const sdSphere = Fn(([p, s]: [any, any]) => {
  return length(p).sub(s)
})

/**
 * Torus SDF — ring shape centered at origin.
 * t.x = major radius, t.y = minor radius
 */
export const sdTorus = Fn(([p, t]: [any, any]) => {
  const q = vec2(length(p.xz).sub(t.x), p.y)
  return length(q).sub(t.y)
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
