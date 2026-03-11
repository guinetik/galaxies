import type { Galaxy } from '@/types/galaxy'

const DEFAULT_TILT_X = -0.45
const MIN_AXIS_RATIO = 0.05
const DEG_TO_RAD = Math.PI / 180

type GalaxyOrientationInput = Pick<Galaxy, 'pgc' | 'position_angle' | 'axial_ratio' | 'ba'>

/**
 * Returns the deterministic fallback yaw used when no observed position angle exists.
 */
function getSeededYaw(galaxyPgc: number): number {
  return ((galaxyPgc * 2654435761 >>> 0) / 4294967296) * Math.PI * 2
}

/**
 * Returns the deterministic fallback tilt used when no observed axis ratio exists.
 */
function getSeededTilt(): number {
  return DEFAULT_TILT_X
}

/**
 * Converts an observed sky-plane position angle in degrees into the initial orbit yaw.
 */
function getObservedYaw(positionAngle: number | null): number | null {
  if (positionAngle == null || !Number.isFinite(positionAngle)) return null
  return positionAngle * DEG_TO_RAD
}

/**
 * Returns the first usable observed axis ratio across available catalogs.
 */
function getObservedAxisRatio(galaxy: GalaxyOrientationInput): number | null {
  if (galaxy.axial_ratio != null && Number.isFinite(galaxy.axial_ratio)) {
    return galaxy.axial_ratio
  }
  if (galaxy.ba != null && Number.isFinite(galaxy.ba)) {
    return galaxy.ba
  }
  return null
}

/**
 * Infers a camera tilt from the observed minor/major axis ratio.
 *
 * A face-on galaxy (b/a ~= 1) should start near a pole-on view, while an
 * edge-on galaxy (b/a ~= 0) should start near the disk plane. The clamp keeps
 * even edge-on cases slightly above the plane so the opening shot remains stable.
 */
function getObservedTilt(axisRatio: number | null): number | null {
  if (axisRatio == null || !Number.isFinite(axisRatio)) return null
  const clampedAxisRatio = Math.min(1, Math.max(MIN_AXIS_RATIO, axisRatio))
  return -Math.asin(clampedAxisRatio)
}

/**
 * Returns the initial orbit angles for a galaxy detail scene.
 *
 * Preference order:
 * 1. Explicit observed `position_angle` for yaw
 * 2. Observed `axial_ratio` or `ba` for inferred tilt
 * 3. Seeded fallback for any missing component
 */
export function getInitialOrbitAngles(galaxy: GalaxyOrientationInput): { initRotY: number, initTiltX: number } {
  const observedYaw = getObservedYaw(galaxy.position_angle)
  const observedTilt = getObservedTilt(getObservedAxisRatio(galaxy))

  return {
    initRotY: observedYaw ?? getSeededYaw(galaxy.pgc),
    initTiltX: observedTilt ?? getSeededTilt(),
  }
}
