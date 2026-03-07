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
  private geometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial
  private stars: Star[]
  private angleOffsets: Float32Array
  private baseAlphas: Float32Array

  constructor(stars: Star[], baseDistance = 600) {
    this.stars = stars
    const count = stars.length

    // ─── Build attribute buffers ──────────────────────────────────────

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 4)
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
      colors[i * 4]     = r
      colors[i * 4 + 1] = g
      colors[i * 4 + 2] = b
      colors[i * 4 + 3] = star.alpha

      sizes[i] = star.size
      this.angleOffsets[i] = star.angle
      this.baseAlphas[i] = star.alpha
    }

    // ─── Geometry ─────────────────────────────────────────────────────

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 4))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

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

    this.points = new THREE.Points(this.geometry, this.material)
  }

  // ─── Per-frame update ───────────────────────────────────────────────────────

  update(dt: number, time: number): void {
    const stars = this.stars
    const count = stars.length
    const posAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute
    const colAttr = this.geometry.getAttribute('aColor') as THREE.BufferAttribute
    const positions = posAttr.array as Float32Array
    const colors = colAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      const star = stars[i]

      // Differential rotation
      this.angleOffsets[i] += star.rotationSpeed * dt
      const angle = this.angleOffsets[i]
      positions[i * 3]     = star.radius * Math.cos(angle)
      positions[i * 3 + 2] = star.radius * Math.sin(angle)

      // Twinkle — bright layer only for performance
      if (star.layer === 'bright') {
        const twinkle = Math.sin(time * 2 + star.twinklePhase) * 0.15 + 0.85
        colors[i * 4 + 3] = this.baseAlphas[i] * twinkle
      }
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
  }

  // ─── Cleanup ────────────────────────────────────────────────────────────────

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
