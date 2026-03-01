<template>
  <div ref="container" class="fixed inset-0 -z-10 bg-black">
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  scrollProgress: number
  currentSection: number
}>()

const container = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let width = 0
let height = 0

// Lens center — slightly off-center for asymmetry
const CENTER_X_RATIO = 0.42
const CENTER_Y_RATIO = 0.44

interface LensRing {
  radius: number       // base radius as fraction of min(w,h)
  arcStart: number     // arc start angle in radians
  arcSpan: number      // arc length in radians
  speed: number        // rotation speed (rad/s), negative = CCW
  opacity: number      // base stroke opacity
  cyan: boolean        // tinted cyan or pure white
  width: number        // stroke width
}

const rings: LensRing[] = [
  { radius: 0.08, arcStart: 0.2,  arcSpan: 5.2,  speed: 0.035,  opacity: 0.07, cyan: false, width: 0.8 },
  { radius: 0.14, arcStart: 1.0,  arcSpan: 4.8,  speed: -0.025, opacity: 0.05, cyan: true,  width: 0.6 },
  { radius: 0.21, arcStart: 0.5,  arcSpan: 5.4,  speed: 0.018,  opacity: 0.06, cyan: false, width: 0.7 },
  { radius: 0.30, arcStart: 2.0,  arcSpan: 4.2,  speed: -0.042, opacity: 0.04, cyan: false, width: 0.5 },
  { radius: 0.38, arcStart: 0.8,  arcSpan: 5.0,  speed: 0.015,  opacity: 0.05, cyan: true,  width: 0.6 },
  { radius: 0.48, arcStart: 1.5,  arcSpan: 4.6,  speed: -0.010, opacity: 0.035, cyan: false, width: 0.5 },
  { radius: 0.60, arcStart: 0.0,  arcSpan: 5.8,  speed: 0.008,  opacity: 0.025, cyan: false, width: 0.4 },
]

// Light rays — angles from center toward edge
const rays = [
  { angle: -0.6, opacity: 0.025 },
  { angle:  0.9, opacity: 0.020 },
  { angle:  2.4, opacity: 0.030 },
  { angle: -2.1, opacity: 0.018 },
]

// Sparse star dots
interface Star {
  x: number  // 0-1 ratio
  y: number
  size: number
  opacity: number
}

const stars: Star[] = []
for (let i = 0; i < 60; i++) {
  stars.push({
    x: Math.random(),
    y: Math.random(),
    size: 0.5 + Math.random() * 1.5,
    opacity: 0.06 + Math.random() * 0.12,
  })
}

function resize() {
  if (!canvas.value || !container.value) return
  width = container.value.clientWidth
  height = container.value.clientHeight
  const dpr = Math.min(window.devicePixelRatio, 2)
  canvas.value.width = width * dpr
  canvas.value.height = height * dpr
  canvas.value.style.width = width + 'px'
  canvas.value.style.height = height + 'px'
  ctx = canvas.value.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

function draw(time: number) {
  if (!ctx) return
  const t = time / 1000

  ctx.clearRect(0, 0, width, height)

  const cx = width * CENTER_X_RATIO
  const cy = height * CENTER_Y_RATIO
  const scale = Math.min(width, height)

  // 1. Star dots
  for (const star of stars) {
    ctx.beginPath()
    ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
    ctx.fill()
  }

  // 2. Light rays
  const rayLength = scale * 0.75
  for (const ray of rays) {
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(
      cx + Math.cos(ray.angle) * rayLength,
      cy + Math.sin(ray.angle) * rayLength
    )
    ctx.strokeStyle = `rgba(255, 255, 255, ${ray.opacity})`
    ctx.lineWidth = 0.5
    ctx.stroke()
  }

  // 3. Lens rings
  for (const ring of rings) {
    const r = ring.radius * scale
    const rotation = ring.arcStart + t * ring.speed
    const fadeLen = 0.3 // radians of fade at each end

    // Draw the arc in small segments for endpoint fading
    const segments = 80
    const step = ring.arcSpan / segments

    for (let i = 0; i < segments; i++) {
      const segAngle = rotation + i * step
      const segEnd = segAngle + step + 0.01 // tiny overlap to avoid gaps

      // Fade at endpoints
      let fade = 1
      const fromStart = i * step
      const fromEnd = ring.arcSpan - (i + 1) * step
      if (fromStart < fadeLen) fade = fromStart / fadeLen
      if (fromEnd < fadeLen) fade = Math.min(fade, fromEnd / fadeLen)

      const alpha = ring.opacity * fade
      if (alpha < 0.002) continue

      ctx.beginPath()
      ctx.arc(cx, cy, r, segAngle, segEnd)

      if (ring.cyan) {
        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`
      } else {
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
      }
      ctx.lineWidth = ring.width
      ctx.stroke()
    }
  }

  // 4. Focal glow
  const pulseAlpha = 0.025 + 0.02 * Math.sin(t * 0.8)
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 35)
  glow.addColorStop(0, `rgba(34, 211, 238, ${pulseAlpha})`)
  glow.addColorStop(1, 'rgba(34, 211, 238, 0)')
  ctx.beginPath()
  ctx.arc(cx, cy, 35, 0, Math.PI * 2)
  ctx.fillStyle = glow
  ctx.fill()

  // 5. Tiny crosshair at focal point
  const chSize = 6
  const chAlpha = 0.08
  ctx.strokeStyle = `rgba(255, 255, 255, ${chAlpha})`
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(cx - chSize, cy)
  ctx.lineTo(cx + chSize, cy)
  ctx.moveTo(cx, cy - chSize)
  ctx.lineTo(cx, cy + chSize)
  ctx.stroke()

  animationId = requestAnimationFrame(draw)
}

onMounted(() => {
  resize()
  animationId = requestAnimationFrame(draw)
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
})
</script>
