/**
 * GPU Compute Shader — Per-Frame Physics Update
 *
 * Runs every frame to:
 * - Apply fake orbit lifecycle (fade-in → orbit → fade-out → reset)
 * - Prevent spiral arm winding by computing rotation from original position
 * - Twinkle modulation for bright-layer stars
 */

import {
  instanceIndex,
  float,
  Fn,
  If,
  length,
  sin,
  fract,
  max,
  min,
  smoothstep,
  vec3,
} from 'three/tsl'
import type { GalaxyBuffers, GalaxyUniforms } from './GalaxyComputeInit'
import { hash, applyDifferentialRotation, rotateXZ } from './tsl-helpers'

export function createComputeUpdate(
  count: number,
  buffers: GalaxyBuffers,
  uniforms: GalaxyUniforms,
) {
  const computeUpdate = Fn(() => {
    const idx = instanceIndex
    const position = buffers.positionBuffer.element(idx).toVar()
    const originalPos = buffers.originalPositionBuffer.element(idx).toVar()
    const layer = buffers.layerBuffer.element(idx)

    // ─── Fake orbit lifecycle ──────────────────────────────────────────
    // Each star has a random phase offset. During its lifecycle:
    //   fade in (8%) → orbit with differential rotation → fade out (8%) → reset
    // ~84% of stars visible at any time. Arms never accumulate winding.
    const cycleDuration = uniforms.orbitCycleDuration
    const fadeInFrac = uniforms.orbitFadeIn
    const fadeOutFrac = uniforms.orbitFadeOut

    // Per-star random phase offset [0, 1)
    const starPhaseOffset = hash(idx.toFloat().mul(0.7531).add(42.0))

    // Current lifecycle phase [0, 1)
    const phase = fract(uniforms.time.div(max(cycleDuration, float(0.1))).add(starPhaseOffset))

    // Fade envelope
    const fadeIn = smoothstep(float(0), fadeInFrac, phase)
    const fadeOut = float(1).sub(smoothstep(float(1).sub(fadeOutFrac), float(1), phase))
    const fadeAlpha = min(fadeIn, fadeOut)

    // ─── Rotation from original position ──────────────────────────────
    // Compute rotation FROM originalPos based on cycle elapsed time.
    // This prevents winding because each star resets when its cycle ends.
    const cycleElapsed = phase.mul(cycleDuration)

    If(uniforms.barLength.greaterThan(0), () => {
      const distFromCenter = length(vec3(originalPos.x, float(0), originalPos.z))
      const rigidAngle = uniforms.rotationSpeed.mul(cycleElapsed).negate()

      If(distFromCenter.lessThan(uniforms.barLength), () => {
        // Inside bar: rigid-body rotation
        position.assign(rotateXZ(originalPos, rigidAngle))
      }).Else(() => {
        // Outside bar: differential rotation
        position.assign(applyDifferentialRotation(
          originalPos, uniforms.rotationSpeed, cycleElapsed,
        ))
      })
    }).Else(() => {
      // Non-barred: differential rotation from original
      // Elliptical/irregular have rotationSpeed=0, so this is a no-op
      position.assign(applyDifferentialRotation(
        originalPos, uniforms.rotationSpeed, cycleElapsed,
      ))
    })

    buffers.positionBuffer.element(idx).assign(position)

    // ─── Apply fade to alpha channel ──────────────────────────────────
    // Read base alpha from velocity buffer (stored during init)
    const baseAlpha = buffers.velocityBuffer.element(idx).x

    buffers.colorBuffer.element(idx).w.assign(baseAlpha.mul(fadeAlpha))

    // ─── Twinkle for bright layer (layer == 1) ────────────────────────
    // Layer mapping: 0=star, 1=bright (dust layer was removed)
    If(layer.equal(1), () => {
      const twinklePhase = idx.toFloat().mul(0.7831)
      const twinkle = sin(uniforms.time.mul(2).add(twinklePhase)).mul(0.15).add(0.85)
      buffers.colorBuffer.element(idx).w.assign(baseAlpha.mul(fadeAlpha).mul(twinkle))
    })
  })().compute(count)

  return computeUpdate
}
