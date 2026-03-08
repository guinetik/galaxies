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

import type { GalaxyRenderParams } from './morphology'

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
    diskThicknessRatio: 0.06,
    dustFraction: 0.65,
    brightFraction: 0.03,
    dustHueRange: [240, 280] as [number, number],
    brightHueRange: [10, 45] as [number, number],
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

/**
 * Selects a stellar hue using the same broad radial spectral weighting as the
 * WebGPU generator so both renderers share the same population mix.
 */
function pickHue(layer: Layer, distFactor: number, _isHII: boolean): number {
  const v = CONFIG.visual
  if (layer === 'dust') {
    return v.dustHueRange[0] + Math.random() * (v.dustHueRange[1] - v.dustHueRange[0])
  }
  if (layer === 'bright') {
    return v.brightHueRange[0] + Math.random() * (v.brightHueRange[1] - v.brightHueRange[0])
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

function getCentralClearRadius(params: GalaxyRenderParams): number {
  // Scale exclusion with black hole quad (20% of galaxy radius),
  // so stars crowd right up to the visible accretion disk edge.
  return params.galaxyRadius * 0.06
}

function applyCentralClearZone(stars: Star[], params: GalaxyRenderParams): Star[] {
  const clearRadius = getCentralClearRadius(params)
  return stars.filter((star) => star.radius >= clearRadius)
}

// ─── Field star generator ────────────────────────────────────────────────────

/**
 * Generates a diffuse field star with radial spectral weighting instead of a
 * fixed warm tint so outskirts can still contain cooler populations.
 */
function generateFieldStar(galaxyRadius: number): Star {
  const angle = Math.random() * TAU
  const radius = Math.sqrt(Math.random()) * galaxyRadius
  const y = (Math.random() - 0.5) * galaxyRadius * 0.08
  const layer = assignLayer(Math.random())
  const props = layerProperties(layer)
  const distFactor = radius / galaxyRadius

  return {
    radius,
    angle,
    y,
    rotationSpeed: computeRotationSpeed(radius),
    hue: pickHue(layer, distFactor, false),
    brightness: props.brightness,
    size: props.size,
    alpha: props.alpha,
    layer,
    twinklePhase: Math.random() * TAU,
  }
}

// ─── Arm star generator ─────────────────────────────────────────────────────

function generateArmStars(p: GalaxyRenderParams, count: number): Star[] {
  const stars: Star[] = []
  const m = p.morphology
  const galaxyRadius = p.galaxyRadius
  const numArms = m.numArms
  const starsPerArm = Math.floor(count / numArms)
  const armWidth = m.armWidth * galaxyRadius
  const spiralTightness = m.spiralTightness
  const spiralStart = m.spiralStart * galaxyRadius
  const irregularity = m.irregularity
  const hasBar = m.barLength > 0
  const barLength = m.barLength * galaxyRadius
  const windingFactor = 2.5
  const minArmRadius = Math.min(
    Math.max(spiralStart, hasBar ? barLength * 0.5 : 0),
    galaxyRadius * 0.98,
  )
  const minArmRadiusSq = minArmRadius * minArmRadius
  const maxArmRadiusSq = galaxyRadius * galaxyRadius

  for (let arm = 0; arm < numArms; arm++) {
    const armOffset = (arm / numArms) * TAU

    for (let i = 0; i < starsPerArm; i++) {
      // Sample radius from an annulus that begins where the spiral actually
      // starts. This avoids collapsing all inner-arm stars into a straight
      // segment when r < spiralStart, which is especially visible in WebGPU.
      const armRadius = Math.sqrt(
        Math.random() * (maxArmRadiusSq - minArmRadiusSq) + minArmRadiusSq,
      )

      const safeSpiralStart = Math.max(spiralStart, 0.001)
      const theta = Math.log(Math.max(armRadius / safeSpiralStart, 1.0))
        / Math.max(spiralTightness, 0.001)
        * windingFactor

      // Angular scatter along arm to break up radial concentration at spiral start
      const angleScatter = (Math.random() - 0.5) * 0.3
      const baseAngle = theta + armOffset + angleScatter
      const scatterScale = (armRadius / galaxyRadius) * 0.5 + 0.5
      const scatter = (Math.random() - 0.5 + Math.random() - 0.5) * armWidth * scatterScale
      const scatterAngle = baseAngle + Math.PI / 2
      const irr = irregularity * (Math.random() - 0.5) * 30

      const x = Math.cos(baseAngle) * (armRadius + irr) + Math.cos(scatterAngle) * scatter
      const z = Math.sin(baseAngle) * (armRadius + irr) + Math.sin(scatterAngle) * scatter

      const radialT = armRadius / galaxyRadius
      const thickness = galaxyRadius * CONFIG.visual.diskThicknessRatio * (1 - radialT * 0.7)
      const y = (Math.random() - 0.5) * thickness

      const actualRadius = Math.sqrt(x * x + z * z)
      const actualAngle = Math.atan2(z, x)
      const distFactor = actualRadius / galaxyRadius
      const rotationSpeed = computeRotationSpeed(actualRadius)

      const layer = assignLayer(Math.random())

      const props = layerProperties(layer)
      const hue = pickHue(layer, distFactor, false)

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

  return stars
}

// ─── Bar star generator ─────────────────────────────────────────────────────

function generateBarStars(p: GalaxyRenderParams, count: number): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius
  const barLength = p.morphology.barLength * galaxyRadius
  const barWidth = p.morphology.barWidth * galaxyRadius

  for (let i = 0; i < count; i++) {
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
      y: (Math.random() - 0.5) * galaxyRadius * 0.04,
      rotationSpeed: computeRotationSpeed(actualRadius),
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

// ─── Bulge star generator ───────────────────────────────────────────────────

function generateBulgeStars(p: GalaxyRenderParams, count: number): Star[] {
  const stars: Star[] = []
  const bulgeRadius = p.morphology.bulgeRadius * p.galaxyRadius

  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.6) * bulgeRadius
    const theta = Math.random() * TAU
    const y = (Math.random() - 0.5) * bulgeRadius * 0.5

    // Bulge stars are mostly old, warm population — brighter toward center
    const distFactor = r / bulgeRadius
    const coreBrightBoost = 1.0 + (1.0 - distFactor) * 0.5
    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)

    stars.push({
      radius: r,
      angle: theta,
      y,
      rotationSpeed: computeRotationSpeed(r) * 0.5,
      hue: pickHue(layer, 0.1, false),
      brightness: Math.min(props.brightness * coreBrightBoost, 0.95),
      size: props.size * (1.0 + (1.0 - distFactor) * 0.3),
      alpha: Math.min(props.alpha * coreBrightBoost, 0.95),
      layer,
      twinklePhase: Math.random() * TAU,
    })
  }

  return stars
}

// ─── Elliptical star generator ──────────────────────────────────────────────

function generateEllipticalStars(p: GalaxyRenderParams, count: number): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius
  const axisRatio = p.morphology.axisRatio

  for (let i = 0; i < count; i++) {
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
      y: (Math.random() - 0.5) * galaxyRadius * 0.1 * (1 - distFactor * 0.5),
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

// ─── Lenticular star generator ───────────────────────────────────────────────
//
// Lenticulars are smooth oblate spheroids — thick at center (bulge), thinning
// to a lens edge. Generated as a single continuous distribution to avoid
// visible gaps between bulge and disk components.

function generateLenticularStars(p: GalaxyRenderParams, count: number): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius
  const bulgeRadius = p.morphology.bulgeRadius * galaxyRadius

  for (let i = 0; i < count; i++) {
    // Smooth radial profile: centrally concentrated power-law
    const r = Math.pow(Math.random(), 0.55) * galaxyRadius
    const theta = Math.random() * TAU
    const distFactor = r / galaxyRadius

    // Match the WebGPU lens profile: a fuller central thickness that tapers
    // quadratically toward the disk edge.
    const thickness = galaxyRadius * 0.06 * Math.pow(Math.max(1 - distFactor, 0), 2)
    const y = (Math.random() - 0.5) * thickness

    // Match the WebGPU continuous bulge weighting instead of a hard in/out split.
    const bulgeBlend = Math.max(0, Math.min(1, 1 - r / Math.max(bulgeRadius, 1)))
    const coreBrightBoost = 1.0 + bulgeBlend * 0.4

    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)

    stars.push({
      radius: r,
      angle: theta,
      y,
      rotationSpeed: computeRotationSpeed(r) * (bulgeBlend > 0 ? 0.5 : 1.0),
      hue: pickHue(layer, distFactor * 0.2, false),
      brightness: Math.min(props.brightness * coreBrightBoost, 0.95),
      size: props.size * (1.0 + bulgeBlend * 0.3),
      alpha: Math.min(props.alpha * coreBrightBoost, 0.95),
      layer,
      twinklePhase: Math.random() * TAU,
    })
  }

  return stars
}

// ─── Clump star generator (irregular) ───────────────────────────────────────

interface Clump {
  x: number
  z: number
  sigma: number
  weight: number
  isHII: boolean
}

function generateClumpStars(p: GalaxyRenderParams, count: number): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius
  const irregularity = p.morphology.irregularity
  const clumpCount = p.morphology.clumpCount

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

  for (let i = 0; i < count; i++) {
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
        const hue = pickHue(layer, distFactor, false)

    stars.push({
      radius: actualRadius,
      angle: actualAngle,
      y: (Math.random() - 0.5) * galaxyRadius * 0.12,
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

export function generateGalaxy(params: GalaxyRenderParams): Star[] {
  const m = params.morphology
  const totalStars = params.starCount
  const galaxyRadius = params.galaxyRadius
  let stars: Star[] = []

  const hasBar = m.barLength > 0
  const hasArms = m.numArms > 0
  const hasClumps = m.clumpCount > 0 && m.irregularity > 0
  const isElliptical = m.ellipticity > 0 && !hasArms && !hasBar && !hasClumps
  const isLenticular = !hasArms && !hasBar && !hasClumps && m.ellipticity === 0 && m.bulgeFraction > 0

  // ── Star count distribution ─────────────────────────────────────────────

  if (isElliptical) {
    // Elliptical: all stars go to elliptical envelope
    stars.push(...generateEllipticalStars(params, totalStars))

  } else if (isLenticular) {
    // Lenticular: single smooth oblate distribution (no bulge/disk split)
    stars.push(...generateLenticularStars(params, totalStars))

  } else if (hasClumps) {
    // Irregular: all non-field stars go to clumps
    const fieldCount = Math.floor(totalStars * m.fieldStarFraction)
    const clumpStarCount = totalStars - fieldCount
    stars.push(...generateClumpStars(params, clumpStarCount))
    for (let i = 0; i < fieldCount; i++) {
      stars.push(generateFieldStar(galaxyRadius))
    }

  } else if (hasBar && hasArms) {
    // Barred spiral: bar 25%, arms get bulk, plus bulge
    const barCount = Math.floor(totalStars * 0.25)
    const remainingAfterBar = totalStars - barCount

    stars.push(...generateBarStars(params, barCount))

    // Arm stars: 90% of remaining (after bar), matching old barred logic
    const armCount = Math.floor(remainingAfterBar * 0.9)
    stars.push(...generateArmStars(params, armCount))

    // Bulge stars (additional, scaled by bulge/galaxy ratio)
    const bulgeRadius = m.bulgeRadius * galaxyRadius
    if (bulgeRadius > 0) {
      const bulgeFrac = Math.min(0.20, 0.08 + 0.18 * (bulgeRadius / galaxyRadius))
      const bulgeCount = Math.floor(totalStars * bulgeFrac)
      stars.push(...generateBulgeStars(params, bulgeCount))
    }

    // Field stars: 10% of remaining
    const fieldCount = Math.floor(remainingAfterBar * 0.1)
    for (let i = 0; i < fieldCount; i++) {
      stars.push(generateFieldStar(galaxyRadius))
    }

  } else if (hasArms) {
    // Unbarred spiral: arms + bulge + field
    const fieldStarFraction = m.fieldStarFraction
    const armCount = Math.floor(totalStars * (1 - fieldStarFraction))
    stars.push(...generateArmStars(params, armCount))

    // Bulge stars (additional, scaled by bulge/galaxy ratio)
    const bulgeRadius = m.bulgeRadius * galaxyRadius
    if (bulgeRadius > 0) {
      const bulgeFrac = Math.min(0.25, 0.10 + 0.20 * (bulgeRadius / galaxyRadius))
      const bulgeCount = Math.floor(totalStars * bulgeFrac)
      stars.push(...generateBulgeStars(params, bulgeCount))
    }

    // Field stars
    const fieldCount = Math.floor(totalStars * fieldStarFraction)
    for (let i = 0; i < fieldCount; i++) {
      stars.push(generateFieldStar(galaxyRadius))
    }
  }

  return applyCentralClearZone(stars, params)
}
