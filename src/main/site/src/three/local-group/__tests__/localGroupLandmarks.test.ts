import { describe, expect, it } from 'vitest'
import {
  getLocalGroupLandmarkById,
  getLocalGroupLandmarkIds,
  LOCAL_GROUP_LANDMARKS,
} from '../localGroupLandmarks'

describe('LOCAL_GROUP_LANDMARKS', () => {
  it('keeps a stable narrative order for the waypoint rail', () => {
    expect(getLocalGroupLandmarkIds()).toEqual([
      'milky-way',
      'andromeda',
      'antlia-sextans',
      'virgo-cluster',
      'great-attractor',
    ])
  })

  it('exposes unique ids for every landmark', () => {
    expect(new Set(LOCAL_GROUP_LANDMARKS.map((landmark) => landmark.id)).size)
      .toBe(LOCAL_GROUP_LANDMARKS.length)
  })

  it('returns the matching landmark record by id', () => {
    expect(getLocalGroupLandmarkById('andromeda')?.label).toBe('Andromeda (M31)')
    expect(getLocalGroupLandmarkById('missing')).toBeUndefined()
  })

  it('keeps the M31 landmark tied to its catalog PGC and scaled coordinates', () => {
    const andromeda = getLocalGroupLandmarkById('andromeda')
    const greatAttractor = getLocalGroupLandmarkById('great-attractor')

    expect(andromeda?.groupPgc).toBe(2557)
    expect(andromeda?.coordinates.sgx).toBeGreaterThan(0)
    expect(greatAttractor?.coordinates.sgx).toBeLessThan(-1000)
  })
})
