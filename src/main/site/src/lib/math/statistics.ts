/**
 * Statistics utilities for histogram-based analysis.
 * @module lib/math/statistics
 */

/**
 * Find median from a 256-bin histogram. O(256) instead of O(n log n).
 *
 * @param hist - 256-bin histogram (index = value 0..255)
 * @param total - Total count of samples
 * @returns Median value in [0, 1] (normalized from 0..255)
 */
export function medianFromHistogram(hist: Uint32Array, total: number): number {
  const half = total >>> 1
  let cumulative = 0
  for (let i = 0; i < 256; i++) {
    cumulative += hist[i]
    if (cumulative > half) return i / 255
  }
  return 1
}
