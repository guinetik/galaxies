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
      <button type="button" class="im-btn" :class="{ active: !cmbFrame }" @click="setCmbFrame(false)">
        {{ t('pages.about.measurements.sim.earthFrame') }}
      </button>
      <button type="button" class="im-btn" :class="{ active: cmbFrame }" @click="setCmbFrame(true)">
        {{ t('pages.about.measurements.sim.cmbFrameLabel') }}
      </button>
    </template>
  </IntuitionMachine>
</template>

<script setup lang="ts">
/**
 * CmbMachine — Intuition machine for "CMB Velocity".
 * Space: galaxies with velocity arrows, skewed (Earth frame) vs symmetric (CMB frame).
 * Instrument: Earth velocity vector + CMB dipole.
 * Data: grouped bar chart — raw vs CMB velocity for sample galaxies.
 */
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as d3 from 'd3'
import IntuitionMachine from './IntuitionMachine.vue'

const { t } = useI18n()

const spaceRef = ref<HTMLElement | null>(null)
const instrumentRef = ref<HTMLElement | null>(null)
const dataRef = ref<HTMLElement | null>(null)

const cmbFrame = ref(false)

const W = 300
const H = 180
const EARTH_V = 370 // km/s toward Great Attractor

interface SampleGalaxy {
  label: string
  angle: number // radians, position around Earth
  rawVel: number
  cmbVel: number
}

const GALAXIES: SampleGalaxy[] = [
  { label: 'A', angle: Math.PI * 0.15, rawVel: 800, cmbVel: 450 },
  { label: 'B', angle: Math.PI * 0.55, rawVel: 3200, cmbVel: 2830 },
  { label: 'C', angle: Math.PI * 1.0, rawVel: 5000, cmbVel: 5370 },
  { label: 'D', angle: Math.PI * 1.45, rawVel: 1500, cmbVel: 1870 },
]

let spaceSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let instrumentSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let dataSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>

function createGlowFilter(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, id: string, dev: number) {
  const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs')
  const f = defs.append('filter').attr('id', id)
  f.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', dev).attr('result', 'blur')
  const m = f.append('feMerge')
  m.append('feMergeNode').attr('in', 'blur')
  m.append('feMergeNode').attr('in', 'SourceGraphic')
}

function setCmbFrame(val: boolean) {
  cmbFrame.value = val
  updateAll()
}

function initSpace() {
  if (!spaceRef.value) return
  const c = d3.select(spaceRef.value)
  c.selectAll('*').remove()

  spaceSvg = c.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet')
  createGlowFilter(spaceSvg, 'glow-cmb', 2)

  const cx = W / 2
  const cy = H / 2

  // CMB rest frame boundary (dashed)
  spaceSvg
    .append('rect')
    .attr('class', 'cmb-boundary')
    .attr('x', 15)
    .attr('y', 10)
    .attr('width', W - 30)
    .attr('height', H - 20)
    .attr('rx', 8)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.1)')
    .attr('stroke-dasharray', '4 4')

  spaceSvg.append('text').attr('class', 'frame-label').attr('x', W - 25).attr('y', 24).attr('text-anchor', 'end').attr('fill', 'rgba(255,255,255,0.3)').attr('font-size', 8).attr('font-family', 'ui-monospace, monospace')

  // Earth
  spaceSvg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 12).attr('fill', '#4a9eff').attr('filter', 'url(#glow-cmb)')
  spaceSvg.append('text').attr('x', cx).attr('y', cy + 24).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.7)').attr('font-size', 8).text('Earth')

  // Earth velocity arrow (shown in Earth frame, hidden in CMB)
  spaceSvg
    .append('line')
    .attr('class', 'earth-arrow')
    .attr('x1', cx)
    .attr('y1', cy)
    .attr('x2', cx)
    .attr('y2', cy - 35)
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 2)
  spaceSvg
    .append('polygon')
    .attr('class', 'earth-arrowhead')
    .attr('fill', '#f59e0b')
  spaceSvg
    .append('text')
    .attr('class', 'earth-arrow-label')
    .attr('x', cx + 8)
    .attr('y', cy - 20)
    .attr('fill', '#f59e0b')
    .attr('font-size', 8)
    .attr('font-family', 'ui-monospace, monospace')
    .text(`${EARTH_V} km/s`)

  // Galaxy groups
  spaceSvg.append('g').attr('class', 'galaxy-group')
}

function initInstrument() {
  if (!instrumentRef.value) return
  const c = d3.select(instrumentRef.value)
  c.selectAll('*').remove()

  instrumentSvg = c.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet')

  // Title
  instrumentSvg.append('text').attr('x', W / 2).attr('y', 16).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text('CMB DIPOLE CORRECTION')

  // CMB dipole ellipse (hot/cold)
  const cx = W / 2
  const cy = 75
  const rx = 80
  const ry = 40

  const defs = instrumentSvg.append('defs')
  const dipoleGrad = defs.append('linearGradient').attr('id', 'dipole-grad').attr('x1', '0%').attr('x2', '100%')
  dipoleGrad.append('stop').attr('offset', '0%').attr('stop-color', '#dc2626').attr('stop-opacity', 0.4)
  dipoleGrad.append('stop').attr('offset', '50%').attr('stop-color', '#1a1a2e').attr('stop-opacity', 0.3)
  dipoleGrad.append('stop').attr('offset', '100%').attr('stop-color', '#4a9eff').attr('stop-opacity', 0.4)

  instrumentSvg.append('ellipse').attr('class', 'dipole').attr('cx', cx).attr('cy', cy).attr('rx', rx).attr('ry', ry).attr('fill', 'url(#dipole-grad)').attr('stroke', 'rgba(255,255,255,0.15)')

  instrumentSvg.append('text').attr('x', cx - rx + 10).attr('y', cy + 4).attr('fill', '#dc2626').attr('font-size', 8).text('HOT')
  instrumentSvg.append('text').attr('x', cx + rx - 10).attr('y', cy + 4).attr('text-anchor', 'end').attr('fill', '#4a9eff').attr('font-size', 8).text('COLD')

  // Earth dot in center
  instrumentSvg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 4).attr('fill', '#4a9eff')

  // Velocity arrow
  instrumentSvg
    .append('line')
    .attr('class', 'dipole-arrow')
    .attr('x1', cx)
    .attr('y1', cy)
    .attr('x2', cx - 40)
    .attr('y2', cy)
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 2)
  instrumentSvg
    .append('text')
    .attr('class', 'dipole-label')
    .attr('x', cx - 45)
    .attr('y', cy - 6)
    .attr('text-anchor', 'end')
    .attr('fill', '#f59e0b')
    .attr('font-size', 8)
    .attr('font-family', 'ui-monospace, monospace')
    .text(`${EARTH_V} km/s`)

  // Explanation text
  instrumentSvg
    .append('text')
    .attr('class', 'correction-text')
    .attr('x', W / 2)
    .attr('y', 135)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(255,255,255,0.5)')
    .attr('font-size', 8)

  instrumentSvg
    .append('text')
    .attr('class', 'correction-detail')
    .attr('x', W / 2)
    .attr('y', 150)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(34,211,238,0.6)')
    .attr('font-size', 9)
    .attr('font-family', 'ui-monospace, monospace')
}

function initData() {
  if (!dataRef.value) return
  const c = d3.select(dataRef.value)
  c.selectAll('*').remove()

  dataSvg = c.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('preserveAspectRatio', 'xMidYMid meet')

  // Title
  dataSvg.append('text').attr('x', W / 2).attr('y', 14).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text('RAW vs CMB VELOCITY')

  dataSvg.append('g').attr('class', 'bar-chart')
}

function updateAll() {
  const isCmb = cmbFrame.value
  const cx = W / 2
  const cy = H / 2

  // === Space panel ===
  if (spaceSvg) {
    spaceSvg.select('.frame-label').text(isCmb ? 'CMB FRAME' : 'EARTH FRAME')
    spaceSvg.select('.cmb-boundary').attr('stroke', isCmb ? 'rgba(34,211,238,0.25)' : 'rgba(255,255,255,0.1)')

    // Earth arrow visibility
    const arrowOpacity = isCmb ? 0 : 1
    spaceSvg.select('.earth-arrow').transition().duration(600).attr('opacity', arrowOpacity)
    spaceSvg.select('.earth-arrowhead').transition().duration(600).attr('opacity', arrowOpacity)
    spaceSvg.select('.earth-arrow-label').transition().duration(600).attr('opacity', arrowOpacity)

    // Update arrowhead position
    const ahY = cy - 35
    spaceSvg.select('.earth-arrowhead').attr('points', `${cx},${ahY - 6} ${cx - 4},${ahY + 2} ${cx + 4},${ahY + 2}`)

    // Galaxies
    const radius = 60
    const gSel = spaceSvg.select('.galaxy-group').selectAll<SVGGElement, SampleGalaxy>('g').data(GALAXIES, (d) => d.label)
    const gEnter = gSel.enter().append('g')
    gEnter.append('circle').attr('r', 7).attr('fill', '#22d3ee').attr('stroke', 'rgba(255,255,255,0.2)')
    gEnter.append('text').attr('class', 'g-label').attr('text-anchor', 'middle').attr('font-size', 7).attr('font-family', 'ui-monospace, monospace').attr('fill', 'rgba(255,255,255,0.6)')
    gEnter.append('text').attr('class', 'g-vel').attr('text-anchor', 'middle').attr('font-size', 8).attr('font-family', 'ui-monospace, monospace')

    const gMerge = gEnter.merge(gSel)
    gMerge.each(function (d) {
      const g = d3.select(this)
      const gx = cx + Math.cos(d.angle) * radius
      const gy = cy + Math.sin(d.angle) * (radius * 0.6)
      g.attr('transform', `translate(${gx}, ${gy})`)

      const vel = isCmb ? d.cmbVel : d.rawVel
      const color = vel < 1000 ? '#4a9eff' : vel < 3000 ? '#22d3ee' : vel < 5000 ? '#f59e0b' : '#dc2626'

      g.select('circle').transition().duration(600).attr('fill', color)
      g.select('.g-label').attr('y', -14).text(d.label)
      g.select('.g-vel')
        .attr('y', 20)
        .transition()
        .duration(600)
        .attr('fill', color)
        .tween('text', function () {
          const el = this as SVGTextElement
          const prev = parseInt(el.textContent || '0')
          const interp = d3.interpolateRound(prev, vel)
          return (tt: number) => {
            el.textContent = `${interp(tt)} km/s`
          }
        })
    })
    gSel.exit().remove()
  }

  // === Instrument panel ===
  if (instrumentSvg) {
    const dipoleOpacity = isCmb ? 0.15 : 1
    instrumentSvg.select('.dipole').transition().duration(600).attr('opacity', dipoleOpacity)
    instrumentSvg.select('.dipole-arrow').transition().duration(600).attr('opacity', isCmb ? 0.2 : 1)
    instrumentSvg.select('.dipole-label').transition().duration(600).attr('opacity', isCmb ? 0.2 : 1)

    instrumentSvg.select('.correction-text').text(isCmb ? 'Earth motion subtracted' : 'Earth moves toward Great Attractor')
    instrumentSvg.select('.correction-detail').text(isCmb ? 'V_cmb = V_raw − V_earth · cos(θ)' : `V_earth = ${EARTH_V} km/s`)
  }

  // === Data panel (bar chart) ===
  if (dataSvg) {
    const margin = { top: 24, right: 10, bottom: 20, left: 45 }
    const iw = W - margin.left - margin.right
    const ih = H - margin.top - margin.bottom

    const maxVel = 6000
    const scaleX = d3.scaleBand<string>().domain(GALAXIES.map((g) => g.label)).range([0, iw]).padding(0.3)
    const scaleY = d3.scaleLinear().domain([0, maxVel]).range([ih, 0])
    const barW = scaleX.bandwidth() / 2

    const chart = dataSvg.select('.bar-chart')
    chart.selectAll('*').remove()
    const g = chart.attr('transform', `translate(${margin.left},${margin.top})`)

    // Y axis
    g.append('g')
      .call(d3.axisLeft(scaleY).ticks(4, 's'))
      .attr('color', 'rgba(255,255,255,0.35)')
      .attr('font-size', 7)

    GALAXIES.forEach((gal) => {
      const x = scaleX(gal.label)!
      // Raw bar
      g.append('rect')
        .attr('x', x)
        .attr('y', scaleY(gal.rawVel))
        .attr('width', barW)
        .attr('height', ih - scaleY(gal.rawVel))
        .attr('fill', isCmb ? 'rgba(255,255,255,0.1)' : 'rgba(34,211,238,0.5)')
        .attr('rx', 2)
      // CMB bar
      g.append('rect')
        .attr('x', x + barW)
        .attr('y', scaleY(gal.cmbVel))
        .attr('width', barW)
        .attr('height', ih - scaleY(gal.cmbVel))
        .attr('fill', isCmb ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)')
        .attr('rx', 2)
      // Label
      g.append('text')
        .attr('x', x + barW)
        .attr('y', ih + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.5)')
        .attr('font-size', 8)
        .text(gal.label)
    })

    // Legend
    const legY = ih + 4
    g.append('rect').attr('x', iw - 80).attr('y', legY).attr('width', 8).attr('height', 8).attr('fill', isCmb ? 'rgba(255,255,255,0.15)' : 'rgba(34,211,238,0.5)')
    g.append('text').attr('x', iw - 68).attr('y', legY + 7).attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 7).text('Raw')
    g.append('rect').attr('x', iw - 40).attr('y', legY).attr('width', 8).attr('height', 8).attr('fill', isCmb ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.15)')
    g.append('text').attr('x', iw - 28).attr('y', legY + 7).attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 7).text('CMB')
  }
}

onMounted(() => {
  initSpace()
  initInstrument()
  initData()
  updateAll()
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
</style>
