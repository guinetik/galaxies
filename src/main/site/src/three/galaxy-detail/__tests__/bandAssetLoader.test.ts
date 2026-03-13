import { afterEach, describe, expect, it, vi } from 'vitest'
import { decode as decodePng } from 'fast-png'
import { loadGalaxyBandAnalysis } from '../bandAssetLoader'

vi.mock('fast-png', () => ({
  decode: vi.fn(),
}))

const mockedDecode = vi.mocked(decodePng)

/**
 * Creates a fake grayscale PNG decode result with uniform values.
 */
function makeDecodedImage(
  width: number,
  height: number,
  value: number,
  depth: 8 | 16 = 8,
) {
  const maxValue = depth === 16 ? 65535 : 255
  const sample = Math.round(value * maxValue)
  const data = depth === 16
    ? new Uint16Array(width * height).fill(sample)
    : new Uint8Array(width * height).fill(sample)

  return {
    width,
    height,
    depth,
    channels: 1,
    data,
    text: {},
  }
}

/**
 * Creates a fake grayscale PNG decode result from explicit normalized samples.
 */
function makeDecodedImageFromValues(
  width: number,
  height: number,
  values: number[],
  depth: 8 | 16 = 8,
) {
  const maxValue = depth === 16 ? 65535 : 255
  const typed = depth === 16
    ? new Uint16Array(values.map((value) => Math.round(value * maxValue)))
    : new Uint8Array(values.map((value) => Math.round(value * maxValue)))

  return {
    width,
    height,
    depth,
    channels: 1,
    data: typed,
    text: {},
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  mockedDecode.mockReset()
})

describe('loadGalaxyBandAnalysis', () => {
  it('returns null when metadata is missing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
    })))

    await expect(loadGalaxyBandAnalysis(1234)).resolves.toBeNull()
  })

  it('loads available bands, marks missing ones as fallbacks, and extracts a feature profile', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith('metadata.json')) {
        return {
          ok: true,
          json: async () => ({
            pgc: 7777,
            nsa_iau_name: 'NSA TEST',
            nsaid: 42,
            ra: 0,
            dec: 0,
            bands: ['g', 'r', 'i'],
            dimensions: [2, 2],
            data_ranges: {
              g: [0, 1],
              r: [0, 1],
              i: [0, 1],
            },
            fetched_date: '2026-03-13',
            nsa_url: 'https://example.test',
          }),
        }
      }

      return {
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      }
    })
    vi.stubGlobal('fetch', fetchMock)

    mockedDecode
      .mockReturnValueOnce(makeDecodedImage(2, 2, 0.5))
      .mockReturnValueOnce(makeDecodedImage(2, 2, 0.6))
      .mockReturnValueOnce(makeDecodedImage(2, 2, 0.7))

    const result = await loadGalaxyBandAnalysis(7777)

    expect(result).not.toBeNull()
    expect(result!.availability.real.g).toBe(true)
    expect(result!.availability.real.r).toBe(true)
    expect(result!.availability.real.i).toBe(true)
    expect(result!.availability.fallback.u).toBe(true)
    expect(result!.availability.fallback.z).toBe(true)
    expect(result!.availability.fallback.nuv).toBe(true)
    expect(result!.input.bands.u).toBeInstanceOf(Float32Array)
    expect(result!.profile.globalColorBalance.hot).toBeGreaterThan(0)
    expect(result!.profile.globalColorBalance.hot).toBeLessThan(result!.profile.globalColorBalance.stellar)
    expect(result!.profile.radialProfile).toHaveLength(8)
  })

  it('preserves real UV bands when they are present and yields a hotter color balance', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith('metadata.json')) {
        return {
          ok: true,
          json: async () => ({
            pgc: 8888,
            nsa_iau_name: 'NSA HOT',
            nsaid: 99,
            ra: 0,
            dec: 0,
            bands: ['u', 'g', 'r', 'i', 'z', 'nuv'],
            dimensions: [2, 2],
            data_ranges: {
              u: [0, 1],
              g: [0, 1],
              r: [0, 1],
              i: [0, 1],
              z: [0, 1],
              nuv: [0, 1],
            },
            fetched_date: '2026-03-13',
            nsa_url: 'https://example.test',
          }),
        }
      }

      return {
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      }
    })
    vi.stubGlobal('fetch', fetchMock)

    mockedDecode
      .mockReturnValueOnce(makeDecodedImageFromValues(2, 2, [1.0, 1.0, 0.8, 0.8]))
      .mockReturnValueOnce(makeDecodedImageFromValues(2, 2, [0.18, 0.14, 0.12, 0.1]))
      .mockReturnValueOnce(makeDecodedImageFromValues(2, 2, [0.16, 0.12, 0.1, 0.08]))
      .mockReturnValueOnce(makeDecodedImageFromValues(2, 2, [0.15, 0.1, 0.0, 0.0]))
      .mockReturnValueOnce(makeDecodedImageFromValues(2, 2, [0.12, 0.08, 0.0, 0.0]))
      .mockReturnValueOnce(makeDecodedImageFromValues(2, 2, [1.0, 0.95, 0.75, 0.7]))

    const result = await loadGalaxyBandAnalysis(8888)

    expect(result).not.toBeNull()
    expect(result!.availability.real.u).toBe(true)
    expect(result!.availability.real.nuv).toBe(true)
    expect(result!.availability.fallback.u).toBe(false)
    expect(result!.profile.globalColorBalance.hot).toBeGreaterThan(0.3)
    expect(result!.profile.globalColorBalance.dust).toBeLessThan(0.35)
  })

  it('drops only corrupted optional bands and keeps the core analysis alive', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith('metadata.json')) {
        return {
          ok: true,
          json: async () => ({
            pgc: 9999,
            nsa_iau_name: 'NSA PARTIAL',
            nsaid: 123,
            ra: 0,
            dec: 0,
            bands: ['u', 'g', 'r', 'i'],
            dimensions: [2, 2],
            data_ranges: {
              u: [0, 1],
              g: [0, 1],
              r: [0, 1],
              i: [0, 1],
            },
            fetched_date: '2026-03-13',
            nsa_url: 'https://example.test',
          }),
        }
      }

      return {
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      }
    })
    vi.stubGlobal('fetch', fetchMock)

    mockedDecode
      .mockReturnValueOnce(makeDecodedImage(2, 2, 0.5))
      .mockReturnValueOnce(makeDecodedImage(2, 2, 0.6))
      .mockReturnValueOnce(makeDecodedImage(2, 2, 0.7))
      .mockImplementationOnce(() => {
        throw new Error('corrupt optional band')
      })

    const result = await loadGalaxyBandAnalysis(9999)

    expect(result).not.toBeNull()
    expect(result!.availability.fallback.u).toBe(true)
    expect(result!.availability.real.g).toBe(true)
    expect(result!.availability.real.r).toBe(true)
    expect(result!.availability.real.i).toBe(true)
  })
})
