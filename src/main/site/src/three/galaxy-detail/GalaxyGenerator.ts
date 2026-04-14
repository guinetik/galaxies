/**
 * Galaxy star distribution generator — TypeScript port of gcanvas galaxy.generator.js
 *
 * Generates star positions for different galaxy morphologies (Hubble sequence):
 * Spiral, Barred Spiral, Lenticular, Elliptical, and Irregular.
 *
 * Stars are assigned to one of two visual layers:
 *   - star   — mid-brightness main-sequence stars
 *   - bright — luminous OB stars or giants
 *
 * Dust manifests only as wavelength-dependent extinction, not as a particle layer.
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
  layer: 'star' | 'bright'
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

/**
 * Linear interpolation between two values.
 */
function mix(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * Clamps a value to [0, 1] range.
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/**
 * Tanner Helland blackbody approximation: temperature (K) → linear RGB [0,1].
 */
function kelvinToRgb(tempK: number): { r: number; g: number; b: number } {
  const n = Math.min(Math.max(tempK, 1000), 40000) / 100
  let r: number, g: number, b: number

  if (n <= 66) {
    r = 1.0
    g = Math.min(1, Math.max(0, (Math.log(n) * 99.4708 - 161.1196) / 255))
    b = n <= 19
      ? 0
      : Math.min(1, Math.max(0, (Math.log(n - 10) * 138.5177 - 305.0448) / 255))
  } else {
    const t = n - 60
    r = Math.min(1, Math.max(0, Math.pow(t, -0.1332) * 329.6987 / 255))
    g = Math.min(1, Math.max(0, Math.pow(t, -0.0755) * 288.1222 / 255))
    b = 1.0
  }

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  return { r: toLinear(r), g: toLinear(g), b: toLinear(b) }
}

/** Stellar population distributions: [M/K, F/G, OBA, RedGiant] */
const POP_ARM = [0.56, 0.24, 0.16, 0.04]
const POP_FIELD = [0.78, 0.17, 0.03, 0.02]
const POP_BULGE = [0.68, 0.12, 0.01, 0.19]
const POP_ELLIPTICAL = [0.74, 0.11, 0.005, 0.145]
const POP_DEFAULT = [0.72, 0.20, 0.065, 0.015]

type PopulationRole = 'arm' | 'field' | 'bulge' | 'elliptical' | 'default'

/**
 * Selects a blackbody temperature based on population distribution.
 */
function pickTemperature(population: number[]): number {
  const [pMK, pFG, pOBA] = population
  const roll = Math.random()

  if (roll < pMK) {
    return 2600 + Math.pow(Math.random(), 0.64) * 3400 // M/K dwarf: 2600-6000K
  } else if (roll < pMK + pFG) {
    return 5200 + Math.random() * 3200 // F/G star: 5200-8400K
  } else if (roll < pMK + pFG + pOBA) {
    return 8500 + Math.random() * 7500 // OBA hot: 8500-16000K
  } else {
    return 2900 + Math.random() * 1800 // Red giant: 2900-4700K
  }
}

function smoothstepCPU(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/**
 * Computes wavelength-dependent dust extinction for a star position.
 */
function computeDustExtinction(
  x: number, y: number, z: number,
  params: GalaxyRenderParams,
): { r: number; g: number; b: number } {
  const m = params.morphology
  if (m.dustStrength <= 0) return { r: 1, g: 1, b: 1 }

  const R = params.galaxyRadius
  const radialR = Math.sqrt(x * x + z * z)
  const radialScale = R * 0.34
  const verticalScale = R * 0.06 * 0.18

  const radialExt = Math.exp(-radialR / Math.max(radialScale, 0.01))
  const verticalExt = Math.exp(-Math.abs(y) / Math.max(verticalScale, 0.01))
  const baseExt = radialExt * verticalExt

  const bulgeR = m.bulgeRadius * R
  const bulgeSuppress = smoothstepCPU(bulgeR * 0.4, bulgeR * 1.2, radialR)

  let armDust = 0
  if (m.numArms > 0 && m.dustArmBoost > 0) {
    const starAngle = Math.atan2(z, x)
    const armSigma = m.armWidth * 0.5
    const spiralStartR = Math.max(m.spiralStart * R, 0.001)

    for (let i = 0; i < m.numArms; i++) {
      const armPhase = (i * TAU) / m.numArms
      const expectedAngle = Math.log(Math.max(radialR / spiralStartR, 1)) /
        Math.max(m.spiralTightness, 0.001) * 2.5 + armPhase
      let angDist = starAngle - expectedAngle
      angDist = angDist - Math.round(angDist / TAU) * TAU
      const score = Math.exp(-(angDist * angDist) / (2 * armSigma * armSigma))
      armDust = Math.max(armDust, score)
    }
    armDust *= m.dustArmBoost
  }

  // Simple deterministic noise from position
  const nx = Math.sin(x * 0.1 + z * 0.13) * 0.5 + 0.5
  const nz = Math.sin(z * 0.11 - x * 0.09 + 3.7) * 0.5 + 0.5
  const noise = (nx + nz) * 0.5

  const extinction = m.dustStrength * baseExt * bulgeSuppress * (1 + armDust) * noise

  return {
    r: Math.exp(-extinction * 0.65),
    g: Math.exp(-extinction * 0.9),
    b: Math.exp(-extinction * 1.2),
  }
}

// ─── Helper functions ────────────────────────────────────────────────────────

type Layer = 'star' | 'bright'

interface LayerProps {
  size: number
  brightness: number
  alpha: number
}

function assignLayer(roll: number, influence: BandInfluenceConfig | null = null): Layer {
  const hotMix = clamp01((influence?.hotMix ?? 0.5) * 0.7)
  const brightF = mix(0.04, 0.08, hotMix)

  if (roll > 1 - brightF) return 'bright'
  return 'star'
}

function layerProperties(
  layer: Layer,
  influence: BandInfluenceConfig | null = null,
): LayerProps {
  switch (layer) {
    case 'bright': {
      const hotBoost = mix(0.9, 1.4, influence?.hotMix ?? 0.5)
      return {
        size: (4 + Math.random() * 6) * hotBoost,
        brightness: (0.64 + Math.random() * 0.16) * hotBoost,
        alpha: (0.56 + Math.random() * 0.24) * mix(0.95, 1.2, influence?.clumpBoost ?? 0),
      }
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
 * Selects a stellar hue and saturation using population-aware blackbody temperatures.
 * The role determines which stellar population distribution to use.
 */
function pickHueAndSat(
  layer: Layer,
  distFactor: number,
  influence: BandInfluenceConfig | null = null,
  role: PopulationRole = 'default',
): { hue: number; sat: number } {
  let temp: number

  if (layer === 'bright') {
    temp = Math.random() < 0.6
      ? 2900 + Math.random() * 1800
      : 10000 + Math.random() * 15000
  } else {
    const pop =
      role === 'arm' ? POP_ARM :
      role === 'field' ? POP_FIELD :
      role === 'bulge' ? POP_BULGE :
      role === 'elliptical' ? POP_ELLIPTICAL :
      POP_DEFAULT
    temp = pickTemperature(pop)
  }

  // Map temperature to approximate hue/sat for Star interface compatibility
  let hue: number, sat: number
  if (temp < 4000) {
    hue = 10 + (temp - 2600) / 1400 * 15
    sat = 0.85
  } else if (temp < 6000) {
    hue = 25 + (temp - 4000) / 2000 * 23
    sat = 0.4
  } else if (temp < 8500) {
    hue = 48 + (temp - 6000) / 2500 * 7
    sat = 0.15
  } else {
    hue = 200 + (temp - 8500) / 7500 * 25
    sat = 0.3
  }

  return { hue, sat }
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
  const layer = assignLayer(Math.random(), influence)
  const props = layerProperties(layer, influence)
  const distFactor = radius / galaxyRadius

  const spec = pickHueAndSat(layer, distFactor, influence, 'field')

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

      const layer = assignLayer(Math.random(), influence)

      const props = layerProperties(layer, influence)
      const spec = pickHueAndSat(layer, distFactor, influence, 'arm')

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
    const layer = assignLayer(Math.random(), influence)
    const props = layerProperties(layer, influence)
    const spec = pickHueAndSat(layer, 0.1, influence, 'arm') // near-core colors

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
    const layer = assignLayer(Math.random(), influence)
    const props = layerProperties(layer, influence)

    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r
    const silhouetted = applyProjectedSilhouette({ x, y, z }, influence)

    const silhouettedRadius = Math.sqrt(silhouetted.x * silhouetted.x + silhouetted.z * silhouetted.z)
    const silhouettedAngle = Math.atan2(silhouetted.z, silhouetted.x)

    const spec = pickHueAndSat(layer, 0.1, influence, 'bulge')
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

    const layer = assignLayer(Math.random(), influence)
    const props = layerProperties(layer, influence)
    const spec = pickHueAndSat(layer, distFactor, influence, 'elliptical')

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

    const layer = assignLayer(Math.random(), influence)
    const props = layerProperties(layer, influence)

    const spec = pickHueAndSat(layer, distFactor * 0.2, influence, 'default')
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

    const layer = assignLayer(Math.random(), influence)
    const props = layerProperties(layer, influence)
    const spec = pickHueAndSat(layer, distFactor, influence, 'arm')

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

  // Apply dust extinction to all stars
  for (const star of stars) {
    const x = Math.cos(star.angle) * star.radius
    const z = Math.sin(star.angle) * star.radius
    const ext = computeDustExtinction(x, star.y, z, params)
    // Modulate brightness by average extinction
    star.brightness *= (ext.r + ext.g + ext.b) / 3
    // Shift hue toward red when heavily extincted
    if (ext.b < 0.5) {
      star.hue = star.hue * 0.5 + 15 * 0.5
      star.sat = Math.min(star.sat + 0.2, 1.0)
    }
  }

  return applyCentralClearZone(stars, params)
}
