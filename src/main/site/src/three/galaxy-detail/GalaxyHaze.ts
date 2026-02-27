import * as THREE from 'three'

export class GalaxyHaze {
  readonly mesh: THREE.Mesh
  private material: THREE.MeshBasicMaterial

  constructor(galaxyRadius: number) {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    const cx = size / 2
    const cy = size / 2

    // Layer 1: Bright, compact core glow (warm golden — billions of unresolved stars)
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx * 0.3)
    coreGrad.addColorStop(0, 'hsla(35, 80%, 65%, 0.45)')
    coreGrad.addColorStop(0.3, 'hsla(30, 70%, 50%, 0.25)')
    coreGrad.addColorStop(0.7, 'hsla(25, 60%, 40%, 0.08)')
    coreGrad.addColorStop(1, 'hsla(20, 50%, 30%, 0)')
    ctx.fillStyle = coreGrad
    ctx.fillRect(0, 0, size, size)

    // Layer 2: Wider warm haze (extends through disk)
    const diskGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx * 0.7)
    diskGrad.addColorStop(0, 'hsla(30, 60%, 55%, 0.15)')
    diskGrad.addColorStop(0.3, 'hsla(210, 40%, 45%, 0.08)')
    diskGrad.addColorStop(0.6, 'hsla(220, 30%, 35%, 0.03)')
    diskGrad.addColorStop(1, 'hsla(0, 0%, 0%, 0)')
    ctx.fillStyle = diskGrad
    ctx.fillRect(0, 0, size, size)

    // Layer 3: Very faint outer halo
    const outerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx)
    outerGrad.addColorStop(0, 'hsla(25, 40%, 40%, 0.04)')
    outerGrad.addColorStop(0.5, 'hsla(220, 30%, 30%, 0.02)')
    outerGrad.addColorStop(1, 'hsla(0, 0%, 0%, 0)')
    ctx.fillStyle = outerGrad
    ctx.fillRect(0, 0, size, size)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const planeSize = galaxyRadius * 3
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize)

    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.rotation.x = -Math.PI / 2
    this.mesh.position.set(0, 0, 0)
  }

  dispose(): void {
    this.material.map?.dispose()
    this.material.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
  }
}
