<template>
  <div class="star-page">
    <canvas ref="canvasRef" class="star-canvas" />
    <div v-if="star" class="star-info-card">
      <div class="card-header">
        <span class="star-name">{{ star.mainId }}</span>
        <span v-if="spClass" class="spectral-badge" :style="{ background: badgeColor }">
          {{ star.spectralType || spClass }}
        </span>
      </div>
      <div class="card-body">
        <div class="info-row">
          <span class="label">Type</span>
          <span class="value">{{ star.objectType }}</span>
        </div>
        <div class="info-row">
          <span class="label">Temperature</span>
          <span class="value">{{ star.teff != null ? `${star.teff} K` : '--' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Surface gravity</span>
          <span class="value">{{ star.logg != null ? `log g = ${star.logg.toFixed(2)}` : '--' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Metallicity</span>
          <span class="value">{{ star.feh != null ? `[Fe/H] = ${star.feh.toFixed(2)}` : '--' }}</span>
        </div>
        <div class="info-row">
          <span class="label">V magnitude</span>
          <span class="value">{{ star.vMag != null ? star.vMag.toFixed(2) : '--' }}</span>
        </div>
        <div class="info-row">
          <span class="label">B-V</span>
          <span class="value">{{ bvColor }}</span>
        </div>
        <div class="info-row">
          <span class="label">Distance</span>
          <span class="value">{{ distanceDisplay }}</span>
        </div>
      </div>
      <a :href="star.simbadUrl" target="_blank" rel="noopener noreferrer" class="simbad-link">
        SIMBAD <span class="link-icon">↗</span>
      </a>
    </div>
    <div v-if="loading" class="loading-overlay">
      <span class="loading-text">Loading star data...</span>
    </div>
    <div v-if="error" class="error-overlay">
      <span>{{ error }}</span>
      <router-link to="/" class="back-link">Back to home</router-link>
    </div>
    <button class="back-btn" @click="$router.back()">←</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSimbadStar } from '@/composables/useSimbadStar'
import { parseSpectralClass, getStarColor } from '@/three/star/StarUniforms'
import { StarScene } from '@/three/star/StarScene'

const route = useRoute()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { loading, star, error, query } = useSimbadStar()
let scene: StarScene | null = null

const spClass = computed(() => star.value ? parseSpectralClass(star.value.spectralType) : null)

const badgeColor = computed(() => {
  if (!spClass.value) return '#666'
  const hex = getStarColor(spClass.value)
  return `#${hex.toString(16).padStart(6, '0')}`
})

const bvColor = computed(() => {
  const s = star.value
  if (!s || s.bMag == null || s.vMag == null) return '--'
  return (s.bMag - s.vMag).toFixed(2)
})

const distanceDisplay = computed(() => {
  const s = star.value
  if (!s || s.parallax == null || s.parallax <= 0) return '--'
  const pc = 1000 / s.parallax
  const ly = pc * 3.2616
  if (ly < 100) return `${ly.toFixed(1)} ly`
  return `${Math.round(ly).toLocaleString()} ly`
})

function initScene(): void {
  if (!canvasRef.value || !star.value) return
  scene?.dispose()
  const sc = spClass.value || 'G'
  scene = new StarScene(canvasRef.value, sc, star.value.teff, star.value.mainId)
  scene.resize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  scene.start()
}

function onResize(): void {
  if (!canvasRef.value || !scene) return
  scene.resize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
}

watch(star, (s) => {
  if (s) initScene()
})

onMounted(() => {
  const id = decodeURIComponent(route.params.id as string)
  query(id)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  scene?.dispose()
  scene = null
})
</script>

<style scoped>
.star-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.star-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.star-info-card {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 240px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 16px;
  color: #e0e0e0;
  backdrop-filter: blur(12px);
  pointer-events: auto;
  z-index: 10;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.star-name {
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.spectral-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  color: #000;
  flex-shrink: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.label {
  color: rgba(255, 255, 255, 0.45);
}

.value {
  color: #e0e0e0;
  text-align: right;
}

.simbad-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 6px;
  color: #22d3ee;
  text-decoration: none;
  font-size: 12px;
  transition: background 0.2s;
}

.simbad-link:hover {
  background: rgba(34, 211, 238, 0.2);
}

.link-icon {
  font-size: 10px;
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #e0e0e0;
  font-size: 18px;
  padding: 4px 12px;
  cursor: pointer;
  z-index: 20;
  backdrop-filter: blur(8px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.loading-overlay,
.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  z-index: 30;
}

.back-link {
  color: #22d3ee;
  font-size: 12px;
}
</style>
