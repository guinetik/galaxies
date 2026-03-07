import * as THREE from 'three'
import vertexShader from './shaders/backdrop.vert.glsl?raw'
import fragmentShader from './shaders/backdrop.frag.glsl?raw'

/**
 * Camera-centered procedural sky shell for the WebGL galaxy scene.
 * It provides distant nebulae and stars without interfering with the
 * galaxy-local haze, disk nebula, or black hole layers.
 */
export class GalaxyBackdrop {
  readonly mesh: THREE.Mesh
  private material: THREE.ShaderMaterial

  /**
   * Creates a background sphere sized to stay inside the scene far plane.
   */
  constructor(baseDistance: number, seed: number) {
    const radius = baseDistance * 12
    const geometry = new THREE.SphereGeometry(radius, 192, 128)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSeed: { value: seed },
        uNebulaIntensity: { value: 2.4 },
      },
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
    })

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -10
  }

  /**
   * Keeps the shell centered on the camera so it behaves like a distant skybox.
   */
  update(time: number, camera: THREE.PerspectiveCamera): void {
    this.material.uniforms.uTime.value = time
    this.mesh.position.copy(camera.position)
  }

  /**
   * Releases GPU resources owned by the backdrop.
   */
  dispose(): void {
    this.material.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
  }
}
