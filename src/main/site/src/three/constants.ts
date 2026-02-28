import type { MorphologyClass } from '@/types/galaxy'

/** Radius of the celestial sphere galaxies are placed on */
export const SPHERE_RADIUS = 500

/** Earth sphere radius (slightly smaller than its Y offset so only the top arc is visible) */
export const EARTH_RADIUS = 580

/** Earth sphere Y position (sunken below camera) */
export const EARTH_Y_OFFSET = -600

/** Camera field-of-view limits (degrees) */
export const CAMERA_FOV_MIN = 3
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

/** Observer location on Earth */
export interface ObserverLocation {
  latitude: number
  longitude: number
}

export const LOCATIONS: Record<string, ObserverLocation> = {
  'North Pole':       { latitude: 90,     longitude: 0 },
  'New York':         { latitude: 40.71,  longitude: -74.01 },
  'London':           { latitude: 51.51,  longitude: -0.13 },
  'São Paulo':        { latitude: -23.55, longitude: -46.63 },
  'Cape Town':        { latitude: -33.92, longitude: 18.42 },
  'Sydney':           { latitude: -33.87, longitude: 151.21 },
  'South Pole':       { latitude: -90,    longitude: 0 },
}

export const DEFAULT_LOCATION = 'North Pole'

/** Base colors per morphology class — neon palette for visibility against white stars */
export const MORPHOLOGY_COLORS: Record<MorphologyClass, [number, number, number]> = {
  elliptical: [1.0, 0.2, 0.3],    // neon red-pink
  lenticular: [1.0, 0.5, 0.0],    // neon orange
  spiral:     [0.2, 0.6, 1.0],    // electric blue
  barred:     [0.7, 0.2, 1.0],    // neon purple
  irregular:  [0.0, 1.0, 0.6],    // neon green
  unknown:    [0.3, 0.8, 1.0],    // cyan
}
