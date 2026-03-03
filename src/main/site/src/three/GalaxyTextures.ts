import * as THREE from 'three'
import type { MorphologyClass } from '@/types/galaxy'

const TEX_SIZE = 256
const TAU = Math.PI * 2
const CENTER = TEX_SIZE / 2

/** Stellar population hues — inner=warm, outer=cool */
const STELLAR_HUES = [
  { hue: 20,  spread: 10, wInner: 0.40, wOuter: 0.05 },  // M red/orange dwarfs
  { hue: 35,  spread: 10, wInner: 0.30, wOuter: 0.10 },  // K orange
  { hue: 48,  spread: 8,  wInner: 0.20, wOuter: 0.15 },  // G yellow
  { hue: 60,  spread: 5,  wInner: 0.08, wOuter: 0.20 },  // F yellow-white
  { hue: 210, spread: 20, wInner: 0.02, wOuter: 0.35 },  // A/B blue-white
  { hue: 230, spread: 15, wInner: 0.00, wOuter: 0.15 },  // O hot blue
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

function drawSoftDot(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, y: number,
  hue: number, brightness: number, alpha: number, size: number
) {
  const [r, g, b] = hslToRgb(hue, 0.7, brightness) // Increased saturation slightly
  const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
  grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
  grad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.4})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(x, y, size, 0, TAU)
  ctx.fill()
}

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

function renderSpiral(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 800
  const numArms = 2
  const spiralTightness = 0.25
  const spiralStart = 8
  const armWidth = 12
  const galaxyRadius = CENTER * 0.85
  
  // Core glow
  drawSoftDot(ctx, CENTER, CENTER, 40, 0.9, 0.8, CENTER * 0.25)
  drawSoftDot(ctx, CENTER, CENTER, 30, 1.0, 1.0, CENTER * 0.1)

  // Arms
  const starsPerArm = Math.floor(numStars * 0.6 / numArms)
  for (let arm = 0; arm < numArms; arm++) {
    const armOffset = (arm / numArms) * TAU
    for (let i = 0; i < starsPerArm; i++) {
      const t = i / starsPerArm
      const theta = t * TAU * 2.8
      const r = spiralStart * Math.exp(spiralTightness * theta)
      if (r > galaxyRadius) continue
      
      const baseAngle = theta + armOffset
      const scatter = gaussian() * armWidth * (1 + t) // More scatter further out
      const scatterAngle = baseAngle + Math.PI / 2
      const x = CENTER + Math.cos(baseAngle) * r + Math.cos(scatterAngle) * scatter
      const y = CENTER + Math.sin(baseAngle) * r + Math.sin(scatterAngle) * scatter
      
      const distFactor = r / galaxyRadius
      
      // Dust lanes on the inside edge of arms
      if (Math.random() < 0.3) {
        const dustX = CENTER + Math.cos(baseAngle - 0.1) * (r - 5) + Math.cos(scatterAngle) * scatter
        const dustY = CENTER + Math.sin(baseAngle - 0.1) * (r - 5) + Math.sin(scatterAngle) * scatter
        drawDust(ctx, dustX, dustY, 8 + Math.random() * 8, 0.15)
      }

      const hue = pickHue(distFactor)
      const size = 2 + Math.random() * 4
      const alpha = 0.3 + Math.random() * 0.5
      const brightness = 0.5 + Math.random() * 0.5
      
      drawSoftDot(ctx, x, y, hue, brightness, alpha, size)
    }
  }

  // Field stars / Halo
  for (let i = 0; i < numStars * 0.3; i++) {
    const r = Math.pow(Math.random(), 0.5) * galaxyRadius
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r
    const distFactor = r / galaxyRadius
    drawSoftDot(ctx, x, y, pickHue(distFactor), 0.6, 0.3, 1.5 + Math.random() * 2)
  }
}

function renderBarred(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 700
  const barLength = CENTER * 0.4
  const barWidth = CENTER * 0.12
  const spiralTightness = 0.35
  const spiralStart = 8
  const galaxyRadius = CENTER * 0.85

  // Core
  drawSoftDot(ctx, CENTER, CENTER, 40, 1.0, 0.9, CENTER * 0.15)

  // Bar
  for (let i = 0; i < numStars * 0.25; i++) {
    const along = (Math.random() - 0.5) * 2 * barLength
    const across = gaussian() * barWidth * 0.5
    const x = CENTER + along
    const y = CENTER + across
    const distFactor = Math.abs(along) / galaxyRadius
    drawSoftDot(ctx, x, y, pickHue(distFactor * 0.3), 0.8, 0.4, 2 + Math.random() * 3)
  }

  // Arms
  const numArms = 2
  const starsPerArm = Math.floor(numStars * 0.5 / numArms)
  for (let arm = 0; arm < numArms; arm++) {
    const armOffset = arm * Math.PI
    const startX = (arm === 0 ? 1 : -1) * barLength
    for (let i = 0; i < starsPerArm; i++) {
      const t = i / starsPerArm
      const theta = t * TAU * 1.8
      const r = spiralStart * Math.exp(spiralTightness * theta)
      if (r > galaxyRadius) continue
      
      const baseAngle = theta + armOffset
      const scatter = gaussian() * 10
      const scatterAngle = baseAngle + Math.PI / 2
      
      // Offset arms to start from ends of bar
      const x = CENTER + startX + Math.cos(baseAngle) * r + Math.cos(scatterAngle) * scatter
      const y = CENTER + Math.sin(baseAngle) * r + Math.sin(scatterAngle) * scatter
      
      const distFactor = Math.sqrt((x-CENTER)**2 + (y-CENTER)**2) / galaxyRadius
      drawSoftDot(ctx, x, y, pickHue(distFactor), 0.7, 0.4, 2 + Math.random() * 4)
    }
  }
}

function renderElliptical(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 1000
  const galaxyRadius = CENTER * 0.75
  const axisRatio = 0.75

  // Strong central glow
  drawSoftDot(ctx, CENTER, CENTER, 45, 0.9, 0.8, CENTER * 0.4)
  drawSoftDot(ctx, CENTER, CENTER, 40, 1.0, 1.0, CENTER * 0.15)

  for (let i = 0; i < numStars; i++) {
    // Concentration towards center (inverse power law)
    const r = Math.pow(Math.random(), 2.5) * galaxyRadius // More concentrated
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r * axisRatio
    const distFactor = r / galaxyRadius
    
    // Ellipticals are old, yellow/red
    const hue = 35 + (Math.random() - 0.5) * 15
    drawSoftDot(ctx, x, y, hue, 0.7, 0.3, 2 + Math.random() * 4)
  }
}

function renderLenticular(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 800
  const galaxyRadius = CENTER * 0.8
  
  // Bright core
  drawSoftDot(ctx, CENTER, CENTER, 45, 1.0, 0.9, CENTER * 0.2)
  
  // Disk
  for (let i = 0; i < numStars * 0.7; i++) {
    const r = Math.pow(Math.random(), 0.8) * galaxyRadius
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r * 0.4 // Flattened disk
    const distFactor = r / galaxyRadius
    
    drawSoftDot(ctx, x, y, pickHue(distFactor * 0.5), 0.7, 0.3, 2 + Math.random() * 3)
  }
  
  // Halo
  for (let i = 0; i < numStars * 0.3; i++) {
    const r = Math.pow(Math.random(), 1.5) * galaxyRadius * 0.6
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r
    drawSoftDot(ctx, x, y, 40, 0.5, 0.2, 2 + Math.random() * 2)
  }
}

function renderIrregular(ctx: OffscreenCanvasRenderingContext2D) {
  const numStars = 600
  const galaxyRadius = CENTER * 0.7

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
    
    drawSoftDot(ctx, x, y, hue, 0.8, 0.4, 3 + Math.random() * 5)
  }
}

function renderUnknown(ctx: OffscreenCanvasRenderingContext2D) {
  // Generic faint fuzz
  drawSoftDot(ctx, CENTER, CENTER, 220, 0.6, 0.5, CENTER * 0.3)
  
  for (let i = 0; i < 300; i++) {
    const r = Math.pow(Math.random(), 0.5) * CENTER * 0.6
    const theta = Math.random() * TAU
    const x = CENTER + Math.cos(theta) * r
    const y = CENTER + Math.sin(theta) * r
    drawSoftDot(ctx, x, y, 210, 0.5, 0.2, 2 + Math.random() * 3)
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
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}
