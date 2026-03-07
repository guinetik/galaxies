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

const gradeIntergalacticBackdrop = Fn(([color]: [any]) => {
  const peak = max(color.r, max(color.g, color.b))
  const floor = min(color.r, min(color.g, color.b))
  const saturation = peak.sub(floor)

  const nebulaMask = smoothstep(float(0.06), float(0.30), saturation)
    .mul(float(1.0).sub(smoothstep(float(0.28), float(0.95), peak)))

  const graded = pow(max(color, vec3(0.0)), vec3(1.14, 1.14, 1.14))
  return graded.mul(mix(float(0.90), float(0.45), nebulaMask))
})

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

      const lensZoom = clamp(uLensStrength.div(0.03), float(0.0), float(1.0))

      // Match the WebGL lensing falloff more closely.
      const radius = mix(float(0.20), float(0.40), lensZoom)
      const falloff = smoothstep(radius, float(0.0), dist).toVar()
      falloff.mulAssign(falloff) // squared for steep drop-off

      const innerRadius = mix(float(0.012), float(0.05), lensZoom)
      const innerMask = smoothstep(innerRadius, innerRadius.mul(2.8), dist)
      const softDist = max(dist, mix(float(0.028), float(0.04), lensZoom))
      const deflection = uLensStrength
        .mul(falloff)
        .mul(innerMask)
        .mul(mix(float(0.11), float(0.22), lensZoom).div(softDist))

      // Compute offset and undo aspect correction
      const offset = dir.mul(deflection).toVar()
      offset.x.divAssign(uAspectRatio)

      const distortedUV = clamp(currentUV.add(offset), float(0.0), float(1.0))

      const col = galaxyColor.sample(distortedUV).toVar()
      col.rgb.assign(gradeIntergalacticBackdrop(col.rgb))

      // Keep the lensing glow subtle so the BH shader remains the main ring source.
      const ringRadius = mix(float(0.024), float(0.09), lensZoom)
      const ringWidth = mix(float(0.008), float(0.024), lensZoom)
      const ring = exp(pow(dist.sub(ringRadius).div(ringWidth), float(2.0)).negate())
      const ringIntensity = ring
        .mul(falloff)
        .mul(innerMask)
        .mul(uLensStrength)
        .mul(mix(float(10.0), float(16.0), lensZoom))
      col.rgb.addAssign(vec3(0.6, 0.7, 1.0).mul(ringIntensity.mul(0.05)))

      return col
    })

    const lensedGalaxy = lensingFn()

    // ─── Bloom (galaxy only — BH excluded) ─────────────────────────
    this.bloomPassNode = bloom(galaxyColor)
    this.bloomPassNode.threshold.value = 0.16
    this.bloomPassNode.strength.value = 0.18
    this.bloomPassNode.radius.value = 0.12

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
