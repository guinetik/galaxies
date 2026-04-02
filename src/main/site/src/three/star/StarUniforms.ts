import * as THREE from 'three'

// Spectral class → hex color (ported from exoplanets astronomy.ts)
const STAR_COLORS: Record<string, number> = {
  O: 0x5b7cff,
  B: 0x7b9fff,
  A: 0xcad7ff,
  F: 0xf8f7ff,
  G: 0xfff4ea,
  K: 0xffd2a1,
  M: 0xff6644,
  L: 0xcc4422,
  T: 0x9944aa,
  Y: 0x663377,
}

// Spectral class → activity level (ported from exoplanets planetUniforms.ts)
const ACTIVITY_MAP: Record<string, number> = {
  M: 0.95,
  K: 0.65,
  G: 0.55,
  F: 0.35,
  A: 0.25,
  B: 0.85,
  O: 0.90,
  L: 0.20,
  T: 0.15,
  Y: 0.10,
}

// Default temperature by spectral class (used when SIMBAD has no Teff)
const DEFAULT_TEMP: Record<string, number> = {
  O: 35000,
  B: 20000,
  A: 8500,
  F: 6500,
  G: 5778,
  K: 4500,
  M: 3200,
  L: 1800,
  T: 1000,
  Y: 400,
}

/**
 * Extract spectral class letter from a spectral type string.
 * "G2V" → "G", "K5III" → "K", null → "G"
 */
export function parseSpectralClass(spType: string | null): string {
  if (!spType) return 'G'
  const first = spType.charAt(0).toUpperCase()
  return STAR_COLORS[first] !== undefined ? first : 'G'
}

/** Get hex color for a spectral class */
export function getStarColor(spClass: string): number {
  return STAR_COLORS[spClass] ?? STAR_COLORS.G
}

/** Get activity level for a spectral class */
export function getStarActivityLevel(spClass: string): number {
  return ACTIVITY_MAP[spClass] ?? 0.5
}

/** Get default temperature for a spectral class */
export function getDefaultTemperature(spClass: string): number {
  return DEFAULT_TEMP[spClass] ?? 5778
}

/** Deterministic seed from a string (ported from exoplanets planetUniforms.ts) */
export function generateSeed(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash % 1000) / 1000
}

/** Star rendering size constants */
export const STAR_RENDERING = {
  CORONA_SCALE: 1.8,
  FLAME_TONGUES_SCALE: 1.4,
  GLOW_SIZE: 3.0,
  RAYS_SIZE: 6.0,
  RAY_STAR_RADIUS: 0.08,
  LIGHT_INTENSITY: 2.0,
  LIGHT_DISTANCE: 50,
}

export interface StarShaderUniforms {
  surface: Record<string, { value: unknown }>
  corona: Record<string, { value: unknown }>
  rays: Record<string, { value: unknown }>
  flameTongues: Record<string, { value: unknown }>
  glow: Record<string, { value: unknown }>
}

/**
 * Create all shader uniforms for a star.
 * @param spClass - Spectral class letter (O/B/A/F/G/K/M/L/T/Y)
 * @param teff - Effective temperature in Kelvin (null = infer from class)
 * @param name - Star identifier (for deterministic seed)
 */
export function createStarUniforms(
  spClass: string,
  teff: number | null,
  name: string,
): StarShaderUniforms {
  const color = new THREE.Color(getStarColor(spClass))
  const temperature = teff ?? getDefaultTemperature(spClass)
  const activity = getStarActivityLevel(spClass)
  const seed = generateSeed(name)

  return {
    surface: {
      uStarColor: { value: color },
      uTime: { value: 0 },
      uTemperature: { value: temperature },
      uSeed: { value: seed },
      uActivityLevel: { value: activity },
    },
    corona: {
      uStarColor: { value: color },
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
      uSeed: { value: seed },
      uActivityLevel: { value: activity },
    },
    rays: {
      uStarColor: { value: color },
      uTime: { value: 0 },
      uTemperature: { value: temperature },
      uSeed: { value: seed },
      uActivityLevel: { value: activity },
      uStarRadius: { value: STAR_RENDERING.RAY_STAR_RADIUS },
    },
    flameTongues: {
      uStarColor: { value: color },
      uTime: { value: 0 },
      uSeed: { value: seed },
      uActivityLevel: { value: activity },
    },
    glow: {
      uColor: { value: color },
      uIntensity: { value: 1.0 },
      uTime: { value: 0 },
      uSeed: { value: seed },
    },
  }
}
