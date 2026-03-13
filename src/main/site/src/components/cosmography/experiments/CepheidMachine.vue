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
      <div ref="instrumentRef" class="panel-svg" />
    </template>
    <template #data>
      <div ref="dataRef" class="panel-svg" />
    </template>
    <template #controls>
      <label class="im-ctrl-label">
        {{ t('pages.cosmography.experiments.ceph.periodLabel') }}
        <span class="im-ctrl-value">{{ period }} days</span>
      </label>
      <input v-model.number="period" type="range" min="1" max="60" step="0.5" class="im-slider" />
    </template>
  </IntuitionMachine>
</template>

<script setup lang="ts">
/**
 * CepheidMachine — Intuition machine for Cepheid variable star distance measurement.
 * Space: Earth → light path → galaxy with pulsing Cepheid.
 * Instrument: Leavitt's Law period-luminosity diagram.
 * Data: magnitude and distance readouts.
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as d3 from 'd3'
import IntuitionMachine from '@/components/about/IntuitionMachine.vue'
import { distanceModulusToMpc } from '@/lib/astronomy'
import { seededRandom } from '@/lib/math'

const { t } = useI18n()

const spaceRef = ref<HTMLElement | null>(null)
const instrumentRef = ref<HTMLElement | null>(null)
const dataRef = ref<HTMLElement | null>(null)

const period = ref(10)

const W = 300
const H = 180

/** Leavitt's law: M_V ≈ -3.43 * log10(P) - 2.76 */
const absoluteMag = computed(() => {
  const logP = Math.log10(period.value)
  return -3.43 * logP - 2.76
})

const APPARENT_MAG = 22

const distanceMpc = computed(() => {
  const dm = APPARENT_MAG - absoluteMag.value
  return distanceModulusToMpc(dm)
})

/** Cepheid visual radius: brighter = bigger star */
const cephRadius = computed(() => {
  const M = absoluteMag.value
  const scale = Math.max(0, Math.min(1, (M - (-2.5)) / ((-9) - (-2.5))))
  return 6 + scale * 14
})

/** Pulse phase for brightness animation */
const pulsePhase = ref(0)
let animId = 0
let startTime = 0

/** Brightness oscillates 0.5–1.2 */
const cephBrightness = computed(() => {
  const minB = 0.5
  const maxB = 1.2
  const frac = (Math.sin(pulsePhase.value) + 1) / 2
  return minB + frac * (maxB - minB)
})

/** 8 reference Cepheids for P-L scatter, evenly spaced in log space P=3..50 */
const refCepheids = Array.from({ length: 8 }, (_, i) => {
  const logP = Math.log10(3) + (i / 7) * (Math.log10(50) - Math.log10(3))
  const M = -3.43 * logP - 2.76
  const jitter = (seededRandom(i * 31) - 0.5) * 0.4 // ±0.2 mag
  return { logP, M: M + jitter }
})

let spaceSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let instrumentSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let dataSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let plXScale: d3.ScaleLinear<number, number>
let plYScale: d3.ScaleLinear<number, number>

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
const galaxyX = W - 40

function initSpace() {
  if (!spaceRef.value) return
  const container = d3.select(spaceRef.value)
  container.selectAll('*').remove()

  spaceSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  createGlowFilter(spaceSvg, 'star-glow', 3)
  createGlowFilter(spaceSvg, 'ceph-glow', 4)

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
    .attr('font-size', 8).text(t('pages.cosmography.experiments.ceph.earth'))

  // Galaxy blob
  spaceSvg.append('ellipse')
    .attr('cx', galaxyX).attr('cy', H / 2)
    .attr('rx', 35).attr('ry', 16)
    .attr('fill', 'rgba(80, 80, 120, 0.4)')
    .attr('stroke', 'rgba(150, 150, 200, 0.3)').attr('stroke-width', 1)

  // Cepheid star (will be updated)
  spaceSvg.append('circle')
    .attr('class', 'cepheid')
    .attr('cx', galaxyX).attr('cy', H / 2)
    .attr('fill', '#ffd700').attr('filter', 'url(#ceph-glow)')

  // Galaxy label
  spaceSvg.append('text')
    .attr('x', galaxyX).attr('y', H / 2 - 28)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)')
    .attr('font-size', 7).text(t('pages.cosmography.experiments.ceph.pulsingStar'))

  // Distance callout
  spaceSvg.append('text')
    .attr('class', 'dist-text')
    .attr('x', W / 2).attr('y', H - 12)
    .attr('text-anchor', 'middle').attr('fill', '#22d3ee')
    .attr('font-size', 10).attr('font-family', 'ui-monospace, monospace')
}

function updateSpace() {
  if (!spaceSvg) return
  const r = cephRadius.value
  spaceSvg.select('.cepheid').attr('r', r)
  spaceSvg.select('.light-path')
    .attr('x1', earthX + 14).attr('y1', H / 2)
    .attr('x2', galaxyX - 38).attr('y2', H / 2)
  spaceSvg.select('.dist-text')
    .text(`${t('pages.cosmography.experiments.ceph.distance')}: ${distanceMpc.value.toFixed(1)} Mpc`)
}

// ── Instrument panel (P-L diagram) ──

function initInstrument() {
  if (!instrumentRef.value) return
  const container = d3.select(instrumentRef.value)
  container.selectAll('*').remove()

  instrumentSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  const m = { left: 40, right: 15, top: 28, bottom: 28 }
  const iw = W - m.left - m.right
  const ih = H - m.top - m.bottom

  // Title
  instrumentSvg.append('text')
    .attr('x', W / 2).attr('y', 16)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)')
    .attr('font-size', 9).attr('font-family', 'ui-monospace, monospace')
    .text('LEAVITT\'S LAW')

  // Scales: X = log10(P) [0, 2], Y = M [-2, -10] (inverted: -2 at bottom, -10 at top)
  const xScale = d3.scaleLinear().domain([0, 2]).range([m.left, m.left + iw])
  const yScale = d3.scaleLinear().domain([-2, -10]).range([m.top + ih, m.top])

  // Grid
  for (let i = 1; i <= 3; i++) {
    const gx = xScale(i * 0.5)
    instrumentSvg.append('line')
      .attr('x1', gx).attr('y1', m.top).attr('x2', gx).attr('y2', m.top + ih)
      .attr('stroke', 'rgba(255,255,255,0.06)')
  }
  for (let i = 1; i <= 3; i++) {
    const gy = yScale(-2 - i * 2)
    instrumentSvg.append('line')
      .attr('x1', m.left).attr('y1', gy).attr('x2', m.left + iw).attr('y2', gy)
      .attr('stroke', 'rgba(255,255,255,0.06)')
  }

  // P-L reference line
  const linePoints: [number, number][] = []
  for (let i = 0; i <= 40; i++) {
    const logP = (i / 40) * 2
    const mag = -3.43 * logP - 2.76
    linePoints.push([xScale(logP), yScale(mag)])
  }
  const line = d3.line<[number, number]>().x(d => d[0]).y(d => d[1])
  instrumentSvg.append('path')
    .attr('d', line(linePoints))
    .attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.2)')
    .attr('stroke-width', 1.5)

  // Reference Cepheid scatter points
  refCepheids.forEach(c => {
    instrumentSvg.append('circle')
      .attr('cx', xScale(c.logP)).attr('cy', yScale(c.M))
      .attr('r', 2.5)
      .attr('fill', 'rgba(255, 200, 50, 0.6)')
  })

  // Current position marker (will be updated)
  instrumentSvg.append('circle')
    .attr('class', 'pl-marker')
    .attr('r', 5)
    .attr('fill', '#22d3ee')
    .attr('stroke', 'rgba(255,255,255,0.6)')
    .attr('stroke-width', 1)

  // Axes
  instrumentSvg.append('line')
    .attr('x1', m.left).attr('y1', m.top)
    .attr('x2', m.left).attr('y2', m.top + ih)
    .attr('stroke', 'rgba(255,255,255,0.3)')
  instrumentSvg.append('line')
    .attr('x1', m.left).attr('y1', m.top + ih)
    .attr('x2', m.left + iw).attr('y2', m.top + ih)
    .attr('stroke', 'rgba(255,255,255,0.3)')

  // Axis labels
  instrumentSvg.append('text')
    .attr('x', W / 2).attr('y', H - 4)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)')
    .attr('font-size', 8).text('log P (days)')
  instrumentSvg.append('text')
    .attr('x', m.left - 6).attr('y', m.top + ih / 2)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)')
    .attr('font-size', 8)
    .attr('transform', `rotate(-90, ${m.left - 6}, ${m.top + ih / 2})`)
    .text('M (mag)')

  // Axis tick labels
  ;[0, 0.5, 1, 1.5, 2].forEach(v => {
    instrumentSvg.append('text')
      .attr('x', xScale(v)).attr('y', m.top + ih + 14)
      .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.3)')
      .attr('font-size', 7).text(v.toString())
  })
  ;[-4, -6, -8, -10].forEach(v => {
    instrumentSvg.append('text')
      .attr('x', m.left - 6).attr('y', yScale(v) + 3)
      .attr('text-anchor', 'end').attr('fill', 'rgba(255,255,255,0.3)')
      .attr('font-size', 7).text(v.toString())
  })

  // Store scales for updateInstrument
  plXScale = xScale
  plYScale = yScale
}

function updateInstrument() {
  if (!instrumentSvg || !plXScale || !plYScale) return
  const logP = Math.log10(period.value)
  const M = absoluteMag.value
  instrumentSvg.select('.pl-marker')
    .attr('cx', plXScale(logP))
    .attr('cy', plYScale(M))
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
    { y: 35, label: t('pages.cosmography.experiments.ceph.howBright'), cls: 'rd-absmag' },
    { y: 80, label: t('pages.cosmography.experiments.ceph.howDim'), cls: 'rd-appmag' },
    { y: 125, label: t('pages.cosmography.experiments.ceph.distance'), cls: 'rd-dist' },
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
  dataSvg.select('.rd-absmag').text(`${absoluteMag.value.toFixed(1)} mag`)
  dataSvg.select('.rd-appmag').text(`${APPARENT_MAG} mag`)
  dataSvg.select('.rd-dist').text(`${distanceMpc.value.toFixed(1)} Mpc`)
}

// ── Lifecycle ──

function updatePanels() {
  updateSpace()
  updateInstrument()
  updateData()
}

function animate() {
  const elapsed = (performance.now() - startTime) / 1000
  const cycleSeconds = 2 + period.value / 10
  const cycles = elapsed / cycleSeconds
  pulsePhase.value = (cycles % 1) * Math.PI * 2

  // Update Cepheid brightness in space panel
  if (spaceSvg) {
    spaceSvg.select('.cepheid')
      .attr('opacity', cephBrightness.value)
      .attr('r', cephRadius.value * (0.85 + cephBrightness.value * 0.15))
  }

  animId = requestAnimationFrame(animate)
}

onMounted(() => {
  initSpace()
  initInstrument()
  initData()
  updatePanels()
  startTime = performance.now()
  animId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})

watch(period, updatePanels)
</script>

<style scoped>
.panel-svg {
  width: 100%;
  height: 100%;
  min-height: 180px;
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
