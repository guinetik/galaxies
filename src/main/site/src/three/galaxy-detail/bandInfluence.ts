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
  coreWeight: number
  midDiskWeight: number
  outerDiskWeight: number
  peakAzimuthAngleA: number
  peakAzimuthAngleB: number
  peakAzimuthStrength: number
  projectedAxisRatio: number
  projectedAngle: number
  projectedStrength: number
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
      coreWeight: 1,
      midDiskWeight: 1,
      outerDiskWeight: 1,
      peakAzimuthAngleA: 0,
      peakAzimuthAngleB: Math.PI,
      peakAzimuthStrength: 0,
      projectedAxisRatio: 1,
      projectedAngle: 0,
      projectedStrength: 0,
    }
  }

  const radialWeights = deriveRadialZoneWeights(bandProfile)
  const azimuthPeaks = deriveAzimuthPeaks(bandProfile)

  return {
    armScatterScale: lerp(1.05, 0.58, (bandProfile.armContrast + bandProfile.filamentarity) * 0.5),
    bulgeBoost: clamp01(bandProfile.concentration),
    clumpBoost: clamp01((bandProfile.clumpiness * 0.75) + (bandProfile.armContrast * 0.25)),
    hotMix: clamp01(bandProfile.globalColorBalance.hot),
    dustMix: clamp01(bandProfile.globalColorBalance.dust),
    diskThicknessScale: lerp(1.2, 0.72, 1 - bandProfile.diskThicknessBias),
    dustLaneStrength: clamp01(bandProfile.dustLaneStrength),
    coreWeight: radialWeights.coreWeight,
    midDiskWeight: radialWeights.midDiskWeight,
    outerDiskWeight: radialWeights.outerDiskWeight,
    peakAzimuthAngleA: azimuthPeaks.angleA,
    peakAzimuthAngleB: azimuthPeaks.angleB,
    peakAzimuthStrength: azimuthPeaks.strength,
    projectedAxisRatio: clamp(bandProfile.projectedAxisRatio, 0.15, 1),
    projectedAngle: normalizeAnglePi(bandProfile.projectedAngle),
    projectedStrength: clamp01(bandProfile.projectedStrength),
  }
}

interface RadialZoneWeights {
  coreWeight: number
  midDiskWeight: number
  outerDiskWeight: number
}

/**
 * Collapses the radial profile into three broad density zones so the generator
 * can visibly reshape core, mid-disk, and outskirts without consuming the full
 * profile at shader callsites.
 */
function deriveRadialZoneWeights(profile: BandFeatureProfile): RadialZoneWeights {
  if (profile.radialProfile.length === 0) {
    return {
      coreWeight: 1,
      midDiskWeight: 1,
      outerDiskWeight: 1,
    }
  }

  const zones = {
    core: averageZoneIntensity(profile.radialProfile, 0, 0.28),
    mid: averageZoneIntensity(profile.radialProfile, 0.28, 0.72),
    outer: averageZoneIntensity(profile.radialProfile, 0.72, 1.01),
  }
  const overallMean = average(
    profile.radialProfile.map((bin) => Math.max(0, bin.intensity)),
  )

  if (overallMean <= 1e-6) {
    return {
      coreWeight: 1,
      midDiskWeight: 1,
      outerDiskWeight: 1,
    }
  }

  return {
    coreWeight: normalizeZoneWeight(zones.core, overallMean),
    midDiskWeight: normalizeZoneWeight(zones.mid, overallMean),
    outerDiskWeight: normalizeZoneWeight(zones.outer, overallMean),
  }
}

interface AzimuthPeaks {
  angleA: number
  angleB: number
  strength: number
}

/**
 * Finds the two dominant azimuthal sectors so the renderer can carve stronger
 * asymmetric arm segments and dust lanes instead of only applying scalar bias.
 */
function deriveAzimuthPeaks(profile: BandFeatureProfile): AzimuthPeaks {
  if (profile.azimuthalProfile.length === 0) {
    return {
      angleA: 0,
      angleB: Math.PI,
      strength: 0,
    }
  }

  const rankedBins = [...profile.azimuthalProfile]
    .map((bin, index) => ({
      index,
      angle: normalizeAngle(bin.angle),
      intensity: Math.max(0, bin.intensity),
    }))
    .sort((left, right) => {
      if (right.intensity !== left.intensity) {
        return right.intensity - left.intensity
      }
      return left.angle - right.angle
    })

  const strongest = rankedBins[0]
  const secondary = rankedBins.find((candidate) => candidate.index !== strongest.index)
  const fallbackSecondaryAngle = normalizeAngle(strongest.angle + Math.PI)
  const meanIntensity = average(rankedBins.map((bin) => bin.intensity))
  const peakMean = average([
    strongest?.intensity ?? 0,
    secondary?.intensity ?? strongest?.intensity ?? 0,
  ])
  const prominence = meanIntensity > 1e-6
    ? clamp01(((peakMean / meanIntensity) - 1) / 1.25)
    : 0

  return {
    angleA: strongest?.angle ?? 0,
    angleB: secondary?.angle ?? fallbackSecondaryAngle,
    strength: clamp01(
      prominence * 0.7 + profile.armContrast * 0.2 + profile.filamentarity * 0.1,
    ),
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

/**
 * Computes the average intensity for the radial bins whose centers fall within
 * the requested normalized radius interval.
 */
function averageZoneIntensity(
  bins: BandFeatureProfile['radialProfile'],
  minRadius: number,
  maxRadius: number,
): number {
  const zoneBins = bins.filter((bin) => bin.radius >= minRadius && bin.radius < maxRadius)
  if (zoneBins.length === 0) {
    return 0
  }

  return average(zoneBins.map((bin) => Math.max(0, bin.intensity)))
}

/**
 * Normalizes one radial-zone mean around unity and clamps it to a range that
 * keeps the resulting WebGPU guidance strong but stable.
 */
function normalizeZoneWeight(zoneMean: number, overallMean: number): number {
  if (overallMean <= 1e-6) {
    return 1
  }
  return clamp(0.55 + (zoneMean / overallMean), 0.55, 1.85)
}

/**
 * Averages a numeric series, returning 0 for an empty input.
 */
function average(values: number[]): number {
  if (values.length === 0) {
    return 0
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

/**
 * Wraps an angle into the inclusive 0..TAU range.
 */
function normalizeAngle(angle: number): number {
  const tau = Math.PI * 2
  const wrapped = angle % tau
  return wrapped < 0 ? wrapped + tau : wrapped
}

/**
 * Wraps an angle into the inclusive 0..PI range.
 */
function normalizeAnglePi(angle: number): number {
  const halfTurn = Math.PI
  const wrapped = angle % halfTurn
  return wrapped < 0 ? wrapped + halfTurn : wrapped
}

/**
 * Clamps a scalar between a lower and upper bound.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
