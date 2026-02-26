import type { MorphologyClass } from '@/types/galaxy'

/** Radius of the celestial sphere galaxies are placed on */
export const SPHERE_RADIUS = 500

/** Earth sphere radius (slightly smaller than its Y offset so only the top arc is visible) */
export const EARTH_RADIUS = 580

/** Earth sphere Y position (sunken below camera) */
export const EARTH_Y_OFFSET = -600

/** Camera field-of-view limits (degrees) */
export const CAMERA_FOV_MIN = 10
export const CAMERA_FOV_MAX = 75
export const CAMERA_FOV_DEFAULT = 60

/** Camera clipping planes */
export const CAMERA_NEAR = 0.1
export const CAMERA_FAR = 2000

/** Camera starting position — at origin, slightly above Earth's pole */
export const CAMERA_POSITION: [number, number, number] = [0, 50, 0]

/**
 * Maps FOV brackets to maximum visible redshift.
 * Wider FOV = nearby only; narrower FOV = deeper field.
 * Interpolated smoothly in fovToMaxRedshift().
 */
export const REDSHIFT_RANGES: [number, number][] = [
  [75, 0.005],
  [60, 0.01],
  [40, 0.03],
  [20, 0.10],
  [10, 1.00],
]

/** Base colors per morphology class (hue in degrees) */
export const MORPHOLOGY_COLORS: Record<MorphologyClass, [number, number, number]> = {
  elliptical: [1.0, 0.85, 0.6],   // warm yellow
  lenticular: [1.0, 0.9, 0.75],   // warm white
  spiral:     [0.7, 0.85, 1.0],   // blue-white
  barred:     [0.8, 0.8, 1.0],    // light blue
  irregular:  [0.6, 0.8, 1.0],    // blue
  unknown:    [0.9, 0.9, 0.9],    // neutral white
}
