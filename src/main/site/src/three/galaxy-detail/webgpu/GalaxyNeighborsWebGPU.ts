// @ts-nocheck — TSL node types have complex overloads that don't resolve correctly
// with generic attribute/uniform node types. Runtime behavior is correct.
/**
 * WebGPU Neighbor Galaxy Sprite Layer
 *
 * Renders distant neighbor galaxies as subtle background sprites using the
 * shared galaxy texture atlas (4 cols × 2 rows). Mirrors the WebGL
 * GalaxyNeighbors layer in appearance: additive, dim, per-sprite
 * brightness distance-fade, small screen-space clamped sizing (~5px max).
 *
 * Uses SpriteNodeMaterial with per-sprite instanced buffer attributes
 * (no GPU compute needed — data is small, ~40 sprites max).
 */

import * as THREE from 'three/webgpu'
import {
  vec2,
  vec4,
  float,
  uv,
  texture,
  uniform,
  cameraPosition,
  attribute,
  floor as tslFloor,
  mod,
} from 'three/tsl'
import type { NeighborSprite } from '../neighborField'

// Atlas layout constants (must match GalaxyTextures.ts and GalaxyNeighbors.ts)
const ATLAS_COLS = 4.0
const ATLAS_ROWS = 2.0

// Global master brightness dim (matches WebGL GalaxyNeighbors uBrightness = 0.7)
const GLOBAL_DIM = 0.7

export class GalaxyNeighborsWebGPU {
  readonly sprite: THREE.Sprite
  private material: THREE.SpriteNodeMaterial

  // Screen-space size uniforms — updated each frame by the scene
  private readonly uScreenH = uniform(800)
  private readonly uTanHalfFov = uniform(Math.tan((60 * Math.PI) / 180 / 2))

  constructor(
    sprites: NeighborSprite[],
    atlas: THREE.Texture,
    baseDistance: number,
  ) {
    const count = sprites.length

    // ─── Build flat attribute buffers from NeighborSprite[] ──────────────

    const positions   = new Float32Array(count * 3)
    const colors      = new Float32Array(count * 3)
    const sizes       = new Float32Array(count)
    const brightnesses = new Float32Array(count)
    const texIndices  = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const s = sprites[i]
      positions[i * 3]     = s.position[0]
      positions[i * 3 + 1] = s.position[1]
      positions[i * 3 + 2] = s.position[2]
      colors[i * 3]        = s.color[0]
      colors[i * 3 + 1]    = s.color[1]
      colors[i * 3 + 2]    = s.color[2]
      sizes[i]             = s.size
      brightnesses[i]      = s.brightness
      texIndices[i]        = s.texIndex
    }

    // ─── Instanced buffer attributes ─────────────────────────────────────

    const posAttr   = new THREE.InstancedBufferAttribute(positions,   3)
    const colAttr   = new THREE.InstancedBufferAttribute(colors,       3)
    const sizeAttr  = new THREE.InstancedBufferAttribute(sizes,        1)
    const brtAttr   = new THREE.InstancedBufferAttribute(brightnesses, 1)
    const idxAttr   = new THREE.InstancedBufferAttribute(texIndices,   1)

    // ─── TSL attribute nodes ──────────────────────────────────────────────
    // attribute() reads per-instance data from the instanced buffer.

    const spritePos    = attribute('aNeighborPos',        'vec3')
    const spriteColor  = attribute('aNeighborColor',      'vec3')
    const spriteSize   = attribute('aNeighborSize',       'float')
    const spriteBright = attribute('aNeighborBrightness', 'float')
    const spriteTexIdx = attribute('aNeighborTexIndex',   'float')

    // ─── Screen-space clamped sizing (mirrors GalaxyParticlesWebGPU) ─────
    //
    // targetPx = size * (baseDistance * 1.28) / dist, clamped [0, 5]
    // scaleNode (world units) = targetPx * dist * tanHalfFov * 2 / screenH

    const uBaseDist   = uniform(baseDistance)
    const uScreenH    = this.uScreenH
    const uTanHalfFov = this.uTanHalfFov
    const MIN_PX = 0.0
    const MAX_PX = 5.0

    const dist = cameraPosition.sub(spritePos).length().max(float(0.001))
    const targetPx = spriteSize
      .mul(uBaseDist.mul(1.28))
      .div(dist)
      .clamp(float(MIN_PX), float(MAX_PX))
    const scaleNode = targetPx.mul(dist).mul(uTanHalfFov.mul(2)).div(uScreenH)

    // ─── Atlas tile UV mapping ────────────────────────────────────────────
    //
    // Atlas layout: 4 cols × 2 rows.
    // For a given texIndex:
    //   col = floor(texIndex) % 4
    //   row = floor(texIndex / 4)
    // Sprite UV [0,1]^2 (from uv()) maps into the tile window:
    //   tileU = (col + u) / 4
    //   tileV = (row + v) / 2

    const idx  = tslFloor(spriteTexIdx)
    const col  = mod(idx, float(ATLAS_COLS))
    const row  = tslFloor(idx.div(float(ATLAS_COLS)))
    const quadUV = uv()  // sprite quad 0..1 coordinates
    const tileU = col.add(quadUV.x).div(float(ATLAS_COLS))
    const tileV = row.add(quadUV.y).div(float(ATLAS_ROWS))

    const atlasTex = texture(atlas)
    const texSample = atlasTex.sample(vec2(tileU, tileV))

    // Final color: texRGB × perSpriteColor × perSpriteBrightness × globalDim
    // Alpha:       texAlpha × perSpriteBrightness × globalDim
    const dim   = spriteBright.mul(float(GLOBAL_DIM))
    const rgb   = texSample.rgb.mul(spriteColor).mul(dim)
    const alpha = texSample.a.mul(dim)
    const colorNode = vec4(rgb, alpha)

    // ─── Material ─────────────────────────────────────────────────────────

    this.material = new THREE.SpriteNodeMaterial()
    this.material.transparent  = true
    this.material.depthWrite   = false
    this.material.blending     = THREE.AdditiveBlending
    this.material.positionNode = spritePos
    this.material.scaleNode    = scaleNode
    this.material.colorNode    = colorNode

    // ─── Sprite (instanced via count) ────────────────────────────────────

    this.sprite = new THREE.Sprite(this.material)
    this.sprite.count = count
    this.sprite.frustumCulled = false
    this.sprite.renderOrder = -2  // behind galaxy particles

    // Attach instanced buffer attributes to the sprite geometry so TSL
    // attribute() nodes can read per-instance data.
    this.sprite.geometry.setAttribute('aNeighborPos',        posAttr)
    this.sprite.geometry.setAttribute('aNeighborColor',      colAttr)
    this.sprite.geometry.setAttribute('aNeighborSize',       sizeAttr)
    this.sprite.geometry.setAttribute('aNeighborBrightness', brtAttr)
    this.sprite.geometry.setAttribute('aNeighborTexIndex',   idxAttr)
  }

  updateSizeUniforms(screenHpx: number, tanHalfFov: number): void {
    this.uScreenH.value    = Math.max(screenHpx, 1)
    this.uTanHalfFov.value = tanHalfFov
  }

  dispose(): void {
    this.material.dispose()
    // Atlas is owned by the caller (GalaxySceneWebGPU) — do not dispose here.
  }
}
