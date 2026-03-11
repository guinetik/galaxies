import { describe, it, expect } from 'vitest'
import { mtf, computeStfParams, applyAutoStf } from '../transfer'

describe('mtf', () => {
  it('returns 0 for x <= 0', () => {
    expect(mtf(0, 0.5)).toBe(0)
    expect(mtf(-0.1, 0.5)).toBe(0)
  })

  it('returns 1 for x >= 1', () => {
    expect(mtf(1, 0.5)).toBe(1)
    expect(mtf(1.1, 0.5)).toBe(1)
  })

  it('returns 0.5 when x === m', () => {
    expect(mtf(0.5, 0.5)).toBe(0.5)
    expect(mtf(0.25, 0.25)).toBe(0.5)
  })

  it('interpolates between 0 and 1 for values in (0, 1)', () => {
    const y = mtf(0.3, 0.5)
    expect(y).toBeGreaterThan(0)
    expect(y).toBeLessThan(1)
    expect(y).not.toBe(0.5) // 0.3 !== 0.5
  })
})

describe('computeStfParams', () => {
  it('returns c0 and m in valid range for uniform histogram', () => {
    const hist = new Uint32Array(256)
    for (let i = 0; i < 256; i++) hist[i] = 100
    const total = 256 * 100
    const { c0, m } = computeStfParams(hist, total)
    expect(c0).toBeGreaterThanOrEqual(0)
    expect(c0).toBeLessThanOrEqual(1)
    expect(m).toBeGreaterThanOrEqual(0)
    expect(m).toBeLessThanOrEqual(1)
  })

  it('returns sensible params for dark-biased histogram', () => {
    const hist = new Uint32Array(256)
    for (let i = 0; i < 128; i++) hist[i] = 100
    const total = 128 * 100
    const { c0, m } = computeStfParams(hist, total)
    expect(c0).toBeGreaterThanOrEqual(0)
    expect(c0).toBeLessThanOrEqual(1)
    expect(m).toBeGreaterThan(0)
  })
})

describe('applyAutoStf', () => {
  it('modifies ImageData in-place without throwing', () => {
    // Use Uint8ClampedArray to simulate ImageData in Node (ImageData not available)
    const data = new Uint8ClampedArray(4 * 4 * 4)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 50
      data[i + 1] = 100
      data[i + 2] = 150
      data[i + 3] = 255
    }
    const imageData = { data, width: 4, height: 4 } as ImageData
    const before = new Uint8ClampedArray(data)
    applyAutoStf(imageData)
    expect(data).not.toEqual(before)
    expect(data[3]).toBe(255) // Alpha unchanged
  })
})
