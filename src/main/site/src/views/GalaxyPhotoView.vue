<template>
  <div class="photo-scroll" ref="scrollContainer">
    <div class="photo-page">
      <!-- Hero Section -->
      <section class="photo-hero">
        <div class="hero-content">
          <button class="back-link" @click="goBack">
            <span>&larr;</span> {{ t('pages.galaxyPhoto.back') || 'Back to Galaxy' }}
          </button>
          <h1 class="photo-hero-title">
            <span class="title-accent">PGC</span> {{ galaxy?.pgc || pgc }}
          </h1>
          <p class="photo-hero-subtitle">{{ t('pages.galaxyPhoto.title') }}</p>
        </div>
      </section>

      <div v-if="loading" class="status-container">
        <div class="loading-spinner"></div>
        <p>{{ t('app.loading') }}</p>
      </div>

      <div v-else-if="!metadata" class="status-container error">
        <p>{{ t('pages.galaxyPhoto.notAvailable') }}</p>
        <button class="action-btn" @click="goBack">Return to Map</button>
      </div>

      <div v-else class="content-grid">
        <!-- Main Canvas Card -->
        <div class="glass-card canvas-card">
          <div class="card-header">
            <h2 class="card-title">Composite Imaging</h2>
            <div class="header-actions">
              <div class="live-indicator">
                <span class="dot"></span> Live Render
              </div>
              <button class="info-btn" @click="showInfo = !showInfo" aria-label="Info">
                i
              </button>
            </div>
          </div>
          <div class="canvas-wrapper">
            <canvas ref="canvasEl" class="composite-canvas"></canvas>
          </div>
        </div>

        <!-- Controls Sidebar -->
        <div class="sidebar-stack">
          <!-- Parameters Card -->
          <div class="glass-card controls-card">
            <h2 class="card-title">{{ t('pages.galaxyPhoto.params.title') || 'Rendering Parameters' }}</h2>
            
            <div class="control-group">
              <label>Spectral Theme</label>
              <div class="theme-toggle">
                <button 
                  v-for="t in ['infra', 'astral']" 
                  :key="t"
                  :class="['theme-btn', { active: theme === t }]"
                  @click="theme = t as any"
                >
                  {{ t === 'infra' ? 'Infrared' : 'Visible Light' }}
                </button>
              </div>
            </div>

            <div class="control-group">
              <div class="label-row">
                <label>{{ t('pages.galaxyPhoto.params.q') }} (Stretch)</label>
                <span class="param-value">{{ paramQ.toFixed(1) }}</span>
              </div>
              <input
                v-model.number="paramQ"
                type="range"
                min="1"
                max="20"
                step="0.5"
                class="custom-range"
                @input="onParamChange"
              />
            </div>

            <div class="control-group">
              <div class="label-row">
                <label>{{ t('pages.galaxyPhoto.params.alpha') }} (Softness)</label>
                <span class="param-value">{{ paramAlpha.toFixed(4) }}</span>
              </div>
              <input
                v-model.number="paramAlpha"
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                class="custom-range"
                @input="onParamChange"
              />
            </div>
          </div>

          <!-- Bands Card -->
          <div class="glass-card bands-card">
            <h2 class="card-title">{{ t('pages.galaxyPhoto.bands') }}</h2>
            <div class="bands-grid">
              <div
                v-for="band in allBands"
                :key="band"
                class="band-item"
                @click="openLightbox(band)"
              >
                <div class="band-img-wrap">
                  <img :src="`/galaxy-img/${pgc}/${band}.webp`" :alt="`${band}-band`" loading="lazy" />
                  <div class="band-overlay">
                    <span class="zoom-icon">⤢</span>
                  </div>
                </div>
                <span class="band-badge">{{ band }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox overlay -->
    <Transition name="fade">
      <div v-if="lightboxBand" class="lightbox" @click.self="closeLightbox">
        <div class="lightbox-content">
          <button class="lightbox-close" @click="closeLightbox">×</button>
          <div class="lightbox-header">
            <h2 class="lightbox-title">{{ lightboxBand }}-band Raw Data</h2>
            <span class="lightbox-subtitle">Sloan Digital Sky Survey</span>
          </div>
          <div class="lightbox-image-wrap">
            <img
              class="lightbox-image"
              :src="`/galaxy-img/${pgc}/${lightboxBand}.webp`"
              :alt="`${lightboxBand}-band`"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Info Sidebar -->
    <Transition name="sidebar">
      <div v-if="showInfo" class="info-sidebar">
        <div class="sidebar-content">
          <button class="sidebar-close" @click="showInfo = false">×</button>
          <h2 class="sidebar-title">{{ t('pages.galaxyPhoto.info.title') }}</h2>
          
          <div class="sidebar-section">
            <h3>Methodology</h3>
            <p>{{ t('pages.galaxyPhoto.info.methodology') }}</p>
          </div>

          <div class="sidebar-section">
            <h3>Data Source</h3>
            <p>{{ t('pages.galaxyPhoto.info.dataSource') }}</p>
          </div>

          <div class="sidebar-section">
            <h3>Shader</h3>
            <p>{{ t('pages.galaxyPhoto.info.shader') }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
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
const theme = ref<'infra' | 'astral'>('infra')
const showInfo = ref(false)

function goBack() {
  router.push(`/g/${pgc}`)
}

function onParamChange() {
  if (scene.value) {
    scene.value.setParams(paramQ.value, paramAlpha.value)
  }
}

watch(theme, (newTheme) => {
  if (scene.value) {
    scene.value.setTheme(newTheme)
  }
})

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

  // Unblock rendering so canvas appears
  loading.value = false

  // Wait for DOM to render canvas element
  await nextTick()

  if (metadata.value && canvasEl.value) {
    // Ensure canvas parent element has size before creating scene
    await new Promise(resolve => setTimeout(resolve, 0))

    try {
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
    } catch (error) {
      console.error('Failed to load NSA scene:', error)
    }
  }
})

onBeforeUnmount(() => {
  resizeObserver.value?.disconnect()
  if (scene.value) {
    scene.value.dispose()
  }
})
</script>

<style scoped>
.photo-scroll {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  background: #050505; /* Deep dark background */
  z-index: 1;
}

.photo-page {
  width: 100%;
  min-height: 100vh;
  max-width: 80rem; /* Wider than text pages for the dashboard feel */
  margin: 0 auto;
  padding: calc(var(--header-height, 60px) + 2rem) 1.5rem 4rem;
  position: relative;
  z-index: 10;
}

/* ── Hero ── */
.photo-hero {
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(34, 211, 238, 0.7);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.back-link:hover {
  color: #22d3ee;
}

.photo-hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #ffffff;
  margin: 0;
  line-height: 1;
}

.title-accent {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 300;
}

.photo-hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 300;
  margin-top: 0.5rem;
}

/* ── Layout Grid ── */
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr 320px;
  }
}

.sidebar-stack {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── Glass Cards ── */
.glass-card {
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  letter-spacing: 0.02em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-family: monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.info-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #fff;
}

/* ── Canvas Area ── */
.canvas-card {
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.canvas-wrapper {
  flex: 1;
  background: #000;
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
}

.composite-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: ui-monospace, monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #22d3ee;
  border-radius: 50%;
  box-shadow: 0 0 8px #22d3ee;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

/* ── Controls ── */
.control-group {
  margin-bottom: 1.5rem;
}

.control-group:last-child {
  margin-bottom: 0;
}

.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.control-group label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.param-value {
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
  color: #22d3ee;
}

/* Custom Range Input */
.custom-range {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.custom-range::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-btn {
  flex: 1;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  padding: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.theme-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 500;
}

/* ── Bands Grid ── */
.bands-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.band-item {
  position: relative;
  cursor: pointer;
  group: band;
}

.band-img-wrap {
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transition: border-color 0.2s;
}

.band-item:hover .band-img-wrap {
  border-color: rgba(255, 255, 255, 0.5);
}

.band-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.band-item:hover img {
  transform: scale(1.1);
}

.band-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.band-item:hover .band-overlay {
  opacity: 1;
}

.zoom-icon {
  color: #fff;
  font-size: 1.25rem;
}

.band-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: #22d3ee;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  text-transform: uppercase;
  pointer-events: none;
}

/* ── Lightbox ── */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.lightbox-content {
  position: relative;
  width: 90vw;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.lightbox-header {
  margin-bottom: 1rem;
  text-align: center;
}

.lightbox-title {
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
}

.lightbox-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

.lightbox-close {
  position: absolute;
  top: -2rem;
  right: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.lightbox-close:hover {
  color: #fff;
}

.lightbox-image-wrap {
  flex: 1;
  min-height: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.lightbox-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ── Status States ── */
.status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: rgba(255, 255, 255, 0.5);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.action-btn {
  margin-top: 1rem;
  background: rgba(34, 211, 238, 0.1);
  color: #22d3ee;
  border: 1px solid rgba(34, 211, 238, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(34, 211, 238, 0.2);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Sidebar ── */
.info-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background: rgba(10, 10, 10, 0.95);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  backdrop-filter: blur(12px);
  padding: 24px;
  overflow-y: auto;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.5);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-close {
  align-self: flex-end;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.sidebar-close:hover {
  color: #fff;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.sidebar-section h3 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #22d3ee;
  margin-bottom: 8px;
}

.sidebar-section p {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>