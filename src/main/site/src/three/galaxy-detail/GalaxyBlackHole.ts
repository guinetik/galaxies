import * as THREE from 'three'

/**
 * Simple black sphere representing the black hole event horizon.
 * Renders as solid black and writes depth to occlude stars behind it.
 */
export class GalaxyBlackHole {
  readonly mesh: THREE.Mesh
  readonly depthMesh: THREE.Mesh

  constructor(_activityClass: string | null, quadSize = 60) {
    // Solid black sphere
    const geometry = new THREE.SphereGeometry(quadSize * 0.35, 32, 24)
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthWrite: true,
      depthTest: true,
    })
    this.depthMesh = new THREE.Mesh(geometry, material)
    this.depthMesh.renderOrder = -2

    // Placeholder mesh (no visual — kept for API compatibility)
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ visible: false }))
    this.mesh.renderOrder = 1
  }

  update(_time: number, _cameraTiltX: number, _cameraRotY: number, _camera?: THREE.Camera, _renderer?: THREE.WebGLRenderer): void {
    // No-op — static black sphere
  }

  dispose(): void {
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.mesh.material as THREE.Material).dispose()
    ;(this.depthMesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.depthMesh.material as THREE.Material).dispose()
  }
}
