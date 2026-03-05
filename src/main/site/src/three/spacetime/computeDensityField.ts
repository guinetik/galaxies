import type { GalaxyGroup } from '@/types/galaxy'

export interface DensityFieldResult {
  /** 256x256 normalized density values (0-1), row-major */
  grid: Float32Array
  /** Number of groups that fell within the slab */
  slabCount: number
  /** Grid resolution */
  resolution: number
  /** World-space extent: grid covers [-extent, +extent] on both axes */
  extent: number
}

/**
 * Compute a 2D density field from galaxy groups projected onto the
 * supergalactic XY plane. Groups are filtered to a slab around SGZ ~ 0.
 *
 * Algorithm:
 *  1. Filter groups to |SGZ| < slabHalf
 *  2. For each group, splat a Gaussian kernel onto the grid
 *  3. Box-blur smooth the result
 *  4. Normalize to [0, 1]
 */
export function computeDensityField(
  groups: GalaxyGroup[],
  resolution = 256,
  extent = 30000,
  slabHalf = 2000,
  kernelRadius = 3,
  sigma = 1.5,
): DensityFieldResult {
  const grid = new Float32Array(resolution * resolution)

  // Pre-compute Gaussian kernel weights
  const kernelSize = kernelRadius * 2 + 1
  const kernel = new Float32Array(kernelSize * kernelSize)
  for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
    for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
      const d2 = kx * kx + ky * ky
      kernel[(ky + kernelRadius) * kernelSize + (kx + kernelRadius)] =
        Math.exp(-d2 / (2 * sigma * sigma))
    }
  }

  // Splat each group onto the grid, weighted by HI mass
  let slabCount = 0
  for (const g of groups) {
    if (Math.abs(g.sgz) > slabHalf) continue
    slabCount++

    // Map SGX/SGY to grid cell
    const gx = Math.floor(((g.sgx + extent) / (extent * 2)) * resolution)
    const gy = Math.floor(((g.sgy + extent) / (extent * 2)) * resolution)

    // Weight contribution by HI mass (linear scale)
    // Using log_hi to convert back to linear mass, then normalize by average ~100
    const hiMass = Math.pow(10, g.log_hi) / 100
    const weight = Math.max(0.1, Math.min(10, hiMass)) // Clamp to reasonable range

    // Splat kernel with mass weighting
    for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
      for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
        const cx = gx + kx
        const cy = gy + ky
        if (cx < 0 || cx >= resolution || cy < 0 || cy >= resolution) continue
        grid[cy * resolution + cx] +=
          weight * kernel[(ky + kernelRadius) * kernelSize + (kx + kernelRadius)]
      }
    }
  }

  // Box blur (3x3, 2 passes for smoothness)
  const temp = new Float32Array(resolution * resolution)
  for (let pass = 0; pass < 2; pass++) {
    const src = pass === 0 ? grid : temp
    const dst = pass === 0 ? temp : grid

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        let sum = 0
        let count = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx
            const ny = y + dy
            if (nx >= 0 && nx < resolution && ny >= 0 && ny < resolution) {
              sum += src[ny * resolution + nx]
              count++
            }
          }
        }
        dst[y * resolution + x] = sum / count
      }
    }
  }

  // Normalize to [0, 1]
  let max = 0
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] > max) max = grid[i]
  }
  if (max > 0) {
    for (let i = 0; i < grid.length; i++) {
      grid[i] /= max
    }
  }

  return { grid, slabCount, resolution, extent }
}
