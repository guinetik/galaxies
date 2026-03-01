<template>
  <div class="cosmic-map-container">
    <canvas ref="canvasRef" class="cosmic-map-canvas" />

    <!-- Loading overlay -->
    <div v-if="loading" class="map-loading">
      {{ t('pages.map.loading') }}
    </div>

    <!-- Back button -->
    <router-link to="/" class="back-button">&larr; {{ t('pages.map.backToSky') }}</router-link>

    <!-- Controls overlay -->
    <div v-if="!loading" class="map-controls">
      <!-- Data mode toggle -->
      <div class="map-toggle">
        <button
          :class="['map-toggle-btn', { active: dataMode === 'groups' }]"
          @click="switchMode('groups')"
        >{{ t('pages.map.groups') }}</button>
        <button
          :class="['map-toggle-btn', { active: dataMode === 'galaxies' }]"
          @click="switchMode('galaxies')"
        >{{ t('pages.map.galaxies') }}</button>
        <button
          :class="['map-toggle-btn', { active: showInfo }]"
          @click="showInfo = !showInfo"
        >{{ t('pages.map.info') }}</button>
      </div>

      <!-- Axes toggle -->
      <label class="map-checkbox">
        <input type="checkbox" v-model="showAxes" @change="onAxesToggle" />
        {{ t('pages.map.showAxes') }}
      </label>
    </div>

    <!-- Info sidebar -->
    <transition name="sidebar">
      <div v-if="showInfo && !loading" class="map-sidebar">
        <div class="sidebar-scroll">
          <button class="sidebar-close" @click="showInfo = false">&times;</button>
          <h2 class="sidebar-title">{{ t('pages.map.infoTitle') }}</h2>

          <p class="sidebar-text">{{ t('pages.map.infoIntro') }}</p>
          <p class="sidebar-text">{{ t('pages.map.infoStructure') }}</p>

          <h3 class="sidebar-subtitle">{{ t('pages.map.velocityLabel') }}</h3>
          <p class="sidebar-text">{{ t('pages.map.infoColors') }}</p>

          <!-- Velocity distribution histogram -->
          <h3 class="sidebar-subtitle">{{ t('pages.map.distributionTitle') }}</h3>
          <div class="histogram">
            <div v-for="bar in histogram" :key="bar.label" class="histogram-row">
              <span class="histogram-label">{{ bar.label }}</span>
              <div class="histogram-track">
                <div
                  class="histogram-bar"
                  :style="{ width: bar.pct + '%', background: binToCSS(bar.color) }"
                />
              </div>
              <span class="histogram-count">{{ bar.count.toLocaleString() }}</span>
            </div>
          </div>

          <h3 class="sidebar-subtitle">SGX / SGY / SGZ</h3>
          <p class="sidebar-text">{{ t('pages.map.infoCoords') }}</p>

          <p class="sidebar-text">{{ t('pages.map.infoGroups') }}</p>

          <!-- Stats -->
          <h3 class="sidebar-subtitle">{{ t('pages.map.statsTitle') }}</h3>
          <div class="sidebar-stats">
            <div class="stat-row">
              <span class="stat-label">{{ t('pages.map.statsPoints') }}</span>
              <span class="stat-value">{{ pointCount.toLocaleString() }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">{{ t('pages.map.statsGroups') }}</span>
              <span class="stat-value">{{ groupCount.toLocaleString() }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">{{ t('pages.map.statsGalaxies') }}</span>
              <span class="stat-value">{{ galaxyCountStat.toLocaleString() }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">{{ t('pages.map.statsMaxDist') }}</span>
              <span class="stat-value">{{ maxDist }} {{ t('pages.map.statsMpc') }}</span>
            </div>
          </div>

          <!-- Color legend (moved into sidebar) -->
          <h3 class="sidebar-subtitle">{{ t('pages.map.velocityLabel') }}</h3>
          <div class="sidebar-legend">
            <div v-for="bin in velocityBins" :key="bin.label" class="sidebar-legend-item">
              <span class="sidebar-legend-swatch" :style="{ background: binToCSS(bin.color) }" />
              <span class="sidebar-legend-label">{{ bin.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Velocity color legend (only when sidebar closed) -->
    <div v-if="!loading && !showInfo" class="map-legend">
      <div class="map-legend-title">{{ t('pages.map.velocityLabel') }}</div>
      <div class="map-legend-items">
        <div v-for="bin in velocityBins" :key="bin.label" class="map-legend-item">
          <span class="map-legend-swatch" :style="{ background: binToCSS(bin.color) }" />
          <span class="map-legend-label">{{ bin.label }}</span>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="tooltip"
      class="map-tooltip"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <div class="map-tooltip-name">PGC {{ tooltip.pgc }}</div>
      <div class="map-tooltip-row">
        <span class="map-tooltip-label">Distance</span>
        {{ Math.round(tooltip.distance * 3.26).toLocaleString() }} Mly
      </div>
      <div class="map-tooltip-row">
        <span class="map-tooltip-label">Velocity</span>
        {{ tooltip.velocity.toLocaleString() }} km/s
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { CosmicMapScene } from '@/three/cosmic-map/CosmicMapScene'
import { VELOCITY_COLOR_BINS } from '@/three/constants'
import type { MapDataMode } from '@/three/cosmic-map/CosmicMapField'
import type { GalaxyGroup } from '@/types/galaxy'

const { t } = useI18n()
const router = useRouter()
const { ready, getAllGalaxies, getAllGroups, galaxyCount } = useGalaxyData()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
const dataMode = ref<MapDataMode>('groups')
const showAxes = ref(true)
const showInfo = ref(false)
const velocityBins = VELOCITY_COLOR_BINS

// Tooltip state
const tooltip = ref<{ pgc: number; velocity: number; distance: number } | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

// Stats
const groupCount = ref(0)
const galaxyCountStat = ref(0)
const maxDist = ref('0')
const pointCount = computed(() =>
  dataMode.value === 'groups' ? groupCount.value : galaxyCountStat.value
)

// Histogram data
const histogram = ref<{ label: string; count: number; pct: number; color: [number, number, number] }[]>([])

function computeHistogram(groups: GalaxyGroup[]) {
  const counts = new Array(velocityBins.length).fill(0)
  for (const g of groups) {
    const v = g.vh ?? 0
    for (let i = 0; i < velocityBins.length; i++) {
      if (v < velocityBins[i].max || i === velocityBins.length - 1) {
        counts[i]++
        break
      }
    }
  }
  const max = Math.max(...counts, 1)
  histogram.value = velocityBins.map((bin, i) => ({
    label: bin.label,
    count: counts[i],
    pct: (counts[i] / max) * 100,
    color: bin.color,
  }))
}

let scene: CosmicMapScene | null = null
let allGroups: ReturnType<typeof getAllGroups> = []
let allGalaxies: ReturnType<typeof getAllGalaxies> = []

// Drag detection — suppress click after dragging (same pattern as home page)
let pointerDownX = 0
let pointerDownY = 0
let wasDragging = false
const DRAG_THRESHOLD = 5

function binToCSS(color: [number, number, number]): string {
  return `rgb(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)})`
}

function switchMode(mode: MapDataMode) {
  if (!scene || dataMode.value === mode) return
  dataMode.value = mode
  if (mode === 'groups') {
    scene.loadGroups(allGroups)
  } else {
    if (allGalaxies.length === 0) {
      allGalaxies = getAllGalaxies()
    }
    scene.loadGalaxies(allGalaxies)
  }
}

function onAxesToggle() {
  scene?.setAxesVisible(showAxes.value)
}

function onPointerDown(e: PointerEvent) {
  pointerDownX = e.clientX
  pointerDownY = e.clientY
  wasDragging = false
}

let hoverThrottleId = 0
function onPointerMove(e: PointerEvent) {
  tooltipX.value = e.clientX
  tooltipY.value = e.clientY

  const dx = e.clientX - pointerDownX
  const dy = e.clientY - pointerDownY
  if (e.buttons > 0 && (dx * dx + dy * dy) > DRAG_THRESHOLD * DRAG_THRESHOLD) {
    wasDragging = true
    tooltip.value = null
    return
  }

  if (e.buttons > 0) return

  if (hoverThrottleId) return
  hoverThrottleId = window.setTimeout(() => {
    hoverThrottleId = 0
    if (!scene || !canvasRef.value) return
    const hit = scene.field.pickAtScreen(
      e.clientX, e.clientY,
      scene.getCamera(),
      canvasRef.value.clientWidth,
      canvasRef.value.clientHeight,
    )
    tooltip.value = hit
    canvasRef.value.style.cursor = hit ? 'pointer' : 'grab'
  }, 50)
}

function onClick(e: MouseEvent) {
  if (wasDragging) {
    wasDragging = false
    return
  }
  if (!scene || !canvasRef.value) return
  const hit = scene.field.pickAtScreen(
    e.clientX, e.clientY,
    scene.getCamera(),
    canvasRef.value.clientWidth,
    canvasRef.value.clientHeight,
  )
  if (hit) {
    router.push(`/g/${hit.pgc}`)
  }
}

onMounted(async () => {
  await ready
  if (!canvasRef.value) return

  scene = new CosmicMapScene(canvasRef.value)

  allGroups = getAllGroups()
  scene.loadGroups(allGroups)

  // Compute stats
  groupCount.value = allGroups.length
  galaxyCountStat.value = galaxyCount.value
  const maxDistMpc = allGroups.reduce((m, g) => Math.max(m, g.dist_mpc), 0)
  maxDist.value = Math.round(maxDistMpc).toLocaleString()

  // Compute histogram from groups data
  computeHistogram(allGroups)

  scene.start()
  loading.value = false

  canvasRef.value.addEventListener('pointerdown', onPointerDown)
  canvasRef.value.addEventListener('pointermove', onPointerMove)
  canvasRef.value.addEventListener('click', onClick)
})

onUnmounted(() => {
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('pointerdown', onPointerDown)
    canvasRef.value.removeEventListener('pointermove', onPointerMove)
    canvasRef.value.removeEventListener('click', onClick)
  }
  if (hoverThrottleId) clearTimeout(hoverThrottleId)
  scene?.dispose()
  scene = null
})
</script>

<style scoped>
.cosmic-map-container {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 1;
}

.cosmic-map-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.map-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  background: #000;
  z-index: 10;
}

.back-button {
  position: fixed;
  top: 24px;
  right: 24px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  z-index: 20;
  backdrop-filter: blur(8px);
  transition: color 0.2s, background 0.2s;
}

.back-button:hover {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
}

/* ── Controls panel ── */
.map-controls {
  position: fixed;
  top: 24px;
  left: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 20;
}

.map-toggle {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.map-toggle-btn {
  padding: 6px 14px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: color 0.2s, background 0.2s;
}

.map-toggle-btn:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.15);
}

.map-toggle-btn.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.map-toggle-btn:hover {
  color: #ffffff;
}

.map-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.map-checkbox input {
  cursor: pointer;
}

/* ── Info sidebar ── */
.map-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 360px;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 25;
  backdrop-filter: blur(12px);
}

.sidebar-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 80px 24px 40px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

.sidebar-close {
  position: absolute;
  top: 20px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.4);
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.sidebar-close:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
}

.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.sidebar-subtitle {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 24px;
  margin-bottom: 10px;
}

.sidebar-text {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
}

/* ── Histogram ── */
.histogram {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0;
}

.histogram-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.histogram-label {
  width: 42px;
  font-size: 10px;
  font-family: ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.4);
  text-align: right;
  flex-shrink: 0;
}

.histogram-track {
  flex: 1;
  height: 14px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 2px;
  overflow: hidden;
}

.histogram-bar {
  height: 100%;
  border-radius: 2px;
  min-width: 2px;
  transition: width 0.4s ease;
}

.histogram-count {
  width: 48px;
  font-size: 10px;
  font-family: ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.35);
  text-align: right;
  flex-shrink: 0;
}

/* ── Stats ── */
.sidebar-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 8px 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.4);
}

.stat-value {
  color: rgba(255, 255, 255, 0.7);
  font-family: ui-monospace, monospace;
}

/* ── Sidebar legend ── */
.sidebar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin: 8px 0;
}

.sidebar-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sidebar-legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.sidebar-legend-label {
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.45);
}

/* ── Sidebar transition ── */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* ── Velocity legend (bottom-left, when sidebar closed) ── */
.map-legend {
  position: fixed;
  bottom: 24px;
  left: 24px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 10px 14px;
  z-index: 20;
  backdrop-filter: blur(8px);
}

.map-legend-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
}

.map-legend-items {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.map-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.map-legend-swatch {
  width: 12px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.map-legend-label {
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.5);
}

/* ── Tooltip ── */
.map-tooltip {
  position: fixed;
  pointer-events: none;
  transform: translate(12px, -50%);
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  color: #e0e0e0;
  white-space: nowrap;
  z-index: 100;
  backdrop-filter: blur(8px);
}

.map-tooltip-name {
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
  margin-bottom: 4px;
}

.map-tooltip-row {
  line-height: 1.5;
}

.map-tooltip-label {
  color: rgba(255, 255, 255, 0.5);
  margin-right: 6px;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .map-sidebar {
    width: 100%;
  }
}
</style>
