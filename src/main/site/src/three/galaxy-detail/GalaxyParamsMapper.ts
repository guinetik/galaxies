import type { Galaxy, SizeSource } from '@/types/galaxy'
import { assignMorphology, estimateGalaxySize } from '@/types/galaxy'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ParsedMorphology {
  type: 'spiral' | 'barred' | 'elliptical' | 'lenticular' | 'irregular'
  hubbleStage: number      // 1 (Sa) → 9 (Sm), 0 for non-spirals
  eNumber: number | null   // 0-7 for ellipticals
  barStrength: 'strong' | 'weak' | null
  ringType: 'r' | 's' | 'rs' | null
}

interface BaseParams {
  starCount: number
  galaxyRadius: number
  diameterKpc: number
  sizeSource: SizeSource
}

export interface SpiralParams extends BaseParams {
  type: 'spiral'
  numArms: number
  armWidth: number
  spiralTightness: number
  spiralStart: number
  fieldStarFraction: number
  bulgeRadius: number
  irregularity: number
}

export interface BarredParams extends BaseParams {
  type: 'barred'
  numArms: number
  armWidth: number
  spiralTightness: number
  spiralStart: number
  fieldStarFraction: number
  bulgeRadius: number
  barLength: number
  barWidth: number
  irregularity: number
}

export interface EllipticalParams extends BaseParams {
  type: 'elliptical'
  ellipticity: number
  axisRatio: number
}

export interface LenticularParams extends BaseParams {
  type: 'lenticular'
  bulgeRadius: number
  bulgeFraction: number
  diskThickness: number
}

export interface IrregularParams extends BaseParams {
  type: 'irregular'
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

// ─── morphClassToParsed ─────────────────────────────────────────────────────

function morphClassToParsed(morphClass: string, rand: () => number): ParsedMorphology {
  switch (morphClass) {
    case 'elliptical':
      return { type: 'elliptical', hubbleStage: 0, eNumber: Math.round(rand() * 7), barStrength: null, ringType: null }
    case 'lenticular':
      return { type: 'lenticular', hubbleStage: 0, eNumber: null, barStrength: null, ringType: null }
    case 'barred': {
      const stage = Math.round(1 + rand() * 8)
      return { type: 'barred', hubbleStage: stage, eNumber: null, barStrength: rand() > 0.5 ? 'strong' : 'weak', ringType: null }
    }
    case 'irregular':
      return { type: 'irregular', hubbleStage: 0, eNumber: null, barStrength: null, ringType: null }
    default: { // spiral
      const stage = Math.round(1 + rand() * 8)
      return { type: 'spiral', hubbleStage: stage, eNumber: null, barStrength: null, ringType: null }
    }
  }
}

// ─── galaxyToGeneratorParams ────────────────────────────────────────────────

export function galaxyToGeneratorParams(galaxy: Galaxy): GeneratorParams {
  const rand = mulberry32(galaxy.pgc)
  const morphClass = assignMorphology(galaxy.pgc, galaxy.morphology)

  // --- Physical size estimation (3-tier priority) ---
  const { diameterKpc, source: sizeSource } = estimateGalaxySize(galaxy, morphClass, rand)

  // Map kpc to rendering units (12 units/kpc, baseline 300 units = 25 kpc)
  const galaxyRadius = clamp(diameterKpc * 12, 30, 2400)

  // --- Star count: only scale UP for massive galaxies ---
  // Small galaxies are already visually smaller; reducing particle count
  // too makes spiral arms look empty. Keep the old 42k–78k baseline and
  // only add more particles for truly massive galaxies (log_ms_t > 10.8).
  let starCount: number
  if (galaxy.log_ms_t != null && galaxy.log_ms_t > 10.8) {
    const massScale = Math.pow(10, 0.15 * (galaxy.log_ms_t - 10.8))
    starCount = clamp(Math.round(60000 * massScale), 60000, 120000)
  } else {
    starCount = clamp(Math.round(60000 * (0.7 + rand() * 0.6)), 42000, 78000)
  }

  const base = { starCount, galaxyRadius, diameterKpc, sizeSource }

  // --- Map morphClass to ParsedMorphology for per-type params ---
  const morph = morphClassToParsed(morphClass, rand)

  // --- Per-type mapping ---
  switch (morph.type) {
    case 'spiral': {
      const t = clamp((morph.hubbleStage - 1) / 8, 0, 1)
      return {
        ...base,
        type: 'spiral',
        numArms: morph.hubbleStage <= 2 ? 2 : morph.hubbleStage <= 5 ? Math.round(lerp(2, 4, rand())) : Math.round(lerp(2, 6, rand())),
        armWidth: galaxyRadius * lerp(0.06, 0.18, t),
        spiralTightness: lerp(0.08, 0.50, t),
        spiralStart: lerp(0.3, 0.1, t),
        fieldStarFraction: lerp(0.05, 0.40, t),
        bulgeRadius: galaxyRadius * lerp(0.35, 0.05, t),
        irregularity: lerp(0.0, 0.3, t),
      }
    }

    case 'barred': {
      const t = clamp((morph.hubbleStage - 1) / 8, 0, 1)
      const strong = morph.barStrength === 'strong'
      const barR = rand()
      return {
        ...base,
        type: 'barred',
        numArms: morph.hubbleStage <= 2 ? 2 : Math.round(lerp(2, 4, rand())),
        armWidth: galaxyRadius * lerp(0.06, 0.18, t),
        spiralTightness: lerp(0.08, 0.50, t),
        spiralStart: lerp(0.3, 0.1, t),
        fieldStarFraction: lerp(0.05, 0.40, t),
        bulgeRadius: galaxyRadius * lerp(0.35, 0.05, t),
        barLength: galaxyRadius * (strong ? lerp(0.30, 0.60, barR) : lerp(0.15, 0.30, barR)),
        barWidth: galaxyRadius * lerp(0.05, 0.12, rand()),
        irregularity: lerp(0.0, 0.3, t),
      }
    }

    case 'elliptical': {
      const observedBa = galaxy.axial_ratio ?? galaxy.ba
      const axisRatio = observedBa != null ? observedBa : (1 - (morph.eNumber ?? 3) / 10)
      return {
        ...base,
        type: 'elliptical',
        ellipticity: 1 - axisRatio,
        axisRatio,
      }
    }

    case 'lenticular': {
      return {
        ...base,
        type: 'lenticular',
        bulgeRadius: galaxyRadius * lerp(0.3, 0.5, rand()),
        bulgeFraction: lerp(0.4, 0.7, rand()),
        diskThickness: lerp(0.05, 0.15, rand()),
      }
    }

    case 'irregular': {
      return {
        ...base,
        type: 'irregular',
        irregularity: lerp(0.5, 1.0, rand()),
        clumpCount: Math.round(lerp(3, 12, rand())),
      }
    }
  }
}
