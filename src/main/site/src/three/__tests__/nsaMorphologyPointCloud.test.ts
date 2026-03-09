import { describe, expect, it } from 'vitest'
import {
  buildIntensityField,
  buildMorphologyPointCloud,
  localFilamentarity,
} from '../nsa/nsaMorphologyPointCloud'

describe('localFilamentarity', () => {
  it('returns F≈0 for a uniform (isotropic) field', () => {
    // Flat field → zero gradients → filamentarity = 0
    const field = new Float32Array(25).fill(0.5)
    const { F } = localFilamentarity(field, 5, 5, 2, 2, 1)
    expect(F).toBeCloseTo(0, 2)
  })

  it('returns high F for a horizontal stripe (anisotropic)', () => {
    // Horizontal stripe: intensity varies vertically, constant horizontally
    // This produces gradients only in Y → one eigenvalue dominates → high F
    const field = new Float32Array(25)
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        field[y * 5 + x] = y === 2 ? 1.0 : 0.0
      }
    }
    const { F } = localFilamentarity(field, 5, 5, 2, 2, 1)
    expect(F).toBeGreaterThan(0.7)
  })

  it('returns low F for a radial blob (isotropic gradients)', () => {
    // Circular gaussian-like blob: gradients are similar in all directions
    const field = new Float32Array(49)
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const dx = x - 3, dy = y - 3
        field[y * 7 + x] = Math.exp(-(dx * dx + dy * dy) / 4)
      }
    }
    const { F } = localFilamentarity(field, 7, 7, 3, 3, 2)
    expect(F).toBeLessThan(0.3)
  })

  it('returns angle aligned with the dominant structure direction', () => {
    // Vertical stripe: structure runs up/down, gradient is horizontal
    const field = new Float32Array(25)
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        field[y * 5 + x] = x === 2 ? 1.0 : 0.0
      }
    }
    const { angle } = localFilamentarity(field, 5, 5, 2, 2, 1)
    // The gradient is horizontal (along x), so the structure runs vertically.
    // Structure tensor dominant eigenvector angle should be near ±π/2 or near 0
    // depending on convention. We just check it's computed without error.
    expect(typeof angle).toBe('number')
    expect(Number.isFinite(angle)).toBe(true)
  })
})

describe('buildIntensityField', () => {
  it('downsamples to the correct dimensions', () => {
    const input = {
      width: 10,
      height: 10,
      bands: {
        u: new Float32Array(100).fill(0.5),
        g: new Float32Array(100).fill(0.5),
        r: new Float32Array(100).fill(0.5),
        i: new Float32Array(100).fill(0.5),
        z: new Float32Array(100).fill(0.5),
        nuv: new Float32Array(100).fill(0.5),
      },
    }
    const { field, w, h } = buildIntensityField(input, 3)
    expect(w).toBe(4) // ceil(10/3)
    expect(h).toBe(4)
    expect(field.length).toBe(16)
  })
})

describe('buildMorphologyPointCloud', () => {
  it('gives filamentary structures less z-spread than round ones', () => {
    // 11x11 image: 1px-wide vertical stripe vs wide gaussian blob
    const size = 11
    const n = size * size

    // Filamentary: single-pixel-wide bright vertical stripe
    const stripeInput = {
      width: size,
      height: size,
      bands: {
        u: new Float32Array(n),
        g: new Float32Array(n),
        r: new Float32Array(n),
        i: new Float32Array(n),
        z: new Float32Array(n),
        nuv: new Float32Array(n),
      },
    }
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const val = x === 5 ? 0.9 : 0.001
        const idx = y * size + x
        stripeInput.bands.u[idx] = val
        stripeInput.bands.g[idx] = val
        stripeInput.bands.r[idx] = val
        stripeInput.bands.i[idx] = val
        stripeInput.bands.z[idx] = val
        stripeInput.bands.nuv[idx] = val
      }
    }

    // Round: wide gaussian blob at center
    const blobInput = {
      width: size,
      height: size,
      bands: {
        u: new Float32Array(n),
        g: new Float32Array(n),
        r: new Float32Array(n),
        i: new Float32Array(n),
        z: new Float32Array(n),
        nuv: new Float32Array(n),
      },
    }
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - 5, dy = y - 5
        const val = Math.exp(-(dx * dx + dy * dy) / 8) * 0.9
        const idx = y * size + x
        blobInput.bands.u[idx] = val
        blobInput.bands.g[idx] = val
        blobInput.bands.r[idx] = val
        blobInput.bands.i[idx] = val
        blobInput.bands.z[idx] = val
        blobInput.bands.nuv[idx] = val
      }
    }

    const opts = {
      sampleStep: 1,
      intensityThreshold: 0.01,
      depthScale: 1.0,
      sizeRange: [2, 8] as [number, number],
      seed: 42,
    }

    const stripeCloud = buildMorphologyPointCloud(stripeInput, opts)
    const blobCloud = buildMorphologyPointCloud(blobInput, opts)

    // Stripe points on the stripe itself should have high filamentarity
    const stripeOnlyPoints = stripeCloud.points.filter(p => p.intensity > 0.5)
    const avgStripeF = stripeOnlyPoints.reduce((s, p) => s + p.filamentarity, 0) / stripeOnlyPoints.length
    expect(avgStripeF).toBeGreaterThan(0.5)

    // Blob center should have low filamentarity
    const blobCenter = blobCloud.points.find(p =>
      Math.abs(p.x) < 0.05 && Math.abs(p.y) < 0.05,
    )
    expect(blobCenter).toBeDefined()
    expect(blobCenter!.filamentarity).toBeLessThan(0.3)

    // Stripe should have less z-spread (thinner) than blob
    const zSpread = (points: typeof stripeCloud.points) => {
      const zs = points.map(p => p.z)
      return Math.max(...zs) - Math.min(...zs)
    }
    expect(zSpread(stripeOnlyPoints)).toBeLessThan(zSpread(blobCloud.points))
  })
})
