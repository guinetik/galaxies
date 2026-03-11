<template>
  <div class="photo-scroll" ref="scrollContainer">
    <div class="photo-page">
      <!-- Hero Section -->
      <section class="photo-hero">
        <div class="hero-content">
          <div class="hero-links">
            <button class="back-link" @click="goBack">
              <span>&larr;</span> {{ t('pages.galaxyPhoto.back') || 'Back to Galaxy' }}
            </button>
            <button
              class="shuffle-link"
              :disabled="shuffleLoading"
              @click="shuffleToAnotherGalaxy"
            >
              {{ shuffleLoading ? '…' : '↻' }} {{ t('pages.galaxyPhoto.shuffleAnother') }}
            </button>
          </div>
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
              <select v-model="shaderMode" class="shader-select">
                <option value="lupton">Lupton et al.</option>
                <option value="composite">Composite</option>
                <option value="custom">Custom</option>
                <option value="volumetric">Volumetric</option>
                <option value="nsa3d">NSA 3D</option>
                <option value="nsamorphology">Morphology 3D</option>
              </select>
              <button
                v-if="!isNsa3dMode"
                class="find-objects-btn"
                :class="{ active: findObjectsMode }"
                @click="toggleFindObjectsMode"
                aria-label="Find objects at location"
                title="Click to activate, then click canvas to query SIMBAD"
              >
                ✦
              </button>
              <button class="info-btn" @click="showInfo = !showInfo" aria-label="Info">
                i
              </button>
            </div>
          </div>
          <div class="canvas-wrapper">
            <div v-show="!canvasReady" class="canvas-loading-overlay">
              <div class="loading-spinner"></div>
              <p>{{ t('app.loading') || 'Loading...' }}</p>
            </div>
            <canvas
              ref="canvasEl"
              :class="['composite-canvas', { 'find-objects-mode': findObjectsMode }]"
              @wheel.prevent="onWheel"
              @click="onCanvasClick"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerUp"
              @pointerleave="onPointerUp"
              @mousemove="onCanvasMouseMove"
              @mouseleave="onCanvasMouseLeave"
            ></canvas>
            <!-- Crosshair overlay for SIMBAD query mode -->
            <svg
              v-if="findObjectsMode"
              class="crosshair-overlay"
              :style="{ cursor: 'crosshair' }"
            >
              <!-- Vertical line -->
              <line
                :x1="crosshairX"
                y1="0"
                :x2="crosshairX"
                :y2="canvasHeight"
                class="crosshair-line"
              />
              <!-- Horizontal line -->
              <line
                x1="0"
                :y1="crosshairY"
                :x2="canvasWidth"
                :y2="crosshairY"
                class="crosshair-line"
              />
              <!-- Center dot -->
              <circle :cx="crosshairX" :cy="crosshairY" r="4" class="crosshair-dot" />
            </svg>
            <div v-if="showCoordHud" class="coord-hud">
              <span class="coord-label">RA</span> {{ formatRA(cursorRa!) }}
              &nbsp;
              <span class="coord-label">Dec</span> {{ formatDec(cursorDec!) }}
            </div>

            <!-- Tune image toggle -->
            <div class="params-overlay">
              <button
                class="params-toggle"
                @click="paramsOverlayOpen = !paramsOverlayOpen"
                :aria-expanded="paramsOverlayOpen"
                :aria-label="t('pages.galaxyPhoto.tuneImage')"
              >
                {{ t('pages.galaxyPhoto.tuneImage') }}
              </button>
            </div>

            <!-- Tune Image Drawer (inside canvas) -->
            <Transition name="drawer">
              <div v-if="paramsOverlayOpen" class="tune-drawer">
                <div class="tune-drawer-content">
                  <div class="tune-drawer-header">
                    <h2 class="tune-drawer-title">{{ t('pages.galaxyPhoto.params.title') || 'Rendering Parameters' }}</h2>
                    <button class="tune-drawer-close" @click="paramsOverlayOpen = false" aria-label="Close">
                      ×
                    </button>
                  </div>
                  <div class="tune-drawer-body">
                    <button class="best-fit-btn tune-best-fit" @click="resetToAutoParams" title="Reset to auto-calibrated values">
                      Best Fit
                    </button>
                    <div class="control-group">
                      <label>Spectral Theme</label>
                      <div class="theme-toggle">
                        <button
                          v-for="th in [
                            { id: 'grayscale', label: 'Grayscale' },
                            { id: 'infra', label: 'Infrared' },
                            { id: 'astral', label: 'Astral' },
                          ]"
                          :key="th.id"
                          :class="['theme-btn', { active: theme === th.id }]"
                          @click="theme = th.id as any"
                        >
                          {{ th.label }}
                        </button>
                      </div>
                    </div>
                    <div v-if="shaderMode !== 'composite'" class="control-group">
                      <div class="label-row">
                        <label>{{ t('pages.galaxyPhoto.params.q') }} (Stretch)</label>
                        <span class="param-value">{{ paramQ.toFixed(1) }}</span>
                      </div>
                      <input
                        v-model.number="paramQ"
                        type="range"
                        min="1"
                        max="100"
                        step="0.5"
                        class="custom-range"
                        @input="onParamChange"
                      />
                    </div>
                    <div class="control-group">
                      <div class="label-row">
                        <label>{{ t('pages.galaxyPhoto.params.alpha') }} (Brightness)</label>
                        <span class="param-value">{{ paramAlpha.toFixed(4) }}</span>
                      </div>
                      <input
                        v-model.number="paramAlpha"
                        type="range"
                        min="0.001"
                        max="10.0"
                        step="0.001"
                        class="custom-range"
                        @input="onParamChange"
                      />
                    </div>
                    <div class="control-group">
                      <div class="label-row">
                        <label>Sensitivity</label>
                        <span class="param-value">{{ paramSensitivity.toFixed(2) }}</span>
                      </div>
                      <input
                        v-model.number="paramSensitivity"
                        type="range"
                        min="0.01"
                        max="1.0"
                        step="0.01"
                        class="custom-range"
                        @input="onParamChange"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Spectral Bands (6 columns below canvas) -->
        <section class="glass-card bands-card">
          <div class="card-header">
            <h2 class="card-title">{{ t('pages.galaxyPhoto.bands') }}</h2>
          </div>
          <div class="bands-grid">
            <div
              v-for="band in allBands"
              :key="band"
              class="band-item"
              @click="openLightbox(band)"
            >
              <div class="band-img-wrap">
                <img :src="`${GALAXY_IMG_BASE_URL}/${pgc}/${band}.png`" :alt="`${band}-band`" loading="lazy" crossorigin="anonymous" />
                <div class="band-overlay">
                  <span class="zoom-icon">⤢</span>
                </div>
              </div>
              <span class="band-badge">{{ band }}</span>
            </div>
          </div>
        </section>
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
          
          <div class="lightbox-body">
            <div class="lightbox-image-wrap">
              <!-- Stretched canvas (when Auto STF is on) -->
              <canvas
                v-if="stfEnabled"
                ref="stfCanvasEl"
                class="lightbox-image"
                :style="lightboxStyle"
              ></canvas>
              <!-- Raw image (when Auto STF is off) -->
              <img
                v-else
                class="lightbox-image"
                :src="`${GALAXY_IMG_BASE_URL}/${pgc}/${lightboxBand}.png`"
                :alt="`${lightboxBand}-band`"
                :style="lightboxStyle"
                crossorigin="anonymous"
              />

              <!-- Lightbox Controls -->
              <div class="lightbox-controls">
                <div class="lb-control-group">
                  <label>Auto STF</label>
                  <button
                    :class="['stf-toggle', { active: stfEnabled }]"
                    @click="toggleStf"
                  >
                    {{ stfEnabled ? 'ON' : 'OFF' }}
                  </button>
                </div>
                <div class="lb-control-group">
                  <label>Filter</label>
                  <select v-model="lbFilter" class="lb-select">
                    <option v-for="f in filterPresets" :key="f.label" :value="f.value">
                      {{ f.label }}
                    </option>
                  </select>
                </div>
                
                <div class="lb-control-group">
                  <label>Brightness</label>
                  <input 
                    type="range" 
                    v-model.number="lbBrightness" 
                    min="0" 
                    max="200" 
                    class="custom-range"
                  />
                </div>

                <div class="lb-control-group">
                  <label>Contrast</label>
                  <input 
                    type="range" 
                    v-model.number="lbContrast" 
                    min="0" 
                    max="200" 
                    class="custom-range"
                  />
                </div>
              </div>
            </div>
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
            <h3>Data Source</h3>
            <p>{{ t('pages.galaxyPhoto.info.dataSource') }}</p>
          </div>

          <div class="sidebar-section">
            <h3>{{ shaderMode === 'lupton' ? 'Lupton Composite' : shaderMode === 'composite' ? 'Raw Composite' : shaderMode === 'custom' ? 'Custom Composite' : shaderMode === 'volumetric' ? 'Volumetric Rendering' : shaderMode === 'nsa3d' ? 'NSA 3D Point Cloud' : 'Morphology 3D' }}</h3>
            <p>{{ t('pages.galaxyPhoto.info.' + shaderMode) }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- SIMBAD Results Tooltip -->
    <Transition name="fade">
      <div
        v-if="simbadTooltip.visible"
        class="simbad-tooltip"
        :style="simbadTooltipStyle"
      >
        <div class="tooltip-arrow"></div>
        <div class="tooltip-content">
          <div v-if="simbadLoading" class="loading-state">
            <div class="mini-spinner"></div>
            <span>Querying SIMBAD...</span>
          </div>
          <div v-else-if="simbadTooltip.error" class="error-state">
            <span class="error-icon">⚠</span>
            {{ simbadTooltip.error }}
          </div>
          <div v-else-if="simbadTooltip.objects.length === 0" class="empty-state">
            No objects found
          </div>
          <div v-else class="results-list">
            <a
              v-for="obj in simbadTooltip.objects"
              :key="obj.name"
              :href="obj.simbadUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="result-item result-link"
            >
              <span class="obj-name">{{ obj.name }}</span>
              <span class="obj-type">{{ obj.type }}</span>
              <span class="link-icon">↗</span>
            </a>
          </div>
          <button class="tooltip-close" @click="simbadTooltip.visible = false">×</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { useSimbadLookup } from '@/composables/useSimbadLookup'
import type { NSAMetadata } from '@/types/nsa'
import { NSACompositeScene, computeAutoParams, type ShaderMode } from '@/three/nsa/NSACompositeScene'
import type { Galaxy } from '@/types/galaxy'
import { GALAXY_IMG_BASE_URL } from '@/three/constants'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { ready, getGalaxyByPgc, getRandomGalaxies } = useGalaxyData()
const { loading: simbadLoading, results: simbadResults, query: simbadQuery, error: simbadError } = useSimbadLookup()

// Filter SIMBAD results: stars/galaxies if available, otherwise up to 5 other types
const filteredSimbadResults = computed(() => {
  const starsAndGalaxies = simbadResults.value.filter(obj => obj.type === 'Star' || obj.type === 'Galaxy')
  if (starsAndGalaxies.length > 0) {
    return starsAndGalaxies
  }
  return simbadResults.value.slice(0, 5)
})

const pgc = computed(() => Number(route.params.pgc))
const canvasEl = ref<HTMLCanvasElement | null>(null)
const galaxy = ref<Galaxy | null>(null)
const metadata = ref<NSAMetadata | null>(null)
const loading = ref(true)
const canvasReady = ref(false)
const scene = shallowRef<NSACompositeScene | null>(null)
const paramQ = ref(10.0)
const paramAlpha = ref(0.0515)
const paramSensitivity = ref(1.0)
const lightboxBand = ref<string | null>(null)
const resizeObserver = ref<ResizeObserver | null>(null)
const allBands = computed(() => metadata.value?.bands || ['u', 'g', 'r', 'i', 'z'])
const theme = ref<'grayscale' | 'infra' | 'astral'>('astral')
const shaderMode = ref<ShaderMode>('lupton')
const isNsa3dMode = computed(() => shaderMode.value === 'nsa3d' || shaderMode.value === 'nsamorphology')
const showInfo = ref(false)
const paramsOverlayOpen = ref(false)
const shuffleLoading = ref(false)
const findObjectsMode = ref(false)
const simbadTooltip = ref<{
  visible: boolean
  x: number
  y: number
  objects: Array<{ name: string; type: string; simbadUrl?: string }>
  error?: string
}>({
  visible: false,
  x: 0,
  y: 0,
  objects: [],
})
const isDragging = ref(false)
const lastX = ref(0)
const lastY = ref(0)
const pointers = new Map<number, PointerEvent>()
let prevPinchDist = -1

// Velocity tracking for momentum fling
let dragHistory: Array<{ x: number; y: number; t: number }> = []

// Coordinate HUD state — last canvas-local cursor position for recompute after zoom/pan
const cursorRa = ref<number | null>(null)
const cursorDec = ref<number | null>(null)
let lastCanvasX = -1
let lastCanvasY = -1

// Crosshair overlay state for SIMBAD query mode
const crosshairX = ref(0)
const crosshairY = ref(0)
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// Lightbox state
const lbBrightness = ref(100)
const lbContrast = ref(100)
const lbFilter = ref('none')
const stfEnabled = ref(false)
const stfCanvasEl = ref<HTMLCanvasElement | null>(null)
// Cache: band → stretched ImageData so we don't recompute on toggle
const stfCache = new Map<string, ImageData>()

const filterPresets = [
  { label: 'Normal', value: 'none' },
  { label: 'Negative', value: 'invert(1)' },
  { label: 'Cyanotype', value: 'sepia(1) hue-rotate(180deg) saturate(1.5)' },
  { label: 'Amber', value: 'sepia(1) saturate(1.5)' },
  { label: 'Hard', value: 'contrast(1.5) brightness(0.9)' },
]

const lightboxStyle = computed(() => {
  const base = `brightness(${lbBrightness.value}%) contrast(${lbContrast.value}%)`
  const effect = lbFilter.value !== 'none' ? lbFilter.value : ''
  return { filter: `${base} ${effect}` }
})

const simbadTooltipStyle = computed(() => {
  const tooltipHeight = 120 // Rough estimate, can be refined
  const margin = 16
  const x = simbadTooltip.value.x
  const y = simbadTooltip.value.y - tooltipHeight - margin

  return {
    left: x + 'px',
    top: Math.max(60, y) + 'px', // Don't go above header
  }
})

const showCoordHud = computed(() =>
  !isNsa3dMode.value && cursorRa.value !== null && cursorDec.value !== null,
)

function resetToAutoParams() {
  if (!scene.value || !metadata.value) return
  const { Q, alpha, sensitivity } = computeAutoParams(metadata.value, shaderMode.value)
  paramQ.value = Q
  paramAlpha.value = alpha
  paramSensitivity.value = sensitivity
  onParamChange()
  // Keep luptonDefaults in sync so mode-switch restore uses calibrated values
  if (shaderMode.value === 'lupton') {
    luptonDefaults.Q = Q
    luptonDefaults.alpha = alpha
    luptonDefaults.sensitivity = sensitivity
  }
}

function goBack() {
  router.push(`/g/${pgc.value}`)
}

/**
 * Checks if a galaxy has NSA photo data by fetching metadata.json.
 */
async function hasPhotoData(pgcNum: number): Promise<boolean> {
  try {
    const response = await fetch(`${GALAXY_IMG_BASE_URL}/${pgcNum}/metadata.json`)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Shuffles to a random galaxy that has photo data. Excludes current galaxy.
 * Keeps trying until one is found (up to 100 attempts).
 */
async function shuffleToAnotherGalaxy() {
  if (shuffleLoading.value) return
  shuffleLoading.value = true
  const maxAttempts = 100
  for (let i = 0; i < maxAttempts; i++) {
    const batch = getRandomGalaxies(20)
    const candidates = batch.filter((g) => g.pgc !== pgc.value)
    for (const g of candidates) {
      if (await hasPhotoData(g.pgc)) {
        router.push(`/g/${g.pgc}/photo`)
        shuffleLoading.value = false
        return
      }
    }
  }
  shuffleLoading.value = false
}

function onParamChange() {
  if (scene.value) {
    scene.value.setParams(paramQ.value, paramAlpha.value, paramSensitivity.value)
  }
}

watch(theme, (newTheme) => {
  if (scene.value) {
    scene.value.setTheme(newTheme)
  }
})

// Default Lupton params (saved when switching away)
const luptonDefaults = { Q: 10.0, alpha: 0.1555, sensitivity: 0.88 }

watch(shaderMode, (mode, oldMode) => {
  if (!scene.value) return

  // Save current params when leaving lupton
  if (oldMode === 'lupton') {
    luptonDefaults.Q = paramQ.value
    luptonDefaults.alpha = paramAlpha.value
    luptonDefaults.sensitivity = paramSensitivity.value
  }

  if (mode === 'lupton' && metadata.value) {
    // Restore saved Lupton params if user had tuned them, otherwise auto-calibrate
    const saved = luptonDefaults
    const auto = computeAutoParams(metadata.value, 'lupton')
    paramQ.value = saved.Q !== auto.Q ? saved.Q : auto.Q
    paramAlpha.value = saved.alpha !== auto.alpha ? saved.alpha : auto.alpha
    paramSensitivity.value = saved.sensitivity
  } else if (metadata.value) {
    const auto = computeAutoParams(metadata.value, mode)
    paramQ.value = auto.Q
    paramAlpha.value = auto.alpha
    paramSensitivity.value = auto.sensitivity
  }

  if (mode === 'nsa3d' || mode === 'nsamorphology') {
    findObjectsMode.value = false
    simbadTooltip.value.visible = false
    cursorRa.value = null
    cursorDec.value = null
  }

  scene.value.setShader(mode)
  onParamChange()
})

/**
 * Midtone Transfer Function (PixInsight).
 * Maps (0,0), (m,0.5), (1,1) via rational interpolation.
 */
function mtf(x: number, m: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  if (x === m) return 0.5
  return ((m - 1) * x) / ((2 * m - 1) * x - m)
}

/**
 * Find median from a 256-bin histogram. O(256) instead of O(n log n).
 */
function medianFromHistogram(hist: Uint32Array, total: number): number {
  const half = total >>> 1
  let cumulative = 0
  for (let i = 0; i < 256; i++) {
    cumulative += hist[i]
    if (cumulative > half) return i / 255
  }
  return 1
}

/**
 * Compute Auto STF parameters from a channel's 8-bit pixel data.
 * Uses histogram-based median/MAD (O(n) instead of sorting).
 * Algorithm: PixInsight AutoSTF (Juan Conejero).
 *   C = -2.8 (shadow clipping in sigma units)
 *   B = 0.10 (target background level — lower than PI default 0.25 because
 *             16-bit PNGs preserve more faint signal than 8-bit WebPs)
 *
 * TODO: Works well for i-band but blows out weaker bands (u, z, nuv) where
 * the signal is mostly noise. Consider an SNR gate (skip stretch if median/MAD
 * ratio is too low) or per-band B adjustment based on metadata data_ranges.
 */
function computeStfParams(hist: Uint32Array, total: number): { c0: number; m: number } {
  const C = -2.8
  const B = 0.10

  const median = medianFromHistogram(hist, total)

  // MAD via deviation histogram: for 8-bit data, deviations are also discrete
  // |val/255 - median| → bucket by rounding to nearest 1/255
  const devHist = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    if (hist[i] === 0) continue
    const dev = Math.round(Math.abs(i / 255 - median) * 255)
    devHist[Math.min(dev, 255)] += hist[i]
  }
  const mad = medianFromHistogram(devHist, total)

  // Shadow clip: median + C * 1.4826 * MAD (C is negative → clips below median)
  const c0 = Math.max(0, Math.min(1, median + C * 1.4826 * mad))

  // Midtones balance: PixInsight mtf(m=B, x=medianShifted)
  // Our mtf(x, m) → call as mtf(medianShifted, B)
  const medianShifted = median - c0
  const m = medianShifted > 0 ? mtf(medianShifted, B) : 0.5

  return { c0, m }
}

/**
 * Apply Auto STF stretch to an ImageData in-place.
 * Processes each RGB channel independently (per PixInsight convention).
 * Uses a 256-entry lookup table so the per-pixel work is a single array lookup.
 */
function applyAutoStf(imageData: ImageData): void {
  const { data, width, height } = imageData
  const pixelCount = width * height

  for (let ch = 0; ch < 3; ch++) {
    // Build histogram for this channel — O(n)
    const hist = new Uint32Array(256)
    for (let i = 0; i < pixelCount; i++) {
      hist[data[i * 4 + ch]]++
    }

    const { c0, m } = computeStfParams(hist, pixelCount)

    // Build 256-entry LUT — O(256)
    const lut = new Uint8Array(256)
    for (let i = 0; i < 256; i++) {
      let x = i / 255
      x = Math.max(0, (x - c0) / (1 - c0))
      x = mtf(x, m)
      lut[i] = Math.round(x * 255)
    }

    // Apply LUT to every pixel — O(n), single array lookup per pixel
    for (let i = 0; i < pixelCount; i++) {
      const idx = i * 4 + ch
      data[idx] = lut[data[idx]]
    }
  }
}

/**
 * Load an image URL into an offscreen canvas, apply Auto STF, and return the stretched ImageData.
 */
async function stretchImage(url: string): Promise<ImageData> {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = url
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Failed to load image'))
  })

  const offscreen = document.createElement('canvas')
  offscreen.width = img.naturalWidth
  offscreen.height = img.naturalHeight
  const ctx = offscreen.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height)
  applyAutoStf(imageData)
  return imageData
}

/**
 * Render the stretched ImageData onto the visible STF canvas.
 */
function renderStfCanvas(imageData: ImageData) {
  const canvas = stfCanvasEl.value
  if (!canvas) return
  canvas.width = imageData.width
  canvas.height = imageData.height
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(imageData, 0, 0)
}

async function toggleStf() {
  stfEnabled.value = !stfEnabled.value
  if (stfEnabled.value && lightboxBand.value) {
    await nextTick()
    const band = lightboxBand.value
    let imageData = stfCache.get(band)
    if (!imageData) {
      const url = `${GALAXY_IMG_BASE_URL}/${pgc.value}/${band}.png`
      imageData = await stretchImage(url)
      stfCache.set(band, imageData)
    }
    renderStfCanvas(imageData)
  }
}

function openLightbox(band: string) {
  lightboxBand.value = band
  // Reset filters
  lbBrightness.value = 100
  lbContrast.value = 100
  lbFilter.value = 'none'
  stfEnabled.value = false
}

function closeLightbox() {
  lightboxBand.value = null
}

function toggleFindObjectsMode() {
  if (isNsa3dMode.value) return
  findObjectsMode.value = !findObjectsMode.value
  simbadTooltip.value.visible = false
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  if (!scene.value || !canvasEl.value) return
  const factor = e.deltaY > 0 ? 0.9 : 1.1
  const rect = canvasEl.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  if (scene.value.is3DMode()) {
    scene.value.dolly(factor)
  } else {
    scene.value.zoomAt(factor, x, y)
    updateCoordHud()
  }
}

function getPinchDist(): number {
  const [p1, p2] = Array.from(pointers.values())
  const dx = p1.clientX - p2.clientX
  const dy = p1.clientY - p2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

function getPinchCenter(): { x: number; y: number } {
  const [p1, p2] = Array.from(pointers.values())
  return {
    x: (p1.clientX + p2.clientX) / 2,
    y: (p1.clientY + p2.clientY) / 2
  }
}

function onPointerDown(e: PointerEvent) {
  if (!scene.value || !canvasEl.value) return
  canvasEl.value.setPointerCapture(e.pointerId)
  pointers.set(e.pointerId, e)

  if (pointers.size === 1) {
    isDragging.value = true
    lastX.value = e.clientX
    lastY.value = e.clientY
    dragHistory = [{ x: e.clientX, y: e.clientY, t: performance.now() }]
  } else if (pointers.size === 2) {
    isDragging.value = false
    prevPinchDist = getPinchDist()
  }
}

function onPointerMove(e: PointerEvent) {
  if (!scene.value || !canvasEl.value) return
  if (!pointers.has(e.pointerId)) return
  pointers.set(e.pointerId, e)

  if (pointers.size === 1 && isDragging.value) {
    const dx = e.clientX - lastX.value
    const dy = e.clientY - lastY.value
    if (scene.value.is3DMode()) {
      scene.value.orbit(dx, dy)
    } else {
      scene.value.pan(dx, dy)
    }
    lastX.value = e.clientX
    lastY.value = e.clientY
    // Track last few positions for velocity calculation
    const now = performance.now()
    dragHistory.push({ x: e.clientX, y: e.clientY, t: now })
    // Keep only last 80ms of history
    while (dragHistory.length > 1 && now - dragHistory[0].t > 80) {
      dragHistory.shift()
    }
    if (!scene.value.is3DMode()) {
      updateCoordHud()
    }
  } else if (pointers.size === 2) {
    const dist = getPinchDist()
    if (prevPinchDist > 0) {
      const factor = dist / prevPinchDist
      const center = getPinchCenter()
      const rect = canvasEl.value.getBoundingClientRect()
      if (scene.value.is3DMode()) {
        scene.value.dolly(factor)
      } else {
        scene.value.zoomAt(factor, center.x - rect.left, center.y - rect.top)
      }
    }
    prevPinchDist = dist
    if (!scene.value.is3DMode()) {
      updateCoordHud()
    }
  }
}

function onPointerUp(e: PointerEvent) {
  if (!canvasEl.value) return

  // Compute fling velocity before clearing state
  const wasDragging = isDragging.value && pointers.size === 1
  canvasEl.value.releasePointerCapture(e.pointerId)
  pointers.delete(e.pointerId)

  if (pointers.size < 2) prevPinchDist = -1

  if (pointers.size === 1) {
    const p = pointers.values().next().value
    if (p) {
      lastX.value = p.clientX
      lastY.value = p.clientY
    }
    isDragging.value = true
  } else {
    isDragging.value = false

    // Fling momentum from drag velocity
    if (wasDragging && scene.value && !scene.value.is3DMode() && dragHistory.length >= 2) {
      const first = dragHistory[0]
      const last = dragHistory[dragHistory.length - 1]
      const dt = (last.t - first.t) / 1000 // seconds
      if (dt > 0.005) {
        const vx = (last.x - first.x) / dt * 0.016 // scale to per-frame
        const vy = (last.y - first.y) / dt * 0.016
        scene.value.fling(vx, vy)
      }
    }
    dragHistory = []
  }
}

/**
 * Converts decimal degrees to sexagesimal RA string (HHhMMmSS.Ss).
 */
function formatRA(deg: number): string {
  const h = deg / 15
  const hh = Math.floor(h)
  const mm = Math.floor((h - hh) * 60)
  const ss = ((h - hh) * 60 - mm) * 60
  return `${String(hh).padStart(2, '0')}h${String(mm).padStart(2, '0')}m${ss.toFixed(1).padStart(4, '0')}s`
}

/**
 * Converts decimal degrees to sexagesimal Dec string (+DD°MM'SS.S").
 */
function formatDec(deg: number): string {
  const sign = deg >= 0 ? '+' : '-'
  const abs = Math.abs(deg)
  const dd = Math.floor(abs)
  const mm = Math.floor((abs - dd) * 60)
  const ss = ((abs - dd) * 60 - mm) * 60
  return `${sign}${String(dd).padStart(2, '0')}°${String(mm).padStart(2, '0')}'${ss.toFixed(1).padStart(4, '0')}"`
}

/**
 * Recomputes HUD coordinates from the last known canvas-local cursor position.
 * Called after any camera change (zoom, pan) or mouse move.
 */
function updateCoordHud() {
  if (!scene.value || !metadata.value || lastCanvasX < 0 || !scene.value.supportsSkyPicking()) return
  const coords = scene.value.screenToRaDec(lastCanvasX, lastCanvasY, metadata.value)
  if (coords) {
    cursorRa.value = coords.ra
    cursorDec.value = coords.dec
  } else {
    cursorRa.value = null
    cursorDec.value = null
  }
}

function onCanvasMouseMove(e: MouseEvent) {
  if (isNsa3dMode.value) return
  if (!canvasEl.value) return
  const rect = canvasEl.value.getBoundingClientRect()
  lastCanvasX = e.clientX - rect.left
  lastCanvasY = e.clientY - rect.top

  // Update crosshair position if in find objects mode
  if (findObjectsMode.value) {
    crosshairX.value = lastCanvasX
    crosshairY.value = lastCanvasY
  }

  updateCoordHud()
}

async function onCanvasClick(e: MouseEvent) {
  if (!findObjectsMode.value || !canvasEl.value || !metadata.value || !scene.value || !scene.value.supportsSkyPicking()) return

  const rect = canvasEl.value.getBoundingClientRect()
  const canvasX = e.clientX - rect.left
  const canvasY = e.clientY - rect.top

  // Debug logging
  //console.log('Click coordinates:', { canvasX, canvasY })

  // Get RA/Dec from canvas coordinates
  const coords = scene.value.screenToRaDec(canvasX, canvasY, metadata.value)
  if (!coords) {
    //console.log('Failed to convert screen coordinates to RA/Dec')
    return
  }

  //console.log('RA/Dec from screenToRaDec:', coords)

  // Show loading tooltip
  simbadTooltip.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    objects: [],
    error: undefined,
  }

  // Query SIMBAD
  try {
    await simbadQuery(coords.ra, coords.dec, 30)
    if (simbadError.value) {
      simbadTooltip.value.error = simbadError.value
    } else {
      simbadTooltip.value.objects = filteredSimbadResults.value.map(obj => ({
        name: obj.name,
        type: obj.type,
        simbadUrl: obj.simbadUrl,
      }))
    }
  } catch (err) {
    simbadTooltip.value.error = 'Failed to query SIMBAD'
    console.error('SIMBAD query error:', err)
  }
}

function onCanvasMouseLeave() {
  lastCanvasX = -1
  lastCanvasY = -1
  cursorRa.value = null
  cursorDec.value = null
}

async function loadMetadata(pgcNum: number): Promise<void> {
  try {
    const response = await fetch(`${GALAXY_IMG_BASE_URL}/${pgcNum}/metadata.json`)
    if (response.ok) {
      metadata.value = await response.json()
    } else {
      metadata.value = null
    }
  } catch (error) {
    console.error('Failed to load NSA metadata:', error)
    metadata.value = null
  }
}

async function initGalaxy(pgcNum: number) {
  loading.value = true
  metadata.value = null
  canvasReady.value = false
  lightboxBand.value = null
  stfCache.clear()

  // Cleanup previous scene
  resizeObserver.value?.disconnect()
  resizeObserver.value = null
  if (scene.value) {
    scene.value.dispose()
    scene.value = null
  }

  await ready
  galaxy.value = getGalaxyByPgc(pgcNum)
  await loadMetadata(pgcNum)

  loading.value = false

  for (let i = 0; i < 3; i++) {
    await nextTick()
    if (canvasEl.value) break
  }

  if (metadata.value && canvasEl.value) {
    await new Promise(resolve => setTimeout(resolve, 0))

    try {
      scene.value = new NSACompositeScene(canvasEl.value)
      await scene.value.load(pgcNum, metadata.value)
      canvasReady.value = true

      scene.value.setParams(paramQ.value, paramAlpha.value, paramSensitivity.value)
      scene.value.setTheme(theme.value)
      resetToAutoParams()
      luptonDefaults.Q = paramQ.value
      luptonDefaults.alpha = paramAlpha.value
      luptonDefaults.sensitivity = paramSensitivity.value

      resizeObserver.value = new ResizeObserver(() => {
        if (scene.value && canvasEl.value) {
          const rect = canvasEl.value.parentElement!.getBoundingClientRect()
          scene.value.resize(rect.width, rect.height)
          canvasWidth.value = rect.width
          canvasHeight.value = rect.height
        }
      })
      resizeObserver.value.observe(canvasEl.value.parentElement!)

      if (canvasEl.value.parentElement) {
        const rect = canvasEl.value.parentElement.getBoundingClientRect()
        canvasWidth.value = rect.width
        canvasHeight.value = rect.height
      }
    } catch (error) {
      console.error('Failed to load NSA scene:', error)
      canvasReady.value = true
    }
  }
}

onMounted(() => {
  initGalaxy(pgc.value)
})

watch(
  () => route.params.pgc,
  (newPgc, oldPgc) => {
    if (!oldPgc) return // Skip on initial mount (handled by onMounted)
    const newNum = Number(newPgc)
    const oldNum = Number(oldPgc)
    if (newNum && newNum !== oldNum) {
      initGalaxy(newNum)
    }
  }
)

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
  overflow: hidden;
  background: #050505;
  z-index: 1;
}

.photo-page {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  margin: 0 auto;
  padding: calc(var(--header-height, 52px) + 0.5rem) 1.5rem 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

/* ── Hero ── */
.photo-hero {
  flex-shrink: 0;
  margin-bottom: 0.75rem;
  padding-top: 0;
}

.hero-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(34, 211, 238, 0.7);
  font-size: 0.875rem;
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.back-link:hover {
  color: #22d3ee;
}

.shuffle-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(34, 211, 238, 0.7);
  font-size: 0.875rem;
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.shuffle-link:hover:not(:disabled) {
  color: #22d3ee;
}

.shuffle-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Glass Cards ── */
.glass-card {
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.25rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.canvas-wrapper {
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  background: #000;
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
}

.canvas-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  color: rgba(255, 255, 255, 0.85);
  z-index: 5;
  pointer-events: auto;
}

.canvas-loading-overlay p {
  margin: 0;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.composite-canvas {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
  cursor: grab;
}

.composite-canvas.find-objects-mode {
  cursor: crosshair;
}

.composite-canvas:active {
  cursor: grabbing;
}

.coord-hud {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.85);
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.coord-label {
  color: #22d3ee;
  font-weight: 600;
  margin-right: 2px;
}

/* ── Params Overlay ── */
.params-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 15;
  pointer-events: none;
}

.params-overlay > * {
  pointer-events: auto;
}

.params-toggle {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.params-toggle:hover {
  background: rgba(0, 0, 0, 0.75);
  border-color: rgba(255, 255, 255, 0.35);
}

/* ── Tune Image Drawer (inside canvas, full-height) ── */
.tune-drawer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  max-width: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 20;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
}

.tune-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 1rem;
  overflow-y: auto;
}

.tune-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.tune-drawer-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  letter-spacing: 0.02em;
}

.tune-drawer-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.tune-drawer-close:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: #fff;
}

.tune-drawer-body {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tune-best-fit {
  margin-bottom: 1.5rem;
  align-self: flex-start;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.shader-select {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: ui-monospace, monospace;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.shader-select:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.shader-select option {
  background: #1a1a1a;
  color: #fff;
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

/* ── Bands Card (fixed height, images justify on width) ── */
.bands-card {
  flex-shrink: 0;
  width: 100%;
  height: 160px;
}

.bands-card .card-header {
  margin-bottom: 0.5rem;
}

.bands-grid {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
  height: 80px;
}

@media (max-width: 768px) {
  .bands-card {
    height: 240px;
  }

  .bands-grid {
    flex-wrap: wrap;
    height: 160px;
  }

  .band-item {
    flex: 0 0 calc(33.333% - 0.35rem);
  }
}

@media (max-width: 480px) {
  .bands-card {
    height: 320px;
  }

  .bands-grid {
    flex-wrap: wrap;
    height: 240px;
  }

  .band-item {
    flex: 0 0 calc(50% - 0.25rem);
  }
}

.band-item {
  flex: 1;
  position: relative;
  cursor: pointer;
  min-width: 0;
  min-height: 0;
}

.band-img-wrap {
  width: 100%;
  height: 100%;
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
  filter: brightness(4) contrast(1.3);
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
  width: auto;
  max-width: 95vw;
  height: auto;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
}

.lightbox-body {
  position: relative;
  display: flex;
  justify-content: center;
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
  position: relative;
  width: auto;
  min-width: 420px;
  height: auto;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 80vh;
  min-width: 420px;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: filter 0.2s ease;
  display: block;
}

/* Lightbox Controls */
.lightbox-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .lightbox-image-wrap,
  .lightbox-image {
    min-width: 280px;
  }

  .lightbox-controls {
    flex-direction: column;
    height: auto;
    gap: 1rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.6);
  }
}

.lb-control-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.lb-control-group label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.lb-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.lb-select option {
  background: #222;
  color: #fff;
}

/* STF Toggle */
.stf-toggle {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: ui-monospace, monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.05em;
}

.stf-toggle:hover {
  border-color: rgba(34, 211, 238, 0.5);
  color: rgba(255, 255, 255, 0.8);
}

.stf-toggle.active {
  background: rgba(34, 211, 238, 0.2);
  border-color: #22d3ee;
  color: #22d3ee;
}

/* ── Status States ── */
.status-container {
  flex: 1;
  min-height: 0;
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

/* ── Find Objects Button ── */
.find-objects-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.find-objects-btn:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.12);
}

.find-objects-btn.active {
  background: rgba(34, 211, 238, 0.2);
  border-color: #22d3ee;
  color: #22d3ee;
}

/* ── SIMBAD Tooltip ── */
.simbad-tooltip {
  position: fixed;
  transform: translateX(-50%);
  z-index: 50;
  pointer-events: auto;
}

.tooltip-content {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem;
  min-width: 200px;
  max-width: 300px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
}

.tooltip-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(34, 211, 238, 0.3);
}

.loading-state,
.empty-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  text-align: center;
}

.error-icon {
  color: #f87171;
}

.error-state {
  color: #f87171;
}

.mini-spinner {
  width: 12px;
  height: 12px;
  border: 1.5px solid rgba(34, 211, 238, 0.3);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  border-left: 2px solid #22d3ee;
}

.result-link {
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.result-link:hover {
  background: rgba(34, 211, 238, 0.15);
  border-left-color: #06b6d4;
}

.link-icon {
  color: #22d3ee;
  font-size: 0.7rem;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.result-link:hover .link-icon {
  opacity: 1;
}

.obj-name {
  color: #fff;
  font-weight: 500;
  font-family: ui-monospace, monospace;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.obj-type {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.tooltip-close {
  position: absolute;
  top: 2px;
  right: 4px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
  cursor: pointer;
  padding: 2px 4px;
  transition: color 0.2s;
}

.tooltip-close:hover {
  color: #fff;
}

/* ── Crosshair Overlay ── */
.crosshair-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.crosshair-line {
  stroke: rgba(34, 211, 238, 0.6);
  stroke-width: 1;
  stroke-dasharray: 4, 4;
}

.crosshair-dot {
  fill: rgba(34, 211, 238, 0.8);
  stroke: rgba(34, 211, 238, 0.5);
  stroke-width: 1;
}

/* ── Best Fit Button ── */
.best-fit-btn {
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.3);
  color: rgba(34, 211, 238, 0.8);
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: ui-monospace, monospace;
  transition: all 0.2s;
}

.best-fit-btn:hover {
  background: rgba(34, 211, 238, 0.18);
  border-color: #22d3ee;
  color: #22d3ee;
}
</style>