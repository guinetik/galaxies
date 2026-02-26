import * as THREE from 'three'
import { REDSHIFT_RANGES } from './constants'

const DEG2RAD = Math.PI / 180

/**
 * Convert RA/Dec (degrees, J2000) to a 3D position on a celestial sphere.
 * Observer is at the center looking outward.
 */
export function raDecToPosition(raDeg: number, decDeg: number, radius: number): THREE.Vector3 {
  const ra = raDeg * DEG2RAD
  const dec = decDeg * DEG2RAD
  const cosDec = Math.cos(dec)
  return new THREE.Vector3(
    -radius * cosDec * Math.sin(ra),
     radius * Math.sin(dec),
    -radius * cosDec * Math.cos(ra)
  )
}

/**
 * Map apparent magnitude to point size (inverse linear).
 * Brighter (lower mag) → larger size.
 */
export function magnitudeToSize(mag: number | null, min = 1.0, max = 6.0): number {
  if (mag === null || mag === undefined) return 1.5
  const t = Math.max(0, Math.min(1, (mag - 8) / 10))
  return max - t * (max - min)
}

/**
 * Map current camera FOV to maximum visible redshift.
 * Uses smooth interpolation between defined breakpoints.
 */
export function fovToMaxRedshift(fov: number): number {
  const ranges = REDSHIFT_RANGES

  // Clamp to range
  if (fov >= ranges[0][0]) return ranges[0][1]
  if (fov <= ranges[ranges.length - 1][0]) return ranges[ranges.length - 1][1]

  // Find bracketing pair and interpolate
  for (let i = 0; i < ranges.length - 1; i++) {
    const [fov0, z0] = ranges[i]
    const [fov1, z1] = ranges[i + 1]
    if (fov <= fov0 && fov >= fov1) {
      const t = (fov0 - fov) / (fov0 - fov1)
      // Exponential interpolation for smoother transition
      return z0 * Math.pow(z1 / z0, t)
    }
  }

  return ranges[ranges.length - 1][1]
}
