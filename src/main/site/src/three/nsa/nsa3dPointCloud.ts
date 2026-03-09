/**
 * Shader modes available in the NSA composite viewer.
 */
export type NsaShaderMode = 'lupton' | 'custom' | 'volumetric' | 'nsa3d' | 'nsamorphology'

/**
 * Interaction modes used by the NSA composite scene.
 */
export type NsaInteractionMode = 'image-plane' | 'orbit'

/**
 * Spectral bands available for NSA point-cloud reconstruction.
 */
export type NsaPointBand = 'u' | 'g' | 'r' | 'i' | 'z' | 'nuv'

/**
 * Per-band image data required to reconstruct the 3D point cloud.
 */
export interface NsaPointCloudInput {
  width: number
  height: number
  bands: Record<NsaPointBand, Float32Array>
}

/**
 * Tunable controls for converting six-band image data into a 3D point cloud.
 */
export interface NsaPointCloudOptions {
  sampleStep: number
  intensityThreshold: number
  depthScale: number
  sizeRange: [number, number]
  seed: number
}

/**
 * A single reconstructed volumetric point.
 */
export interface NsaPointCloudPoint {
  x: number
  y: number
  z: number
  color: [number, number, number]
  size: number
  intensity: number
}

/**
 * Structured point-cloud data derived from the six NSA bands.
 */
export interface NsaPointCloudResult {
  points: NsaPointCloudPoint[]
}

/**
 * Minimal yaw/pitch orbit state for the NSA 3D point-cloud camera.
 */
export interface NsaOrbitState {
  yaw: number
  pitch: number
}

/**
 * Maps a shader selection to the interaction model expected by the view layer.
 */
export function getInteractionMode(shaderMode: NsaShaderMode): NsaInteractionMode {
  return shaderMode === 'nsa3d' || shaderMode === 'nsamorphology' ? 'orbit' : 'image-plane'
}

/**
 * Applies pointer drag deltas to the simple yaw/pitch orbit model.
 *
 * Upward pointer motion should pitch the camera downward around the target,
 * matching the existing galaxy detail orbit interaction.
 */
export function applyNsaOrbitDrag(
  orbit: NsaOrbitState,
  deltaX: number,
  deltaY: number,
): NsaOrbitState {
  return {
    yaw: orbit.yaw - deltaX * 0.008,
    pitch: orbit.pitch + deltaY * 0.006,
  }
}

/**
 * Returns the default point-cloud reconstruction controls for the NSA 3D mode.
 */
export function getDefaultNsaPointCloudOptions(
  width: number,
  height: number,
  seed: number,
): NsaPointCloudOptions {
  return {
    sampleStep: Math.max(1, Math.ceil(Math.max(width, height) / 500)),
    intensityThreshold: 0.003,
    depthScale: 0.35,
    sizeRange: [1.5, 8.5],
    seed,
  }
}

/**
 * Reconstructs a stylized volumetric point cloud from six spectral image bands.
 *
 * The derived depth is intentionally heuristic: hot UV-heavy regions are biased
 * forward, cool dust-heavy regions drift backward, and a deterministic noise
 * term thickens the cloud so it reads as volume instead of embossed relief.
 */
export function buildNsaPointCloud(
  input: NsaPointCloudInput,
  options: NsaPointCloudOptions,
): NsaPointCloudResult {
  const points: NsaPointCloudPoint[] = []
  const step = Math.max(1, Math.floor(options.sampleStep))
  const [minSize, maxSize] = options.sizeRange
  const denomX = Math.max(1, input.width - 1)
  const denomY = Math.max(1, input.height - 1)

  for (let row = 0; row < input.height; row += step) {
    for (let col = 0; col < input.width; col += step) {
      const idx = row * input.width + col

      // Sqrt stretch on raw band values — compresses dynamic range so faint
      // outer arms (pixel values 2-10/255) become visible alongside the core
      const u = Math.sqrt(clamp01(input.bands.u[idx] ?? 0))
      const g = Math.sqrt(clamp01(input.bands.g[idx] ?? 0))
      const r = Math.sqrt(clamp01(input.bands.r[idx] ?? 0))
      const i = Math.sqrt(clamp01(input.bands.i[idx] ?? 0))
      const z = Math.sqrt(clamp01(input.bands.z[idx] ?? 0))
      const nuv = Math.sqrt(clamp01(input.bands.nuv[idx] ?? 0))

      const dust = (i + z) * 0.5
      const stellar = (g + r) * 0.5
      const hot = (u + nuv) * 0.5
      const intensity = dust * 0.25 + stellar * 0.4 + hot * 0.35

      if (intensity < options.intensityThreshold) {
        continue
      }

      // Spectral tilt: hot regions slightly forward, dusty slightly back
      const heatContrast = hot - dust
      // Noise is the primary depth driver — gives the cloud volume/thickness
      const noise1 = (hash3(col, row, options.seed) - 0.5) * 2.0
      const noise2 = (hash3(col + 137, row + 251, options.seed) - 0.5) * 2.0
      const thickness = noise1 * 0.7 + noise2 * 0.3
      // Depth: mostly noise, gentle spectral tilt, no intensity correlation
      const depth = (thickness + heatContrast * 0.25) * options.depthScale

      const px = input.width === 1 ? 0 : col / denomX - 0.5
      const py = input.height === 1 ? 0 : 0.5 - row / denomY
      const size = lerp(minSize, maxSize, clamp01(intensity))
      const color = deriveSpectralColor6(u, g, r, i, z, nuv)

      points.push({
        x: px,
        y: py,
        z: depth,
        color,
        size,
        intensity,
      })
    }
  }

  return { points }
}

/**
 * Maps all 6 spectral bands to RGB using each band's physical wavelength color.
 *
 * Band → approximate wavelength → display color:
 *   nuv  (near-UV ~230nm)  → violet/blue-purple
 *   u    (ultraviolet ~354nm) → deep blue
 *   g    (green ~477nm)    → cyan-green
 *   r    (red ~623nm)      → orange-red
 *   i    (infrared ~763nm) → deep red
 *   z    (far-IR ~913nm)   → dark crimson
 *
 * Each band contributes its own hue weighted by its local strength,
 * producing visible color differences across the galaxy structure.
 */
function deriveSpectralColor6(
  u: number, g: number, r: number, i: number, z: number, nuv: number,
): [number, number, number] {
  const total = u + g + r + i + z + nuv + 0.001

  // Per-band fractional weights
  const wNuv = nuv / total
  const wU = u / total
  const wG = g / total
  const wR = r / total
  const wI = i / total
  const wZ = z / total

  // Each band's display color (saturated, cinematic)
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

/**
 * Produces a deterministic pseudo-random value for a grid coordinate and seed.
 */
function hash3(x: number, y: number, seed: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123
  return s - Math.floor(s)
}

/**
 * Clamps a scalar to the inclusive 0..1 range.
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/**
 * Linearly interpolates between two scalars.
 */
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}
