import { describe, it, expect } from 'vitest'
import { mapGalaxyToRenderParams, selectPreset, assignPresetFromPgc } from '../morphologyMapper'
import type { Galaxy } from '@/types/galaxy'
import type { MorphologyPreset } from '../GalaxyMorphology'

function makeGalaxy(overrides: Partial<Galaxy> = {}): Galaxy {
  return {
    pgc: 12345, group_pgc: null, vcmb: 1000, dm: 30, e_dm: null,
    ra: 180, dec: 45, glon: null, glat: null, sgl: null, sgb: null,
    distance_mpc: 10, distance_mly: 32.6,
    dm_snia: null, dm_tf: null, dm_fp: null, dm_sbf: null,
    dm_snii: null, dm_trgb: null, dm_ceph: null, dm_mas: null,
    t17: null,
    e_dm_snia: null, e_dm_tf: null, e_dm_fp: null, e_dm_sbf: null,
    e_dm_snii: null, e_dm_trgb: null, e_dm_ceph: null, e_dm_mas: null,
    source: null, name: null, morphology: null,
    agc: null, v_hi: null,
    log_mhi: null, e_log_mhi: null, log_ms_t: null, e_log_ms_t: null,
    log_sfr_nuv: null, e_log_sfr_nuv: null,
    b_mag: null, diameter_arcsec: null, axial_ratio: null, position_angle: null, ba: null,
    ...overrides,
  }
}

describe('selectPreset', () => {
  const cases: [string, MorphologyPreset][] = [
    ['E3', 'elliptical'],
    ['S0', 'lenticular'],
    ['SBc', 'barredOpen'],
    ['SBa', 'barredTight'],
    ['SBb', 'barred'],
    ['Irr', 'irregular'],
    ['Sc', 'grandDesign'],
    ['Sd', 'flocculent'],
    ['Sm', 'flocculent'],
  ]
  it.each(cases)('maps "%s" → %s', (hubble, expected) => {
    expect(selectPreset(hubble)).toBe(expected)
  })
})

describe('assignPresetFromPgc', () => {
  it('returns consistent results for same PGC', () => {
    expect(assignPresetFromPgc(12345)).toBe(assignPresetFromPgc(12345))
  })
  it('returns a valid preset', () => {
    const valid: MorphologyPreset[] = [
      'elliptical', 'lenticular', 'spiralSa', 'spiral', 'grandDesign',
      'flocculent', 'barredTight', 'barred', 'barredOpen', 'irregular',
    ]
    for (let pgc = 1; pgc <= 100; pgc++) {
      expect(valid).toContain(assignPresetFromPgc(pgc))
    }
  })
})

describe('mapGalaxyToRenderParams', () => {
  it('returns consistent results for the same PGC', () => {
    const g = makeGalaxy()
    expect(mapGalaxyToRenderParams(g)).toEqual(mapGalaxyToRenderParams(g))
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

  it('includes sizeSource field', () => {
    const g = makeGalaxy()
    const params = mapGalaxyToRenderParams(g)
    expect(['observed', 'mass', 'random']).toContain(params.sizeSource)
  })
})
