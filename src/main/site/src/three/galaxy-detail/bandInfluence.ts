import type { BandFeatureProfile } from './bandProfile'

/**
 * Compact set of normalized weights that steer particle generation and dust
 * shaping without exposing the full band profile to every shader.
 */
export interface BandInfluenceConfig {
  armScatterScale: number
  bulgeBoost: number
  clumpBoost: number
  hotMix: number
  dustMix: number
  diskThicknessScale: number
  dustLaneStrength: number
}

/**
 * Derives generator-friendly influence weights from the richer band profile.
 */
export function deriveBandInfluenceConfig(
  bandProfile: BandFeatureProfile | null | undefined,
): BandInfluenceConfig {
  if (!bandProfile) {
    return {
      armScatterScale: 1,
      bulgeBoost: 0,
      clumpBoost: 0,
      hotMix: 0.5,
      dustMix: 0.5,
      diskThicknessScale: 1,
      dustLaneStrength: 0,
    }
  }

  return {
    armScatterScale: lerp(1.05, 0.58, (bandProfile.armContrast + bandProfile.filamentarity) * 0.5),
    bulgeBoost: clamp01(bandProfile.concentration),
    clumpBoost: clamp01((bandProfile.clumpiness * 0.75) + (bandProfile.armContrast * 0.25)),
    hotMix: clamp01(bandProfile.globalColorBalance.hot),
    dustMix: clamp01(bandProfile.globalColorBalance.dust),
    diskThicknessScale: lerp(1.2, 0.72, 1 - bandProfile.diskThicknessBias),
    dustLaneStrength: clamp01(bandProfile.dustLaneStrength),
  }
}

/**
 * Linearly interpolates between two scalars.
 */
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * Clamps a scalar into the inclusive 0..1 range.
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}
