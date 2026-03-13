<template>
  <IntuitionMachine
    :space-label="t('pages.about.measurements.panels.space')"
    :instrument-label="t('pages.about.measurements.panels.instrument')"
    :data-label="t('pages.about.measurements.panels.data')"
  >
    <template #space>
      <div ref="spaceRef" class="panel-svg" />
    </template>
    <template #instrument>
      <div class="sbf-canvas-wrap">
        <canvas
          ref="canvasRef"
          class="sbf-canvas"
          :width="canvasSize"
          :height="canvasSize"
          aria-label="Surface brightness fluctuation — procedurally generated galaxy view"
        />
      </div>
    </template>
    <template #data>
      <div ref="dataRef" class="panel-svg" />
    </template>
    <template #controls>
      <label class="im-ctrl-label">
        {{ t('pages.cosmography.experiments.sbf.distanceLabel') }}
        <span class="im-ctrl-value">{{ distanceMpc.toFixed(1) }} Mpc</span>
      </label>
      <input v-model.number="distanceMpc" type="range" min="5" max="120" step="1" class="im-slider" />
    </template>
  </IntuitionMachine>
</template>

<script setup lang="ts">
/**
 * SBFMachine — Intuition machine for Surface Brightness Fluctuation distance measurement.
 * Space: Earth → telescope → galaxy at varying distance.
 * Instrument: Procedural canvas showing SBF grain (nearby = resolved stars, far = smooth).
 * Data: grain level, interpretation, distance readouts.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as d3 from 'd3'
import IntuitionMachine from '@/components/about/IntuitionMachine.vue'
import { seededRandom } from '@/lib/math'

const { t } = useI18n()

const spaceRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const dataRef = ref<HTMLElement | null>(null)

const distanceMpc = ref(30)
const canvasSize = 240

const W = 300
const H = 180

/** Grain level: 1 at 120 Mpc (far, grainy), ~0.05 at 5 Mpc (nearby, resolved) */
const grainLevel = computed(() => {
  const logD = Math.log10(distanceMpc.value)
  const logMin = Math.log10(5)
  const logMax = Math.log10(120)
  const frac = (logD - logMin) / (logMax - logMin)
  return Math.max(0.05, Math.min(1, frac))
})

const interpretation = computed(() => {
  if (grainLevel.value > 0.6) return t('pages.cosmography.experiments.sbf.interpretFar')
  if (grainLevel.value > 0.3) return t('pages.cosmography.experiments.sbf.interpretMid')
  return t('pages.cosmography.experiments.sbf.interpretNearby')
})

let spaceSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let dataSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>

// ── Space panel ──

function createGlowFilter(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, id: string, deviation: number) {
  const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs')
  const filter = defs.append('filter').attr('id', id)
  filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', deviation).attr('result', 'blur')
  const merge = filter.append('feMerge')
  merge.append('feMergeNode').attr('in', 'blur')
  merge.append('feMergeNode').attr('in', 'SourceGraphic')
}

const earthX = 35
const galaxyBaseX = W - 50

function initSpace() {
  if (!spaceRef.value) return
  const container = d3.select(spaceRef.value)
  container.selectAll('*').remove()

  spaceSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  createGlowFilter(spaceSvg, 'star-glow', 3)

  // Background stars
  const starG = spaceSvg.append('g').attr('class', 'bg-stars')
  for (let i = 0; i < 30; i++) {
    starG.append('circle')
      .attr('cx', seededRandom(i * 7) * W)
      .attr('cy', seededRandom(i * 11) * H)
      .attr('r', seededRandom(i * 13) * 0.8 + 0.2)
      .attr('fill', 'rgba(255,255,255,0.3)')
  }

  // Light path (dashed)
  spaceSvg.append('line')
    .attr('class', 'light-path')
    .attr('stroke', 'rgba(34, 211, 238, 0.25)')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4 4')

  // Earth
  spaceSvg.append('circle')
    .attr('cx', earthX).attr('cy', H / 2).attr('r', 10)
    .attr('fill', '#4a9eff').attr('filter', 'url(#star-glow)')
  spaceSvg.append('text')
    .attr('x', earthX).attr('y', H / 2 + 20)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.7)')
    .attr('font-size', 8).text('Earth')

  // Telescope icon (small lines near Earth)
  spaceSvg.append('line')
    .attr('x1', earthX + 12).attr('y1', H / 2 - 6)
    .attr('x2', earthX + 22).attr('y2', H / 2 - 12)
    .attr('stroke', 'rgba(255,255,255,0.5)').attr('stroke-width', 1.5)
  spaceSvg.append('circle')
    .attr('cx', earthX + 24).attr('cy', H / 2 - 13).attr('r', 3)
    .attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.5)').attr('stroke-width', 1)

  // Galaxy ellipse (will be updated)
  spaceSvg.append('ellipse')
    .attr('class', 'galaxy-blob')
    .attr('cy', H / 2)
    .attr('fill', 'rgba(180, 170, 220, 0.5)')
    .attr('stroke', 'rgba(200, 190, 240, 0.3)').attr('stroke-width', 1)

  // Galaxy label
  spaceSvg.append('text')
    .attr('class', 'galaxy-label')
    .attr('y', H / 2 - 30)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)')
    .attr('font-size', 7)

  // Distance callout
  spaceSvg.append('text')
    .attr('class', 'dist-text')
    .attr('x', W / 2).attr('y', H - 12)
    .attr('text-anchor', 'middle').attr('fill', '#22d3ee')
    .attr('font-size', 10).attr('font-family', 'ui-monospace, monospace')
}

function updateSpace() {
  if (!spaceSvg) return
  const d = distanceMpc.value
  // Galaxy shrinks and dims with distance
  const distFrac = (d - 5) / (120 - 5)
  const galaxyRx = 35 - distFrac * 20
  const galaxyRy = 16 - distFrac * 8
  const galaxyOpacity = 0.7 - distFrac * 0.4

  spaceSvg.select('.galaxy-blob')
    .attr('cx', galaxyBaseX).attr('rx', galaxyRx).attr('ry', galaxyRy)
    .attr('opacity', galaxyOpacity)
  spaceSvg.select('.galaxy-label')
    .attr('x', galaxyBaseX).text(`${d.toFixed(0)} Mpc`)
  spaceSvg.select('.light-path')
    .attr('x1', earthX + 26).attr('y1', H / 2)
    .attr('x2', galaxyBaseX - galaxyRx - 4).attr('y2', H / 2)
  spaceSvg.select('.dist-text')
    .text(`${t('pages.cosmography.experiments.sbf.distanceLabel')}: ${d.toFixed(1)} Mpc`)
}

// ── Instrument panel (canvas grain view) ──

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvasSize
  const h = canvasSize
  const grain = grainLevel.value

  ctx.fillStyle = '#0a0a12'
  ctx.fillRect(0, 0, w, h)

  // Star field — fewer resolved stars when grainy (distant)
  const starCount = Math.floor(80 + (1 - grain) * 120)
  for (let i = 0; i < starCount; i++) {
    const x = seededRandom(i * 7) * w
    const y = seededRandom(i * 11) * h
    const r = 0.3 + seededRandom(i * 13) * 1.2
    const b = 0.3 + seededRandom(i * 17) * 0.7
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${b})`
    ctx.fill()
  }

  // Central object — bright core + halo (visible when nearby)
  const cx = w * 0.4
  const cy = h * 0.5
  const coreRadius = 8 + (1 - grain) * 12
  const haloRadius = 40 + (1 - grain) * 60

  const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloRadius)
  haloGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * (1 - grain * 0.7)})`)
  haloGrad.addColorStop(coreRadius / haloRadius, `rgba(255, 240, 220, ${0.4 * (1 - grain * 0.8)})`)
  haloGrad.addColorStop(1, 'rgba(80, 70, 90, 0)')
  ctx.fillStyle = haloGrad
  ctx.fillRect(cx - haloRadius, cy - haloRadius, haloRadius * 2, haloRadius * 2)

  // Elongated galaxy blob (when nearby, resolved)
  if (grain < 0.6) {
    ctx.save()
    ctx.translate(w * 0.7, h * 0.45)
    ctx.rotate(-0.4)
    const gw = 25 + (1 - grain) * 20
    const gh = 8 + (1 - grain) * 12
    const blobGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(gw, gh))
    blobGrad.addColorStop(0, `rgba(255, 255, 255, ${0.6 * (1 - grain)})`)
    blobGrad.addColorStop(0.5, `rgba(200, 190, 220, ${0.2 * (1 - grain)})`)
    blobGrad.addColorStop(1, 'rgba(60, 50, 70, 0)')
    ctx.fillStyle = blobGrad
    ctx.beginPath()
    ctx.ellipse(0, 0, gw, gh, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // SBF grain — pixel-scale brightness fluctuations (dominant when distant)
  const grainDensity = 8000 + grain * 12000
  const grainOpacity = 0.15 + grain * 0.25
  for (let i = 0; i < grainDensity; i++) {
    const gx = Math.floor(seededRandom(i * 19) * w)
    const gy = Math.floor(seededRandom(i * 23) * h)
    const lum = 0.5 + seededRandom(i * 29) * 0.5
    ctx.fillStyle = `rgba(255, 255, 255, ${lum * grainOpacity})`
    ctx.fillRect(gx, gy, 1, 1)
  }
}

// ── Data panel ──

function initData() {
  if (!dataRef.value) return
  const container = d3.select(dataRef.value)
  container.selectAll('*').remove()

  dataSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  const readouts = [
    { y: 35, label: t('pages.cosmography.experiments.sbf.grainLevel'), cls: 'rd-grain' },
    { y: 80, label: t('pages.cosmography.experiments.sbf.interpretation'), cls: 'rd-interp' },
    { y: 125, label: t('pages.cosmography.experiments.sbf.distanceLabel'), cls: 'rd-dist' },
  ]
  readouts.forEach(r => {
    dataSvg.append('text')
      .attr('x', 20).attr('y', r.y)
      .attr('fill', 'rgba(255,255,255,0.4)')
      .attr('font-size', 8).attr('font-family', 'ui-monospace, monospace')
      .text(r.label)
    dataSvg.append('text')
      .attr('class', r.cls)
      .attr('x', 20).attr('y', r.y + 18)
      .attr('fill', '#22d3ee')
      .attr('font-size', 14).attr('font-family', 'ui-monospace, monospace')
  })
}

function updateData() {
  if (!dataSvg) return
  dataSvg.select('.rd-grain').text(`${(grainLevel.value * 100).toFixed(0)}%`)
  dataSvg.select('.rd-interp').text(interpretation.value).attr('font-size', 11)
  dataSvg.select('.rd-dist').text(`${distanceMpc.value.toFixed(1)} Mpc`)
}

// ── Lifecycle ──

function updatePanels() {
  updateSpace()
  updateData()
  draw()
}

onMounted(() => {
  initSpace()
  initData()
  updatePanels()
})

watch(distanceMpc, updatePanels)
</script>

<style scoped>
.panel-svg {
  width: 100%;
  height: 100%;
  min-height: 180px;
}

.sbf-canvas-wrap {
  width: 100%;
  height: 100%;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a12;
}

.sbf-canvas {
  display: block;
  width: 100%;
  height: auto;
  max-width: 240px;
}

.im-ctrl-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.im-ctrl-value {
  font-family: ui-monospace, monospace;
  color: #22d3ee;
  margin-left: 0.5rem;
}

.im-slider {
  width: 100%;
  max-width: 400px;
  accent-color: #22d3ee;
}
</style>
