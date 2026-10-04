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
  private scenePasses: ReturnType<typeof pass>[]

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
    postFxScale = 1.0,
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
    this.scenePasses = [galaxyPass, bhPass, fgPass]

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
      const radius = mix(float(0.25), float(0.55), lensZoom)
      const falloff = smoothstep(radius, float(0.0), dist).toVar()
      falloff.mulAssign(falloff) // squared for steep drop-off

      const innerRadius = mix(float(0.012), float(0.05), lensZoom)
      const innerMask = smoothstep(innerRadius, innerRadius.mul(2.8), dist)
      const softDist = max(dist, mix(float(0.028), float(0.04), lensZoom))
      const deflection = uLensStrength
        .mul(falloff)
        .mul(innerMask)
        .mul(mix(float(0.15), float(0.30), lensZoom).div(softDist))

      // Compute offset and undo aspect correction
      const offset = dir.mul(deflection).toVar()
      offset.x.divAssign(uAspectRatio)

      const distortedUV = clamp(currentUV.add(offset), float(0.0), float(1.0))

      const col = galaxyColor.sample(distortedUV).toVar()

      // Keep the lensing glow subtle so the BH shader remains the main ring source.
      const ringRadius = mix(float(0.024), float(0.09), lensZoom)
      const ringWidth = mix(float(0.008), float(0.024), lensZoom)
      const ring = exp(pow(dist.sub(ringRadius).div(ringWidth), float(2.0)).negate())
      const ringIntensity = ring
        .mul(falloff)
        .mul(innerMask)
        .mul(uLensStrength)
        .mul(mix(float(10.0), float(16.0), lensZoom))
      col.rgb.addAssign(vec3(0.72, 0.62, 0.46).mul(ringIntensity.mul(0.02)))

      return col
    })

    const lensedGalaxy = lensingFn()

    // ─── Bloom (galaxy only — BH excluded) ─────────────────────────
    this.bloomPassNode = bloom(galaxyColor)
    this.bloomPassNode.threshold.value = 0.2
    this.bloomPassNode.strength.value = 0.12
    this.bloomPassNode.radius.value = 0.08

    // At 4K+, raise threshold to reduce luminance-pass write traffic
    if (postFxScale < 1.0) {
      this.bloomPassNode.threshold.value = 0.35
    }

    // ─── Composite: lensed galaxy + bloom → BH on top → fg additive ─
    const galaxyResult = lensedGalaxy.add(this.bloomPassNode)

    const compositeFn = Fn(() => {
      const bg: any = galaxyResult
      const bh: any = bhColor
      const fg: any = fgColor

      // Step 1: Alpha-blend BH over the lensed+bloomed galaxy
      const bhComposite = mix(bg.rgb, bh.rgb.mul(vec3(1.05, 0.95, 0.84)), bh.a)

      // Step 2: Add foreground star glow on top (additive)
      const outRGB = bhComposite.add(fg.rgb)

      const outA = max(bg.a, max(bh.a, fg.a))
      return vec4(outRGB.div(vec3(1.0).add(outRGB)), outA)
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
    this.postProcessing.dispose()
    this.bloomPassNode.dispose()
    this.scenePasses.forEach(scenePass => scenePass.dispose())
  }
}
