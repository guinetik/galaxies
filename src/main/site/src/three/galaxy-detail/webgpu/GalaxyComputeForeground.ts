/**
 * GPU Compute Shader — Foreground Star Detection
 *
 * Runs every frame to determine which stars are in front of the black hole
 * and overlapping its screen footprint. Writes a per-particle foreground alpha
 * (0 = background/lensed, 1 = foreground/on top of BH).
 *
 * This is the WebGPU equivalent of the CPU-side foreground/background split
 * in the WebGL GalaxyParticles.update() method.
 */

import {
  instanceIndex,
  Fn,
  float,
  uniform,
  sqrt,
  max,
  smoothstep,
} from 'three/tsl'
import * as THREE from 'three'
import type { GalaxyBuffers } from './GalaxyComputeInit'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ForegroundUniforms {
  // MVP matrix rows (for NDC projection): each is (m[row], m[row+4], m[row+8], m[row+12])
  mvpRow0: ReturnType<typeof uniform>
  mvpRow1: ReturnType<typeof uniform>
  mvpRow3: ReturnType<typeof uniform>
  // View matrix Z-row (for view-space depth)
  viewZRow: ReturnType<typeof uniform>
  // Pre-computed BH parameters (computed on CPU each frame)
  bhViewZ: ReturnType<typeof uniform>
  bhNdcX: ReturnType<typeof uniform>
  bhNdcY: ReturnType<typeof uniform>
  ndcRadiusX: ReturnType<typeof uniform>
  ndcRadiusY: ReturnType<typeof uniform>
  depthThreshold: ReturnType<typeof uniform>
  depthSoftness: ReturnType<typeof uniform>
}

export function createForegroundUniforms(): ForegroundUniforms {
  return {
    mvpRow0: uniform(new THREE.Vector4()),
    mvpRow1: uniform(new THREE.Vector4()),
    mvpRow3: uniform(new THREE.Vector4()),
    viewZRow: uniform(new THREE.Vector4()),
    bhViewZ: uniform(0),
    bhNdcX: uniform(0),
    bhNdcY: uniform(0),
    ndcRadiusX: uniform(0.04),
    ndcRadiusY: uniform(0.04),
    depthThreshold: uniform(6.0),
    depthSoftness: uniform(10.0),
  }
}

// ─── Compute shader ───────────────────────────────────────────────────────

export function createComputeForeground(
  count: number,
  buffers: GalaxyBuffers,
  fg: ForegroundUniforms,
) {
  const computeForeground = Fn(() => {
    const idx = instanceIndex
    const pos: any = buffers.positionBuffer.element(idx)

    // Manual dot product: clipX = dot(mvpRow0, vec4(pos, 1))
    const r0: any = fg.mvpRow0
    const r1: any = fg.mvpRow1
    const r3: any = fg.mvpRow3
    const vz: any = fg.viewZRow

    const clipX = r0.x.mul(pos.x).add(r0.y.mul(pos.y)).add(r0.z.mul(pos.z)).add(r0.w)
    const clipY = r1.x.mul(pos.x).add(r1.y.mul(pos.y)).add(r1.z.mul(pos.z)).add(r1.w)
    const clipW = r3.x.mul(pos.x).add(r3.y.mul(pos.y)).add(r3.z.mul(pos.z)).add(r3.w)

    // View-space Z (for depth comparison with BH)
    const viewZ = vz.x.mul(pos.x).add(vz.y.mul(pos.y)).add(vz.z.mul(pos.z)).add(vz.w)

    // NDC position
    const invW = float(1.0).div(max(clipW, float(0.0001)))
    const ndcX = clipX.mul(invW)
    const ndcY = clipY.mul(invW)

    // Overlap with BH screen footprint (elliptical)
    const dx = ndcX.sub(fg.bhNdcX).div(fg.ndcRadiusX)
    const dy = ndcY.sub(fg.bhNdcY).div(fg.ndcRadiusY)
    const overlap = float(1.0).sub(
      smoothstep(float(0.75), float(1.25), sqrt(dx.mul(dx).add(dy.mul(dy)))),
    )

    // Depth test: star must be in front of BH (view-space Z is negative in front)
    // viewZ - bhViewZ > threshold means star is closer to camera
    const frontDepth = smoothstep(
      fg.depthThreshold,
      fg.depthThreshold.add(fg.depthSoftness),
      viewZ.sub(fg.bhViewZ),
    )

    buffers.foregroundAlphaBuffer.element(idx).assign(overlap.mul(frontDepth))
  })().compute(count)

  return computeForeground
}
