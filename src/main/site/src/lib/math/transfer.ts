/**
 * Transfer functions for image stretching (PixInsight-style AutoSTF).
 * @module lib/math/transfer
 */

import { medianFromHistogram } from './statistics'

/**
 * Midtone Transfer Function (PixInsight).
 * Maps (0,0), (m,0.5), (1,1) via rational interpolation.
 *
 * @param x - Input value in [0, 1]
 * @param m - Midtone balance parameter
 * @returns Output value in [0, 1]
 */
export function mtf(x: number, m: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  if (x === m) return 0.5
  return ((m - 1) * x) / ((2 * m - 1) * x - m)
}

/**
 * Compute Auto STF parameters from a channel's 8-bit pixel data.
 * Uses histogram-based median/MAD (O(n) instead of sorting).
 * Algorithm: PixInsight AutoSTF (Juan Conejero).
 *   C = -2.8 (shadow clipping in sigma units)
 *   B = 0.10 (target background level — lower than PI default 0.25 because
 *             16-bit PNGs preserve more faint signal than 8-bit WebPs)
 *
 * @param hist - 256-bin histogram for the channel
 * @param total - Total pixel count
 * @returns { c0, m } - Shadow clip and midtone balance for LUT
 */
export function computeStfParams(hist: Uint32Array, total: number): { c0: number; m: number } {
  const C = -2.8
  const B = 0.1

  const median = medianFromHistogram(hist, total)

  // MAD via deviation histogram: for 8-bit data, deviations are also discrete
  // |val/255 - median| → bucket by rounding to nearest 1/255
  const devHist = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    if (hist[i] === 0) continue
    const dev = Math.round(Math.abs(i / 255 - median) * 255)
    devHist[Math.min(dev, 255)] += hist[i]
  }
  const mad = medianFromHistogram(devHist, total)

  // Shadow clip: median + C * 1.4826 * MAD (C is negative → clips below median)
  const c0 = Math.max(0, Math.min(1, median + C * 1.4826 * mad))

  // Midtones balance: PixInsight mtf(m=B, x=medianShifted)
  const medianShifted = median - c0
  const m = medianShifted > 0 ? mtf(medianShifted, B) : 0.5

  return { c0, m }
}

/**
 * Apply Auto STF stretch to an ImageData in-place.
 * Processes each RGB channel independently (per PixInsight convention).
 * Uses a 256-entry lookup table so the per-pixel work is a single array lookup.
 *
 * @param imageData - ImageData to modify in-place
 */
export function applyAutoStf(imageData: ImageData): void {
  const { data, width, height } = imageData
  const pixelCount = width * height

  for (let ch = 0; ch < 3; ch++) {
    // Build histogram for this channel — O(n)
    const hist = new Uint32Array(256)
    for (let i = 0; i < pixelCount; i++) {
      hist[data[i * 4 + ch]]++
    }

    const { c0, m } = computeStfParams(hist, pixelCount)

    // Build 256-entry LUT — O(256)
    const lut = new Uint8Array(256)
    for (let i = 0; i < 256; i++) {
      let x = i / 255
      x = Math.max(0, (x - c0) / (1 - c0))
      x = mtf(x, m)
      lut[i] = Math.round(x * 255)
    }

    // Apply LUT to every pixel — O(n), single array lookup per pixel
    for (let i = 0; i < pixelCount; i++) {
      const idx = i * 4 + ch
      data[idx] = lut[data[idx]]
    }
  }
}
