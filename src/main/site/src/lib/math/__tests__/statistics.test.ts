import { describe, it, expect } from 'vitest'
import { medianFromHistogram } from '../statistics'

describe('medianFromHistogram', () => {
  it('returns ~0.5 for uniform histogram', () => {
    const hist = new Uint32Array(256)
    for (let i = 0; i < 256; i++) hist[i] = 1
    const median = medianFromHistogram(hist, 256)
    expect(median).toBeGreaterThanOrEqual(0.49)
    expect(median).toBeLessThanOrEqual(0.51)
  })

  it('returns 0 for histogram with all values in first bucket', () => {
    const hist = new Uint32Array(256)
    hist[0] = 1000
    expect(medianFromHistogram(hist, 1000)).toBe(0)
  })

  it('returns 1 for histogram with all values in last bucket', () => {
    const hist = new Uint32Array(256)
    hist[255] = 1000
    expect(medianFromHistogram(hist, 1000)).toBe(1)
  })

  it('returns median for bimodal histogram', () => {
    const hist = new Uint32Array(256)
    hist[50] = 500
    hist[200] = 500
    const median = medianFromHistogram(hist, 1000)
    expect(median).toBeGreaterThan(50 / 255)
    expect(median).toBeLessThanOrEqual(200 / 255)
  })
})
