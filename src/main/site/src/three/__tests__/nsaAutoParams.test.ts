import { describe, expect, it } from 'vitest'
import { computeAutoParams, computeLuptonBaseStretch } from '../nsa/NSACompositeScene'
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
  it('returns Q=10, alpha=0.5, sensitivity=1.0 for lupton mode', () => {
    const meta = makeMetadata({ r: [0, 100], g: [0, 80], i: [0, 120] })
    const params = computeAutoParams(meta, 'lupton')
    expect(params.Q).toBe(10.0)
    expect(params.alpha).toBe(0.5)
    expect(params.sensitivity).toBe(1.0)
  })

  it('returns alpha=0.5 regardless of data range magnitude', () => {
    const faint = makeMetadata({ r: [0, 0.0001], g: [0, 0.0001], i: [0, 0.0001] })
    const bright = makeMetadata({ r: [0, 100000], g: [0, 100000], i: [0, 100000] })
    expect(computeAutoParams(faint, 'lupton').alpha).toBe(0.5)
    expect(computeAutoParams(bright, 'lupton').alpha).toBe(0.5)
  })

  it('derives Lupton stretch from the average band range width', () => {
    const stretch = computeLuptonBaseStretch([
      [0, 100],
      [10, 160],
      [-5, 205],
    ])

    expect(stretch).toBeCloseTo(3.0666666667)
  })

  it('uses Q=20 for custom mode', () => {
    const meta = makeMetadata({ r: [0, 100], g: [0, 80], i: [0, 120] })
    expect(computeAutoParams(meta, 'custom').Q).toBe(20.0)
  })

  it('returns raw-stack defaults for composite mode', () => {
    const meta = makeMetadata({ u: [0, 15], g: [0, 80], r: [0, 100], i: [0, 120], z: [0, 140] })
    expect(computeAutoParams(meta, 'composite')).toEqual({ Q: 1.0, alpha: 1.0, sensitivity: 1.0 })
  })

  it('returns fixed defaults for 3D modes', () => {
    const meta = makeMetadata({ r: [0, 100], g: [0, 80], i: [0, 120] })
    expect(computeAutoParams(meta, 'nsa3d')).toEqual({ Q: 5.0, alpha: 0.5, sensitivity: 1.0 })
    expect(computeAutoParams(meta, 'nsamorphology')).toEqual({ Q: 5.0, alpha: 0.503, sensitivity: 1.0 })
  })
})
