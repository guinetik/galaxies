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
        {{ t('pages.about.measurements.sim.distanceLabel') }}
        <span class="im-ctrl-value">{{ distanceMpc.toFixed(0) }} Mpc</span>
      </label>
      <input v-model.number="distanceMpc" type="range" min="1" max="400" step="1" class="im-slider" />
      <span class="im-ctrl-readout">DM = {{ dm.toFixed(2) }}</span>
    </template>
  </IntuitionMachine>
</template>

<script setup lang="ts">
/**
 * DmMachine — Intuition machine for "Distance Modulus".
 * Space: two identical stars — one at 10 pc (reference), one at user's distance. Far star looks dimmer.
 * Instrument: photometer bars comparing apparent (m) and absolute (M) magnitude.
 * Data: DM vs distance curve with interactive point.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { mpcToDistanceModulus } from '@/lib/astronomy'
import * as d3 from 'd3'
import IntuitionMachine from './IntuitionMachine.vue'

const { t } = useI18n()

const spaceRef = ref<HTMLElement | null>(null)
const instrumentRef = ref<HTMLElement | null>(null)
const dataRef = ref<HTMLElement | null>(null)

const distanceMpc = ref(70)

/** DM = 5 * log10(d_pc / 10), where d_pc = distanceMpc * 1e6 */
const dm = computed(() => mpcToDistanceModulus(distanceMpc.value))

/** Absolute magnitude of reference star (arbitrary but consistent) */
const M_ABS = -20
/** Apparent magnitude at user's distance */
const mApp = computed(() => M_ABS + dm.value)

const W = 300
const H = 180

let spaceSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let instrumentSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let dataSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>

function createGlowFilter(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, id: string, dev: number) {
  const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs')
  const f = defs.append('filter').attr('id', id).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
  f.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', dev).attr('result', 'blur')
  const m = f.append('feMerge')
  m.append('feMergeNode').attr('in', 'blur')
  m.append('feMergeNode').attr('in', 'SourceGraphic')
}

function initSpace() {
  if (!spaceRef.value) return
  const c = d3.select(spaceRef.value)
  c.selectAll('*').remove()

  spaceSvg = c.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet')
  createGlowFilter(spaceSvg, 'bright-glow', 6)
  createGlowFilter(spaceSvg, 'dim-glow', 3)

  // Background stars
  const bg = spaceSvg.append('g')
  for (let i = 0; i < 35; i++) {
    bg.append('circle')
      .attr('cx', Math.random() * W)
      .attr('cy', Math.random() * H)
      .attr('r', Math.random() * 0.6 + 0.2)
      .attr('fill', 'rgba(255,255,255,0.25)')
  }

  // Title
  spaceSvg.append('text').attr('x', W / 2).attr('y', 16).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text('SAME STAR, DIFFERENT DISTANCE')

  // Reference star (at 10 pc — very close, very bright)
  const refX = W * 0.25
  const refY = H * 0.55
  spaceSvg.append('circle').attr('class', 'ref-star').attr('cx', refX).attr('cy', refY).attr('r', 16).attr('fill', '#ffe066').attr('filter', 'url(#bright-glow)')
  spaceSvg.append('text').attr('x', refX).attr('y', refY + 30).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.6)').attr('font-size', 8).text('10 pc (reference)')
  spaceSvg.append('text').attr('x', refX).attr('y', refY + 42).attr('text-anchor', 'middle').attr('fill', '#ffe066').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text(`M = ${M_ABS}`)

  // Far star (at user distance — dimmer, smaller)
  const farX = W * 0.75
  spaceSvg.append('circle').attr('class', 'far-star').attr('cx', farX).attr('cy', refY).attr('fill', '#ffe066').attr('filter', 'url(#dim-glow)')
  spaceSvg.append('text').attr('class', 'far-dist-label').attr('x', farX).attr('y', refY + 30).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.6)').attr('font-size', 8)
  spaceSvg.append('text').attr('class', 'far-mag-label').attr('x', farX).attr('y', refY + 42).attr('text-anchor', 'middle').attr('fill', '#ffe066').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace')
}

function initInstrument() {
  if (!instrumentRef.value) return
  const c = d3.select(instrumentRef.value)
  c.selectAll('*').remove()

  instrumentSvg = c.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet')

  // Title
  instrumentSvg.append('text').attr('x', W / 2).attr('y', 16).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text('PHOTOMETER')

  // M (absolute) bar — fixed
  const barX = 40
  const barW = W - 80
  const mBarY = 45
  const MBarY = 95
  const barH = 20

  // Labels
  instrumentSvg.append('text').attr('x', barX - 5).attr('y', mBarY + 14).attr('text-anchor', 'end').attr('fill', 'rgba(255,255,255,0.6)').attr('font-size', 10).attr('font-family', 'ui-monospace, monospace').text('m')
  instrumentSvg.append('text').attr('x', barX - 5).attr('y', MBarY + 14).attr('text-anchor', 'end').attr('fill', 'rgba(255,255,255,0.6)').attr('font-size', 10).attr('font-family', 'ui-monospace, monospace').text('M')

  // Track backgrounds
  instrumentSvg.append('rect').attr('x', barX).attr('y', mBarY).attr('width', barW).attr('height', barH).attr('rx', 4).attr('fill', 'rgba(255,255,255,0.06)')
  instrumentSvg.append('rect').attr('x', barX).attr('y', MBarY).attr('width', barW).attr('height', barH).attr('rx', 4).attr('fill', 'rgba(255,255,255,0.06)')

  // M fill (fixed — absolute magnitude)
  const magScale = d3.scaleLinear().domain([-25, 20]).range([0, barW])
  const mFillW = magScale(M_ABS)
  instrumentSvg.append('rect').attr('x', barX).attr('y', MBarY).attr('width', Math.max(0, mFillW)).attr('height', barH).attr('rx', 4).attr('fill', 'rgba(34,211,238,0.4)')
  instrumentSvg.append('text').attr('x', barX + Math.max(0, mFillW) + 6).attr('y', MBarY + 14).attr('fill', '#22d3ee').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text(`${M_ABS}`)

  // m fill (dynamic)
  instrumentSvg.append('rect').attr('class', 'm-fill').attr('x', barX).attr('y', mBarY).attr('height', barH).attr('rx', 4).attr('fill', 'rgba(255,224,102,0.4)')
  instrumentSvg.append('text').attr('class', 'm-value').attr('y', mBarY + 14).attr('fill', '#ffe066').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace')

  // DM bracket
  instrumentSvg.append('line').attr('class', 'dm-bracket-left').attr('stroke', 'rgba(255,255,255,0.4)').attr('stroke-width', 1)
  instrumentSvg.append('line').attr('class', 'dm-bracket-right').attr('stroke', 'rgba(255,255,255,0.4)').attr('stroke-width', 1)
  instrumentSvg.append('line').attr('class', 'dm-bracket-bar').attr('stroke', 'rgba(34,211,238,0.6)').attr('stroke-width', 2)
  instrumentSvg.append('text').attr('class', 'dm-bracket-label').attr('text-anchor', 'middle').attr('fill', '#22d3ee').attr('font-size', 10).attr('font-family', 'ui-monospace, monospace')

  // Formula
  instrumentSvg.append('text').attr('x', W / 2).attr('y', 160).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.35)').attr('font-size', 8).attr('font-family', 'ui-monospace, monospace').text('DM = m − M = 5 log₁₀(d / 10 pc)')
}

function initData() {
  if (!dataRef.value) return
  const c = d3.select(dataRef.value)
  c.selectAll('*').remove()

  dataSvg = c.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet')

  const margin = { top: 25, right: 15, bottom: 30, left: 40 }
  const iw = W - margin.left - margin.right
  const ih = H - margin.top - margin.bottom

  dataSvg.append('text').attr('x', W / 2).attr('y', 14).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text('DISTANCE MODULUS CURVE')

  const g = dataSvg.append('g').attr('transform', `translate(${margin.left},${margin.top})`).attr('class', 'dm-chart')

  const scaleX = d3.scaleLog().domain([1, 500]).range([0, iw])
  const scaleY = d3.scaleLinear().domain([0, 45]).range([ih, 0])

  // Grid
  scaleY.ticks(6).forEach((tick) => {
    g.append('line').attr('x1', 0).attr('x2', iw).attr('y1', scaleY(tick)).attr('y2', scaleY(tick)).attr('stroke', 'rgba(255,255,255,0.05)')
  })

  // DM curve
  const curveData = d3.range(1, 501, 2)
  const line = d3
    .line<number>()
    .x((d) => scaleX(d))
    .y((d) => scaleY(5 * Math.log10((d * 1e6) / 10)))
    .curve(d3.curveMonotoneX)

  g.append('path').attr('d', line(curveData)!).attr('fill', 'none').attr('stroke', 'rgba(34,211,238,0.4)').attr('stroke-width', 2)

  // DM = 25 reference line (1 Mpc)
  const dm25Y = scaleY(25)
  g.append('line').attr('x1', 0).attr('x2', iw).attr('y1', dm25Y).attr('y2', dm25Y).attr('stroke', 'rgba(255,255,255,0.1)').attr('stroke-dasharray', '3 3')
  g.append('text').attr('x', iw - 2).attr('y', dm25Y - 4).attr('text-anchor', 'end').attr('fill', 'rgba(255,255,255,0.25)').attr('font-size', 7).text('DM 25 ≈ 1 Mpc')

  // Axes
  g.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', ih).attr('stroke', 'rgba(255,255,255,0.4)')
  g.append('line').attr('x1', 0).attr('y1', ih).attr('x2', iw).attr('y2', ih).attr('stroke', 'rgba(255,255,255,0.4)')

  g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(scaleX).ticks(5, '.0f')).attr('color', 'rgba(255,255,255,0.4)').attr('font-size', 7)
  g.append('g').call(d3.axisLeft(scaleY).ticks(6)).attr('color', 'rgba(255,255,255,0.4)').attr('font-size', 7)

  g.append('text').attr('x', iw / 2).attr('y', ih + 24).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)').attr('font-size', 8).text('Distance (Mpc)')
  g.append('text').attr('x', -ih / 2).attr('y', -28).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)').attr('font-size', 8).attr('transform', 'rotate(-90)').text('DM')

  // Interactive point
  g.append('circle').attr('class', 'dm-point').attr('r', 6).attr('fill', '#22d3ee').attr('stroke', 'rgba(255,255,255,0.5)')
  g.append('line').attr('class', 'dm-crosshair-h').attr('stroke', 'rgba(34,211,238,0.2)').attr('stroke-dasharray', '2 2')
  g.append('line').attr('class', 'dm-crosshair-v').attr('stroke', 'rgba(34,211,238,0.2)').attr('stroke-dasharray', '2 2')
}

function updatePanels() {
  const d = distanceMpc.value
  const currentDm = dm.value
  const currentM = mApp.value

  // === Space panel ===
  if (spaceSvg) {
    // Far star size and opacity decrease with distance (inverse square law feeling)
    const maxR = 14
    const minR = 2
    const farR = Math.max(minR, maxR * Math.pow(10 / (d * 1e6 / 3.26e6), 0.15))
    const farOpacity = Math.max(0.2, 1 - d / 500)

    spaceSvg.select('.far-star').attr('r', farR).attr('opacity', farOpacity)
    spaceSvg.select('.far-dist-label').text(`${d} Mpc`)
    spaceSvg.select('.far-mag-label').text(`m = ${currentM.toFixed(1)}`)
  }

  // === Instrument panel ===
  if (instrumentSvg) {
    const barX = 40
    const barW = W - 80
    const mBarY = 45
    const MBarY = 95
    const magScale = d3.scaleLinear().domain([-25, 20]).range([0, barW])

    const mFillW = Math.max(0, magScale(currentM))
    const MFillW = Math.max(0, magScale(M_ABS))

    instrumentSvg.select('.m-fill').attr('width', Math.min(mFillW, barW))
    instrumentSvg
      .select('.m-value')
      .attr('x', barX + Math.min(mFillW, barW) + 6)
      .text(currentM.toFixed(1))

    // DM bracket between the two bars
    const bracketX = barX + barW + 10
    instrumentSvg.select('.dm-bracket-left').attr('x1', bracketX - 4).attr('x2', bracketX).attr('y1', mBarY + 10).attr('y2', mBarY + 10)
    instrumentSvg.select('.dm-bracket-right').attr('x1', bracketX - 4).attr('x2', bracketX).attr('y1', MBarY + 10).attr('y2', MBarY + 10)
    instrumentSvg.select('.dm-bracket-bar').attr('x1', bracketX - 2).attr('x2', bracketX - 2).attr('y1', mBarY + 10).attr('y2', MBarY + 10)
    instrumentSvg
      .select('.dm-bracket-label')
      .attr('x', bracketX + 14)
      .attr('y', (mBarY + MBarY) / 2 + 14)
      .text(`DM ${currentDm.toFixed(1)}`)
  }

  // === Data panel ===
  if (dataSvg) {
    const margin = { top: 25, right: 15, bottom: 30, left: 40 }
    const iw = W - margin.left - margin.right
    const ih = H - margin.top - margin.bottom
    const scaleX = d3.scaleLog().domain([1, 500]).range([0, iw])
    const scaleY = d3.scaleLinear().domain([0, 45]).range([ih, 0])

    const px = scaleX(d)
    const py = scaleY(currentDm)

    dataSvg.select('.dm-point').attr('cx', px).attr('cy', py)
    dataSvg.select('.dm-crosshair-h').attr('x1', 0).attr('x2', px).attr('y1', py).attr('y2', py)
    dataSvg.select('.dm-crosshair-v').attr('x1', px).attr('x2', px).attr('y1', py).attr('y2', ih)
  }
}

onMounted(() => {
  initSpace()
  initInstrument()
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

.im-ctrl-readout {
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
  color: #22d3ee;
}
</style>
