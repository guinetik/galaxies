/**
 * WebGPU Post-Processing — Bloom
 *
 * Uses Three.js PostProcessing class with TSL nodes for bloom glow effect.
 */

import * as THREE from 'three/webgpu'
import { uniform } from 'three/tsl'
import { pass } from 'three/tsl'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'

export class GalaxyPostProcessing {
  readonly postProcessing: THREE.PostProcessing
  private bloomPassNode: any

  constructor(
    renderer: THREE.WebGPURenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ) {
    this.postProcessing = new THREE.PostProcessing(renderer)

    // Scene pass
    const scenePass = pass(scene, camera)
    const scenePassColor = scenePass.getTextureNode()

    // Bloom
    this.bloomPassNode = bloom(scenePassColor)
    this.bloomPassNode.threshold.value = 0.1
    this.bloomPassNode.strength.value = 0.3
    this.bloomPassNode.radius.value = 0.2

    // Output: scene + bloom
    this.postProcessing.outputNode = scenePassColor.add(this.bloomPassNode)
  }

  render(): void {
    this.postProcessing.render()
  }

  updateBloom(strength: number, radius: number, threshold: number): void {
    this.bloomPassNode.strength.value = strength
    this.bloomPassNode.radius.value = radius
    this.bloomPassNode.threshold.value = threshold
  }

  dispose(): void {
    // PostProcessing disposes with renderer
  }
}
