import * as THREE from 'three'
import type { DensityFieldResult } from './computeDensityField'

interface ClusterInfo {
  name: string
  sgx: number
  sgy: number
  /** When true, renders a highlighted "local" label style */
  highlight?: boolean
}

/**
 * Approximate supergalactic XY positions of major clusters.
 * Coordinates are in the same km/s velocity-space as galaxy group SGX/SGY.
 */
const CLUSTERS: ClusterInfo[] = [
  { name: 'Milky Way',       sgx: 0,      sgy: 0,    highlight: true },
  { name: 'Virgo',           sgx: -200,   sgy: 1100 },
  { name: 'Coma',            sgx: -300,   sgy: 6800 },
  { name: 'Perseus-Pisces',  sgx: -4800,  sgy: 4500 },
  { name: 'Great Attractor', sgx: -4200,  sgy: 1800 },
  { name: 'Shapley',         sgx: -6800,  sgy: 6200 },
  { name: 'Centaurus',       sgx: -3200,  sgy: 3200 },
  { name: 'Hydra',           sgx: -2800,  sgy: 3800 },
]

/**
 * Sprite-based labels for major galaxy clusters.
 * Positioned on the warped fabric surface.
 */
export class SpacetimeLabels {
  readonly group: THREE.Group
  private sprites: THREE.Sprite[] = []

  constructor(densityField: DensityFieldResult, displaceScale: number = 6000.0) {
    this.group = new THREE.Group()
    const { grid, resolution, extent } = densityField

    for (const cluster of CLUSTERS) {
      const { sgx, sgy } = cluster

      const u = (sgx + extent) / (extent * 2)
      const v = (sgy + extent) / (extent * 2)
      const gx = Math.min(Math.max(Math.floor(u * resolution), 0), resolution - 1)
      const gy = Math.min(Math.max(Math.floor(v * resolution), 0), resolution - 1)
      const density = grid[gy * resolution + gx]
      const baseY = -(Math.pow(density, 0.7) * displaceScale) + 300

      const sprite = this.makeLabel(cluster.name, cluster.highlight ?? false)
      sprite.position.set(sgx, baseY, sgy)
      this.group.add(sprite)
      this.sprites.push(sprite)
    }
  }

  private makeLabel(text: string, highlight = false): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const scale = 2
    canvas.width = 256 * scale
    canvas.height = 48 * scale
    const ctx = canvas.getContext('2d')!
    ctx.scale(scale, scale)

    const fontSize = highlight ? 16 : 14
    const weight = highlight ? '700' : '500'
    ctx.font = `${weight} ${fontSize}px system-ui, -apple-system, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.shadowColor = highlight
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(34, 211, 238, 0.6)'
    ctx.shadowBlur = highlight ? 12 : 8
    ctx.fillStyle = highlight
      ? 'rgba(255, 255, 255, 1.0)'
      : 'rgba(255, 255, 255, 0.85)'
    ctx.fillText(text, 128, 24)

    ctx.shadowBlur = 0
    ctx.fillText(text, 128, 24)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(highlight ? 1000 : 800, highlight ? 200 : 150, 1)
    return sprite
  }

  dispose(): void {
    for (const sprite of this.sprites) {
      ;(sprite.material as THREE.SpriteMaterial).map?.dispose()
      sprite.material.dispose()
    }
  }
}
