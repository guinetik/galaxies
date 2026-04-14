/**
 * GPU Compute Shader — Per-Frame Physics Update
 *
 * Runs every frame to:
 * - Apply differential rotation (spiral arms) or rigid-body rotation (bar region)
 * - Skip rotation for elliptical/irregular galaxies
 * - Fade lifecycle: per-star alpha modulation (fade-in / visible / fade-out)
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
    const originalPos = buffers.originalPositionBuffer.element(idx)
    const layer = buffers.layerBuffer.element(idx)

    // ─── Rotation (morphology-aware) ──────────────────────────────────
    // Continuous differential rotation preserves spiral arm coherence.
    // Elliptical & irregular galaxies: rotationSpeed is set to 0 at scene level.
    // Barred spirals: bar region uses rigid-body rotation to prevent shearing.
    If(uniforms.barLength.greaterThan(0), () => {
      const distFromCenter = length(vec3(position.x, float(0), position.z))
      const rigidAngle = uniforms.rotationSpeed.mul(uniforms.deltaTime).negate()

      If(distFromCenter.lessThan(uniforms.barLength), () => {
        // Inside bar: rigid-body rotation preserves bar structure
        position.assign(rotateXZ(position, rigidAngle))
        buffers.originalPositionBuffer.element(idx).assign(
          rotateXZ(originalPos, rigidAngle),
        )
      }).Else(() => {
        // Outside bar: differential rotation for spiral arms
        position.assign(applyDifferentialRotation(
          position, uniforms.rotationSpeed, uniforms.deltaTime,
        ))
        buffers.originalPositionBuffer.element(idx).assign(
          applyDifferentialRotation(
            originalPos, uniforms.rotationSpeed, uniforms.deltaTime,
          ),
        )
      })
    }).Else(() => {
      // Non-barred: differential rotation (spirals/lenticular)
      // Elliptical/irregular have rotationSpeed=0, so this is a no-op
      const rotatedPos = applyDifferentialRotation(
        position, uniforms.rotationSpeed, uniforms.deltaTime,
      )
      position.assign(rotatedPos)
      buffers.originalPositionBuffer.element(idx).assign(
        applyDifferentialRotation(
          originalPos, uniforms.rotationSpeed, uniforms.deltaTime,
        ),
      )
    })

    buffers.positionBuffer.element(idx).assign(position)

    // ─── Fade lifecycle (alpha modulation only) ───────────────────────
    // Each star gets a random phase offset → smooth fade-in / fade-out cycle.
    // ~84% of stars fully visible at any time, creating a gentle shimmer.
    // Position is NOT affected — only alpha, preserving spiral structure.
    const cycleDuration = uniforms.orbitCycleDuration
    const fadeInFrac = uniforms.orbitFadeIn
    const fadeOutFrac = uniforms.orbitFadeOut
    const starPhaseOffset = hash(idx.toFloat().mul(0.7531).add(42.0))
    const phase = fract(uniforms.time.div(max(cycleDuration, float(0.1))).add(starPhaseOffset))
    const fadeIn = smoothstep(float(0), fadeInFrac, phase)
    const fadeOut = float(1).sub(smoothstep(float(1).sub(fadeOutFrac), float(1), phase))
    const fadeAlpha = min(fadeIn, fadeOut)

    // Read base alpha from velocity buffer (stored during init)
    const baseAlpha = buffers.velocityBuffer.element(idx).x
    buffers.colorBuffer.element(idx).w.assign(baseAlpha.mul(fadeAlpha))

    // ─── Twinkle for bright layer (layer == 1) ────────────────────────
    If(layer.equal(1), () => {
      const twinklePhase = idx.toFloat().mul(0.7831)
      const twinkle = sin(uniforms.time.mul(2).add(twinklePhase)).mul(0.15).add(0.85)
      buffers.colorBuffer.element(idx).w.assign(baseAlpha.mul(fadeAlpha).mul(twinkle))
    })
  })().compute(count)

  return computeUpdate
}
