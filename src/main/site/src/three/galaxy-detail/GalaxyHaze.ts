import * as THREE from 'three'
import type { GalaxyRenderParams } from './morphology'
import { getStellarBodyVisibility } from './cinematicAppearance'

/** Unresolved nuclear light. Size is set by the morphology bulge, not the BH. */
export class GalaxyHaze {
  readonly mesh: THREE.Sprite
  private material: THREE.SpriteMaterial
  private radius = 1
  private hasBulge = true

  constructor(params: GalaxyRenderParams) {
    const size = 128
    const data = new Uint8Array(size * size * 4)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const r2 = ((x + 0.5) / size * 2 - 1) ** 2 + ((y + 0.5) / size * 2 - 1) ** 2
        const alpha = Math.max(0, Math.exp(-r2 * 7) - Math.exp(-7))
        const i = (y * size + x) * 4
        data[i] = 255
        data[i + 1] = 220
        data[i + 2] = 170
        data[i + 3] = Math.round(alpha * 255)
      }
    }
    const map = new THREE.DataTexture(data, size, size)
    map.minFilter = map.magFilter = THREE.LinearFilter
    map.needsUpdate = true
    this.material = new THREE.SpriteMaterial({
      map, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, opacity: 0.85,
    })
    this.mesh = new THREE.Sprite(this.material)
    this.mesh.renderOrder = -3
    this.updateAppearance(params)
  }

  updateAppearance(params: GalaxyRenderParams): void {
    this.radius = params.galaxyRadius
    const m = params.morphology
    this.hasBulge = m.bulgeRadius > 0 || m.ellipticity > 0
    this.mesh.visible = this.hasBulge
    const diameter = params.galaxyRadius * Math.max(0.38, m.bulgeRadius * 2)
    this.mesh.scale.set(diameter, diameter, 1)
  }

  update(camera: THREE.Camera): void {
    // Resolve diffuse nuclear light into individual stars during an approach.
    this.material.opacity = 0.85 * getStellarBodyVisibility(camera.position.length(), this.radius)
    this.mesh.visible = this.hasBulge && this.material.opacity > 0
  }

  dispose(): void {
    this.material.map?.dispose()
    this.material.dispose()
  }
}
