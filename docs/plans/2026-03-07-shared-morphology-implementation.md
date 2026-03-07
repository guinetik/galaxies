# Shared Morphology Model — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract galaxy morphology logic into a shared, renderer-agnostic module with 10 Hubble-sequence presets, consumed by both WebGL and WebGPU pipelines.

**Architecture:** A new `morphology/` directory under `galaxy-detail/` contains three pure-TypeScript files: types+presets, parser, and mapper. The old `GalaxyParamsMapper.ts` becomes a thin adapter. Both renderers read the same flat `GalaxyMorphology` struct. The sky-view field (`GalaxyField.ts`, `GalaxyTextures.ts`) keeps using broad 5-category types mapped from the 10 presets.

**Tech Stack:** TypeScript, Vitest, Three.js (WebGL), Three.js TSL (WebGPU compute shaders)

**Design Doc:** `docs/plans/2026-03-07-shared-morphology-model.md`

---

### Task 1: Create `GalaxyMorphology.ts` — types and preset constants

**Files:**
- Create: `src/main/site/src/three/galaxy-detail/morphology/GalaxyMorphology.ts`
- Create: `src/main/site/src/three/galaxy-detail/morphology/index.ts`

**Step 1: Write the test**

Create `src/main/site/src/three/galaxy-detail/morphology/__tests__/GalaxyMorphology.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  MORPHOLOGY_PRESETS,
  type MorphologyPreset,
  type GalaxyMorphology,
} from '../GalaxyMorphology'

describe('MORPHOLOGY_PRESETS', () => {
  const EXPECTED_PRESETS: MorphologyPreset[] = [
    'elliptical', 'lenticular',
    'spiralSa', 'spiral', 'grandDesign', 'flocculent',
    'barredTight', 'barred', 'barredOpen',
    'irregular',
  ]

  it('defines all 10 presets', () => {
    expect(Object.keys(MORPHOLOGY_PRESETS)).toHaveLength(10)
    for (const key of EXPECTED_PRESETS) {
      expect(MORPHOLOGY_PRESETS[key]).toBeDefined()
    }
  })

  it('spiral presets have numArms > 0 and no bar', () => {
    for (const key of ['spiralSa', 'spiral', 'grandDesign', 'flocculent'] as const) {
      const p = MORPHOLOGY_PRESETS[key]
      expect(p.numArms).toBeGreaterThan(0)
      expect(p.barLength).toBe(0)
    }
  })

  it('barred presets have barLength > 0', () => {
    for (const key of ['barredTight', 'barred', 'barredOpen'] as const) {
      const p = MORPHOLOGY_PRESETS[key]
      expect(p.barLength).toBeGreaterThan(0)
    }
  })

  it('elliptical has no arms, no bar, high ellipticity', () => {
    const p = MORPHOLOGY_PRESETS.elliptical
    expect(p.numArms).toBe(0)
    expect(p.barLength).toBe(0)
    expect(p.ellipticity).toBeGreaterThan(0)
  })

  it('irregular has high irregularity and clumpCount > 0', () => {
    const p = MORPHOLOGY_PRESETS.irregular
    expect(p.irregularity).toBeGreaterThan(0.3)
    expect(p.clumpCount).toBeGreaterThan(0)
  })

  it('all presets have fractional spatial params in 0-1 range', () => {
    for (const [, p] of Object.entries(MORPHOLOGY_PRESETS)) {
      expect(p.armWidth).toBeGreaterThanOrEqual(0)
      expect(p.armWidth).toBeLessThanOrEqual(1)
      expect(p.bulgeRadius).toBeGreaterThanOrEqual(0)
      expect(p.bulgeRadius).toBeLessThanOrEqual(1)
      expect(p.barLength).toBeGreaterThanOrEqual(0)
      expect(p.barLength).toBeLessThanOrEqual(1)
      expect(p.fieldStarFraction).toBeGreaterThanOrEqual(0)
      expect(p.fieldStarFraction).toBeLessThanOrEqual(1)
    }
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd src/main/site && npx vitest run src/three/galaxy-detail/morphology/__tests__/GalaxyMorphology.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/main/site/src/three/galaxy-detail/morphology/GalaxyMorphology.ts`:

```ts
/**
 * Galaxy Morphology — Types and Preset Constants
 *
 * Defines the flat parameter struct and 10 Hubble-sequence presets.
 * All spatial parameters are fractions of galaxyRadius (0-1).
 * Pure data — no rendering or Three.js dependencies.
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

/**
 * Broad morphology category for sky-view rendering (texture atlas, field shaders).
 * Maps 1:1 with the old MorphologyClass but derived from presets.
 */
export type MorphologyCategory = 'elliptical' | 'lenticular' | 'spiral' | 'barred' | 'irregular'

export interface GalaxyMorphology {
  preset: MorphologyPreset

  // Structure
  numArms: number              // 0 for E/S0/Irr
  armWidth: number             // fraction of galaxyRadius
  spiralTightness: number      // pitch angle parameter
  spiralStart: number          // fraction of galaxyRadius where arms begin

  // Bulge
  bulgeRadius: number          // fraction of galaxyRadius
  bulgeFraction: number        // fraction of stars in bulge

  // Bar
  barLength: number            // fraction of galaxyRadius (0 = no bar)
  barWidth: number             // fraction of galaxyRadius

  // Shape
  ellipticity: number          // 0-1
  axisRatio: number            // 0-1 (b/a)
  diskThickness: number        // fraction of galaxyRadius

  // Disorder
  irregularity: number         // 0-1
  clumpCount: number           // for irregulars

  // Stellar population
  fieldStarFraction: number    // fraction of non-structured stars
}

/** Render params — morphology + absolute sizing for renderers */
export interface GalaxyRenderParams {
  morphology: GalaxyMorphology
  starCount: number
  galaxyRadius: number         // absolute rendering units
  diameterKpc: number
  sizeSource: 'observed' | 'mass' | 'random'
}

/**
 * Map a preset to its broad category (for sky-view texture atlas, filters, i18n).
 */
export function presetToCategory(preset: MorphologyPreset): MorphologyCategory {
  switch (preset) {
    case 'elliptical': return 'elliptical'
    case 'lenticular': return 'lenticular'
    case 'spiralSa': case 'spiral': case 'grandDesign': case 'flocculent': return 'spiral'
    case 'barredTight': case 'barred': case 'barredOpen': return 'barred'
    case 'irregular': return 'irregular'
  }
}

// ─── Preset Constants ───────────────────────────────────────────────────────
// Values derived from GCanvas galaxy.config.js presets, normalized to fractions.
// Reference radii from GCanvas: E=320, S0=300, SAa=320, SAb=350, SAc=380,
// SAd=360, SBa=320, SBb=350, SBc=380, Irr=280.

export const MORPHOLOGY_PRESETS: Record<MorphologyPreset, GalaxyMorphology> = {
  elliptical: {
    preset: 'elliptical',
    numArms: 0,
    armWidth: 0,
    spiralTightness: 0,
    spiralStart: 0,
    bulgeRadius: 0,
    bulgeFraction: 0,
    barLength: 0,
    barWidth: 0,
    ellipticity: 0.6,
    axisRatio: 0.7,
    diskThickness: 0.1,
    irregularity: 0,
    clumpCount: 0,
    fieldStarFraction: 1,
  },

  lenticular: {
    preset: 'lenticular',
    numArms: 0,
    armWidth: 0,
    spiralTightness: 0,
    spiralStart: 0,
    bulgeRadius: 0.27,       // 80/300
    bulgeFraction: 0.4,
    barLength: 0,
    barWidth: 0,
    ellipticity: 0,
    axisRatio: 1,
    diskThickness: 0.013,    // 4/300
    irregularity: 0,
    clumpCount: 0,
    fieldStarFraction: 0,
  },

  spiralSa: {
    preset: 'spiralSa',
    numArms: 2,
    armWidth: 0.078,          // 25/320
    spiralTightness: 0.14,
    spiralStart: 0.156,       // 50/320
    bulgeRadius: 0.219,       // 70/320
    bulgeFraction: 0.15,
    barLength: 0,
    barWidth: 0,
    ellipticity: 0,
    axisRatio: 1,
    diskThickness: 0.06,
    irregularity: 0,
    clumpCount: 0,
    fieldStarFraction: 0.08,
  },

  spiral: {
    preset: 'spiral',
    numArms: 2,
    armWidth: 0.114,          // 40/350
    spiralTightness: 0.25,
    spiralStart: 0.086,       // 30/350
    bulgeRadius: 0.10,        // 35/350
    bulgeFraction: 0.12,
    barLength: 0,
    barWidth: 0,
    ellipticity: 0,
    axisRatio: 1,
    diskThickness: 0.06,
    irregularity: 0,
    clumpCount: 0,
    fieldStarFraction: 0.15,
  },

  grandDesign: {
    preset: 'grandDesign',
    numArms: 2,
    armWidth: 0.145,          // 55/380
    spiralTightness: 0.22,
    spiralStart: 0.066,       // 25/380
    bulgeRadius: 0,
    bulgeFraction: 0,
    barLength: 0,
    barWidth: 0,
    ellipticity: 0,
    axisRatio: 1,
    diskThickness: 0.06,
    irregularity: 0,
    clumpCount: 0,
    fieldStarFraction: 0.12,
  },

  flocculent: {
    preset: 'flocculent',
    numArms: 4,
    armWidth: 0.181,          // 65/360
    spiralTightness: 0.3,
    spiralStart: 0.111,       // 40/360
    bulgeRadius: 0,
    bulgeFraction: 0,
    barLength: 0,
    barWidth: 0,
    ellipticity: 0,
    axisRatio: 1,
    diskThickness: 0.06,
    irregularity: 0.15,
    clumpCount: 0,
    fieldStarFraction: 0.25,
  },

  barredTight: {
    preset: 'barredTight',
    numArms: 2,
    armWidth: 0.094,          // 30/320
    spiralTightness: 0.16,
    spiralStart: 0.188,       // 60/320
    bulgeRadius: 0.156,       // 50/320
    bulgeFraction: 0.12,
    barLength: 0.438,         // 140/320
    barWidth: 0.094,          // 30/320
    ellipticity: 0,
    axisRatio: 1,
    diskThickness: 0.06,
    irregularity: 0,
    clumpCount: 0,
    fieldStarFraction: 0.06,
  },

  barred: {
    preset: 'barred',
    numArms: 2,
    armWidth: 0.129,          // 45/350
    spiralTightness: 0.28,
    spiralStart: 0.143,       // 50/350
    bulgeRadius: 0.10,        // 35/350
    bulgeFraction: 0.10,
    barLength: 0.343,         // 120/350
    barWidth: 0.071,          // 25/350
    ellipticity: 0,
    axisRatio: 1,
    diskThickness: 0.06,
    irregularity: 0,
    clumpCount: 0,
    fieldStarFraction: 0.10,
  },

  barredOpen: {
    preset: 'barredOpen',
    numArms: 2,
    armWidth: 0.158,          // 60/380
    spiralTightness: 0.35,
    spiralStart: 0.105,       // 40/380
    bulgeRadius: 0,
    bulgeFraction: 0,
    barLength: 0.237,         // 90/380
    barWidth: 0.053,          // 20/380
    ellipticity: 0,
    axisRatio: 1,
    diskThickness: 0.06,
    irregularity: 0,
    clumpCount: 0,
    fieldStarFraction: 0.18,
  },

  irregular: {
    preset: 'irregular',
    numArms: 0,
    armWidth: 0,
    spiralTightness: 0,
    spiralStart: 0,
    bulgeRadius: 0,
    bulgeFraction: 0,
    barLength: 0,
    barWidth: 0,
    ellipticity: 0,
    axisRatio: 1,
    diskThickness: 0.12,
    irregularity: 0.8,
    clumpCount: 5,
    fieldStarFraction: 1,
  },
}
```

Create barrel `src/main/site/src/three/galaxy-detail/morphology/index.ts`:

```ts
export {
  type MorphologyPreset,
  type MorphologyCategory,
  type GalaxyMorphology,
  type GalaxyRenderParams,
  MORPHOLOGY_PRESETS,
  presetToCategory,
} from './GalaxyMorphology'

export {
  type ParsedMorphology,
  parseMorphology,
} from './morphologyParser'

export {
  mapGalaxyToRenderParams,
} from './morphologyMapper'
```

Note: `index.ts` will produce import errors until Tasks 2 and 3 create the parser and mapper. That's fine — we only run the Task 1 test file.

**Step 4: Run test to verify it passes**

Run: `cd src/main/site && npx vitest run src/three/galaxy-detail/morphology/__tests__/GalaxyMorphology.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/morphology/GalaxyMorphology.ts \
        src/main/site/src/three/galaxy-detail/morphology/__tests__/GalaxyMorphology.test.ts
git commit -m "feat(morphology): add GalaxyMorphology types and 10 Hubble presets"
```

Do NOT commit `index.ts` yet — it has unresolved imports.

---

### Task 2: Create `morphologyParser.ts` — Hubble string parsing

**Files:**
- Create: `src/main/site/src/three/galaxy-detail/morphology/morphologyParser.ts`
- Reference: `src/main/site/src/three/galaxy-detail/GalaxyParamsMapper.ts:92-166` (existing `parseMorphology` + `HUBBLE_STAGES`)

**Step 1: Write the test**

Create `src/main/site/src/three/galaxy-detail/morphology/__tests__/morphologyParser.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { parseMorphology } from '../morphologyParser'

describe('parseMorphology', () => {
  it('parses elliptical types', () => {
    expect(parseMorphology('E3')).toMatchObject({ type: 'elliptical', eNumber: 3 })
    expect(parseMorphology('E0')).toMatchObject({ type: 'elliptical', eNumber: 0 })
    expect(parseMorphology('E7')).toMatchObject({ type: 'elliptical', eNumber: 7 })
    expect(parseMorphology('E')).toMatchObject({ type: 'elliptical', eNumber: 3 }) // default
    expect(parseMorphology('cE')).toMatchObject({ type: 'elliptical' }) // compact
    expect(parseMorphology('dE')).toMatchObject({ type: 'elliptical' }) // dwarf
  })

  it('parses lenticular types', () => {
    expect(parseMorphology('S0')).toMatchObject({ type: 'lenticular' })
    expect(parseMorphology('S0/a')).toMatchObject({ type: 'lenticular' })
    expect(parseMorphology('E/S0')).toMatchObject({ type: 'lenticular' })
  })

  it('parses unbarred spirals with correct hubbleStage', () => {
    expect(parseMorphology('Sa')).toMatchObject({ type: 'spiral', hubbleStage: 1 })
    expect(parseMorphology('SAb')).toMatchObject({ type: 'spiral', hubbleStage: 3 })
    expect(parseMorphology('Sc')).toMatchObject({ type: 'spiral', hubbleStage: 5 })
    expect(parseMorphology('Sd')).toMatchObject({ type: 'spiral', hubbleStage: 7 })
    expect(parseMorphology('Sm')).toMatchObject({ type: 'spiral', hubbleStage: 9 })
  })

  it('parses barred spirals', () => {
    expect(parseMorphology('SBa')).toMatchObject({ type: 'barred', hubbleStage: 1, barStrength: 'strong' })
    expect(parseMorphology('SBc')).toMatchObject({ type: 'barred', hubbleStage: 5, barStrength: 'strong' })
    expect(parseMorphology('SABb')).toMatchObject({ type: 'barred', hubbleStage: 3, barStrength: 'weak' })
  })

  it('parses ring notation', () => {
    expect(parseMorphology('SB(r)a')).toMatchObject({ ringType: 'r' })
    expect(parseMorphology('SA(s)bc')).toMatchObject({ ringType: 's' })
    expect(parseMorphology('SB(rs)c')).toMatchObject({ ringType: 'rs' })
  })

  it('parses irregular types', () => {
    expect(parseMorphology('Irr')).toMatchObject({ type: 'irregular' })
    expect(parseMorphology('Im')).toMatchObject({ type: 'irregular' })
    expect(parseMorphology('IBm')).toMatchObject({ type: 'irregular' })
  })

  it('returns spiral fallback for null/unknown', () => {
    expect(parseMorphology(null)).toMatchObject({ type: 'spiral', hubbleStage: 3 })
    expect(parseMorphology('')).toMatchObject({ type: 'spiral', hubbleStage: 3 })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd src/main/site && npx vitest run src/three/galaxy-detail/morphology/__tests__/morphologyParser.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/main/site/src/three/galaxy-detail/morphology/morphologyParser.ts`.

Extract `parseMorphology()` and `HUBBLE_STAGES` from `GalaxyParamsMapper.ts:92-166`. Exact same logic, just in its own file:

```ts
/**
 * Hubble Type String Parser
 *
 * Parses astronomical morphology strings (e.g., "SBc", "E3", "SAB(rs)bc")
 * into a structured classification. Extracted from GalaxyParamsMapper.
 */

export interface ParsedMorphology {
  type: 'spiral' | 'barred' | 'elliptical' | 'lenticular' | 'irregular'
  hubbleStage: number         // 1 (Sa) → 9 (Sm), 0 for non-spirals
  eNumber: number | null      // 0-7 for ellipticals
  barStrength: 'strong' | 'weak' | null
  ringType: 'r' | 's' | 'rs' | null
}

const HUBBLE_STAGES: Record<string, number> = {
  a: 1, ab: 2, b: 3, bc: 4, c: 5, cd: 6, d: 7, dm: 8, m: 9,
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

export function parseMorphology(morph: string | null): ParsedMorphology {
  const fallback: ParsedMorphology = {
    type: 'spiral', hubbleStage: 3, eNumber: null, barStrength: null, ringType: null,
  }

  if (!morph) return fallback
  const m = morph.trim()
  if (!m) return fallback

  // Ring notation
  let ringType: 'r' | 's' | 'rs' | null = null
  const ringMatch = m.match(/\((rs|r|s)\)/)
  if (ringMatch) ringType = ringMatch[1] as 'r' | 's' | 'rs'

  // Irregular
  if (/^I(rr|m|Bm?)?$/i.test(m)) {
    return { type: 'irregular', hubbleStage: 0, eNumber: null, barStrength: null, ringType }
  }

  // Elliptical
  const eMatch = m.match(/^[cd]?E(\d)?$/i)
  if (eMatch) {
    const eNum = eMatch[1] != null ? parseInt(eMatch[1], 10) : 3
    return { type: 'elliptical', hubbleStage: 0, eNumber: clamp(eNum, 0, 7), barStrength: null, ringType }
  }

  // Lenticular
  if (/S0/i.test(m) || /^E[/-]S0/i.test(m)) {
    return { type: 'lenticular', hubbleStage: 0, eNumber: null, barStrength: null, ringType }
  }

  // Barred spirals (strong: SB...)
  const barredStrong = m.match(/^SB\(?[rs]*\)?([a-m]+)?/i)
  if (barredStrong) {
    const stage = barredStrong[1] ? (HUBBLE_STAGES[barredStrong[1].toLowerCase()] ?? 3) : 3
    return { type: 'barred', hubbleStage: stage, eNumber: null, barStrength: 'strong', ringType }
  }

  // Barred spirals (weak: SAB...)
  const barredWeak = m.match(/^SAB\(?[rs]*\)?([a-m]+)?/i)
  if (barredWeak) {
    const stage = barredWeak[1] ? (HUBBLE_STAGES[barredWeak[1].toLowerCase()] ?? 3) : 3
    return { type: 'barred', hubbleStage: stage, eNumber: null, barStrength: 'weak', ringType }
  }

  // Normal spirals
  const spiralMatch = m.match(/^S[A]?\(?[rs]*\)?([a-m]+)?/i)
  if (spiralMatch) {
    const stage = spiralMatch[1] ? (HUBBLE_STAGES[spiralMatch[1].toLowerCase()] ?? 3) : 3
    return { type: 'spiral', hubbleStage: stage, eNumber: null, barStrength: null, ringType }
  }

  return fallback
}
```

**Step 4: Run test to verify it passes**

Run: `cd src/main/site && npx vitest run src/three/galaxy-detail/morphology/__tests__/morphologyParser.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/morphology/morphologyParser.ts \
        src/main/site/src/three/galaxy-detail/morphology/__tests__/morphologyParser.test.ts
git commit -m "feat(morphology): extract Hubble string parser into morphologyParser"
```

---

### Task 3: Create `morphologyMapper.ts` — catalog data to render params

**Files:**
- Create: `src/main/site/src/three/galaxy-detail/morphology/morphologyMapper.ts`
- Reference: `src/main/site/src/three/galaxy-detail/GalaxyParamsMapper.ts:170-284` (existing mapping logic)
- Reference: `src/main/site/src/types/galaxy.ts:57-96,111-143` (seeded random, assignMorphology, estimateGalaxySize)

**Step 1: Write the test**

Create `src/main/site/src/three/galaxy-detail/morphology/__tests__/morphologyMapper.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mapGalaxyToRenderParams, selectPreset } from '../morphologyMapper'
import type { Galaxy } from '@/types/galaxy'
import type { MorphologyPreset } from '../GalaxyMorphology'

// Minimal galaxy fixture
function makeGalaxy(overrides: Partial<Galaxy> = {}): Galaxy {
  return {
    pgc: 12345,
    group_pgc: null,
    vcmb: 1000,
    dm: 30,
    e_dm: null,
    ra: 180,
    dec: 45,
    glon: null,
    glat: null,
    sgl: null,
    sgb: null,
    distance_mpc: 10,
    distance_mly: 32.6,
    dm_snia: null, dm_tf: null, dm_fp: null, dm_sbf: null,
    dm_snii: null, dm_trgb: null, dm_ceph: null, dm_mas: null,
    t17: null,
    e_dm_snia: null, e_dm_tf: null, e_dm_fp: null, e_dm_sbf: null,
    e_dm_snii: null, e_dm_trgb: null, e_dm_ceph: null, e_dm_mas: null,
    source: null,
    name: null,
    morphology: null,
    agc: null,
    v_hi: null,
    log_mhi: null, e_log_mhi: null,
    log_ms_t: null, e_log_ms_t: null,
    log_sfr_nuv: null, e_log_sfr_nuv: null,
    b_mag: null,
    diameter_arcsec: null,
    axial_ratio: null,
    ba: null,
    ...overrides,
  }
}

describe('selectPreset', () => {
  const cases: [string | null, MorphologyPreset][] = [
    ['E3', 'elliptical'],
    ['S0', 'lenticular'],
    ['Sa', 'spiralSa'],
    ['SAb', 'spiral'],
    ['Sc', 'grandDesign'],
    ['Sd', 'flocculent'],
    ['SBa', 'barredTight'],
    ['SBb', 'barred'],
    ['SBc', 'barredOpen'],
    ['Irr', 'irregular'],
    ['Sm', 'flocculent'],
    ['SABbc', 'barred'],
  ]

  it.each(cases)('maps "%s" → %s', (hubble, expected) => {
    expect(selectPreset(hubble)).toBe(expected)
  })
})

describe('mapGalaxyToRenderParams', () => {
  it('returns consistent results for the same PGC', () => {
    const g = makeGalaxy()
    const a = mapGalaxyToRenderParams(g)
    const b = mapGalaxyToRenderParams(g)
    expect(a).toEqual(b)
  })

  it('uses catalog morphology when available', () => {
    const g = makeGalaxy({ morphology: 'SBc' })
    const params = mapGalaxyToRenderParams(g)
    expect(params.morphology.preset).toBe('barredOpen')
    expect(params.morphology.barLength).toBeGreaterThan(0)
  })

  it('falls back to seeded random when no morphology string', () => {
    const g = makeGalaxy({ morphology: null })
    const params = mapGalaxyToRenderParams(g)
    expect(params.morphology.preset).toBeDefined()
    expect(params.starCount).toBeGreaterThan(0)
    expect(params.galaxyRadius).toBeGreaterThan(0)
  })

  it('applies observed axial_ratio to elliptical', () => {
    const g = makeGalaxy({ morphology: 'E5', axial_ratio: 0.3 })
    const params = mapGalaxyToRenderParams(g)
    expect(params.morphology.axisRatio).toBe(0.3)
  })

  it('produces valid galaxyRadius and starCount', () => {
    const g = makeGalaxy()
    const params = mapGalaxyToRenderParams(g)
    expect(params.galaxyRadius).toBeGreaterThan(0)
    expect(params.starCount).toBeGreaterThanOrEqual(42000)
    expect(params.diameterKpc).toBeGreaterThan(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `cd src/main/site && npx vitest run src/three/galaxy-detail/morphology/__tests__/morphologyMapper.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/main/site/src/three/galaxy-detail/morphology/morphologyMapper.ts`:

```ts
/**
 * Morphology Mapper — Catalog Data to Render Params
 *
 * Maps Galaxy catalog data to GalaxyRenderParams by:
 * 1. Parsing the Hubble type string (or falling back to seeded random)
 * 2. Selecting one of the 10 presets
 * 3. Applying catalog overrides (observed axis ratio, size, etc.)
 * 4. Computing absolute rendering values (galaxyRadius, starCount)
 */

import type { Galaxy } from '@/types/galaxy'
import {
  type MorphologyPreset,
  type MorphologyCategory,
  type GalaxyMorphology,
  type GalaxyRenderParams,
  MORPHOLOGY_PRESETS,
  presetToCategory,
} from './GalaxyMorphology'
import { parseMorphology } from './morphologyParser'

// ─── PRNG ────────────────────────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededRandom(seed: number): number {
  let s = seed | 0
  s = (s + 0x6d2b79f5) | 0
  let t = Math.imul(s ^ (s >>> 15), 1 | s)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

// ─── Preset Selection ────────────────────────────────────────────────────────

const SPIRAL_STAGE_MAP: [number, MorphologyPreset][] = [
  [2, 'spiralSa'],      // stages 1-2
  [4, 'spiral'],         // stages 3-4
  [6, 'grandDesign'],    // stages 5-6
  [9, 'flocculent'],     // stages 7-9
]

const BARRED_STAGE_MAP: [number, MorphologyPreset][] = [
  [2, 'barredTight'],    // stages 1-2
  [4, 'barred'],         // stages 3-4
  [9, 'barredOpen'],     // stages 5-9
]

/**
 * Select a preset from a Hubble type string. Exported for testing.
 * Returns null-safe — always returns a valid preset.
 */
export function selectPreset(hubble: string | null): MorphologyPreset {
  const parsed = parseMorphology(hubble)

  switch (parsed.type) {
    case 'elliptical': return 'elliptical'
    case 'lenticular': return 'lenticular'
    case 'irregular': return 'irregular'
    case 'spiral':
      for (const [maxStage, preset] of SPIRAL_STAGE_MAP) {
        if (parsed.hubbleStage <= maxStage) return preset
      }
      return 'flocculent'
    case 'barred':
      for (const [maxStage, preset] of BARRED_STAGE_MAP) {
        if (parsed.hubbleStage <= maxStage) return preset
      }
      return 'barredOpen'
  }
}

/**
 * Assign a preset when no catalog morphology is available.
 * Seeded by PGC for determinism. Weighted by cosmic proportions.
 */
function assignPresetFromPgc(pgc: number): MorphologyPreset {
  const r = seededRandom(pgc)
  // ~35% spiral (split across 4 sub-types), ~35% barred (split across 3),
  // ~15% elliptical, ~10% lenticular, ~5% irregular
  if (r < 0.09) return 'spiralSa'
  if (r < 0.18) return 'spiral'
  if (r < 0.27) return 'grandDesign'
  if (r < 0.35) return 'flocculent'
  if (r < 0.47) return 'barredTight'
  if (r < 0.59) return 'barred'
  if (r < 0.70) return 'barredOpen'
  if (r < 0.85) return 'elliptical'
  if (r < 0.95) return 'lenticular'
  return 'irregular'
}

// ─── Size Estimation ─────────────────────────────────────────────────────────

function estimateGalaxySize(
  galaxy: Galaxy,
  category: MorphologyCategory,
  rand: () => number,
): { diameterKpc: number; sizeSource: 'observed' | 'mass' | 'random' } {
  let diameterKpc: number
  let sizeSource: 'observed' | 'mass' | 'random'

  if (galaxy.diameter_arcsec && galaxy.distance_mpc) {
    diameterKpc = (galaxy.diameter_arcsec / 206.265) * galaxy.distance_mpc
    sizeSource = 'observed'
  } else if (galaxy.log_ms_t != null) {
    const isEarlyType = category === 'elliptical' || category === 'lenticular'
    const logRhalf = isEarlyType
      ? 0.56 * galaxy.log_ms_t - 5.54
      : 0.14 * galaxy.log_ms_t - 0.66
    diameterKpc = Math.pow(10, logRhalf) * 4
    sizeSource = 'mass'
  } else {
    diameterKpc = 25 * (0.5 + rand() * 1.0)
    sizeSource = 'random'
  }

  return { diameterKpc: clamp(diameterKpc, 1, 200), sizeSource }
}

// ─── Main Mapper ─────────────────────────────────────────────────────────────

/**
 * Map a Galaxy record to GalaxyRenderParams.
 *
 * This is the main entry point — replaces `galaxyToGeneratorParams()`.
 */
export function mapGalaxyToRenderParams(galaxy: Galaxy): GalaxyRenderParams {
  const rand = mulberry32(galaxy.pgc)

  // 1. Select preset
  const preset = galaxy.morphology
    ? selectPreset(galaxy.morphology)
    : assignPresetFromPgc(galaxy.pgc)

  // 2. Start from preset defaults
  const morphology: GalaxyMorphology = { ...MORPHOLOGY_PRESETS[preset] }

  // 3. Apply catalog overrides
  const category = presetToCategory(preset)

  // Observed axis ratio overrides preset default
  const observedBa = galaxy.axial_ratio ?? galaxy.ba
  if (observedBa != null) {
    morphology.axisRatio = observedBa
    if (category === 'elliptical') {
      morphology.ellipticity = 1 - observedBa
    }
  }

  // Add seeded variation within preset (±20% on key params)
  const vary = (base: number, spread: number) =>
    base > 0 ? base * (1 + (rand() - 0.5) * spread) : 0

  morphology.armWidth = vary(morphology.armWidth, 0.3)
  morphology.spiralTightness = vary(morphology.spiralTightness, 0.2)
  morphology.bulgeRadius = vary(morphology.bulgeRadius, 0.3)
  morphology.barLength = vary(morphology.barLength, 0.2)
  morphology.barWidth = vary(morphology.barWidth, 0.3)

  // Randomize arm count for multi-arm presets
  if (morphology.numArms > 0 && preset !== 'spiralSa' && preset !== 'barredTight') {
    const armBase = morphology.numArms
    morphology.numArms = Math.max(2, Math.round(armBase + (rand() - 0.5) * 2))
  }

  // Randomize clump count for irregulars
  if (morphology.clumpCount > 0) {
    morphology.clumpCount = Math.round(3 + rand() * 9)
  }

  // 4. Size estimation
  const { diameterKpc, sizeSource } = estimateGalaxySize(galaxy, category, rand)
  const galaxyRadius = clamp(diameterKpc * 12, 30, 2400)

  // 5. Star count
  let starCount: number
  if (galaxy.log_ms_t != null && galaxy.log_ms_t > 10.8) {
    const massScale = Math.pow(10, 0.15 * (galaxy.log_ms_t - 10.8))
    starCount = clamp(Math.round(60000 * massScale), 60000, 120000)
  } else {
    starCount = clamp(Math.round(60000 * (0.7 + rand() * 0.6)), 42000, 78000)
  }

  return { morphology, starCount, galaxyRadius, diameterKpc, sizeSource }
}
```

**Step 4: Run test to verify it passes**

Run: `cd src/main/site && npx vitest run src/three/galaxy-detail/morphology/__tests__/morphologyMapper.test.ts`
Expected: PASS

**Step 5: Commit the barrel index too**

Now all three modules exist, so `index.ts` can be committed.

```bash
git add src/main/site/src/three/galaxy-detail/morphology/morphologyMapper.ts \
        src/main/site/src/three/galaxy-detail/morphology/__tests__/morphologyMapper.test.ts \
        src/main/site/src/three/galaxy-detail/morphology/index.ts
git commit -m "feat(morphology): add morphologyMapper and barrel index"
```

---

### Task 4: Update `GalaxyParamsMapper.ts` to delegate to new module

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/GalaxyParamsMapper.ts`

This task converts `GalaxyParamsMapper.ts` into a thin adapter that re-exports the new module's API. Existing importers don't need to change yet.

**Step 1: No new test needed**

The existing test coverage is via the new module tests. This task is a wiring change.

**Step 2: Rewrite `GalaxyParamsMapper.ts`**

Replace the file contents with a thin adapter that:
- Re-exports `GalaxyRenderParams` as `GeneratorParams` for backward compatibility
- Re-exports `parseMorphology`, `ParsedMorphology`
- Delegates `galaxyToGeneratorParams` to `mapGalaxyToRenderParams`
- Keeps the old type interfaces temporarily as aliases

```ts
/**
 * Galaxy Params Mapper — Backward-compatible adapter
 *
 * Delegates to the new morphology module. Existing imports continue to work.
 * TODO: Migrate consumers to import from morphology/ directly, then delete this file.
 */

import type { Galaxy } from '@/types/galaxy'
import {
  type GalaxyMorphology,
  type GalaxyRenderParams,
  type MorphologyPreset,
  mapGalaxyToRenderParams,
} from './morphology'

export { parseMorphology, type ParsedMorphology } from './morphology'

// ─── Backward-compatible type aliases ────────────────────────────────────────

// The old GeneratorParams was a discriminated union. The new GalaxyRenderParams
// is a flat struct. Re-export it so existing consumers compile.
export type GeneratorParams = GalaxyRenderParams

// Re-export new types for consumers that want to migrate
export type { GalaxyMorphology, GalaxyRenderParams, MorphologyPreset }

// ─── Backward-compatible entry point ─────────────────────────────────────────

export function galaxyToGeneratorParams(galaxy: Galaxy): GalaxyRenderParams {
  return mapGalaxyToRenderParams(galaxy)
}
```

**Step 3: Run all morphology tests**

Run: `cd src/main/site && npx vitest run src/three/galaxy-detail/morphology/`
Expected: PASS

**Step 4: Run type check**

Run: `cd src/main/site && npx vue-tsc --noEmit 2>&1 | head -40`

This WILL produce type errors in files that access `GeneratorParams.type` or cast to `SpiralParams`, etc. That's expected — those are fixed in Tasks 5 and 6.

**Step 5: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/GalaxyParamsMapper.ts
git commit -m "refactor(morphology): convert GalaxyParamsMapper to adapter for new module"
```

---

### Task 5: Update `GalaxyGenerator.ts` (WebGL CPU) to use flat params

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/GalaxyGenerator.ts`

Replace the 5-type switch with parameter-driven generation. The generator reads the flat `GalaxyMorphology` struct from `GalaxyRenderParams`.

**Step 1: Rewrite `generateGalaxy()` entry point**

Change `generateGalaxy(params: GeneratorParams)` to `generateGalaxy(params: GalaxyRenderParams)`.

Replace the switch statement at line 621 with parameter-driven logic:

```ts
export function generateGalaxy(params: GalaxyRenderParams): Star[] {
  const m = params.morphology
  const R = params.galaxyRadius
  let stars: Star[] = []

  // Bar stars (if bar exists)
  if (m.barLength > 0) {
    stars.push(...generateBarStars(params))
  }

  // Arm stars (if arms exist)
  if (m.numArms > 0) {
    stars.push(...generateArmStars(params))
  }

  // Bulge stars (if bulge exists)
  if (m.bulgeRadius > 0) {
    stars.push(...generateBulgeStars(params))
  }

  // Clump stars (for irregulars)
  if (m.clumpCount > 0 && m.irregularity > 0) {
    stars.push(...generateClumpStars(params))
  }

  // Elliptical envelope (no arms, no bar, no clumps)
  if (m.numArms === 0 && m.barLength === 0 && m.clumpCount === 0 && m.ellipticity > 0) {
    stars.push(...generateEllipticalStars(params))
  }

  // Disk stars (for lenticulars — no arms, no bar, has bulge, no clumps)
  if (m.numArms === 0 && m.barLength === 0 && m.clumpCount === 0 && m.ellipticity === 0 && m.bulgeFraction > 0) {
    stars.push(...generateDiskStars(params))
  }

  // Field stars
  if (m.fieldStarFraction > 0) {
    const fieldCount = Math.floor(params.starCount * m.fieldStarFraction)
    for (let i = 0; i < fieldCount; i++) {
      stars.push(generateFieldStar(R))
    }
  }

  return applyCentralClearZone(stars, params)
}
```

**Step 2: Refactor each generation function**

Each existing function (`generateSpiral`, `generateBarredSpiral`, etc.) becomes a focused component function that reads from `GalaxyRenderParams` instead of specific param interfaces:

- `generateArmStars(params)` — merges old `generateSpiral` arm logic + barred arm logic (bar exclusion zone when `barLength > 0`)
- `generateBarStars(params)` — extracted from `generateBarredSpiral`
- `generateBulgeStars(params)` — shared across spiral/barred/lenticular
- `generateEllipticalStars(params)` — from `generateElliptical`
- `generateDiskStars(params)` — from `generateLenticular` disk portion
- `generateClumpStars(params)` — from `generateIrregular`

Remove the old type-specific interfaces import (`SpiralParams`, `BarredParams`, etc.) — they no longer exist.

**Step 3: Update imports**

Change:
```ts
import type { GeneratorParams, SpiralParams, BarredParams, ... } from './GalaxyParamsMapper'
```
To:
```ts
import type { GalaxyRenderParams } from './morphology'
```

**Step 4: Run type check**

Run: `cd src/main/site && npx vue-tsc --noEmit 2>&1 | head -40`
Fix any remaining type errors in this file.

**Step 5: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/GalaxyGenerator.ts
git commit -m "refactor(morphology): rewrite GalaxyGenerator to use flat params"
```

---

### Task 6: Update `GalaxyComputeInit.ts` (WebGPU GPU) to use flat params

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeInit.ts`

**Step 1: Update `createGalaxyUniforms`**

Change to accept `GalaxyRenderParams`. Remove `morphMap` and `morphType` uniform. Read params directly from `params.morphology`:

```ts
export function createGalaxyUniforms(params: GalaxyRenderParams): GalaxyUniforms {
  const m = params.morphology
  return {
    numArms: uniform(m.numArms),
    armWidth: uniform(m.armWidth),
    spiralTightness: uniform(m.spiralTightness),
    spiralStart: uniform(m.spiralStart),
    bulgeRadius: uniform(m.bulgeRadius * params.galaxyRadius),
    fieldStarFraction: uniform(m.fieldStarFraction),
    irregularity: uniform(m.irregularity),
    barLength: uniform(m.barLength * params.galaxyRadius),
    barWidth: uniform(m.barWidth * params.galaxyRadius),
    axisRatio: uniform(m.axisRatio),
    bulgeFraction: uniform(m.bulgeFraction),
    diskThickness: uniform(m.diskThickness),
    clumpCount: uniform(m.clumpCount),
    ellipticity: uniform(m.ellipticity),
    galaxyRadius: uniform(params.galaxyRadius),
    // ... rest unchanged (time, mouse, etc.)
  }
}
```

**Step 2: Update `GalaxyUniforms` interface**

Remove `morphType` from the interface. Add `ellipticity` if not present.

**Step 3: Update compute shader branching**

Replace `If(morphType.equal(0).or(morphType.equal(1)))` with parameter-based checks:

- `If(uniforms.numArms.greaterThan(0))` — generate arm stars
- `If(uniforms.barLength.greaterThan(0))` — generate bar stars
- `If(uniforms.ellipticity.greaterThan(0))` — generate elliptical envelope
- `If(uniforms.clumpCount.greaterThan(0))` — generate clump stars

This mirrors the same parameter-driven logic from Task 5.

**Step 4: Update imports**

```ts
import type { GalaxyRenderParams } from '../morphology'
```

**Step 5: Update `GalaxySceneWebGPU.ts`**

Change the import from `GalaxyParamsMapper` to the new module:

```ts
import { mapGalaxyToRenderParams } from '../morphology'
import type { GalaxyRenderParams } from '../morphology'
```

Update the constructor: `this.params = mapGalaxyToRenderParams(galaxy)`

**Step 6: Run type check**

Run: `cd src/main/site && npx vue-tsc --noEmit 2>&1 | head -40`
Expected: Fewer errors. Fix any in this file.

**Step 7: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeInit.ts \
        src/main/site/src/three/galaxy-detail/webgpu/GalaxySceneWebGPU.ts
git commit -m "refactor(morphology): update WebGPU compute to use flat params"
```

---

### Task 7: Update `GalaxyScene.ts` (WebGL orchestrator)

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/GalaxyScene.ts`

**Step 1: Update imports**

Change:
```ts
import { galaxyToGeneratorParams } from './GalaxyParamsMapper'
import type { GeneratorParams } from './GalaxyParamsMapper'
```
To:
```ts
import { mapGalaxyToRenderParams } from './morphology'
import type { GalaxyRenderParams } from './morphology'
```

**Step 2: Update field types and usage**

- `private params: GeneratorParams` → `private params: GalaxyRenderParams`
- `galaxyToGeneratorParams(galaxy)` → `mapGalaxyToRenderParams(galaxy)`
- Replace `this.params.type === 'elliptical'` (line ~318) with `this.params.morphology.ellipticity > 0`

**Step 3: Run type check**

Run: `cd src/main/site && npx vue-tsc --noEmit 2>&1 | head -40`
Expected: Fewer errors.

**Step 4: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/GalaxyScene.ts
git commit -m "refactor(morphology): update WebGL GalaxyScene to use new module"
```

---

### Task 8: Update `types/galaxy.ts` — remove migrated code

**Files:**
- Modify: `src/main/site/src/types/galaxy.ts`

**Step 1: Remove migrated exports**

Remove from `types/galaxy.ts`:
- `MorphologyClass` type (replaced by `MorphologyPreset` + `MorphologyCategory`)
- `assignMorphology()` function (moved to `morphologyMapper`)
- `estimateGalaxySize()` function (moved to `morphologyMapper`)
- `SizeSource` type (moved to `GalaxyMorphology.ts`)
- `GalaxySizeEstimate` interface (moved to `morphologyMapper`)
- `seededRandom()` helper (moved to `morphologyMapper`)
- `hubbleToClass()` helper (replaced by parser)

Keep:
- `Galaxy` interface
- `GalaxyGroup` interface
- `velocityToColor()` function

**Step 2: Run type check to find all broken imports**

Run: `cd src/main/site && npx vue-tsc --noEmit 2>&1`

This will show all files that still import the removed exports. Fix each one in the next steps.

**Step 3: Commit**

```bash
git add src/main/site/src/types/galaxy.ts
git commit -m "refactor(morphology): remove migrated code from types/galaxy.ts"
```

---

### Task 9: Update sky-view consumers (`GalaxyField.ts`, `GalaxyTextures.ts`, `constants.ts`)

**Files:**
- Modify: `src/main/site/src/three/GalaxyField.ts`
- Modify: `src/main/site/src/three/GalaxyTextures.ts`
- Modify: `src/main/site/src/three/constants.ts`

These files use broad morphology categories for the sky-view (texture atlas, field shaders, colors). They should use `MorphologyCategory` + `presetToCategory()`.

**Step 1: Update `constants.ts`**

Change:
```ts
import type { MorphologyClass } from '@/types/galaxy'
export const MORPHOLOGY_COLORS: Record<MorphologyClass, [number, number, number]>
```
To:
```ts
import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'
export const MORPHOLOGY_COLORS: Record<MorphologyCategory, [number, number, number]>
```

Remove the `unknown` entry from `MORPHOLOGY_COLORS` (the new type doesn't include it).

**Step 2: Update `GalaxyTextures.ts`**

Change `MorphologyClass` references to `MorphologyCategory`. Update `ATLAS_ORDER` to use `MorphologyCategory[]`. The 5-category texture atlas stays the same — the sky-view doesn't need 10 sub-types.

**Step 3: Update `GalaxyField.ts`**

Change imports:
```ts
import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'
import { selectPreset, presetToCategory } from '@/three/galaxy-detail/morphology'
```

Replace `assignMorphology(g.pgc)` calls with:
```ts
const preset = selectPreset(g.morphology)
// or for galaxies without morphology string:
// const preset = assignPresetFromPgc(g.pgc)  (need to export this)
const category = presetToCategory(preset)
```

Update `morphologyToGalaxyType` to use `MorphologyCategory`.

**Note:** `assignPresetFromPgc` needs to be exported from `morphologyMapper.ts`. Add it to the barrel export.

**Step 4: Run type check**

Run: `cd src/main/site && npx vue-tsc --noEmit 2>&1 | head -40`

**Step 5: Commit**

```bash
git add src/main/site/src/three/constants.ts \
        src/main/site/src/three/GalaxyTextures.ts \
        src/main/site/src/three/GalaxyField.ts \
        src/main/site/src/three/galaxy-detail/morphology/morphologyMapper.ts \
        src/main/site/src/three/galaxy-detail/morphology/index.ts
git commit -m "refactor(morphology): update sky-view consumers to use MorphologyCategory"
```

---

### Task 10: Update UI components and views

**Files:**
- Modify: `src/main/site/src/components/GalaxyInfoCard.vue`
- Modify: `src/main/site/src/components/GalaxyDataSidebar.vue`
- Modify: `src/main/site/src/components/GalaxyCanvas.vue`
- Modify: `src/main/site/src/components/SkyFilterPanel.vue`
- Modify: `src/main/site/src/components/AboutBackground.vue`
- Modify: `src/main/site/src/views/HomeView.vue`
- Modify: `src/main/site/src/views/TourView.vue`
- Modify: `src/main/site/src/i18n/locales/en-US.json`
- Modify: `src/main/site/src/i18n/locales/pt-BR.json`

**Step 1: Update component imports**

All components that import `MorphologyClass` or `assignMorphology` from `@/types/galaxy` need to change to:

```ts
import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'
import { selectPreset, presetToCategory } from '@/three/galaxy-detail/morphology'
```

Replace `assignMorphology(g.pgc, g.morphology)` with:
```ts
const preset = selectPreset(g.morphology)
// If g.morphology is null and need fallback:
// import { assignPresetFromPgc } from '@/three/galaxy-detail/morphology'
const category = presetToCategory(preset)
```

For i18n references like `t('morphology.' + morphology)`, continue using the 5 category keys since those are user-facing labels. The i18n keys stay the same.

**Step 2: Update `SkyFilterPanel.vue`**

Replace `MorphologyClass` with `MorphologyCategory` in the filter options. The filter UI shows 5 broad categories, not 10 presets — this is the right UX.

**Step 3: Update `GalaxyInfoCard.vue` and `GalaxyDataSidebar.vue`**

Replace `assignMorphology` + `estimateGalaxySize` calls with `mapGalaxyToRenderParams`. Or for display purposes, just use `selectPreset` + `presetToCategory`.

**Step 4: Run type check — should be clean**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: PASS (0 errors)

**Step 5: Commit**

```bash
git add src/main/site/src/components/*.vue \
        src/main/site/src/views/HomeView.vue \
        src/main/site/src/views/TourView.vue
git commit -m "refactor(morphology): update UI components to use new morphology module"
```

---

### Task 11: Update `MORPHOLOGY_COLORS` to support 10 presets

**Files:**
- Modify: `src/main/site/src/three/constants.ts`

**Step 1: Add preset-level colors**

Add a second color map keyed by `MorphologyPreset` for renderers that want sub-type specific colors (e.g., the detail view). Keep the existing `MorphologyCategory`-keyed map for the sky view.

```ts
import type { MorphologyPreset, MorphologyCategory } from '@/three/galaxy-detail/morphology'

export const MORPHOLOGY_COLORS: Record<MorphologyCategory, [number, number, number]> = {
  spiral:     [0.75, 0.82, 1.00],
  barred:     [1.00, 0.85, 0.55],
  elliptical: [1.00, 0.65, 0.38],
  lenticular: [1.00, 0.78, 0.50],
  irregular:  [0.78, 0.68, 1.00],
}

export const PRESET_COLORS: Record<MorphologyPreset, [number, number, number]> = {
  elliptical:  [1.00, 0.65, 0.38],
  lenticular:  [1.00, 0.78, 0.50],
  spiralSa:    [0.85, 0.85, 0.95],
  spiral:      [0.75, 0.82, 1.00],
  grandDesign: [0.65, 0.78, 1.00],
  flocculent:  [0.70, 0.75, 1.00],
  barredTight: [1.00, 0.82, 0.50],
  barred:      [1.00, 0.85, 0.55],
  barredOpen:  [0.95, 0.88, 0.60],
  irregular:   [0.78, 0.68, 1.00],
}
```

**Step 2: Commit**

```bash
git add src/main/site/src/three/constants.ts
git commit -m "feat(morphology): add PRESET_COLORS for 10 sub-type tints"
```

---

### Task 12: Clean up and verify

**Step 1: Delete dead code from `GalaxyParamsMapper.ts`**

If all consumers have migrated to the new module, `GalaxyParamsMapper.ts` can be deleted or left as a minimal re-export file. Check that no file still imports the old type-specific interfaces.

Run: `cd src/main/site && npx grep -r "SpiralParams\|BarredParams\|EllipticalParams\|LenticularParams\|IrregularParams" src/`

If no matches outside of the adapter file, the adapter is serving its purpose.

**Step 2: Run full type check**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: 0 errors

**Step 3: Run all tests**

Run: `cd src/main/site && npx vitest run`
Expected: All tests pass (shader tests + new morphology tests)

**Step 4: Run dev server and smoke test**

Run: `cd src/main/site && npm run dev`

Manually verify:
- Home view loads with galaxy field
- Click a galaxy → detail view renders correctly
- Different galaxy types look visually distinct
- Filter panel works
- Galaxy info card shows morphology label

**Step 5: Final commit**

```bash
git add -A
git commit -m "refactor(morphology): complete migration to shared morphology module"
```
