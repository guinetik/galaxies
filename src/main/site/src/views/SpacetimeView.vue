<template>
  <div class="spacetime-page">
    <router-link to="/" class="back-button">&larr; {{ t('pages.spacetime.backToSky') }}</router-link>

    <div v-if="loading" class="loading-overlay">
      <p>{{ t('pages.spacetime.loading') }}</p>
    </div>

    <canvas
      ref="canvasRef"
      class="spacetime-canvas"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @click="onClick"
    />

    <!-- Tooltip -->
    <div
      v-if="tooltip"
      class="tooltip"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <div class="tooltip-pgc">PGC {{ tooltip.pgc }}</div>
      <div class="tooltip-detail">{{ tooltip.velocity.toLocaleString() }} km/s</div>
      <div class="tooltip-detail">{{ tooltip.distance.toFixed(1) }} Mpc</div>
    </div>

    <!-- Velocity legend -->
    <div v-if="!loading" class="map-legend">
      <div class="map-legend-title">{{ t('pages.spacetime.velocityLabel') }}</div>
      <div class="map-legend-items">
        <div v-for="bin in velocityBins" :key="bin.label" class="map-legend-item">
          <span class="map-legend-swatch" :style="{ background: binToCSS(bin.color) }" />
          <span class="map-legend-label">{{ bin.label }}</span>
        </div>
      </div>
    </div>

    <!-- Info toggle -->
    <button v-if="!loading" class="info-toggle" @click="showInfo = !showInfo">
      {{ showInfo ? '×' : 'i' }}
    </button>

    <!-- Info panel -->
    <div v-if="showInfo" class="info-panel">
      <h3 class="info-title">{{ t('pages.spacetime.infoTitle') }}</h3>
      <p class="info-body">{{ t('pages.spacetime.infoBody') }}</p>
      <div class="info-stats">
        <div><span class="info-stat-value">{{ slabCount.toLocaleString() }}</span> {{ t('pages.spacetime.stats.groups') }}</div>
        <div><span class="info-stat-value">256 × 256</span> {{ t('pages.spacetime.stats.gridRes') }}</div>
        <div><span class="info-stat-value">±2,000 Mpc</span> {{ t('pages.spacetime.stats.slabThickness') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { SpacetimeScene } from '@/three/spacetime/SpacetimeScene'
import { VELOCITY_COLOR_BINS } from '@/three/constants'

const { t } = useI18n()
const { ready, getAllGroups } = useGalaxyData()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
const showInfo = ref(false)
const slabCount = ref(0)
const velocityBins = VELOCITY_COLOR_BINS

// Tooltip state
const tooltip = ref<{ pgc: number; velocity: number; distance: number } | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

// Pointer tracking for drag detection
let pointerDownX = 0
let pointerDownY = 0
let isDragging = false

let scene: SpacetimeScene | null = null

function binToCSS(c: [number, number, number]): string {
  return `rgb(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)})`
}

function onPointerDown(e: PointerEvent) {
  pointerDownX = e.clientX
  pointerDownY = e.clientY
  isDragging = false
}

let lastMoveTime = 0
function onPointerMove(e: PointerEvent) {
  const dx = e.clientX - pointerDownX
  const dy = e.clientY - pointerDownY
  if (dx * dx + dy * dy > 16) isDragging = true

  // Throttle pick to 60fps
  const now = performance.now()
  if (now - lastMoveTime < 16) return
  lastMoveTime = now

  if (!scene || !canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const hit = scene.pickAtScreen(
    e.clientX - rect.left,
    e.clientY - rect.top,
    rect.width,
    rect.height,
  )
  if (hit) {
    tooltip.value = hit
    tooltipX.value = e.clientX + 12
    tooltipY.value = e.clientY - 10
  } else {
    tooltip.value = null
  }
}

function onClick() {
  if (isDragging) return
  // Could navigate to galaxy detail in the future
}

onMounted(async () => {
  await ready
  if (!canvasRef.value) return

  scene = new SpacetimeScene(canvasRef.value)
  const groups = getAllGroups()
  scene.loadGroups(groups)
  slabCount.value = scene.slabCount
  scene.start()
  loading.value = false
})

onUnmounted(() => {
  scene?.dispose()
  scene = null
})
</script>

<style scoped>
.spacetime-page {
  position: fixed;
  inset: 0;
  background: #000;
}

.spacetime-canvas {
  width: 100%;
  height: 100%;
  display: block;
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

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  z-index: 15;
}

/* Tooltip */
.tooltip {
  position: fixed;
  z-index: 30;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 8px 12px;
  backdrop-filter: blur(8px);
}

.tooltip-pgc {
  font-size: 13px;
  font-weight: 600;
  color: #22d3ee;
  margin-bottom: 2px;
}

.tooltip-detail {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  font-family: ui-monospace, monospace;
}

/* Velocity legend */
.map-legend {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  backdrop-filter: blur(8px);
}

.map-legend-title {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.map-legend-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-family: ui-monospace, monospace;
}

/* Info toggle */
.info-toggle {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 20;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: color 0.2s, background 0.2s;
}

.info-toggle:hover {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
}

/* Info panel */
.info-panel {
  position: fixed;
  top: 68px;
  left: 24px;
  z-index: 20;
  max-width: 360px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 20px;
  backdrop-filter: blur(12px);
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.info-body {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
  margin-bottom: 16px;
}

.info-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

.info-stat-value {
  color: #22d3ee;
  font-family: ui-monospace, monospace;
  font-weight: 600;
}
</style>
