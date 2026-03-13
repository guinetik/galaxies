import { describe, expect, it } from 'vitest'
import { deriveBandInfluenceConfig } from '../bandInfluence'

describe('deriveBandInfluenceConfig', () => {
  it('returns neutral defaults when no band profile is available', () => {
    const config = deriveBandInfluenceConfig(null)

    expect(config.armScatterScale).toBe(1)
    expect(config.bulgeBoost).toBe(0)
    expect(config.clumpBoost).toBe(0)
    expect(config.hotMix).toBe(0.5)
    expect(config.dustMix).toBe(0.5)
    expect(config.diskThicknessScale).toBe(1)
    expect(config.dustLaneStrength).toBe(0)
  })

  it('maps structured, hot, clumpy profiles into stronger generator guidance', () => {
    const config = deriveBandInfluenceConfig({
      availability: {
        real: { u: true, g: true, r: true, i: true, z: true, nuv: true },
        fallback: { u: false, g: false, r: false, i: false, z: false, nuv: false },
      },
      globalColorBalance: { hot: 0.52, stellar: 0.28, dust: 0.20 },
      concentration: 0.8,
      armContrast: 0.9,
      clumpiness: 0.72,
      filamentarity: 0.83,
      diskThicknessBias: 0.22,
      dustLaneStrength: 0.68,
      radialProfile: [],
      azimuthalProfile: [],
    })

    expect(config.armScatterScale).toBeLessThan(1)
    expect(config.bulgeBoost).toBeGreaterThan(0)
    expect(config.clumpBoost).toBeGreaterThan(0.5)
    expect(config.hotMix).toBeGreaterThan(config.dustMix)
    expect(config.diskThicknessScale).toBeLessThan(1)
    expect(config.dustLaneStrength).toBeGreaterThan(0.5)
  })
})
