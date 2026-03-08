/**
 * WebGPU Backdrop — Procedural sky shell with nebulae, stars, and distant galaxies.
 *
 * Ports backdrop.frag.glsl to WGSL via wgslFn on a MeshBasicNodeMaterial.
 * Visual output matches the WebGL GalaxyBackdrop.
 *
 * Because wgslFn() only parses a single WGSL function, the multi-function
 * backdrop.wgsl is split at load time and each function is registered as an
 * include dependency so the WGSL emitter outputs them in the correct order.
 */

import * as THREE from 'three/webgpu'
import {
  uniform,
  normalize,
  positionLocal,
  Fn,
} from 'three/tsl'
import { wgslFn } from 'three/tsl'
import backdropWGSL from '../shaders/backdrop.wgsl?raw'
import type { Quality } from '../qualityDetect'

/**
 * Substitute LOD placeholder tokens in the WGSL source with concrete integer
 * literals chosen by the quality tier.  WGSL has no preprocessor, so we do
 * this in TypeScript before handing the source to wgslFn().
 *
 * Tokens and their desktop / mobile values mirror the GLSL #define constants
 * in GalaxyBackdrop.ts:
 *   SPIRAL_NOISE_ITER   5 / 3
 *   FBM_DETAIL_OCTAVES  4 / 2
 *   MAX_GALAXIES        4 / 2
 *   MAX_CLOUDS          6 / 3
 *   MAX_KNOTS           5 / 2
 *   STAR_LAYERS         4 / 2  (used as "STAR_LAYERS > N" guards → true/false)
 */
function applyQualityLOD(source: string, quality: Quality): string {
  const mobile = quality === 'mobile'

  const SPIRAL_NOISE_ITER  = mobile ? 3 : 5
  const FBM_DETAIL_OCTAVES = mobile ? 2 : 4
  const MAX_GALAXIES       = mobile ? 2 : 4
  const MAX_CLOUDS         = mobile ? 3 : 6
  const MAX_KNOTS          = mobile ? 2 : 5
  const STAR_LAYERS        = mobile ? 2 : 4

  return source
    .replace(/\bSPIRAL_NOISE_ITER\b/g,  String(SPIRAL_NOISE_ITER))
    .replace(/\bFBM_DETAIL_OCTAVES\b/g, String(FBM_DETAIL_OCTAVES))
    .replace(/\bMAX_GALAXIES\b/g,       String(MAX_GALAXIES))
    .replace(/\bMAX_CLOUDS\b/g,         String(MAX_CLOUDS))
    .replace(/\bMAX_KNOTS\b/g,          String(MAX_KNOTS))
    // Replace "STAR_LAYERS > N" comparisons with bool literals so the WGSL
    // compiler sees valid expressions and can dead-strip the skipped branches.
    .replace(/\bSTAR_LAYERS\s*>\s*(\d+)\b/g, (_match, n) =>
      STAR_LAYERS > parseInt(n, 10) ? 'true' : 'false'
    )
}

/**
 * Extract individual `fn …(…) { … }` blocks from a multi-function WGSL source.
 * Functions must appear in dependency order (callees before callers).
 */
function splitWgslFunctions(source: string): string[] {
  const functions: string[] = []
  const fnRegex = /\bfn\s+[a-z_0-9]+\s*\(/gi
  let match: RegExpExecArray | null
  const starts: number[] = []

  while ((match = fnRegex.exec(source)) !== null) {
    starts.push(match.index)
  }

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i]
    const braceStart = source.indexOf('{', start)
    if (braceStart === -1) continue

    let depth = 0
    let j = braceStart
    for (; j < source.length; j++) {
      if (source[j] === '{') depth++
      if (source[j] === '}') {
        depth--
        if (depth === 0) break
      }
    }
    functions.push(source.substring(start, j + 1))
  }

  return functions
}

export class GalaxyBackdropWebGPU {
  readonly mesh: THREE.Mesh
  private material: THREE.MeshBasicNodeMaterial

  private uTime = uniform(0)
  private uSeed = uniform(0)
  private uNebulaIntensity = uniform(2.4)

  constructor(baseDistance: number, seed: number, quality: Quality) {
    this.uSeed.value = seed

    const radius = baseDistance * 12
    const geometry = new THREE.SphereGeometry(radius, 192, 128)

    // Apply LOD substitutions (replaces token placeholders with integer literals
    // chosen for the current quality tier) before splitting into functions.
    const processedWGSL = applyQualityLOD(backdropWGSL, quality)

    // Split multi-function WGSL into individual functions and build include chain.
    // Each function gets all prior functions as includes so the WGSL emitter
    // outputs helper definitions before callers. Three.js deduplicates globally.
    const fnStrings = splitWgslFunctions(processedWGSL)
    const fnNodes: ReturnType<typeof wgslFn>[] = []

    for (const fnStr of fnStrings) {
      fnNodes.push(wgslFn(fnStr, [...fnNodes]))
    }

    const backdropFn = fnNodes[fnNodes.length - 1]

    const uTime = this.uTime
    const uSeed = this.uSeed
    const uNebulaIntensity = this.uNebulaIntensity

    const fragmentNode = Fn(() => {
      const dir = normalize(positionLocal)
      return backdropFn(dir, uTime, uSeed, uNebulaIntensity)
    })

    this.material = new THREE.MeshBasicNodeMaterial()
    this.material.side = THREE.BackSide
    this.material.depthWrite = false
    this.material.depthTest = false
    this.material.fragmentNode = fragmentNode()

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -10
  }

  update(time: number, camera: THREE.PerspectiveCamera): void {
    this.uTime.value = time
    this.mesh.position.copy(camera.position)
  }

  dispose(): void {
    this.material.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
  }
}
