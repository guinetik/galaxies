import { describe, expect, it } from 'vitest'
import {
  LOCAL_GROUP_SCENE_UNITS_PER_MPC,
  getLocalGroupRangeRingsMpc,
  toFlatLocalGroupDisplayCoordinates,
} from '../localGroupProjection'

describe('getLocalGroupRangeRingsMpc', () => {
  it('creates inclusive circular ranges in Mpc', () => {
    expect(getLocalGroupRangeRingsMpc(25, 5)).toEqual([5, 10, 15, 20, 25])
  })
})

describe('toFlatLocalGroupDisplayCoordinates', () => {
  it('maps supergalactic coordinates to flat 2D display coordinates', () => {
    const result = toFlatLocalGroupDisplayCoordinates(140, 0, 0, LOCAL_GROUP_SCENE_UNITS_PER_MPC)

    expect(result.x).toBeCloseTo(140 * LOCAL_GROUP_SCENE_UNITS_PER_MPC)
    expect(result.y).toBeCloseTo(0)
    expect(result.z).toBeCloseTo(0)
  })

  it('ignores sgz coordinate for flat projection', () => {
    const result1 = toFlatLocalGroupDisplayCoordinates(210, 280, 0, LOCAL_GROUP_SCENE_UNITS_PER_MPC)
    const result2 = toFlatLocalGroupDisplayCoordinates(210, 280, 500, LOCAL_GROUP_SCENE_UNITS_PER_MPC)

    expect(result1.x).toBeCloseTo(result2.x)
    expect(result1.y).toBeCloseTo(result2.y)
    expect(result1.z).toBeCloseTo(result2.z)
  })

  it('scales coordinates by scene units per Mpc', () => {
    const result = toFlatLocalGroupDisplayCoordinates(100, 50, 0, LOCAL_GROUP_SCENE_UNITS_PER_MPC)

    expect(result.x).toBeCloseTo(100 * LOCAL_GROUP_SCENE_UNITS_PER_MPC)
    expect(result.y).toBeCloseTo(50 * LOCAL_GROUP_SCENE_UNITS_PER_MPC)
    expect(result.z).toBeCloseTo(0)
  })

  it('produces z=0 for all inputs (flat projection)', () => {
    const result = toFlatLocalGroupDisplayCoordinates(210, -140, 70, LOCAL_GROUP_SCENE_UNITS_PER_MPC)

    expect(result.z).toBeCloseTo(0)
  })
})
