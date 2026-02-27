export interface Galaxy {
  id: number
  catalog: string
  name: string
  ra_sexagesimal: string | null
  dec_sexagesimal: string | null
  ra: number | null
  dec: number | null
  redshift: number | null
  velocity: number | null
  // UGC-only
  z_flag: string | null
  phys_type: string | null
  em_region: string | null
  references: number | null
  notes: number | null
  photometry: number | null
  positions: number | null
  redshifts: number | null
  diameters: number | null
  distances: number | null
  classifications: number | null
  images: number | null
  spectra: number | null
  // FSS-only
  pgc: number | null
  morphology: string | null
  u_mag: number | null
  b_mag: number | null
  r_mag: number | null
  i_mag: number | null
  j_mag: number | null
  h_mag: number | null
  k_mag: number | null
  diameter_arcsec: number | null
  axial_ratio: number | null
  neighbor_count: number | null
  position_angle: number | null
  activity_class: string | null
  fss_notes: string | null
}

export type MorphologyClass =
  | 'elliptical'
  | 'lenticular'
  | 'spiral'
  | 'barred'
  | 'irregular'
  | 'unknown'

export function classifyMorphology(morph: string | null): MorphologyClass {
  if (!morph) return 'unknown'
  const m = morph.trim().toUpperCase()

  // Barred spirals: SBa, SBb, SBc, SBd, SB0, SB(s), etc.
  if (/^SB/.test(m)) return 'barred'

  // Normal spirals: Sa, Sb, Sc, Sd, S(r), etc. (but not S0)
  if (/^S[A-D]/.test(m) || /^S\(/.test(m)) return 'spiral'

  // Lenticular: S0, E-S0, S0/a, etc.
  if (/S0/.test(m) || /^E[-/]S/.test(m)) return 'lenticular'

  // Elliptical: E, E0-E7, cE, dE, etc.
  if (/^[CD]?E\d?/.test(m) || m === 'E') return 'elliptical'

  // Irregular: Irr, I, Im, IB(m), etc.
  if (/^I(?:RR|M|B|$)/.test(m)) return 'irregular'

  return 'unknown'
}
