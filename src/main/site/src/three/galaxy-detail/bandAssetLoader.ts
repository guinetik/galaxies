import { decode as decodePng } from 'fast-png'
import { GALAXY_IMG_BASE_URL } from '@/three/constants'
import type { NSAMetadata } from '@/types/nsa'
import type {
  NsaPointBand,
  NsaPointCloudInput,
} from '@/three/nsa/nsa3dPointCloud'
import {
  extractBandFeatureProfile,
  type BandFeatureAvailability,
  type BandFeatureProfile,
} from './bandProfile'

type LoadedBandName = 'u' | 'g' | 'r' | 'i' | 'z' | 'nuv'

interface LoadedBandData {
  raw: Float32Array
  width: number
  height: number
  range: [number, number]
}

/**
 * Compact multi-band payload consumed by the galaxy-detail renderer.
 */
export interface GalaxyBandAnalysis {
  metadata: NSAMetadata
  input: NsaPointCloudInput
  availability: BandFeatureAvailability
  profile: BandFeatureProfile
}

/**
 * Loads real NSA image bands for a galaxy and extracts a compact feature vector.
 *
 * Returns `null` when the galaxy has no NSA asset bundle or when required core
 * bands cannot be decoded.
 */
export async function loadGalaxyBandAnalysis(pgc: number): Promise<GalaxyBandAnalysis | null> {
  const metadata = await loadMetadata(pgc)
  if (!metadata) {
    return null
  }

  const loadedBands = await loadBandSet(pgc, metadata)
  if (!loadedBands?.g || !loadedBands.r || !loadedBands.i) {
    return null
  }

  pruneWeakOptionalBands(loadedBands)
  const { input, availability } = buildPointCloudInput(loadedBands)
  const profile = extractBandFeatureProfile(input, {
    availability: availabilityToOverrides(availability),
  })

  return {
    metadata,
    input,
    availability,
    profile,
  }
}

/**
 * Loads `metadata.json` for the given galaxy if the NSA asset bundle exists.
 */
async function loadMetadata(pgc: number): Promise<NSAMetadata | null> {
  try {
    const response = await fetch(`${GALAXY_IMG_BASE_URL}/${pgc}/metadata.json`)
    if (!response.ok) {
      return null
    }

    return await response.json() as NSAMetadata
  } catch {
    return null
  }
}

/**
 * Loads the minimal set of bands needed to derive the feature profile.
 */
async function loadBandSet(
  pgc: number,
  metadata: NSAMetadata,
): Promise<Partial<Record<LoadedBandName, LoadedBandData>> | null> {
  const requestedBands = getRequestedBands(metadata)
  const baseUrl = `${GALAXY_IMG_BASE_URL}/${pgc}/`

  const loaded = await Promise.all(
    requestedBands.map(async (band) => {
      try {
        const response = await fetch(`${baseUrl}${band}.png`)
        if (!response.ok) {
          if (band === 'g' || band === 'r' || band === 'i') {
            throw new Error(`Missing required NSA band: ${band}`)
          }
          return [band, null] as const
        }

        const buffer = await response.arrayBuffer()
        const png = decodePng(new Uint8Array(buffer))
        const maxValue = png.depth === 16 ? 65535 : 255
        const values = new Float32Array(png.width * png.height)

        for (let index = 0; index < values.length; index += 1) {
          values[index] = png.data[index * png.channels] / maxValue
        }

        return [band, {
          raw: values,
          width: png.width,
          height: png.height,
          range: metadata.data_ranges[band] ?? [0, 1],
        }] as const
      } catch (error) {
        if (band === 'g' || band === 'r' || band === 'i') {
          throw error
        }
        return [band, null] as const
      }
    }),
  ).catch(() => null)

  if (!loaded) {
    return null
  }

  return Object.fromEntries(loaded.filter((entry): entry is [LoadedBandName, LoadedBandData] => entry[1] !== null))
}

/**
 * Returns the core bands plus optional ultraviolet / infrared bands if present.
 */
function getRequestedBands(metadata: NSAMetadata): LoadedBandName[] {
  const requested: LoadedBandName[] = ['i', 'r', 'g']
  if (metadata.bands.includes('u')) requested.push('u')
  if (metadata.bands.includes('z')) requested.push('z')
  if (metadata.bands.includes('nuv')) requested.push('nuv')
  return requested
}

/**
 * Discards optional bands whose physical dynamic range is too weak to be useful.
 */
function pruneWeakOptionalBands(
  loadedBands: Partial<Record<LoadedBandName, LoadedBandData>>,
): void {
  const gBand = loadedBands.g
  if (!gBand) {
    return
  }

  const gSpan = gBand.range[1] - gBand.range[0]
  for (const band of ['u', 'z', 'nuv'] as const) {
    const loaded = loadedBands[band]
    if (!loaded) {
      continue
    }

    const span = loaded.range[1] - loaded.range[0]
    if (span < gSpan * 0.01) {
      delete loadedBands[band]
    }
  }
}

/**
 * Builds a complete six-band point-cloud input with deterministic fallbacks.
 */
function buildPointCloudInput(
  loadedBands: Partial<Record<LoadedBandName, LoadedBandData>>,
): {
  input: NsaPointCloudInput
  availability: BandFeatureAvailability
} {
  const resolveBand = (band: NsaPointBand): LoadedBandName => {
    if (loadedBands[band]) return band
    if (band === 'u') return 'g'
    if (band === 'z') return 'i'
    return loadedBands.u ? 'u' : 'g'
  }

  const referenceBand = loadedBands.i ?? loadedBands.g ?? loadedBands.r
  if (!referenceBand) {
    throw new Error('Cannot build point-cloud input without core NSA bands')
  }

  const resolvedBands: Record<NsaPointBand, LoadedBandName> = {
    u: resolveBand('u'),
    g: resolveBand('g'),
    r: resolveBand('r'),
    i: resolveBand('i'),
    z: resolveBand('z'),
    nuv: resolveBand('nuv'),
  }

  const availability: BandFeatureAvailability = {
    real: {
      u: resolvedBands.u === 'u',
      g: resolvedBands.g === 'g',
      r: resolvedBands.r === 'r',
      i: resolvedBands.i === 'i',
      z: resolvedBands.z === 'z',
      nuv: resolvedBands.nuv === 'nuv',
    },
    fallback: {
      u: resolvedBands.u !== 'u',
      g: false,
      r: false,
      i: false,
      z: resolvedBands.z !== 'z',
      nuv: resolvedBands.nuv !== 'nuv',
    },
  }

  return {
    input: {
      width: referenceBand.width,
      height: referenceBand.height,
      bands: {
        u: extractNormalizedBand(loadedBands[resolvedBands.u]!),
        g: extractNormalizedBand(loadedBands[resolvedBands.g]!),
        r: extractNormalizedBand(loadedBands[resolvedBands.r]!),
        i: extractNormalizedBand(loadedBands[resolvedBands.i]!),
        z: extractNormalizedBand(loadedBands[resolvedBands.z]!),
        nuv: extractNormalizedBand(loadedBands[resolvedBands.nuv]!),
      },
    },
    availability,
  }
}

/**
 * Converts raw 0..1 image samples back into physical units, clamps away
 * negative sky subtraction, then re-normalizes to 0..1 for feature extraction.
 */
function extractNormalizedBand(loadedBand: LoadedBandData): Float32Array {
  const [rangeMin, rangeMax] = loadedBand.range
  const span = rangeMax - rangeMin
  const result = new Float32Array(loadedBand.raw.length)

  let maxValue = 0
  for (let index = 0; index < loadedBand.raw.length; index += 1) {
    const physical = loadedBand.raw[index] * span + rangeMin
    const normalized = Math.max(physical, 0)
    result[index] = normalized
    if (normalized > maxValue) {
      maxValue = normalized
    }
  }

  if (maxValue > 0) {
    for (let index = 0; index < result.length; index += 1) {
      result[index] /= maxValue
    }
  }

  return result
}

/**
 * Converts the availability maps into extractor overrides.
 */
function availabilityToOverrides(
  availability: BandFeatureAvailability,
): Partial<Record<NsaPointBand, 'real' | 'fallback'>> {
  return {
    u: availability.fallback.u ? 'fallback' : 'real',
    g: 'real',
    r: 'real',
    i: 'real',
    z: availability.fallback.z ? 'fallback' : 'real',
    nuv: availability.fallback.nuv ? 'fallback' : 'real',
  }
}
