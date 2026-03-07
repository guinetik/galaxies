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
  t17: number | null
  e_dm_snia: number | null
  e_dm_tf: number | null
  e_dm_fp: number | null
  e_dm_sbf: number | null
  e_dm_snii: number | null
  e_dm_trgb: number | null
  e_dm_ceph: number | null
  e_dm_mas: number | null
  source: string | null
  name: string | null
  morphology: string | null
  agc: number | null
  v_hi: number | null
  log_mhi: number | null
  e_log_mhi: number | null
  log_ms_t: number | null
  e_log_ms_t: number | null
  log_sfr_nuv: number | null
  e_log_sfr_nuv: number | null
  b_mag: number | null
  diameter_arcsec: number | null
  axial_ratio: number | null
  ba: number | null
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
  hi: number
  log_hi: number
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
