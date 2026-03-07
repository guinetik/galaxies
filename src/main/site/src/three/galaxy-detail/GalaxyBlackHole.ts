import * as THREE from 'three'
import vertexShader from './shaders/blackhole.vert.glsl?raw'
import fragmentShader from './shaders/blackhole.frag.glsl?raw'

/**
 * Two-pass black hole rendering:
 *
 * Pass 1 (depthMesh): Black sphere that writes depth to occlude stars behind it.
 * Pass 2 (mesh): Billboard quad with gravitational lensing + accretion disk shader.
 */
export class GalaxyBlackHole {
  readonly mesh: THREE.Mesh
  readonly depthMesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private quadSize: number
  private apparentPx = 0

  constructor(_activityClass: string | null, quadSize = 60) {
    this.quadSize = quadSize

    // ─── Pass 1: Depth sphere (disabled — shader handles the visual) ────
    const depthGeometry = new THREE.SphereGeometry(1, 4, 4)
    const depthMaterial = new THREE.MeshBasicMaterial({ visible: false })
    this.depthMesh = new THREE.Mesh(depthGeometry, depthMaterial)
    this.depthMesh.layers.set(2)

    // ─── Pass 2: Visual billboard quad ──────────────────────────────────
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2(512, 512) },
        uTime: { value: 0.0 },
        uTiltX: { value: 0.0 },
        uRotY: { value: 0.0 },
        uLOD: { value: 0.0 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material)
    this.mesh.scale.set(quadSize, quadSize, 1)
    this.mesh.renderOrder = 1
    this.mesh.layers.set(2)
  }

  update(time: number, cameraTiltX: number, cameraRotY: number, camera?: THREE.Camera, renderer?: THREE.WebGLRenderer): void {
    this.material.uniforms.uTime.value = time
    this.material.uniforms.uTiltX.value = cameraTiltX
    this.material.uniforms.uRotY.value = cameraRotY

    if (renderer) {
      const size = renderer.getSize(new THREE.Vector2())
      const dpr = renderer.getPixelRatio()
      this.material.uniforms.uResolution.value.set(size.x * dpr, size.y * dpr)
    }

    if (camera) {
      this.mesh.quaternion.copy(camera.quaternion)

      // LOD: 0 = far away (dim), 1 = close up (full intensity)
      const camDist = camera.position.length()
      const fov = (camera as THREE.PerspectiveCamera).fov ?? 60
      const vFov = fov * Math.PI / 180
      const screenH = this.material.uniforms.uResolution.value.y
      this.apparentPx = (this.quadSize / camDist) * (screenH / (2 * Math.tan(vFov / 2)))
      const lod = Math.min(Math.max((this.apparentPx - 6) / 220, 0), 1)
      this.material.uniforms.uLOD.value = lod
    }
  }

  getLOD(): number {
    return this.material.uniforms.uLOD.value
  }

  getApparentPx(): number {
    return this.apparentPx
  }

  dispose(): void {
    this.material.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.depthMesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.depthMesh.material as THREE.Material).dispose()
  }
}
