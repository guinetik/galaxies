/**
 * Celestial coordinate formatting and conversion.
 * @module lib/astronomy/coordinates
 */

/**
 * Converts decimal degrees to sexagesimal RA string (HHh MMm SS.Ss).
 * Input is RA in degrees (0–360).
 *
 * @param raDeg - Right ascension in decimal degrees
 * @returns Formatted string e.g. "12h 34m 56.7s"
 */
export function formatRA(raDeg: number): string {
  const h = raDeg / 15
  const hh = Math.floor(h)
  const mm = Math.floor((h - hh) * 60)
  const ss = ((h - hh) * 60 - mm) * 60
  return `${String(hh).padStart(2, '0')}h ${String(mm).padStart(2, '0')}m ${ss.toFixed(1).padStart(4, '0')}s`
}

/**
 * Converts decimal degrees to sexagesimal Dec string (+DD°MM'SS.S").
 *
 * @param decDeg - Declination in decimal degrees [-90, 90]
 * @returns Formatted string e.g. "+45°30'12.3""
 */
export function formatDec(decDeg: number): string {
  const sign = decDeg >= 0 ? '+' : '−'
  const abs = Math.abs(decDeg)
  const dd = Math.floor(abs)
  const mm = Math.floor((abs - dd) * 60)
  const ss = ((abs - dd) * 60 - mm) * 60
  return `${sign}${String(dd).padStart(2, '0')}°${String(mm).padStart(2, '0')}'${ss.toFixed(1).padStart(4, '0')}"`
}

/**
 * Convert arcseconds to decimal degrees.
 *
 * @param arcsec - Angle in arcseconds
 * @returns Angle in decimal degrees
 */
export function arcsecToDeg(arcsec: number): number {
  return arcsec / 3600
}
