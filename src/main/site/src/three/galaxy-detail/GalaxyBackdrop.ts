import * as THREE from 'three'
import vertexShader from './shaders/backdrop.vert.glsl?raw'
import fragmentShader from './shaders/backdrop.frag.glsl?raw'
import type { Quality } from './qualityDetect'

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
  constructor(baseDistance: number, seed: number, quality: Quality) {
    const radius = baseDistance * 12
    const isMobile = quality === 'mobile'
    const segments = isMobile ? [48, 32] : [192, 128]
    const geometry = new THREE.SphereGeometry(radius, segments[0], segments[1])

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      defines: {
        SPIRAL_NOISE_ITER:  isMobile ? 3 : 5,
        MAX_GALAXIES:       isMobile ? 2 : 4,
        MAX_CLOUDS:         isMobile ? 3 : 6,
        MAX_KNOTS:          isMobile ? 2 : 5,
        STAR_LAYERS:        isMobile ? 2 : 4,
        FBM_DETAIL_OCTAVES: isMobile ? 2 : 4,
      },
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
