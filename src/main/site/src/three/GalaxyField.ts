import * as THREE from 'three'
import type { Galaxy } from '@/types/galaxy'
import { classifyMorphology } from '@/types/galaxy'
import { raDecToPosition, magnitudeToSize } from './celestialMath'
import { SPHERE_RADIUS, MORPHOLOGY_COLORS } from './constants'
import vertexShader from './shaders/galaxy.vert.glsl?raw'
import fragmentShader from './shaders/galaxy.frag.glsl?raw'

export class GalaxyField {
  readonly points: THREE.Points
  readonly galaxies: Galaxy[]
  private material: THREE.ShaderMaterial
  private geometry: THREE.BufferGeometry

  constructor(galaxies: Galaxy[]) {
    this.galaxies = galaxies
    const count = galaxies.length

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const redshifts = new Float32Array(count)

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
    }

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    this.geometry.setAttribute('aRedshift', new THREE.BufferAttribute(redshifts, 1))

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMaxRedshift: { value: 0.01 },
        uFov: { value: 60.0 },
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

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
