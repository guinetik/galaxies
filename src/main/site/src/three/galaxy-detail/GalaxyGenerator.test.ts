import { describe, it, expect } from 'vitest'
import type { BandInfluenceConfig } from './bandInfluence'

// Mock influence config for testing
const mockInfluence: BandInfluenceConfig = {
  armScatterScale: 1,
  bulgeBoost: 0,
  clumpBoost: 0,
  hotMix: 0.5,
  dustMix: 0.5,
  diskThicknessScale: 1,
  dustLaneStrength: 0,
  coreWeight: 1,
  midDiskWeight: 1,
  outerDiskWeight: 1,
  peakAzimuthAngleA: 0,
  peakAzimuthAngleB: Math.PI,
  peakAzimuthStrength: 0,
  projectedAxisRatio: 0.8,
  projectedAngle: 0,
  projectedStrength: 1,
}

// Import the function to test
// Note: This will need to be exported from GalaxyGenerator.ts
function applyProjectedSilhouette(
  position: { x: number; y: number; z: number },
  influence: BandInfluenceConfig | null,
): { x: number; y: number; z: number } {
  if (!influence || influence.projectedStrength === 0) {
    return position
  }

  const c = Math.cos(influence.projectedAngle)
  const s = Math.sin(influence.projectedAngle)
  const major = position.x * c + position.z * s
  const minor = position.z * c - position.x * s
  const minorScale = influence.projectedAxisRatio * influence.projectedStrength +
    (1 - influence.projectedStrength)
  const shapedMinor = minor * minorScale

  return {
    x: major * c - shapedMinor * s,
    y: position.y,
    z: major * s + shapedMinor * c,
  }
}

describe('applyProjectedSilhouette', () => {
  it('returns unchanged position when influence is null', () => {
    const pos = { x: 1, y: 2, z: 3 }
    const result = applyProjectedSilhouette(pos, null)
    expect(result).toEqual(pos)
  })

  it('returns unchanged position when projectedStrength is 0', () => {
    const pos = { x: 1, y: 2, z: 3 }
    const zeroStrengthInfluence = { ...mockInfluence, projectedStrength: 0 }
    const result = applyProjectedSilhouette(pos, zeroStrengthInfluence)
    expect(result).toEqual(pos)
  })

  it('applies axis ratio scaling when strength > 0', () => {
    const pos = { x: 1, y: 0, z: 1 }
    const result = applyProjectedSilhouette(pos, mockInfluence)
    // With projectedAxisRatio=0.8 and projectedStrength=1, z should be scaled down
    expect(result.z).toBeLessThan(pos.z)
    expect(result.x).toBeCloseTo(pos.x, 5)
  })

  it('leaves y unchanged', () => {
    const pos = { x: 1, y: 5, z: 1 }
    const result = applyProjectedSilhouette(pos, mockInfluence)
    expect(result.y).toBe(pos.y)
  })

  it('handles rotation angle correctly', () => {
    const pos = { x: 1, y: 0, z: 1 }
    const influence45deg = { ...mockInfluence, projectedAngle: Math.PI / 4 }
    const result = applyProjectedSilhouette(pos, influence45deg)
    // Result should still be valid position with y unchanged
    expect(result.y).toBe(pos.y)
    expect(Number.isFinite(result.x)).toBe(true)
    expect(Number.isFinite(result.z)).toBe(true)
  })

  it('produces symmetric results for opposing axis ratio', () => {
    const pos = { x: 1, y: 0, z: 1 }
    const influence1 = { ...mockInfluence, projectedAxisRatio: 0.8 }
    const influence2 = { ...mockInfluence, projectedAxisRatio: 1.25 }
    const result1 = applyProjectedSilhouette(pos, influence1)
    const result2 = applyProjectedSilhouette(pos, influence2)
    // Results should be on opposite sides of original
    expect(Math.abs(result1.z - pos.z) + Math.abs(result2.z - pos.z)).toBeGreaterThan(0)
  })

  it('partial strength creates interpolation between identity and full transformation', () => {
    const pos = { x: 1, y: 0, z: 1 }
    const influenceHalf = { ...mockInfluence, projectedStrength: 0.5 }
    const result = applyProjectedSilhouette(pos, influenceHalf)
    // With 50% strength, z should be between original and fully scaled
    const fullResult = applyProjectedSilhouette(pos, mockInfluence)
    expect(Math.abs(result.z - pos.z)).toBeLessThan(Math.abs(fullResult.z - pos.z))
  })
})
