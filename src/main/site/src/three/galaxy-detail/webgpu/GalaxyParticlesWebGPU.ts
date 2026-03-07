/**
 * WebGPU Star Particle Renderer
 *
 * Uses SpriteNodeMaterial with TSL nodes for position/color/opacity.
 * Reads from GPU storage buffers populated by compute shaders.
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
  private material: THREE.SpriteNodeMaterial

  constructor(count: number, buffers: GalaxyBuffers, baseDistance: number) {
    this.material = new THREE.SpriteNodeMaterial()
    this.material.transparent = true
    this.material.depthWrite = false
    this.material.blending = THREE.AdditiveBlending

    // Position from compute buffer
    const starPos = buffers.positionBuffer.toAttribute()
    this.material.positionNode = starPos

    // Color from compute buffer
    const starColor = buffers.colorBuffer.toAttribute()

    // Size from compute buffer, scaled proportional to galaxy radius.
    // starSize values are 0.8-10 (from generator layer system).
    // baseDistance = galaxyRadius * 1.7, so we derive world-space sprite sizes.
    // At 500k particles (vs 60k base), scale down by sqrt(60k/count) to avoid over-saturation.
    const starSize = buffers.sizeBuffer.toAttribute()
    const densityScale = Math.sqrt(60000 / count) // ~0.35 for 500k
    const worldScale = baseDistance * 0.003 * densityScale // proportional to galaxy size
    this.material.scaleNode = starSize.mul(worldScale)

    // Fragment: core + halo glow (port of particle.frag.glsl)
    const circleShape = Fn(() => {
      const coord = uv().sub(0.5).mul(2.0)
      const dist = length(coord)

      // Discard outside circle
      const edge = smoothstep(1.0, 0.8, dist)

      // Sharp bright core (white-hot center)
      const core = smoothstep(0.36, 0.0, dist)

      // Soft halo with moderate falloff
      const halo = exp(dist.mul(dist).mul(-4.5)).mul(0.6)

      // Combine: core dominates center, halo provides glow
      const intensity = max(core, halo).mul(edge)

      // Core shifts toward white, halo carries the star color
      const litRgb = mix(
        vec3(starColor.x, starColor.y, starColor.z),
        vec3(1.0, 1.0, 1.0),
        core.mul(0.6),
      )

      const alpha = starColor.w.mul(intensity)
      return vec4(litRgb.mul(alpha), alpha)
    })()

    this.material.colorNode = circleShape

    this.sprite = new THREE.Sprite(this.material)
    this.sprite.count = count
    this.sprite.frustumCulled = false
  }

  dispose(): void {
    this.material.dispose()
  }
}
