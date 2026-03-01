import * as THREE from 'three'
import type { DensityFieldResult } from './computeDensityField'
import vertexShader from './shaders/fabric.vert.glsl?raw'
import fragmentShader from './shaders/fabric.frag.glsl?raw'

/**
 * A PlaneGeometry mesh with vertex displacement driven by a density field.
 * Renders as a glowing wireframe — deep wells where galaxies cluster.
 */
export class SpacetimeFabric {
  readonly mesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private geometry: THREE.PlaneGeometry
  private densityTexture: THREE.DataTexture

  constructor(densityField: DensityFieldResult) {
    const { grid, resolution, extent } = densityField

    // Create density DataTexture (single-channel float)
    this.densityTexture = new THREE.DataTexture(
      grid,
      resolution,
      resolution,
      THREE.RedFormat,
      THREE.FloatType,
    )
    this.densityTexture.minFilter = THREE.LinearFilter
    this.densityTexture.magFilter = THREE.LinearFilter
    this.densityTexture.wrapS = THREE.ClampToEdgeWrapping
    this.densityTexture.wrapT = THREE.ClampToEdgeWrapping
    this.densityTexture.needsUpdate = true

    // PlaneGeometry on XY by default, rotate to XZ so Y is displacement axis
    this.geometry = new THREE.PlaneGeometry(
      extent * 2,
      extent * 2,
      resolution - 1,
      resolution - 1,
    )
    this.geometry.rotateX(-Math.PI / 2)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uDensity: { value: this.densityTexture },
        uDisplaceScale: { value: 6000.0 },
        uGridLines: { value: 64.0 },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  update(elapsed: number): void {
    this.material.uniforms.uTime.value = elapsed
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
    this.densityTexture.dispose()
  }
}
