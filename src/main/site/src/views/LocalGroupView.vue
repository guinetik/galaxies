<template>
  <div class="spacetime-page">
    <router-link to="/" class="back-button">&larr; {{ t('pages.localGroup.backToSky') }}</router-link>

    <!-- Title -->
    <div v-if="!loading" class="spacetime-title">
      <h1 class="spacetime-title-text">{{ t('pages.localGroup.title') }}</h1>
      <p class="spacetime-subtitle">{{ t('pages.localGroup.subtitle') }}</p>
    </div>

    <div v-if="loading" class="loading-overlay">
      <p>{{ t('pages.localGroup.loading') }}</p>
    </div>

    <canvas ref="canvasRef" class="spacetime-canvas" />

    <!-- Velocity legend -->
    <div v-if="!loading" class="map-legend">
      <div class="map-legend-title">{{ t('pages.localGroup.velocityLabel') }}</div>
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
      <h3 class="info-title">{{ t('pages.localGroup.infoTitle') }}</h3>
      <p class="info-body">{{ t('pages.localGroup.infoBody') }}</p>
      <div class="info-stats">
        <div><span class="info-stat-value">100 Mpc</span> {{ t('pages.localGroup.stats.radius') }}</div>
        <div><span class="info-stat-value">SGX / SGY / SGZ</span> {{ t('pages.localGroup.stats.coords') }}</div>
        <div><span class="info-stat-value">~4,000</span> {{ t('pages.localGroup.stats.groups') }}</div>
      </div>
    </div>

    <!-- Structures nav -->
    <div v-if="!loading" class="structures-nav" :style="{ top: showInfo ? '300px' : '68px' }">
      <div class="structures-nav-title">{{ t('pages.localGroup.structures') }}</div>
      <button
        v-for="name in structureNames"
        :key="name"
        class="structure-btn"
        :class="{ active: activeStructure === name }"
        @click="focusStructure(name)"
      >
        {{ name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { CylinderScene, STRUCTURES } from '@/three/cosmography/CylinderScene'
import { VELOCITY_COLOR_BINS } from '@/three/constants'

const { t } = useI18n()
const { ready, getAllGroups } = useGalaxyData()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
const showInfo = ref(false)
const activeStructure = ref<string | null>(null)
const velocityBins = VELOCITY_COLOR_BINS
const structureNames = STRUCTURES.map((s) => s.name)

let scene: CylinderScene | null = null

function binToCSS(c: [number, number, number]): string {
  return `rgb(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)})`
}

function focusStructure(name: string) {
  if (!scene) return
  if (activeStructure.value === name) {
    scene.resetView()
    activeStructure.value = null
  } else {
    scene.focusOn(name)
    activeStructure.value = name
  }
}

onMounted(async () => {
  await ready
  if (!canvasRef.value) return

  scene = new CylinderScene(canvasRef.value)
  scene.loadGroups(getAllGroups())
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

/* Title */
.spacetime-title {
  position: fixed;
  top: 24px;
  left: 0;
  right: 0;
  z-index: 20;
  text-align: center;
  pointer-events: none;
}

.spacetime-title-text {
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
  margin-bottom: 6px;
}

.spacetime-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 300;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
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

/* Structures nav */
.structures-nav {
  position: fixed;
  left: 24px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  backdrop-filter: blur(8px);
  transition: top 0.3s ease;
}

.structures-nav-title {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.structure-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  padding: 4px 8px;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.structure-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.structure-btn.active {
  color: #22d3ee;
  border-color: rgba(34, 211, 238, 0.4);
  background: rgba(34, 211, 238, 0.1);
}
</style>
