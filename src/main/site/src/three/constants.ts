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
 * Interpolated smoothly (exponential) in fovToMaxRedshift().
 *
 * Tuned for CF4 dataset (55,877 galaxies, max z ≈ 0.11):
 *   75° →   ~560 galaxies (local neighborhood)
 *   65° → ~2,500 galaxies
 *   55° → ~5,600 galaxies
 *   45° → ~11,200 galaxies
 *   35° → ~22,000 galaxies
 *   25° → ~33,500 galaxies
 *   15° → ~44,700 galaxies
 *    8° → ~55,300 galaxies
 *    3° →  55,877 galaxies (full deep field)
 */
export const REDSHIFT_RANGES: [number, number][] = [
  [75, 0.003],
  [65, 0.007],
  [55, 0.015],
  [45, 0.025],
  [35, 0.040],
  [25, 0.060],
  [15, 0.080],
  [8,  0.100],
  [3,  0.110],
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

/** Base colors per morphology class — natural astrophotography-inspired palette */
export const MORPHOLOGY_COLORS: Record<MorphologyClass, [number, number, number]> = {
  elliptical: [0.96, 0.83, 0.68], // warm old stars
  lenticular: [0.88, 0.82, 0.74], // creamy-beige
  spiral:     [0.70, 0.81, 0.96], // cool blue disk
  barred:     [0.78, 0.77, 0.90], // bluish-lilac
  irregular:  [0.67, 0.83, 0.90], // young blue-white stars
  unknown:    [0.82, 0.82, 0.85], // neutral silver-white
}

/** Velocity color bins for the cosmic map — matches Tully et al. (2023) Figure 9 */
export const VELOCITY_COLOR_BINS: { label: string; max: number; color: [number, number, number] }[] = [
  { label: '< 0',       max: 0,     color: [0.55, 0.00, 1.00] },
  { label: '0–2k',      max: 2000,  color: [0.00, 0.00, 1.00] },
  { label: '2–4k',      max: 4000,  color: [0.00, 0.75, 1.00] },
  { label: '4–6k',      max: 6000,  color: [0.00, 0.80, 0.00] },
  { label: '6–8k',      max: 8000,  color: [1.00, 1.00, 0.00] },
  { label: '8–10k',     max: 10000, color: [1.00, 0.00, 0.00] },
  { label: '10–12k',    max: 12000, color: [0.80, 0.00, 0.00] },
  { label: '12–14k',    max: 14000, color: [1.00, 0.55, 0.00] },
  { label: '14k+',      max: Infinity, color: [0.55, 0.27, 0.07] },
]
