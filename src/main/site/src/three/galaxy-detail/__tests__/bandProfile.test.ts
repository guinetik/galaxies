import { describe, expect, it } from 'vitest'
import type { Galaxy } from '@/types/galaxy'
import type { NsaPointCloudInput } from '@/three/nsa/nsa3dPointCloud'
import { extractBandFeatureProfile } from '../bandProfile'
import { mapGalaxyToRenderParams } from '../morphology'

/**
 * Builds a minimal galaxy record for morphology tests.
 */
function makeGalaxy(overrides: Partial<Galaxy> = {}): Galaxy {
  return {
    pgc: 7777, group_pgc: null, vcmb: 1000, dm: 30, e_dm: null,
    ra: 180, dec: 45, glon: null, glat: null, sgl: null, sgb: null,
    distance_mpc: 10, distance_mly: 32.6,
    dm_snia: null, dm_tf: null, dm_fp: null, dm_sbf: null,
    dm_snii: null, dm_trgb: null, dm_ceph: null, dm_mas: null,
    t17: null,
    e_dm_snia: null, e_dm_tf: null, e_dm_fp: null, e_dm_sbf: null,
    e_dm_snii: null, e_dm_trgb: null, e_dm_ceph: null, e_dm_mas: null,
    source: null, name: null, morphology: 'Sc',
    agc: null, v_hi: null,
    log_mhi: null, e_log_mhi: null, log_ms_t: 10.4, e_log_ms_t: null,
    log_sfr_nuv: null, e_log_sfr_nuv: null,
    b_mag: null, diameter_arcsec: 120, axial_ratio: null, position_angle: null, ba: null,
    ...overrides,
  }
}

/**
 * Creates a six-band NSA-like image from a scalar sampler.
 */
function makeInput(
  width: number,
  height: number,
  sample: (x: number, y: number) => { u: number; g: number; r: number; i: number; z: number; nuv: number },
): NsaPointCloudInput {
  const size = width * height
  const input: NsaPointCloudInput = {
    width,
    height,
    bands: {
      u: new Float32Array(size),
      g: new Float32Array(size),
      r: new Float32Array(size),
      i: new Float32Array(size),
      z: new Float32Array(size),
      nuv: new Float32Array(size),
    },
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x
      const pixel = sample(x, y)
      input.bands.u[idx] = pixel.u
      input.bands.g[idx] = pixel.g
      input.bands.r[idx] = pixel.r
      input.bands.i[idx] = pixel.i
      input.bands.z[idx] = pixel.z
      input.bands.nuv[idx] = pixel.nuv
    }
  }

  return input
}

describe('extractBandFeatureProfile', () => {
  it('detects hot-dominated spectral balance from UV-heavy bands', () => {
    const input = makeInput(5, 5, () => ({
      u: 0.9,
      g: 0.45,
      r: 0.35,
      i: 0.12,
      z: 0.08,
      nuv: 1.0,
    }))

    const profile = extractBandFeatureProfile(input)

    expect(profile.globalColorBalance.hot).toBeGreaterThan(profile.globalColorBalance.dust)
    expect(profile.availability.real.nuv).toBe(true)
    expect(profile.radialProfile).toHaveLength(8)
  })

  it('reports stronger concentration for a compact bright core than a diffuse disk', () => {
    const compact = makeInput(9, 9, (x, y) => {
      const dx = x - 4
      const dy = y - 4
      const core = Math.exp(-(dx * dx + dy * dy) / 2)
      return { u: core * 0.5, g: core * 0.7, r: core * 0.8, i: core * 0.9, z: core * 0.8, nuv: core * 0.4 }
    })
    const diffuse = makeInput(9, 9, () => ({
      u: 0.35,
      g: 0.45,
      r: 0.5,
      i: 0.48,
      z: 0.42,
      nuv: 0.25,
    }))

    const compactProfile = extractBandFeatureProfile(compact)
    const diffuseProfile = extractBandFeatureProfile(diffuse)

    expect(compactProfile.concentration).toBeGreaterThan(diffuseProfile.concentration)
  })

  it('reports more filamentarity and arm contrast for stripe-like structure than a round blob', () => {
    const stripe = makeInput(11, 11, (x) => {
      const v = x === 5 ? 0.95 : 0.03
      return { u: v * 0.4, g: v * 0.6, r: v * 0.5, i: v, z: v * 0.8, nuv: v * 0.35 }
    })
    const blob = makeInput(11, 11, (x, y) => {
      const dx = x - 5
      const dy = y - 5
      const v = Math.exp(-(dx * dx + dy * dy) / 8) * 0.9
      return { u: v * 0.4, g: v * 0.6, r: v * 0.5, i: v, z: v * 0.8, nuv: v * 0.35 }
    })

    const stripeProfile = extractBandFeatureProfile(stripe)
    const blobProfile = extractBandFeatureProfile(blob)

    expect(stripeProfile.filamentarity).toBeGreaterThan(blobProfile.filamentarity)
    expect(stripeProfile.armContrast).toBeGreaterThan(blobProfile.armContrast)
  })
})

describe('mapGalaxyToRenderParams with band guidance', () => {
  it('biases spiral morphology toward stronger bulge, clumpier arms, and less diffuse field stars', () => {
    const galaxy = makeGalaxy({ morphology: 'Sc' })
    const bandProfile = {
      availability: {
        real: { u: true, g: true, r: true, i: true, z: true, nuv: true },
        fallback: { u: false, g: false, r: false, i: false, z: false, nuv: false },
      },
      globalColorBalance: { hot: 0.48, stellar: 0.28, dust: 0.24 },
      concentration: 0.82,
      armContrast: 0.88,
      clumpiness: 0.74,
      filamentarity: 0.79,
      diskThicknessBias: 0.18,
      dustLaneStrength: 0.67,
      radialProfile: Array.from({ length: 8 }, (_, index) => ({
        radius: (index + 0.5) / 8,
        intensity: 1 - index / 10,
        hot: 0.6 - index / 20,
        stellar: 0.35,
        dust: 0.25 + index / 25,
      })),
      azimuthalProfile: Array.from({ length: 12 }, (_, index) => ({
        angle: (index / 12) * Math.PI * 2,
        intensity: index % 2 === 0 ? 0.9 : 0.35,
      })),
    }

    const base = mapGalaxyToRenderParams(galaxy)
    const guided = mapGalaxyToRenderParams(galaxy, bandProfile)

    expect(guided.bandProfile).toEqual(bandProfile)
    expect(guided.morphology.bulgeRadius).toBeGreaterThan(base.morphology.bulgeRadius)
    expect(guided.morphology.fieldStarFraction).toBeLessThan(base.morphology.fieldStarFraction)
    expect(guided.morphology.irregularity).toBeGreaterThan(base.morphology.irregularity)
  })
})
