import * as THREE from 'three'
import vertexShader from './shaders/blackhole.vert.glsl?raw'
import fragmentShader from './shaders/blackhole.frag.glsl?raw'

/**
 * Raymarched black hole with gravitational lensing, FBM-textured accretion
 * disk, Doppler beaming, photon ring, and warm shadow rim.
 *
 * Rendered on a billboard PlaneGeometry quad positioned at the galaxy center.
 * The quad size scales proportionally to galaxy radius (~20% = accretion disk extent).
 */
export class GalaxyBlackHole {
  readonly mesh: THREE.Mesh
  private material: THREE.ShaderMaterial

  constructor(activityClass: string | null, quadSize = 60) {
    // Determine disk outer limit from AGN activity class.
    // Wider disks = more prominent accretion rings.
    let diskOuterLimit: number
    switch (activityClass) {
      case 'Sy1':
        diskOuterLimit = 0.50
        break
      case 'Sy2':
        diskOuterLimit = 0.45
        break
      case 'LINER':
        diskOuterLimit = 0.40
        break
      default:
        diskOuterLimit = 0.38
        break
    }

    const geometry = new THREE.PlaneGeometry(1, 1)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2(512, 512) },
        uTime: { value: 0.0 },
        uTiltX: { value: 0.0 },
        uRotY: { value: 0.0 },
        uDiskOuterLimit: { value: diskOuterLimit },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.scale.set(quadSize, quadSize, 1)
    this.mesh.renderOrder = 10
  }

  update(time: number, cameraTiltX: number, cameraRotY: number, camera?: THREE.Camera, renderer?: THREE.WebGLRenderer): void {
    this.material.uniforms.uTime.value = time
    this.material.uniforms.uTiltX.value = cameraTiltX
    this.material.uniforms.uRotY.value = cameraRotY

    // Match resolution to actual render target for crisp output
    if (renderer) {
      const size = renderer.getSize(new THREE.Vector2())
      const dpr = renderer.getPixelRatio()
      this.material.uniforms.uResolution.value.set(size.x * dpr, size.y * dpr)
    }

    // Billboard: always face the camera.
    if (camera) {
      this.mesh.quaternion.copy(camera.quaternion)
    }
  }

  dispose(): void {
    this.material.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
  }
}
