import * as THREE from 'three'
import type { Galaxy, MorphologyClass } from '@/types/galaxy'
import { assignMorphology } from '@/types/galaxy'
import { raDecToPosition, fovToMaxRedshift, redshiftToDistanceMLY } from './celestialMath'
import { SPHERE_RADIUS } from './constants'
import { morphologyToAtlasIndex } from './GalaxyTextures'
import vertexShader from './shaders/galaxy.vert.glsl?raw'
import noiseLib from './shaders/noise-value.glsl?raw'
import renderLib from './shaders/galaxy-render.glsl?raw'
import fragMain from './shaders/galaxy.frag.glsl?raw'

const fragmentShader = noiseLib + '\n' + renderLib + '\n' + fragMain

/**
 * Convert MorphologyClass to Galaxy struct type enum.
 * 0=spiral, 1=barred, 2=elliptical, 3=lenticular, 4=irregular, 5+=unknown
 */
function morphologyToGalaxyType(morphClass: MorphologyClass): number {
  const typeMap: Record<MorphologyClass, number> = {
    spiral: 0,
    barred: 1,
    elliptical: 2,
    lenticular: 3,
    irregular: 4,
    unknown: 5,
  }
  return typeMap[morphClass] ?? 5
}

/** Deterministic per-galaxy random from PGC + offset. Returns [0, 1). */
function seededRandom(pgc: number, offset: number): number {
  let n = ((pgc * 2654435761 + offset * 284517) >>> 0)
  n = (((n >> 16) ^ n) * 0x45d9f3b) >>> 0
  return (n & 0x7fffffff) / 0x7fffffff
}

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
  private focused: Float32Array = new Float32Array(0)
  private hoveredPgc: number | null = null
  private alphas: Float32Array = new Float32Array(0)
  private sizeMultipliers: Float32Array = new Float32Array(0)
  private readonly tempLocal = new THREE.Vector3()
  private readonly tempWorld = new THREE.Vector3()
  private readonly tempView = new THREE.Vector3()
  private latestPointerParallaxX = 0
  private latestPointerParallaxY = 0

  constructor(galaxies: Galaxy[], atlasTexture: THREE.Texture) {
    this.galaxies = galaxies
    this.atlasTexture = atlasTexture
    this.positions = new Float32Array(0)
    this.sizes = new Float32Array(0)
    this.redshifts = new Float32Array(0)
    this.alphas = new Float32Array(0)
    this.sizeMultipliers = new Float32Array(0)

    this.geometry = new THREE.BufferGeometry()

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMaxRedshift: { value: 0.01 },
        uMinRedshift: { value: 0.0 },
        uFov: { value: 60.0 },
        uParallaxX: { value: 0.0 },
        uParallaxY: { value: 0.0 },
        uFocusActive: { value: 0.0 },
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
    const focused = new Float32Array(count)
    const alphas = new Float32Array(count)
    const sizeMultipliers = new Float32Array(count).fill(1.0) // Initialize to 1.0, not 0!

    // New Galaxy struct attributes (packed for efficiency)
    const types = new Float32Array(count)
    const seeds = new Float32Array(count)
    const angles = new Float32Array(count * 3)      // angleX, angleY, angleZ
    const physicalParams = new Float32Array(count * 3) // axialRatio, mass_log10, velocity_kmps
    const distances_mpc = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const g = galaxies[i]

      // Position on celestial sphere
      const pos = raDecToPosition(g.ra, g.dec, SPHERE_RADIUS)
      positions[i * 3] = pos.x
      positions[i * 3 + 1] = pos.y
      positions[i * 3 + 2] = pos.z

      // Color: seed-driven from astronomical palette (no green/cyan).
      // Sampled from Hubble deep field: blue-white, warm white, gold,
      // orange, red-orange, pink/magenta. Weighted toward warm tones.
      const morphClass = assignMorphology(g.pgc)
      const seed = (g.pgc * 2654435761) >>> 0
      const t1 = ((seed >>> 8) % 1024) / 1023   // palette position
      const t2 = ((seed >>> 18) % 1024) / 1023  // saturation
      const t3 = ((seed >>> 3) % 1024) / 1023   // brightness

      // Astronomical galaxy color stops (no green valley!)
      // Lerp between adjacent stops based on t1
      const palette: [number, number, number][] = [
        [0.45, 0.55, 1.00],  // blue (young starburst)
        [0.60, 0.70, 1.00],  // blue-white
        [0.90, 0.88, 0.95],  // warm white
        [1.00, 0.88, 0.60],  // gold
        [1.00, 0.72, 0.38],  // orange
        [0.95, 0.50, 0.25],  // red-orange
        [0.85, 0.35, 0.30],  // deep red
        [0.80, 0.40, 0.55],  // pink/magenta
      ]
      const idx = t1 * (palette.length - 1)
      const lo = Math.floor(idx)
      const hi = Math.min(lo + 1, palette.length - 1)
      const frac = idx - lo
      let r = palette[lo][0] + (palette[hi][0] - palette[lo][0]) * frac
      let gC = palette[lo][1] + (palette[hi][1] - palette[lo][1]) * frac
      let b = palette[lo][2] + (palette[hi][2] - palette[lo][2]) * frac

      const brightness = 0.75 + t3 * 0.45
      const saturation = 0.55 + t2 * 0.45
      // Desaturate toward warm white (not pure white)
      r = r * saturation + (1.0 - saturation) * 0.92
      gC = gC * saturation + (1.0 - saturation) * 0.87
      b = b * saturation + (1.0 - saturation) * 0.82
      colors[i * 3] = Math.min(1, Math.max(0.08, r * brightness))
      colors[i * 3 + 1] = Math.min(1, Math.max(0.08, gC * brightness))
      colors[i * 3 + 2] = Math.min(1, Math.max(0.08, b * brightness))

      // Size from distance — closer galaxies appear larger
      const K = 32.0
      sizes[i] = Math.max(3.0, Math.min(128.0, K / g.distance_mpc))

      // Redshift derived from CMB velocity
      redshifts[i] = (g.vcmb ?? 0) / 299792.458

      // Texture atlas index from morphology
      texIndices[i] = morphologyToAtlasIndex(morphClass)
      selected[i] = this.selectedPgc != null && g.pgc === this.selectedPgc ? 1 : 0

      // Galaxy struct attributes (packed)
      types[i] = morphologyToGalaxyType(morphClass)
      seeds[i] = ((g.pgc * 73856093 ^ ((g.pgc >> 16) * 19349663)) >>> 0) % 100000 // Hash to positive float range

      // Pack angles (angleX, angleY, angleZ)
      angles[i * 3] = seededRandom(g.pgc, 1) * Math.PI * 2      // angleX (tilt)
      angles[i * 3 + 1] = 0.0                                     // angleY (reserved)
      angles[i * 3 + 2] = seededRandom(g.pgc, 3) * Math.PI * 2   // angleZ (rotation)

      // Pack physical params (axialRatio, mass_log10, velocity_kmps)
      physicalParams[i * 3] = g.axial_ratio ?? 0.7
      physicalParams[i * 3 + 1] = g.log_ms_t ?? 10.0
      physicalParams[i * 3 + 2] = g.vcmb ?? 0.0

      distances_mpc[i] = g.distance_mpc
    }
    this.positions = positions
    this.selected = selected
    this.focused = focused
    this.sizes = sizes
    this.redshifts = redshifts
    this.alphas = alphas
    this.sizeMultipliers = sizeMultipliers

    this.geometry.dispose()
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    this.geometry.setAttribute('aRedshift', new THREE.BufferAttribute(redshifts, 1))
    this.geometry.setAttribute('aTexIndex', new THREE.BufferAttribute(texIndices, 1))
    this.geometry.setAttribute('aSelected', new THREE.BufferAttribute(selected, 1))
    this.geometry.setAttribute('aFocused', new THREE.BufferAttribute(focused, 1))
    this.geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
    this.geometry.setAttribute('aSizeMultiplier', new THREE.BufferAttribute(sizeMultipliers, 1))

    // Galaxy struct attributes (packed)
    this.geometry.setAttribute('aType', new THREE.BufferAttribute(types, 1))
    this.geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    this.geometry.setAttribute('aAngles', new THREE.BufferAttribute(angles, 3))
    this.geometry.setAttribute('aPhysicalParams', new THREE.BufferAttribute(physicalParams, 3))
    this.geometry.setAttribute('aDistance_mpc', new THREE.BufferAttribute(distances_mpc, 1))

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

  /** Set hovered galaxy PGC for focus effect; null to clear. */
  setHoveredPgc(pgc: number | null): void {
    if (this.hoveredPgc === pgc) return
    this.hoveredPgc = pgc
    this.material.uniforms.uFocusActive.value = pgc != null ? 1.0 : 0.0
    if (!this.geometry.attributes.aFocused) return
    const attr = this.geometry.attributes.aFocused as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < this.galaxies.length; i++) {
      arr[i] = pgc != null && this.galaxies[i].pgc === pgc ? 1 : 0
    }
    attr.needsUpdate = true
  }

  /**
   * Update galaxy sprite appearance from zoom depth and viewing direction.
   */
  update(
    elapsed: number,
    maxRedshift: number,
    minRedshift: number,
    fov: number,
    pointerParallaxX: number = 0,
    pointerParallaxY: number = 0,
    zoomTickCount: number = 0,
    currentLevel: number = 0,
    levelProgress: number = 0
  ): void {
    this.material.uniforms.uTime.value = elapsed
    this.material.uniforms.uMaxRedshift.value = maxRedshift
    this.material.uniforms.uMinRedshift.value = minRedshift
    this.material.uniforms.uFov.value = fov
    this.latestPointerParallaxX = this.clamp(pointerParallaxX, -1, 1)
    this.latestPointerParallaxY = this.clamp(pointerParallaxY, -1, 1)
    this.material.uniforms.uParallaxX.value = this.latestPointerParallaxX
    this.material.uniforms.uParallaxY.value = this.latestPointerParallaxY

    // Update per-galaxy alpha and size based on camera distance (derived from FOV)
    // Galaxies grow larger as camera approaches their distance
    if (this.alphas.length === this.galaxies.length) {
      const maxRedshift = fovToMaxRedshift(fov)
      const cameraDistanceMly = redshiftToDistanceMLY(maxRedshift)
      const cameraDistanceMpc = cameraDistanceMly / 3.26
      const cameraLogLevel = Math.log2(Math.max(1, cameraDistanceMpc))

      const sizeMultiplierAttr = this.geometry.attributes.aSizeMultiplier as THREE.BufferAttribute
      const sizeMultArray = sizeMultiplierAttr?.array as Float32Array

      for (let i = 0; i < this.galaxies.length; i++) {
        const galaxy = this.galaxies[i]
        const galaxyLogLevel = Math.log2(Math.max(1, galaxy.distance_mpc))
        const logOffset = galaxyLogLevel - cameraLogLevel

        const depthAlpha = this.computeDepthWindowAlpha(logOffset, fov)
        const foregroundFade = this.computeForegroundFade(logOffset, fov)
        this.alphas[i] = depthAlpha * foregroundFade
        sizeMultArray[i] = this.computeGrowthMultiplier(logOffset)
      }
      const alphaAttr = this.geometry.attributes.aAlpha as THREE.BufferAttribute
      if (alphaAttr) {
        alphaAttr.needsUpdate = true
      }
      if (sizeMultiplierAttr) {
        sizeMultiplierAttr.needsUpdate = true
      }
    }
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
    const cameraDistanceMly = redshiftToDistanceMLY(fovToMaxRedshift(fov))
    const cameraDistanceMpc = cameraDistanceMly / 3.26
    const cameraLogLevel = Math.log2(Math.max(1, cameraDistanceMpc))

    for (let i = 0; i < this.galaxies.length; i++) {
      const alpha = this.computeVisibilityAlpha(this.redshifts[i], maxRedshift, minRedshift)
      if (alpha < 0.01) continue

      const i3 = i * 3
      this.tempLocal.set(this.positions[i3], this.positions[i3 + 1], this.positions[i3 + 2])
      this.tempWorld.copy(this.tempLocal).applyMatrix4(this.points.matrixWorld).project(camera)

      const galaxyLogLevel = Math.log2(Math.max(1, this.galaxies[i].distance_mpc))
      const logOffset = galaxyLogLevel - cameraLogLevel
      const depthAlpha = this.computeDepthWindowAlpha(logOffset, fov) * this.computeForegroundFade(logOffset, fov)
      if (depthAlpha < 0.01) continue

      // Outside clip volume.
      if (this.tempWorld.z < -1 || this.tempWorld.z > 1) continue

      const px = (this.tempWorld.x * 0.5 + 0.5) * viewportWidth
      const py = (-this.tempWorld.y * 0.5 + 0.5) * viewportHeight
      this.tempView
        .set(this.positions[i3], this.positions[i3 + 1], this.positions[i3 + 2])
        .applyMatrix4(this.points.matrixWorld)
        .applyMatrix4(camera.matrixWorldInverse)
      const ndcShiftX = this.computeParallaxNdcShiftX(this.redshifts[i], maxRedshift, minRedshift, fov, camera, this.tempView.z)
      const ndcShiftY = this.computeParallaxNdcShiftY(this.redshifts[i], maxRedshift, minRedshift, fov, camera, this.tempView.z)
      const shiftedPx = px + ndcShiftX * 0.5 * viewportWidth
      const shiftedPy = py - ndcShiftY * 0.5 * viewportHeight

      const pointSizePx = this.estimatePointSizePx(this.sizes[i], alpha, pixelRatio, fov, detailMix)
      const half = pointSizePx * 0.5

      const dx = screenX - shiftedPx
      const dy = screenY - shiftedPy
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
    const basePx = size * pixelRatio * fovScale * sizeScale * 2.35
    const detailBoost = 1 + 0.18 * detailMix
    const farBoost = 1.15 - 0.15 * detailMix
    return Math.max(1.1 * pixelRatio, basePx * detailBoost * farBoost)
  }

  /** Match shader redshift visibility curve. */
  private computeVisibilityAlpha(redshift: number, maxRedshift: number, minRedshift: number): number {
    if (redshift < minRedshift || redshift > maxRedshift) return 0
    
    // Far fade — matches shader: outer 30% fades
    let farAlpha = 1.0
    const fadeStart = maxRedshift * 0.7
    if (redshift > fadeStart) {
      farAlpha = this.smoothstep(maxRedshift, fadeStart, redshift)
    }

    // Near fade
    let nearAlpha = 1.0
    const nearFadeEnd = minRedshift * 1.5
    if (redshift < nearFadeEnd) {
      nearAlpha = this.smoothstep(minRedshift, nearFadeEnd, redshift)
    }

    return Math.min(farAlpha, nearAlpha)
  }

  /**
   * Compute alpha from a logarithmic depth window around camera focus.
   * Balanced: enough depth for cool look, narrow enough to reduce overlap for browsing.
   */
  private computeDepthWindowAlpha(logOffset: number, fov: number): number {
    const zoomMix = this.smoothstep(72, 12, fov)
    const farFadeStart = this.mix(0.4, 0.2, zoomMix)
    const farFadeEnd = this.mix(0.95, 0.55, zoomMix)
    const nearFadeStart = this.mix(-0.4, -0.2, zoomMix)
    const nearFadeEnd = this.mix(-1.5, -0.85, zoomMix)

    if (logOffset < nearFadeEnd || logOffset > farFadeEnd) return 0.0
    if (logOffset < nearFadeStart) return this.smoothstep(nearFadeEnd, nearFadeStart, logOffset)
    if (logOffset > farFadeStart) return 1.0 - this.smoothstep(farFadeStart, farFadeEnd, logOffset)
    return 1.0
  }

  /**
   * Compute size growth while keeping deep-field rendering conservative.
   * Foreground objects can grow modestly, while background objects shrink.
   */
  private computeGrowthMultiplier(logOffset: number): number {
    if (logOffset >= 0) {
      return 1.0 - 0.38 * this.smoothstep(0.0, 1.0, logOffset)
    }

    const foregroundProximity = this.smoothstep(-0.78, -0.05, logOffset)
    return 1.15 + 2.7 * foregroundProximity
  }

  /**
   * Fade foreground to reduce overlap while still letting galaxies grow into view.
   */
  private computeForegroundFade(logOffset: number, fov: number): number {
    const zoomMix = this.smoothstep(72, 12, fov)
    const fadeStart = this.mix(-0.4, -0.2, zoomMix)
    const fadeEnd = this.mix(-1.3, -0.75, zoomMix)
    if (logOffset >= fadeStart) return 1.0
    if (logOffset <= fadeEnd) return 0.0
    return this.smoothstep(fadeEnd, fadeStart, logOffset)
  }

  /**
   * Reproduce vertex parallax shift in NDC for hit-testing.
   */
  private computeParallaxNdcShiftX(
    redshift: number,
    maxRedshift: number,
    minRedshift: number,
    fov: number,
    camera: THREE.PerspectiveCamera,
    viewZ: number
  ): number {
    const parallaxZoomMix = this.smoothstep(75, 16, fov)
    const parallaxMix = this.mix(0.32, 1.0, parallaxZoomMix)
    const nearFactor = 1.0 - this.smoothstep(minRedshift, maxRedshift, redshift)
    const depthMix = this.mix(0.45, 1.0, nearFactor)
    const viewShiftX = this.latestPointerParallaxX * parallaxMix * depthMix * 29.0
    const proj00 = camera.projectionMatrix.elements[0]
    const safeDepth = Math.max(0.001, -viewZ)
    return (viewShiftX * proj00) / safeDepth
  }

  /**
   * Reproduce vertex vertical parallax shift in NDC for hit-testing.
   */
  private computeParallaxNdcShiftY(
    redshift: number,
    maxRedshift: number,
    minRedshift: number,
    fov: number,
    camera: THREE.PerspectiveCamera,
    viewZ: number
  ): number {
    const parallaxZoomMix = this.smoothstep(75, 16, fov)
    const parallaxMix = this.mix(0.32, 1.0, parallaxZoomMix)
    const nearFactor = 1.0 - this.smoothstep(minRedshift, maxRedshift, redshift)
    const depthMix = this.mix(0.45, 1.0, nearFactor)
    const viewShiftY = this.latestPointerParallaxY * parallaxMix * depthMix * 21.0
    const proj11 = camera.projectionMatrix.elements[5]
    const safeDepth = Math.max(0.001, -viewZ)
    return (viewShiftY * proj11) / safeDepth
  }

  private clamp01(v: number): number {
    return Math.max(0, Math.min(1, v))
  }

  /**
   * Clamp a scalar into the provided range.
   */
  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v))
  }

  private smoothstep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp01((x - edge0) / (edge1 - edge0))
    return t * t * (3 - 2 * t)
  }

  /**
   * Linear interpolation helper.
   */
  private mix(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
    this.atlasTexture.dispose()
  }
}
