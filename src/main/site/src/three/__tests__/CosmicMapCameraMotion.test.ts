import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import {
  getCosmicMapCameraMotionProfile,
  getIntroCameraBlend,
  rotateOffsetAroundYAxis,
  shouldApplyIdleCameraMotion,
} from '../cosmic-map/CosmicMapCameraMotion'

describe('getCosmicMapCameraMotionProfile', () => {
  it('starts zoomed out to the controls max distance and ends closer than the old view', () => {
    const basePosition = new THREE.Vector3(2000, 4000, 12000)
    const profile = getCosmicMapCameraMotionProfile(basePosition, 80000)

    expect(profile.introStart.length()).toBeCloseTo(80000)
    expect(profile.defaultPosition.length()).toBeCloseTo(basePosition.length() * 0.5)
    expect(profile.introStart.clone().normalize().distanceTo(profile.defaultPosition.clone().normalize())).toBeCloseTo(0)
    expect(profile.introDurationSeconds).toBeGreaterThan(3)
  })
})

describe('getIntroCameraBlend', () => {
  it('eases the camera motion instead of moving linearly', () => {
    expect(getIntroCameraBlend(0)).toBe(0)
    expect(getIntroCameraBlend(0.25)).toBeLessThan(0.25)
    expect(getIntroCameraBlend(0.75)).toBeGreaterThan(0.75)
    expect(getIntroCameraBlend(1)).toBe(1)
  })
})

describe('rotateOffsetAroundYAxis', () => {
  it('keeps orbit distance while moving the camera around the y axis', () => {
    const offset = new THREE.Vector3(0, 4000, 12000)
    const rotated = rotateOffsetAroundYAxis(offset, Math.PI / 12)

    expect(rotated.length()).toBeCloseTo(offset.length())
    expect(rotated.y).toBeCloseTo(offset.y)
    expect(rotated.x).not.toBeCloseTo(offset.x)
    expect(rotated.z).not.toBeCloseTo(offset.z)
  })
})

describe('shouldApplyIdleCameraMotion', () => {
  it('waits until the intro finishes and the user is idle', () => {
    expect(shouldApplyIdleCameraMotion({
      introProgress: 0.5,
      isUserInteracting: false,
      secondsSinceInteraction: 10,
    })).toBe(false)

    expect(shouldApplyIdleCameraMotion({
      introProgress: 1,
      isUserInteracting: true,
      secondsSinceInteraction: 10,
    })).toBe(false)

    expect(shouldApplyIdleCameraMotion({
      introProgress: 1,
      isUserInteracting: false,
      secondsSinceInteraction: 0.5,
    })).toBe(false)

    expect(shouldApplyIdleCameraMotion({
      introProgress: 1,
      isUserInteracting: false,
      secondsSinceInteraction: 3,
    })).toBe(true)
  })
})
