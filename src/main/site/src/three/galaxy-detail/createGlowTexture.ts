import * as THREE from 'three'

function smoothstepJs(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * Pre-bakes the particle glow envelope into a 64×64 RGBA texture.
 * Channels: R = corona intensity, G = core intensity, B = 0, A = alpha envelope.
 * Replaces per-fragment exp/pow computations in both WebGL and WebGPU paths.
 */
export function createGlowTexture(): THREE.DataTexture {
  const SIZE = 64
  const data = new Uint8Array(SIZE * SIZE * 4)

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const cx = (col / (SIZE - 1)) * 2.0 - 1.0
      const cy = (row / (SIZE - 1)) * 2.0 - 1.0
      const dist = Math.sqrt(cx * cx + cy * cy)

      let r = 0, g = 0, a = 0
      if (dist <= 1.0) {
        const edge = 1.0 - smoothstepJs(0.62, 1.0, dist)
        const core = Math.exp(-dist * dist * 34.0)
        const innerCorona = Math.exp(-dist * dist * 5.2) * 0.42
        const outerCorona = Math.exp(-dist * dist * 1.55) * 0.28
        const rays = Math.pow(Math.max(0, 1.0 - Math.abs(cx * cy) * 7.0), 5.0)
                   * Math.exp(-dist * dist * 5.0) * 0.07

        const corona = innerCorona + outerCorona + rays
        r = corona
        g = core
        a = Math.min(1, (core * 1.2 + innerCorona + outerCorona * 0.95 + rays) * edge)
      }

      const i = (row * SIZE + col) * 4
      data[i]     = Math.round(r * 255)
      data[i + 1] = Math.round(g * 255)
      data[i + 2] = 0
      data[i + 3] = Math.round(a * 255)
    }
  }

  const tex = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat, THREE.UnsignedByteType)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}
