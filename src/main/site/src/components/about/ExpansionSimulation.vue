<template>
  <div class="simulation-container">
    <div class="simulation-svg" ref="containerRef" />
    <div class="simulation-controls">
      <button
        type="button"
        class="sim-btn"
        :class="{ active: !paused }"
        @click="paused = false"
      >
        {{ t('pages.about.measurements.sim.play') }}
      </button>
      <button
        type="button"
        class="sim-btn"
        :class="{ active: paused }"
        @click="paused = true"
      >
        {{ t('pages.about.measurements.sim.pause') }}
      </button>
    </div>
    <p class="simulation-caption">{{ t('pages.about.measurements.sim.expansionCaption') }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * ExpansionSimulation
 * D3 visualization: galaxies on a line receding as the universe expands.
 * Shows v = H0 × d (Hubble's law). Farther = faster recession (km/s).
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as d3 from 'd3'

const { t } = useI18n()

const containerRef = ref<HTMLElement | null>(null)
const paused = ref(false)

const WIDTH = 360
const HEIGHT = 140
const H0 = 70 // km/s/Mpc
/** Base distances in Mpc for 5 galaxies */
const DISTANCES = [10, 50, 100, 200, 350]

/** Color by recession velocity: blue (nearby, less redshift) → red (distant, more redshift) */
const velocityToColor = d3.scaleLinear<string>()
  .domain([0, 5000, 15000, 25000])
  .range(['#4a9eff', '#22d3ee', '#f59e0b', '#dc2626'])

let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let galaxyGroups: d3.Selection<d3.BaseType | SVGGElement, number, SVGGElement, unknown>
let scaleX: d3.ScaleLinear<number, number>
let animTime = 0
let rafId = 0

function init() {
  if (!containerRef.value) return
  const container = d3.select(containerRef.value)
  container.selectAll('*').remove()

  scaleX = d3.scaleLinear().domain([0, 400]).range([40, WIDTH - 40])

  svg = container
    .append('svg')
    .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('background', 'rgba(0,0,0,0.35)')
    .style('border-radius', '8px')

  // Earth at origin
  svg
    .append('g')
    .attr('transform', `translate(40, ${HEIGHT / 2})`)
    .append('circle')
    .attr('r', 10)
    .attr('fill', '#4a9eff')
    .attr('stroke', 'rgba(255,255,255,0.4)')
  svg
    .append('text')
    .attr('x', 40)
    .attr('y', HEIGHT / 2 + 28)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(255,255,255,0.8)')
    .attr('font-size', 11)
    .text('Earth')

  galaxyGroups = svg.append('g').selectAll('g').data(DISTANCES).join('g')

  galaxyGroups.each(function (this: d3.BaseType, d: number) {
    const g = d3.select(this as SVGGElement)
    const x = scaleX(d)
    const v = Math.round(H0 * d)
    const color = velocityToColor(v)
    g.attr('transform', `translate(${x}, ${HEIGHT / 2})`)
    g.append('circle')
      .attr('r', 6)
      .attr('fill', color)
      .attr('stroke', 'rgba(255,255,255,0.3)')
    g.append('text')
      .attr('class', 'vel-label')
      .attr('y', -14)
      .attr('text-anchor', 'middle')
      .attr('fill', color)
      .attr('font-size', 10)
      .attr('font-family', 'ui-monospace, monospace')
      .text(`${v} km/s`)
    g.append('text')
      .attr('y', 24)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('font-size', 9)
      .text(`${d} Mpc`)
  })
}

function animate() {
  if (!svg || !galaxyGroups) return
  animTime += paused.value ? 0 : 0.016

  // Expansion factor: space stretches over time (cyclic for demo)
  const a = 1 + 0.15 * Math.sin(animTime * 0.5)

  galaxyGroups.each(function (this: d3.BaseType, d: number) {
    const g = d3.select(this as SVGGElement)
    const baseX = scaleX(d)
    const expandedX = 40 + (baseX - 40) * a
    const v = Math.round(H0 * d)
    const color = velocityToColor(v)

    g.attr('transform', `translate(${expandedX}, ${HEIGHT / 2})`)
    g.select('circle').attr('fill', color)
    g.select('text.vel-label').text(`${v} km/s`).attr('fill', color)
  })

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  init()
  animate()
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

watch(paused, () => {
  // Animation loop handles paused
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
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  justify-content: center;
}

.sim-btn {
  padding: 4px 12px;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.sim-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.35);
}

.sim-btn.active {
  background: rgba(34, 211, 238, 0.2);
  border-color: #22d3ee;
  color: #22d3ee;
}

.simulation-caption {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 0.5rem;
  font-style: italic;
}
</style>
