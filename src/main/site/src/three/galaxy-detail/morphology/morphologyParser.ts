// ─────────────────────────────────────────────────────────────────────────────
// Morphology Parser — Hubble-type string → ParsedMorphology
//
// Parses astronomical morphology classification strings (e.g. "SBb", "E3",
// "SAB(rs)c") into a structured representation used to drive procedural
// galaxy generation.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Structured result of parsing a Hubble-type morphology string.
 */
export interface ParsedMorphology {
  type: 'spiral' | 'barred' | 'elliptical' | 'lenticular' | 'irregular'
  hubbleStage: number      // 1 (Sa) → 9 (Sm), 0 for non-spirals
  eNumber: number | null   // 0-7 for ellipticals
  barStrength: 'strong' | 'weak' | null
  ringType: 'r' | 's' | 'rs' | null
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

// ─── Hubble stage map ───────────────────────────────────────────────────────

export const HUBBLE_STAGES: Record<string, number> = {
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
