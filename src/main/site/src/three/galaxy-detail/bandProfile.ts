import {
  buildIntensityField,
  localFilamentarity,
} from '@/three/nsa/nsaMorphologyPointCloud'
import type {
  NsaPointBand,
  NsaPointCloudInput,
} from '@/three/nsa/nsa3dPointCloud'

const DEFAULT_RADIAL_BIN_COUNT = 8
const DEFAULT_AZIMUTHAL_BIN_COUNT = 12
const FEATURE_INTENSITY_FLOOR = 0.015

/**
 * Indicates which spectral bands are native to the source data versus synthetic
 * fallbacks used to keep the feature vector complete.
 */
export interface BandFeatureAvailability {
  real: Record<NsaPointBand, boolean>
  fallback: Record<NsaPointBand, boolean>
}

/**
 * Aggregated hot, stellar, and dusty light fractions derived from the six NSA
 * bands after dynamic-range compression.
 */
export interface BandColorBalance {
  hot: number
  stellar: number
  dust: number
}

/**
 * One radial bin summarizing how the light mix changes from core to outskirts.
 */
export interface BandRadialProfileBin {
  radius: number
  intensity: number
  hot: number
  stellar: number
  dust: number
}

/**
 * One azimuthal bin summarizing how strongly structure varies around the disk.
 */
export interface BandAzimuthalProfileBin {
  angle: number
  intensity: number
}

/**
 * Compact feature vector extracted from six-band NSA imagery.
 *
 * The profile is intentionally renderer-agnostic so both WebGPU and WebGL can
 * consume the same guidance once the WebGPU path stabilizes.
 */
export interface BandFeatureProfile {
  availability: BandFeatureAvailability
  globalColorBalance: BandColorBalance
  concentration: number
  armContrast: number
  clumpiness: number
  filamentarity: number
  diskThicknessBias: number
  dustLaneStrength: number
  radialProfile: BandRadialProfileBin[]
  azimuthalProfile: BandAzimuthalProfileBin[]
}

/**
 * Optional extraction controls for callers that know which bands were
 * synthesized or need different profile resolutions.
 */
export interface ExtractBandFeatureOptions {
  availability?: Partial<Record<NsaPointBand, 'real' | 'fallback'>>
  radialBinCount?: number
  azimuthalBinCount?: number
}

/**
 * Extracts a compact, renderer-friendly feature vector from six-band NSA data.
 */
export function extractBandFeatureProfile(
  input: NsaPointCloudInput,
  options: ExtractBandFeatureOptions = {},
): BandFeatureProfile {
  const radialBinCount = options.radialBinCount ?? DEFAULT_RADIAL_BIN_COUNT
  const azimuthalBinCount = options.azimuthalBinCount ?? DEFAULT_AZIMUTHAL_BIN_COUNT
  const availability = resolveAvailability(options.availability)

  const radialSums = Array.from({ length: radialBinCount }, () => ({
    intensity: 0,
    hot: 0,
    stellar: 0,
    dust: 0,
    weight: 0,
  }))
  const azimuthalSums = Array.from({ length: azimuthalBinCount }, () => ({
    intensity: 0,
    weight: 0,
  }))

  let totalHot = 0
  let totalStellar = 0
  let totalDust = 0
  let totalIntensity = 0
  let innerIntensity = 0
  let outerIntensity = 0

  const cx = (input.width - 1) * 0.5
  const cy = (input.height - 1) * 0.5
  const maxRadius = Math.max(1, Math.hypot(cx, cy))

  for (let y = 0; y < input.height; y += 1) {
    for (let x = 0; x < input.width; x += 1) {
      const idx = y * input.width + x
      const spectral = sampleSpectralMix(input, idx, availability)
      if (spectral.intensity <= FEATURE_INTENSITY_FLOOR) {
        continue
      }

      const dx = x - cx
      const dy = y - cy
      const radiusNorm = clamp01(Math.hypot(dx, dy) / maxRadius)
      const angle = Math.atan2(dy, dx)

      totalHot += spectral.hot
      totalStellar += spectral.stellar
      totalDust += spectral.dust
      totalIntensity += spectral.intensity

      if (radiusNorm <= 0.22) {
        innerIntensity += spectral.intensity
      }
      if (radiusNorm <= 0.85) {
        outerIntensity += spectral.intensity
      }

      const radialIndex = Math.min(
        radialBinCount - 1,
        Math.floor(radiusNorm * radialBinCount),
      )
      const radialBin = radialSums[radialIndex]
      radialBin.intensity += spectral.intensity
      radialBin.hot += spectral.hot
      radialBin.stellar += spectral.stellar
      radialBin.dust += spectral.dust
      radialBin.weight += 1

      if (radiusNorm >= 0.2 && radiusNorm <= 0.88) {
        const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle
        const azimuthIndex = Math.min(
          azimuthalBinCount - 1,
          Math.floor((normalizedAngle / (Math.PI * 2)) * azimuthalBinCount),
        )
        const azimuthBin = azimuthalSums[azimuthIndex]
        azimuthBin.intensity += spectral.intensity
        azimuthBin.weight += 1
      }
    }
  }

  const colorBalance = normalizeColorBalance(totalHot, totalStellar, totalDust)
  const radialProfile = radialSums.map((bin, index) => normalizeRadialBin(bin, index, radialBinCount))
  const azimuthalProfile = azimuthalSums.map((bin, index) => ({
    angle: (index / azimuthalBinCount) * Math.PI * 2,
    intensity: bin.weight > 0 ? bin.intensity / bin.weight : 0,
  }))

  const concentration = outerIntensity > 0
    ? clamp01(innerIntensity / outerIntensity)
    : 0
  const filamentarity = computeWeightedFilamentarity(input)
  const armContrast = computeContrast(azimuthalProfile.map((bin) => bin.intensity))
  const clumpiness = computeClumpiness(input)
  const diskThicknessBias = clamp01((1 - filamentarity) * 0.7 + concentration * 0.3)
  const dustLaneStrength = clamp01(
    colorBalance.dust * (0.55 + filamentarity * 0.35 + armContrast * 0.25),
  )

  return {
    availability,
    globalColorBalance: colorBalance,
    concentration,
    armContrast,
    clumpiness,
    filamentarity,
    diskThicknessBias,
    dustLaneStrength,
    radialProfile,
    azimuthalProfile,
  }
}

/**
 * Builds a complete availability map, defaulting all bands to real input.
 */
function resolveAvailability(
  overrides: Partial<Record<NsaPointBand, 'real' | 'fallback'>> | undefined,
): BandFeatureAvailability {
  const bands: NsaPointBand[] = ['u', 'g', 'r', 'i', 'z', 'nuv']
  const real = {
    u: true,
    g: true,
    r: true,
    i: true,
    z: true,
    nuv: true,
  }
  const fallback = {
    u: false,
    g: false,
    r: false,
    i: false,
    z: false,
    nuv: false,
  }

  for (const band of bands) {
    const state = overrides?.[band]
    if (state === 'fallback') {
      real[band] = false
      fallback[band] = true
    }
  }

  return { real, fallback }
}

/**
 * Samples one pixel and converts it into compressed hot / stellar / dust light.
 */
function sampleSpectralMix(
  input: NsaPointCloudInput,
  idx: number,
  availability: BandFeatureAvailability,
): {
  hot: number
  stellar: number
  dust: number
  intensity: number
} {
  const u = Math.sqrt(clamp01(input.bands.u[idx] ?? 0))
  const g = Math.sqrt(clamp01(input.bands.g[idx] ?? 0))
  const r = Math.sqrt(clamp01(input.bands.r[idx] ?? 0))
  const i = Math.sqrt(clamp01(input.bands.i[idx] ?? 0))
  const z = Math.sqrt(clamp01(input.bands.z[idx] ?? 0))
  const nuv = Math.sqrt(clamp01(input.bands.nuv[idx] ?? 0))

  const uWeight = availability.real.u ? 1 : 0
  const iWeight = availability.real.i ? 1 : 0
  const zWeight = availability.real.z ? 1 : 0
  const nuvWeight = availability.real.nuv ? 1 : 0

  const hotTotalWeight = uWeight + nuvWeight
  const hot = hotTotalWeight > 0
    ? ((u * uWeight) + (nuv * nuvWeight)) / hotTotalWeight
    : stellarProxy(g, r)
  const stellar = (g + r) * 0.5
  const dustTotalWeight = iWeight + zWeight
  const dust = dustTotalWeight > 0
    ? ((i * iWeight) + (z * zWeight)) / dustTotalWeight
    : 0
  const intensity = dust * 0.25 + stellar * 0.4 + hot * 0.35

  return { hot, stellar, dust, intensity }
}

/**
 * Derives a conservative hot-light proxy from the optical bands when UV data
 * is absent, keeping fallback guidance neutral rather than artificially cold.
 */
function stellarProxy(g: number, r: number): number {
  return ((g + r) * 0.5) * 0.35
}

/**
 * Normalizes the hot / stellar / dust mix into unit-sum fractions.
 */
function normalizeColorBalance(
  hot: number,
  stellar: number,
  dust: number,
): BandColorBalance {
  const total = hot + stellar + dust
  if (total <= 0) {
    return { hot: 0, stellar: 0, dust: 0 }
  }

  return {
    hot: hot / total,
    stellar: stellar / total,
    dust: dust / total,
  }
}

/**
 * Converts one accumulated radial bin into an average profile sample.
 */
function normalizeRadialBin(
  bin: { intensity: number; hot: number; stellar: number; dust: number; weight: number },
  index: number,
  count: number,
): BandRadialProfileBin {
  if (bin.weight <= 0) {
    return {
      radius: (index + 0.5) / count,
      intensity: 0,
      hot: 0,
      stellar: 0,
      dust: 0,
    }
  }

  return {
    radius: (index + 0.5) / count,
    intensity: bin.intensity / bin.weight,
    hot: bin.hot / bin.weight,
    stellar: bin.stellar / bin.weight,
    dust: bin.dust / bin.weight,
  }
}

/**
 * Computes mean weighted filamentarity from the downsampled i-band field.
 */
function computeWeightedFilamentarity(input: NsaPointCloudInput): number {
  const step = Math.max(1, Math.floor(Math.max(input.width, input.height) / 64))
  const { field, w, h } = buildIntensityField(input, step)
  const radius = Math.max(1, Math.min(3, Math.floor(Math.min(w, h) / 12)))

  let weightedFilamentarity = 0
  let totalWeight = 0
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const weight = field[y * w + x]
      if (weight <= FEATURE_INTENSITY_FLOOR) {
        continue
      }

      const { F } = localFilamentarity(field, w, h, x, y, radius)
      weightedFilamentarity += F * weight
      totalWeight += weight
    }
  }

  const localScore = totalWeight > 0
    ? clamp01(weightedFilamentarity / totalWeight)
    : 0
  const globalScore = computeGlobalShapeAnisotropy(field, w, h)

  return clamp01(localScore * 0.35 + globalScore * 0.65)
}

/**
 * Estimates clumpiness from positive high-frequency residuals in the i-band.
 */
function computeClumpiness(input: NsaPointCloudInput): number {
  const step = Math.max(1, Math.floor(Math.max(input.width, input.height) / 96))
  const { field, w, h } = buildIntensityField(input, step)
  let residual = 0
  let total = 0

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const center = field[y * w + x]
      if (center <= FEATURE_INTENSITY_FLOOR) {
        continue
      }

      let neighborSum = 0
      let neighborCount = 0
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) {
            continue
          }
          const sx = Math.max(0, Math.min(w - 1, x + dx))
          const sy = Math.max(0, Math.min(h - 1, y + dy))
          neighborSum += field[sy * w + sx]
          neighborCount += 1
        }
      }

      const localMean = neighborCount > 0 ? neighborSum / neighborCount : center
      residual += Math.max(center - localMean, 0)
      total += center
    }
  }

  return total > 0 ? clamp01(residual / total * 3) : 0
}

/**
 * Computes a stable normalized contrast score from a scalar series.
 */
function computeContrast(values: number[]): number {
  const nonZeroValues = values.filter((value) => value > 0)
  if (nonZeroValues.length === 0) {
    return 0
  }

  const mean = nonZeroValues.reduce((sum, value) => sum + value, 0) / nonZeroValues.length
  if (mean <= 1e-6) {
    return 0
  }

  const variance = nonZeroValues.reduce((sum, value) => {
    const delta = value - mean
    return sum + delta * delta
  }, 0) / nonZeroValues.length

  return clamp01(Math.sqrt(variance) / mean / 2)
}

/**
 * Measures the overall anisotropy of the light distribution from its weighted
 * spatial covariance, which helps distinguish stripe-like arms from round cores.
 */
function computeGlobalShapeAnisotropy(
  field: Float32Array,
  width: number,
  height: number,
): number {
  let sumWeight = 0
  let meanX = 0
  let meanY = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const weight = field[y * width + x]
      if (weight <= FEATURE_INTENSITY_FLOOR) {
        continue
      }
      sumWeight += weight
      meanX += x * weight
      meanY += y * weight
    }
  }

  if (sumWeight <= 0) {
    return 0
  }

  meanX /= sumWeight
  meanY /= sumWeight

  let covXX = 0
  let covXY = 0
  let covYY = 0
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const weight = field[y * width + x]
      if (weight <= FEATURE_INTENSITY_FLOOR) {
        continue
      }
      const dx = x - meanX
      const dy = y - meanY
      covXX += dx * dx * weight
      covXY += dx * dy * weight
      covYY += dy * dy * weight
    }
  }

  covXX /= sumWeight
  covXY /= sumWeight
  covYY /= sumWeight

  const trace = covXX + covYY
  if (trace <= 1e-6) {
    return 0
  }

  const det = covXX * covYY - covXY * covXY
  const disc = Math.sqrt(Math.max(0, trace * trace - 4 * det))
  const lambda1 = (trace + disc) * 0.5
  const lambda2 = (trace - disc) * 0.5

  return clamp01((lambda1 - lambda2) / (lambda1 + lambda2 + 1e-6))
}

/**
 * Clamps a scalar into the inclusive 0..1 range.
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}
