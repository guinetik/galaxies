// @ts-nocheck — TSL node types have complex overloads that don't resolve correctly
// with generic UniformNode/StorageBufferNode types. Runtime behavior is correct.
/**
 * WebGPU Neighbor Galaxy Sprite Layer
 *
 * Renders distant neighbor galaxies as subtle background sprites using the
 * shared galaxy texture atlas (4 cols × 2 rows). Mirrors the WebGL
 * GalaxyNeighbors layer in appearance: additive, dim, per-sprite
 * brightness distance-fade, small screen-space clamped sizing (~5px max).
 *
 * Uses SpriteNodeMaterial with per-sprite instancedArray buffers
 * (CPU-filled static data, no GPU compute needed — data is small, ~40 sprites max).
 * Pattern mirrors GalaxyClouds.ts: instancedArray(count, type) → fill .value.array → .toAttribute().
 */

import * as THREE from 'three/webgpu'
import {
  instancedArray,
  vec2,
  vec4,
  float,
  uv,
  texture,
  uniform,
  cameraPosition,
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

    // ─── Create instancedArray storage buffers (proven pattern: GalaxyClouds.ts) ──

    const positionBuffer   = instancedArray(count, 'vec3')
    const colorBuffer      = instancedArray(count, 'vec3')
    const sizeBuffer       = instancedArray(count, 'float')
    const brightnessBuffer = instancedArray(count, 'float')
    const texIndexBuffer   = instancedArray(count, 'float')

    // ─── CPU-fill the buffer arrays from NeighborSprite[] ────────────────
    // Each .value is a StorageInstancedBufferAttribute whose .array is
    // the underlying Float32Array — fill it once at construction time.

    const posArr = positionBuffer.value.array
    const colArr = colorBuffer.value.array
    const szArr  = sizeBuffer.value.array
    const brtArr = brightnessBuffer.value.array
    const idxArr = texIndexBuffer.value.array

    for (let i = 0; i < count; i++) {
      const s = sprites[i]
      posArr[i * 3]     = s.position[0]
      posArr[i * 3 + 1] = s.position[1]
      posArr[i * 3 + 2] = s.position[2]
      colArr[i * 3]     = s.color[0]
      colArr[i * 3 + 1] = s.color[1]
      colArr[i * 3 + 2] = s.color[2]
      szArr[i]          = s.size
      brtArr[i]         = s.brightness
      idxArr[i]         = s.texIndex
    }

    // ─── Convert storage buffers to attribute nodes for rendering ─────────
    // .toAttribute() is the proven pattern used throughout this codebase
    // (GalaxyClouds.ts, GalaxyParticlesWebGPU.ts).

    const spritePos    = positionBuffer.toAttribute()
    const spriteColor  = colorBuffer.toAttribute()
    const spriteSize   = sizeBuffer.toAttribute()
    const spriteBright = brightnessBuffer.toAttribute()
    const spriteTexIdx = texIndexBuffer.toAttribute()

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
