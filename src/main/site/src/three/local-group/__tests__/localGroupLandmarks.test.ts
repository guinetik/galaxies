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
      'maffei-group',
      'ic342-group',
      'sculptor-group',
      'm81-group',
      'cena-group',
      'm101-group',
      'ngc253',
      'canes-venatici-cloud',
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
    const m101 = getLocalGroupLandmarkById('m101-group')

    expect(andromeda?.groupPgc).toBe(2557)
    // 0.8 Mpc × 70 scene units/Mpc = 56
    expect(andromeda?.coordinates.sgx).toBeCloseTo(56)
    // A further group sits well out along the negative supergalactic X axis.
    expect(m101?.coordinates.sgx).toBeLessThan(-100)
  })
})
