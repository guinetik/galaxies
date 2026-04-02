import { describe, it, expect } from 'vitest'
import type { SimbadStar } from '@/composables/useSimbadStar'
import { generatePlanetarySystem } from '@/three/star/PlanetGenerator'
import type { PlanetType } from '@/three/star/PlanetGenerator'

function makeStar(overrides: Partial<SimbadStar> = {}): SimbadStar {
  return {
    mainId: 'HD 1',
    ra: 0,
    dec: 0,
    objectType: 'Star',
    spectralType: 'G2V',
    parallax: 100,
    vMag: 5.0,
    bMag: 5.5,
    teff: 5800,
    logg: 4.4,
    feh: 0.0,
    simbadUrl: 'https://simbad.cds.unistra.fr/simbad/sim-id?Ident=HD+1',
    ...overrides,
  }
}

const VALID_PLANET_TYPES: PlanetType[] = ['Rocky', 'SubNeptune', 'GasGiant']

describe('generatePlanetarySystem', () => {
  it('is deterministic: same seed produces same result', () => {
    const star = makeStar()
    const result1 = generatePlanetarySystem(star, 42)
    const result2 = generatePlanetarySystem(star, 42)
    expect(result1.planets.length).toBe(result2.planets.length)
    result1.planets.forEach((p, i) => {
      expect(p.type).toBe(result2.planets[i].type)
      expect(p.semiMajorAxis).toBeCloseTo(result2.planets[i].semiMajorAxis, 10)
      expect(p.eccentricity).toBeCloseTo(result2.planets[i].eccentricity, 10)
      expect(p.mass).toBeCloseTo(result2.planets[i].mass, 10)
      expect(p.radius).toBeCloseTo(result2.planets[i].radius, 10)
      expect(p.temperature).toBeCloseTo(result2.planets[i].temperature, 10)
      expect(p.orbitalPeriod).toBeCloseTo(result2.planets[i].orbitalPeriod, 10)
    })
  })

  it('different seeds produce different results', () => {
    const star = makeStar()
    const result1 = generatePlanetarySystem(star, 1)
    const result2 = generatePlanetarySystem(star, 99999)
    // At minimum the planet counts or orbital parameters should differ
    const same =
      result1.planets.length === result2.planets.length &&
      result1.planets.every(
        (p, i) =>
          p.semiMajorAxis === result2.planets[i]?.semiMajorAxis
      )
    expect(same).toBe(false)
  })

  it('sun-like star generates planets across multiple seeds', () => {
    const star = makeStar()
    let hasPlanets = false
    // Try 20 seeds; a 75% base probability means we expect planets for most
    for (let seed = 1; seed <= 20; seed++) {
      const result = generatePlanetarySystem(star, seed)
      if (result.planets.length > 0) {
        hasPlanets = true
        break
      }
    }
    expect(hasPlanets).toBe(true)
  })

  it('all planets have positive temperature', () => {
    const star = makeStar()
    for (let seed = 1; seed <= 10; seed++) {
      const result = generatePlanetarySystem(star, seed)
      result.planets.forEach(p => {
        expect(p.temperature).toBeGreaterThan(0)
      })
    }
  })

  it('all planets have positive orbital period', () => {
    const star = makeStar()
    for (let seed = 1; seed <= 10; seed++) {
      const result = generatePlanetarySystem(star, seed)
      result.planets.forEach(p => {
        expect(p.orbitalPeriod).toBeGreaterThan(0)
      })
    }
  })

  it('evolved star (low logg) has no inner planets (< 0.5 AU)', () => {
    // logg = 2.0 triggers the evolved-star inner-planet removal
    const star = makeStar({ logg: 2.0, objectType: 'Giant Star' })
    let checkedAtLeastOneSystem = false
    for (let seed = 1; seed <= 30; seed++) {
      const result = generatePlanetarySystem(star, seed)
      if (result.planets.length > 0) {
        checkedAtLeastOneSystem = true
        result.planets.forEach(p => {
          expect(p.semiMajorAxis).toBeGreaterThanOrEqual(0.5)
        })
      }
    }
    // Sanity: at least one system should have planets to verify the constraint
    expect(checkedAtLeastOneSystem).toBe(true)
  })

  it('handles null teff without throwing', () => {
    const star = makeStar({ teff: null })
    expect(() => generatePlanetarySystem(star, 42)).not.toThrow()
  })

  it('handles null logg without throwing', () => {
    const star = makeStar({ logg: null })
    expect(() => generatePlanetarySystem(star, 42)).not.toThrow()
  })

  it('handles null feh without throwing', () => {
    const star = makeStar({ feh: null })
    expect(() => generatePlanetarySystem(star, 42)).not.toThrow()
  })

  it('handles all null stellar values without throwing', () => {
    const star = makeStar({ teff: null, logg: null, feh: null })
    expect(() => generatePlanetarySystem(star, 42)).not.toThrow()
  })

  it('all planet types are valid', () => {
    const star = makeStar()
    for (let seed = 1; seed <= 15; seed++) {
      const result = generatePlanetarySystem(star, seed)
      result.planets.forEach(p => {
        expect(VALID_PLANET_TYPES).toContain(p.type)
      })
    }
  })

  it('does not mutate the input star object', () => {
    const star = makeStar({ teff: null, logg: null, feh: null })
    const original = { ...star }
    generatePlanetarySystem(star, 42)
    expect(star.teff).toBe(original.teff)
    expect(star.logg).toBe(original.logg)
    expect(star.feh).toBe(original.feh)
    expect(star.mainId).toBe(original.mainId)
  })

  it('host star in result is the same reference as input', () => {
    const star = makeStar()
    const result = generatePlanetarySystem(star, 42)
    expect(result.host).toBe(star)
  })
})
