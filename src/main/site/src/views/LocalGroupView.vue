<template>
  <div class="local-group-page">
    <canvas ref="canvasRef" class="local-group-canvas" />

    <div v-if="loading" class="loading-overlay">
      <p>{{ t('pages.localGroup.loading') }}</p>
    </div>

    <div v-if="!loading" class="local-group-title">
      <h1 class="local-group-title-text">{{ t('pages.localGroup.title') }}</h1>
      <p class="local-group-subtitle">{{ t('pages.localGroup.subtitle') }}</p>
    </div>

    <div v-if="!loading" class="map-controls">
      <div class="map-toggle">
        <button
          :class="['map-toggle-btn', { active: layerVisibility.shells || layerVisibility.rings }]"
          @click="toggleProjectionFrame"
        >{{ t('pages.localGroup.controls.frame') }}</button>
        <button
          :class="['map-toggle-btn', { active: showInfo }]"
          @click="showInfo = !showInfo"
        >{{ t('pages.localGroup.controls.info') }}</button>
      </div>
    </div>

    <div v-if="showInfo && !loading" class="info-panel">
      <h3 class="info-title">{{ t('pages.localGroup.infoTitle') }}</h3>
      <p class="info-body">{{ t('pages.localGroup.infoBody') }}</p>
      <div class="info-stats">
        <div><span class="info-stat-value">100 Mpc</span> {{ t('pages.localGroup.stats.radius') }}</div>
        <div><span class="info-stat-value">SGX / SGY / SGZ</span> {{ t('pages.localGroup.stats.coords') }}</div>
        <div><span class="info-stat-value">{{ groupCount.toLocaleString() }}</span> {{ t('pages.localGroup.stats.groups') }}</div>
      </div>
    </div>

    <div
      v-if="!loading"
      class="structures-nav"
    >
      <div class="structures-nav-title">{{ t('pages.localGroup.waypointsTitle') }}</div>
      <button
        v-for="landmark in localizedLandmarks"
        :key="landmark.id"
        class="structure-btn"
        :class="{ active: activeLandmarkId === landmark.id }"
        @click="selectLandmark(landmark.id)"
      >
        {{ landmark.label }}
      </button>
    </div>

    <GalaxyTooltip
      :galaxy="selectedGalaxy"
      :x="tooltipX"
      :y="tooltipY"
      :show-cta="true"
      @navigate="onTooltipNavigate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import GalaxyTooltip from '@/components/GalaxyTooltip.vue'
import { LOCAL_GROUP_LANDMARKS } from '@/three/local-group/localGroupLandmarks'
import { LocalGroupScene } from '@/three/local-group/LocalGroupScene'
import type { Galaxy } from '@/types/galaxy'
import type {
  LocalGroupLandmark,
  LocalGroupLayerVisibility,
} from '@/three/local-group/localGroupTypes'

const router = useRouter()
const { t, te } = useI18n()
const { ready, getAllGroups, getAllGalaxies } = useGalaxyData()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
const showInfo = ref(false)
const groupCount = ref(0)
const activeLandmarkId = ref<string | null>(null)
const selectedGalaxy = ref<Galaxy | null>(null)
const selectedGalaxyIndex = ref(-1)
const tooltipX = ref(0)
const tooltipY = ref(0)
let tooltipRafId = 0
const layerVisibility = ref<LocalGroupLayerVisibility>({
  shells: true,
  rings: true,
  labels: true,
})

const localizedLandmarks = computed<LocalGroupLandmark[]>(() =>
  LOCAL_GROUP_LANDMARKS.map((landmark) => ({
    ...landmark,
    label: te(`pages.localGroup.landmarks.${landmark.id}.title`)
      ? t(`pages.localGroup.landmarks.${landmark.id}.title`)
      : landmark.label,
    description: te(`pages.localGroup.landmarks.${landmark.id}.body`)
      ? t(`pages.localGroup.landmarks.${landmark.id}.body`)
      : landmark.description,
  })),
)

let scene: LocalGroupScene | null = null
let pointerDownX = 0
let pointerDownY = 0
let wasDragging = false
let hoverThrottleId = 0
let allGroupsCache: ReturnType<typeof getAllGroups> = []

const DRAG_THRESHOLD = 5

/**
 * Focuses a landmark or resets the view when it is already active.
 */
function selectLandmark(id: string): void {
  if (!scene) return

  clearGalaxySelection()
  if (activeLandmarkId.value === id) {
    clearLandmarkSelection()
    return
  }

  const focusedLandmark = scene.focusOn(id)
  if (focusedLandmark) {
    activeLandmarkId.value = focusedLandmark.id
  }
}

/**
 * Clears the active landmark focus and restores the default orbit.
 */
function clearLandmarkSelection(): void {
  scene?.resetView()
  activeLandmarkId.value = null
}

function onTooltipNavigate(): void {
  if (selectedGalaxy.value) {
    router.push(`/g/${selectedGalaxy.value.pgc}`)
  }
}

function clearGalaxySelection(): void {
  selectedGalaxy.value = null
  selectedGalaxyIndex.value = -1
  cancelAnimationFrame(tooltipRafId)
}

function updateTooltipPosition(): void {
  if (!scene || !canvasRef.value || selectedGalaxyIndex.value < 0) return
  const pos = scene.projectGalaxyToScreen(
    selectedGalaxyIndex.value,
    canvasRef.value.clientWidth,
    canvasRef.value.clientHeight,
  )
  if (pos) {
    tooltipX.value = pos.x
    tooltipY.value = pos.y
  }
  tooltipRafId = requestAnimationFrame(updateTooltipPosition)
}

/**
 * Toggles the tilted range frame as a single visual layer.
 */
function toggleProjectionFrame(): void {
  const nextVisible = !(layerVisibility.value.shells || layerVisibility.value.rings)
  layerVisibility.value = {
    ...layerVisibility.value,
    shells: nextVisible,
    rings: nextVisible,
  }
  scene?.setLayerVisibility(layerVisibility.value)
}

/**
 * Tracks drag state so click navigation does not fire after orbiting.
 */
function onPointerDown(event: PointerEvent): void {
  pointerDownX = event.clientX
  pointerDownY = event.clientY
  wasDragging = false
}

/**
 * Tracks drag and updates hover cursor.
 */
function onPointerMove(event: PointerEvent): void {
  const canvas = canvasRef.value
  if (!scene || !canvas) return

  const dx = event.clientX - pointerDownX
  const dy = event.clientY - pointerDownY
  if (event.buttons > 0 && (dx * dx + dy * dy) > DRAG_THRESHOLD * DRAG_THRESHOLD) {
    wasDragging = true
    canvas.style.cursor = 'grabbing'
    return
  }

  if (event.buttons > 0 || activeLandmarkId.value) return
  if (hoverThrottleId) return

  hoverThrottleId = window.setTimeout(() => {
    hoverThrottleId = 0
    const hit = scene?.pickAtScreen(
      event.clientX,
      event.clientY,
      canvas.clientWidth,
      canvas.clientHeight,
    ) ?? null
    canvas.style.cursor = hit ? 'pointer' : 'grab'
  }, 40)
}

/**
 * Clicks a galaxy to zoom in and show tooltip, or clears selection.
 */
function onClick(event: MouseEvent): void {
  if (wasDragging || !scene || !canvasRef.value) {
    wasDragging = false
    return
  }

  const hit = scene.pickAtScreen(
    event.clientX,
    event.clientY,
    canvasRef.value.clientWidth,
    canvasRef.value.clientHeight,
  )

  if (hit) {
    const galaxy = scene.getGalaxyByIndex(hit.index)
    if (!galaxy) return

    clearLandmarkSelection()
    selectedGalaxy.value = galaxy
    selectedGalaxyIndex.value = hit.index
    tooltipX.value = event.clientX
    tooltipY.value = event.clientY

    scene.focusOnGalaxy(hit.index)
    tooltipRafId = requestAnimationFrame(updateTooltipPosition)
  } else {
    clearGalaxySelection()
  }
}

/**
 * Restores the resting cursor after pointer release.
 */
function onPointerUp(): void {
  if (canvasRef.value) {
    canvasRef.value.style.cursor = 'grab'
  }
}

onMounted(async () => {
  await ready
  if (!canvasRef.value) return

  allGroupsCache = getAllGroups()
  groupCount.value = allGroupsCache.filter((group) => group.dist_mpc <= 100).length

  scene = new LocalGroupScene(canvasRef.value)
  scene.loadGroups(allGroupsCache, localizedLandmarks.value)
  scene.loadGalaxies(getAllGalaxies())
  scene.setLayerVisibility(layerVisibility.value)
  scene.start()

  canvasRef.value.style.cursor = 'grab'
  canvasRef.value.addEventListener('pointerdown', onPointerDown)
  canvasRef.value.addEventListener('pointermove', onPointerMove)
  canvasRef.value.addEventListener('pointerup', onPointerUp)
  canvasRef.value.addEventListener('click', onClick)
  loading.value = false
})

onUnmounted(() => {
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('pointerdown', onPointerDown)
    canvasRef.value.removeEventListener('pointermove', onPointerMove)
    canvasRef.value.removeEventListener('pointerup', onPointerUp)
    canvasRef.value.removeEventListener('click', onClick)
  }

  if (hoverThrottleId) {
    clearTimeout(hoverThrottleId)
  }
  cancelAnimationFrame(tooltipRafId)

  scene?.dispose()
  scene = null
})
</script>

<style scoped>
.local-group-page {
  position: fixed;
  inset: 0;
  background: #000;
}

.local-group-canvas {
  width: 100%;
  height: 100%;
  display: block;
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

.local-group-title {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  text-align: center;
  pointer-events: none;
  padding: calc(var(--header-height) + 12px) 16px 56px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.3) 75%, transparent 100%);
}

.local-group-title-text {
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
  margin-bottom: 6px;
}

.local-group-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 1), 0 2px 10px rgba(0, 0, 0, 0.9);
}

.map-controls {
  position: fixed;
  top: var(--header-height);
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

.info-panel {
  position: fixed;
  top: 68px;
  right: 24px;
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

.structures-nav {
  position: fixed;
  bottom: 24px;
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

@media (max-width: 900px) {
  .map-controls {
    top: calc(var(--header-height) + 12px);
    left: 12px;
  }

  .info-panel {
    left: 12px;
    right: 12px;
    max-width: none;
  }

  .structures-nav {
    left: 12px;
    bottom: 12px;
  }

  .local-group-title {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
