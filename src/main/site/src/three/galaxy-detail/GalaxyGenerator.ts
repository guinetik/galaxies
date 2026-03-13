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
import { deriveBandInfluenceConfig, type BandInfluenceConfig } from './bandInfluence'

// ─── Star interface ──────────────────────────────────────────────────────────

export interface Star {
  radius: number
  angle: number
  y: number
  rotationSpeed: number
  hue: number
  sat: number
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

/**
 * Applies the observed projected ellipse to the generated XZ footprint.
 * Rotates and scales the minor axis based on band-derived silhouette parameters.
 */
function applyProjectedSilhouette(
  position: { x: number; y: number; z: number },
  influence: BandInfluenceConfig | null,
): { x: number; y: number; z: number } {
  if (!influence || influence.projectedStrength === 0) {
    return position
  }

  const c = Math.cos(influence.projectedAngle)
  const s = Math.sin(influence.projectedAngle)
  const major = position.x * c + position.z * s
  const minor = position.z * c - position.x * s
  const minorScale = influence.projectedAxisRatio * influence.projectedStrength +
    (1 - influence.projectedStrength)
  const shapedMinor = minor * minorScale

  return {
    x: major * c - shapedMinor * s,
    y: position.y,
    z: major * s + shapedMinor * c,
  }
}

// ─── Stellar hues (spectral class blackbody sequence) ────────────────────────

interface SpectralClass {
  hue: number
  spread: number
  sat: number
  wInner: number
  wOuter: number
}

// Main-sequence proportions tuned for visual richness while staying realistic.
// M-class dominates but not overwhelmingly — outer regions have enough blue
// (OB associations in spiral arms) to create warm-to-cool radial contrast.
// G/F have LOW saturation — Sun-like stars appear pale yellow, never green.
const STELLAR_HUES: SpectralClass[] = [
  { hue: 10,  spread: 8,  sat: 0.85, wInner: 0.58, wOuter: 0.30 }, // M — red dwarfs
  { hue: 25,  spread: 8,  sat: 0.60, wInner: 0.20, wOuter: 0.15 }, // K — orange
  { hue: 48,  spread: 5,  sat: 0.22, wInner: 0.10, wOuter: 0.10 }, // G — pale yellow (Sun)
  { hue: 55,  spread: 4,  sat: 0.12, wInner: 0.05, wOuter: 0.10 }, // F — near-white
  { hue: 215, spread: 15, sat: 0.25, wInner: 0.05, wOuter: 0.22 }, // A/B — blue-white
  { hue: 225, spread: 10, sat: 0.45, wInner: 0.02, wOuter: 0.13 }, // O — hot blue
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
 * Selects a stellar hue and per-class saturation using the same broad radial
 * spectral weighting as the WebGPU generator so both renderers share the
 * same population mix.
 */
function pickHueAndSat(layer: Layer, distFactor: number): { hue: number; sat: number } {
  const v = CONFIG.visual
  if (layer === 'dust') {
    return {
      hue: v.dustHueRange[0] + Math.random() * (v.dustHueRange[1] - v.dustHueRange[0]),
      sat: 0.3,
    }
  }
  if (layer === 'bright') {
    // ~60% red giants (10-45°), ~40% blue OB stars (200-230°)
    if (Math.random() < 0.6) {
      return {
        hue: v.brightHueRange[0] + Math.random() * (v.brightHueRange[1] - v.brightHueRange[0]),
        sat: 0.50,
      }
    }
    return { hue: 200 + Math.random() * 30, sat: 0.35 }
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
      return { hue: s.hue + (Math.random() - 0.5) * s.spread, sat: s.sat }
    }
  }
  return { hue: 48, sat: 0.22 } // fallback: Sun-like
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
function generateFieldStar(
  galaxyRadius: number,
  influence: BandInfluenceConfig | null = null,
): Star {
  const angle = Math.random() * TAU
  const radius = Math.sqrt(Math.random()) * galaxyRadius
  let y = (Math.random() - 0.5) * galaxyRadius * 0.08
  const layer = assignLayer(Math.random())
  const props = layerProperties(layer)
  const distFactor = radius / galaxyRadius

  const spec = pickHueAndSat(layer, distFactor)

  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const silhouetted = applyProjectedSilhouette({ x, y, z }, influence)

  const silhouettedRadius = Math.sqrt(silhouetted.x * silhouetted.x + silhouetted.z * silhouetted.z)
  const silhouettedAngle = Math.atan2(silhouetted.z, silhouetted.x)

  return {
    radius: silhouettedRadius,
    angle: silhouettedAngle,
    y: silhouetted.y,
    rotationSpeed: computeRotationSpeed(silhouettedRadius),
    hue: spec.hue,
    sat: spec.sat,
    brightness: props.brightness,
    size: props.size,
    alpha: props.alpha,
    layer,
    twinklePhase: Math.random() * TAU,
  }
}

// ─── Arm star generator ─────────────────────────────────────────────────────

function generateArmStars(
  p: GalaxyRenderParams,
  count: number,
  influence: BandInfluenceConfig | null = null,
): Star[] {
  const stars: Star[] = []

  // Derive band-influenced geometry parameters
  const armScatterScale = influence?.armScatterScale ?? 1
  const diskThicknessScale = influence?.diskThicknessScale ?? 1

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
      const scatter = (Math.random() - 0.5 + Math.random() - 0.5)
        * armWidth
        * scatterScale
        * armScatterScale
      const scatterAngle = baseAngle + Math.PI / 2
      const irr = irregularity * (Math.random() - 0.5) * 30

      const x = Math.cos(baseAngle) * (armRadius + irr) + Math.cos(scatterAngle) * scatter
      const z = Math.sin(baseAngle) * (armRadius + irr) + Math.sin(scatterAngle) * scatter

      const radialT = armRadius / galaxyRadius
      const baseThickness = galaxyRadius * CONFIG.visual.diskThicknessRatio * (1 - radialT * 0.7)
      const thickness = baseThickness * diskThicknessScale
      let y = (Math.random() - 0.5) * thickness

      // Apply projected silhouette
      const silhouetted = applyProjectedSilhouette({ x, y, z }, influence)
      let xSilhouetted = silhouetted.x
      let ySilhouetted = silhouetted.y
      let zSilhouetted = silhouetted.z

      const actualRadius = Math.sqrt(xSilhouetted * xSilhouetted + zSilhouetted * zSilhouetted)
      const actualAngle = Math.atan2(zSilhouetted, xSilhouetted)
      const distFactor = actualRadius / galaxyRadius
      const rotationSpeed = computeRotationSpeed(actualRadius)

      const layer = assignLayer(Math.random())

      const props = layerProperties(layer)
      const spec = pickHueAndSat(layer, distFactor)

      stars.push({
        radius: actualRadius,
        angle: actualAngle,
        y: ySilhouetted,
        rotationSpeed,
        hue: spec.hue,
        sat: spec.sat,
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

function generateBarStars(
  p: GalaxyRenderParams,
  count: number,
  influence: BandInfluenceConfig | null = null,
): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius
  const barLength = p.morphology.barLength * galaxyRadius
  const barWidth = p.morphology.barWidth * galaxyRadius

  for (let i = 0; i < count; i++) {
    const alongBar = (Math.random() - 0.5) * 2 * barLength
    const acrossBar = (Math.random() - 0.5) * barWidth
    let x = alongBar
    let z = acrossBar
    let y = (Math.random() - 0.5) * galaxyRadius * 0.04
    const actualRadius = Math.sqrt(x * x + z * z)
    if (actualRadius > galaxyRadius) continue

    const silhouetted = applyProjectedSilhouette({ x, y, z }, influence)
    const finalX = silhouetted.x
    const finalY = silhouetted.y
    const finalZ = silhouetted.z

    const silhouettedRadius = Math.sqrt(finalX * finalX + finalZ * finalZ)
    const silhouettedAngle = Math.atan2(finalZ, finalX)
    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)
    const spec = pickHueAndSat(layer, 0.1) // near-core colors

    stars.push({
      radius: silhouettedRadius,
      angle: silhouettedAngle,
      y: finalY,
      rotationSpeed: computeRotationSpeed(silhouettedRadius),
      hue: spec.hue,
      sat: spec.sat,
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

function generateBulgeStars(
  p: GalaxyRenderParams,
  count: number,
  influence: BandInfluenceConfig | null = null,
): Star[] {
  const stars: Star[] = []
  const bulgeRadius = p.morphology.bulgeRadius * p.galaxyRadius
  const bulgeBoost = influence?.bulgeBoost ?? 0

  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.6) * bulgeRadius
    const theta = Math.random() * TAU
    let y = (Math.random() - 0.5) * bulgeRadius * 0.5

    // Bulge stars are mostly old, warm population — brighter toward center
    const distFactor = r / bulgeRadius
    const coreBrightBoost = 1.0 + (1.0 - distFactor) * (0.4 + bulgeBoost * 0.2)
    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)

    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r
    const silhouetted = applyProjectedSilhouette({ x, y, z }, influence)

    const silhouettedRadius = Math.sqrt(silhouetted.x * silhouetted.x + silhouetted.z * silhouetted.z)
    const silhouettedAngle = Math.atan2(silhouetted.z, silhouetted.x)

    const spec = pickHueAndSat(layer, 0.1)
    stars.push({
      radius: silhouettedRadius,
      angle: silhouettedAngle,
      y: silhouetted.y,
      rotationSpeed: computeRotationSpeed(silhouettedRadius) * 0.5,
      hue: spec.hue,
      sat: spec.sat,
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

function generateEllipticalStars(
  p: GalaxyRenderParams,
  count: number,
  influence: BandInfluenceConfig | null = null,
): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius
  const axisRatio = p.morphology.axisRatio

  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const r = Math.pow(u, 0.4) * galaxyRadius
    const theta = v * TAU

    let x = r * Math.cos(theta)
    let z = r * Math.sin(theta) * axisRatio
    let y = (Math.random() - 0.5) * galaxyRadius * 0.1 * (1 - r / galaxyRadius * 0.5)

    const silhouetted = applyProjectedSilhouette({ x, y, z }, influence)

    const actualRadius = Math.sqrt(silhouetted.x * silhouetted.x + silhouetted.z * silhouetted.z)
    const actualAngle = Math.atan2(silhouetted.z, silhouetted.x)
    const distFactor = actualRadius / galaxyRadius

    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)
    const spec = pickHueAndSat(layer, distFactor)

    stars.push({
      radius: actualRadius,
      angle: actualAngle,
      y: silhouetted.y,
      rotationSpeed: computeRotationSpeed(actualRadius) * 0.3,
      hue: spec.hue,
      sat: spec.sat,
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

function generateLenticularStars(
  p: GalaxyRenderParams,
  count: number,
  influence: BandInfluenceConfig | null = null,
): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius
  const bulgeRadius = p.morphology.bulgeRadius * galaxyRadius

  for (let i = 0; i < count; i++) {
    // Smooth radial profile: centrally concentrated power-law
    const r = Math.pow(Math.random(), 0.55) * galaxyRadius
    const theta = Math.random() * TAU
    const distFactor = r / galaxyRadius
    const diskThicknessScale = influence?.diskThicknessScale ?? 1

    // Match the WebGPU lens profile: a fuller central thickness that tapers
    // quadratically toward the disk edge.
    const baseThickness = galaxyRadius * 0.06 * Math.pow(Math.max(1 - distFactor, 0), 2)
    const thickness = baseThickness * diskThicknessScale
    let y = (Math.random() - 0.5) * thickness

    // Match the WebGPU continuous bulge weighting instead of a hard in/out split.
    const bulgeBlend = Math.max(0, Math.min(1, 1 - r / Math.max(bulgeRadius, 1)))
    const coreBrightBoost = 1.0 + bulgeBlend * 0.4

    let x = Math.cos(theta) * r
    let z = Math.sin(theta) * r
    const silhouetted = applyProjectedSilhouette({ x, y, z }, influence)

    const silhouettedRadius = Math.sqrt(silhouetted.x * silhouetted.x + silhouetted.z * silhouetted.z)
    const silhouettedAngle = Math.atan2(silhouetted.z, silhouetted.x)

    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)

    const spec = pickHueAndSat(layer, distFactor * 0.2)
    stars.push({
      radius: silhouettedRadius,
      angle: silhouettedAngle,
      y: silhouetted.y,
      rotationSpeed: computeRotationSpeed(silhouettedRadius) * (bulgeBlend > 0 ? 0.5 : 1.0),
      hue: spec.hue,
      sat: spec.sat,
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

function generateClumpStars(
  p: GalaxyRenderParams,
  count: number,
  influence: BandInfluenceConfig | null = null,
): Star[] {
  const stars: Star[] = []
  const galaxyRadius = p.galaxyRadius
  const irregularity = p.morphology.irregularity
  const clumpCount = p.morphology.clumpCount
  const clumpBoost = influence?.clumpBoost ?? 0

  const clumps: Clump[] = []
  for (let c = 0; c < clumpCount; c++) {
    const angle = (c / clumpCount) * TAU + Math.random() * 0.5
    const r = (0.2 + Math.random() * 0.6) * galaxyRadius
    clumps.push({
      x: Math.cos(angle) * r,
      z: Math.sin(angle) * r,
      sigma: (30 + Math.random() * 80) * (1 - clumpBoost * 0.3),
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

    let y = (Math.random() - 0.5) * galaxyRadius * 0.12
    const silhouetted = applyProjectedSilhouette({ x, y, z }, influence)

    const actualRadius = Math.sqrt(silhouetted.x * silhouetted.x + silhouetted.z * silhouetted.z)
    if (actualRadius > galaxyRadius * 1.1) continue

    const actualAngle = Math.atan2(silhouetted.z, silhouetted.x)
    const distFactor = actualRadius / galaxyRadius

    const layer = assignLayer(Math.random())
    const props = layerProperties(layer)
    const spec = pickHueAndSat(layer, distFactor)

    stars.push({
      radius: actualRadius,
      angle: actualAngle,
      y: silhouetted.y,
      rotationSpeed: computeRotationSpeed(actualRadius) * (0.5 + Math.random() * 0.5),
      hue: spec.hue,
      sat: spec.sat,
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
  const influence = deriveBandInfluenceConfig(params.bandProfile) ?? null
  let stars: Star[] = []

  const hasBar = m.barLength > 0
  const hasArms = m.numArms > 0
  const hasClumps = m.clumpCount > 0 && m.irregularity > 0
  const isElliptical = m.ellipticity > 0 && !hasArms && !hasBar && !hasClumps
  const isLenticular = !hasArms && !hasBar && !hasClumps && m.ellipticity === 0 && m.bulgeFraction > 0

  // ── Star count distribution ─────────────────────────────────────────────

  if (isElliptical) {
    // Elliptical: all stars go to elliptical envelope
    stars.push(...generateEllipticalStars(params, totalStars, influence))

  } else if (isLenticular) {
    // Lenticular: single smooth oblate distribution (no bulge/disk split)
    stars.push(...generateLenticularStars(params, totalStars, influence))

  } else if (hasClumps) {
    // Irregular: all non-field stars go to clumps
    const fieldCount = Math.floor(totalStars * m.fieldStarFraction)
    const clumpStarCount = totalStars - fieldCount
    stars.push(...generateClumpStars(params, clumpStarCount, influence))
    for (let i = 0; i < fieldCount; i++) {
      stars.push(generateFieldStar(galaxyRadius, influence))
    }

  } else if (hasBar && hasArms) {
    // Barred spiral: bar 25%, arms get bulk, plus bulge
    const barCount = Math.floor(totalStars * 0.25)
    const remainingAfterBar = totalStars - barCount

    stars.push(...generateBarStars(params, barCount, influence))

    // Arm stars: 90% of remaining (after bar), matching old barred logic
    const armCount = Math.floor(remainingAfterBar * 0.9)
    stars.push(...generateArmStars(params, armCount, influence))

    // Bulge stars (additional, scaled by bulge/galaxy ratio)
    const bulgeRadius = m.bulgeRadius * galaxyRadius
    if (bulgeRadius > 0) {
      const bulgeFrac = Math.min(0.20, 0.08 + 0.18 * (bulgeRadius / galaxyRadius))
      const bulgeCount = Math.floor(totalStars * bulgeFrac)
      stars.push(...generateBulgeStars(params, bulgeCount, influence))
    }

    // Field stars: 10% of remaining
    const fieldCount = Math.floor(remainingAfterBar * 0.1)
    for (let i = 0; i < fieldCount; i++) {
      stars.push(generateFieldStar(galaxyRadius, influence))
    }

  } else if (hasArms) {
    // Unbarred spiral: arms + bulge + field
    const fieldStarFraction = m.fieldStarFraction
    const armCount = Math.floor(totalStars * (1 - fieldStarFraction))
    stars.push(...generateArmStars(params, armCount, influence))

    // Bulge stars (additional, scaled by bulge/galaxy ratio)
    const bulgeRadius = m.bulgeRadius * galaxyRadius
    if (bulgeRadius > 0) {
      const bulgeFrac = Math.min(0.25, 0.10 + 0.20 * (bulgeRadius / galaxyRadius))
      const bulgeCount = Math.floor(totalStars * bulgeFrac)
      stars.push(...generateBulgeStars(params, bulgeCount, influence))
    }

    // Field stars
    const fieldCount = Math.floor(totalStars * fieldStarFraction)
    for (let i = 0; i < fieldCount; i++) {
      stars.push(generateFieldStar(galaxyRadius, influence))
    }
  }

  return applyCentralClearZone(stars, params)
}
