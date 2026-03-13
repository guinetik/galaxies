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
        <span class="im-ctrl-value">{{ distance }} Mly</span>
      </label>
      <input v-model.number="distance" type="range" min="1" max="500" step="1" class="im-slider" />
    </template>
  </IntuitionMachine>
</template>

<script setup lang="ts">
/**
 * MlyMachine — Intuition machine for "Million light-years".
 * Space: galaxy receding with animated photons.
 * Instrument: cosmic ruler / light-travel timeline.
 * Data: distance readouts and lookback fraction.
 */
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as d3 from 'd3'
import IntuitionMachine from './IntuitionMachine.vue'

const { t } = useI18n()

const spaceRef = ref<HTMLElement | null>(null)
const instrumentRef = ref<HTMLElement | null>(null)
const dataRef = ref<HTMLElement | null>(null)

const distance = ref(120)

const W = 300
const H = 180
const UNIVERSE_AGE = 13800 // Mly (≈13.8 billion years)

/**
 * Convert a wavelength in nm (380–780) to an RGB hex string.
 * Based on Dan Bruton's approximate visible-spectrum algorithm.
 */
function wavelengthToHex(nm: number): string {
  let r = 0, g = 0, b = 0
  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / (440 - 380)
    g = 0
    b = 1
  } else if (nm >= 440 && nm < 490) {
    r = 0
    g = (nm - 440) / (490 - 440)
    b = 1
  } else if (nm >= 490 && nm < 510) {
    r = 0
    g = 1
    b = -(nm - 510) / (510 - 490)
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / (580 - 510)
    g = 1
    b = 0
  } else if (nm >= 580 && nm < 645) {
    r = 1
    g = -(nm - 645) / (645 - 580)
    b = 0
  } else if (nm >= 645 && nm <= 780) {
    r = 1
    g = 0
    b = 0
  }

  // Intensity falloff at edges of visible spectrum
  let factor = 1.0
  if (nm >= 380 && nm < 420) factor = 0.3 + 0.7 * (nm - 380) / (420 - 380)
  else if (nm > 700 && nm <= 780) factor = 0.3 + 0.7 * (780 - nm) / (780 - 700)

  const gamma = 0.8
  const ri = Math.round(255 * Math.pow(r * factor, gamma))
  const gi = Math.round(255 * Math.pow(g * factor, gamma))
  const bi = Math.round(255 * Math.pow(b * factor, gamma))
  return `rgb(${ri},${gi},${bi})`
}

/** Rest wavelength of emitted light — blue-white starlight */
const REST_WAVELENGTH = 470 // nm (blue)

/**
 * Compute the observed wavelength for a photon at a given travel progress.
 * Uses exaggerated redshift so the effect is visible at 1–500 Mly scales.
 * Real cosmological z at 500 Mly ≈ 0.04 — far too small to see,
 * so we amplify it for educational intuition.
 */
function observedWavelength(distanceMly: number, progress: number): number {
  // Exaggerated redshift: map 0–500 Mly to z ≈ 0–0.6
  const zMax = (distanceMly / 500) * 0.6
  // Photon accumulates redshift as it travels (progress 0→1)
  const z = zMax * progress
  return REST_WAVELENGTH * (1 + z)
}

interface Photon {
  progress: number
  id: number
}

let photons: Photon[] = []
let nextPhotonId = 0
let spawnTimer = 0
let rafId = 0
let lastTime = 0

let spaceSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let instrumentSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let dataSvg: d3.Selection<SVGSVGElement, unknown, null, undefined>

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
  createGlowFilter(spaceSvg, 'photon-glow', 2)

  // Background stars
  const starG = spaceSvg.append('g').attr('class', 'bg-stars')
  for (let i = 0; i < 40; i++) {
    starG
      .append('circle')
      .attr('cx', Math.random() * W)
      .attr('cy', Math.random() * H)
      .attr('r', Math.random() * 0.8 + 0.2)
      .attr('fill', 'rgba(255,255,255,0.3)')
  }

  // Earth
  spaceSvg.append('circle').attr('class', 'earth').attr('cx', 35).attr('cy', H / 2).attr('r', 10).attr('fill', '#4a9eff').attr('filter', 'url(#star-glow)')
  spaceSvg.append('text').attr('x', 35).attr('y', H / 2 + 22).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.7)').attr('font-size', 9).text('Earth')

  // Galaxy (will be updated)
  spaceSvg.append('circle').attr('class', 'galaxy-dot').attr('fill', '#22d3ee').attr('filter', 'url(#star-glow)')
  spaceSvg.append('text').attr('class', 'galaxy-label').attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 8)

  // Distance line
  spaceSvg.append('line').attr('class', 'dist-line').attr('stroke', 'rgba(255,255,255,0.1)').attr('stroke-dasharray', '2 3')

  // Photon group
  spaceSvg.append('g').attr('class', 'photons')
}

function initInstrument() {
  if (!instrumentRef.value) return
  const container = d3.select(instrumentRef.value)
  container.selectAll('*').remove()

  instrumentSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  // Title
  instrumentSvg.append('text').attr('x', W / 2).attr('y', 22).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.5)').attr('font-size', 9).attr('font-family', 'ui-monospace, monospace').text('LIGHT TRAVEL TIME')

  // Timeline bar background
  const barY = 70
  const barX = 30
  const barW = W - 60
  instrumentSvg.append('rect').attr('x', barX).attr('y', barY).attr('width', barW).attr('height', 8).attr('rx', 4).attr('fill', 'rgba(255,255,255,0.08)')

  // Progress fill (will be updated)
  instrumentSvg.append('rect').attr('class', 'timeline-fill').attr('x', barX).attr('y', barY).attr('height', 8).attr('rx', 4).attr('fill', 'rgba(34,211,238,0.4)')

  // Marker (will be updated)
  instrumentSvg.append('circle').attr('class', 'timeline-marker').attr('cy', barY + 4).attr('r', 6).attr('fill', '#22d3ee').attr('stroke', 'rgba(255,255,255,0.4)').attr('stroke-width', 1)

  // Reference ticks
  const refs = [
    { mly: 1, label: '1 Mly' },
    { mly: 50, label: '50' },
    { mly: 100, label: '100' },
    { mly: 250, label: '250' },
    { mly: 500, label: '500' },
  ]
  const scale = d3.scaleLinear().domain([0, 500]).range([barX, barX + barW])
  refs.forEach((r) => {
    const x = scale(r.mly)
    instrumentSvg.append('line').attr('x1', x).attr('x2', x).attr('y1', barY + 10).attr('y2', barY + 16).attr('stroke', 'rgba(255,255,255,0.25)')
    instrumentSvg.append('text').attr('x', x).attr('y', barY + 26).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.35)').attr('font-size', 7.5).text(r.label)
  })

  // Lookback annotation (will be updated)
  instrumentSvg.append('text').attr('class', 'lookback-text').attr('x', W / 2).attr('y', 120).attr('text-anchor', 'middle').attr('fill', '#22d3ee').attr('font-size', 11).attr('font-family', 'ui-monospace, monospace')

  // Universe age context
  instrumentSvg.append('text').attr('class', 'age-text').attr('x', W / 2).attr('y', 145).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.35)').attr('font-size', 8)

  // Epoch markers along bottom
  const epochs = [
    { mly: 66, label: 'Dinosaurs' },
    { mly: 4600, label: 'Earth forms' },
    { mly: 13200, label: 'First stars' },
  ]
  epochs.forEach((e) => {
    const x = scale(Math.min(e.mly, 500))
    if (x <= barX + barW) {
      instrumentSvg.append('text').attr('x', x).attr('y', 165).attr('text-anchor', 'middle').attr('fill', 'rgba(255,255,255,0.2)').attr('font-size', 6.5).attr('font-style', 'italic').text(e.label)
    }
  })
}

function initData() {
  if (!dataRef.value) return
  const container = d3.select(dataRef.value)
  container.selectAll('*').remove()

  dataSvg = container
    .append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')

  // Readout labels (static)
  const readouts = [
    { y: 35, label: 'DISTANCE', cls: 'rd-dist' },
    { y: 75, label: 'LIGHT TRAVEL', cls: 'rd-travel' },
    { y: 115, label: 'LOOKBACK', cls: 'rd-lookback' },
  ]
  readouts.forEach((r) => {
    dataSvg.append('text').attr('x', 20).attr('y', r.y).attr('fill', 'rgba(255,255,255,0.4)').attr('font-size', 8).attr('font-family', 'ui-monospace, monospace').text(r.label)
    dataSvg.append('text').attr('class', r.cls).attr('x', 20).attr('y', r.y + 18).attr('fill', '#22d3ee').attr('font-size', 14).attr('font-family', 'ui-monospace, monospace')
  })

  // Scale bar at bottom
  dataSvg.append('rect').attr('class', 'scale-bar-bg').attr('x', 20).attr('y', 155).attr('width', W - 40).attr('height', 6).attr('rx', 3).attr('fill', 'rgba(255,255,255,0.06)')
  dataSvg.append('rect').attr('class', 'scale-bar-fill').attr('x', 20).attr('y', 155).attr('height', 6).attr('rx', 3).attr('fill', 'rgba(34,211,238,0.3)')
  dataSvg.append('text').attr('x', W - 20).attr('y', 170).attr('text-anchor', 'end').attr('fill', 'rgba(255,255,255,0.25)').attr('font-size', 6.5).text(`of observable universe (${(UNIVERSE_AGE / 1000).toFixed(1)} Bly)`)
}

function updatePanels() {
  const d = distance.value
  const galaxyScale = d3.scaleLinear().domain([1, 500]).range([80, W - 25])
  const gx = galaxyScale(d)
  const galaxySize = Math.max(3, 12 * (1 - d / 600))
  const galaxyOpacity = Math.max(0.3, 1 - d / 700)

  // Space panel
  if (spaceSvg) {
    spaceSvg.select('.galaxy-dot').attr('cx', gx).attr('cy', H / 2).attr('r', galaxySize).attr('opacity', galaxyOpacity)
    spaceSvg.select('.galaxy-label').attr('x', gx).attr('y', H / 2 + galaxySize + 14).text(`${d} Mly`)
    spaceSvg.select('.dist-line').attr('x1', 45).attr('y1', H / 2).attr('x2', gx - galaxySize - 4).attr('y2', H / 2)
  }

  // Instrument panel
  if (instrumentSvg) {
    const barX = 30
    const barW = W - 60
    const scale = d3.scaleLinear().domain([0, 500]).range([barX, barX + barW])
    const x = scale(d)
    instrumentSvg.select('.timeline-fill').attr('width', Math.max(0, x - barX))
    instrumentSvg.select('.timeline-marker').attr('cx', x)
    instrumentSvg.select('.lookback-text').text(`Looking ${d} million years into the past`)
    const pct = ((d / UNIVERSE_AGE) * 100).toFixed(2)
    instrumentSvg.select('.age-text').text(`${pct}% of the universe's age (13.8 billion years)`)
  }

  // Data panel
  if (dataSvg) {
    const travelYears = d
    const lookbackPct = ((d / UNIVERSE_AGE) * 100).toFixed(2)
    dataSvg.select('.rd-dist').text(`${d} Mly`)
    dataSvg.select('.rd-travel').text(`${travelYears.toLocaleString()} million years`)
    dataSvg.select('.rd-lookback').text(`${lookbackPct}%`)
    const barMax = W - 40
    const fillW = Math.max(2, (d / UNIVERSE_AGE) * barMax)
    dataSvg.select('.scale-bar-fill').attr('width', fillW)
  }
}

function animate(time: number) {
  const dt = lastTime ? (time - lastTime) / 1000 : 0.016
  lastTime = time

  // Spawn photons periodically
  spawnTimer += dt
  const spawnRate = 0.4
  if (spawnTimer > spawnRate) {
    spawnTimer = 0
    photons.push({ progress: 0, id: nextPhotonId++ })
  }

  // Update photons — speed is constant (light speed); higher distance = longer travel
  const speed = 0.5 // base traversal rate
  for (const p of photons) {
    p.progress += dt * speed
  }
  photons = photons.filter((p) => p.progress <= 1)

  // Render photons
  if (spaceSvg) {
    const galaxyScale = d3.scaleLinear().domain([1, 500]).range([80, W - 25])
    const gx = galaxyScale(distance.value)
    const earthX = 35

    const sel = spaceSvg.select('.photons').selectAll<SVGCircleElement, Photon>('circle').data(photons, (d) => d.id)
    sel.join(
      (enter) =>
        enter
          .append('circle')
          .attr('r', 1.5)
          .attr('filter', 'url(#photon-glow)')
          .attr('opacity', 0.9),
      (update) => update,
      (exit) => exit.remove(),
    )
      .attr('cx', (d) => gx + (earthX - gx) * d.progress)
      .attr('cy', H / 2)
      .attr('fill', (d) => wavelengthToHex(observedWavelength(distance.value, d.progress)))
      .attr('opacity', (d) => 0.9 - d.progress * 0.4)
  }

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  initSpace()
  initInstrument()
  initData()
  updatePanels()
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

watch(distance, updatePanels)
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
