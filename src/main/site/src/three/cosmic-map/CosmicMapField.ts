import * as THREE from 'three'
import type { Galaxy, GalaxyGroup } from '@/types/galaxy'
import { velocityToColor } from '@/types/galaxy'
import vertexShader from './shaders/cosmicmap.vert.glsl?raw'
import fragmentShader from './shaders/cosmicmap.frag.glsl?raw'

export type MapDataMode = 'groups' | 'galaxies'

/**
 * Renders galaxy groups or individual galaxies as a 3D point cloud
 * in supergalactic Cartesian coordinates, color-coded by CMB velocity.
 */
export class CosmicMapField {
  readonly points: THREE.Points
  private material: THREE.ShaderMaterial
  private geometry: THREE.BufferGeometry

  // Current data for hit-testing
  private currentMode: MapDataMode = 'groups'
  private groupData: GalaxyGroup[] = []
  private galaxyData: Galaxy[] = []
  private positions: Float32Array = new Float32Array(0)

  constructor() {
    this.geometry = new THREE.BufferGeometry()

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

  /** Load galaxy groups (default mode) */
  setGroups(groups: GalaxyGroup[]): void {
    this.currentMode = 'groups'
    this.groupData = groups
    this.galaxyData = []

    const count = groups.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const g = groups[i]
      positions[i * 3] = g.sgx
      positions[i * 3 + 1] = g.sgy
      positions[i * 3 + 2] = g.sgz

      const c = velocityToColor(g.vh ?? 0)
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]

      sizes[i] = 3.0
    }

    this.positions = positions
    this.rebuildGeometry(positions, colors, sizes)
  }

  /**
   * Load individual galaxies (velocity-space Cartesian from SGL/SGB/vcmb).
   * Group SGX/Y/Z are stored in km/s (velocity-space), so we must use vcmb
   * as the radial component — not distance_mpc — to match the same scale.
   */
  setGalaxies(galaxies: Galaxy[]): void {
    this.currentMode = 'galaxies'
    this.galaxyData = galaxies
    this.groupData = []

    const count = galaxies.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const DEG2RAD = Math.PI / 180

    for (let i = 0; i < count; i++) {
      const g = galaxies[i]
      const sglRad = (g.sgl ?? 0) * DEG2RAD
      const sgbRad = (g.sgb ?? 0) * DEG2RAD
      // Use vcmb (km/s) as radial distance to match group SGX/Y/Z coordinate system
      const v = Math.abs(g.vcmb ?? 0)

      positions[i * 3] = v * Math.cos(sgbRad) * Math.cos(sglRad)
      positions[i * 3 + 1] = v * Math.cos(sgbRad) * Math.sin(sglRad)
      positions[i * 3 + 2] = v * Math.sin(sgbRad)

      const c = velocityToColor(g.vcmb ?? 0)
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]

      sizes[i] = 2.5
    }

    this.positions = positions
    this.rebuildGeometry(positions, colors, sizes)
  }

  private rebuildGeometry(positions: Float32Array, colors: Float32Array, sizes: Float32Array): void {
    this.geometry.dispose()
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    this.points.geometry = this.geometry
  }

  update(elapsed: number): void {
    this.material.uniforms.uTime.value = elapsed
  }

  /** Screen-space hit test — returns info about closest point under cursor, or null */
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

      const half = 8.0 * pixelRatio  // Pick radius in CSS pixels
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

    if (this.currentMode === 'groups') {
      const g = this.groupData[bestIndex]
      return { pgc: g.group_pgc, velocity: g.vh ?? 0, distance: g.dist_mpc }
    } else {
      const g = this.galaxyData[bestIndex]
      return { pgc: g.pgc, velocity: g.vcmb ?? 0, distance: g.distance_mpc }
    }
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
