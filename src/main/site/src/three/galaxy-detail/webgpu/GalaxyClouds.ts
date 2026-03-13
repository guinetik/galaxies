// @ts-nocheck — TSL node types have complex overloads that don't resolve correctly
// with generic UniformNode/StorageBufferNode types. Runtime behavior is correct.
/**
 * WebGPU Dust Cloud System
 *
 * 100k soft dust particles that follow the galaxy structure.
 * Weaker spring forces for fluid movement. Rendered behind stars.
 * Following the reference project's cloud pattern (galaxy.js lines 284-434).
 */

import * as THREE from 'three/webgpu'
import {
  instancedArray,
  instanceIndex,
  vec3,
  vec4,
  float,
  Fn,
  If,
  length,
  sin,
  cos,
  floor,
  max,
  min,
  pow,
  sqrt,
  smoothstep,
  uv,
  uniform,
  mix,
} from 'three/tsl'
import type { GalaxyUniforms } from './GalaxyComputeInit'
import type { Quality } from '../qualityDetect'
import {
  hash,
  applyDifferentialRotation,
  rotateXZ,
} from './tsl-helpers'

const TAU = 6.28318530718
const CLOUD_COUNT = 30000

function cloudCount(quality: Quality): number {
  return quality === 'mobile' ? 10_000 : CLOUD_COUNT
}

export class GalaxyClouds {
  readonly sprite: THREE.Sprite
  private material: THREE.SpriteNodeMaterial

  // Buffers
  private positionBuffer: ReturnType<typeof instancedArray>
  private originalPositionBuffer: ReturnType<typeof instancedArray>
  private colorBuffer: ReturnType<typeof instancedArray>
  private sizeBuffer: ReturnType<typeof instancedArray>

  // Compute shaders
  readonly computeInit: any
  readonly computeUpdate: any

  constructor(uniforms: GalaxyUniforms, baseDistance: number, quality: Quality) {
    const count = cloudCount(quality)

    // ─── Create cloud buffers ──────────────────────────────────────────
    this.positionBuffer = instancedArray(count, 'vec3')
    this.originalPositionBuffer = instancedArray(count, 'vec3')
    this.colorBuffer = instancedArray(count, 'vec3')
    this.sizeBuffer = instancedArray(count, 'float')

    const posBuffer = this.positionBuffer
    const origBuffer = this.originalPositionBuffer
    const colBuffer = this.colorBuffer
    const szBuffer = this.sizeBuffer

    // ─── Init compute: distribute clouds following galaxy structure ────
    this.computeInit = Fn(() => {
      const idx = instanceIndex
      const seed = idx.toFloat().add(10000) // offset from star seeds
      const R = uniforms.galaxyRadius

      const posX = float(0).toVar()
      const posY = float(0).toVar()
      const posZ = float(0).toVar()
      const normalizedRadius = float(0).toVar()

      // ─── SPIRAL / BARRED (numArms > 0): tight dust on inner arm edges ──────
      If(uniforms.numArms.greaterThan(0), () => {
        const rHash = hash(seed.add(1))
        const spiralStartR = max(uniforms.spiralStart.mul(R), float(0.001))
        const barMinR = uniforms.barLength.mul(0.5)
        const minArmR = min(
          max(spiralStartR, barMinR),
          R.mul(0.98),
        )
        const armR = sqrt(
          rHash.mul(R.mul(R).sub(minArmR.mul(minArmR))).add(minArmR.mul(minArmR)),
        )
        normalizedRadius.assign(armR.div(R))

        const armIndex = floor(hash(seed.add(2)).mul(uniforms.numArms))
        const armAngle = armIndex.mul(TAU).div(uniforms.numArms)
        const windingFactor = float(2.5)
        const spiralAngle = max(armR.div(spiralStartR), float(1.0)).log()
          .div(max(uniforms.spiralTightness, float(0.001)))
          .mul(windingFactor)

        // Tight scatter — dust centered on the arm spine
        const angleOffset = hash(seed.add(3)).sub(0.5)
          .mul(mix(float(0.18), float(0.08), uniforms.bandDustLaneStrength))
        const radiusOffset = hash(seed.add(4)).sub(0.5)
          .mul(uniforms.armWidth)
          .mul(mix(float(0.45), float(0.2), uniforms.bandDustLaneStrength))
        const angle = armAngle.add(spiralAngle).add(angleOffset)

        posX.assign(cos(angle).mul(armR.add(radiusOffset)))
        posZ.assign(sin(angle).mul(armR.add(radiusOffset)))
        const thicknessFactor = float(1.0).sub(normalizedRadius).add(0.15)
          .mul(uniforms.bandDiskThicknessScale)
        posY.assign(hash(seed.add(5)).sub(0.5).mul(R.mul(0.03)).mul(thicknessFactor))
      })

      // ─── LENTICULAR (no arms, no bar, no clumps, no ellipticity, but has bulge)
      If(uniforms.numArms.equal(0)
        .and(uniforms.barLength.equal(0))
        .and(uniforms.clumpCount.equal(0))
        .and(uniforms.ellipticity.equal(0))
        .and(uniforms.bulgeFraction.greaterThan(0)), () => {
        const r = pow(hash(seed.add(1)), float(0.5)).mul(R)
        const theta = hash(seed.add(2)).mul(TAU)
        normalizedRadius.assign(r.div(R))
        posX.assign(cos(theta).mul(r))
        posZ.assign(sin(theta).mul(r))
        const thick = R.mul(0.03).mul(float(1.0).sub(normalizedRadius.mul(0.5)))
          .mul(uniforms.bandDiskThicknessScale)
        posY.assign(hash(seed.add(5)).sub(0.5).mul(thick))
      })

      // ─── ELLIPTICAL (ellipticity > 0): smooth ellipsoid ───────────────
      If(uniforms.ellipticity.greaterThan(0), () => {
        const ar = uniforms.axisRatio
        const r = pow(hash(seed.add(1)), float(0.4)).mul(R)
        const theta = hash(seed.add(2)).mul(TAU)
        const x = r.mul(cos(theta))
        const z = r.mul(sin(theta)).mul(ar)
        normalizedRadius.assign(sqrt(x.mul(x).add(z.mul(z))).div(R))
        posX.assign(x)
        posZ.assign(z)
        posY.assign(hash(seed.add(5)).sub(0.5).mul(R).mul(0.08).mul(float(1.0).sub(normalizedRadius.mul(0.5))))
      })

      // ─── IRREGULAR (clumpCount > 0): clumped ──────────────────────────
      If(uniforms.clumpCount.greaterThan(0), () => {
        const nClumps = uniforms.clumpCount
        const clumpIdx = floor(hash(seed.add(2)).mul(nClumps))
        const clumpAngle = clumpIdx.div(nClumps).mul(TAU).add(hash(clumpIdx.add(5000)).mul(0.5))
        const clumpR = hash(clumpIdx.add(6000)).mul(0.6).add(0.2).mul(R)
        const cx = cos(clumpAngle).mul(clumpR)
        const cz = sin(clumpAngle).mul(clumpR)
        const sigma = hash(clumpIdx.add(7000)).mul(80).add(30)
        const gx = hash(seed.add(3)).sub(0.5).add(hash(seed.add(4)).sub(0.5)).mul(2)
        const gz = hash(seed.add(7)).sub(0.5).add(hash(seed.add(8)).sub(0.5)).mul(2)
        posX.assign(cx.add(gx.mul(sigma)))
        posZ.assign(cz.add(gz.mul(sigma)))
        normalizedRadius.assign(sqrt(posX.mul(posX).add(posZ.mul(posZ))).div(R))
        posY.assign(hash(seed.add(5)).sub(0.5).mul(R).mul(0.1))
      })

      const position = vec3(posX, posY, posZ)
      posBuffer.element(idx).assign(position)
      origBuffer.element(idx).assign(position)

      // Cloud color: subtle warm tint, fades toward edges
      const coolTint = vec3(0.62, 0.7, 0.9)
      const warmTint = vec3(0.92, 0.76, 0.62)
      const dustTint = mix(coolTint, warmTint, uniforms.bandDustMix)
      const laneBoost = mix(float(0.7), float(1.0), uniforms.bandDustLaneStrength)
      const cloudColor = dustTint.mul(float(0.72).sub(normalizedRadius.mul(0.28))).mul(laneBoost)
      colBuffer.element(idx).assign(cloudColor)

      // Size variation: larger in denser regions
      const densityFactor = float(1.0).sub(normalizedRadius.mul(0.5))
        .mul(mix(float(0.9), float(1.15), uniforms.bandDustLaneStrength))
      const size = hash(seed.add(6)).mul(0.5).add(0.7).mul(densityFactor)
      szBuffer.element(idx).assign(size)
    })().compute(count)

    // ─── Update compute: same rotation logic as stars ──────────────────
    this.computeUpdate = Fn(() => {
      const idx = instanceIndex
      const position = posBuffer.element(idx).toVar()
      const originalPos = origBuffer.element(idx)

      // Bar region: rigid-body rotation to prevent shearing
      If(uniforms.barLength.greaterThan(0), () => {
        const distFromCenter = length(vec3(position.x, float(0), position.z))
        const rigidAngle = uniforms.rotationSpeed.mul(uniforms.deltaTime).negate()

        If(distFromCenter.lessThan(uniforms.barLength), () => {
          position.assign(rotateXZ(position, rigidAngle))
          origBuffer.element(idx).assign(rotateXZ(originalPos, rigidAngle))
        }).Else(() => {
          position.assign(applyDifferentialRotation(
            position, uniforms.rotationSpeed, uniforms.deltaTime,
          ))
          origBuffer.element(idx).assign(applyDifferentialRotation(
            originalPos, uniforms.rotationSpeed, uniforms.deltaTime,
          ))
        })
      }).Else(() => {
        // Non-barred: differential rotation (no-op when rotationSpeed=0)
        position.assign(applyDifferentialRotation(
          position, uniforms.rotationSpeed, uniforms.deltaTime,
        ))
        origBuffer.element(idx).assign(applyDifferentialRotation(
          originalPos, uniforms.rotationSpeed, uniforms.deltaTime,
        ))
      })

      posBuffer.element(idx).assign(position)
    })().compute(count)

    // ─── Cloud rendering material ──────────────────────────────────────
    this.material = new THREE.SpriteNodeMaterial()
    this.material.transparent = true
    this.material.depthWrite = false
    this.material.blending = THREE.AdditiveBlending

    const cloudPos = posBuffer.toAttribute()
    const cloudColor = colBuffer.toAttribute()
    const cloudSize = szBuffer.toAttribute()

    this.material.positionNode = cloudPos

    // Soft circular cloud shape with low opacity
    const cloudShape = Fn(() => {
      const coord = uv().sub(0.5).mul(2.0)
      const dist = length(coord)
      const alpha = smoothstep(1.0, 0.0, dist).mul(smoothstep(1.0, 0.3, dist))
      return vec4(cloudColor.x, cloudColor.y, cloudColor.z, alpha.mul(0.015))
    })()

    this.material.colorNode = cloudShape

    // Scale: larger than stars, proportional to galaxy size
    const densityScale = Math.sqrt(60000 / count)
    const worldScale = baseDistance * 0.006 * densityScale
    this.material.scaleNode = cloudSize.mul(worldScale)

    this.sprite = new THREE.Sprite(this.material)
    this.sprite.count = count
    this.sprite.frustumCulled = false
    this.sprite.renderOrder = -1 // render before stars
  }

  dispose(): void {
    this.material.dispose()
  }
}
