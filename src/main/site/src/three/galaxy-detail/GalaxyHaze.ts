import * as THREE from 'three'

export class GalaxyHaze {
  readonly mesh: THREE.Mesh
  private material: THREE.MeshBasicMaterial

  constructor(galaxyRadius: number) {
    // 1. Create a radial gradient texture procedurally using an offscreen canvas
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    const cx = size / 2
    const cy = size / 2
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx)
    gradient.addColorStop(0, 'hsla(30, 70%, 50%, 0.12)')
    gradient.addColorStop(0.2, 'hsla(210, 50%, 40%, 0.06)')
    gradient.addColorStop(0.5, 'hsla(210, 40%, 30%, 0.03)')
    gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    // 2. Create THREE.CanvasTexture from the offscreen canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    // 3. Create a PlaneGeometry sized to galaxyRadius * 3
    const planeSize = galaxyRadius * 3
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize)

    // 4. MeshBasicMaterial with additive blending
    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })

    // 5. Create mesh at origin in the galaxy plane
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.set(0, 0, 0)
  }

  dispose(): void {
    this.material.map?.dispose()
    this.material.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
  }
}
