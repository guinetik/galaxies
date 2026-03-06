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
      <button type="button" class="im-btn" :class="{ active: !paused }" @click="paused = false">
        {{ t('pages.about.measurements.sim.play') }}
      </button>
      <button type="button" class="im-btn" :class="{ active: paused }" @click="paused = true">
        {{ t('pages.about.measurements.sim.pause') }}
      </button>
      <span class="im-time">H₀ = {{ H0 }} km/s/Mpc</span>
    </template>
  </IntuitionMachine>
</template>

<script setup lang="ts">
/**
 * VelocityMachine — Intuition machine for "km/s (Velocity)".
 * Space: galaxies receding on expanding space, color-coded by redshift.
 * Instrument: spectrometer showing absorption-line shift per galaxy.
 * Data: Hubble diagram (v vs d) with v = H₀d line.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as d3 from 'd3'
import IntuitionMachine from './IntuitionMachine.vue'

const { t } = useI18n()

const spaceRef = ref<HTMLElement | null>(null)
const instrumentRef = ref<HTMLElement | null>(null)
const dataRef = ref<HTMLElement | null>(null)

const paused = ref(false)

const W = 300
const H = 180
const H0 = 70
const BASE_DISTANCES = [20, 60, 120, 200, 340] // Mpc

const velocityColor = d3
  .scaleLinear<string>()
  .domain([0, 5000, 15000, 25000])
  .range(['#4a9eff', '#22d3ee', '#f59e0b', '#dc2626'])

let spaceSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let instrumentSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let dataSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let animTime = 0
let rafId = 0
let lastTime = 0

function createGlowFilter(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, id: string, dev: number) {
  const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs')
  const f = defs.append('filter').attr('id', id)
  f.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', dev).attr('result', 'blur')
  const m = f.append('feMerge')
  m.append('feMergeNode').attr('in', 'blur')
  m.append('feMergeNode').attr('in', 'SourceGraphic')
}

/** Reference absorption line positions (rest-frame wavelengths, normalised 0–1). */
const REST_LINES = [0.2, 0.35, 0.55, 0.7, 0.85]

function initSpace() {
  if (!spaceRef.value) return
  const c = d3.select(spaceRef.value)
  c.selectAll('*').remove()

  spaceSvg = c.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet')
  createGlowFilter(spaceSvg, 'glow-v', 3)

  // Background stars
  const bg = spaceSvg.append('g')
  for (let i = 0; i < 30; i++) {
    bg.append('circle')
      .attr('cx', Math.random() * W)
      .attr('cy', Math.random() * H)
      .attr('r', Math.random() * 0.6 + 0.2)
      .attr('fill', 'rgba(255,255,255,0.25)')
  }

  // Grid lines (will stretch)
  spaceSvg.append('g').attr('class', 'grid-lines')

  // Earth
  spaceSvg.append('circle').attr('cx', 25).attr('cy', H / 2).attr('r', 8).attr('fill', '#4a9eff').attr('filter', 'url(#glow-v)')
  spaceSvg.append('text').attr('x', 25).attr('y', H / 2 + 20).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.6)').attr('font-size', 8).text('Earth')

  // Galaxy group
  spaceSvg.append('g').attr('class', 'galaxies')
}

function initInstrument() {
  if (!instrumentRef.value) return
  const c = d3.select(instrumentRef.value)
  c.selectAll('*').remove()

  instrumentSvg = c.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet')

  // Title
  instrumentSvg.append('text').attr('x', W / 2).attr('y', 16).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text('SPECTROMETER')

  // Reference spectrum at top
  const refY = 30
  const specX = 25
  const specW = W - 50
  // Spectrum gradient (violet → red)
  const defs = instrumentSvg.append('defs')
  const grad = defs.append('linearGradient').attr('id', 'spectrum-grad')
  grad.append('stop').attr('offset', '0%').attr('stop-color', '#6a0dad')
  grad.append('stop').attr('offset', '25%').attr('stop-color', '#4a9eff')
  grad.append('stop').attr('offset', '50%').attr('stop-color', '#22d3ee')
  grad.append('stop').attr('offset', '75%').attr('stop-color', '#f59e0b')
  grad.append('stop').attr('offset', '100%').attr('stop-color', '#dc2626')

  instrumentSvg.append('text').attr('x', specX).attr('y', refY - 2).attr('fill', 'rgba(255,255,255,0.35)').attr('font-size', 7).text('Rest frame')
  instrumentSvg.append('rect').attr('x', specX).attr('y', refY).attr('width', specW).attr('height', 12).attr('rx', 2).attr('fill', 'url(#spectrum-grad)').attr('opacity', 0.6)
  // Reference absorption lines
  REST_LINES.forEach((pos) => {
    instrumentSvg
      .append('line')
      .attr('x1', specX + pos * specW)
      .attr('x2', specX + pos * specW)
      .attr('y1', refY)
      .attr('y2', refY + 12)
      .attr('stroke', 'rgba(0,0,0,0.8)')
      .attr('stroke-width', 2)
  })

  // Per-galaxy observed spectra (5 rows)
  instrumentSvg.append('g').attr('class', 'observed-spectra')
}

function initData() {
  if (!dataRef.value) return
  const c = d3.select(dataRef.value)
  c.selectAll('*').remove()

  dataSvg = c.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet')

  const margin = { top: 25, right: 15, bottom: 30, left: 40 }
  const iw = W - margin.left - margin.right
  const ih = H - margin.top - margin.bottom

  // Title
  dataSvg.append('text').attr('x', W / 2).attr('y', 14).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text('HUBBLE DIAGRAM')

  const g = dataSvg.append('g').attr('transform', `translate(${margin.left},${margin.top})`).attr('class', 'chart')

  const scaleX = d3.scaleLinear().domain([0, 400]).range([0, iw])
  const scaleY = d3.scaleLinear().domain([0, 28000]).range([ih, 0])

  // Grid
  scaleY.ticks(5).forEach((tick) => {
    g.append('line').attr('x1', 0).attr('x2', iw).attr('y1', scaleY(tick)).attr('y2', scaleY(tick)).attr('stroke', 'rgba(255,255,255,0.06)')
  })

  // v = H0 * d line
  g.append('line')
    .attr('x1', scaleX(0))
    .attr('y1', scaleY(0))
    .attr('x2', scaleX(400))
    .attr('y2', scaleY(H0 * 400))
    .attr('stroke', 'rgba(34,211,238,0.25)')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4 3')

  g.append('text').attr('x', scaleX(320)).attr('y', scaleY(H0 * 320) - 6).attr('fill', 'rgba(34,211,238,0.4)').attr('font-size', 8).attr('font-family', 'ui-monospace, monospace').text('v = H₀d')

  // Axes
  g.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', ih).attr('stroke', 'rgba(255,255,255,0.4)')
  g.append('line').attr('x1', 0).attr('y1', ih).attr('x2', iw).attr('y2', ih).attr('stroke', 'rgba(255,255,255,0.4)')

  const xAxis = d3.axisBottom(scaleX).ticks(5)
  const yAxis = d3.axisLeft(scaleY).ticks(5, 's')
  g.append('g').attr('transform', `translate(0,${ih})`).call(xAxis).attr('color', 'rgba(255,255,255,0.4)').attr('font-size', 7)
  g.append('g').call(yAxis).attr('color', 'rgba(255,255,255,0.4)').attr('font-size', 7)

  g.append('text').attr('x', iw / 2).attr('y', ih + 24).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)').attr('font-size', 8).text('Distance (Mpc)')
  g.append('text').attr('x', -ih / 2).attr('y', -28).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)').attr('font-size', 8).attr('transform', 'rotate(-90)').text('km/s')

  // Galaxy points group
  g.append('g').attr('class', 'hubble-points')
}

function update() {
  const a = 1 + 0.15 * Math.sin(animTime * 0.5) // expansion factor

  // Compute current state per galaxy
  const galaxies = BASE_DISTANCES.map((baseDist) => {
    const dist = baseDist * a
    const vel = Math.round(H0 * dist)
    const color = velocityColor(vel)
    const redshiftFraction = Math.min(vel / 30000, 1)
    return { baseDist, dist, vel, color, redshiftFraction }
  })

  // === Space panel ===
  if (spaceSvg) {
    const scaleX = d3.scaleLinear().domain([0, 450]).range([40, W - 15])

    // Grid lines (space fabric)
    const gridData = d3.range(0, 500, 50).map((d) => scaleX(d * a))
    const gridSel = spaceSvg.select('.grid-lines').selectAll<SVGLineElement, number>('line').data(gridData)
    gridSel
      .join('line')
      .attr('x1', (d) => d)
      .attr('x2', (d) => d)
      .attr('y1', 10)
      .attr('y2', H - 10)
      .attr('stroke', 'rgba(255,255,255,0.04)')

    // Galaxies
    const gSel = spaceSvg.select('.galaxies').selectAll<SVGGElement, (typeof galaxies)[0]>('g').data(galaxies, (d) => d.baseDist)
    const gEnter = gSel.enter().append('g')
    gEnter.append('circle').attr('r', 6).attr('stroke', 'rgba(255,255,255,0.2)')
    gEnter.append('text').attr('y', -12).attr('text-anchor', 'middle').attr('font-size', 8).attr('font-family', 'ui-monospace, monospace')
    gEnter.append('line').attr('class', 'vel-arrow').attr('stroke-width', 1.5)

    const gMerge = gEnter.merge(gSel)
    gMerge.attr('transform', (d) => `translate(${scaleX(d.dist)}, ${H / 2})`)
    gMerge.select('circle').attr('fill', (d) => d.color)
    gMerge
      .select('text')
      .text((d) => `${d.vel} km/s`)
      .attr('fill', (d) => d.color)
    // Velocity arrow pointing right (recession)
    gMerge
      .select('.vel-arrow')
      .attr('x1', 8)
      .attr('y1', 0)
      .attr('x2', (d) => 8 + Math.min(d.vel / 800, 30))
      .attr('y2', 0)
      .attr('stroke', (d) => d.color)

    gSel.exit().remove()
  }

  // === Instrument panel (spectrometer) ===
  if (instrumentSvg) {
    const specX = 25
    const specW = W - 50
    const rowH = 22
    const startY = 50

    const sel = instrumentSvg.select('.observed-spectra').selectAll<SVGGElement, (typeof galaxies)[0]>('g').data(galaxies, (d) => d.baseDist)
    const enter = sel.enter().append('g')
    enter.append('rect').attr('x', specX).attr('width', specW).attr('height', 10).attr('rx', 2).attr('fill', 'url(#spectrum-grad)').attr('opacity', 0.4)
    REST_LINES.forEach((_, li) => {
      enter.append('line').attr('class', `abs-line-${li}`).attr('stroke', 'rgba(0,0,0,0.7)').attr('stroke-width', 2)
    })
    enter.append('text').attr('x', specX + specW + 4).attr('font-size', 7).attr('font-family', 'ui-monospace, monospace').attr('dominant-baseline', 'middle')

    const merge = enter.merge(sel)
    merge.each(function (d, i) {
      const g = d3.select(this)
      const y = startY + i * rowH
      g.select('rect').attr('y', y)
      REST_LINES.forEach((pos, li) => {
        const shiftedPos = Math.min(pos + d.redshiftFraction * 0.15, 1)
        const lx = specX + shiftedPos * specW
        g.select(`.abs-line-${li}`)
          .attr('x1', lx)
          .attr('x2', lx)
          .attr('y1', y)
          .attr('y2', y + 10)
      })
      g.select('text')
        .attr('y', y + 5)
        .attr('fill', d.color)
        .text(`${d.vel}`)
    })
    sel.exit().remove()
  }

  // === Data panel (Hubble diagram) ===
  if (dataSvg) {
    const margin = { top: 25, right: 15, bottom: 30, left: 40 }
    const iw = W - margin.left - margin.right
    const ih = H - margin.top - margin.bottom
    const scaleXChart = d3.scaleLinear().domain([0, 400]).range([0, iw])
    const scaleYChart = d3.scaleLinear().domain([0, 28000]).range([ih, 0])

    const pts = dataSvg.select('.hubble-points').selectAll<SVGCircleElement, (typeof galaxies)[0]>('circle').data(galaxies, (d) => d.baseDist)
    pts
      .join('circle')
      .attr('r', 4)
      .attr('cx', (d) => scaleXChart(d.dist))
      .attr('cy', (d) => scaleYChart(d.vel))
      .attr('fill', (d) => d.color)
      .attr('stroke', 'rgba(255,255,255,0.3)')
  }
}

function animate(time: number) {
  const dt = lastTime ? (time - lastTime) / 1000 : 0.016
  lastTime = time
  if (!paused.value) animTime += dt
  update()
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  initSpace()
  initInstrument()
  initData()
  update()
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.panel-svg {
  width: 100%;
  height: 100%;
  min-height: 180px;
}

.im-btn {
  padding: 4px 14px;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.im-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.im-btn.active {
  background: rgba(34, 211, 238, 0.2);
  border-color: #22d3ee;
  color: #22d3ee;
}

.im-time {
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.45);
}
</style>
