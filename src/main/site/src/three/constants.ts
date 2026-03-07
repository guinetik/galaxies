import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'

/** Radius of the celestial sphere galaxies are placed on */
export const SPHERE_RADIUS = 500

/** Earth sphere radius (slightly smaller than its Y offset so only the top arc is visible) */
export const EARTH_RADIUS = 580

/** Earth sphere Y position (sunken below camera) */
export const EARTH_Y_OFFSET = -600

/** Camera field-of-view limits (degrees).
 * Default/max ≤60° avoids perspective distortion on Earth horizon (oval → circular arc). */
export const CAMERA_FOV_MIN = 1
export const CAMERA_FOV_MAX = 60
export const CAMERA_FOV_DEFAULT = 55

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
 * Flatter curve = less LY per zoom level = fewer galaxies visible per scroll tick.
 * Combined with slower wheel speed for more scroll depth.
 */
export const REDSHIFT_RANGES: [number, number][] = [
  [60, 0.0000],  // Max FOV: no galaxies (Earth arc visible, no distortion)
  [74, 0.0001],  // ~0.3 MLY
  [73, 0.0002],  // ~0.7 MLY
  [72, 0.00035], // ~1.2 MLY
  [70, 0.0006],  // ~2 MLY
  [68, 0.0009],  // ~3 MLY
  [66, 0.0012],  // ~4 MLY
  [64, 0.0015],  // ~5 MLY
  [62, 0.0018],  // ~6 MLY
  [60, 0.0021],  // ~7 MLY
  [58, 0.0024],
  [55, 0.0028],
  [52, 0.0033],
  [49, 0.0039],
  [46, 0.0045],
  [43, 0.0052],
  [40, 0.0060],
  [37, 0.0069],
  [34, 0.0075],
  [31, 0.0086],
  [28, 0.0096],
  [26, 0.0106],
  [24, 0.0117],
  [22, 0.0128],
  [20, 0.0139],
  [18, 0.0151],
  [17, 0.0161],
  [16, 0.0173],
  [14, 0.0188],
  [13, 0.0200],
  [12, 0.0213],
  [11, 0.0228],
  [10, 0.0244],
  [9,  0.0262],
  [8,  0.0280],
  [7,  0.0306],
  [6,  0.0332],
  [5,  0.0376],
  [4,  0.0425],
  [3,  0.072],
  [2,  0.095],
  [1,  0.155],  // Full deep field at max zoom
]

/**
 * Maps FOV brackets to minimum visible redshift.
 * Used to fade out nearby galaxies when zooming in to deep fields.
 * Lags behind REDSHIFT_RANGES to keep a "window" of visibility.
 * Scaled with REDSHIFT_RANGES for fewer galaxies per zoom level.
 */
export const MIN_REDSHIFT_RANGES: [number, number][] = [
  [60, 0.0000],
  [58, 0.0000],
  [73, 0.0000],
  [72, 0.0000],
  [70, 0.0000],
  [68, 0.0000],
  [66, 0.0000],
  [64, 0.0000],
  [62, 0.0000],
  [60, 0.0000],
  [58, 0.0000],
  [55, 0.00004],
  [52, 0.00008],
  [49, 0.00016],
  [46, 0.00024],
  [43, 0.00036],
  [40, 0.00052],
  [37, 0.00075],
  [34, 0.00075],
  [31, 0.00095],
  [28, 0.00115],
  [26, 0.00135],
  [24, 0.0016],
  [22, 0.00185],
  [20, 0.0021],
  [18, 0.00245],
  [17, 0.00265],
  [16, 0.0029],
  [14, 0.0033],
  [13, 0.0035],
  [12, 0.0038],
  [11, 0.0041],
  [10, 0.0045],
  [9,  0.0050],
  [8,  0.0055],
  [7,  0.0062],
  [6,  0.0069],
  [5,  0.0080],
  [4,  0.0095],
  [3,  0.0155],
  [2,  0.0220],
  [1,  0.0336],
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

/**
 * Base tint colors per morphology class.
 * These post-multiply the ring-loop's blue-white dust, so:
 *   cool tints (high blue) → preserve blue dust → young star populations
 *   warm tints (high red) → warm the dust → old star populations
 * Matched to research/galaxy-generator/buffer-a.glsl palette.
 */
export const MORPHOLOGY_COLORS: Record<MorphologyCategory, [number, number, number]> = {
  spiral:     [0.75, 0.82, 1.00], // cool blue — young O/B star arms
  barred:     [1.00, 0.85, 0.55], // warm gold — older bar + blue arms
  elliptical: [1.00, 0.65, 0.38], // red-orange — old K/M star population
  lenticular: [1.00, 0.78, 0.50], // warm yellow — transitional population
  irregular:  [0.78, 0.68, 1.00], // blue-violet — starburst + HII emission
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
