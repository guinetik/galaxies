import type { SimbadStar } from '@/composables/useSimbadStar'

// Re-export SimbadStar for convenience
export type { SimbadStar }

export type PlanetType = 'Rocky' | 'SubNeptune' | 'GasGiant'

export interface Planet {
  type: PlanetType
  semiMajorAxis: number   // AU
  eccentricity: number
  mass: number            // Earth masses (or MJ for giants)
  radius: number          // Earth radii
  temperature: number     // Equilibrium temperature (K)
  orbitalPeriod: number   // Years
}

/** Intermediate values captured during generation — for "show your work" UI */
export interface PlanetDerivation {
  teff: number              // effective temperature used (may be default)
  feh: number               // metallicity used (may be default)
  logg: number              // surface gravity used
  estimatedMass: number     // solar masses
  snowLine: number          // AU
  pAny: number              // probability of hosting any planets
  pGiant: number            // probability of a gas giant
  hasGiant: boolean         // whether a gas giant was generated
  meanSmallCount: number    // expected small planet count (Poisson lambda)
  isEvolved: boolean        // whether inner clearing was applied
  teffIsDefault: boolean
  fehIsDefault: boolean
  loggIsDefault: boolean
}

export interface PlanetarySystem {
  host: SimbadStar
  planets: Planet[]
  derivation: PlanetDerivation
}

// Seeded random number generator (Park-Miller LCG)
class RNG {
  private seed: number

  constructor(seed: number) {
    this.seed = seed % 2147483647
    if (this.seed <= 0) this.seed += 2147483646
  }

  // Uniform [0,1)
  random(): number {
    this.seed = (this.seed * 16807) % 2147483647
    return (this.seed - 1) / 2147483646
  }

  uniform(min: number, max: number): number {
    return min + (max - min) * this.random()
  }

  bool(p: number): boolean {
    return this.random() < p
  }

  poisson(lambda: number): number {
    const L = Math.exp(-lambda)
    let p = 1.0
    let k = 0
    do {
      k++
      p *= this.random()
    } while (p > L)
    return k - 1
  }

  normal(mean: number = 0, stdev: number = 1): number {
    // Box-Muller transform
    const u = this.random()
    const v = this.random()
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    return mean + z * stdev
  }
}

// Estimate stellar mass from Teff (main-sequence approximation)
function estimateMass(teff: number): number {
  // Rough: M ~ (Teff / 5800)^2.5
  return Math.pow(teff / 5800, 2.5)
}

// Estimate stellar radius from Teff (main-sequence approximation)
function estimateRadius(teff: number): number {
  return Math.pow(teff / 5800, 1.25)
}

// Equilibrium temperature of a planet given host Teff, stellar radius (solar units), and semi-major axis (AU)
function equilibriumTemperature(teff: number, rStar: number, a: number): number {
  // Teq = Teff * sqrt(Rstar / (2 * a))
  // rStar is in solar radii; a is in AU; 1 solar radius ≈ 0.00465 AU
  const rStarAU = rStar * 0.00465
  return teff * Math.sqrt(rStarAU / (2 * a))
}

// Orbital period via Kepler's third law: P = sqrt(a^3 / Mstar) in years
function orbitalPeriod(a: number, mStar: number): number {
  return Math.sqrt(Math.pow(a, 3) / mStar)
}

// Convert radius (Earth radii) to mass (Earth masses) via segmented power law
function radiusToMass(radius: number): number {
  if (radius < 1.0) {
    return Math.pow(radius, 3)          // Rocky planets ~R^3
  } else if (radius < 4.0) {
    return Math.pow(radius, 2.06)       // Sub-Neptunes (Weiss+2014)
  } else {
    return Math.pow(radius, 1.5) * 10  // Gas-giant proxy
  }
}

export function generatePlanetarySystem(star: SimbadStar, seed: number): PlanetarySystem {
  const rng = new RNG(seed)

  // 1. Resolve nullable stellar parameters into local variables (do NOT mutate star)
  const isGiantType = star.objectType.toLowerCase().includes('giant')
  const teff = star.teff ?? 5800
  const logg = star.logg ?? (isGiantType ? 2.5 : 4.5)
  const feh = star.feh ?? rng.normal(0, 0.2)

  const mass = estimateMass(teff)
  const rStar = estimateRadius(teff)

  // 2. Compute probability that star hosts any planets
  let P_any = 0.75
  if (teff < 4000) P_any *= 1.3    // boost for M dwarfs
  if (teff > 6000) P_any *= 0.5    // suppress for A/F stars
  P_any *= 1 + 0.5 * Math.tanh(feh / 0.3)  // metallicity boost
  P_any = Math.max(0, Math.min(0.99, P_any))

  const teffIsDefault = star.teff == null
  const fehIsDefault = star.feh == null
  const loggIsDefault = star.logg == null
  const L = Math.pow(teff / 5800, 4)
  const snowLine = 2.7 * Math.sqrt(L)

  if (!rng.bool(P_any)) {
    return {
      host: star, planets: [],
      derivation: {
        teff, feh, logg, estimatedMass: mass, snowLine,
        pAny: P_any, pGiant: 0, hasGiant: false,
        meanSmallCount: 0, isEvolved: logg < 3.5,
        teffIsDefault, fehIsDefault, loggIsDefault,
      },
    }
  }

  const planets: Planet[] = []

  // 3. Compute gas-giant probability
  let P_giant = 0.03 * Math.pow(10, 1.8 * feh)
  if (mass < 0.6) P_giant *= 0.2
  if (mass > 1.2 && mass < 2.0) P_giant *= 1.3
  if (mass >= 2.0) P_giant *= 0.1
  P_giant = Math.min(0.99, P_giant)

  // 4. Add gas giant(s) if any
  let hasGiant = false
  if (rng.bool(P_giant)) {
    hasGiant = true
    const a_giant = rng.uniform(snowLine * 1.1, snowLine * 3.5)
    const giantRadius = rng.uniform(8, 12)
    planets.push({
      type: 'GasGiant',
      semiMajorAxis: a_giant,
      eccentricity: rng.uniform(0.0, 0.3),
      mass: rng.uniform(100, 400),   // Earth masses (~0.3-1.3 MJ)
      radius: giantRadius,
      temperature: equilibriumTemperature(teff, rStar, a_giant),
      orbitalPeriod: orbitalPeriod(a_giant, mass),
    })
  }

  // 5. Determine number of small planets
  let mean_small = 2.0
  if (mass < 0.6) mean_small *= 2.5
  if (mass > 1.2) mean_small *= 0.5
  mean_small *= 1 + 0.2 * feh
  const N_small = Math.max(1, rng.poisson(mean_small))

  // 6. Generate small planets with spacing
  let prev_a = 0.1
  const frac_large = Math.max(0.1, Math.min(0.9, 0.5 + 0.3 * Math.tanh(feh / 0.2)))
  for (let i = 0; i < N_small; i++) {
    const spacing = rng.uniform(1.4, 2.2)
    const a = prev_a * spacing
    if (a > 50) break
    const isLarge = rng.bool(frac_large)
    const R = isLarge ? rng.uniform(1.7, 3.5) : rng.uniform(0.8, 1.5)
    const M = radiusToMass(R)
    planets.push({
      type: isLarge ? 'SubNeptune' : 'Rocky',
      semiMajorAxis: a,
      eccentricity: rng.uniform(0.0, 0.2),
      mass: M,
      radius: R,
      temperature: equilibriumTemperature(teff, rStar, a),
      orbitalPeriod: orbitalPeriod(a, mass),
    })
    prev_a = a
  }

  // 7. If evolved star (low logg), remove inner planets that were engulfed
  if (logg < 3.5) {
    for (let j = planets.length - 1; j >= 0; j--) {
      if (planets[j].semiMajorAxis < 0.5) {
        planets.splice(j, 1)
      }
    }
  }

  return {
    host: star,
    planets,
    derivation: {
      teff, feh, logg, estimatedMass: mass, snowLine,
      pAny: P_any, pGiant: P_giant, hasGiant,
      meanSmallCount: mean_small, isEvolved: logg < 3.5,
      teffIsDefault, fehIsDefault, loggIsDefault,
    },
  }
}
