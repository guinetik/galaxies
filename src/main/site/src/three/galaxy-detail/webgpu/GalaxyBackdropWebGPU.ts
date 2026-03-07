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

  constructor(baseDistance: number, seed: number) {
    this.uSeed.value = seed

    const radius = baseDistance * 12
    const geometry = new THREE.SphereGeometry(radius, 192, 128)

    // Split multi-function WGSL into individual functions and build include chain.
    // Each function gets all prior functions as includes so the WGSL emitter
    // outputs helper definitions before callers. Three.js deduplicates globally.
    const fnStrings = splitWgslFunctions(backdropWGSL)
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
