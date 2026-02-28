import * as THREE from 'three'
import type { Galaxy } from '@/types/galaxy'
import { classifyMorphology } from '@/types/galaxy'
import { raDecToPosition, magnitudeToSize } from './celestialMath'
import { SPHERE_RADIUS, MORPHOLOGY_COLORS } from './constants'
import { morphologyToAtlasIndex } from './GalaxyTextures'
import vertexShader from './shaders/galaxy.vert.glsl?raw'
import fragmentShader from './shaders/galaxy.frag.glsl?raw'

export class GalaxyField {
  readonly points: THREE.Points
  readonly galaxies: Galaxy[]
  private material: THREE.ShaderMaterial
  private geometry: THREE.BufferGeometry
  private atlasTexture: THREE.Texture
  private positions: Float32Array
  private sizes: Float32Array
  private redshifts: Float32Array
  private readonly tempLocal = new THREE.Vector3()
  private readonly tempWorld = new THREE.Vector3()

  constructor(galaxies: Galaxy[], atlasTexture: THREE.Texture) {
    this.galaxies = galaxies
    this.atlasTexture = atlasTexture
    const count = galaxies.length

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const redshifts = new Float32Array(count)
    const texIndices = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const g = galaxies[i]

      // Position on celestial sphere
      const pos = raDecToPosition(g.ra!, g.dec!, SPHERE_RADIUS)
      positions[i * 3] = pos.x
      positions[i * 3 + 1] = pos.y
      positions[i * 3 + 2] = pos.z

      // Color from morphology with per-galaxy variation
      const morphClass = classifyMorphology(g.morphology)
      let baseColor: [number, number, number]

      if (morphClass === 'unknown') {
        // Pick a random neon hue for unknowns
        const seed = (g.id * 2654435761) >>> 0
        const t = (seed % 1000) / 1000
        if (t < 0.25) {
          baseColor = [1.0, 0.2, 0.4]       // pink
        } else if (t < 0.5) {
          baseColor = [0.2, 0.7, 1.0]       // blue
        } else if (t < 0.75) {
          baseColor = [0.0, 1.0, 0.7]       // green
        } else {
          baseColor = [0.8, 0.3, 1.0]       // purple
        }
      } else {
        baseColor = MORPHOLOGY_COLORS[morphClass]
      }

      // Per-galaxy brightness/hue variation
      const hueShift = (Math.random() - 0.5) * 0.2
      const brightShift = 0.8 + Math.random() * 0.4
      colors[i * 3] = Math.min(1, Math.max(0, baseColor[0] * brightShift + hueShift))
      colors[i * 3 + 1] = Math.min(1, Math.max(0, baseColor[1] * brightShift + hueShift * 0.3))
      colors[i * 3 + 2] = Math.min(1, Math.max(0, baseColor[2] * brightShift - hueShift * 0.4))

      // Size from magnitude (use b_mag as primary, fall back to r_mag)
      const mag = g.b_mag ?? g.r_mag ?? null
      sizes[i] = magnitudeToSize(mag)

      // Redshift (default to 0 if null, so always visible at widest FOV)
      redshifts[i] = g.redshift ?? 0

      // Texture atlas index — randomize unknowns for visual variety.
      if (morphClass === 'unknown') {
        const seed = (g.id * 2654435761) >>> 0
        texIndices[i] = seed % 6
      } else {
        texIndices[i] = morphologyToAtlasIndex(morphClass)
      }
    }
    this.positions = positions
    this.sizes = sizes
    this.redshifts = redshifts

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    this.geometry.setAttribute('aRedshift', new THREE.BufferAttribute(redshifts, 1))
    this.geometry.setAttribute('aTexIndex', new THREE.BufferAttribute(texIndices, 1))

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMaxRedshift: { value: 0.01 },
        uFov: { value: 60.0 },
        uTexture: { value: atlasTexture },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.frustumCulled = false
  }

  update(elapsed: number, maxRedshift: number, fov: number): void {
    this.material.uniforms.uTime.value = elapsed
    this.material.uniforms.uMaxRedshift.value = maxRedshift
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
    fov: number
  ): Galaxy | null {
    this.points.updateWorldMatrix(true, false)

    let bestIndex = -1
    let bestDistanceSq = Number.POSITIVE_INFINITY
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    const detailMix = this.smoothstep(0, 1, this.clamp01((55 - fov) / (55 - 22)))

    for (let i = 0; i < this.galaxies.length; i++) {
      const alpha = this.computeVisibilityAlpha(this.redshifts[i], maxRedshift)
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
    const basePx = size * pixelRatio * fovScale * sizeScale * 5.2
    const detailBoost = 1 + 0.9 * detailMix
    return Math.max(3.8 * pixelRatio, basePx * detailBoost)
  }

  /** Match shader redshift visibility curve. */
  private computeVisibilityAlpha(redshift: number, maxRedshift: number): number {
    if (redshift < 0 || redshift > maxRedshift) return 0
    const fadeStart = maxRedshift * 0.6
    if (redshift < fadeStart) return 1
    return this.smoothstep(maxRedshift, fadeStart, redshift)
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
