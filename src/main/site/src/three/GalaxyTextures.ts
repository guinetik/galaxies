import * as THREE from 'three'
import type { MorphologyClass } from '@/types/galaxy'

const TEX_SIZE = 128
const TAU = Math.PI * 2
const CENTER = TEX_SIZE / 2

/** Stellar population hues — inner=warm, outer=cool */
const STELLAR_HUES = [
  { hue: 10,  spread: 8,  wInner: 0.35, wOuter: 0.05 },  // M red dwarfs
  { hue: 25,  spread: 8,  wInner: 0.30, wOuter: 0.10 },  // K orange
  { hue: 42,  spread: 6,  wInner: 0.25, wOuter: 0.15 },  // G yellow
  { hue: 55,  spread: 5,  wInner: 0.08, wOuter: 0.20 },  // F yellow-white
  { hue: 210, spread: 15, wInner: 0.02, wOuter: 0.35 },  // A/B blue-white
  { hue: 225, spread: 10, wInner: 0.00, wOuter: 0.15 },  // O hot blue
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

function pickLayer(): { layer: string; size: number; brightness: number; alpha: number } {
  const roll = Math.random()
  if (roll < 0.65) {
    return {
      layer: 'dust',
      size: 0.8 + Math.random() * 1.5,
      brightness: 0.08 + Math.random() * 0.16,
      alpha: 0.12 + Math.random() * 0.20,
    }
  } else if (roll < 0.97) {
    return {
      layer: 'star',
      size: 1.5 + Math.random() * 3.0,
      brightness: 0.32 + Math.random() * 0.40,
      alpha: 0.40 + Math.random() * 0.40,
    }
  } else {
    return {
      layer: 'bright',
      size: 4.0 + Math.random() * 6.0,
      brightness: 0.64 + Math.random() * 0.16,
      alpha: 0.56 + Math.random() * 0.24,
    }
  }
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

function drawDot(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, y: number,
  hue: number, brightness: number, alpha: number, size: number
) {
  const [r, g, b] = hslToRgb(hue, 0.6, brightness)
  ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
  ctx.beginPath()
  ctx.arc(x, y, Math.max(0.5, size * 0.5), 0, TAU)
  ctx.fill()
}

function gaussian(): number {
  return (Math.random() - 0.5 + Math.random() - 0.5) * 2
}

function renderSpiral(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 350
  const numArms = 2
  const spiralTightness = 0.2
  const spiralStart = 5
  const armWidth = 8
  const galaxyRadius = CENTER * 0.85
  const bulgeRadius = CENTER * 0.12

  // Arms
  const starsPerArm = Math.floor(numStars * 0.5 / numArms)
  for (let arm = 0; arm < numArms; arm++) {
    const armOffset = (arm / numArms) * TAU
    for (let i = 0; i < starsPerArm; i++) {
      const t = i / starsPerArm
      const theta = t * TAU * 2.5
      const r = spiralStart * Math.exp(spiralTightness * theta)
      if (r > galaxyRadius) continue
      const baseAngle = theta + armOffset
      const scatter = gaussian() * armWidth
      const scatterAngle = baseAngle + Math.PI / 2
      const x = CENTER + Math.cos(baseAngle) * r + Math.cos(scatterAngle) * scatter
      const y = CENTER + Math.sin(baseAngle) * r + Math.sin(scatterAngle) * scatter
      const distFactor = r / galaxyRadius
      const { brightness, alpha, size } = pickLayer()
      drawDot(ctx, x, y, pickHue(distFactor), brightness, alpha, size)
    }
  }

  // Bulge
  for (let i = 0; i < numStars * 0.3; i++) {
    const r = Math.pow(Math.random(), 0.3) * bulgeRadius
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r
    const { brightness, alpha, size } = pickLayer()
    drawDot(ctx, x, y, pickHue(r / galaxyRadius), brightness * 1.2, alpha, size)
  }

  // Field stars
  for (let i = 0; i < numStars * 0.2; i++) {
    const r = Math.sqrt(Math.random()) * galaxyRadius
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r
    const { brightness, alpha, size } = pickLayer()
    drawDot(ctx, x, y, pickHue(r / galaxyRadius), brightness * 0.5, alpha * 0.5, size * 0.7)
  }
}

function renderBarred(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 350
  const barLength = CENTER * 0.35
  const barWidth = CENTER * 0.08
  const spiralTightness = 0.28
  const spiralStart = 5
  const galaxyRadius = CENTER * 0.85

  // Bar
  for (let i = 0; i < numStars * 0.25; i++) {
    const along = (Math.random() - 0.5) * 2 * barLength
    const across = (Math.random() - 0.5) * barWidth
    const x = CENTER + along
    const y = CENTER + across
    const distFactor = Math.abs(along) / galaxyRadius
    const { brightness, alpha, size } = pickLayer()
    drawDot(ctx, x, y, pickHue(distFactor * 0.3), brightness * 1.1, alpha, size)
  }

  // Arms from bar endpoints
  const numArms = 2
  const starsPerArm = Math.floor(numStars * 0.45 / numArms)
  for (let arm = 0; arm < numArms; arm++) {
    const armOffset = arm * Math.PI
    const startX = (arm === 0 ? 1 : -1) * barLength
    for (let i = 0; i < starsPerArm; i++) {
      const t = i / starsPerArm
      const theta = t * TAU * 2.0
      const r = spiralStart * Math.exp(spiralTightness * theta)
      if (r > galaxyRadius) continue
      const baseAngle = theta + armOffset
      const scatter = gaussian() * 7
      const scatterAngle = baseAngle + Math.PI / 2
      const x = CENTER + startX + Math.cos(baseAngle) * r + Math.cos(scatterAngle) * scatter
      const y = CENTER + Math.sin(baseAngle) * r + Math.sin(scatterAngle) * scatter
      const distFactor = Math.sqrt((x - CENTER) ** 2 + (y - CENTER) ** 2) / galaxyRadius
      const { brightness, alpha, size } = pickLayer()
      drawDot(ctx, x, y, pickHue(distFactor), brightness, alpha, size)
    }
  }

  // Bulge
  for (let i = 0; i < numStars * 0.2; i++) {
    const r = Math.pow(Math.random(), 0.3) * CENTER * 0.1
    const theta = Math.random() * TAU
    drawDot(ctx, CENTER + Math.cos(theta) * r, CENTER + Math.sin(theta) * r,
      pickHue(0.1), 0.5, 0.6, 2)
  }
}

function renderElliptical(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 400
  const galaxyRadius = CENTER * 0.7
  const axisRatio = 0.7

  for (let i = 0; i < numStars; i++) {
    const r = Math.pow(Math.random(), 0.4) * galaxyRadius
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r * axisRatio
    const distFactor = r / galaxyRadius
    const { brightness, alpha, size } = pickLayer()
    // Ellipticals are warm throughout
    drawDot(ctx, x, y, pickHue(distFactor * 0.3), brightness, alpha, size)
  }
}

function renderLenticular(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 380
  const galaxyRadius = CENTER * 0.8
  const bulgeRadius = CENTER * 0.25
  const scaleLength = galaxyRadius / 3

  // Bulge (40% of stars)
  for (let i = 0; i < numStars * 0.4; i++) {
    const r = Math.pow(Math.random(), 0.3) * bulgeRadius
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r
    const { brightness, alpha, size } = pickLayer()
    drawDot(ctx, x, y, pickHue(r / galaxyRadius * 0.3), brightness * 1.1, alpha, size)
  }

  // Exponential disk (60% of stars)
  for (let i = 0; i < numStars * 0.6; i++) {
    const u = Math.random()
    const r = -Math.log(1 - u * 0.95) * scaleLength
    if (r > galaxyRadius) continue
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r * 0.35 // thin disk
    const distFactor = r / galaxyRadius
    const { brightness, alpha, size } = pickLayer()
    drawDot(ctx, x, y, pickHue(distFactor * 0.5), brightness * 0.8, alpha, size * 0.8)
  }
}

function renderIrregular(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 300
  const galaxyRadius = CENTER * 0.65

  // Random clumps
  const clumpCount = 3 + Math.floor(Math.random() * 3)
  const clumps = Array.from({ length: clumpCount }, () => ({
    x: CENTER + (Math.random() - 0.5) * galaxyRadius * 1.2,
    y: CENTER + (Math.random() - 0.5) * galaxyRadius * 1.2,
    sigma: 5 + Math.random() * 15,
  }))

  for (let i = 0; i < numStars; i++) {
    let x: number, y: number
    if (Math.random() < 0.7) {
      // Clumped
      const clump = clumps[Math.floor(Math.random() * clumps.length)]
      x = clump.x + gaussian() * clump.sigma
      y = clump.y + gaussian() * clump.sigma
    } else {
      // Field
      const r = Math.sqrt(Math.random()) * galaxyRadius
      const theta = Math.random() * TAU
      x = CENTER + Math.cos(theta) * r + (Math.random() - 0.5) * 10
      y = CENTER + Math.sin(theta) * r + (Math.random() - 0.5) * 10
    }
    const dist = Math.sqrt((x - CENTER) ** 2 + (y - CENTER) ** 2)
    const distFactor = dist / galaxyRadius
    const { brightness, alpha, size } = pickLayer()
    // Irregulars are blue-dominant (young stars)
    drawDot(ctx, x, y, pickHue(Math.max(0.5, distFactor)), brightness, alpha, size)
  }
}

function renderUnknown(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 200
  const galaxyRadius = CENTER * 0.5

  // Simple circular glow
  for (let i = 0; i < numStars; i++) {
    const r = Math.pow(Math.random(), 0.5) * galaxyRadius
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r
    const distFactor = r / galaxyRadius
    const { brightness, alpha, size } = pickLayer()
    drawDot(ctx, x, y, pickHue(distFactor * 0.4), brightness * 0.7, alpha * 0.8, size * 0.7)
  }
}

const RENDERERS: Record<MorphologyClass, (ctx: OffscreenCanvasRenderingContext2D) => void> = {
  spiral: renderSpiral,
  barred: renderBarred,
  elliptical: renderElliptical,
  lenticular: renderLenticular,
  irregular: renderIrregular,
  unknown: renderUnknown,
}

/** Texture atlas layout: 2 columns x 3 rows */
const ATLAS_COLS = 2
const ATLAS_ROWS = 3

/** Order of morphology classes in the atlas */
export const ATLAS_ORDER: MorphologyClass[] = [
  'spiral', 'barred',
  'elliptical', 'lenticular',
  'irregular', 'unknown',
]

/** Get the atlas index for a morphology class */
export function morphologyToAtlasIndex(morphClass: MorphologyClass): number {
  const idx = ATLAS_ORDER.indexOf(morphClass)
  return idx >= 0 ? idx : 5 // default to unknown
}

/**
 * Generate a texture atlas containing all galaxy type textures.
 * Layout: 2x3 grid of 128x128 = 256x384 atlas.
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

    RENDERERS[morphClass](tileCtx)

    // Draw tile into atlas
    ctx.drawImage(tileCanvas, col * TEX_SIZE, row * TEX_SIZE)
  }

  const texture = new THREE.CanvasTexture(canvas as unknown as HTMLCanvasElement)
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}
