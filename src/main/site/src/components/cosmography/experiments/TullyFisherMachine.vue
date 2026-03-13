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
        {{ t('pages.cosmography.experiments.tf.rotationLabel') }}
        <span class="im-ctrl-value">{{ rotationWidth.toFixed(0) }} km/s</span>
      </label>
      <input v-model.number="rotationWidth" type="range" min="80" max="400" step="10" class="im-slider" />
    </template>
  </IntuitionMachine>
</template>

<script setup lang="ts">
/**
 * TullyFisherMachine — Intuition machine for Tully-Fisher distance measurement.
 * Space: Galaxy with visible disk + dark matter halo, rotation arrows.
 * Instrument: Rotation curve chart (v vs R) — observed (flat) vs expected (Keplerian).
 * Data: predicted luminosity and distance readouts.
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

const rotationWidth = ref(200)

const W = 300
const H = 180

// ── Physics ──

/** Tully-Fisher: log L ∝ 2.5 * log W */
const logLum = computed(() => {
  const logW = Math.log10(rotationWidth.value)
  return 2.5 * logW - 1.5
})

const distanceMpc = computed(() => {
  const M = -2.5 * logLum.value + 4.74
  const m = 22
  const dm = m - M
  return distanceModulusToMpc(dm)
})

/** Dark matter fraction: faster spin = more dark matter needed */
const dmFrac = computed(() => {
  return Math.max(0, Math.min(1, (rotationWidth.value - 80) / (400 - 80)))
})

/** Rotation curve functions */
const rMax = 12
const vMax = 450

function vObserved(r: number): number {
  const vFlat = rotationWidth.value
  const rScale = 2.5
  return vFlat * (1 - Math.exp(-r / rScale))
}

function vExpected(r: number): number {
  const vFlat = rotationWidth.value
  const rPeak = 3
  const peakFrac = 0.6
  if (r <= rPeak) {
    return vFlat * peakFrac * (r / rPeak) * Math.exp(1 - r / rPeak)
  }
  return vFlat * peakFrac * Math.sqrt(rPeak / r)
}

// ── Animation ──

let animId = 0
let startTime = 0
const rotAngle = ref(0)

function animate() {
  const elapsed = (performance.now() - startTime) / 1000
  // Rotation speed proportional to rotationWidth
  const rpm = 0.1 + (rotationWidth.value / 400) * 0.4
  rotAngle.value = (elapsed * rpm * Math.PI * 2) % (Math.PI * 2)

  // Update rotation arrows in space panel
  if (spaceSvg) {
    const cx = W / 2
    const cy = H / 2 - 5
    const diskRx = 40
    const diskRy = 14
    const angle = rotAngle.value

    // Two arrows on opposite sides of the ellipse
    for (let idx = 0; idx < 2; idx++) {
      const a = angle + idx * Math.PI
      const ax = cx + Math.cos(a) * diskRx * 0.7
      const ay = cy + Math.sin(a) * diskRy * 0.7
      // Tangent direction (perpendicular to radial)
      const tx = -Math.sin(a) * 8
      const ty = Math.cos(a) * 3

      spaceSvg.select(`.rot-arrow-${idx}`)
        .attr('x1', ax - tx).attr('y1', ay - ty)
        .attr('x2', ax + tx).attr('y2', ay + ty)
    }
  }

  animId = requestAnimationFrame(animate)
}

// ── Space panel ──

let spaceSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>

function createGlowFilter(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, id: string, deviation: number) {
  const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs')
  const filter = defs.append('filter').attr('id', id)
  filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', deviation).attr('result', 'blur')
  const merge = filter.append('feMerge')
  merge.append('feMergeNode').attr('in', 'blur')
  merge.append('feMergeNode').attr('in', 'SourceGraphic')
}

function initSpace() {
  if (!spaceRef.value) return
  const container = d3.select(spaceRef.value)
  container.selectAll('*').remove()

  spaceSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  createGlowFilter(spaceSvg, 'star-glow', 3)
  createGlowFilter(spaceSvg, 'dm-glow', 8)

  const cx = W / 2
  const cy = H / 2 - 5

  // Background stars
  const starG = spaceSvg.append('g')
  for (let i = 0; i < 25; i++) {
    starG.append('circle')
      .attr('cx', seededRandom(i * 7) * W)
      .attr('cy', seededRandom(i * 11) * H)
      .attr('r', seededRandom(i * 13) * 0.8 + 0.2)
      .attr('fill', 'rgba(255,255,255,0.25)')
  }

  // Dark matter halo (will be updated)
  spaceSvg.append('circle')
    .attr('class', 'dm-halo')
    .attr('cx', cx).attr('cy', cy)
    .attr('fill', 'rgba(120, 80, 200, 0.08)')
    .attr('stroke', 'rgba(160, 120, 240, 0.2)')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4 3')
    .attr('filter', 'url(#dm-glow)')

  // Visible galaxy disk (ellipse — face-on-ish)
  spaceSvg.append('ellipse')
    .attr('cx', cx).attr('cy', cy)
    .attr('rx', 40).attr('ry', 14)
    .attr('fill', 'rgba(180, 170, 220, 0.4)')
    .attr('stroke', 'rgba(200, 190, 240, 0.4)').attr('stroke-width', 1)

  // Galaxy core
  spaceSvg.append('ellipse')
    .attr('cx', cx).attr('cy', cy)
    .attr('rx', 10).attr('ry', 4)
    .attr('fill', 'rgba(255, 240, 200, 0.6)')

  // Rotation arrows (animated)
  for (let idx = 0; idx < 2; idx++) {
    spaceSvg.append('line')
      .attr('class', `rot-arrow-${idx}`)
      .attr('stroke', '#22d3ee')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'none')
    // Arrowhead via small triangle
    spaceSvg.append('circle')
      .attr('class', `rot-tip-${idx}`)
      .attr('r', 1.5)
      .attr('fill', '#22d3ee')
  }

  // Labels
  spaceSvg.append('text')
    .attr('x', cx).attr('y', cy + 28)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.6)')
    .attr('font-size', 7).text('visible disk')

  spaceSvg.append('text')
    .attr('class', 'dm-label')
    .attr('text-anchor', 'middle').attr('fill', 'rgba(160, 120, 240, 0.6)')
    .attr('font-size', 7)

  // Velocity readout
  spaceSvg.append('text')
    .attr('class', 'vel-text')
    .attr('x', W / 2).attr('y', H - 8)
    .attr('text-anchor', 'middle').attr('fill', '#22d3ee')
    .attr('font-size', 10).attr('font-family', 'ui-monospace, monospace')
}

function updateSpace() {
  if (!spaceSvg) return
  const cx = W / 2
  const cy = H / 2 - 5
  const haloR = 30 + dmFrac.value * 45
  const haloOpacity = 0.05 + dmFrac.value * 0.1

  spaceSvg.select('.dm-halo')
    .attr('r', haloR)
    .attr('fill', `rgba(120, 80, 200, ${haloOpacity})`)
    .attr('stroke', `rgba(160, 120, 240, ${0.15 + dmFrac.value * 0.25})`)

  spaceSvg.select('.dm-label')
    .attr('x', cx).attr('y', cy - haloR - 6)
    .text('dark matter halo')

  spaceSvg.select('.vel-text')
    .text(`v_flat = ${rotationWidth.value.toFixed(0)} km/s`)
}

// ── Instrument panel (rotation curve) ──

let instrumentSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let chartXScale: d3.ScaleLinear<number, number>
let chartYScale: d3.ScaleLinear<number, number>
let chartMargin: { left: number; right: number; top: number; bottom: number }
let chartIW: number
let chartIH: number

function initInstrument() {
  if (!instrumentRef.value) return
  const container = d3.select(instrumentRef.value)
  container.selectAll('*').remove()

  instrumentSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  chartMargin = { left: 38, right: 10, top: 22, bottom: 28 }
  chartIW = W - chartMargin.left - chartMargin.right
  chartIH = H - chartMargin.top - chartMargin.bottom

  chartXScale = d3.scaleLinear().domain([0, rMax]).range([chartMargin.left, chartMargin.left + chartIW])
  chartYScale = d3.scaleLinear().domain([0, vMax]).range([chartMargin.top + chartIH, chartMargin.top])

  // Title
  instrumentSvg.append('text')
    .attr('x', W / 2).attr('y', 14)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)')
    .attr('font-size', 9).attr('font-family', 'ui-monospace, monospace')
    .text('ROTATION CURVE')

  // Grid
  for (let i = 1; i <= 3; i++) {
    instrumentSvg.append('line')
      .attr('x1', chartXScale(i * 3)).attr('y1', chartMargin.top)
      .attr('x2', chartXScale(i * 3)).attr('y2', chartMargin.top + chartIH)
      .attr('stroke', 'rgba(255,255,255,0.06)')
  }
  for (let i = 1; i <= 3; i++) {
    instrumentSvg.append('line')
      .attr('x1', chartMargin.left).attr('y1', chartYScale(i * 100))
      .attr('x2', chartMargin.left + chartIW).attr('y2', chartYScale(i * 100))
      .attr('stroke', 'rgba(255,255,255,0.06)')
  }

  // Expected curve (dashed) — luminous matter only
  instrumentSvg.append('path')
    .attr('class', 'expected-path')
    .attr('fill', 'none')
    .attr('stroke', 'rgba(34, 211, 238, 0.5)')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '6,4')

  // Observed curve (solid) — includes dark matter
  instrumentSvg.append('path')
    .attr('class', 'observed-path')
    .attr('fill', 'none')
    .attr('stroke', 'rgba(34, 211, 238, 0.95)')
    .attr('stroke-width', 2)

  // Data points on observed curve
  instrumentSvg.append('g').attr('class', 'data-points')

  // Axes
  instrumentSvg.append('line')
    .attr('x1', chartMargin.left).attr('y1', chartMargin.top)
    .attr('x2', chartMargin.left).attr('y2', chartMargin.top + chartIH)
    .attr('stroke', 'rgba(255,255,255,0.3)')
  instrumentSvg.append('line')
    .attr('x1', chartMargin.left).attr('y1', chartMargin.top + chartIH)
    .attr('x2', chartMargin.left + chartIW).attr('y2', chartMargin.top + chartIH)
    .attr('stroke', 'rgba(255,255,255,0.3)')

  // Axis labels
  instrumentSvg.append('text')
    .attr('x', W / 2).attr('y', H - 4)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)')
    .attr('font-size', 8).text('R (kpc)')
  instrumentSvg.append('text')
    .attr('x', chartMargin.left - 6).attr('y', chartMargin.top + chartIH / 2)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)')
    .attr('font-size', 8)
    .attr('transform', `rotate(-90, ${chartMargin.left - 6}, ${chartMargin.top + chartIH / 2})`)
    .text('v (km/s)')

  // Legend
  const lx = chartMargin.left + chartIW - 4
  instrumentSvg.append('line')
    .attr('x1', lx - 30).attr('y1', chartMargin.top + 10)
    .attr('x2', lx).attr('y2', chartMargin.top + 10)
    .attr('stroke', 'rgba(34, 211, 238, 0.95)').attr('stroke-width', 2)
  instrumentSvg.append('text')
    .attr('x', lx).attr('y', chartMargin.top + 10 - 4)
    .attr('text-anchor', 'end').attr('fill', 'rgba(34, 211, 238, 0.95)')
    .attr('font-size', 7).text(t('pages.cosmography.experiments.tf.observed'))

  instrumentSvg.append('line')
    .attr('x1', lx - 30).attr('y1', chartMargin.top + 22)
    .attr('x2', lx).attr('y2', chartMargin.top + 22)
    .attr('stroke', 'rgba(34, 211, 238, 0.5)').attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '6,4')
  instrumentSvg.append('text')
    .attr('x', lx).attr('y', chartMargin.top + 22 - 4)
    .attr('text-anchor', 'end').attr('fill', 'rgba(34, 211, 238, 0.5)')
    .attr('font-size', 7).text(t('pages.cosmography.experiments.tf.expectedLuminous'))
}

function updateInstrument() {
  if (!instrumentSvg) return

  // Build observed curve path
  const obsLine = d3.line<number>()
    .x(r => chartXScale(r))
    .y(r => chartYScale(vObserved(r)))
  const rValues = Array.from({ length: 61 }, (_, i) => (i / 60) * rMax)
  instrumentSvg.select('.observed-path').attr('d', obsLine(rValues))

  // Build expected curve path
  const expLine = d3.line<number>()
    .x(r => chartXScale(r))
    .y(r => chartYScale(vExpected(r)))
  instrumentSvg.select('.expected-path').attr('d', expLine(rValues))

  // Data points
  const ptValues = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5]
  const sel = instrumentSvg.select('.data-points')
    .selectAll<SVGRectElement, number>('rect')
    .data(ptValues)

  sel.join('rect')
    .attr('x', r => chartXScale(r) - 2)
    .attr('y', r => chartYScale(vObserved(r)) - 2)
    .attr('width', 4).attr('height', 4)
    .attr('fill', '#fbbf24')
    .attr('stroke', 'rgba(0,0,0,0.3)').attr('stroke-width', 0.5)
}

// ── Data panel ──

let dataSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>

function initData() {
  if (!dataRef.value) return
  const container = d3.select(dataRef.value)
  container.selectAll('*').remove()

  dataSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  const readouts = [
    { y: 35, label: t('pages.cosmography.experiments.tf.rotationLabel'), cls: 'rd-rot' },
    { y: 80, label: t('pages.cosmography.experiments.tf.predictedLum'), cls: 'rd-lum' },
    { y: 125, label: t('pages.cosmography.experiments.tf.distance'), cls: 'rd-dist' },
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
  dataSvg.select('.rd-rot').text(`${rotationWidth.value.toFixed(0)} km/s`)
  dataSvg.select('.rd-lum').text(`${logLum.value.toFixed(2)} log L☉`)
  dataSvg.select('.rd-dist').text(`${distanceMpc.value.toFixed(1)} Mpc`)
}

// ── Lifecycle ──

function updatePanels() {
  updateSpace()
  updateInstrument()
  updateData()
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

watch(rotationWidth, updatePanels)
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
