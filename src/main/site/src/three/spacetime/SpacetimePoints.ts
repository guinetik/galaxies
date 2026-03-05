import * as THREE from 'three'
import type { GalaxyGroup } from '@/types/galaxy'
import { velocityToColor } from '@/types/galaxy'
import type { DensityFieldResult } from './computeDensityField'
import vertexShader from '../cosmic-map/shaders/cosmicmap.vert.glsl?raw'
import fragmentShader from '../cosmic-map/shaders/cosmicmap.frag.glsl?raw'

/** PGC number for Andromeda (M31) — highlighted as a landmark galaxy */
const ANDROMEDA_PGC = 2557

/**
 * Galaxy group dots positioned on the warped fabric surface.
 * Reuses the cosmic map point shaders for consistent visual style.
 */
export class SpacetimePoints {
  readonly points: THREE.Points
  /** World position of the Andromeda dot (null if not in slab) */
  andromedaPosition: THREE.Vector3 | null = null
  private material: THREE.ShaderMaterial
  private geometry: THREE.BufferGeometry

  // For hit-testing
  private groupData: GalaxyGroup[] = []
  private positions: Float32Array = new Float32Array(0)

  constructor(
    groups: GalaxyGroup[],
    densityField: DensityFieldResult,
    displaceScale: number = 6000.0,
  ) {
    this.groupData = groups
    const { grid, resolution, extent } = densityField
    const count = groups.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const g = groups[i]

      // XZ position from SGX/SGY (plane is XZ after rotation)
      const x = g.sgx
      const z = g.sgy

      // Sample density at this position to get Y displacement
      const u = (g.sgx + extent) / (extent * 2)
      const v = (g.sgy + extent) / (extent * 2)
      const gx = Math.min(Math.max(Math.floor(u * resolution), 0), resolution - 1)
      const gy = Math.min(Math.max(Math.floor(v * resolution), 0), resolution - 1)
      const density = grid[gy * resolution + gx]
      const y = -(Math.pow(density, 0.7) * displaceScale)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const isAndromeda = g.group_pgc === ANDROMEDA_PGC
      if (isAndromeda) {
        this.andromedaPosition = new THREE.Vector3(x, y, z)
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.85
        colors[i * 3 + 2] = 0.4
        sizes[i] = 18.0
      } else {
        const c = velocityToColor(g.vh ?? 0)
        colors[i * 3] = c[0]
        colors[i * 3 + 1] = c[1]
        colors[i * 3 + 2] = c[2]
        sizes[i] = 3.0
      }
    }

    this.positions = positions
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.frustumCulled = false
  }

  /** Reads the exact rendered position for a given group_pgc from the positions buffer */
  getPositionByPGC(pgc: number): THREE.Vector3 | null {
    for (let i = 0; i < this.groupData.length; i++) {
      if (this.groupData[i].group_pgc === pgc) {
        const i3 = i * 3
        return new THREE.Vector3(
          this.positions[i3],
          this.positions[i3 + 1],
          this.positions[i3 + 2],
        )
      }
    }
    return null
  }

  update(elapsed: number): void {
    this.material.uniforms.uTime.value = elapsed
  }

  /** Screen-space hit test — returns closest group under cursor, or null */
  pickAtScreen(
    screenX: number,
    screenY: number,
    camera: THREE.PerspectiveCamera,
    viewportWidth: number,
    viewportHeight: number,
  ): { pgc: number; velocity: number; distance: number } | null {
    this.points.updateWorldMatrix(true, false)
    const tempLocal = new THREE.Vector3()
    const tempProj = new THREE.Vector3()
    const pixelRatio = Math.min(window.devicePixelRatio, 2)

    let bestIndex = -1
    let bestDistSq = Infinity
    const count = this.positions.length / 3

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      tempLocal.set(this.positions[i3], this.positions[i3 + 1], this.positions[i3 + 2])
      tempProj.copy(tempLocal).applyMatrix4(this.points.matrixWorld).project(camera)

      if (tempProj.z < -1 || tempProj.z > 1) continue

      const px = (tempProj.x * 0.5 + 0.5) * viewportWidth
      const py = (-tempProj.y * 0.5 + 0.5) * viewportHeight

      const half = 8.0 * pixelRatio
      const dx = screenX - px
      const dy = screenY - py
      if (Math.abs(dx) > half || Math.abs(dy) > half) continue

      const distSq = dx * dx + dy * dy
      if (distSq < bestDistSq) {
        bestDistSq = distSq
        bestIndex = i
      }
    }

    if (bestIndex < 0) return null
    const g = this.groupData[bestIndex]
    return { pgc: g.group_pgc, velocity: g.vh ?? 0, distance: g.dist_mpc }
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
