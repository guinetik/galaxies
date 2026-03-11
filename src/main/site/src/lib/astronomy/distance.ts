/**
 * Distance modulus, Hubble law, and related conversions.
 * @module lib/astronomy/distance
 */

/** Default Hubble constant (km/s/Mpc) */
const H0_DEFAULT = 70

/**
 * Convert distance modulus to distance in Mpc.
 * dm = m - M = 5*log10(d_pc/10)  =>  d_pc = 10^((dm+5)/5), d_Mpc = d_pc/1e6
 *
 * @param dm - Distance modulus
 * @returns Distance in Mpc
 */
export function distanceModulusToMpc(dm: number): number {
  return Math.pow(10, dm / 5 - 5)
}

/**
 * Convert distance in Mpc to distance modulus.
 * DM = 5 * log10(d_pc/10), d_pc = dMpc * 1e6
 *
 * @param dMpc - Distance in Mpc
 * @returns Distance modulus
 */
export function mpcToDistanceModulus(dMpc: number): number {
  const dPc = dMpc * 1e6
  return 5 * Math.log10(dPc / 10)
}

/**
 * Hubble law: recessional velocity v = H0 * d
 *
 * @param dMpc - Distance in Mpc
 * @param H0 - Hubble constant in km/s/Mpc (default 70)
 * @returns Recessional velocity in km/s
 */
export function hubbleVelocity(dMpc: number, H0: number = H0_DEFAULT): number {
  return H0 * dMpc
}
