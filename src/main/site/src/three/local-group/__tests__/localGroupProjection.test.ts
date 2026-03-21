import { describe, expect, it } from 'vitest'
import {
  LOCAL_GROUP_SCENE_UNITS_PER_MPC,
  createLocalGroupProjection,
  getLocalGroupRangeRingsMpc,
  projectLocalGroupCoordinates,
  rotateLocalGroupVectorByProjection,
  toLocalGroupDisplayCoordinates,
} from '../localGroupProjection'

describe('getLocalGroupRangeRingsMpc', () => {
  it('creates inclusive circular ranges in Mpc', () => {
    expect(getLocalGroupRangeRingsMpc(25, 5)).toEqual([5, 10, 15, 20, 25])
  })
})

describe('projectLocalGroupCoordinates', () => {
  it('keeps points on the tilted range plane when sgz is zero', () => {
    const projection = createLocalGroupProjection()
    const projected = projectLocalGroupCoordinates(
      { sgx: 140, sgy: 0, sgz: 0 },
      projection,
    )

    expect(projected.stemStart.x).toBeCloseTo(projected.displayPosition.x)
    expect(projected.stemStart.y).toBeCloseTo(projected.displayPosition.y)
    expect(projected.stemStart.z).toBeCloseTo(projected.displayPosition.z)
    expect(projected.rangeMpc).toBeCloseTo(2)
  })

  it('lifts points away from the plane along the projection normal', () => {
    const projection = createLocalGroupProjection({ heightScale: 1.25 })
    const projected = projectLocalGroupCoordinates(
      { sgx: 0, sgy: 70, sgz: 140 },
      projection,
    )

    expect(projected.rangeMpc).toBeCloseTo(1)
    expect(projected.stemLength).toBeCloseTo(140 * 1.25)
    expect(projected.displayPosition.y).not.toBeCloseTo(projected.stemStart.y)
  })

  it('reports range radius in scene units using the shared conversion factor', () => {
    const projection = createLocalGroupProjection()
    const projected = projectLocalGroupCoordinates(
      { sgx: 210, sgy: 280, sgz: 0 },
      projection,
    )

    expect(projected.rangeMpc).toBeCloseTo(5)
    expect(projected.rangeSceneUnits).toBeCloseTo(5 * LOCAL_GROUP_SCENE_UNITS_PER_MPC)
  })

  it('matches the runtime local-scene transform used by the Three.js scene', () => {
    const projection = createLocalGroupProjection({ heightScale: 1.1 })
    const source = { sgx: 210, sgy: -140, sgz: 70 }

    const projected = projectLocalGroupCoordinates(source, projection)
    const localDisplay = toLocalGroupDisplayCoordinates(source, projection.heightScale)
    const rotated = rotateLocalGroupVectorByProjection(localDisplay, projection)

    expect(rotated.x).toBeCloseTo(projected.displayPosition.x)
    expect(rotated.y).toBeCloseTo(projected.displayPosition.y)
    expect(rotated.z).toBeCloseTo(projected.displayPosition.z)
  })
})
