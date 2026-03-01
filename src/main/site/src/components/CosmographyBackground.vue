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

// Colors
const COLOR_CYAN = '34, 211, 238' // #22d3ee
const COLOR_WHITE = '255, 255, 255'

// Animation State
interface Ring {
  radius: number       // Base radius (0-1 relative to screen min dim)
  speed: number        // Rotation speed
  angle: number        // Current angle
  opacity: number      // Opacity
  dash: number[]       // Line dash pattern
  width: number        // Line width
}

const rings: Ring[] = [
  { radius: 0.12, speed: 0.02, angle: 0, opacity: 0.2, dash: [], width: 1.5 },
  { radius: 0.22, speed: -0.015, angle: 1, opacity: 0.15, dash: [4, 8], width: 1 },
  { radius: 0.35, speed: 0.01, angle: 2, opacity: 0.12, dash: [2, 10], width: 1 },
  { radius: 0.50, speed: -0.008, angle: 3, opacity: 0.1, dash: [10, 20], width: 1 },
  { radius: 0.70, speed: 0.005, angle: 0, opacity: 0.08, dash: [], width: 1.5 },
  { radius: 0.95, speed: -0.002, angle: 1.5, opacity: 0.06, dash: [5, 15], width: 1 },
]

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

const particles: Particle[] = []
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 2.0 + 1.0,
    opacity: Math.random() * 0.3 + 0.1,
    speed: 0.002 + Math.random() * 0.005
  })
}

interface Blip {
  ringIndex: number
  angle: number
  opacity: number
  life: number
}

let blips: Blip[] = []

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
  
  const cx = width * 0.5
  const cy = height * 0.5
  const scale = Math.min(width, height)
  
  // 1. Background Particles (Drifting Upwards)
  ctx.fillStyle = `rgba(${COLOR_WHITE}, 1)`
  particles.forEach(p => {
    p.y -= p.speed * 0.5
    if (p.y < 0) p.y = 1
    
    ctx.globalAlpha = p.opacity
    ctx.beginPath()
    ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1
  
  // 2. Concentric Rings (Distance Ladder)
  rings.forEach((ring, i) => {
    const r = ring.radius * scale * 0.8
    const rotation = ring.angle + t * ring.speed
    
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rotation)
    
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${i % 2 === 0 ? COLOR_CYAN : COLOR_WHITE}, ${ring.opacity})`
    ctx.lineWidth = ring.width
    ctx.setLineDash(ring.dash)
    ctx.stroke()
    
    ctx.restore()
  })
  
  // 3. Blips (Data points on rings)
  if (Math.random() < 0.03) {
    const ringIdx = Math.floor(Math.random() * rings.length)
    blips.push({
      ringIndex: ringIdx,
      angle: Math.random() * Math.PI * 2,
      opacity: 0,
      life: 1.0
    })
  }
  
  blips = blips.filter(b => b.life > 0)
  blips.forEach(b => {
    b.life -= 0.01
    // Fade in then out
    b.opacity = b.life > 0.8 ? (1 - b.life) * 5 : b.life
    
    const ring = rings[b.ringIndex]
    const r = ring.radius * scale * 0.8
    // Blip rotates with ring
    const rotation = ring.angle + t * ring.speed + b.angle
    
    const bx = cx + Math.cos(rotation) * r
    const by = cy + Math.sin(rotation) * r
    
    ctx!.beginPath()
    ctx!.arc(bx, by, 2, 0, Math.PI * 2)
    ctx!.fillStyle = `rgba(${COLOR_CYAN}, ${b.opacity})`
    ctx!.fill()
    
    // Tiny ring around blip
    ctx!.beginPath()
    ctx!.arc(bx, by, 6 * (1-b.life), 0, Math.PI * 2)
    ctx!.strokeStyle = `rgba(${COLOR_CYAN}, ${b.opacity * 0.5})`
    ctx!.lineWidth = 0.5
    ctx!.stroke()
  })

  // 4. Connecting Lines (Ladder Rungs / Web)
  const numLines = 8
  const maxR = rings[rings.length - 1].radius * scale * 0.8
  
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2 + t * 0.02
    
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR)
    
    const grad = ctx.createLinearGradient(
      cx, cy, 
      cx + Math.cos(angle) * maxR, 
      cy + Math.sin(angle) * maxR
    )
    grad.addColorStop(0, `rgba(${COLOR_CYAN}, 0)`)
    grad.addColorStop(0.5, `rgba(${COLOR_CYAN}, 0.15)`)
    grad.addColorStop(1, `rgba(${COLOR_CYAN}, 0)`)
    
    ctx.strokeStyle = grad
    ctx.lineWidth = 1.5
    ctx.setLineDash([])
    ctx.stroke()
  }

  // 5. Radar Sweep (Subtle)
  if (ctx.createConicGradient) {
    const sweepAngle = t * 0.15
    const sweepR = scale * 0.6
    
    const sweepGrad = ctx.createConicGradient(sweepAngle, cx, cy)
    sweepGrad.addColorStop(0, `rgba(${COLOR_CYAN}, 0)`)
    sweepGrad.addColorStop(0.1, `rgba(${COLOR_CYAN}, 0.08)`)
    sweepGrad.addColorStop(0.2, `rgba(${COLOR_CYAN}, 0)`)
    sweepGrad.addColorStop(1, `rgba(${COLOR_CYAN}, 0)`)
    
    ctx.fillStyle = sweepGrad
    ctx.beginPath()
    ctx.arc(cx, cy, sweepR, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // 6. Central Glow
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100)
  glow.addColorStop(0, `rgba(${COLOR_CYAN}, 0.15)`)
  glow.addColorStop(1, `rgba(${COLOR_CYAN}, 0)`)
  
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, cy, 100, 0, Math.PI * 2)
  ctx.fill()
  
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
