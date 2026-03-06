<template>
  <div class="simulation-container">
    <div class="simulation-svg" ref="containerRef" />
    <p class="simulation-caption">{{ t('pages.about.measurements.sim.cmbCaption') }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * CMBSimulation
 * D3 visualization: Earth frame vs CMB rest frame.
 * Earth moves ~370 km/s toward the Great Attractor. CMB velocity corrects for that.
 */
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as d3 from 'd3'

const { t } = useI18n()

const containerRef = ref<HTMLElement | null>(null)

const WIDTH = 360
const HEIGHT = 160
const EARTH_SPEED = 370 // km/s

function init() {
  if (!containerRef.value) return
  const container = d3.select(containerRef.value)
  container.selectAll('*').remove()

  const svg = container
    .append('svg')
    .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('background', 'rgba(0,0,0,0.35)')
    .style('border-radius', '8px')

  const centerX = WIDTH / 2
  const centerY = HEIGHT / 2

  // CMB rest frame (static backdrop)
  svg
    .append('rect')
    .attr('x', 20)
    .attr('y', 20)
    .attr('width', WIDTH - 40)
    .attr('height', HEIGHT - 40)
    .attr('rx', 6)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.15)')
    .attr('stroke-dasharray', '4 4')
  svg
    .append('text')
    .attr('x', WIDTH - 30)
    .attr('y', 35)
    .attr('text-anchor', 'end')
    .attr('fill', 'rgba(255,255,255,0.4)')
    .attr('font-size', 9)
    .text('CMB rest frame')

  // Earth at center
  svg
    .append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', 18)
    .attr('fill', '#4a9eff')
    .attr('stroke', 'rgba(255,255,255,0.4)')
  svg
    .append('text')
    .attr('x', centerX)
    .attr('y', centerY + 38)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(255,255,255,0.9)')
    .attr('font-size', 11)
    .text('Earth')

  // Earth's velocity vector (toward Great Attractor, upward in diagram)
  const arrowLen = 45
  svg
    .append('line')
    .attr('x1', centerX)
    .attr('y1', centerY)
    .attr('x2', centerX)
    .attr('y2', centerY - arrowLen)
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 2)
  svg
    .append('polygon')
    .attr('points', `${centerX},${centerY - arrowLen - 8} ${centerX - 5},${centerY - arrowLen + 4} ${centerX + 5},${centerY - arrowLen + 4}`)
    .attr('fill', '#f59e0b')
  svg
    .append('text')
    .attr('x', centerX + 55)
    .attr('y', centerY - arrowLen / 2)
    .attr('fill', '#f59e0b')
    .attr('font-size', 10)
    .text(`${EARTH_SPEED} km/s`)

  // Three galaxies with raw vs CMB velocity
  const galaxies = [
    { x: 80, y: 90, rawVel: 500, cmbVel: 130 },
    { x: centerX, y: 140, rawVel: 2000, cmbVel: 1630 },
    { x: WIDTH - 80, y: 90, rawVel: 5000, cmbVel: 4630 },
  ]

  galaxies.forEach((g) => {
    const grp = svg.append('g').attr('transform', `translate(${g.x}, ${g.y})`)
    grp.append('circle').attr('r', 8).attr('fill', '#22d3ee').attr('stroke', 'rgba(255,255,255,0.3)')
    grp
      .append('text')
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.7)')
      .attr('font-size', 9)
      .attr('font-family', 'ui-monospace, monospace')
      .text(`raw: ${g.rawVel} → CMB: ${g.cmbVel} km/s`)
  })
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.simulation-container {
  width: 100%;
}

.simulation-svg {
  width: 100%;
  min-height: 160px;
}

.simulation-caption {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 0.5rem;
  font-style: italic;
}
</style>
