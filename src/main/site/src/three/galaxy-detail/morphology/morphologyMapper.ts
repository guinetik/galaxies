// ---------------------------------------------------------------------------
// Morphology Mapper -- Galaxy catalog data --> GalaxyRenderParams
//
// Maps real catalog fields (Hubble type, axial ratio, angular diameter,
// stellar mass) into the flat GalaxyRenderParams struct consumed by
// both WebGL and WebGPU renderers.
// ---------------------------------------------------------------------------

import type { Galaxy } from '@/types/galaxy'
import type { BandFeatureProfile } from '../bandProfile'
import {
  type MorphologyPreset,
  type GalaxyMorphology,
  type GalaxyRenderParams,
  MORPHOLOGY_PRESETS,
  presetToCategory,
} from './GalaxyMorphology'
import { parseMorphology } from './morphologyParser'

// -- Helpers -----------------------------------------------------------------

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Mulberry32 seeded PRNG -- returns a function that yields [0,1) floats. */
function mulberry32(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// -- selectPreset ------------------------------------------------------------

/**
 * Map a Hubble-type string to one of the 10 morphology presets.
 *
 * Uses parseMorphology() for robust parsing, then maps the structured
 * result to a preset key via stage-based rules:
 *
 *   Spiral stages:   1-2 --> spiralSa, 3-4 --> spiral, 5-6 --> grandDesign, 7-9 --> flocculent
 *   Barred stages:   1-2 --> barredTight, 3-4 --> barred, 5-9 --> barredOpen
 *   Elliptical/Lenticular/Irregular --> direct mapping
 */
export function selectPreset(hubble: string | null): MorphologyPreset {
  const parsed = parseMorphology(hubble)

  switch (parsed.type) {
    case 'elliptical':
      return 'elliptical'
    case 'lenticular':
      return 'lenticular'
    case 'irregular':
      return 'irregular'

    case 'spiral': {
      const s = parsed.hubbleStage
      if (s <= 2) return 'spiralSa'
      if (s <= 4) return 'spiral'
      if (s <= 6) return 'grandDesign'
      return 'flocculent'
    }

    case 'barred': {
      const s = parsed.hubbleStage
      if (s <= 2) return 'barredTight'
      if (s <= 4) return 'barred'
      return 'barredOpen'
    }
  }
}

// -- assignPresetFromPgc -----------------------------------------------------

/**
 * Weighted presets by approximate cosmic proportions.
 *
 *   ~35% spiral  (split: 8% spiralSa, 9% spiral, 10% grandDesign, 8% flocculent)
 *   ~35% barred  (split: 10% barredTight, 13% barred, 12% barredOpen)
 *   ~15% elliptical
 *   ~10% lenticular
 *    ~5% irregular
 */
const WEIGHTED_PRESETS: { preset: MorphologyPreset; cumWeight: number }[] = [
  { preset: 'spiralSa',    cumWeight: 0.08 },
  { preset: 'spiral',      cumWeight: 0.17 },
  { preset: 'grandDesign', cumWeight: 0.27 },
  { preset: 'flocculent',  cumWeight: 0.35 },
  { preset: 'barredTight', cumWeight: 0.45 },
  { preset: 'barred',      cumWeight: 0.58 },
  { preset: 'barredOpen',  cumWeight: 0.70 },
  { preset: 'elliptical',  cumWeight: 0.85 },
  { preset: 'lenticular',  cumWeight: 0.95 },
  { preset: 'irregular',   cumWeight: 1.00 },
]

/**
 * Deterministic preset assignment from PGC number when no catalog
 * morphology is available. Uses seeded PRNG for reproducibility.
 */
export function assignPresetFromPgc(pgc: number): MorphologyPreset {
  const rand = mulberry32(pgc)
  const r = rand()
  for (const entry of WEIGHTED_PRESETS) {
    if (r < entry.cumWeight) return entry.preset
  }
  return 'spiral' // safety fallback
}

// -- Size estimation ---------------------------------------------------------

type SizeSource = 'observed' | 'mass' | 'random'

interface SizeEstimate {
  diameterKpc: number
  source: SizeSource
}

/**
 * 3-tier size estimation:
 *   1. Observed angular diameter + distance --> physical diameter
 *   2. Stellar mass via mass-size relation (Shen et al. 2003)
 *   3. Seeded random fallback (12.5-37.5 kpc)
 */
function estimateSize(
  galaxy: Galaxy,
  category: 'elliptical' | 'lenticular' | 'spiral' | 'barred' | 'irregular',
  rand: () => number,
): SizeEstimate {
  let diameterKpc: number
  let source: SizeSource

  if (galaxy.diameter_arcsec && galaxy.distance_mpc) {
    // Tier 1: angular size --> physical diameter
    diameterKpc = (galaxy.diameter_arcsec / 206.265) * galaxy.distance_mpc
    source = 'observed'
  } else if (galaxy.log_ms_t != null) {
    // Tier 2: mass-size relation (Shen et al. 2003 approximation)
    const isEarlyType = category === 'elliptical' || category === 'lenticular'
    const logRhalf = isEarlyType
      ? 0.56 * galaxy.log_ms_t - 5.54
      : 0.14 * galaxy.log_ms_t - 0.66
    diameterKpc = Math.pow(10, logRhalf) * 4 // half-light --> total extent
    source = 'mass'
  } else {
    // Tier 3: seeded random (12.5-37.5 kpc)
    diameterKpc = 25 * (0.5 + rand() * 1.0)
    source = 'random'
  }

  // Clamp to physical range: 1 kpc (dwarf) to 200 kpc (giant elliptical)
  diameterKpc = clamp(diameterKpc, 1, 200)

  return { diameterKpc, source }
}

// -- Seeded variation --------------------------------------------------------

/**
 * Apply seeded per-galaxy variation (+-20-30%) to numeric morphology fields.
 * Only modifies spatial / ratio fields, not discrete fields like numArms
 * or preset.
 */
function applyVariation(morph: GalaxyMorphology, rand: () => number): void {
  // Vary by +-25% on spatial fractions
  const vary = (v: number, range = 0.25): number => {
    if (v === 0) return 0
    return clamp(v * (1 + (rand() * 2 - 1) * range), 0, 1)
  }

  morph.armWidth = vary(morph.armWidth)
  morph.spiralTightness = morph.spiralTightness === 0
    ? 0
    : morph.spiralTightness * (1 + (rand() * 2 - 1) * 0.2)
  morph.spiralStart = vary(morph.spiralStart)
  morph.bulgeRadius = vary(morph.bulgeRadius, 0.3)
  morph.barLength = vary(morph.barLength, 0.2)
  morph.barWidth = vary(morph.barWidth, 0.2)
  morph.fieldStarFraction = vary(morph.fieldStarFraction, 0.2)
  morph.irregularity = vary(morph.irregularity, 0.3)

  // Slight variation on ellipticity / axisRatio for ellipticals
  if (morph.ellipticity > 0) {
    const delta = (rand() * 2 - 1) * 0.1
    morph.ellipticity = clamp(morph.ellipticity + delta, 0, 0.9)
    morph.axisRatio = 1 - morph.ellipticity
  }
}

/**
 * Biases the procedural morphology with compact multi-band imaging features
 * while preserving the preset-selected galaxy family.
 */
function applyBandGuidance(
  morph: GalaxyMorphology,
  category: 'elliptical' | 'lenticular' | 'spiral' | 'barred' | 'irregular',
  bandProfile: BandFeatureProfile | null | undefined,
): void {
  if (!bandProfile) {
    return
  }

  morph.bulgeRadius = clamp(
    morph.bulgeRadius * lerp(0.9, 1.35, bandProfile.concentration),
    0,
    1,
  )

  if (category === 'spiral' || category === 'barred') {
    morph.bulgeRadius = clamp(
      morph.bulgeRadius + bandProfile.concentration * 0.14,
      0,
      1,
    )
    morph.fieldStarFraction = clamp(
      morph.fieldStarFraction * lerp(1.1, 0.55, bandProfile.armContrast),
      0.02,
      1,
    )
    morph.armWidth = clamp(
      morph.armWidth * lerp(1.05, 0.75, bandProfile.filamentarity),
      0.02,
      1,
    )
    morph.spiralTightness = Math.max(
      0,
      morph.spiralTightness * lerp(0.95, 1.15, bandProfile.armContrast),
    )
    morph.irregularity = clamp(
      morph.irregularity + bandProfile.clumpiness * 0.35,
      0,
      1,
    )
  }

  if (category === 'lenticular') {
    morph.diskThickness = clamp(
      morph.diskThickness * lerp(1.4, 0.7, 1 - bandProfile.diskThicknessBias),
      0,
      1,
    )
  }

  if (category === 'irregular') {
    morph.irregularity = clamp(
      morph.irregularity + bandProfile.clumpiness * 0.25,
      0,
      1,
    )
    morph.clumpCount = Math.max(
      morph.clumpCount,
      Math.round(lerp(3, 8, bandProfile.clumpiness)),
    )
  }

  if (category === 'elliptical') {
    morph.axisRatio = clamp(
      morph.axisRatio * lerp(1.08, 0.86, bandProfile.filamentarity),
      0.1,
      1,
    )
    morph.ellipticity = 1 - morph.axisRatio
  }
}

// -- mapGalaxyToRenderParams -------------------------------------------------

/**
 * Main entry point: map a Galaxy record to GalaxyRenderParams.
 *
 *   1. Select preset from catalog Hubble string or PGC-seeded fallback
 *   2. Clone preset defaults
 *   3. Apply catalog overrides (observed axial_ratio, etc.)
 *   4. Add seeded per-galaxy variation (+-20-30% on key params)
 *   5. Estimate physical size (3-tier)
 *   6. Compute starCount and galaxyRadius
 */
export function mapGalaxyToRenderParams(
  galaxy: Galaxy,
  bandProfile?: BandFeatureProfile | null,
): GalaxyRenderParams {
  const rand = mulberry32(galaxy.pgc)

  // 1. Select preset
  const preset: MorphologyPreset = galaxy.morphology
    ? selectPreset(galaxy.morphology)
    : assignPresetFromPgc(galaxy.pgc)

  // 2. Clone preset defaults
  const morphology: GalaxyMorphology = { ...MORPHOLOGY_PRESETS[preset] }

  // 3. Parse catalog string for structured overrides
  const parsed = parseMorphology(galaxy.morphology)

  // For barred galaxies with weak bars, scale down bar length before variation
  if (parsed.barStrength === 'weak' && morphology.barLength > 0) {
    morphology.barLength *= 0.6
    morphology.barWidth *= 0.7
  }

  // Use eNumber from catalog for ellipticals (before variation)
  if (preset === 'elliptical' && parsed.eNumber != null) {
    morphology.axisRatio = 1 - parsed.eNumber / 10
    morphology.ellipticity = parsed.eNumber / 10
  }

  // 4. Apply seeded variation
  applyVariation(morphology, rand)

  // 5. Apply compact multi-band guidance before observed hard overrides so
  // true catalog measurements still win if they conflict.
  const category = presetToCategory(preset)
  applyBandGuidance(morphology, category, bandProfile)

  // 6. Apply hard catalog overrides AFTER variation/guidance (observed data wins)
  if (preset === 'elliptical') {
    const observedBa = galaxy.axial_ratio ?? galaxy.ba
    if (observedBa != null) {
      morphology.axisRatio = clamp(observedBa, 0.1, 1)
      morphology.ellipticity = 1 - morphology.axisRatio
    }
  }

  // 7. Estimate size
  const { diameterKpc, source: sizeSource } = estimateSize(galaxy, category, rand)

  // Map kpc to rendering units (12 units/kpc, baseline 300 units = 25 kpc)
  const galaxyRadius = clamp(diameterKpc * 12, 30, 2400)

  // 8. Star count: scale up only for massive galaxies
  let starCount: number
  if (galaxy.log_ms_t != null && galaxy.log_ms_t > 10.8) {
    const massScale = Math.pow(10, 0.15 * (galaxy.log_ms_t - 10.8))
    starCount = clamp(Math.round(60000 * massScale), 60000, 120000)
  } else {
    starCount = clamp(Math.round(60000 * (0.7 + rand() * 0.6)), 42000, 78000)
  }

  return {
    morphology,
    bandProfile: bandProfile ?? null,
    galaxyRadius,
    starCount,
    diameterKpc,
    sizeSource,
  }
}
