/**
 * Galaxy star distribution generator — TypeScript port of gcanvas galaxy.generator.js
 *
 * Generates star positions for different galaxy morphologies (Hubble sequence):
 * Spiral, Barred Spiral, Lenticular, Elliptical, and Irregular.
 *
 * Stars are assigned to one of three visual layers:
 *   - dust   — faint, small background particles (nebular blue-violet)
 *   - star   — mid-brightness main-sequence stars
 *   - bright — luminous OB stars or giants
 */

import type {
  GeneratorParams,
  SpiralParams,
  BarredParams,
  LenticularParams,
  EllipticalParams,
  IrregularParams,
} from './GalaxyParamsMapper'

// ─── Star interface ──────────────────────────────────────────────────────────

export interface Star {
  radius: number
  angle: number
  y: number
  rotationSpeed: number
  hue: number
  brightness: number
  size: number
  alpha: number
  layer: 'dust' | 'star' | 'bright'
  twinklePhase: number
}

// ─── Embedded CONFIG constants ───────────────────────────────────────────────

const TAU = Math.PI * 2

const CONFIG = {
  rotation: {
    baseSpeed: 0.033,
    falloff: 0.35,
    referenceRadius: 20,
  },
  blackHole: {
    exclusionRadius: 25,
  },
  visual: {
    diskThickness: 8,
    dustFraction: 0.65,
    brightFraction: 0.03,
    hiiHueRange: [320, 340] as [number, number],
    fieldHueRange: [10, 30] as [number, number],
    dustHueRange: [240, 280] as [number, number],
    hiiRegionChance: 0.15,
  },
} as const

// ─── Stellar hues (spectral class blackbody sequence) ────────────────────────

interface SpectralClass {
  hue: number
  spread: number
  wInner: number
  wOuter: number
}

const STELLAR_HUES: SpectralClass[] = [
  { hue: 10, spread: 8, wInner: 0.35, wOuter: 0.05 },   // M — red dwarfs
  { hue: 25, spread: 8, wInner: 0.30, wOuter: 0.10 },   // K — orange
  { hue: 42, spread: 6, wInner: 0.25, wOuter: 0.15 },   // G — yellow (Sun-like)
  { hue: 55, spread: 5, wInner: 0.08, wOuter: 0.20 },   // F — yellow-white
  { hue: 210, spread: 15, wInner: 0.02, wOuter: 0.35 },  // A/B — blue-white
  { hue: 225, spread: 10, wInner: 0.00, wOuter: 0.15 },  // O — hot blue
]

// ─── Helper functions ────────────────────────────────────────────────────────

type Layer = 'dust' | 'star' | 'bright'

interface LayerProps {
  size: number
  brightness: number
  alpha: number
}

function assignLayer(roll: number): Layer {
  const dustF = CONFIG.visual.dustFraction
  const brightF = CONFIG.visual.brightFraction
  if (roll < dustF) return 'dust'
  if (roll > 1 - brightF) return 'bright'
  return 'star'
}

function layerProperties(layer: Layer): LayerProps {
  switch (layer) {
    case 'dust':
      return {
        size: 0.8 + Math.random() * 1.5,
        brightness: 0.08 + Math.random() * 0.16,
        alpha: 0.12 + Math.random() * 0.2,
      }
    case 'bright':
      return {
        size: 4 + Math.random() * 6,
        brightness: 0.64 + Math.random() * 0.16,
        alpha: 0.56 + Math.random() * 0.24,
      }
    default: // 'star'
      return {
        size: 1.5 + Math.random() * 3.0,
        brightness: 0.32 + Math.random() * 0.4,
        alpha: 0.4 + Math.random() * 0.4,
      }
  }
}

function pickHue(layer: Layer, distFactor: number, isHII: boolean): number {
  const v = CONFIG.visual
  if (isHII) {
    return v.hiiHueRange[0] + Math.random() * (v.hiiHueRange[1] - v.hiiHueRange[0])
  }
  if (layer === 'dust') {
    return v.dustHueRange[0] + Math.random() * (v.dustHueRange[1] - v.dustHueRange[0])
  }
  // Weighted selection from spectral classes based on radial position
  const d = Math.pow(distFactor, 0.6)
  let totalWeight = 0
  for (const s of STELLAR_HUES) {
    totalWeight += s.wInner * (1 - d) + s.wOuter * d
  }
  let roll = Math.random() * totalWeight
  for (const s of STELLAR_HUES) {
    roll -= s.wInner * (1 - d) + s.wOuter * d
    if (roll <= 0) {
      return s.hue + (Math.random() - 0.5) * s.spread
    }
  }
  return 42 // fallback: Sun-like yellow
}

function computeRotationSpeed(r: number): number {
  const { baseSpeed, falloff, referenceRadius } = CONFIG.rotation
  return baseSpeed / Math.pow(Math.max(r, referenceRadius) / referenceRadius, falloff)
}

// ─── Central clear zone ──────────────────────────────────────────────────────

function getCentralClearRadius(_params: GeneratorParams): number {
  // Just the black hole core — stars crowd close to the center
  return CONFIG.blackHole.exclusionRadius
}

function applyCentralClearZone(stars: Star[], params: GeneratorParams): Star[] {
  const clearRadius = getCentralClearRadius(params)
  return stars.filter((star) => star.radius >= clearRadius)
}

// ─── Field star generator ────────────────────────────────────────────────────

function generateFieldStar(galaxyRadius: number): Star {
  const angle = Math.random() * TAU
  const radius = Math.sqrt(Math.random()) * galaxyRadius
  const y = (Math.random() - 0.5) * 15
  const layer = assignLayer(Math.random())
  const props = layerProperties(layer)

  return {
    radius,
    angle,
    y,
    rotationSpeed: computeRotationSpeed(radius),
    hue: CONFIG.visual.fieldHueRange[0] + Math.random() * (CONFIG.visual.fieldHueRange[1] - CONFIG.visual.fieldHueRange[0]),
    brightness: props.brightness,
    size: props.size,
    alpha: props.alpha,
    layer,
    twinklePhase: Math.random() * TAU,
  }
}

// ─── Spiral generator ────────────────────────────────────────────────────────

function generateSpiral(p: SpiralParams): Star[] {
  const stars: Star[] = []
  const numArms = p.numArms || 2
  const totalStars = p.starCount || 15000
  const armStars = Math.floor(totalStars * (1 - (p.fieldStarFraction || 0.15)))
  const starsPerArm = Math.floor(armStars / numArms)
  const galaxyRadius = p.galaxyRadius || 350
  const armWidth = p.armWidth || 40
  const spiralTightness = p.spiralTightness || 0.25
  const spiralStart = (p.spiralStart || 0.086) * galaxyRadius
  const irregularity = p.irregularity || 0
  const hiiChance = CONFIG.visual.hiiRegionChance
  const numSegments = 10

  for (let arm = 0; arm < numArms; arm++) {
    const armOffset = (arm / numArms) * TAU

    // Pre-determine HII regions for this arm
    const hiiSegments = new Set<number>()
    for (let seg = 0; seg < numSegments; seg++) {
      if (Math.random() < hiiChance) hiiSegments.add(seg)
    }

    for (let i = 0; i < starsPerArm; i++) {
      const t = i / starsPerArm
      const theta = t * TAU * 2.5
      const r = spiralStart * Math.exp(spiralTightness * theta)

      if (r > galaxyRadius) continue

      const baseAngle = theta + armOffset
      const scatter = (Math.random() - 0.5 + Math.random() - 0.5) * armWidth
      const scatterAngle = baseAngle + Math.PI / 2
      const alongScatter = (Math.random() - 0.5) * 20
      const irr = irregularity * (Math.random() - 0.5) * 30

      const x = Math.cos(baseAngle) * (r + alongScatter + irr) + Math.cos(scatterAngle) * scatter
      const z = Math.sin(baseAngle) * (r + alongScatter + irr) + Math.sin(scatterAngle) * scatter

      const thickness = CONFIG.visual.diskThickness * (1 - t * 0.7)
      const y = (Math.random() - 0.5) * thickness

      const actualRadius = Math.sqrt(x * x + z * z)
      const actualAngle = Math.atan2(z, x)
      const distFactor = actualRadius / galaxyRadius
      const rotationSpeed = computeRotationSpeed(actualRadius)

      const layer = assignLayer(Math.random())
      const segment = Math.floor(t * numSegments)
      const isHII = hiiSegments.has(segment) && Math.random() < 0.4

      const props = layerProperties(layer)
      const hue = pickHue(layer, distFactor, isHII)

      stars.push({
        radius: actualRadius,
        angle: actualAngle,
        y,
        rotationSpeed,
        hue,
        brightness: props.brightness,
        size: props.size,
        alpha: props.alpha,
        layer,
        twinklePhase: Math.random() * TAU,
      })
    }
  }

  // Bulge stars (concentrated central population)
  const bulgeRadius = p.bulgeRadius || 0
  if (bulgeRadius > 0) {
    const bulgeCount = Math.floor(totalStars * 0.15)
    for (let i = 0; i < bulgeCount; i++) {
      const r = Math.pow(Math.random(), 0.3) * bulgeRadius
      const theta = Math.random() * TAU
      const y = (Math.random() - 0.5) * bulgeRadius * 0.4

      const layer = assignLayer(Math.random())
      const props = layerProperties(layer)

      stars.push({
        radius: r,
        angle: theta,
        y,
        rotationSpeed: computeRotationSpeed(r) * 0.5,
        hue: pickHue(layer, 0.1, false),
        brightness: props.brightness,
        size: props.size,
        alpha: props.alpha,
        layer,
        twinklePhase: Math.random() * TAU,
      })
    }
  }

  // Field stars
  const fieldCount = Math.floor(totalStars * (p.fieldStarFraction || 0.15))
  for (let i = 0; i < fieldCount; i++) {
    stars.push(generateFieldStar(galaxyRadius))
  }

  return stars
}

// ─── Barred spiral generator ─────────────────────────────────────────────────

function generateBarredSpiral(p: BarredParams): Star[] {
  const stars: Star[] = []
  const numArms = p.numArms || 2
  const galaxyRadius = p.galaxyRadius || 350
  const barLength = p.barLength || 120
  const barWidth = p.barWidth || 25
  const armWidth = p.armWidth || 45
  const spiralTightness = p.spiralTightness || 0.28
  const spiralStart = (p.spiralStart || 0.143) * galaxyRadius
  const totalStars = p.starCount || 16000
  const hiiChance = CONFIG.visual.hiiRegionChance
  const numSegments = 10

  // Bar stars
  const barStars = Math.floor(totalStars * 0.25)
  for (let i = 0; i < barStars; i++) {
    const alongBar = (Math.random() - 0.5) * 2 * barLength
    const acrossBar = (Math.random() - 0.5) * barWidth
    const x = alongBar
    const z = acrossBar
    const actualRadius = Math.sqrt(x * x + z * z)
    if (actualRadius > galaxyRadius) continue

    const actualAngle = Math.atan2(z, x)
    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)
    const hue = pickHue(layer, 0.1, false) // near-core colors

    stars.push({
      radius: actualRadius,
      angle: actualAngle,
      y: (Math.random() - 0.5) * 6,
      rotationSpeed: computeRotationSpeed(actualRadius),
      hue,
      brightness: props.brightness,
      size: props.size,
      alpha: props.alpha,
      layer,
      twinklePhase: Math.random() * TAU,
    })
  }

  // Arm stars
  for (let arm = 0; arm < numArms; arm++) {
    const armOffset = (arm / numArms) * TAU
    const starsPerArm = Math.floor((totalStars - barStars) * 0.9 / numArms)

    const hiiSegments = new Set<number>()
    for (let seg = 0; seg < numSegments; seg++) {
      if (Math.random() < hiiChance) hiiSegments.add(seg)
    }

    for (let i = 0; i < starsPerArm; i++) {
      const t = i / starsPerArm
      const theta = t * TAU * 2.5
      const r = spiralStart * Math.exp(spiralTightness * theta)

      if (r > galaxyRadius || r < barLength * 0.5) continue

      const baseAngle = theta + armOffset
      const scatter = (Math.random() - 0.5 + Math.random() - 0.5) * armWidth
      const scatterAngle = baseAngle + Math.PI / 2
      const alongScatter = (Math.random() - 0.5) * 20

      const x = Math.cos(baseAngle) * (r + alongScatter) + Math.cos(scatterAngle) * scatter
      const z = Math.sin(baseAngle) * (r + alongScatter) + Math.sin(scatterAngle) * scatter

      const actualRadius = Math.sqrt(x * x + z * z)
      const actualAngle = Math.atan2(z, x)
      const distFactor = actualRadius / galaxyRadius

      const layer = assignLayer(Math.random())
      const segment = Math.floor(t * numSegments)
      const isHII = hiiSegments.has(segment) && Math.random() < 0.4
      const props = layerProperties(layer)
      const hue = pickHue(layer, distFactor, isHII)

      stars.push({
        radius: actualRadius,
        angle: actualAngle,
        y: (Math.random() - 0.5) * 8 * (1 - t * 0.7),
        rotationSpeed: computeRotationSpeed(actualRadius),
        hue,
        brightness: props.brightness,
        size: props.size,
        alpha: props.alpha,
        layer,
        twinklePhase: Math.random() * TAU,
      })
    }
  }

  // Bulge stars (concentrated spheroid beyond bar region)
  const bulgeRadius = p.bulgeRadius || 0
  if (bulgeRadius > 0) {
    const bulgeCount = Math.floor(totalStars * 0.1)
    for (let i = 0; i < bulgeCount; i++) {
      const r = Math.pow(Math.random(), 0.3) * bulgeRadius
      const theta = Math.random() * TAU
      const y = (Math.random() - 0.5) * bulgeRadius * 0.4

      const layer = assignLayer(Math.random())
      const props = layerProperties(layer)

      stars.push({
        radius: r,
        angle: theta,
        y,
        rotationSpeed: computeRotationSpeed(r) * 0.5,
        hue: pickHue(layer, 0.1, false),
        brightness: props.brightness,
        size: props.size,
        alpha: props.alpha,
        layer,
        twinklePhase: Math.random() * TAU,
      })
    }
  }

  // Field stars
  const fieldStars = Math.floor((totalStars - barStars) * 0.1)
  for (let i = 0; i < fieldStars; i++) {
    stars.push(generateFieldStar(galaxyRadius))
  }

  return stars
}

// ─── Lenticular generator ────────────────────────────────────────────────────

function generateLenticular(p: LenticularParams): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius || 300
  const bulgeRadius = p.bulgeRadius || 80
  const bulgeFraction = p.bulgeFraction || 0.4
  const diskThickness = p.diskThickness || 4
  const totalStars = p.starCount || 28000

  // Bulge stars — de Vaucouleurs-like concentrated spheroid, warm old population
  const bulgeCount = Math.floor(totalStars * bulgeFraction)
  for (let i = 0; i < bulgeCount; i++) {
    const r = Math.pow(Math.random(), 0.3) * bulgeRadius
    const theta = Math.random() * TAU
    const y = (Math.random() - 0.5) * bulgeRadius * 0.6

    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)

    stars.push({
      radius: r,
      angle: theta,
      y,
      rotationSpeed: computeRotationSpeed(r) * 0.5,
      hue: pickHue(layer, 0.1, false),
      brightness: props.brightness,
      size: props.size,
      alpha: props.alpha,
      layer,
      twinklePhase: Math.random() * TAU,
    })
  }

  // Disk stars — exponential radial profile, very thin, no arm structure
  const diskCount = totalStars - bulgeCount
  const scaleLength = galaxyRadius / 3
  for (let i = 0; i < diskCount; i++) {
    const u = Math.random()
    const r = -Math.log(1 - u * 0.95) * scaleLength
    if (r > galaxyRadius) { i--; continue }

    const theta = Math.random() * TAU
    const distFactor = r / galaxyRadius
    const y = (Math.random() - 0.5) * diskThickness * (1 - distFactor * 0.5)

    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)

    stars.push({
      radius: r,
      angle: theta,
      y,
      rotationSpeed: computeRotationSpeed(r),
      hue: pickHue(layer, distFactor * 0.3, false),
      brightness: props.brightness,
      size: props.size,
      alpha: props.alpha,
      layer,
      twinklePhase: Math.random() * TAU,
    })
  }

  return stars
}

// ─── Elliptical generator ────────────────────────────────────────────────────

function generateElliptical(p: EllipticalParams): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius || 320
  const axisRatio = p.axisRatio || 0.7

  const n = p.starCount || 12000
  for (let i = 0; i < n; i++) {
    const u = Math.random()
    const v = Math.random()
    const r = Math.pow(u, 0.4) * galaxyRadius
    const theta = v * TAU

    const x = r * Math.cos(theta)
    const z = r * Math.sin(theta) * axisRatio

    const actualRadius = Math.sqrt(x * x + z * z)
    const actualAngle = Math.atan2(z, x)
    const distFactor = actualRadius / galaxyRadius

    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)
    const hue = pickHue(layer, distFactor, false)

    stars.push({
      radius: actualRadius,
      angle: actualAngle,
      y: (Math.random() - 0.5) * 20 * (1 - distFactor * 0.5),
      rotationSpeed: computeRotationSpeed(actualRadius) * 0.3,
      hue,
      brightness: props.brightness,
      size: props.size,
      alpha: props.alpha,
      layer,
      twinklePhase: Math.random() * TAU,
    })
  }

  return stars
}

// ─── Irregular generator ─────────────────────────────────────────────────────

interface Clump {
  x: number
  z: number
  sigma: number
  weight: number
  isHII: boolean
}

function generateIrregular(p: IrregularParams): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius || 280
  const irregularity = p.irregularity || 0.8
  const clumpCount = p.clumpCount || 5

  const clumps: Clump[] = []
  for (let c = 0; c < clumpCount; c++) {
    const angle = (c / clumpCount) * TAU + Math.random() * 0.5
    const r = (0.2 + Math.random() * 0.6) * galaxyRadius
    clumps.push({
      x: Math.cos(angle) * r,
      z: Math.sin(angle) * r,
      sigma: 30 + Math.random() * 80,
      weight: 0.5 + Math.random(),
      isHII: Math.random() < CONFIG.visual.hiiRegionChance,
    })
  }

  const n = p.starCount || 10000

  for (let i = 0; i < n; i++) {
    let x: number, z: number, isHII = false
    if (Math.random() < 1 - irregularity) {
      const idx = Math.floor(Math.random() * clumpCount)
      const c = clumps[idx]
      const gaussian = () => (Math.random() - 0.5 + Math.random() - 0.5) * 2
      x = c.x + gaussian() * c.sigma
      z = c.z + gaussian() * c.sigma
      isHII = c.isHII && Math.random() < 0.4
    } else {
      const angle = Math.random() * TAU
      const r = Math.sqrt(Math.random()) * galaxyRadius
      x = Math.cos(angle) * r + (Math.random() - 0.5) * 60
      z = Math.sin(angle) * r + (Math.random() - 0.5) * 60
    }

    const actualRadius = Math.sqrt(x * x + z * z)
    if (actualRadius > galaxyRadius * 1.1) continue

    const actualAngle = Math.atan2(z, x)
    const distFactor = actualRadius / galaxyRadius

    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)
    const hue = pickHue(layer, distFactor, isHII)

    stars.push({
      radius: actualRadius,
      angle: actualAngle,
      y: (Math.random() - 0.5) * 25,
      rotationSpeed: computeRotationSpeed(actualRadius) * (0.5 + Math.random() * 0.5),
      hue,
      brightness: props.brightness,
      size: props.size,
      alpha: props.alpha,
      layer,
      twinklePhase: Math.random() * TAU,
    })
  }

  return stars
}

// ─── Main entry point ────────────────────────────────────────────────────────

export function generateGalaxy(params: GeneratorParams): Star[] {
  let stars: Star[]

  switch (params.type) {
    case 'spiral':
      stars = generateSpiral(params)
      break
    case 'barred':
      stars = generateBarredSpiral(params)
      break
    case 'lenticular':
      stars = generateLenticular(params)
      break
    case 'elliptical':
      stars = generateElliptical(params)
      break
    case 'irregular':
      stars = generateIrregular(params)
      break
  }

  return applyCentralClearZone(stars, params)
}
