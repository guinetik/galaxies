/**
 * GPU Compute Shader — Galaxy Star Generation (runs once)
 *
 * Replaces CPU-side GalaxyGenerator.ts with a single compute shader
 * that initializes all star positions, colors, sizes, and velocities on the GPU.
 *
 * Supports all 5 morphology types: spiral, barred, lenticular, elliptical, irregular.
 */

import {
  instancedArray,
  instanceIndex,
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
} from 'three/tsl'
import * as THREE from 'three'
import type { GalaxyRenderParams } from '../morphology'
import { hash, hslToRgb } from './tsl-helpers'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface GalaxyBuffers {
  positionBuffer: ReturnType<typeof instancedArray>
  originalPositionBuffer: ReturnType<typeof instancedArray>
  velocityBuffer: ReturnType<typeof instancedArray>
  colorBuffer: ReturnType<typeof instancedArray>
  sizeBuffer: ReturnType<typeof instancedArray>
  layerBuffer: ReturnType<typeof instancedArray>
}

export interface GalaxyUniforms {
  // Spiral/barred params
  numArms: ReturnType<typeof uniform>
  armWidth: ReturnType<typeof uniform>
  spiralTightness: ReturnType<typeof uniform>
  spiralStart: ReturnType<typeof uniform>
  bulgeRadius: ReturnType<typeof uniform>
  fieldStarFraction: ReturnType<typeof uniform>
  irregularity: ReturnType<typeof uniform>
  // Barred params
  barLength: ReturnType<typeof uniform>
  barWidth: ReturnType<typeof uniform>
  // Elliptical
  axisRatio: ReturnType<typeof uniform>
  ellipticity: ReturnType<typeof uniform>
  // Lenticular
  bulgeFraction: ReturnType<typeof uniform>
  diskThickness: ReturnType<typeof uniform>
  // Irregular
  clumpCount: ReturnType<typeof uniform>
  // Common
  galaxyRadius: ReturnType<typeof uniform>
  galaxySeed: ReturnType<typeof uniform>
  // Compute state
  time: ReturnType<typeof uniform>
  deltaTime: ReturnType<typeof uniform>
  rotationSpeed: ReturnType<typeof uniform>
  // Mouse interaction
  mouse: ReturnType<typeof uniform>
  mouseActive: ReturnType<typeof uniform>
  mouseForce: ReturnType<typeof uniform>
  mouseRadius: ReturnType<typeof uniform>
}

// ─── Create buffers ────────────────────────────────────────────────────────

export function createGalaxyBuffers(count: number): GalaxyBuffers {
  return {
    positionBuffer: instancedArray(count, 'vec3'),
    originalPositionBuffer: instancedArray(count, 'vec3'),
    velocityBuffer: instancedArray(count, 'vec3'),
    colorBuffer: instancedArray(count, 'vec4'),
    sizeBuffer: instancedArray(count, 'float'),
    layerBuffer: instancedArray(count, 'float'), // 0=dust, 1=star, 2=bright
  }
}

// ─── Create uniforms ───────────────────────────────────────────────────────

export function createGalaxyUniforms(params: GalaxyRenderParams): GalaxyUniforms {
  const m = params.morphology

  return {
    numArms: uniform(m.numArms),
    armWidth: uniform(m.armWidth * params.galaxyRadius),
    spiralTightness: uniform(m.spiralTightness),
    spiralStart: uniform(m.spiralStart), // keep as fraction, shader multiplies by R
    bulgeRadius: uniform(m.bulgeRadius * params.galaxyRadius),
    fieldStarFraction: uniform(m.fieldStarFraction),
    irregularity: uniform(m.irregularity),
    barLength: uniform(m.barLength * params.galaxyRadius),
    barWidth: uniform(m.barWidth * params.galaxyRadius),
    axisRatio: uniform(m.axisRatio),
    ellipticity: uniform(m.ellipticity),
    bulgeFraction: uniform(m.bulgeFraction),
    diskThickness: uniform(m.diskThickness),
    clumpCount: uniform(m.clumpCount),
    galaxyRadius: uniform(params.galaxyRadius),
    galaxySeed: uniform(params.starCount * 0.61803398875), // golden ratio based seed
    time: uniform(0),
    deltaTime: uniform(0.016),
    rotationSpeed: uniform(0.033),
    mouse: uniform(new THREE.Vector3(0, 0, 0)),
    mouseActive: uniform(0.0),
    mouseForce: uniform(7.0),
    mouseRadius: uniform(params.galaxyRadius * 0.3),
  }
}

// ─── Compute init shader ───────────────────────────────────────────────────

const TAU = 6.28318530718

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

    // ─── Layer assignment: dust 65%, star 32%, bright 3% ───────────────
    const layerRoll = hash(seed.add(100))
    // 0=dust, 1=star, 2=bright
    const layerVal = float(0).toVar()
    If(layerRoll.greaterThan(0.97), () => {
      layerVal.assign(2) // bright
    }).ElseIf(layerRoll.greaterThan(0.65), () => {
      layerVal.assign(1) // star
    })
    buffers.layerBuffer.element(idx).assign(layerVal)

    // ─── Layer-dependent size ──────────────────────────────────────────
    const sizeRand = hash(seed.add(200))
    const starSize = float(0).toVar()
    If(layerVal.equal(0), () => {
      starSize.assign(sizeRand.mul(1.5).add(0.8)) // dust: 0.8-2.3
    }).ElseIf(layerVal.equal(1), () => {
      starSize.assign(sizeRand.mul(3.0).add(1.5)) // star: 1.5-4.5
    }).Else(() => {
      starSize.assign(sizeRand.mul(6.0).add(4.0)) // bright: 4-10
    })
    buffers.sizeBuffer.element(idx).assign(starSize)

    // ─── Layer-dependent brightness/alpha ──────────────────────────────
    const brightRand = hash(seed.add(300))
    const alphaRand = hash(seed.add(400))
    const brightness = float(0).toVar()
    const alpha = float(0).toVar()
    If(layerVal.equal(0), () => {
      brightness.assign(brightRand.mul(0.16).add(0.08)) // dust
      alpha.assign(alphaRand.mul(0.2).add(0.12))
    }).ElseIf(layerVal.equal(1), () => {
      brightness.assign(brightRand.mul(0.4).add(0.32)) // star
      alpha.assign(alphaRand.mul(0.4).add(0.4))
    }).Else(() => {
      brightness.assign(brightRand.mul(0.16).add(0.64)) // bright
      alpha.assign(alphaRand.mul(0.24).add(0.56))
    })

    // ─── Position generation (morphology-dependent) ────────────────────
    const posX = float(0).toVar()
    const posY = float(0).toVar()
    const posZ = float(0).toVar()
    const distFactor = float(0).toVar()

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
        // ─── Bulge star ───────────────────────────────────────────
        const r = pow(hash(seed.add(10)), float(0.6)).mul(bulgeR)
        const theta = hash(seed.add(11)).mul(TAU)
        const y = hash(seed.add(12)).sub(0.5).mul(bulgeR).mul(0.5)
        posX.assign(cos(theta).mul(r))
        posY.assign(y)
        posZ.assign(sin(theta).mul(r))
        distFactor.assign(r.div(bulgeR).mul(0.3)) // bulge always inner colors
      }).ElseIf(roleRoll.lessThan(bulgeFrac.add(fieldFrac)), () => {
        // ─── Field star ───────────────────────────────────────────
        const r = sqrt(hash(seed.add(20))).mul(R)
        const theta = hash(seed.add(21)).mul(TAU)
        const y = hash(seed.add(22)).sub(0.5).mul(R).mul(0.08)
        posX.assign(cos(theta).mul(r))
        posY.assign(y)
        posZ.assign(sin(theta).mul(r))
        distFactor.assign(r.div(R))
      }).Else(() => {
        // ─── Arm star (spiral pattern) ────────────────────────────
        // Parameterize by RADIUS (not theta) for even density distribution.
        // Old approach used theta → exp(theta) for radius, which piles 60%
        // of stars beyond galaxy radius. New approach: pick radius first,
        // then derive spiral angle, keeping all stars within R.
        const numA = uniforms.numArms
        const armI = floor(hash(seed.add(30)).mul(numA))
        const armOffset = armI.mul(TAU).div(numA)

        // Area-uniform radial distribution: sqrt biases toward larger radii
        // to compensate for larger ring circumference at outer radii
        const rHash = hash(seed.add(31))
        const armR = sqrt(rHash).mul(R.mul(0.9)).add(R.mul(0.1))

        // Derive spiral angle from logarithmic spiral: r = a * exp(b * theta)
        // Solved: theta = ln(r/a) / b. Winding factor scales up wraps within R.
        const spiralStartR = max(uniforms.spiralStart.mul(R), float(0.001))
        const windingFactor = float(2.5)
        const theta = max(armR.div(spiralStartR), float(1.0)).log()
          .div(max(uniforms.spiralTightness, float(0.001)))
          .mul(windingFactor)

        // Scatter perpendicular to arm — widens with radius for realism
        const scatterScale = armR.div(R).mul(0.5).add(0.5)
        const scatter = hash(seed.add(32)).sub(0.5).add(hash(seed.add(33)).sub(0.5))
          .mul(uniforms.armWidth).mul(scatterScale)
        const irr = uniforms.irregularity.mul(hash(seed.add(35)).sub(0.5)).mul(30)

        const baseAngle = theta.add(armOffset)
        const scatterAngle = baseAngle.add(float(Math.PI / 2))

        const x = cos(baseAngle).mul(armR.add(irr))
          .add(cos(scatterAngle).mul(scatter))
        const z = sin(baseAngle).mul(armR.add(irr))
          .add(sin(scatterAngle).mul(scatter))
        const t = armR.div(R)
        const thickness = R.mul(0.06).mul(float(1).sub(t.mul(0.7)))
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

    // ─── LENTICULAR (no arms, no bar, no clumps, no ellipticity, but has bulge) ─
    If(uniforms.numArms.equal(0)
      .and(uniforms.barLength.equal(0))
      .and(uniforms.clumpCount.equal(0))
      .and(uniforms.ellipticity.equal(0))
      .and(uniforms.bulgeFraction.greaterThan(0)), () => {
      const bulgeR = uniforms.bulgeRadius
      const bf = uniforms.bulgeFraction
      const roleRoll = hash(seed.add(500))

      If(roleRoll.lessThan(bf), () => {
        // Bulge
        const r = pow(hash(seed.add(10)), float(0.6)).mul(bulgeR)
        const theta = hash(seed.add(11)).mul(TAU)
        const y = hash(seed.add(12)).sub(0.5).mul(bulgeR).mul(0.6)
        posX.assign(cos(theta).mul(r))
        posY.assign(y)
        posZ.assign(sin(theta).mul(r))
        distFactor.assign(r.div(bulgeR).mul(0.3))
      }).Else(() => {
        // Disk — exponential profile
        const scaleLen = R.div(3)
        // Inverse CDF of exponential: -ln(1-u) * scaleLength, clipped
        const u = hash(seed.add(20))
        const r = clamp(
          float(-1).mul(float(1).sub(u.mul(0.95)).max(0.001)).log().mul(scaleLen),
          float(0),
          R,
        )
        const theta = hash(seed.add(21)).mul(TAU)
        const dRatio = r.div(R)
        const thick = R.mul(0.06).mul(0.5).mul(float(1).sub(dRatio.mul(0.5)))
        const y = hash(seed.add(22)).sub(0.5).mul(thick)
        posX.assign(cos(theta).mul(r))
        posY.assign(y)
        posZ.assign(sin(theta).mul(r))
        distFactor.assign(dRatio.mul(0.3))
      })
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
    })

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

    // ─── Color: realistic spectral class system (no green stars) ─────
    // Stars follow the main sequence: M(red) → K(orange) → G(yellow) →
    // F(yellow-white) → A/B(blue-white) → O(blue).
    // Inner regions favor warm (M/K/G), outer regions favor cool (A/B/O).
    // Hues normalized to 0-1 range (hue/360).
    const hueRand = hash(seed.add(900))
    const hueSpread = hash(seed.add(901)) // per-star spread within class
    const hue = float(0).toVar()

    If(layerVal.equal(0), () => {
      // Dust: purple-blue hues (240-280° → 0.667-0.778)
      hue.assign(hueRand.mul(0.111).add(0.667))
    }).ElseIf(layerVal.equal(2), () => {
      // Bright: OB/giants — warm orange-red (10-45° → 0.028-0.125)
      hue.assign(hueRand.mul(0.097).add(0.028))
    }).Else(() => {
      // Star layer: weighted spectral class selection based on distance.
      // Use cumulative thresholds that shift with distFactor.
      // Inner (d=0): mostly M/K/G (warm). Outer (d=1): more A/B/O (cool).
      // d blended via pow(distFactor, 0.6) to gradual transition.
      const d = pow(clamp(distFactor, float(0), float(1)), float(0.6))

      // Cumulative weights per spectral class [M, K, G, F, A/B, O]
      // Inner: [0.35, 0.65, 0.90, 0.98, 1.00, 1.00]
      // Outer: [0.05, 0.15, 0.30, 0.50, 0.85, 1.00]
      const wM  = mix(float(0.35), float(0.05), d)
      const wK  = mix(float(0.65), float(0.15), d)
      const wG  = mix(float(0.90), float(0.30), d)
      const wF  = mix(float(0.98), float(0.50), d)
      const wAB = mix(float(1.00), float(0.85), d)
      // O class gets remainder to 1.0

      // Select spectral class by threshold
      // M: hue 10° (0.028), K: 25° (0.069), G: 42° (0.117),
      // F: 55° (0.153), A/B: 210° (0.583), O: 225° (0.625)
      // Each with a small spread from hueSpread
      If(hueRand.lessThan(wM), () => {
        hue.assign(float(0.028).add(hueSpread.sub(0.5).mul(0.022))) // 10° ±4°
      }).ElseIf(hueRand.lessThan(wK), () => {
        hue.assign(float(0.069).add(hueSpread.sub(0.5).mul(0.022))) // 25° ±4°
      }).ElseIf(hueRand.lessThan(wG), () => {
        hue.assign(float(0.117).add(hueSpread.sub(0.5).mul(0.017))) // 42° ±3°
      }).ElseIf(hueRand.lessThan(wF), () => {
        hue.assign(float(0.153).add(hueSpread.sub(0.5).mul(0.014))) // 55° ±2.5°
      }).ElseIf(hueRand.lessThan(wAB), () => {
        hue.assign(float(0.583).add(hueSpread.sub(0.5).mul(0.042))) // 210° ±7.5°
      }).Else(() => {
        hue.assign(float(0.625).add(hueSpread.sub(0.5).mul(0.028))) // 225° ±5°
      })
    })

    // Saturation and lightness per layer
    const sat = float(0).toVar()
    const light = float(0).toVar()
    If(layerVal.equal(0), () => {
      sat.assign(0.3)
      light.assign(brightness.mul(0.4))
    }).ElseIf(layerVal.equal(1), () => {
      sat.assign(0.65)
      light.assign(brightness.mul(0.6))
    }).Else(() => {
      sat.assign(0.5)
      light.assign(brightness.mul(0.85))
    })

    const rgb = hslToRgb(hue, sat, light)
    buffers.colorBuffer.element(idx).assign(vec4(rgb.x, rgb.y, rgb.z, alpha))

    // ─── Velocity (not actively used, but stored for spring target) ────
    buffers.velocityBuffer.element(idx).assign(vec3(0, 0, 0))
  })().compute(count)

  return computeInit
}
