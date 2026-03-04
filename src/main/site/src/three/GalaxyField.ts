import * as THREE from 'three'
import type { Galaxy } from '@/types/galaxy'
import { assignMorphology } from '@/types/galaxy'
import { raDecToPosition } from './celestialMath'
import { SPHERE_RADIUS, MORPHOLOGY_COLORS } from './constants'
import { morphologyToAtlasIndex } from './GalaxyTextures'
import vertexShader from './shaders/galaxy.vert.glsl?raw'
import fragmentShader from './shaders/galaxy.frag.glsl?raw'

export class GalaxyField {
  readonly points: THREE.Points
  galaxies: Galaxy[]
  private material: THREE.ShaderMaterial
  private geometry: THREE.BufferGeometry
  private atlasTexture: THREE.Texture
  private positions: Float32Array
  private sizes: Float32Array
  private redshifts: Float32Array
  private selected: Float32Array = new Float32Array(0)
  private selectedPgc: number | null = null
  private readonly tempLocal = new THREE.Vector3()
  private readonly tempWorld = new THREE.Vector3()

  constructor(galaxies: Galaxy[], atlasTexture: THREE.Texture) {
    this.galaxies = galaxies
    this.atlasTexture = atlasTexture
    this.positions = new Float32Array(0)
    this.sizes = new Float32Array(0)
    this.redshifts = new Float32Array(0)

    this.geometry = new THREE.BufferGeometry()

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMaxRedshift: { value: 0.0 },
        uMinRedshift: { value: 0.0 },
        uFov: { value: 60.0 },
        uTexture: { value: atlasTexture },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.frustumCulled = false

    this.rebuild(galaxies)
  }

  rebuild(galaxies: Galaxy[]): void {
    this.galaxies = galaxies
    const count = galaxies.length

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const redshifts = new Float32Array(count)
    const texIndices = new Float32Array(count)
    const selected = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const g = galaxies[i]

      // Position on celestial sphere
      const pos = raDecToPosition(g.ra, g.dec, SPHERE_RADIUS)
      positions[i * 3] = pos.x
      positions[i * 3 + 1] = pos.y
      positions[i * 3 + 2] = pos.z

      // Color from assigned morphology with per-galaxy variation
      const morphClass = assignMorphology(g.pgc)
      const baseColor: [number, number, number] = MORPHOLOGY_COLORS[morphClass]
      const seed = (g.pgc * 2654435761) >>> 0

      // Per-galaxy variation stays subtle to keep a realistic palette.
      const t1 = ((seed >>> 8) % 1024) / 1023
      const t2 = ((seed >>> 18) % 1024) / 1023
      const brightnessScale = 0.9 + t1 * 0.22
      const coolWarmTilt = (t2 - 0.5) * 0.08
      colors[i * 3] = Math.min(1, Math.max(0, baseColor[0] * brightnessScale + coolWarmTilt * 0.5))
      colors[i * 3 + 1] = Math.min(1, Math.max(0, baseColor[1] * brightnessScale))
      colors[i * 3 + 2] = Math.min(1, Math.max(0, baseColor[2] * brightnessScale - coolWarmTilt * 0.6))

      // Size from distance — closer galaxies appear larger
      const K = 16.0
      sizes[i] = Math.max(2.0, Math.min(64.0, K / g.distance_mpc))

      // Redshift derived from CMB velocity
      redshifts[i] = (g.vcmb ?? 0) / 299792.458

      // Texture atlas index from morphology
      texIndices[i] = morphologyToAtlasIndex(morphClass)
      selected[i] = this.selectedPgc != null && g.pgc === this.selectedPgc ? 1 : 0
    }
    this.positions = positions
    this.selected = selected
    this.sizes = sizes
    this.redshifts = redshifts

    this.geometry.dispose()
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    this.geometry.setAttribute('aRedshift', new THREE.BufferAttribute(redshifts, 1))
    this.geometry.setAttribute('aTexIndex', new THREE.BufferAttribute(texIndices, 1))
    this.geometry.setAttribute('aSelected', new THREE.BufferAttribute(selected, 1))

    this.points.geometry = this.geometry
  }

  /** Set selected galaxy PGC for outline highlight; null to clear. */
  setSelectedPgc(pgc: number | null): void {
    if (this.selectedPgc === pgc) return
    this.selectedPgc = pgc
    if (!this.geometry.attributes.aSelected) return
    const attr = this.geometry.attributes.aSelected as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < this.galaxies.length; i++) {
      arr[i] = pgc != null && this.galaxies[i].pgc === pgc ? 1 : 0
    }
    attr.needsUpdate = true
  }

  update(elapsed: number, maxRedshift: number, minRedshift: number, fov: number): void {
    this.material.uniforms.uTime.value = elapsed
    this.material.uniforms.uMaxRedshift.value = maxRedshift
    this.material.uniforms.uMinRedshift.value = minRedshift
    this.material.uniforms.uFov.value = fov
  }

  /**
   * Hit-test galaxies using square screen-space bounds that match point sprites.
   * Returns the nearest galaxy whose sprite box contains the pointer.
   */
  pickGalaxyAtScreen(
    screenX: number,
    screenY: number,
    camera: THREE.PerspectiveCamera,
    viewportWidth: number,
    viewportHeight: number,
    maxRedshift: number,
    minRedshift: number,
    fov: number
  ): Galaxy | null {
    this.points.updateWorldMatrix(true, false)

    let bestIndex = -1
    let bestDistanceSq = Number.POSITIVE_INFINITY
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    const detailMix = this.smoothstep(0, 1, this.clamp01((52 - fov) / (52 - 20)))

    for (let i = 0; i < this.galaxies.length; i++) {
      const alpha = this.computeVisibilityAlpha(this.redshifts[i], maxRedshift, minRedshift)
      if (alpha < 0.01) continue

      const i3 = i * 3
      this.tempLocal.set(this.positions[i3], this.positions[i3 + 1], this.positions[i3 + 2])
      this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(camera)

      // Outside clip volume.
      if (this.tempWorld.z < -1 || this.tempWorld.z > 1) continue

      const px = (this.tempWorld.x * 0.5 + 0.5) * viewportWidth
      const py = (-this.tempWorld.y * 0.5 + 0.5) * viewportHeight

      const pointSizePx = this.estimatePointSizePx(this.sizes[i], alpha, pixelRatio, fov, detailMix)
      const half = pointSizePx * 0.5

      const dx = screenX - px
      const dy = screenY - py
      if (Math.abs(dx) > half || Math.abs(dy) > half) continue

      const distSq = dx * dx + dy * dy
      if (distSq < bestDistanceSq) {
        bestDistanceSq = distSq
        bestIndex = i
      }
    }

    return bestIndex >= 0 ? this.galaxies[bestIndex] : null
  }

  /** Estimate sprite pixel size from shader-equivalent uniforms. */
  private estimatePointSizePx(size: number, alpha: number, pixelRatio: number, fov: number, detailMix: number): number {
    const sizeScale = 0.5 + 0.5 * alpha
    const fovScale = 60 / fov
    const basePx = size * pixelRatio * fovScale * sizeScale * 3.0
    const detailBoost = 1 + 0.35 * detailMix
    const farBoost = 1.75 - 0.75 * detailMix
    return Math.max(2.8 * pixelRatio, basePx * detailBoost * farBoost)
  }

  /** Match shader redshift visibility curve. */
  private computeVisibilityAlpha(redshift: number, maxRedshift: number, minRedshift: number): number {
    if (redshift < minRedshift || redshift > maxRedshift) return 0
    
    // Far fade
    let farAlpha = 1.0
    const fadeStart = maxRedshift * 0.6
    if (redshift > fadeStart) {
      farAlpha = this.smoothstep(maxRedshift, fadeStart, redshift)
    }

    // Near fade (steeper to clear foreground quickly)
    let nearAlpha = 1.0
    const nearFadeEnd = minRedshift * 1.5 // Fade in over 50% range
    if (redshift < nearFadeEnd) {
      nearAlpha = this.smoothstep(minRedshift, nearFadeEnd, redshift)
    }

    return Math.min(farAlpha, nearAlpha)
  }

  private clamp01(v: number): number {
    return Math.max(0, Math.min(1, v))
  }

  private smoothstep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp01((x - edge0) / (edge1 - edge0))
    return t * t * (3 - 2 * t)
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
    this.atlasTexture.dispose()
  }
}
