/**
 * WebGPU Post-Processing — Bloom + Gravitational Lensing + BH Composite
 *
 * Pipeline mirrors WebGL's layer-based architecture:
 *   galaxyScene → lensing → bloom → composite BH on top → additive foreground stars
 *
 * Three scene passes:
 *   1. Galaxy scene (particles, clouds — no BH, dimmed foreground stars)
 *   2. BH scene (black hole mesh only)
 *   3. Foreground scene (stars in front of BH, additive glow)
 *
 * The black hole is NEVER affected by bloom or lensing, matching WebGL behavior.
 * Foreground stars are added on top of everything, matching WebGL renderOrder=2.
 */

import * as THREE from 'three/webgpu'
import {
  uniform,
  Fn,
  vec2,
  vec3,
  vec4,
  float,
  screenUV,
  length,
  max,
  min,
  mix,
  smoothstep,
  clamp,
  exp,
  pow,
} from 'three/tsl'
import { pass } from 'three/tsl'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'

export class GalaxyPostProcessing {
  readonly postProcessing: THREE.PostProcessing
  private bloomPassNode: any

  // Lensing uniforms
  private uBHScreenPos = uniform(new THREE.Vector2(0.5, 0.5))
  private uLensStrength = uniform(0.0)
  private uAspectRatio = uniform(1.0)

  constructor(
    renderer: THREE.WebGPURenderer,
    galaxyScene: THREE.Scene,
    bhScene: THREE.Scene,
    foregroundScene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ) {
    this.postProcessing = new THREE.PostProcessing(renderer)

    // ─── Pass 1: Galaxy scene (particles, clouds — no BH) ──────────
    const galaxyPass = pass(galaxyScene, camera)
    const galaxyColor = galaxyPass.getTextureNode()

    // ─── Pass 2: BH scene (rendered separately) ────────────────────
    const bhPass = pass(bhScene, camera)
    const bhColor = bhPass.getTextureNode()

    // ─── Pass 3: Foreground stars (additive glow on top) ───────────
    const fgPass = pass(foregroundScene, camera)
    const fgColor = fgPass.getTextureNode()

    // ─── Lensing — distort galaxy UVs near the black hole ──────────
    const uBHScreenPos = this.uBHScreenPos
    const uLensStrength = this.uLensStrength
    const uAspectRatio = this.uAspectRatio

    const lensingFn = Fn(() => {
      const currentUV = screenUV.toVar()

      // Vector from pixel to black hole center (aspect-corrected)
      const toBH = uBHScreenPos.sub(currentUV).toVar()
      toBH.x.mulAssign(uAspectRatio)

      const dist = length(toBH)
      const dir = toBH.div(max(dist, float(0.0001)))

      // Compact lensing falloff
      const radius = float(0.45)
      const falloff = smoothstep(radius, float(0.0), dist).toVar()
      falloff.mulAssign(falloff) // squared for steep drop-off

      const softDist = max(dist, float(0.03))
      const deflection = uLensStrength.mul(falloff).mul(float(0.12).div(softDist))

      // Compute offset and undo aspect correction
      const offset = dir.mul(deflection).toVar()
      offset.x.divAssign(uAspectRatio)

      const distortedUV = clamp(currentUV.add(offset), float(0.0), float(1.0))

      const col = galaxyColor.sample(distortedUV).toVar()

      // Einstein ring glow at characteristic radius
      const ringRadius = float(0.06)
      const ring = exp(pow(dist.sub(ringRadius).div(0.02), float(2.0)).negate())
      const ringIntensity = ring.mul(falloff).mul(uLensStrength).mul(12.0)
      col.rgb.addAssign(vec3(0.6, 0.7, 1.0).mul(ringIntensity.mul(0.18)))

      return col
    })

    const lensedGalaxy = lensingFn()

    // ─── Bloom (galaxy only — BH excluded) ─────────────────────────
    this.bloomPassNode = bloom(galaxyColor)
    this.bloomPassNode.threshold.value = 0.1
    this.bloomPassNode.strength.value = 0.3
    this.bloomPassNode.radius.value = 0.2

    // ─── Composite: lensed galaxy + bloom → BH on top → fg additive ─
    const galaxyResult = lensedGalaxy.add(this.bloomPassNode)

    const compositeFn = Fn(() => {
      const bg: any = galaxyResult
      const bh: any = bhColor
      const fg: any = fgColor

      // Step 1: Alpha-blend BH over the lensed+bloomed galaxy
      const bhComposite = mix(bg.rgb, bh.rgb, bh.a)

      // Step 2: Add foreground star glow on top (additive)
      const outRGB = bhComposite.add(fg.rgb)

      const outA = max(bg.a, max(bh.a, fg.a))
      return vec4(min(outRGB, float(1.0)), outA)
    })

    this.postProcessing.outputNode = compositeFn()
  }

  render(): void {
    this.postProcessing.render()
  }

  updateBloom(strength: number, radius: number, threshold: number): void {
    this.bloomPassNode.strength.value = strength
    this.bloomPassNode.radius.value = radius
    this.bloomPassNode.threshold.value = threshold
  }

  updateLensing(
    bhScreenPos: THREE.Vector2,
    strength: number,
    aspectRatio: number,
  ): void {
    this.uBHScreenPos.value.copy(bhScreenPos)
    this.uLensStrength.value = strength
    this.uAspectRatio.value = aspectRatio
  }

  dispose(): void {
    // PostProcessing disposes with renderer
  }
}
