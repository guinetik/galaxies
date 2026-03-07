import * as THREE from 'three'
import type { Star } from './GalaxyGenerator'
import vertexShader from './shaders/particle.vert.glsl?raw'
import fragmentShader from './shaders/particle.frag.glsl?raw'

// ─── HSL to RGB conversion ─────────────────────────────────────────────────

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  }
  return [f(0), f(8), f(4)]
}

// ─── Layer-based visual mapping ─────────────────────────────────────────────

function layerSaturation(layer: Star['layer']): number {
  switch (layer) {
    case 'dust':   return 0.3
    case 'star':   return 0.65
    case 'bright': return 0.5
  }
}

function layerLightness(layer: Star['layer'], brightness: number): number {
  switch (layer) {
    case 'dust':   return brightness * 0.4
    case 'star':   return brightness * 0.6
    case 'bright': return brightness * 0.85
  }
}

// ─── Galaxy particle renderer ───────────────────────────────────────────────

/**
 * Renders star data as THREE.Points with glow shaders and differential
 * rotation animation. Each star is a single point-sprite with additive
 * blending and a GLOW fragment shader for soft halos.
 */
export class GalaxyParticles {
  readonly points: THREE.Points
  readonly foregroundPoints: THREE.Points
  private backgroundGeometry: THREE.BufferGeometry
  private foregroundGeometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial
  private foregroundMaterial: THREE.ShaderMaterial
  private stars: Star[]
  private angleOffsets: Float32Array
  private baseAlphas: Float32Array
  private baseDistance: number

  constructor(stars: Star[], baseDistance = 600) {
    this.stars = stars
    this.baseDistance = baseDistance
    const count = stars.length

    // ─── Build attribute buffers ──────────────────────────────────────

    const positions = new Float32Array(count * 3)
    const backgroundColors = new Float32Array(count * 4)
    const foregroundColors = new Float32Array(count * 4)
    const sizes = new Float32Array(count)
    this.angleOffsets = new Float32Array(count)
    this.baseAlphas = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const star = stars[i]

      // Polar → Cartesian
      const x = star.radius * Math.cos(star.angle)
      const z = star.radius * Math.sin(star.angle)
      positions[i * 3]     = x
      positions[i * 3 + 1] = star.y
      positions[i * 3 + 2] = z

      // HSL → RGB with layer-dependent saturation and lightness
      const s = layerSaturation(star.layer)
      const l = layerLightness(star.layer, star.brightness)
      const [r, g, b] = hslToRgb(star.hue, s, l)
      backgroundColors[i * 4] = foregroundColors[i * 4] = r
      backgroundColors[i * 4 + 1] = foregroundColors[i * 4 + 1] = g
      backgroundColors[i * 4 + 2] = foregroundColors[i * 4 + 2] = b
      backgroundColors[i * 4 + 3] = star.alpha
      foregroundColors[i * 4 + 3] = 0

      sizes[i] = star.size
      this.angleOffsets[i] = star.angle
      this.baseAlphas[i] = star.alpha
    }

    // ─── Geometry ─────────────────────────────────────────────────────

    const positionAttr = new THREE.BufferAttribute(positions, 3)
    const sizeAttr = new THREE.BufferAttribute(sizes, 1)

    this.backgroundGeometry = new THREE.BufferGeometry()
    this.backgroundGeometry.setAttribute('position', positionAttr)
    this.backgroundGeometry.setAttribute('aColor', new THREE.BufferAttribute(backgroundColors, 4))
    this.backgroundGeometry.setAttribute('aSize', sizeAttr)

    this.foregroundGeometry = new THREE.BufferGeometry()
    this.foregroundGeometry.setAttribute('position', positionAttr)
    this.foregroundGeometry.setAttribute('aColor', new THREE.BufferAttribute(foregroundColors, 4))
    this.foregroundGeometry.setAttribute('aSize', sizeAttr)

    // ─── Material ─────────────────────────────────────────────────────

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uBaseDistance: { value: baseDistance },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.foregroundMaterial = this.material.clone()
    this.foregroundMaterial.uniforms = {
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uBaseDistance: { value: baseDistance },
    }

    this.points = new THREE.Points(this.backgroundGeometry, this.material)
    this.points.frustumCulled = false

    this.foregroundPoints = new THREE.Points(this.foregroundGeometry, this.foregroundMaterial)
    this.foregroundPoints.frustumCulled = false
    this.foregroundPoints.renderOrder = 2
  }

  // ─── Per-frame update ───────────────────────────────────────────────────────

  /**
   * Updates star positions and splits visibility into background (lensed) and
   * foreground (unlensed) layers using camera-relative depth to the black hole.
   * A star is only considered foreground if it is both clearly closer than the
   * black hole and projected inside the black hole screen footprint.
   */
  update(
    dt: number,
    time: number,
    camera: THREE.PerspectiveCamera,
    bhNdcX: number,
    bhNdcY: number,
    bhRadiusPx: number,
    viewportWidth: number,
    viewportHeight: number,
  ): void {
    const stars = this.stars
    const count = stars.length
    const posAttr = this.backgroundGeometry.getAttribute('position') as THREE.BufferAttribute
    const backgroundColorAttr = this.backgroundGeometry.getAttribute('aColor') as THREE.BufferAttribute
    const foregroundColorAttr = this.foregroundGeometry.getAttribute('aColor') as THREE.BufferAttribute
    const positions = posAttr.array as Float32Array
    const backgroundColors = backgroundColorAttr.array as Float32Array
    const foregroundColors = foregroundColorAttr.array as Float32Array
    const viewMatrix = camera.matrixWorldInverse.elements
    const projMatrix = camera.projectionMatrix.elements
    const bhViewZ = viewMatrix[14]
    const cameraDistance = camera.position.length()
    const edgeOnMix = THREE.MathUtils.smoothstep(
      1.0 - Math.abs(camera.position.y) / Math.max(cameraDistance, 0.0001),
      0.55,
      0.95,
    )
    const depthThreshold = THREE.MathUtils.lerp(
      Math.max(this.baseDistance * 0.03, 6.0),
      Math.max(this.baseDistance * 0.004, 0.75),
      edgeOnMix,
    )
    const depthSoftness = THREE.MathUtils.lerp(
      Math.max(this.baseDistance * 0.06, 10.0),
      Math.max(this.baseDistance * 0.018, 3.0),
      edgeOnMix,
    )
    const overlapScale = THREE.MathUtils.lerp(0.75, 1.2, edgeOnMix)
    const ndcRadiusX = Math.max((bhRadiusPx * overlapScale) / Math.max(viewportWidth * 0.5, 1), 0.04)
    const ndcRadiusY = Math.max((bhRadiusPx * overlapScale) / Math.max(viewportHeight * 0.5, 1), 0.04)

    for (let i = 0; i < count; i++) {
      const star = stars[i]

      // Differential rotation
      this.angleOffsets[i] += star.rotationSpeed * dt
      const angle = this.angleOffsets[i]
      positions[i * 3]     = star.radius * Math.cos(angle)
      positions[i * 3 + 2] = star.radius * Math.sin(angle)

      let alpha = this.baseAlphas[i]

      // Twinkle — bright layer only for performance
      if (star.layer === 'bright') {
        const twinkle = Math.sin(time * 2 + star.twinklePhase) * 0.15 + 0.85
        alpha *= twinkle
      }

      const posX = positions[i * 3]
      const posY = positions[i * 3 + 1]
      const posZ = positions[i * 3 + 2]
      const viewX = viewMatrix[0] * posX + viewMatrix[4] * posY + viewMatrix[8] * posZ + viewMatrix[12]
      const viewY = viewMatrix[1] * posX + viewMatrix[5] * posY + viewMatrix[9] * posZ + viewMatrix[13]
      const viewZ = viewMatrix[2] * posX + viewMatrix[6] * posY + viewMatrix[10] * posZ + viewMatrix[14]

      const clipX = projMatrix[0] * viewX + projMatrix[4] * viewY + projMatrix[8] * viewZ + projMatrix[12]
      const clipY = projMatrix[1] * viewX + projMatrix[5] * viewY + projMatrix[9] * viewZ + projMatrix[13]
      const clipW = projMatrix[3] * viewX + projMatrix[7] * viewY + projMatrix[11] * viewZ + projMatrix[15]
      const invW = clipW !== 0 ? 1 / clipW : 0
      const starNdcX = clipX * invW
      const starNdcY = clipY * invW

      const dx = (starNdcX - bhNdcX) / ndcRadiusX
      const dy = (starNdcY - bhNdcY) / ndcRadiusY
      const overlap = 1 - THREE.MathUtils.smoothstep(0.75, 1.25, Math.sqrt(dx * dx + dy * dy))

      // Camera-space z is negative in front of the camera; values closer to 0
      // are foreground. Only clearly-nearer stars inside the BH footprint stay
      // unlensed. Everything else remains in the lensed background field.
      const frontDepth = THREE.MathUtils.smoothstep(
        viewZ - bhViewZ,
        depthThreshold,
        depthThreshold + depthSoftness,
      )
      const frontMix = overlap * frontDepth
      backgroundColors[i * 4 + 3] = alpha * (1 - frontMix)
      foregroundColors[i * 4 + 3] = alpha * frontMix
    }

    posAttr.needsUpdate = true
    backgroundColorAttr.needsUpdate = true
    foregroundColorAttr.needsUpdate = true
  }

  // ─── Cleanup ────────────────────────────────────────────────────────────────

  dispose(): void {
    this.backgroundGeometry.dispose()
    this.foregroundGeometry.dispose()
    this.material.dispose()
    this.foregroundMaterial.dispose()
  }
}
