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
  private material: THREE.ShaderMaterial
  private geometry: THREE.BufferGeometry

  constructor(galaxies: Galaxy[], atlasTexture: THREE.Texture) {
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
        // Pseudo-random color from a natural galaxy palette for unknowns
        // Use galaxy ID as seed for deterministic variety
        const seed = (g.id * 2654435761) >>> 0 // integer hash
        const t = (seed % 1000) / 1000
        // Blend between warm (old pop) and cool (young pop) based on hash
        if (t < 0.35) {
          // Warm gold/amber — elliptical-like
          baseColor = [1.0, 0.65 + t, 0.25 + t * 0.3]
        } else if (t < 0.65) {
          // White/cream — lenticular-like
          baseColor = [0.9 + t * 0.1, 0.85 + t * 0.1, 0.7 + t * 0.2]
        } else if (t < 0.85) {
          // Blue-white — spiral-like
          baseColor = [0.35 + t * 0.2, 0.6 + t * 0.2, 0.9 + t * 0.1]
        } else {
          // Pale rose/pink — starburst
          baseColor = [0.95, 0.6 + t * 0.2, 0.7 + t * 0.15]
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

      // Texture atlas index — randomize for unknowns so they get varied shapes
      if (morphClass === 'unknown') {
        const seed = (g.id * 2654435761) >>> 0
        texIndices[i] = seed % 6
      } else {
        texIndices[i] = morphologyToAtlasIndex(morphClass)
      }
    }

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
        uTexture: { value: atlasTexture },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.frustumCulled = false
  }

  update(elapsed: number, maxRedshift: number): void {
    this.material.uniforms.uTime.value = elapsed
    this.material.uniforms.uMaxRedshift.value = maxRedshift
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
