/**
 * Filamentarity-based 3D morphology reconstruction from 2D spectral data.
 *
 * Implements the structure tensor technique from Makarenko et al. (2014)
 * "3D morphology of a random field from its 2D cross-section":
 *   F = (P² − 4πS) / (P² + 4πS)
 *
 * Instead of random noise depth, the local filamentarity of the intensity
 * field drives the z-thickness: round structures (galaxy core, knots) get
 * volumetric depth while filamentary structures (spiral arms) become thin
 * sheets — matching the paper's finding that 3D aspect ratios are encoded
 * in the 2D morphology of isodensity contours.
 */

import type { NsaPointCloudInput, NsaPointCloudOptions } from './nsa3dPointCloud'

/**
 * A morphology-aware volumetric point with filamentarity metadata.
 */
export interface NsaMorphologyPoint {
  x: number
  y: number
  z: number
  color: [number, number, number]
  size: number
  intensity: number
  /** Structure tensor filamentarity: 0 = isotropic/round, 1 = anisotropic/linear */
  filamentarity: number
}

export interface NsaMorphologyResult {
  points: NsaMorphologyPoint[]
}

/**
 * Returns default reconstruction options tuned for the morphology mode.
 * Lower threshold and finer sampling to capture structure gradients.
 */
export function getDefaultMorphologyOptions(
  width: number,
  height: number,
  seed: number,
): NsaPointCloudOptions {
  return {
    sampleStep: Math.max(1, Math.ceil(Math.max(width, height) / 550)),
    intensityThreshold: 0.003,
    depthScale: 0.4,
    sizeRange: [1.5, 8.5],
    seed,
  }
}

/**
 * Reconstructs a 3D point cloud using structure-tensor filamentarity to
 * drive depth instead of random noise.
 *
 * The structure tensor eigenvalues at each sample reveal whether the local
 * intensity field is isotropic (round, like the galaxy core) or anisotropic
 * (elongated, like a spiral arm). This anisotropy — the filamentarity — then
 * modulates the z-thickness: round regions get full volumetric spread while
 * filamentary regions collapse to thin sheets.
 */
export function buildMorphologyPointCloud(
  input: NsaPointCloudInput,
  options: NsaPointCloudOptions,
): NsaMorphologyResult {
  const points: NsaMorphologyPoint[] = []
  const step = Math.max(1, Math.floor(options.sampleStep))
  const [minSize, maxSize] = options.sizeRange
  const denomX = Math.max(1, input.width - 1)
  const denomY = Math.max(1, input.height - 1)

  // ── Pass 1: build downsampled intensity field for structure tensor ──
  const { field, w: fw, h: fh } = buildIntensityField(input, step)
  const tensorRadius = Math.max(1, Math.min(3, Math.floor(Math.min(fw, fh) / 20)))

  // ── Pass 2: sample points with filamentarity-driven depth ──
  for (let row = 0; row < input.height; row += step) {
    for (let col = 0; col < input.width; col += step) {
      const idx = row * input.width + col

      // i-band alone for intensity (highest SNR, per Makarenko et al. 2014)
      const i = Math.sqrt(clamp01(input.bands.i[idx] ?? 0))

      if (i < options.intensityThreshold) {
        continue
      }

      // Other bands only for color derivation
      const g = Math.sqrt(clamp01(input.bands.g[idx] ?? 0))
      const r = Math.sqrt(clamp01(input.bands.r[idx] ?? 0))
      const z = Math.sqrt(clamp01(input.bands.z[idx] ?? 0))

      // ── Structure tensor analysis (Makarenko et al. 2014) ──
      const fx = Math.floor(col / step)
      const fy = Math.floor(row / step)
      const { F: filam } = localFilamentarity(field, fw, fh, fx, fy, tensorRadius)

      // ── Filamentarity-driven depth ──
      // Round (F≈0): thick volume from noise → galaxy core, star-forming knots
      // Filamentary (F≈1): thin sheet from attenuated noise → spiral arms, tails
      const noise = (hash3(col, row, options.seed) - 0.5) * 2.0
      const thickness = 1.0 / (1.0 + filam * 9.0)
      const depth = noise * thickness * options.depthScale

      const px = input.width === 1 ? 0 : col / denomX - 0.5
      const py = input.height === 1 ? 0 : 0.5 - row / denomY
      const size = lerp(minSize, maxSize, clamp01(i))
      const color = deriveSpectralColor6(0, g, r, i, z, 0)

      points.push({
        x: px,
        y: py,
        z: depth,
        color,
        size,
        intensity: i,
        filamentarity: filam,
      })
    }
  }

  return { points }
}

// ═══════════════════════════════════════════════════════════════════════════
// Structure tensor helpers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Builds a downsampled combined-intensity field for gradient analysis.
 * Only samples at step intervals to match point cloud resolution.
 */
export function buildIntensityField(
  input: NsaPointCloudInput,
  step: number,
): { field: Float32Array; w: number; h: number } {
  const w = Math.ceil(input.width / step)
  const h = Math.ceil(input.height / step)
  const field = new Float32Array(w * h)

  for (let fy = 0; fy < h; fy++) {
    for (let fx = 0; fx < w; fx++) {
      const row = Math.min(fy * step, input.height - 1)
      const col = Math.min(fx * step, input.width - 1)
      const idx = row * input.width + col

      // i-band only for structure tensor (highest SNR)
      field[fy * w + fx] = Math.sqrt(clamp01(input.bands.i[idx] ?? 0))
    }
  }

  return { field, w, h }
}

/**
 * Computes local filamentarity at a point using the structure tensor.
 *
 * The 2×2 structure tensor J is the gradient covariance matrix averaged
 * over a local window. Its eigenvalues λ₁ ≥ λ₂ reveal anisotropy:
 *   F = (λ₁ − λ₂) / (λ₁ + λ₂)
 *
 * F ≈ 0 when both eigenvalues are similar (isotropic/round structure).
 * F ≈ 1 when one eigenvalue dominates (anisotropic/filamentary structure).
 */
export function localFilamentarity(
  field: Float32Array,
  fw: number,
  fh: number,
  cx: number,
  cy: number,
  radius: number,
): { F: number; angle: number } {
  let jxx = 0
  let jxy = 0
  let jyy = 0

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = Math.max(0, Math.min(fw - 1, cx + dx))
      const y = Math.max(0, Math.min(fh - 1, cy + dy))

      // Central-difference gradient
      const x0 = Math.max(0, x - 1)
      const x1 = Math.min(fw - 1, x + 1)
      const y0 = Math.max(0, y - 1)
      const y1 = Math.min(fh - 1, y + 1)

      const ix = field[y * fw + x1] - field[y * fw + x0]
      const iy = field[y1 * fw + x] - field[y0 * fw + x]

      jxx += ix * ix
      jxy += ix * iy
      jyy += iy * iy
    }
  }

  // Eigenvalues of the 2×2 symmetric matrix [[jxx, jxy], [jxy, jyy]]
  const trace = jxx + jyy
  const det = jxx * jyy - jxy * jxy
  const disc = Math.sqrt(Math.max(0, trace * trace - 4 * det))
  const lambda1 = (trace + disc) * 0.5
  const lambda2 = (trace - disc) * 0.5

  const F = trace > 0.0001
    ? (lambda1 - lambda2) / (lambda1 + lambda2)
    : 0

  // Dominant orientation (angle of the structure, perpendicular to gradient)
  const angle = Math.atan2(2 * jxy, jxx - jyy) * 0.5

  return { F, angle }
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared utilities (same as nsa3dPointCloud.ts)
// ═══════════════════════════════════════════════════════════════════════════

function deriveSpectralColor6(
  u: number, g: number, r: number, i: number, z: number, nuv: number,
): [number, number, number] {
  const total = u + g + r + i + z + nuv + 0.001
  const wNuv = nuv / total
  const wU = u / total
  const wG = g / total
  const wR = r / total
  const wI = i / total
  const wZ = z / total

  const red = clamp01(
    wNuv * 0.45 + wU * 0.15 + wG * 0.10 + wR * 1.00 + wI * 0.90 + wZ * 0.70,
  )
  const green = clamp01(
    wNuv * 0.15 + wU * 0.20 + wG * 0.95 + wR * 0.40 + wI * 0.12 + wZ * 0.05,
  )
  const blue = clamp01(
    wNuv * 1.00 + wU * 0.95 + wG * 0.50 + wR * 0.08 + wI * 0.10 + wZ * 0.15,
  )

  return [red, green, blue]
}

function hash3(x: number, y: number, seed: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123
  return s - Math.floor(s)
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}
