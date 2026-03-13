// ─────────────────────────────────────────────────────────────────────────────
// Galaxy Morphology — shared types and Hubble-sequence presets
//
// Defines a flat parameter struct consumed by both WebGL and WebGPU renderers.
// Spatial parameters are expressed as fractions of galaxyRadius so renderers
// can scale them to any absolute size.
// ─────────────────────────────────────────────────────────────────────────────

import type { BandFeatureProfile } from '../bandProfile'

/**
 * The 10 Hubble-sequence preset keys.
 *
 * Unbarred spirals: spiralSa (SAa), spiral (SAb), grandDesign (SAc), flocculent (SAd)
 * Barred spirals:   barredTight (SBa), barred (SBb), barredOpen (SBc)
 */
export type MorphologyPreset =
  | 'elliptical'
  | 'lenticular'
  | 'spiralSa'
  | 'spiral'
  | 'grandDesign'
  | 'flocculent'
  | 'barredTight'
  | 'barred'
  | 'barredOpen'
  | 'irregular'

/** Broad morphological categories (used for sky-view icon selection). */
export type MorphologyCategory =
  | 'elliptical'
  | 'lenticular'
  | 'spiral'
  | 'barred'
  | 'irregular'

/**
 * Flat parameter struct describing galaxy morphology.
 *
 * All spatial dimensions (armWidth, bulgeRadius, barLength, barWidth,
 * spiralStart) are expressed as fractions of galaxyRadius (0-1).
 * Non-spatial parameters (spiralTightness, ellipticity, axisRatio,
 * irregularity, fieldStarFraction, bulgeFraction, diskThickness)
 * are unitless ratios or absolute values where noted.
 */
export interface GalaxyMorphology {
  /** Which of the 10 presets this morphology is based on. */
  preset: MorphologyPreset

  // ── Arm geometry ───────────────────────────────────────────────────────────
  /** Number of spiral arms (0 for elliptical / irregular). */
  numArms: number
  /** Half-width of each arm, as a fraction of galaxyRadius. */
  armWidth: number
  /** Logarithmic spiral pitch (radians per unit radius). Not a fraction. */
  spiralTightness: number
  /** Radial offset where arms begin, as a fraction of galaxyRadius. */
  spiralStart: number

  // ── Bulge ──────────────────────────────────────────────────────────────────
  /** Bulge half-light radius, as a fraction of galaxyRadius. */
  bulgeRadius: number
  /** Fraction of total luminosity in the bulge (lenticular only). */
  bulgeFraction: number
  /** Disk scale-height, as a fraction of galaxyRadius (lenticular only). */
  diskThickness: number

  // ── Bar ────────────────────────────────────────────────────────────────────
  /** Bar semi-major axis, as a fraction of galaxyRadius. 0 = no bar. */
  barLength: number
  /** Bar semi-minor axis, as a fraction of galaxyRadius. */
  barWidth: number

  // ── Shape ──────────────────────────────────────────────────────────────────
  /** Ellipticity (1 - b/a) for elliptical galaxies. */
  ellipticity: number
  /** Axis ratio b/a for elliptical galaxies. */
  axisRatio: number
  /** Degree of asymmetric distortion [0, 1]. */
  irregularity: number
  /** Number of star-forming clumps (irregular galaxies). */
  clumpCount: number

  // ── Population mix ─────────────────────────────────────────────────────────
  /** Fraction of stars in the diffuse field (not in arms). */
  fieldStarFraction: number
}

/**
 * Complete render parameters: morphology preset + absolute sizing.
 * Renderers multiply fractional morphology values by galaxyRadius
 * to get world-space dimensions.
 */
export interface GalaxyRenderParams {
  /** Morphology shape parameters (fractional). */
  morphology: GalaxyMorphology
  /** Optional photometric feature vector extracted from real multi-band imagery. */
  bandProfile?: BandFeatureProfile | null
  /** Absolute galaxy radius in renderer units. */
  galaxyRadius: number
  /** Total particle count. */
  starCount: number
  /** Physical diameter in kiloparsecs. */
  diameterKpc: number
  /** How the size was determined. */
  sizeSource: 'observed' | 'mass' | 'random'
}

// ─── Category mapping ────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<MorphologyPreset, MorphologyCategory> = {
  elliptical: 'elliptical',
  lenticular: 'lenticular',
  spiralSa: 'spiral',
  spiral: 'spiral',
  grandDesign: 'spiral',
  flocculent: 'spiral',
  barredTight: 'barred',
  barred: 'barred',
  barredOpen: 'barred',
  irregular: 'irregular',
}

/** Map a preset key to its broad morphological category. */
export function presetToCategory(preset: MorphologyPreset): MorphologyCategory {
  return CATEGORY_MAP[preset]
}

// ─── Presets ─────────────────────────────────────────────────────────────────
//
// Values are derived from the GCanvas demo (galaxy.config.js) with absolute
// pixel values normalized to fractions of each preset's galaxyRadius.
// Reference radii: elliptical 320, lenticular 300, spiralSa 320, spiral 350,
// grandDesign 380, flocculent 360, barredTight 320, barred 350,
// barredOpen 380, irregular 280.
// ─────────────────────────────────────────────────────────────────────────────

/** Default zero-valued morphology — a convenient starting point. */
const BASE: Omit<GalaxyMorphology, 'preset'> = {
  numArms: 0,
  armWidth: 0,
  spiralTightness: 0,
  spiralStart: 0,
  bulgeRadius: 0,
  bulgeFraction: 0,
  diskThickness: 0,
  barLength: 0,
  barWidth: 0,
  ellipticity: 0,
  axisRatio: 1,
  irregularity: 0,
  clumpCount: 0,
  fieldStarFraction: 0,
}

export const MORPHOLOGY_PRESETS: Record<MorphologyPreset, GalaxyMorphology> = {
  // ── Elliptical (E) ─────────────────────────────────────────────────────────
  elliptical: {
    ...BASE,
    preset: 'elliptical',
    ellipticity: 0.6,
    axisRatio: 0.7,
    fieldStarFraction: 1.0,
  },

  // ── Lenticular (S0) ───────────────────────────────────────────────────────
  lenticular: {
    ...BASE,
    preset: 'lenticular',
    bulgeRadius: 0.267,       // 80 / 300
    bulgeFraction: 0.4,
    diskThickness: 0.013,     // 4 / 300
  },

  // ── Tight Spiral (SAa) ────────────────────────────────────────────────────
  spiralSa: {
    ...BASE,
    preset: 'spiralSa',
    numArms: 2,
    armWidth: 0.078,          // 25 / 320
    spiralTightness: 0.14,
    spiralStart: 0.156,       // 50 / 320
    bulgeRadius: 0.219,       // 70 / 320
    fieldStarFraction: 0.08,
  },

  // ── Spiral (SAb) ──────────────────────────────────────────────────────────
  spiral: {
    ...BASE,
    preset: 'spiral',
    numArms: 2,
    armWidth: 0.114,          // 40 / 350
    spiralTightness: 0.25,
    spiralStart: 0.086,       // 30 / 350
    bulgeRadius: 0.100,       // 35 / 350
    fieldStarFraction: 0.15,
  },

  // ── Grand Design (SAc) ────────────────────────────────────────────────────
  grandDesign: {
    ...BASE,
    preset: 'grandDesign',
    numArms: 2,
    armWidth: 0.145,          // 55 / 380
    spiralTightness: 0.22,
    spiralStart: 0.066,       // 25 / 380
    fieldStarFraction: 0.12,
  },

  // ── Flocculent (SAd) ──────────────────────────────────────────────────────
  flocculent: {
    ...BASE,
    preset: 'flocculent',
    numArms: 4,
    armWidth: 0.181,          // 65 / 360
    spiralTightness: 0.3,
    spiralStart: 0.111,       // 40 / 360
    irregularity: 0.15,
    fieldStarFraction: 0.25,
  },

  // ── Barred Tight (SBa) ────────────────────────────────────────────────────
  barredTight: {
    ...BASE,
    preset: 'barredTight',
    numArms: 2,
    armWidth: 0.094,          // 30 / 320
    spiralTightness: 0.16,
    spiralStart: 0.188,       // 60 / 320
    bulgeRadius: 0.156,       // 50 / 320
    barLength: 0.438,         // 140 / 320
    barWidth: 0.094,          // 30 / 320
    fieldStarFraction: 0.06,
  },

  // ── Barred Spiral (SBb) ───────────────────────────────────────────────────
  barred: {
    ...BASE,
    preset: 'barred',
    numArms: 2,
    armWidth: 0.129,          // 45 / 350
    spiralTightness: 0.28,
    spiralStart: 0.143,       // 50 / 350
    bulgeRadius: 0.100,       // 35 / 350
    barLength: 0.343,         // 120 / 350
    barWidth: 0.071,          // 25 / 350
    fieldStarFraction: 0.1,
  },

  // ── Barred Open (SBc) ─────────────────────────────────────────────────────
  barredOpen: {
    ...BASE,
    preset: 'barredOpen',
    numArms: 2,
    armWidth: 0.158,          // 60 / 380
    spiralTightness: 0.35,
    spiralStart: 0.105,       // 40 / 380
    barLength: 0.237,         // 90 / 380
    barWidth: 0.053,          // 20 / 380
    fieldStarFraction: 0.18,
  },

  // ── Irregular (Irr) ───────────────────────────────────────────────────────
  irregular: {
    ...BASE,
    preset: 'irregular',
    irregularity: 0.8,
    clumpCount: 5,
    fieldStarFraction: 1.0,
  },
}
