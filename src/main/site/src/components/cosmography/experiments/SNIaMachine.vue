<template>
  <IntuitionMachine
    :space-label="t('pages.about.measurements.panels.space')"
    :instrument-label="t('pages.about.measurements.panels.instrument')"
    :data-label="t('pages.about.measurements.panels.data')"
  >
    <template #space>
      <div class="snia-space">
        <div
          class="snia-explosion-dimness"
          :style="{ filter: `brightness(${apparentBrightness})` }"
        >
          <svg
            class="snia-explosion"
            viewBox="0 0 120 120"
            :style="{ '--explosion-scale': stretchFactor }"
          >
            <defs>
              <radialGradient id="snia-burst-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fff" stop-opacity="0.9" />
                <stop offset="25%" stop-color="#fcd34d" stop-opacity="0.7" />
                <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.4" />
                <stop offset="75%" stop-color="#ea580c" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#7c2d12" stop-opacity="0" />
              </radialGradient>
              <radialGradient id="snia-core" cx="50%" cy="50%" r="30%">
                <stop offset="0%" stop-color="#fff" />
                <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.3" />
              </radialGradient>
            </defs>
            <circle cx="60" cy="60" r="55" fill="url(#snia-burst-grad)" class="explosion-burst" />
            <circle cx="60" cy="60" r="12" fill="url(#snia-core)" class="explosion-core" />
            <circle
              v-for="i in 5"
              :key="i"
              cx="60"
              cy="60"
              :r="8 + i * 6"
              fill="none"
              stroke="rgba(251, 191, 36, 0.4)"
              stroke-width="1"
              class="explosion-ring"
              :style="{ animationDelay: `${i * 0.15}s` }"
            />
          </svg>
        </div>
        <span class="explosion-label">m = {{ apparentMag.toFixed(1) }}</span>
      </div>
    </template>
    <template #instrument>
      <div ref="instrumentRef" class="panel-svg" />
    </template>
    <template #data>
      <div ref="dataRef" class="panel-svg" />
    </template>
    <template #controls>
      <label class="im-ctrl-label">
        {{ t('pages.cosmography.experiments.snia.stretchLabel') }}
        <span class="im-ctrl-value">{{ stretchFactor.toFixed(2) }}</span>
      </label>
      <input v-model.number="stretchRaw" type="range" min="80" max="120" step="2" class="im-slider im-slider-amber" />
      <label class="im-ctrl-label">
        {{ t('pages.cosmography.experiments.snia.apparentMagLabel') }}
        <span class="im-ctrl-value">{{ apparentMag.toFixed(1) }} mag</span>
      </label>
      <input v-model.number="apparentMag" type="range" min="18" max="26" step="0.5" class="im-slider" />
    </template>
  </IntuitionMachine>
</template>

<script setup lang="ts">
/**
 * SNIaMachine — Intuition machine for Type Ia supernova distance measurement.
 * Space: Animated supernova explosion with brightness dimming by apparent magnitude.
 * Instrument: Light curve chart (magnitude vs days) with stretch factor.
 * Data: peak magnitude and distance readouts.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as d3 from 'd3'
import IntuitionMachine from '@/components/about/IntuitionMachine.vue'
import { distanceModulusToMpc } from '@/lib/astronomy'

const { t } = useI18n()

const instrumentRef = ref<HTMLElement | null>(null)
const dataRef = ref<HTMLElement | null>(null)

const W = 300
const H = 180

// Stretch factor: 0.8–1.2 (slider 80–120)
const stretchRaw = ref(100)
const apparentMag = ref(22)

const stretchFactor = computed(() => stretchRaw.value / 100)

/** Peak magnitude after stretch correction (Phillips: slower decline = brighter) */
const peakMag = computed(() => -19.3 - 1.2 * (stretchFactor.value - 1))

const distanceMpc = computed(() => {
  const M = peakMag.value
  const m = apparentMag.value
  const dm = m - M
  return distanceModulusToMpc(dm)
})

/** Explosion brightness: m=18 bright, m=26 dim */
const apparentBrightness = computed(() => {
  const m = apparentMag.value
  return Math.max(0.25, 1 - (m - 18) / 10)
})

// ── Light curve math ──

const dayMin = -15
const dayMax = 60
const magMin = -19.5
const magMax = -15.5

function magAtDay(day: number, s: number): number {
  const riseTime = 18
  if (day < 0) {
    const frac = -day / riseTime
    return magMin + (magMax - magMin) * (1 - Math.exp(-frac))
  }
  const declineRate = 0.08 / s
  return magMin + declineRate * day
}

const phaseDay = 20

// ── Instrument panel (light curve) ──

let instrumentSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let chartXScale: d3.ScaleLinear<number, number>
let chartYScale: d3.ScaleLinear<number, number>
let chartM: { left: number; right: number; top: number; bottom: number }

function initInstrument() {
  if (!instrumentRef.value) return
  const container = d3.select(instrumentRef.value)
  container.selectAll('*').remove()

  instrumentSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  chartM = { left: 38, right: 10, top: 22, bottom: 28 }
  const iw = W - chartM.left - chartM.right
  const ih = H - chartM.top - chartM.bottom

  chartXScale = d3.scaleLinear().domain([dayMin, dayMax]).range([chartM.left, chartM.left + iw])
  chartYScale = d3.scaleLinear().domain([magMin, magMax]).range([chartM.top, chartM.top + ih])

  // Title
  instrumentSvg.append('text')
    .attr('x', W / 2).attr('y', 14)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)')
    .attr('font-size', 9).attr('font-family', 'ui-monospace, monospace')
    .text('LIGHT CURVE')

  // Grid
  for (let i = 1; i <= 4; i++) {
    instrumentSvg.append('line')
      .attr('x1', chartXScale(dayMin + (i / 5) * (dayMax - dayMin))).attr('y1', chartM.top)
      .attr('x2', chartXScale(dayMin + (i / 5) * (dayMax - dayMin))).attr('y2', chartM.top + ih)
      .attr('stroke', 'rgba(255,255,255,0.06)')
  }
  for (let i = 1; i <= 3; i++) {
    instrumentSvg.append('line')
      .attr('x1', chartM.left).attr('y1', chartYScale(magMin + (i / 4) * (magMax - magMin)))
      .attr('x2', chartM.left + iw).attr('y2', chartYScale(magMin + (i / 4) * (magMax - magMin)))
      .attr('stroke', 'rgba(255,255,255,0.06)')
  }

  // Reference curve (s=1, dashed)
  instrumentSvg.append('path')
    .attr('class', 'ref-curve')
    .attr('fill', 'none')
    .attr('stroke', 'rgba(255, 255, 255, 0.35)')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')

  // Observed curve (solid)
  instrumentSvg.append('path')
    .attr('class', 'obs-curve')
    .attr('fill', 'none')
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 2)

  // Phase marker line
  instrumentSvg.append('line')
    .attr('class', 'phase-line')
    .attr('stroke', '#22d3ee').attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')

  // Phase marker dot
  instrumentSvg.append('circle')
    .attr('class', 'phase-dot')
    .attr('r', 4).attr('fill', '#22d3ee')
    .attr('stroke', 'rgba(255,255,255,0.8)').attr('stroke-width', 1)

  // Axes
  instrumentSvg.append('line')
    .attr('x1', chartM.left).attr('y1', chartM.top)
    .attr('x2', chartM.left).attr('y2', chartM.top + ih)
    .attr('stroke', 'rgba(255,255,255,0.3)')
  instrumentSvg.append('line')
    .attr('x1', chartM.left).attr('y1', chartM.top + ih)
    .attr('x2', chartM.left + iw).attr('y2', chartM.top + ih)
    .attr('stroke', 'rgba(255,255,255,0.3)')

  // Axis labels
  instrumentSvg.append('text')
    .attr('x', W / 2).attr('y', H - 4)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)')
    .attr('font-size', 8).text(t('pages.cosmography.experiments.snia.daysLabel'))
  instrumentSvg.append('text')
    .attr('x', chartM.left - 6).attr('y', chartM.top + ih / 2)
    .attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.4)')
    .attr('font-size', 8)
    .attr('transform', `rotate(-90, ${chartM.left - 6}, ${chartM.top + ih / 2})`)
    .text(t('pages.cosmography.experiments.snia.magLabel'))

  // Legend
  const lx = chartM.left + iw - 4
  instrumentSvg.append('line')
    .attr('x1', lx - 30).attr('y1', chartM.top + 10)
    .attr('x2', lx).attr('y2', chartM.top + 10)
    .attr('stroke', '#f59e0b').attr('stroke-width', 2)
  instrumentSvg.append('text')
    .attr('x', lx).attr('y', chartM.top + 10 - 4)
    .attr('text-anchor', 'end').attr('fill', '#f59e0b')
    .attr('font-size', 7).text(t('pages.cosmography.experiments.snia.observed'))

  instrumentSvg.append('line')
    .attr('x1', lx - 30).attr('y1', chartM.top + 22)
    .attr('x2', lx).attr('y2', chartM.top + 22)
    .attr('stroke', 'rgba(255,255,255,0.35)').attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
  instrumentSvg.append('text')
    .attr('x', lx).attr('y', chartM.top + 22 - 4)
    .attr('text-anchor', 'end').attr('fill', 'rgba(255,255,255,0.35)')
    .attr('font-size', 7).text(t('pages.cosmography.experiments.snia.reference'))
}

function buildCurvePath(s: number): string {
  const pts: string[] = []
  for (let i = 0; i <= 80; i++) {
    const day = dayMin + (i / 80) * (dayMax - dayMin)
    const mag = magAtDay(day, s)
    const clamped = Math.min(magMax, Math.max(magMin, mag))
    pts.push(`${i === 0 ? 'M' : 'L'} ${chartXScale(day)} ${chartYScale(clamped)}`)
  }
  return pts.join(' ')
}

function updateInstrument() {
  if (!instrumentSvg) return

  instrumentSvg.select('.ref-curve').attr('d', buildCurvePath(1))
  instrumentSvg.select('.obs-curve').attr('d', buildCurvePath(stretchFactor.value))

  const mx = chartXScale(phaseDay)
  const mag = magAtDay(phaseDay, stretchFactor.value)
  const my = chartYScale(Math.min(magMax, Math.max(magMin, mag)))

  instrumentSvg.select('.phase-line')
    .attr('x1', mx).attr('y1', chartM.top)
    .attr('x2', mx).attr('y2', chartM.top + (H - chartM.top - chartM.bottom))
  instrumentSvg.select('.phase-dot')
    .attr('cx', mx).attr('cy', my)
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
    { y: 35, label: t('pages.cosmography.experiments.snia.stretchLabel'), cls: 'rd-stretch' },
    { y: 80, label: t('pages.cosmography.experiments.snia.peakMagnitude'), cls: 'rd-peak' },
    { y: 125, label: t('pages.cosmography.experiments.snia.distanceMpc'), cls: 'rd-dist' },
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
  dataSvg.select('.rd-stretch').text(`s = ${stretchFactor.value.toFixed(2)}`)
  dataSvg.select('.rd-peak').text(`${peakMag.value.toFixed(2)} mag`)
  dataSvg.select('.rd-dist').text(`${distanceMpc.value.toFixed(0)} Mpc`)
}

// ── Lifecycle ──

function updatePanels() {
  updateInstrument()
  updateData()
}

onMounted(() => {
  initInstrument()
  initData()
  updatePanels()
})

watch([stretchRaw, apparentMag], updatePanels)
</script>

<style scoped>
.panel-svg {
  width: 100%;
  height: 100%;
  min-height: 180px;
}

.snia-space {
  width: 100%;
  height: 100%;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.3);
}

.snia-explosion-dimness {
  transition: filter 0.3s ease;
}

.snia-explosion {
  width: 100px;
  height: 100px;
  transform: scale(var(--explosion-scale, 1));
  transition: transform 0.3s ease;
}

.explosion-burst {
  animation: explosion-pulse 2.5s ease-in-out infinite;
}

.explosion-core {
  animation: explosion-core-pulse 2.5s ease-in-out infinite;
}

.explosion-ring {
  animation: explosion-ring-expand 2s ease-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes explosion-pulse {
  0%, 100% { opacity: 0.85; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes explosion-core-pulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}

@keyframes explosion-ring-expand {
  0% { opacity: 0.6; transform: scale(0.3); }
  70% { opacity: 0; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1.2); }
}

.explosion-label {
  font-size: 0.65rem;
  font-family: ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.5);
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

.im-slider-amber {
  accent-color: #f59e0b;
}
</style>
