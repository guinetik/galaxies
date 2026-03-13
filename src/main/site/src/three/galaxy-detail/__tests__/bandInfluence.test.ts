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
    expect(config.coreWeight).toBe(1)
    expect(config.midDiskWeight).toBe(1)
    expect(config.outerDiskWeight).toBe(1)
    expect(config.peakAzimuthAngleA).toBe(0)
    expect(config.peakAzimuthAngleB).toBeCloseTo(Math.PI)
    expect(config.peakAzimuthStrength).toBe(0)
    expect(config.projectedAxisRatio).toBe(1)
    expect(config.projectedAngle).toBe(0)
    expect(config.projectedStrength).toBe(0)
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
      projectedAxisRatio: 0.52,
      projectedAngle: Math.PI / 5,
      projectedStrength: 0.71,
      radialProfile: [
        { radius: 0.0625, intensity: 0.95, hot: 0.6, stellar: 0.3, dust: 0.1 },
        { radius: 0.1875, intensity: 0.82, hot: 0.55, stellar: 0.3, dust: 0.15 },
        { radius: 0.3125, intensity: 0.7, hot: 0.5, stellar: 0.3, dust: 0.2 },
        { radius: 0.4375, intensity: 0.66, hot: 0.46, stellar: 0.3, dust: 0.24 },
        { radius: 0.5625, intensity: 0.42, hot: 0.35, stellar: 0.35, dust: 0.3 },
        { radius: 0.6875, intensity: 0.3, hot: 0.26, stellar: 0.34, dust: 0.4 },
        { radius: 0.8125, intensity: 0.18, hot: 0.18, stellar: 0.32, dust: 0.5 },
        { radius: 0.9375, intensity: 0.1, hot: 0.1, stellar: 0.3, dust: 0.6 },
      ],
      azimuthalProfile: Array.from({ length: 12 }, (_, index) => ({
        angle: (index / 12) * Math.PI * 2,
        intensity: index === 2 || index === 8 ? 1 : 0.2,
      })),
    })

    expect(config.armScatterScale).toBeLessThan(1)
    expect(config.bulgeBoost).toBeGreaterThan(0)
    expect(config.clumpBoost).toBeGreaterThan(0.5)
    expect(config.hotMix).toBeGreaterThan(config.dustMix)
    expect(config.diskThicknessScale).toBeLessThan(1)
    expect(config.dustLaneStrength).toBeGreaterThan(0.5)
    expect(config.coreWeight).toBeGreaterThan(config.outerDiskWeight)
    expect(config.midDiskWeight).toBeGreaterThan(config.outerDiskWeight)
    expect(config.peakAzimuthStrength).toBeGreaterThan(0.5)
    expect(config.peakAzimuthAngleA).toBeCloseTo(Math.PI / 3, 3)
    expect(config.peakAzimuthAngleB).toBeCloseTo((4 * Math.PI) / 3, 3)
    expect(config.projectedAxisRatio).toBeCloseTo(0.52)
    expect(config.projectedAngle).toBeCloseTo(Math.PI / 5)
    expect(config.projectedStrength).toBeGreaterThan(0.6)
  })
})
