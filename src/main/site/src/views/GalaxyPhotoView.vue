<template>
  <div class="galaxy-photo-view">
    <div class="photo-header">
      <button class="back-button" @click="goBack">← Back</button>
      <h1 v-if="galaxy" class="photo-title">PGC {{ galaxy.pgc }} — {{ t('pages.galaxyPhoto.title') }}</h1>
      <div class="spacer"></div>
    </div>

    <div v-if="loading" class="loading-container">
      {{ t('app.loading') }}
    </div>

    <div v-else-if="!metadata" class="error-container">
      {{ t('pages.galaxyPhoto.notAvailable') }}
    </div>

    <div v-else class="photo-container">
      <!-- Composite canvas -->
      <div class="canvas-wrapper">
        <canvas ref="canvasEl" class="composite-canvas"></canvas>
      </div>

      <!-- Parameter sliders -->
      <div class="param-controls">
        <div class="param-group">
          <label>{{ t('pages.galaxyPhoto.params.q') }}</label>
          <input
            v-model.number="paramQ"
            type="range"
            min="1"
            max="20"
            step="0.5"
            @input="onParamChange"
          />
          <span class="param-value">{{ paramQ.toFixed(1) }}</span>
        </div>

        <div class="param-group">
          <label>{{ t('pages.galaxyPhoto.params.alpha') }}</label>
          <input
            v-model.number="paramAlpha"
            type="range"
            min="0.001"
            max="0.1"
            step="0.001"
            @input="onParamChange"
          />
          <span class="param-value">{{ paramAlpha.toFixed(4) }}</span>
        </div>
      </div>

      <!-- Band thumbnails -->
      <div class="bands-section">
        <h3>{{ t('pages.galaxyPhoto.bands') }}</h3>
        <div class="band-thumbnails">
          <div
            v-for="band in allBands"
            :key="band"
            class="band-thumbnail"
            @click="openLightbox(band)"
          >
            <img :src="`/galaxy-img/${pgc}/${band}.webp`" :alt="`${band}-band`" />
            <span class="band-label">{{ band }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox overlay -->
    <div v-if="lightboxBand" class="lightbox" @click.self="closeLightbox">
      <div class="lightbox-content">
        <button class="lightbox-close" @click="closeLightbox">×</button>
        <h2 class="lightbox-title">{{ lightboxBand }}-band</h2>
        <img
          class="lightbox-image"
          :src="`/galaxy-img/${pgc}/${lightboxBand}.webp`"
          :alt="`${lightboxBand}-band`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { NSAMetadata } from '@/types/nsa'
import { NSACompositeScene } from '@/three/nsa/NSACompositeScene'
import type { Galaxy } from '@/types/galaxy'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { ready, getGalaxyByPgc } = useGalaxyData()

const pgc = Number(route.params.pgc)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const galaxy = ref<Galaxy | null>(null)
const metadata = ref<NSAMetadata | null>(null)
const loading = ref(true)
const scene = ref<NSACompositeScene | null>(null)
const paramQ = ref(8.0)
const paramAlpha = ref(0.02)
const lightboxBand = ref<string | null>(null)
const resizeObserver = ref<ResizeObserver | null>(null)
const allBands = ['u', 'g', 'r', 'i', 'z']

function goBack() {
  router.push(`/g/${pgc}`)
}

function onParamChange() {
  if (scene.value) {
    scene.value.setParams(paramQ.value, paramAlpha.value)
  }
}

function openLightbox(band: string) {
  lightboxBand.value = band
}

function closeLightbox() {
  lightboxBand.value = null
}

async function loadMetadata(): Promise<void> {
  try {
    const response = await fetch(`/galaxy-img/${pgc}/metadata.json`)
    if (response.ok) {
      metadata.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load NSA metadata:', error)
  }
}

onMounted(async () => {
  await ready
  galaxy.value = getGalaxyByPgc(pgc)
  await loadMetadata()

  if (metadata.value && canvasEl.value) {
    scene.value = new NSACompositeScene(canvasEl.value)
    await scene.value.load(pgc, metadata.value)

    // Handle canvas resize
    resizeObserver.value = new ResizeObserver(() => {
      if (scene.value && canvasEl.value) {
        const rect = canvasEl.value.parentElement!.getBoundingClientRect()
        scene.value.resize(rect.width, rect.height)
      }
    })
    resizeObserver.value.observe(canvasEl.value.parentElement!)
  }

  loading.value = false
})

onBeforeUnmount(() => {
  resizeObserver.value?.disconnect()
  if (scene.value) {
    scene.value.dispose()
  }
})
</script>

<style scoped>
.galaxy-photo-view {
  width: 100%;
  min-height: 100vh;
  background: #000;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.photo-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.photo-title {
  margin: 0;
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 0.1em;
  flex: 1;
}

.spacer {
  width: 60px;
}

.loading-container,
.error-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
}

.photo-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  flex: 1;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  max-height: 65vh;
}

.composite-canvas {
  width: 100%;
  height: 100%;
}

.param-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 600px;
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.param-group label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.param-group input {
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
}

.param-group input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}

.param-group input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  border: none;
}

.param-value {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-family: monospace;
}

.bands-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bands-section h3 {
  margin: 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.7);
}

.band-thumbnails {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.band-thumbnail {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s;
}

.band-thumbnail:hover {
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.band-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.band-label {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 2px;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease-out;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lightbox-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  z-index: 101;
}

.lightbox-close:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.6);
}

.lightbox-title {
  margin: 0;
  font-size: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  padding-top: 12px;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .photo-header {
    padding: 12px 16px;
  }

  .photo-title {
    font-size: 16px;
  }

  .param-controls {
    grid-template-columns: 1fr;
  }

  .band-thumbnails {
    gap: 8px;
  }

  .band-thumbnail {
    width: 60px;
    height: 60px;
  }
}
</style>
