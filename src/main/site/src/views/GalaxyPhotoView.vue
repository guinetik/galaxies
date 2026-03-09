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
              <select v-model="shaderMode" class="shader-select">
                <option value="lupton">Lupton et al.</option>
                <option value="custom">Custom</option>
              </select>
              <button
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
            <canvas
              ref="canvasEl"
              class="composite-canvas"
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
            <div v-if="cursorRa !== null && cursorDec !== null" class="coord-hud">
              <span class="coord-label">RA</span> {{ formatRA(cursorRa) }}
              &nbsp;
              <span class="coord-label">Dec</span> {{ formatDec(cursorDec!) }}
            </div>
          </div>
        </div>

        <!-- Controls Sidebar -->
        <div class="sidebar-stack">
          <!-- Parameters Card -->
          <div class="glass-card controls-card">
            <div class="card-header">
              <h2 class="card-title">{{ t('pages.galaxyPhoto.params.title') || 'Rendering Parameters' }}</h2>
            </div>
            
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
                <label>{{ t('pages.galaxyPhoto.params.alpha') }} (Brightness)</label>
                <span class="param-value">{{ paramAlpha.toFixed(4) }}</span>
              </div>
              <input
                v-model.number="paramAlpha"
                type="range"
                min="0.001"
                max="1.0"
                step="0.0005"
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

          <!-- Bands Card -->
          <div class="glass-card bands-card">
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
          
          <div class="lightbox-body">
            <div class="lightbox-image-wrap">
              <img
                class="lightbox-image"
                :src="`/galaxy-img/${pgc}/${lightboxBand}.webp`"
                :alt="`${lightboxBand}-band`"
                :style="lightboxStyle"
              />

              <!-- Lightbox Controls -->
              <div class="lightbox-controls">
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

    <!-- SIMBAD Results Tooltip -->
    <Transition name="fade">
      <div
        v-if="simbadTooltip.visible"
        class="simbad-tooltip"
        :style="{
          left: simbadTooltip.x + 'px',
          top: (simbadTooltip.y - 20) + 'px',
        }"
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
            <div v-for="obj in simbadTooltip.objects" :key="obj.name" class="result-item">
              <span class="obj-name">{{ obj.name }}</span>
              <span class="obj-type">{{ obj.type }}</span>
            </div>
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
import { NSACompositeScene, type ShaderMode } from '@/three/nsa/NSACompositeScene'
import type { Galaxy } from '@/types/galaxy'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { ready, getGalaxyByPgc } = useGalaxyData()
const { loading: simbadLoading, results: simbadResults, query: simbadQuery, error: simbadError } = useSimbadLookup()

const pgc = Number(route.params.pgc)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const galaxy = ref<Galaxy | null>(null)
const metadata = ref<NSAMetadata | null>(null)
const loading = ref(true)
const scene = shallowRef<NSACompositeScene | null>(null)
const paramQ = ref(20.0)
const paramAlpha = ref(0.014)
const paramSensitivity = ref(0.88)
const lightboxBand = ref<string | null>(null)
const resizeObserver = ref<ResizeObserver | null>(null)
const allBands = computed(() => metadata.value?.bands || ['u', 'g', 'r', 'i', 'z'])
const theme = ref<'grayscale' | 'infra' | 'astral'>('infra')
const shaderMode = ref<ShaderMode>('lupton')
const showInfo = ref(false)
const findObjectsMode = ref(false)
const simbadTooltip = ref<{
  visible: boolean
  x: number
  y: number
  objects: Array<{ name: string; type: string }>
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

// Coordinate HUD state — last canvas-local cursor position for recompute after zoom/pan
const cursorRa = ref<number | null>(null)
const cursorDec = ref<number | null>(null)
let lastCanvasX = -1
let lastCanvasY = -1

// Lightbox state
const lbBrightness = ref(100)
const lbContrast = ref(100)
const lbFilter = ref('none')

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

function goBack() {
  router.push(`/g/${pgc}`)
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

watch(shaderMode, (mode) => {
  if (scene.value) {
    scene.value.setShader(mode)
  }
})

function openLightbox(band: string) {
  lightboxBand.value = band
  // Reset filters
  lbBrightness.value = 100
  lbContrast.value = 100
  lbFilter.value = 'none'
}

function closeLightbox() {
  lightboxBand.value = null
}

function toggleFindObjectsMode() {
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
  scene.value.zoomAt(factor, x, y)
  updateCoordHud()
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
    scene.value.pan(dx, dy)
    lastX.value = e.clientX
    lastY.value = e.clientY
    updateCoordHud()
  } else if (pointers.size === 2) {
    const dist = getPinchDist()
    if (prevPinchDist > 0) {
      const factor = dist / prevPinchDist
      const center = getPinchCenter()
      const rect = canvasEl.value.getBoundingClientRect()
      scene.value.zoomAt(factor, center.x - rect.left, center.y - rect.top)
    }
    prevPinchDist = dist
    updateCoordHud()
  }
}

function onPointerUp(e: PointerEvent) {
  if (!canvasEl.value) return
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
  if (!scene.value || !metadata.value || lastCanvasX < 0) return
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
  if (!canvasEl.value) return
  const rect = canvasEl.value.getBoundingClientRect()
  lastCanvasX = e.clientX - rect.left
  lastCanvasY = e.clientY - rect.top
  updateCoordHud()
}

async function onCanvasClick(e: MouseEvent) {
  if (!findObjectsMode.value || !canvasEl.value || !metadata.value || !scene.value) return

  const rect = canvasEl.value.getBoundingClientRect()
  const canvasX = e.clientX - rect.left
  const canvasY = e.clientY - rect.top

  // Get RA/Dec from canvas coordinates
  const coords = scene.value.screenToRaDec(canvasX, canvasY, metadata.value)
  if (!coords) return

  // Show loading tooltip
  simbadTooltip.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    objects: [],
    error: undefined,
  }

  // Query SIMBAD
  await simbadQuery(coords.ra, coords.dec, 30) // 30 arcsec radius

  // Update tooltip with results
  if (simbadError.value) {
    simbadTooltip.value.error = simbadError.value
  } else {
    simbadTooltip.value.objects = simbadResults.value.map(obj => ({
      name: obj.name,
      type: obj.type,
    }))
  }
}

function onCanvasMouseLeave() {
  lastCanvasX = -1
  lastCanvasY = -1
  cursorRa.value = null
  cursorDec.value = null
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
  touch-action: none;
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
</style>