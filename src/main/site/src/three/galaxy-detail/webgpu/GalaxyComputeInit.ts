// @ts-nocheck — TSL node types have complex overloads that don't resolve correctly
// with generic UniformNode/StorageBufferNode types. Runtime behavior is correct.
/**
 * GPU Compute Shader — Galaxy Star Generation (runs once)
 *
 * Replaces CPU-side GalaxyGenerator.ts with a single compute shader
 * that initializes all star positions, colors, sizes, and velocities on the GPU.
 *
 * Supports all 5 morphology types: spiral, barred, lenticular, elliptical, irregular.
 */

import {
  abs,
  instancedArray,
  instanceIndex,
  vec2,
  vec3,
  vec4,
  float,
  Fn,
  If,
  max,
  min,
  pow,
  sin,
  cos,
  floor,
  fract,
  clamp,
  atan,
  sqrt,
  uniform,
  mix,
  smoothstep,
} from 'three/tsl'
import * as THREE from 'three'
import type { GalaxyRenderParams } from '../morphology'
import { deriveBandInfluenceConfig } from '../bandInfluence'
import { hash, hslToRgb, kelvinToRgb, fbmNoise2d } from './tsl-helpers'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface GalaxyBuffers {
  positionBuffer: any
  originalPositionBuffer: any
  velocityBuffer: any
  colorBuffer: any
  sizeBuffer: any
  layerBuffer: any
  foregroundAlphaBuffer: any
}

export interface GalaxyUniforms {
  // Spiral/barred params
  numArms: any
  armWidth: any
  spiralTightness: any
  spiralStart: any
  bulgeRadius: any
  fieldStarFraction: any
  irregularity: any
  // Barred params
  barLength: any
  barWidth: any
  // Elliptical
  axisRatio: any
  ellipticity: any
  // Lenticular
  bulgeFraction: any
  diskThickness: any
  // Irregular
  clumpCount: any
  // Common
  galaxyRadius: any
  galaxySeed: any
  bandArmScatterScale: any
  bandBulgeBoost: any
  bandClumpBoost: any
  bandHotMix: any
  bandDustMix: any
  bandDiskThicknessScale: any
  bandDustLaneStrength: any
  coreWeight: any
  midDiskWeight: any
  outerDiskWeight: any
  peakAzimuthAngleA: any
  peakAzimuthAngleB: any
  peakAzimuthStrength: any
  projectedAxisRatio: any
  projectedAngle: any
  projectedStrength: any
  // Compute state
  time: any
  deltaTime: any
  rotationSpeed: any
  // Mouse interaction
  mouse: any
  mouseActive: any
  mouseForce: any
  mouseRadius: any
  // Dust extinction
  dustStrength: any
  dustArmBoost: any
  // Fake orbit lifecycle
  orbitCycleDuration: any
  orbitFadeIn: any
  orbitFadeOut: any
}

// ─── Create buffers ────────────────────────────────────────────────────────

export function createGalaxyBuffers(count: number): GalaxyBuffers {
  return {
    positionBuffer: instancedArray(count, 'vec3'),
    originalPositionBuffer: instancedArray(count, 'vec3'),
    velocityBuffer: instancedArray(count, 'vec3'),
    colorBuffer: instancedArray(count, 'vec4'),
    sizeBuffer: instancedArray(count, 'float'),
    layerBuffer: instancedArray(count, 'float'), // 0=star, 1=bright
    foregroundAlphaBuffer: instancedArray(count, 'float'),
  }
}

// ─── Create uniforms ───────────────────────────────────────────────────────

export function createGalaxyUniforms(params: GalaxyRenderParams): GalaxyUniforms {
  const uniforms: GalaxyUniforms = {
    numArms: uniform(0),
    armWidth: uniform(0),
    spiralTightness: uniform(0),
    spiralStart: uniform(0),
    bulgeRadius: uniform(0),
    fieldStarFraction: uniform(0),
    irregularity: uniform(0),
    barLength: uniform(0),
    barWidth: uniform(0),
    axisRatio: uniform(1),
    ellipticity: uniform(0),
    bulgeFraction: uniform(0),
    diskThickness: uniform(0),
    clumpCount: uniform(0),
    galaxyRadius: uniform(0),
    galaxySeed: uniform(0),
    bandArmScatterScale: uniform(1),
    bandBulgeBoost: uniform(0),
    bandClumpBoost: uniform(0),
    bandHotMix: uniform(0.5),
    bandDustMix: uniform(0.5),
    bandDiskThicknessScale: uniform(1),
    bandDustLaneStrength: uniform(0),
    coreWeight: uniform(1),
    midDiskWeight: uniform(1),
    outerDiskWeight: uniform(1),
    peakAzimuthAngleA: uniform(0),
    peakAzimuthAngleB: uniform(Math.PI),
    peakAzimuthStrength: uniform(0),
    projectedAxisRatio: uniform(1),
    projectedAngle: uniform(0),
    projectedStrength: uniform(0),
    time: uniform(0),
    deltaTime: uniform(0.016),
    rotationSpeed: uniform(0.033),
    mouse: uniform(new THREE.Vector3(0, 0, 0)),
    mouseActive: uniform(0.0),
    mouseForce: uniform(7.0),
    mouseRadius: uniform(params.galaxyRadius * 0.3),
    dustStrength: uniform(0),
    dustArmBoost: uniform(0),
    orbitCycleDuration: uniform(60.0),
    orbitFadeIn: uniform(0.08),
    orbitFadeOut: uniform(0.08),
  }
  syncGalaxyUniforms(uniforms, params)
  return uniforms
}

/**
 * Synchronizes the mutable WebGPU uniform set with the latest render params.
 */
export function syncGalaxyUniforms(
  uniforms: GalaxyUniforms,
  params: GalaxyRenderParams,
): void {
  const m = params.morphology
  const influence = deriveBandInfluenceConfig(params.bandProfile)

  uniforms.numArms.value = m.numArms
  uniforms.armWidth.value = m.armWidth * params.galaxyRadius
  uniforms.spiralTightness.value = m.spiralTightness
  uniforms.spiralStart.value = m.spiralStart
  uniforms.bulgeRadius.value = m.bulgeRadius * params.galaxyRadius
  uniforms.fieldStarFraction.value = m.fieldStarFraction
  uniforms.irregularity.value = m.irregularity
  uniforms.barLength.value = m.barLength * params.galaxyRadius
  uniforms.barWidth.value = m.barWidth * params.galaxyRadius
  uniforms.axisRatio.value = m.axisRatio
  uniforms.ellipticity.value = m.ellipticity
  uniforms.bulgeFraction.value = m.bulgeFraction
  uniforms.diskThickness.value = m.diskThickness
  uniforms.clumpCount.value = m.clumpCount
  uniforms.galaxyRadius.value = params.galaxyRadius
  uniforms.galaxySeed.value = params.starCount * 0.61803398875
  uniforms.bandArmScatterScale.value = influence.armScatterScale
  uniforms.bandBulgeBoost.value = influence.bulgeBoost
  uniforms.bandClumpBoost.value = influence.clumpBoost
  uniforms.bandHotMix.value = influence.hotMix
  uniforms.bandDustMix.value = influence.dustMix
  uniforms.bandDiskThicknessScale.value = influence.diskThicknessScale
  uniforms.bandDustLaneStrength.value = influence.dustLaneStrength
  uniforms.coreWeight.value = influence.coreWeight
  uniforms.midDiskWeight.value = influence.midDiskWeight
  uniforms.outerDiskWeight.value = influence.outerDiskWeight
  uniforms.peakAzimuthAngleA.value = influence.peakAzimuthAngleA
  uniforms.peakAzimuthAngleB.value = influence.peakAzimuthAngleB
  uniforms.peakAzimuthStrength.value = influence.peakAzimuthStrength
  uniforms.projectedAxisRatio.value = influence.projectedAxisRatio
  uniforms.projectedAngle.value = influence.projectedAngle
  uniforms.projectedStrength.value = influence.projectedStrength
  uniforms.dustStrength.value = m.dustStrength
  uniforms.dustArmBoost.value = m.dustArmBoost
  uniforms.mouseRadius.value = params.galaxyRadius * 0.3
}

// ─── Compute init shader ───────────────────────────────────────────────────

const TAU = 6.28318530718

/**
 * Samples the coarse radial density guidance extracted from the band profile.
 */
function sampleRadialGuidance(radiusNorm: any, uniforms: GalaxyUniforms): any {
  const coreToMid = smoothstep(float(0.18), float(0.38), radiusNorm)
  const midToOuter = smoothstep(float(0.58), float(0.82), radiusNorm)
  const innerBlend = mix(uniforms.coreWeight, uniforms.midDiskWeight, coreToMid)
  return mix(innerBlend, uniforms.outerDiskWeight, midToOuter)
}

/**
 * Measures how strongly an angle aligns with the dominant observed azimuthal
 * sectors extracted from the band profile.
 */
function sampleAzimuthGuidance(angle: any, uniforms: GalaxyUniforms): any {
  const affinityA = cos(angle.sub(uniforms.peakAzimuthAngleA)).mul(0.5).add(0.5)
  const affinityB = cos(angle.sub(uniforms.peakAzimuthAngleB)).mul(0.5).add(0.5)
  return max(affinityA, affinityB)
}

/**
 * Applies the observed projected ellipse to the generated XZ footprint while
 * keeping the local texture guidance already baked into the particle layout.
 */
function applyProjectedSilhouette(position: any, uniforms: GalaxyUniforms): any {
  const c = cos(uniforms.projectedAngle)
  const s = sin(uniforms.projectedAngle)
  const major = position.x.mul(c).add(position.z.mul(s))
  const minor = position.z.mul(c).sub(position.x.mul(s))
  const minorScale = mix(float(1), uniforms.projectedAxisRatio, uniforms.projectedStrength)
  const shapedMinor = minor.mul(minorScale)

  return vec3(
    major.mul(c).sub(shapedMinor.mul(s)),
    position.y,
    major.mul(s).add(shapedMinor.mul(c)),
  )
}

export function createComputeInit(
  count: number,
  buffers: GalaxyBuffers,
  uniforms: GalaxyUniforms,
) {
  const computeInit = Fn(() => {
    const idx = instanceIndex
    const seed = idx.toFloat()

    const R = uniforms.galaxyRadius
    const clearRadius = R.mul(0.06) // central exclusion zone

    // ─── Layer assignment: star ~94%, bright ~6% (no dust layer) ──────
    const brightFraction = mix(
      float(0.04),
      float(0.08),
      clamp(uniforms.bandHotMix.mul(0.7).add(uniforms.bandClumpBoost.mul(0.3)), float(0), float(1)),
    )

    const layerRoll = hash(seed.add(100))
    // 0=star, 1=bright (no dust layer)
    const layerVal = float(0).toVar()
    If(layerRoll.greaterThan(float(1).sub(brightFraction)), () => {
      layerVal.assign(1) // bright
    })
    buffers.layerBuffer.element(idx).assign(layerVal)

    // ─── Layer-dependent size ──────────────────────────────────────────
    const sizeRand = hash(seed.add(200))
    const starSize = float(0).toVar()
    If(layerVal.equal(0), () => {
      starSize.assign(sizeRand.mul(3.0).add(1.5)) // star: 1.5-4.5
    }).Else(() => {
      starSize.assign(sizeRand.mul(6.0).add(4.0).mul(mix(float(0.9), float(1.4), uniforms.bandHotMix))) // bright: 4-10
    })
    buffers.sizeBuffer.element(idx).assign(starSize)

    // ─── Layer-dependent brightness/alpha ──────────────────────────────
    const brightRand = hash(seed.add(300))
    const alphaRand = hash(seed.add(400))
    const brightness = float(0).toVar()
    const alpha = float(0).toVar()
    If(layerVal.equal(0), () => {
      brightness.assign(brightRand.mul(0.4).add(0.32).mul(mix(float(0.95), float(1.15), uniforms.bandHotMix)))
      alpha.assign(alphaRand.mul(0.4).add(0.4))
    }).Else(() => {
      brightness.assign(brightRand.mul(0.16).add(0.64).mul(mix(float(0.95), float(1.25), uniforms.bandHotMix)))
      alpha.assign(alphaRand.mul(0.24).add(0.56).mul(mix(float(0.95), float(1.2), uniforms.bandClumpBoost)))
    })

    // ─── Position generation (morphology-dependent) ────────────────────
    const posX = float(0).toVar()
    const posY = float(0).toVar()
    const posZ = float(0).toVar()
    const distFactor = float(0).toVar()
    const spiralRole = float(-1).toVar()
    const radialGuidance = float(1).toVar()
    const azimuthGuidance = float(0).toVar()

    // ─── SPIRAL / BARRED (numArms > 0) ────────────────────────────────
    // Each star is either an arm star, bulge star, or field star
    If(uniforms.numArms.greaterThan(0), () => {
      // Spiral or barred spiral — same arm generation
      const roleRoll = hash(seed.add(500))

      // Determine if this star is a bulge star, field star, or arm star
      const bulgeR = uniforms.bulgeRadius
      const bulgeFrac = min(float(0.25), float(0.10).add(float(0.20).mul(bulgeR.div(R))))
      const fieldFrac = uniforms.fieldStarFraction

      If(roleRoll.lessThan(bulgeFrac), () => {
        spiralRole.assign(0)
        // ─── Bulge star ───────────────────────────────────────────
        const r = pow(hash(seed.add(10)), float(0.6)).mul(bulgeR)
        const theta = hash(seed.add(11)).mul(TAU)
        const y = hash(seed.add(12)).sub(0.5).mul(bulgeR).mul(0.5)
        posX.assign(cos(theta).mul(r))
        posY.assign(y)
        posZ.assign(sin(theta).mul(r))
        distFactor.assign(r.div(bulgeR).mul(0.3)) // bulge always inner colors
        radialGuidance.assign(uniforms.coreWeight)
      }).ElseIf(roleRoll.lessThan(bulgeFrac.add(fieldFrac)), () => {
        spiralRole.assign(1)
        // ─── Field star ───────────────────────────────────────────
        const r = sqrt(hash(seed.add(20))).mul(R)
        const theta = hash(seed.add(21)).mul(TAU)
        const y = hash(seed.add(22)).sub(0.5).mul(R).mul(0.08)
        posX.assign(cos(theta).mul(r))
        posY.assign(y)
        posZ.assign(sin(theta).mul(r))
        distFactor.assign(r.div(R))
        radialGuidance.assign(sampleRadialGuidance(distFactor, uniforms))
      }).Else(() => {
        spiralRole.assign(2)
        // ─── Arm star (spiral pattern) ────────────────────────────
        // Parameterize by RADIUS (not theta) for even density distribution,
        // but start the annulus where the spiral actually begins. Otherwise,
        // r < spiralStart forces theta to 0 and creates a bright inner stripe.
        const numA = uniforms.numArms
        const armI = floor(hash(seed.add(30)).mul(numA))
        const armOffset = armI.mul(TAU).div(numA)

        const spiralStartR = max(uniforms.spiralStart.mul(R), float(0.001))
        const barMinR = uniforms.barLength.mul(0.5)
        const minArmR = min(
          max(spiralStartR, barMinR),
          R.mul(0.98),
        )

        // Area-uniform annulus sampling prevents inner-arm collapse and keeps
        // barred spirals from leaking arm particles into the bar zone.
        const rHash = hash(seed.add(31))
        const armR = sqrt(
          rHash.mul(R.mul(R).sub(minArmR.mul(minArmR))).add(minArmR.mul(minArmR)),
        )
        const normalizedArmR = armR.div(R)
        const radiusWeight = sampleRadialGuidance(normalizedArmR, uniforms)
        radialGuidance.assign(radiusWeight)

        // Derive spiral angle from logarithmic spiral: r = a * exp(b * theta)
        // Solved: theta = ln(r/a) / b. Winding factor scales up wraps within R.
        const windingFactor = float(2.5)
        const theta = max(armR.div(spiralStartR), float(1.0)).log()
          .div(max(uniforms.spiralTightness, float(0.001)))
          .mul(windingFactor)

        // Scatter perpendicular to arm — widens with radius for realism
        const scatterScale = armR.div(R).mul(0.5).add(0.5)
        const scatter = hash(seed.add(32)).sub(0.5).add(hash(seed.add(33)).sub(0.5))
          .mul(uniforms.armWidth).mul(scatterScale).mul(uniforms.bandArmScatterScale)
        const irr = uniforms.irregularity.mul(hash(seed.add(35)).sub(0.5)).mul(30)

        // Angular scatter along arm direction — breaks up the dense radial
        // concentration at spiral starts that creates visible straight lines
        const angleScatter = hash(seed.add(34)).sub(0.5).mul(0.3)
        const baseAngle = theta.add(armOffset).add(angleScatter)
        const peakA = cos(baseAngle.sub(uniforms.peakAzimuthAngleA)).mul(0.5).add(0.5)
        const peakB = cos(baseAngle.sub(uniforms.peakAzimuthAngleB)).mul(0.5).add(0.5)
        const peakAffinity = max(peakA, peakB)
        azimuthGuidance.assign(peakAffinity)
        const peakPull = sin(uniforms.peakAzimuthAngleA.sub(baseAngle)).mul(peakA)
          .add(sin(uniforms.peakAzimuthAngleB.sub(baseAngle)).mul(peakB))
          .mul(uniforms.peakAzimuthStrength)
          .mul(0.22)
        const guidedAngle = baseAngle.add(peakPull)
        const scatterAngle = guidedAngle.add(float(Math.PI / 2))
        const radialScale = mix(
          float(0.86),
          float(1.18),
          clamp(radiusWeight.sub(0.55).div(1.3), float(0), float(1)),
        )
        const guidedArmR = clamp(armR.mul(radialScale), minArmR, R)
        const guidedScatter = scatter.mul(
          mix(
            float(1.3),
            float(0.42),
            peakAffinity.mul(uniforms.peakAzimuthStrength),
          ),
        )

        const x = cos(guidedAngle).mul(guidedArmR.add(irr))
          .add(cos(scatterAngle).mul(guidedScatter))
        const z = sin(guidedAngle).mul(guidedArmR.add(irr))
          .add(sin(scatterAngle).mul(guidedScatter))
        const t = guidedArmR.div(R)
        const thickness = R.mul(0.06).mul(float(1).sub(t.mul(0.7))).mul(uniforms.bandDiskThicknessScale)
        const y = hash(seed.add(36)).sub(0.5).mul(thickness)

        posX.assign(x)
        posY.assign(y)
        posZ.assign(z)

        const actualR = sqrt(x.mul(x).add(z.mul(z)))
        distFactor.assign(actualR.div(R))
      })

      // For barred spirals, add bar stars by re-using some arm stars
      If(uniforms.barLength.greaterThan(0), () => {
        const barRoll = hash(seed.add(600))
        If(barRoll.lessThan(0.25), () => {
          // Convert this to a bar star
          const barLen = uniforms.barLength
          const barW = uniforms.barWidth
          const along = hash(seed.add(40)).sub(0.5).mul(2).mul(barLen)
          const across = hash(seed.add(41)).sub(0.5).mul(barW)
          posX.assign(along)
          posY.assign(hash(seed.add(42)).sub(0.5).mul(R).mul(0.04))
          posZ.assign(across)
          distFactor.assign(float(0.1))
        })
      })
    })

    // ─── LENTICULAR: smooth oblate spheroid (lens shape) ────────────
    // Single continuous distribution — thick at center (bulge), thinning
    // to edges (disk). No separate bulge/disk split avoids visible gaps.
    If(uniforms.numArms.equal(0)
      .and(uniforms.barLength.equal(0))
      .and(uniforms.clumpCount.equal(0))
      .and(uniforms.ellipticity.equal(0))
      .and(uniforms.bulgeFraction.greaterThan(0)), () => {
      const bulgeR = uniforms.bulgeRadius

      // Smooth radial profile: centrally concentrated power-law
      const r = pow(hash(seed.add(10)), float(0.55)).mul(R)
      const theta = hash(seed.add(11)).mul(TAU)
      const df = r.div(R)

      // Lens-shaped vertical profile: thick at center, thin at edge
      const thickness = R.mul(0.06).mul(pow(max(float(1).sub(df), float(0)), float(2))).mul(uniforms.bandDiskThicknessScale)
      const y = hash(seed.add(12)).sub(0.5).mul(thickness)

      posX.assign(cos(theta).mul(r))
      posY.assign(y)
      posZ.assign(sin(theta).mul(r))

      // Bulge region: brightness and size boost for prominent center
      const bulgeBlend = clamp(float(1).sub(r.div(max(bulgeR, float(1)))), float(0), float(1))
      const boost = float(1).add(bulgeBlend.mul(0.4)).add(uniforms.bandBulgeBoost.mul(0.25))
      brightness.assign(min(brightness.mul(boost), float(0.95)))
      alpha.assign(min(alpha.mul(boost), float(0.95)))
      starSize.assign(starSize.mul(float(1).add(bulgeBlend.mul(0.3))))

      distFactor.assign(df.mul(0.2))
      radialGuidance.assign(sampleRadialGuidance(df, uniforms))
    })

    // ─── ELLIPTICAL (ellipticity > 0) ──────────────────────────────────
    If(uniforms.ellipticity.greaterThan(0), () => {
      const ar = uniforms.axisRatio
      const r = pow(hash(seed.add(10)), float(0.4)).mul(R)
      const theta = hash(seed.add(11)).mul(TAU)
      const x = r.mul(cos(theta))
      const z = r.mul(sin(theta)).mul(ar)
      const dRatio = sqrt(x.mul(x).add(z.mul(z))).div(R)
      const y = hash(seed.add(12)).sub(0.5).mul(R).mul(0.1).mul(float(1).sub(dRatio.mul(0.5)))
      posX.assign(x)
      posY.assign(y)
      posZ.assign(z)
      distFactor.assign(dRatio)
      radialGuidance.assign(sampleRadialGuidance(dRatio, uniforms))
    })

    // ─── IRREGULAR (clumpCount > 0) ────────────────────────────────────
    If(uniforms.clumpCount.greaterThan(0), () => {
      const irr = uniforms.irregularity
      const nClumps = uniforms.clumpCount

      // Decide if clumped or scattered
      const clumpRoll = hash(seed.add(500))
      If(clumpRoll.greaterThan(irr), () => {
        // Clumped star: pick a clump center deterministically
        const clumpIdx = floor(hash(seed.add(50)).mul(nClumps))
        // Each clump has a deterministic position based on clump index
        const clumpAngle = clumpIdx.div(nClumps).mul(TAU).add(hash(clumpIdx.add(1000)).mul(0.5))
        const clumpR = hash(clumpIdx.add(2000)).mul(0.6).add(0.2).mul(R)
        const cx = cos(clumpAngle).mul(clumpR)
        const cz = sin(clumpAngle).mul(clumpR)
        const sigma = hash(clumpIdx.add(3000)).mul(80).add(30)
          .mul(mix(float(1.05), float(0.7), uniforms.bandClumpBoost))
        // Gaussian-ish scatter
        const gx = hash(seed.add(51)).sub(0.5).add(hash(seed.add(52)).sub(0.5)).mul(2)
        const gz = hash(seed.add(53)).sub(0.5).add(hash(seed.add(54)).sub(0.5)).mul(2)
        posX.assign(cx.add(gx.mul(sigma)))
        posZ.assign(cz.add(gz.mul(sigma)))
      }).Else(() => {
        // Scattered star
        const angle = hash(seed.add(60)).mul(TAU)
        const r = sqrt(hash(seed.add(61))).mul(R)
        posX.assign(cos(angle).mul(r).add(hash(seed.add(62)).sub(0.5).mul(60)))
        posZ.assign(sin(angle).mul(r).add(hash(seed.add(63)).sub(0.5).mul(60)))
      })
      posY.assign(hash(seed.add(70)).sub(0.5).mul(R).mul(0.12))
      distFactor.assign(sqrt(posX.mul(posX).add(posZ.mul(posZ))).div(R))
      radialGuidance.assign(sampleRadialGuidance(distFactor, uniforms))
    })

    If(spiralRole.equal(0), () => {
      const bulgeBoost = mix(
        float(1.0),
        uniforms.coreWeight.mul(0.55).add(0.45),
        uniforms.bandBulgeBoost,
      )
      brightness.assign(min(brightness.mul(bulgeBoost), float(0.98)))
      alpha.assign(min(alpha.mul(bulgeBoost), float(0.98)))
      starSize.assign(starSize.mul(mix(float(1.0), float(1.35), uniforms.bandBulgeBoost)))
    }).ElseIf(spiralRole.equal(1), () => {
      const fieldSuppression = mix(float(1.0), float(0.62), uniforms.peakAzimuthStrength)
      brightness.assign(brightness.mul(fieldSuppression))
      alpha.assign(alpha.mul(mix(float(1.0), float(0.8), uniforms.peakAzimuthStrength)))
    }).ElseIf(spiralRole.equal(2), () => {
      const segmentBoost = mix(
        float(0.72),
        float(1.48),
        azimuthGuidance.mul(uniforms.peakAzimuthStrength),
      )
      const radialBoost = mix(
        float(0.78),
        float(1.34),
        clamp(radialGuidance.sub(0.55).div(1.3), float(0), float(1)),
      )
      brightness.assign(min(brightness.mul(segmentBoost).mul(radialBoost), float(0.98)))
      alpha.assign(min(alpha.mul(segmentBoost), float(0.98)))
      starSize.assign(
        starSize.mul(
          mix(float(0.92), float(1.4), azimuthGuidance.mul(uniforms.peakAzimuthStrength)),
        ),
      )
    })

    const shapedPosition = applyProjectedSilhouette(vec3(posX, posY, posZ), uniforms)
    posX.assign(shapedPosition.x)
    posY.assign(shapedPosition.y)
    posZ.assign(shapedPosition.z)
    distFactor.assign(min(sqrt(posX.mul(posX).add(posZ.mul(posZ))).div(R), float(1)))

    // ─── Central clear zone: push stars outside exclusion radius ───────
    const actualR = sqrt(posX.mul(posX).add(posZ.mul(posZ)))
    If(actualR.lessThan(clearRadius), () => {
      // Redistribute to just outside clearRadius
      const angle = atan(posZ, posX)
      const newR = clearRadius.add(hash(seed.add(800)).mul(R.mul(0.1)))
      posX.assign(cos(angle).mul(newR))
      posZ.assign(sin(angle).mul(newR))
    })

    const position = vec3(posX, posY, posZ)
    buffers.positionBuffer.element(idx).assign(position)
    buffers.originalPositionBuffer.element(idx).assign(position)

    // ─── Color: population-aware spectral class system ───────────────────
    // Population distributions vary by role (from codetard's analysis):
    //   Arm stars:  56% M/K, 24% F/G, 16% OBA, 4% red giant → bluer arms
    //   Field:      78% M/K, 17% F/G, 3% OBA, 2% red giant → redder inter-arm
    //   Bulge:      68% M/K, 12% F/G, 1% OBA, 19% red giant → warm center
    //   Elliptical: 74% M/K, 11% F/G, 0.5% OBA, 14.5% red giant → old pop
    // HSL output is the proven system that works with the glow shader.
    const hueRand = hash(seed.add(900))
    const hueSpread = hash(seed.add(901))
    const typeRand = hash(seed.add(902))
    const hue = float(0).toVar()
    const sat = float(0).toVar()
    const light = float(0).toVar()

    // Population cumulative thresholds (vary by role)
    const pMK = float(0.72).toVar()
    const pFG = float(0.20).toVar()
    const pOBA = float(0.065).toVar()
    // Red giant = remainder

    If(spiralRole.equal(2), () => {
      // Arm star: bluer population — needs more blue to cut through glow shader white mix
      pMK.assign(0.46)
      pFG.assign(0.20)
      pOBA.assign(0.26)
    }).ElseIf(spiralRole.equal(1), () => {
      // Field star: redder population
      pMK.assign(0.78)
      pFG.assign(0.17)
      pOBA.assign(0.03)
    }).ElseIf(spiralRole.equal(0), () => {
      // Bulge star: old population, many red giants
      pMK.assign(0.68)
      pFG.assign(0.12)
      pOBA.assign(0.01)
    })

    // Elliptical override
    If(uniforms.ellipticity.greaterThan(0), () => {
      pMK.assign(0.74)
      pFG.assign(0.11)
      pOBA.assign(0.005)
    })

    const cumMK = pMK
    const cumFG = pMK.add(pFG)
    const cumOBA = cumFG.add(pOBA)

    // Select spectral class from population, assign proven HSL values
    If(typeRand.lessThan(cumMK), () => {
      // M/K dwarf: red-orange (10° ±4°, high sat)
      hue.assign(float(0.028).add(hueSpread.sub(0.5).mul(0.022)))
      sat.assign(0.85)
    }).ElseIf(typeRand.lessThan(cumFG), () => {
      // F/G star: split between K-orange and G-yellow
      If(hueRand.lessThan(float(0.4)), () => {
        hue.assign(float(0.069).add(hueSpread.sub(0.5).mul(0.022))) // K: 25° ±4°
        sat.assign(0.60)
      }).Else(() => {
        hue.assign(float(0.133).add(hueSpread.sub(0.5).mul(0.014))) // G: 48° ±2.5°
        sat.assign(0.22)
      })
    }).ElseIf(typeRand.lessThan(cumOBA), () => {
      // Split OBA into blue-white (A/B) and hot blue (O)
      If(hueRand.lessThan(float(0.55)), () => {
        // A/B: blue-white (215° ±7.5°)
        hue.assign(float(0.597).add(hueSpread.sub(0.5).mul(0.042)))
        sat.assign(0.28)
      }).Else(() => {
        // O: visibly blue (225° ±5°, high sat to cut through glow white)
        hue.assign(float(0.625).add(hueSpread.sub(0.5).mul(0.028)))
        sat.assign(0.50)
      })
    }).Else(() => {
      // Red giant: warm orange-red (15° ±6°, prominent)
      hue.assign(float(0.042).add(hueSpread.sub(0.5).mul(0.033)))
      sat.assign(0.70)
    })

    light.assign(brightness.mul(0.6))

    // Bright layer: override with luminous extremes
    If(layerVal.equal(1), () => {
      If(hueRand.lessThan(float(0.6)), () => {
        // Red giant (10-45°)
        hue.assign(hueRand.div(0.6).mul(0.097).add(0.028))
        sat.assign(0.50)
      }).Else(() => {
        // Blue OB (200-230°)
        hue.assign(hueRand.sub(0.6).div(0.4).mul(0.083).add(0.556))
        sat.assign(0.35)
      })
      light.assign(brightness.mul(0.85))
    })

    const rgb = hslToRgb(hue, sat, light)

    // ─── Dust extinction: wavelength-dependent absorption ──────────────
    const extinctedRgb = vec3(rgb.x, rgb.y, rgb.z).toVar()

    If(uniforms.dustStrength.greaterThan(0), () => {
      const absY = abs(posY)
      const radialR = sqrt(posX.mul(posX).add(posZ.mul(posZ)))
      const radialScale = R.mul(0.34)
      const verticalScale = R.mul(0.06).mul(0.18)

      const radialExt = float(0).sub(radialR.div(max(radialScale, float(0.01)))).exp()
      const verticalExt = float(0).sub(absY.div(max(verticalScale, float(0.01)))).exp()
      const baseExt = radialExt.mul(verticalExt)

      // Suppress inside bulge core
      const bulgeSuppress = smoothstep(
        uniforms.bulgeRadius.mul(0.4),
        uniforms.bulgeRadius.mul(1.2),
        radialR,
      )

      // Spiral arm dust boost
      const armDust = float(0).toVar()
      If(uniforms.numArms.greaterThan(0).and(uniforms.dustArmBoost.greaterThan(0)), () => {
        const starAngle = atan(posZ, posX)
        const armSigma = uniforms.armWidth.div(R).mul(0.5)
        const spiralStartR = max(uniforms.spiralStart.mul(R), float(0.001))

        const bestArmScore = float(0).toVar()
        // Unrolled loop checking up to 6 arms
        const checkArm = (armIdx: number) => {
          If(uniforms.numArms.greaterThan(armIdx), () => {
            const armPhase = float(armIdx).mul(TAU).div(uniforms.numArms)
            const expectedAngle = max(radialR.div(spiralStartR), float(1.0)).log()
              .div(max(uniforms.spiralTightness, float(0.001)))
              .mul(2.5)
              .add(armPhase)
            const angDist = starAngle.sub(expectedAngle).toVar()
            angDist.assign(angDist.sub(floor(angDist.div(TAU).add(0.5)).mul(TAU)))
            const armScore = float(0).sub(angDist.mul(angDist).div(armSigma.mul(armSigma).mul(2))).exp()
            bestArmScore.assign(max(bestArmScore, armScore))
          })
        }
        checkArm(0)
        checkArm(1)
        checkArm(2)
        checkArm(3)
        checkArm(4)
        checkArm(5)
        armDust.assign(bestArmScore.mul(uniforms.dustArmBoost))
      })

      // FBM noise for clumpiness
      const noiseScale = float(8).div(max(R, float(1)))
      const dustNoise = fbmNoise2d(vec2(posX.mul(noiseScale), posZ.mul(noiseScale)))

      const extinction = uniforms.dustStrength
        .mul(baseExt)
        .mul(bulgeSuppress)
        .mul(float(1).add(armDust))
        .mul(dustNoise)

      // Wavelength-dependent: red least absorbed, blue most
      extinctedRgb.x.assign(rgb.x.mul(float(0).sub(extinction.mul(0.65)).exp()))
      extinctedRgb.y.assign(rgb.y.mul(float(0).sub(extinction.mul(0.9)).exp()))
      extinctedRgb.z.assign(rgb.z.mul(float(0).sub(extinction.mul(1.2)).exp()))
    })

    buffers.colorBuffer.element(idx).assign(vec4(extinctedRgb.x, extinctedRgb.y, extinctedRgb.z, alpha))

    // Store base alpha in velocity buffer x-channel (velocity not used for physics)
    buffers.velocityBuffer.element(idx).assign(vec3(alpha, 0, 0))
  })().compute(count)

  return computeInit
}
