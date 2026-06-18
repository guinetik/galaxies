import { describe, it, expect } from 'vitest'
import { computeNeighborSprites } from '../neighborField'
import type { Galaxy } from '@/types/galaxy'

const mk = (over: Partial<Galaxy>): Galaxy => ({
  pgc: 1, group_pgc: null, vcmb: null, ra: 0, dec: 0, glon: null, glat: null,
  sgl: 0, sgb: 0, distance_mpc: 10, distance_mly: 32, axial_ratio: null,
  log_ms_t: null, morphology: 'Sb',
  // spread any remaining required fields as null/0 to satisfy the type:
  ...({} as any), ...over,
}) as Galaxy

describe('computeNeighborSprites', () => {
  it('returns empty when the viewed galaxy lacks SG coords', () => {
    const g = mk({ sgl: null as any })
    expect(computeNeighborSprites(g, [mk({ pgc: 2 })], 100)).toEqual([])
  })

  it('places neighbors inside the shell and never beyond it', () => {
    const g = mk({ sgl: 0, sgb: 0, distance_mpc: 10 })
    const n = mk({ pgc: 2, sgl: 10, sgb: 5, distance_mpc: 12 })
    const out = computeNeighborSprites(g, [n], 100)
    expect(out.length).toBe(1)
    const r = Math.hypot(...out[0].position)
    expect(r).toBeGreaterThanOrEqual(100 * 8 - 1)
    expect(r).toBeLessThanOrEqual(100 * 16 + 1)
  })

  it('preserves real relative direction (a neighbor offset in +SG maps to a consistent dir)', () => {
    const g = mk({ sgl: 0, sgb: 0, distance_mpc: 10 })
    const near = mk({ pgc: 2, sgl: 1, sgb: 0, distance_mpc: 11 })
    const far = mk({ pgc: 3, sgl: 1, sgb: 0, distance_mpc: 18 })
    const out = computeNeighborSprites(g, [near, far], 100)
    // Farther real distance → smaller sprite.
    const byPgc = Object.fromEntries(out.map((s, i) => [[near, far][i].pgc, s]))
    expect(byPgc[3].size).toBeLessThan(byPgc[2].size)
  })
})
