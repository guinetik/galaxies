/**
 * Interpolation and mapping utilities.
 * @module lib/math/interpolation
 */

/**
 * Clamp a scalar into the provided range.
 *
 * @param value - Value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value in [min, max]
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Cubic ease-in-out: slow start, rush through mid-range, gentle landing.
 *
 * @param t - Progress in [0, 1]
 * @returns Eased value in [0, 1]
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Cubic ease-out: fast start, slow finish.
 *
 * @param t - Progress in [0, 1]
 * @returns Eased value in [0, 1]
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Map Mpc distance to log-scale percentage (0–100).
 *
 * @param mpc - Distance in Mpc
 * @param minMpc - Minimum Mpc (maps to 0%)
 * @param maxMpc - Maximum Mpc (maps to 100%)
 * @returns Percentage 0–100
 */
export function mpcToPercent(mpc: number, minMpc: number, maxMpc: number): number {
  const logMin = Math.log10(minMpc)
  const logMax = Math.log10(maxMpc)
  return ((Math.log10(mpc) - logMin) / (logMax - logMin)) * 100
}

/**
 * Seeded random for reproducible draws. Returns value in [0, 1).
 *
 * @param seed - Seed value
 * @returns Random value in [0, 1)
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}
