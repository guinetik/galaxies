import * as THREE from 'three'
import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'

const TEX_SIZE = 256
const TAU = Math.PI * 2
const CENTER = TEX_SIZE / 2

/** Stellar population hues — inner=warm, outer=cool */
const STELLAR_HUES = [
  { hue: 12,  spread: 10, wInner: 0.35, wOuter: 0.12 },  // deep orange-red
  { hue: 26,  spread: 10, wInner: 0.31, wOuter: 0.18 },  // orange
  { hue: 40,  spread: 8,  wInner: 0.18, wOuter: 0.16 },  // yellow-orange
  { hue: 58,  spread: 6,  wInner: 0.07, wOuter: 0.14 },  // yellow-white
  { hue: 214, spread: 9,  wInner: 0.03, wOuter: 0.14 },  // blue-white
  { hue: 282, spread: 12, wInner: 0.06, wOuter: 0.22 },  // violet/magenta accents
]

function pickHue(distFactor: number): number {
  const d = Math.pow(distFactor, 0.6)
  let totalWeight = 0
  for (const s of STELLAR_HUES) totalWeight += s.wInner * (1 - d) + s.wOuter * d
  let roll = Math.random() * totalWeight
  for (const s of STELLAR_HUES) {
    roll -= s.wInner * (1 - d) + s.wOuter * d
    if (roll <= 0) return s.hue + (Math.random() - 0.5) * s.spread
  }
  return 42
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60)       { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else              { r = c; b = x }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ]
}

/**
 * Draw a compact stellar speck with soft falloff.
 */
function drawSoftDot(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, y: number,
  hue: number, brightness: number, alpha: number, size: number
) {
  const [r, g, b] = hslToRgb(hue, 0.42, Math.min(0.9, brightness))
  const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
  grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
  grad.addColorStop(0.33, `rgba(${r},${g},${b},${alpha * 0.42})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(x, y, size, 0, TAU)
  ctx.fill()
}

/**
 * Draw a dust patch with warm-brown extinction.
 */
function drawDust(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, y: number,
  size: number, alpha: number
) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
  grad.addColorStop(0, `rgba(10, 5, 0, ${alpha})`)
  grad.addColorStop(1, `rgba(20, 10, 5, 0)`)
  
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(x, y, size, 0, TAU)
  ctx.fill()
}

function gaussian(): number {
  return (Math.random() - 0.5 + Math.random() - 0.5) * 2
}

/**
 * Avoid green-dominant hues since integrated galaxy light is not green.
 */
function avoidGreenHue(h: number): number {
  const hue = ((h % 360) + 360) % 360
  if (hue >= 72 && hue <= 186) {
    return hue < 129 ? 66 : 260
  }
  return hue
}

/**
 * Draw a smooth diffuse galaxy component with optional ellipticity and rotation.
 */
function drawDiffuseGlow(
  ctx: OffscreenCanvasRenderingContext2D,
  hue: number,
  brightness: number,
  alpha: number,
  radius: number,
  axisRatio: number = 1.0,
  rotationRad: number = 0
) {
  ctx.save()
  ctx.translate(CENTER, CENTER)
  ctx.rotate(rotationRad)
  ctx.scale(1.0, axisRatio)

  const [r, g, b] = hslToRgb(hue, 0.28, brightness)
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
  grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
  grad.addColorStop(0.45, `rgba(${r},${g},${b},${alpha * 0.32})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, TAU)
  ctx.fill()
  ctx.restore()
}

/**
 * Add subtle luminance grain to avoid overly smooth synthetic blobs.
 */
function addFilmGrain(ctx: OffscreenCanvasRenderingContext2D, amount: number): void {
  const img = ctx.getImageData(0, 0, TEX_SIZE, TEX_SIZE)
  const data = img.data
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    const n = (Math.random() - 0.5) * amount
    data[i] = Math.max(0, Math.min(255, data[i] + n))
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)
}

/**
 * Render a photometric galaxy body with diffuse profile and angular structure.
 */
function renderPhotometricBody(
  ctx: OffscreenCanvasRenderingContext2D,
  options: {
    majorRadius: number
    axisRatio: number
    rotation: number
    centerHue: number
    outerHue: number
    concentration: number
    irregularity: number
    dustStrength: number
    armCount: number
  }
): void {
  const img = ctx.getImageData(0, 0, TEX_SIZE, TEX_SIZE)
  const data = img.data
  const cosR = Math.cos(options.rotation)
  const sinR = Math.sin(options.rotation)
  const minorRadius = options.majorRadius * options.axisRatio

  for (let py = 0; py < TEX_SIZE; py++) {
    for (let px = 0; px < TEX_SIZE; px++) {
      const x = px + 0.5 - CENTER
      const y = py + 0.5 - CENTER
      const xr = x * cosR - y * sinR
      const yr = x * sinR + y * cosR
      const nx = xr / options.majorRadius
      const ny = yr / minorRadius
      const r = Math.sqrt(nx * nx + ny * ny)
      if (r > 1.2) continue

      const theta = Math.atan2(ny, nx)
      const armWave = Math.sin(theta * options.armCount + r * 13.0)
      const asymWave = Math.sin(theta * 1.7 + r * 6.0)
      const irregular = 1.0 + options.irregularity * (armWave * 0.35 + asymWave * 0.22)
      const bulge = Math.exp(-Math.pow(Math.max(0, r * options.concentration), 1.2))
      const disk = Math.exp(-Math.pow(Math.max(0, r * 1.35), 1.55))
      const dustBand = Math.exp(-Math.pow(Math.abs(ny) * 12.0, 1.35)) * (1.0 - r)
      const luminance = Math.max(0, (bulge * 0.72 + disk * 0.46) * irregular)
      const dust = 1.0 - options.dustStrength * dustBand
      const lit = luminance * dust
      if (lit < 0.01) continue

      const hueMix = Math.min(1, Math.max(0, Math.pow(r, 0.85)))
      const hueRaw = options.centerHue + (options.outerHue - options.centerHue) * hueMix + (Math.random() - 0.5) * 2.5
      const hue = avoidGreenHue(hueRaw)
      const lightness = Math.min(0.86, 0.14 + lit * 0.72)
      const [r8, g8, b8] = hslToRgb(hue, 0.28, lightness)
      const alpha = Math.min(1, lit * 0.72)
      const idx = (py * TEX_SIZE + px) * 4

      data[idx] = Math.max(data[idx], r8)
      data[idx + 1] = Math.max(data[idx + 1], g8)
      data[idx + 2] = Math.max(data[idx + 2], b8)
      data[idx + 3] = Math.min(255, Math.max(data[idx + 3], Math.floor(alpha * 255)))
    }
  }

  ctx.putImageData(img, 0, 0)
}

function renderSpiral(ctx: OffscreenCanvasRenderingContext2D) {
  const rotation = Math.random() * TAU
  renderPhotometricBody(ctx, {
    majorRadius: CENTER * 0.84,
    axisRatio: 0.68 + Math.random() * 0.2,
    rotation,
    centerHue: 24,
    outerHue: 284,
    concentration: 1.22,
    irregularity: 0.8,
    dustStrength: 0.28,
    armCount: 2,
  })

  drawDiffuseGlow(ctx, 39, 0.82, 0.6, CENTER * 0.11, 0.8, rotation)
  for (let i = 0; i < 260; i++) {
    const r = Math.pow(Math.random(), 0.55) * CENTER * 0.86
    const theta = Math.random() * TAU
    drawSoftDot(
      ctx,
      CENTER + Math.cos(theta) * r,
      CENTER + Math.sin(theta) * r * 0.8,
      pickHue(r / (CENTER * 0.86)),
      0.42 + Math.random() * 0.28,
      0.07 + Math.random() * 0.13,
      0.45 + Math.random() * 1.4
    )
  }
  addFilmGrain(ctx, 6)
}

function renderBarred(ctx: OffscreenCanvasRenderingContext2D) {
  const rotation = Math.random() * TAU
  renderPhotometricBody(ctx, {
    majorRadius: CENTER * 0.83,
    axisRatio: 0.62 + Math.random() * 0.22,
    rotation,
    centerHue: 20,
    outerHue: 276,
    concentration: 1.18,
    irregularity: 0.7,
    dustStrength: 0.24,
    armCount: 2,
  })

  ctx.save()
  ctx.translate(CENTER, CENTER)
  ctx.rotate(rotation)
  for (let i = 0; i < 260; i++) {
    const along = (Math.random() - 0.5) * CENTER * 0.75
    const across = gaussian() * CENTER * 0.03
    drawSoftDot(ctx, along, across, 42 + (Math.random() - 0.5) * 8, 0.66, 0.15, 0.45 + Math.random() * 1.2)
  }
  ctx.restore()
  addFilmGrain(ctx, 6)
}

function renderElliptical(ctx: OffscreenCanvasRenderingContext2D) {
  const rotation = Math.random() * TAU
  renderPhotometricBody(ctx, {
    majorRadius: CENTER * 0.78,
    axisRatio: 0.6 + Math.random() * 0.25,
    rotation,
    centerHue: 32,
    outerHue: 352,
    concentration: 1.55,
    irregularity: 0.24,
    dustStrength: 0.1,
    armCount: 1,
  })
  drawDiffuseGlow(ctx, 37, 0.92, 0.55, CENTER * 0.12, 0.78, rotation)
  addFilmGrain(ctx, 6)
}

function renderLenticular(ctx: OffscreenCanvasRenderingContext2D) {
  const rotation = Math.random() * TAU

  renderPhotometricBody(ctx, {
    majorRadius: CENTER * 0.8,
    axisRatio: 0.35 + Math.random() * 0.16,
    rotation,
    centerHue: 28,
    outerHue: 350,
    concentration: 1.35,
    irregularity: 0.18,
    dustStrength: 0.2,
    armCount: 1,
  })
  drawDiffuseGlow(ctx, 36, 0.9, 0.5, CENTER * 0.09, 0.48, rotation)
  addFilmGrain(ctx, 6)
}

function renderIrregular(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 900
  const galaxyRadius = CENTER * 0.7
  renderPhotometricBody(ctx, {
    majorRadius: CENTER * 0.74,
    axisRatio: 0.7 + Math.random() * 0.25,
    rotation: Math.random() * TAU,
    centerHue: 18,
    outerHue: 286,
    concentration: 0.95,
    irregularity: 1.0,
    dustStrength: 0.14,
    armCount: 3,
  })

  // Random clumps of star formation
  const clumpCount = 4 + Math.floor(Math.random() * 4)
  const clumps = Array.from({ length: clumpCount }, () => ({
    x: CENTER + (Math.random() - 0.5) * galaxyRadius * 1.4,
    y: CENTER + (Math.random() - 0.5) * galaxyRadius * 1.4,
    sigma: 15 + Math.random() * 25,
    hue: 210 + (Math.random() - 0.5) * 30 // Blue/Young
  }))

  for (let i = 0; i < numStars; i++) {
    let x: number, y: number, hue: number
    if (Math.random() < 0.8) {
      // Clumped
      const clump = clumps[Math.floor(Math.random() * clumps.length)]
      x = clump.x + gaussian() * clump.sigma
      y = clump.y + gaussian() * clump.sigma
      hue = clump.hue
    } else {
      // Field
      const r = Math.sqrt(Math.random()) * galaxyRadius
      const theta = Math.random() * TAU
      x = CENTER + Math.cos(theta) * r + (Math.random() - 0.5) * 20
      y = CENTER + Math.sin(theta) * r + (Math.random() - 0.5) * 20
      hue = 200 + Math.random() * 40
    }
    
    drawSoftDot(ctx, x, y, hue, 0.58, 0.22, 0.7 + Math.random() * 1.7)
  }
  drawDiffuseGlow(ctx, 208, 0.45, 0.2, CENTER * 0.5)
  addFilmGrain(ctx, 8)
}

const RENDERERS: Record<MorphologyCategory, (ctx: OffscreenCanvasRenderingContext2D) => void> = {
  spiral: renderSpiral,
  barred: renderBarred,
  elliptical: renderElliptical,
  lenticular: renderLenticular,
  irregular: renderIrregular,
}

/** Texture atlas layout: 4 columns x 2 rows (power-of-two for mipmaps) */
const ATLAS_COLS = 4
const ATLAS_ROWS = 2

/** Order of morphology categories in the atlas */
export const ATLAS_ORDER: MorphologyCategory[] = [
  'spiral', 'barred',
  'elliptical', 'lenticular',
  'irregular',
]

/** Get the atlas index for a morphology category */
export function morphologyToAtlasIndex(morphClass: MorphologyCategory): number {
  const idx = ATLAS_ORDER.indexOf(morphClass)
  return idx >= 0 ? idx : 0 // default to spiral
}

/**
 * Generate a texture atlas containing all galaxy type textures.
 * Layout: 2x3 grid of 256x256 = 512x768 atlas.
 */
export function generateGalaxyTextureAtlas(): THREE.CanvasTexture {
  const atlasWidth = ATLAS_COLS * TEX_SIZE
  const atlasHeight = ATLAS_ROWS * TEX_SIZE

  const canvas = new OffscreenCanvas(atlasWidth, atlasHeight)
  const ctx = canvas.getContext('2d', { alpha: true })!
  ctx.clearRect(0, 0, atlasWidth, atlasHeight)

  for (let i = 0; i < ATLAS_ORDER.length; i++) {
    const morphClass = ATLAS_ORDER[i]
    const col = i % ATLAS_COLS
    const row = Math.floor(i / ATLAS_COLS)

    // Create individual texture canvas
    const tileCanvas = new OffscreenCanvas(TEX_SIZE, TEX_SIZE)
    const tileCtx = tileCanvas.getContext('2d', { alpha: true })!
    tileCtx.clearRect(0, 0, TEX_SIZE, TEX_SIZE)
    
    // Add subtle background glow to everything to avoid stark blackness
    const glow = tileCtx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, CENTER * 0.9)
    glow.addColorStop(0, 'rgba(20, 20, 30, 0.2)')
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
    tileCtx.fillStyle = glow
    tileCtx.fillRect(0, 0, TEX_SIZE, TEX_SIZE)

    RENDERERS[morphClass](tileCtx)

    // Draw tile into atlas
    ctx.drawImage(tileCanvas, col * TEX_SIZE, row * TEX_SIZE)
  }

  const texture = new THREE.CanvasTexture(canvas as unknown as HTMLCanvasElement)
  texture.generateMipmaps = true
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter
  if ('colorSpace' in texture) {
    texture.colorSpace = THREE.SRGBColorSpace
  }
  texture.needsUpdate = true
  return texture
}
