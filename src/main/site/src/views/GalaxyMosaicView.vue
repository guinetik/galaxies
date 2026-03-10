<template>
  <div class="mosaic-container">
    <!-- Header -->
    <div class="mosaic-header">
      <button class="back-link" @click="goBack">
        <span>&larr;</span> {{ t('pages.galaxyPhoto.back') || 'Back to Galaxy' }}
      </button>
      <h1 class="mosaic-title">
        <span class="title-accent">PGC</span> {{ galaxy?.pgc || pgc }}
        <span class="subtitle">SDSS Mosaic</span>
      </h1>
    </div>

    <!-- Content -->
    <div class="mosaic-content">
      <div v-if="!galaxy" class="status-container">
        <div v-if="isLoading" class="loading-spinner"></div>
        <p>{{ isLoading ? t('app.loading') : 'Galaxy not found' }}</p>
      </div>

      <div v-else class="aladin-wrapper">
        <!-- Aladin Lite container -->
        <div ref="aladinContainerEl" class="aladin-container"></div>

        <!-- Controls overlay -->
        <div class="controls-overlay">
          <div class="control-group">
            <button class="control-btn" @click="zoomIn" title="Zoom In">+</button>
            <button class="control-btn" @click="zoomOut" title="Zoom Out">−</button>
            <span class="zoom-label">Zoom</span>
          </div>
          <div class="status-text">
            RA: {{ currentRa.toFixed(4) }} Dec: {{ currentDec.toFixed(4) }}
          </div>
        </div>

        <!-- Coordinate display -->
        <div v-if="galaxy" class="coord-info">
          <div class="coord-line">RA: {{ formatRA(galaxy.ra) }}</div>
          <div class="coord-line">Dec: {{ formatDec(galaxy.dec) }}</div>
        </div>

        <!-- Layer indicator -->
        <div class="layer-info">
          <div class="layer-name">SDSS DR16</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { Galaxy } from '@/types/galaxy'
// @ts-ignore - aladin-lite doesn't have TypeScript definitions
import A from 'aladin-lite'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { ready, isLoading, getGalaxyByPgc } = useGalaxyData()

const pgc = Number(route.params.pgc)
const galaxy = ref<Galaxy | null>(null)
const aladinContainerEl = ref<HTMLDivElement | null>(null)
let aladin: any = null

const currentRa = ref(0)
const currentDec = ref(0)

function formatRA(ra: number): string {
  const hours = Math.floor(ra / 15)
  const minutes = Math.floor((ra / 15 - hours) * 60)
  const seconds = ((ra / 15 - hours) * 60 - minutes) * 60
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toFixed(1).padStart(4, '0')}s`
}

function formatDec(dec: number): string {
  const sign = dec >= 0 ? '+' : '−'
  const absDec = Math.abs(dec)
  const degrees = Math.floor(absDec)
  const minutes = Math.floor((absDec - degrees) * 60)
  const seconds = ((absDec - degrees) * 60 - minutes) * 60
  return `${sign}${degrees.toString().padStart(2, '0')}° ${minutes.toString().padStart(2, '0')}′ ${seconds.toFixed(1).padStart(4, '0')}″`
}

function goBack() {
  router.push(`/g/${pgc}`)
}

function zoomIn() {
  if (!aladin) return
  aladin.increaseZoom()
}

function zoomOut() {
  if (!aladin) return
  aladin.decreaseZoom()
}

function updateCoordinates() {
  if (!aladin) return
  const center = aladin.getRaDec()
  currentRa.value = center[0]
  currentDec.value = center[1]
}

onMounted(async () => {
  await ready

  galaxy.value = getGalaxyByPgc(pgc)
  if (!galaxy.value) return

  // Wait for container to render
  await nextTick()

  const container = aladinContainerEl.value
  if (!container) return

  // Set unique ID for the container FIRST
  const containerId = `aladin-${pgc}-${Date.now()}`
  container.id = containerId

  // Wait for DOM to be fully ready before initializing Aladin
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    // Initialize Aladin Lite with the container ID
    aladin = A.aladin('#' + containerId, {
      survey: 'P/SDSS9/color',
      fov: 0.2, // Field of view in degrees
      target: `${galaxy.value.ra} ${galaxy.value.dec}`,
      fullScreen: false,
      showFrame: false,           // Hide frame
      showLayersControl: false,   // Hide layers
      showGoToControl: false,     // Hide go-to
      showZoomControl: false,     // Hide zoom buttons (we have our own)
      showCrosshair: true,        // Show center crosshair
      showSimbadPointerTool: false, // Hide SIMBAD search
      showSearchBox: false,       // Hide search box
    })

    // Update coordinates on pan/zoom
    aladin.on('positionChanged', updateCoordinates)

    // Initial coordinate update
    updateCoordinates()
  } catch (error) {
    console.error('Failed to initialize Aladin Lite:', error)
  }
})

onUnmounted(() => {
  // Aladin Lite cleanup (if available)
  if (aladin && typeof aladin.destroy === 'function') {
    aladin.destroy()
  }
})
</script>

<style scoped>
.mosaic-container {
  width: 100%;
  height: 100%;
  background: #000;
  color: rgba(255, 255, 255, 0.85);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
}

.mosaic-header {
  position: absolute;
  top: var(--header-height);
  left: 0;
  right: 0;
  padding: 10px 24px;
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.back-link {
  position: absolute;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.back-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.mosaic-title {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 16px;
  justify-content: center;
  white-space: nowrap;
}

.title-accent {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
}

.subtitle {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
}

.mosaic-content {
  width: 100%;
  height: calc(100% - var(--header-height));
  display: flex;
  overflow: hidden;
  position: absolute;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: 0;
}

.aladin-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.aladin-container {
  width: 100%;
  height: 100%;
}

.status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100%;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.controls-overlay {
  display: none;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.zoom-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 4px;
}

.status-text {
  margin-left: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: 16px;
}

.coord-info {
  position: absolute;
  top: calc(var(--header-height) + 70px);
  right: 24px;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  backdrop-filter: blur(8px);
  font-size: 12px;
  font-family: 'Monaco', monospace;
  z-index: 5;
}

.coord-line {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.coord-line:first-child {
  color: rgba(255, 255, 255, 0.6);
}

.layer-info {
  position: absolute;
  top: calc(var(--header-height) + 70px);
  left: 24px;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  backdrop-filter: blur(8px);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  z-index: 5;
}

.layer-name {
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
