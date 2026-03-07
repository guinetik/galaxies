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
  Fn,
  length,
  smoothstep,
  mix,
  max,
  exp,
  uv,
} from 'three/tsl'
import type { GalaxyBuffers } from './GalaxyComputeInit'

export class GalaxyParticlesWebGPU {
  readonly sprite: THREE.Sprite
  readonly foregroundSprite: THREE.Sprite
  private material: THREE.SpriteNodeMaterial
  private foregroundMaterial: THREE.SpriteNodeMaterial

  constructor(count: number, buffers: GalaxyBuffers, baseDistance: number) {
    // Shared buffer attributes
    const starPos = buffers.positionBuffer.toAttribute()
    const starColor = buffers.colorBuffer.toAttribute()
    const starSize = buffers.sizeBuffer.toAttribute()
    const fgAlpha = buffers.foregroundAlphaBuffer.toAttribute()

    const densityScale = Math.sqrt(60000 / count)
    const worldScale = baseDistance * 0.003 * densityScale

    // ─── Glow fragment (shared by both sprites) ──────────────────────────
    // Returns vec4(litRgb * alpha, alpha) — premultiplied for additive blending
    const glowFragment = (alphaMultiplier: any) =>
      Fn(() => {
        const coord = uv().sub(0.5).mul(2.0)
        const dist = length(coord)

        const edge = smoothstep(1.0, 0.8, dist)
        const core = smoothstep(0.36, 0.0, dist)
        const halo = exp(dist.mul(dist).mul(-4.5)).mul(0.6)
        const intensity = max(core, halo).mul(edge)

        const litRgb = mix(
          vec3(starColor.x, starColor.y, starColor.z),
          vec3(1.0, 1.0, 1.0),
          core.mul(0.6),
        )

        const alpha = starColor.w.mul(intensity).mul(alphaMultiplier)
        return vec4(litRgb.mul(alpha), alpha)
      })()

    // ─── Main sprite (galaxy scene — dimmed where foreground) ────────────
    this.material = new THREE.SpriteNodeMaterial()
    this.material.transparent = true
    this.material.depthWrite = false
    this.material.blending = THREE.AdditiveBlending

    this.material.positionNode = starPos
    this.material.scaleNode = starSize.mul(worldScale)
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
    this.foregroundMaterial.scaleNode = starSize.mul(worldScale)
    this.foregroundMaterial.colorNode = glowFragment(fgAlpha)

    this.foregroundSprite = new THREE.Sprite(this.foregroundMaterial)
    this.foregroundSprite.count = count
    this.foregroundSprite.frustumCulled = false
    this.foregroundSprite.renderOrder = 2
  }

  dispose(): void {
    this.material.dispose()
    this.foregroundMaterial.dispose()
  }
}
