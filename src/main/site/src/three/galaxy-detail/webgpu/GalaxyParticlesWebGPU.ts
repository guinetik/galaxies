/**
 * WebGPU Star Particle Renderer
 *
 * Uses SpriteNodeMaterial with TSL nodes for position/color/opacity.
 * Reads from GPU storage buffers populated by compute shaders.
 *
 * Provides two sprites:
 * - `sprite`: main galaxy particles (dimmed where foreground)
 * - `foregroundSprite`: stars in front of the black hole (additive, rendered on top)
 */

import * as THREE from 'three/webgpu'
import {
  vec3,
  vec4,
  float,
  mix,
  uv,
  texture,
  uniform,
  cameraPosition,
} from 'three/tsl'
import { createGlowTexture } from '../createGlowTexture'
import type { GalaxyBuffers } from './GalaxyComputeInit'

export class GalaxyParticlesWebGPU {
  readonly sprite: THREE.Sprite
  readonly foregroundSprite: THREE.Sprite
  private material: THREE.SpriteNodeMaterial
  private foregroundMaterial: THREE.SpriteNodeMaterial
  private glowTexture: THREE.DataTexture
  // Screen-space size uniforms — typed via inference from module-scope helpers
  private readonly uScreenH = uniform(800)
  private readonly uTanHalfFov = uniform(Math.tan((60 * Math.PI) / 180 / 2))

  constructor(count: number, buffers: GalaxyBuffers, baseDistance: number) {
    // Shared buffer attributes
    const starPos = buffers.positionBuffer.toAttribute()
    const starColor = buffers.colorBuffer.toAttribute()
    const starSize = buffers.sizeBuffer.toAttribute()
    const fgAlpha = buffers.foregroundAlphaBuffer.toAttribute()

    // Screen-space size uniforms (updated each frame by the scene)
    const uBaseDist = uniform(baseDistance)
    const uScreenH = this.uScreenH
    const uTanHalfFov = this.uTanHalfFov
    const MIN_PX = 0.0, MAX_PX = 5.0      // device px (uScreenH already includes dpr)

    const screenScale = (sz: any) => {
      const dist = cameraPosition.sub(starPos).length().max(float(0.001))
      const targetPx = sz.mul(uBaseDist.mul(1.28)).div(dist).clamp(float(MIN_PX), float(MAX_PX))
      return targetPx.mul(dist).mul(uTanHalfFov.mul(2)).div(uScreenH)
    }

    // ─── Baked glow texture ───────────────────────────────────────────────
    const glowDataTexture = createGlowTexture()
    this.glowTexture = glowDataTexture
    const glowTex = texture(glowDataTexture)

    // ─── Glow fragment (shared by both sprites) ──────────────────────────
    // Returns vec4(litRgb * alpha, alpha) — premultiplied for additive blending
    const glowFragment = (alphaMultiplier: any) => {
      const glow = glowTex.sample(uv())   // vec4: r=corona, g=core, b=0, a=alpha
      const alpha = starColor.w.mul(glow.w).mul(alphaMultiplier)
      const coronaColor = mix(
        vec3(starColor.x, starColor.y, starColor.z).mul(1.32),
        vec3(1.0, 1.0, 1.0),
        float(0.12),
      )
      const coreColor = mix(coronaColor, vec3(1.0, 1.0, 1.0), float(0.92))
      const litRgb = coronaColor.mul(glow.x).add(coreColor.mul(glow.y.mul(1.35)))
      return vec4(litRgb.mul(alpha), alpha)
    }

    // ─── Main sprite (galaxy scene — dimmed where foreground) ────────────
    this.material = new THREE.SpriteNodeMaterial()
    this.material.transparent = true
    this.material.depthWrite = false
    this.material.blending = THREE.AdditiveBlending

    this.material.positionNode = starPos
    this.material.scaleNode = screenScale(starSize)
    this.material.colorNode = glowFragment(float(1.0).sub(fgAlpha))

    this.sprite = new THREE.Sprite(this.material)
    this.sprite.count = count
    this.sprite.frustumCulled = false

    // ─── Foreground sprite (BH scene — only stars in front of BH) ───────
    this.foregroundMaterial = new THREE.SpriteNodeMaterial()
    this.foregroundMaterial.transparent = true
    this.foregroundMaterial.depthWrite = false
    this.foregroundMaterial.blending = THREE.AdditiveBlending

    this.foregroundMaterial.positionNode = starPos
    this.foregroundMaterial.scaleNode = screenScale(starSize)
    this.foregroundMaterial.colorNode = glowFragment(fgAlpha)

    this.foregroundSprite = new THREE.Sprite(this.foregroundMaterial)
    this.foregroundSprite.count = count
    this.foregroundSprite.frustumCulled = false
    this.foregroundSprite.renderOrder = 2
  }

  updateSizeUniforms(screenHpx: number, tanHalfFov: number): void {
    this.uScreenH.value = Math.max(screenHpx, 1)
    this.uTanHalfFov.value = tanHalfFov
  }

  dispose(): void {
    this.material.dispose()
    this.foregroundMaterial.dispose()
    this.glowTexture.dispose()
  }
}
