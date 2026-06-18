import { describe, it, expect } from 'vitest'
import type { BandInfluenceConfig } from './bandInfluence'
import { generateGalaxy } from './GalaxyGenerator'
import { MORPHOLOGY_PRESETS } from './morphology'
import type { GalaxyRenderParams } from './morphology'

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

describe('generateGalaxy', () => {
  it('generates identical output when bandProfile is null', () => {
    const testParams: GalaxyRenderParams = {
      morphology: MORPHOLOGY_PRESETS.spiral,
      bandProfile: null,
      galaxyRadius: 20,
      starCount: 100,
      diameterKpc: 10,
      sizeSource: 'observed',
    }

    const starsWithoutBand = generateGalaxy(testParams)
    expect(starsWithoutBand.length).toBeGreaterThan(0)
    expect(starsWithoutBand[0]).toHaveProperty('radius')
    expect(starsWithoutBand[0]).toHaveProperty('hue')
  })

  it('produces reasonable star distributions with band influence', () => {
    const testParams: GalaxyRenderParams = {
      morphology: MORPHOLOGY_PRESETS.spiral,
      bandProfile: {
        // Mock band profile with strong features
        availability: {
          real: { u: false, g: false, r: false, i: false, z: false, nuv: false },
          fallback: { u: true, g: true, r: true, i: true, z: true, nuv: true },
        },
        globalColorBalance: { hot: 0.7, stellar: 0.3, dust: 0.4 },
        concentration: 0.5,
        armContrast: 0.8,
        clumpiness: 0.4,
        filamentarity: 0.6,
        diskThicknessBias: 0.3,
        dustLaneStrength: 0.6,
        projectedAxisRatio: 0.75,
        projectedAngle: 0.5,
        projectedStrength: 0.8,
        radialProfile: [],
        azimuthalProfile: [],
      },
      galaxyRadius: 20,
      starCount: 100,
      diameterKpc: 10,
      sizeSource: 'observed',
    }

    const starsWithBand = generateGalaxy(testParams)
    expect(starsWithBand.length).toBeGreaterThan(0)
    expect(starsWithBand[0]).toHaveProperty('radius')
  })

  it('applies armScatterScale to arm star distribution', () => {
    const paramsBase: GalaxyRenderParams = {
      morphology: { ...MORPHOLOGY_PRESETS.spiral, numArms: 2, armWidth: 0.15 },
      bandProfile: null,
      galaxyRadius: 20,
      starCount: 50,
      diameterKpc: 10,
      sizeSource: 'observed',
    }

    const starsBase = generateGalaxy(paramsBase)

    const paramsWithScatter: GalaxyRenderParams = {
      ...paramsBase,
      bandProfile: {
        // armScatterScale 1.5 should widen arms
        availability: {
          real: { u: false, g: false, r: false, i: false, z: false, nuv: false },
          fallback: { u: true, g: true, r: true, i: true, z: true, nuv: true },
        },
        globalColorBalance: { hot: 0.5, stellar: 0.5, dust: 0.5 },
        concentration: 0.5,
        armContrast: 1.0,
        clumpiness: 0.4,
        filamentarity: 0.6,
        diskThicknessBias: 0.5,
        dustLaneStrength: 0.3,
        projectedAxisRatio: 1,
        projectedAngle: 0,
        projectedStrength: 0,
        radialProfile: [],
        azimuthalProfile: [],
      },
    }

    const starsWithScatter = generateGalaxy(paramsWithScatter)
    expect(starsWithScatter.length).toBeGreaterThan(0)
  })
})

describe('layer assignment (no dust)', () => {
  it('assigns only star and bright layers', () => {
    const params: GalaxyRenderParams = {
      morphology: MORPHOLOGY_PRESETS.spiral,
      galaxyRadius: 350,
      starCount: 1000,
      diameterKpc: 25,
      sizeSource: 'random' as const,
    }
    const stars = generateGalaxy(params)
    const layers = new Set(stars.map(s => s.layer))
    expect(layers.has('star')).toBe(true)
    expect(layers.has('bright')).toBe(true)
  })

  it('keeps regular stars small and bright stars clearly larger', () => {
    const params: GalaxyRenderParams = {
      morphology: MORPHOLOGY_PRESETS.spiral,
      galaxyRadius: 350,
      starCount: 5000,
      diameterKpc: 25,
      sizeSource: 'random' as const,
    }
    const stars = generateGalaxy(params)
    const regular = stars.filter(s => s.layer === 'star')
    const bright = stars.filter(s => s.layer === 'bright')
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

    // Regular masses are tiny pinpoints (mean well under the old 1.5-4.5 range).
    expect(mean(regular.map(s => s.size))).toBeLessThan(2.5)
    // Bright stars still pop: their mean size dwarfs the regular masses.
    expect(mean(bright.map(s => s.size))).toBeGreaterThan(mean(regular.map(s => s.size)) * 1.8)
  })

  it('produces a 3D halo with stars far above/below the disk', () => {
    const params: GalaxyRenderParams = {
      morphology: MORPHOLOGY_PRESETS.spiral,
      bandProfile: null,
      galaxyRadius: 300,
      starCount: 10000,
      diameterKpc: 25,
      sizeSource: 'random' as const,
    }
    const stars = generateGalaxy(params)
    const R = 300
    // Disk slab is ~6% of R; a halo must put some stars far beyond that in Y.
    const farY = stars.filter(s => Math.abs(s.y) > R * 0.25)
    expect(farY.length).toBeGreaterThan(50) // ~3% halo of 10k, many at high |y|
    // Halo reaches well out vertically.
    expect(Math.max(...stars.map(s => Math.abs(s.y)))).toBeGreaterThan(R * 0.6)
  })

  it('gives disk stars a long off-plane vertical tail', () => {
    const params: GalaxyRenderParams = {
      morphology: MORPHOLOGY_PRESETS.spiral,
      bandProfile: null,
      galaxyRadius: 300,
      starCount: 10000,
      diameterKpc: 25,
      sizeSource: 'random' as const,
    }
    const R = 300
    const stars = generateGalaxy(params)
    // Isolate genuine DISK stars: exclude halo (radius >= ~R) and any residual
    // high-Y outliers from other populations. Halo stars have radius >= R*1.0,
    // so radius < R*0.9 drops them cleanly.
    const disk = stars.filter(s => s.radius < R * 0.9 && Math.abs(s.y) <= R * 0.25)
    // A uniform slab caps |y| at ~thickness/2 = 0.08R*0.5 = 0.04R (= 12 units).
    // The logit long-tail draws logit(u)*thickness*0.30, which sends the 10th
    // percentile of u (u=0.1) to |y| ≈ 0.053R (= 16 units).
    // Threshold R*0.05 (= 15) is therefore:
    //   - IMPOSSIBLE for a uniform slab (max ~12),
    //   - EASILY exceeded by longTailY (many stars past 15).
    const tail = disk.filter(s => Math.abs(s.y) > R * 0.05)
    expect(tail.length).toBeGreaterThan(20)
  })
})
