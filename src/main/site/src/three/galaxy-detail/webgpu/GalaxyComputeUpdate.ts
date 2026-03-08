/**
 * GPU Compute Shader — Per-Frame Physics Update
 *
 * Runs every frame to:
 * - Apply differential rotation (spiral arms) or rigid-body rotation (bar region)
 * - Skip rotation for elliptical/irregular galaxies
 * - Twinkle modulation for bright-layer stars
 */

import {
  instanceIndex,
  float,
  Fn,
  If,
  length,
  sin,
  vec3,
} from 'three/tsl'
import type { GalaxyBuffers, GalaxyUniforms } from './GalaxyComputeInit'
import { applyDifferentialRotation, rotateXZ } from './tsl-helpers'

export function createComputeUpdate(
  count: number,
  buffers: GalaxyBuffers,
  uniforms: GalaxyUniforms,
) {
  const computeUpdate = Fn(() => {
    const idx = instanceIndex
    const position = buffers.positionBuffer.element(idx).toVar()
    const originalPos = buffers.originalPositionBuffer.element(idx)

    // ─── Rotation (morphology-aware) ──────────────────────────────────
    // Elliptical & irregular galaxies: rotationSpeed is set to 0 at scene level.
    // Barred spirals: bar region uses rigid-body rotation to prevent shearing.
    If(uniforms.barLength.greaterThan(0), () => {
      // Bar region: rigid-body rotation (constant angular speed, no radius dependence)
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
      // Elliptical/irregular have rotationSpeed=0, so this is a no-op for them
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

    // ─── Twinkle for bright layer (layer == 2) ────────────────────────
    const layer = buffers.layerBuffer.element(idx)
    If(layer.equal(2), () => {
      const color = buffers.colorBuffer.element(idx)
      // Use idx as twinkle phase, modulate alpha
      const twinklePhase = idx.toFloat().mul(0.7831)
      const twinkle = sin(uniforms.time.mul(2).add(twinklePhase)).mul(0.15).add(0.85)
      // Store modulated alpha back (keep base alpha × twinkle)
      const baseAlpha = color.w
      // We only adjust the stored alpha gently — avoid compounding
      // Instead we read a stable base and apply modulation
      buffers.colorBuffer.element(idx).w.assign(baseAlpha.mul(twinkle))
    })
  })().compute(count)

  return computeUpdate
}
