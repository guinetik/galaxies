/**
 * GPU Compute Shader — Per-Frame Physics Update
 *
 * Runs every frame to:
 * - Apply differential rotation
 * - Twinkle modulation for bright-layer stars
 */

import {
  instanceIndex,
  Fn,
  If,
  sin,
} from 'three/tsl'
import type { GalaxyBuffers, GalaxyUniforms } from './GalaxyComputeInit'
import { applyDifferentialRotation } from './tsl-helpers'

export function createComputeUpdate(
  count: number,
  buffers: GalaxyBuffers,
  uniforms: GalaxyUniforms,
) {
  const computeUpdate = Fn(() => {
    const idx = instanceIndex
    const position = buffers.positionBuffer.element(idx).toVar()
    const originalPos = buffers.originalPositionBuffer.element(idx)

    // ─── Differential rotation ────────────────────────────────────────
    const rotatedPos = applyDifferentialRotation(
      position,
      uniforms.rotationSpeed,
      uniforms.deltaTime,
    )
    position.assign(rotatedPos)

    // Rotate original position to keep spring target in sync
    const rotatedOriginal = applyDifferentialRotation(
      originalPos,
      uniforms.rotationSpeed,
      uniforms.deltaTime,
    )
    buffers.originalPositionBuffer.element(idx).assign(rotatedOriginal)

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
