export interface Galaxy {
  pgc: number
  group_pgc: number | null
  vcmb: number | null
  dm: number
  e_dm: number | null
  ra: number
  dec: number
  glon: number | null
  glat: number | null
  sgl: number | null
  sgb: number | null
  distance_mpc: number
  distance_mly: number
  dm_snia: number | null
  dm_tf: number | null
  dm_fp: number | null
  dm_sbf: number | null
  dm_snii: number | null
  dm_trgb: number | null
  dm_ceph: number | null
  dm_mas: number | null
}

export type MorphologyClass =
  | 'elliptical'
  | 'lenticular'
  | 'spiral'
  | 'barred'
  | 'irregular'
  | 'unknown'

/** Mulberry32 seeded PRNG — returns [0,1) */
function seededRandom(seed: number): number {
  let s = seed | 0
  s = (s + 0x6d2b79f5) | 0
  let t = Math.imul(s ^ (s >>> 15), 1 | s)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/**
 * Assign a morphology class to a galaxy based on its PGC number.
 * Uses seeded random weighted by cosmic proportions:
 *   ~35% spiral, ~35% barred, ~15% elliptical, ~10% lenticular, ~5% irregular
 */
export function assignMorphology(pgc: number): MorphologyClass {
  const r = seededRandom(pgc)
  if (r < 0.35) return 'spiral'
  if (r < 0.70) return 'barred'
  if (r < 0.85) return 'elliptical'
  if (r < 0.95) return 'lenticular'
  return 'irregular'
}

/** Galaxy group with pre-computed supergalactic Cartesian coordinates */
export interface GalaxyGroup {
  group_pgc: number
  sgx: number
  sgy: number
  sgz: number
  dist_mpc: number
  vh: number | null
  sgl: number
  sgb: number
}

/**
 * Map CMB velocity to RGB color matching the Tully et al. (2023) paper's
 * Aitoff projection color scheme (Figure 9).
 */
export function velocityToColor(vcmb: number): [number, number, number] {
  if (vcmb < 0)     return [0.55, 0.00, 1.00]  // Purple
  if (vcmb < 2000)  return [0.00, 0.00, 1.00]  // Blue
  if (vcmb < 4000)  return [0.00, 0.75, 1.00]  // Cyan
  if (vcmb < 6000)  return [0.00, 0.80, 0.00]  // Green
  if (vcmb < 8000)  return [1.00, 1.00, 0.00]  // Yellow
  if (vcmb < 10000) return [1.00, 0.00, 0.00]  // Red
  if (vcmb < 12000) return [0.80, 0.00, 0.00]  // Dark Red
  if (vcmb < 14000) return [1.00, 0.55, 0.00]  // Orange
  return [0.55, 0.27, 0.07]                     // Dark Brown
}
