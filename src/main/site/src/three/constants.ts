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
export const CAMERA_FOV_DEFAULT = 75

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
 * Tuned for deep-field readability on CF4 (55,877 galaxies, max z ≈ 0.11):
 *   75° → very local neighborhood only
 *   55° → sparse nearby shells
 *   35° → moderate mid-depth population
 *   15° → dense but still readable deep field
 *    3° → full dataset
 *    3° →  55,877 galaxies (full deep field)
 */
export const REDSHIFT_RANGES: [number, number][] = [
  [75, 0.000005],
  [72, 0.0006],
  [68, 0.0015],
  [64, 0.0026],
  [58, 0.0043],
  [52, 0.0065],
  [46, 0.0093],
  [40, 0.0129],
  [34, 0.0172],
  [28, 0.0220],
  [24, 0.0268],
  [20, 0.0318],
  [17, 0.0368],
  [14, 0.0430],
  [12, 0.0488],
  [10, 0.0558],
  [8,  0.0640],
  [6,  0.0758],
  [5,  0.0858],
  [4,  0.0970],
  [3,  0.110],
]

/**
 * Maps FOV brackets to minimum visible redshift.
 * Used to fade out nearby galaxies when zooming in to deep fields.
 * Lags behind REDSHIFT_RANGES to keep a "window" of visibility.
 */
export const MIN_REDSHIFT_RANGES: [number, number][] = [
  [75, 0.0000], // Wide view: retain local anchors
  [72, 0.0000],
  [68, 0.0000],
  [64, 0.0000],
  [58, 0.0001],
  [52, 0.0002],
  [46, 0.0005],
  [40, 0.0010],
  [34, 0.0018],
  [28, 0.0029],
  [24, 0.0040],
  [20, 0.0054],
  [17, 0.0068],
  [14, 0.0088],
  [12, 0.0110],
  [10, 0.0138],
  [8,  0.0172],
  [6,  0.0216],
  [5,  0.0250],
  [4,  0.0298],
  [3,  0.0365], // Deep field: stronger local foreground trim
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
  elliptical: [1.00, 0.84, 0.62], // warm golden old stars
  lenticular: [0.95, 0.86, 0.74], // creamy-beige
  spiral:     [0.94, 0.80, 0.74], // warm disk with muted cool outskirts
  barred:     [0.95, 0.79, 0.72], // amber-neutral barred disk
  irregular:  [0.88, 0.76, 0.90], // magenta-leaning irregulars
  unknown:    [0.92, 0.80, 0.90], // warm-neutral unknowns
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
