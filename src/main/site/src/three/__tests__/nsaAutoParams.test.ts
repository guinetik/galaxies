import { describe, expect, it } from 'vitest'
import { computeAutoParams } from '../nsa/NSACompositeScene'
import type { NSAMetadata } from '@/types/nsa'

function makeMetadata(ranges: Record<string, [number, number]>): NSAMetadata {
  return {
    pgc: 1,
    nsa_iau_name: 'test',
    nsaid: 1,
    ra: 0,
    dec: 0,
    bands: Object.keys(ranges),
    dimensions: [100, 100],
    data_ranges: ranges,
    fetched_date: '2026-01-01',
    nsa_url: '',
  }
}

describe('computeAutoParams', () => {
  it('returns Q=10 and sensitivity=1.0 for lupton mode', () => {
    const meta = makeMetadata({ r: [0, 100], g: [0, 80], i: [0, 120] })
    const params = computeAutoParams(meta, 'lupton')
    expect(params.Q).toBe(10.0)
    expect(params.sensitivity).toBe(1.0)
  })

  it('computes alpha so that alpha * Q * I_typical ≈ 1', () => {
    const meta = makeMetadata({ r: [0, 100], g: [0, 80], i: [0, 120] })
    // avgSignalRange = (100 + 80 + 120) / 3 = 100; I_typical = 100 * 0.3 = 30
    // alpha_auto = 1 / (10 * 30) = 0.003333...
    const params = computeAutoParams(meta, 'lupton')
    expect(params.alpha * params.Q * 30).toBeCloseTo(1.0, 1)
  })

  it('clamps alpha to [0.001, 10.0]', () => {
    // Very faint galaxy — tiny ranges
    const faint = makeMetadata({ r: [0, 0.0001], g: [0, 0.0001], i: [0, 0.0001] })
    expect(computeAutoParams(faint, 'lupton').alpha).toBeLessThanOrEqual(10.0)

    // Very bright galaxy — huge ranges
    const bright = makeMetadata({ r: [0, 100000], g: [0, 100000], i: [0, 100000] })
    expect(computeAutoParams(bright, 'lupton').alpha).toBeGreaterThanOrEqual(0.001)
  })

  it('uses Q=20 for custom mode', () => {
    const meta = makeMetadata({ r: [0, 100], g: [0, 80], i: [0, 120] })
    expect(computeAutoParams(meta, 'custom').Q).toBe(20.0)
  })

  it('returns fixed defaults for 3D modes, ignoring data ranges', () => {
    const meta = makeMetadata({ r: [0, 0.0001], g: [0, 0.0001], i: [0, 0.0001] })
    const nsa3d = computeAutoParams(meta, 'nsa3d')
    const morph = computeAutoParams(meta, 'nsamorphology')
    expect(nsa3d).toEqual({ Q: 1.0, alpha: 0.05, sensitivity: 0.5 })
    expect(morph).toEqual({ Q: 5.0, alpha: 0.503, sensitivity: 1.0 })
  })
})
