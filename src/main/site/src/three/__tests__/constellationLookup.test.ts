import { describe, it, expect } from 'vitest'
import { getConstellation } from '../constellationLookup'

describe('getConstellation', () => {
  it('returns Virgo for M87', () => {
    // M87: RA=187.706°, Dec=12.391°
    expect(getConstellation(187.706, 12.391)).toBe('Virgo')
  })

  it('returns Andromeda for M31', () => {
    // M31: RA=10.685°, Dec=41.269°
    expect(getConstellation(10.685, 41.269)).toBe('Andromeda')
  })

  it('returns Orion for M42 (Orion Nebula)', () => {
    // M42: RA=83.822°, Dec=-5.391°
    expect(getConstellation(83.822, -5.391)).toBe('Orion')
  })

  it('returns Ursa Major for M81', () => {
    // M81: RA=148.888°, Dec=69.065°
    expect(getConstellation(148.888, 69.065)).toBe('Ursa Major')
  })

  it('returns Sagittarius for Galactic center', () => {
    // Sgr A*: RA=266.417°, Dec=-29.008°
    expect(getConstellation(266.417, -29.008)).toBe('Sagittarius')
  })

  it('returns Ursa Minor for north pole', () => {
    // Polaris: RA=37.954°, Dec=89.264°
    expect(getConstellation(37.954, 89.264)).toBe('Ursa Minor')
  })
})
