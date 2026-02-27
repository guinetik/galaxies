import type { Galaxy } from '@/types/galaxy'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ParsedMorphology {
  type: 'spiral' | 'barred' | 'elliptical' | 'lenticular' | 'irregular'
  hubbleStage: number      // 1 (Sa) → 9 (Sm), 0 for non-spirals
  eNumber: number | null   // 0-7 for ellipticals
  barStrength: 'strong' | 'weak' | null
  ringType: 'r' | 's' | 'rs' | null
}

export interface SpiralParams {
  type: 'spiral'
  numArms: number
  starCount: number
  galaxyRadius: number
  armWidth: number
  spiralTightness: number
  spiralStart: number
  fieldStarFraction: number
  bulgeRadius: number
  irregularity: number
}

export interface BarredParams {
  type: 'barred'
  numArms: number
  starCount: number
  galaxyRadius: number
  armWidth: number
  spiralTightness: number
  spiralStart: number
  fieldStarFraction: number
  bulgeRadius: number
  barLength: number
  barWidth: number
  irregularity: number
}

export interface EllipticalParams {
  type: 'elliptical'
  starCount: number
  galaxyRadius: number
  ellipticity: number
  axisRatio: number
}

export interface LenticularParams {
  type: 'lenticular'
  starCount: number
  galaxyRadius: number
  bulgeRadius: number
  bulgeFraction: number
  diskThickness: number
}

export interface IrregularParams {
  type: 'irregular'
  starCount: number
  galaxyRadius: number
  irregularity: number
  clumpCount: number
}

export type GeneratorParams =
  | SpiralParams
  | BarredParams
  | EllipticalParams
  | LenticularParams
  | IrregularParams

// ─── Helpers ────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

/** Mulberry32 seeded PRNG — returns a function that yields [0,1) floats */
function mulberry32(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Hubble stage map ───────────────────────────────────────────────────────

const HUBBLE_STAGES: Record<string, number> = {
  a: 1,
  ab: 2,
  b: 3,
  bc: 4,
  c: 5,
  cd: 6,
  d: 7,
  dm: 8,
  m: 9,
}

// ─── parseMorphology ────────────────────────────────────────────────────────

export function parseMorphology(morph: string | null): ParsedMorphology {
  const fallback: ParsedMorphology = {
    type: 'spiral',
    hubbleStage: 3,
    eNumber: null,
    barStrength: null,
    ringType: null,
  }

  if (!morph) return fallback

  const m = morph.trim()

  // --- Ring notation ---
  let ringType: 'r' | 's' | 'rs' | null = null
  const ringMatch = m.match(/\((rs|r|s)\)/)
  if (ringMatch) {
    ringType = ringMatch[1] as 'r' | 's' | 'rs'
  }

  // --- Irregular ---
  if (/^I(rr|m|Bm?)?$/i.test(m)) {
    return { type: 'irregular', hubbleStage: 0, eNumber: null, barStrength: null, ringType }
  }

  // --- Elliptical ---
  const eMatch = m.match(/^[cd]?E(\d)?$/i)
  if (eMatch) {
    const eNum = eMatch[1] != null ? parseInt(eMatch[1], 10) : 3
    return { type: 'elliptical', hubbleStage: 0, eNumber: clamp(eNum, 0, 7), barStrength: null, ringType }
  }

  // --- Lenticular ---
  if (/S0/i.test(m) || /^E[/-]S0/i.test(m)) {
    return { type: 'lenticular', hubbleStage: 0, eNumber: null, barStrength: null, ringType }
  }

  // --- Barred spirals ---
  const barredStrong = m.match(/^SB\(?[rs]*\)?([a-m]+)?/i)
  if (barredStrong) {
    const stage = barredStrong[1] ? (HUBBLE_STAGES[barredStrong[1].toLowerCase()] ?? 3) : 3
    return { type: 'barred', hubbleStage: stage, eNumber: null, barStrength: 'strong', ringType }
  }

  const barredWeak = m.match(/^SAB\(?[rs]*\)?([a-m]+)?/i)
  if (barredWeak) {
    const stage = barredWeak[1] ? (HUBBLE_STAGES[barredWeak[1].toLowerCase()] ?? 3) : 3
    return { type: 'barred', hubbleStage: stage, eNumber: null, barStrength: 'weak', ringType }
  }

  // --- Normal spirals ---
  const spiralMatch = m.match(/^S[A]?\(?[rs]*\)?([a-m]+)?/i)
  if (spiralMatch) {
    const stage = spiralMatch[1] ? (HUBBLE_STAGES[spiralMatch[1].toLowerCase()] ?? 3) : 3
    return { type: 'spiral', hubbleStage: stage, eNumber: null, barStrength: null, ringType }
  }

  return fallback
}

// ─── galaxyToGeneratorParams ────────────────────────────────────────────────

export function galaxyToGeneratorParams(galaxy: Galaxy): GeneratorParams {
  const rand = mulberry32(galaxy.id)
  const morph = parseMorphology(galaxy.morphology)

  // --- Physical size estimation ---
  const H0 = 70 // km/s/Mpc
  const velocity = galaxy.velocity ?? 1000
  const distanceMpc = Math.max(Math.abs(velocity) / H0, 0.1)
  const diameterArcsec = galaxy.diameter_arcsec ?? 60
  const physicalKpc = distanceMpc * diameterArcsec / 206.265
  const galaxyRadius = clamp(physicalKpc * 8, 80, 600)

  // --- Star count from luminosity ---
  let starCount = 20000
  if (galaxy.b_mag != null) {
    const absMag = galaxy.b_mag - 5 * Math.log10(distanceMpc * 1e6) + 5
    // Luminosity relative to sun: 10^((4.83 - absMag) / 2.5)
    const luminosity = Math.pow(10, (4.83 - absMag) / 2.5)
    // Rough star count — cap for rendering performance
    starCount = clamp(Math.round(luminosity / 1e6), 5000, 100000)
  }

  // --- Per-type mapping ---
  switch (morph.type) {
    case 'spiral': {
      const t = clamp((morph.hubbleStage - 1) / 8, 0, 1)
      return {
        type: 'spiral',
        numArms: morph.hubbleStage <= 2 ? 2 : morph.hubbleStage <= 5 ? Math.round(lerp(2, 4, rand())) : Math.round(lerp(2, 6, rand())),
        starCount,
        galaxyRadius,
        armWidth: lerp(15, 120, t),
        spiralTightness: lerp(0.08, 0.50, t),
        spiralStart: lerp(0.3, 0.1, t),
        fieldStarFraction: lerp(0.05, 0.40, t),
        bulgeRadius: lerp(140, 0, t),
        irregularity: lerp(0.0, 0.3, t),
      }
    }

    case 'barred': {
      const t = clamp((morph.hubbleStage - 1) / 8, 0, 1)
      const strong = morph.barStrength === 'strong'
      const barR = rand()
      return {
        type: 'barred',
        numArms: morph.hubbleStage <= 2 ? 2 : Math.round(lerp(2, 4, rand())),
        starCount,
        galaxyRadius,
        armWidth: lerp(15, 120, t),
        spiralTightness: lerp(0.08, 0.50, t),
        spiralStart: lerp(0.3, 0.1, t),
        fieldStarFraction: lerp(0.05, 0.40, t),
        bulgeRadius: lerp(140, 0, t),
        barLength: galaxyRadius * (strong ? lerp(0.30, 0.60, barR) : lerp(0.15, 0.30, barR)),
        barWidth: galaxyRadius * lerp(0.05, 0.12, rand()),
        irregularity: lerp(0.0, 0.3, t),
      }
    }

    case 'elliptical': {
      const eNum = morph.eNumber ?? 3
      return {
        type: 'elliptical',
        starCount,
        galaxyRadius,
        ellipticity: eNum / 10,
        axisRatio: 1 - eNum / 10,
      }
    }

    case 'lenticular': {
      return {
        type: 'lenticular',
        starCount,
        galaxyRadius,
        bulgeRadius: galaxyRadius * lerp(0.3, 0.5, rand()),
        bulgeFraction: lerp(0.4, 0.7, rand()),
        diskThickness: lerp(0.05, 0.15, rand()),
      }
    }

    case 'irregular': {
      return {
        type: 'irregular',
        starCount,
        galaxyRadius,
        irregularity: lerp(0.5, 1.0, rand()),
        clumpCount: Math.round(lerp(3, 12, rand())),
      }
    }
  }
}
