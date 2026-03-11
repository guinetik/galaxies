<template>
  <div class="simulation-container">
    <div class="simulation-svg" ref="containerRef" />
    <div class="simulation-controls">
      <label class="control-label">
        {{ t('pages.about.measurements.sim.distanceLabel') }}
        <span class="control-value">{{ distanceMpc.toFixed(1) }} Mpc</span>
      </label>
      <input
        v-model.number="distanceMpc"
        type="range"
        min="1"
        max="400"
        step="1"
        class="dm-slider"
      />
    </div>
    <div class="simulation-data">
      <span class="data-item">DM = {{ dm.toFixed(2) }}</span>
      <span class="data-item">{{ t('pages.about.measurements.sim.formula') }}</span>
    </div>
    <p class="simulation-caption">{{ t('pages.about.measurements.sim.dmCaption') }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * DMSimulation
 * D3 visualization: Distance Modulus. DM = m − M = 5 log₁₀(d/10 pc).
 * Slider controls distance; chart shows DM vs distance curve with current point.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { mpcToDistanceModulus } from '@/lib/astronomy'
import * as d3 from 'd3'

const { t } = useI18n()

const containerRef = ref<HTMLElement | null>(null)
const distanceMpc = ref(70)

/** DM = 5 * log10(d/10) where d is in parsecs. 1 Mpc = 1e6 pc */
const dm = computed(() => mpcToDistanceModulus(distanceMpc.value))

const WIDTH = 360
const HEIGHT = 140
const MARGIN = { top: 30, right: 20, bottom: 35, left: 45 }

function init() {
  if (!containerRef.value) return
  redraw()
}

function redraw() {
  if (!containerRef.value) return
  const container = d3.select(containerRef.value)
  container.selectAll('*').remove()

  const innerWidth = WIDTH - MARGIN.left - MARGIN.right
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom

  const scaleX = d3.scaleLog().domain([1, 500]).range([0, innerWidth])
  const scaleY = d3
    .scaleLinear()
    .domain([0, 45])
    .range([innerHeight, 0])

  const line = d3
    .line<number>()
    .x((d) => scaleX(d))
    .y((d) => scaleY(mpcToDistanceModulus(d)))
    .curve(d3.curveMonotoneX)

  const curveData = d3.range(1, 501, 2)

  const svg = container
    .append('svg')
    .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('background', 'rgba(0,0,0,0.35)')
    .style('border-radius', '8px')

  const g = svg.append('g').attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)

  // Grid
  g.selectAll('line.h')
    .data(scaleY.ticks(6))
    .join('line')
    .attr('class', 'h')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', (d: number) => scaleY(d))
    .attr('y2', (d: number) => scaleY(d))
    .attr('stroke', 'rgba(255,255,255,0.06)')
  g.selectAll('line.v')
    .data([10, 100])
    .join('line')
    .attr('class', 'v')
    .attr('x1', (d: number) => scaleX(d))
    .attr('x2', (d: number) => scaleX(d))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', 'rgba(255,255,255,0.06)')

  // DM curve
  g.append('path')
    .attr('d', line(curveData)!)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(34, 211, 238, 0.6)')
    .attr('stroke-width', 2)

  // Current point
  const x = scaleX(distanceMpc.value)
  const y = scaleY(dm.value)
  g.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', 6)
    .attr('fill', '#22d3ee')
    .attr('stroke', 'rgba(255,255,255,0.6)')

  // Axes
  g.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', innerHeight)
    .attr('stroke', 'rgba(255,255,255,0.5)')
  g.append('line')
    .attr('x1', 0)
    .attr('y1', innerHeight)
    .attr('x2', innerWidth)
    .attr('y2', innerHeight)
    .attr('stroke', 'rgba(255,255,255,0.5)')

  const xAxis = d3.axisBottom(scaleX).ticks(5, '.0f')
  const yAxis = d3.axisLeft(scaleY).ticks(6)

  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxis)
    .attr('color', 'rgba(255,255,255,0.5)')
    .attr('font-size', 9)
  g.append('g')
    .call(yAxis)
    .attr('color', 'rgba(255,255,255,0.5)')
    .attr('font-size', 9)

  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 28)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(255,255,255,0.6)')
    .attr('font-size', 10)
    .text('Distance (Mpc)')
  g.append('text')
    .attr('x', -innerHeight / 2)
    .attr('y', -32)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(255,255,255,0.6)')
    .attr('font-size', 10)
    .attr('transform', 'rotate(-90)')
    .text('DM')
}

onMounted(() => {
  init()
})

watch(distanceMpc, () => {
  redraw()
})
</script>

<style scoped>
.simulation-container {
  width: 100%;
}

.simulation-svg {
  width: 100%;
  min-height: 140px;
}

.simulation-controls {
  margin-top: 0.75rem;
  text-align: center;
}

.control-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

.control-value {
  font-family: ui-monospace, monospace;
  color: #22d3ee;
  margin-left: 0.5rem;
}

.dm-slider {
  width: 100%;
  max-width: 320px;
  margin-top: 0.5rem;
  accent-color: #22d3ee;
}

.simulation-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.data-item {
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
  color: #22d3ee;
}

.simulation-caption {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 0.5rem;
  font-style: italic;
}
</style>
