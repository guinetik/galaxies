<template>
  <div class="local-group-page">
    <canvas ref="canvasRef" class="local-group-canvas" />

    <div v-if="loading" class="local-group-loading">
      <p>{{ t('pages.localGroup.loading') }}</p>
    </div>

    <div v-else class="local-group-overlay">
      <div class="local-group-top-right">
        <LocalGroupLayersPanel
          :title="t('pages.localGroup.layers.title')"
          :legend-title="t('pages.localGroup.layers.velocityLegend')"
          :open="layersOpen"
          :controls="layerControls"
          :visibility="layerVisibility"
          :velocity-bins="velocityBins"
          @toggle-layer="toggleLayer"
          @toggle-open="layersOpen = !layersOpen"
        />
      </div>

      <div class="local-group-bottom-left">
        <LocalGroupPlaque
          :caption="t('pages.localGroup.caption')"
          :title="t('pages.localGroup.title')"
          :subtitle="t('pages.localGroup.subtitle')"
          :credit="t('pages.localGroup.credit')"
        />

        <LocalGroupWaypointRail
          :title="t('pages.localGroup.waypointsTitle')"
          :landmarks="localizedLandmarks"
          :active-id="activeLandmarkId"
          @select="selectLandmark"
        />
      </div>

      <div class="local-group-bottom-right">
        <div class="local-group-stats-chip">
          <span>{{ groupCount.toLocaleString() }} {{ t('pages.localGroup.stats.groups') }}</span>
          <span>{{ t('pages.localGroup.stats.radius') }} 100 Mpc</span>
        </div>

        <LocalGroupContextCard
          :landmark="activeLandmark"
          :point-hit="hoveredPoint"
          :kicker="activeLandmark ? t('pages.localGroup.context.focusKicker') : t('pages.localGroup.context.hoverKicker')"
          :velocity-label="t('pages.localGroup.context.velocity')"
          :distance-label="t('pages.localGroup.context.distance')"
          :idle-title="t('pages.localGroup.context.idleTitle')"
          :idle-body="t('pages.localGroup.context.idleBody')"
          @clear="clearLandmarkSelection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LocalGroupContextCard from '@/components/local-group/LocalGroupContextCard.vue'
import LocalGroupLayersPanel from '@/components/local-group/LocalGroupLayersPanel.vue'
import LocalGroupPlaque from '@/components/local-group/LocalGroupPlaque.vue'
import LocalGroupWaypointRail from '@/components/local-group/LocalGroupWaypointRail.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { VELOCITY_COLOR_BINS } from '@/three/constants'
import { LOCAL_GROUP_LANDMARKS } from '@/three/local-group/localGroupLandmarks'
import { LocalGroupScene } from '@/three/local-group/LocalGroupScene'
import type {
  LocalGroupLandmark,
  LocalGroupLayerVisibility,
  LocalGroupPointHit,
} from '@/three/local-group/localGroupTypes'

const router = useRouter()
const { t, te } = useI18n()
const { ready, getAllGroups } = useGalaxyData()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
const layersOpen = ref(true)
const groupCount = ref(0)
const activeLandmarkId = ref<string | null>(null)
const hoveredPoint = ref<LocalGroupPointHit | null>(null)
const velocityBins = VELOCITY_COLOR_BINS
const layerVisibility = ref<LocalGroupLayerVisibility>({
  shells: true,
  rings: true,
  stems: true,
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

const activeLandmark = computed<LocalGroupLandmark | null>(() =>
  localizedLandmarks.value.find((landmark) => landmark.id === activeLandmarkId.value) ?? null,
)

const layerControls = computed(() => [
  { key: 'shells', label: t('pages.localGroup.layers.shells') },
  { key: 'rings', label: t('pages.localGroup.layers.rings') },
  { key: 'stems', label: t('pages.localGroup.layers.stems') },
  { key: 'labels', label: t('pages.localGroup.layers.labels') },
] as Array<{ key: keyof LocalGroupLayerVisibility; label: string }>)

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

  hoveredPoint.value = null
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

/**
 * Toggles visibility for one scene layer.
 */
function toggleLayer(key: keyof LocalGroupLayerVisibility): void {
  layerVisibility.value = {
    ...layerVisibility.value,
    [key]: !layerVisibility.value[key],
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
 * Updates point hover state without interrupting active landmark focus.
 */
function onPointerMove(event: PointerEvent): void {
  const canvas = canvasRef.value
  if (!scene || !canvas) return

  const dx = event.clientX - pointerDownX
  const dy = event.clientY - pointerDownY
  if (event.buttons > 0 && (dx * dx + dy * dy) > DRAG_THRESHOLD * DRAG_THRESHOLD) {
    wasDragging = true
    hoveredPoint.value = null
    canvas.style.cursor = 'grabbing'
    return
  }

  if (event.buttons > 0 || activeLandmarkId.value) return
  if (hoverThrottleId) return

  hoverThrottleId = window.setTimeout(() => {
    hoverThrottleId = 0
    hoveredPoint.value = scene?.pickAtScreen(
      event.clientX,
      event.clientY,
      canvas.clientWidth,
      canvas.clientHeight,
    ) ?? null
    canvas.style.cursor = hoveredPoint.value ? 'pointer' : 'grab'
  }, 40)
}

/**
 * Opens the galaxy detail route when a projected point is clicked.
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
    router.push(`/g/${hit.pgc}`)
  }
}

/**
 * Restores the resting cursor after pointer release.
 */
function onPointerUp(): void {
  if (canvasRef.value) {
    canvasRef.value.style.cursor = hoveredPoint.value ? 'pointer' : 'grab'
  }
}

onMounted(async () => {
  await ready
  if (!canvasRef.value) return

  allGroupsCache = getAllGroups()
  groupCount.value = allGroupsCache.filter((group) => group.dist_mpc <= 100).length

  scene = new LocalGroupScene(canvasRef.value)
  scene.loadGroups(allGroupsCache, localizedLandmarks.value)
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

  scene?.dispose()
  scene = null
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Orbitron:wght@500;700&display=swap');

.local-group-page {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 55% 45%, rgba(20, 64, 96, 0.2), transparent 30%),
    radial-gradient(circle at 40% 55%, rgba(0, 173, 239, 0.08), transparent 38%),
    #010406;
}

.local-group-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.local-group-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(201, 238, 255, 0.54);
}

.local-group-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.local-group-top-right,
.local-group-bottom-left,
.local-group-bottom-right {
  position: fixed;
  z-index: 20;
  pointer-events: auto;
}

.local-group-top-right {
  top: calc(var(--header-height) + 18px);
  right: 20px;
}

.local-group-bottom-left {
  left: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.local-group-bottom-right {
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.local-group-stats-chip {
  display: flex;
  gap: 18px;
  padding: 10px 14px;
  border: 1px solid rgba(110, 195, 236, 0.16);
  background: rgba(3, 10, 17, 0.74);
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(200, 229, 240, 0.7);
  backdrop-filter: blur(16px);
}

@media (max-width: 900px) {
  .local-group-top-right {
    top: calc(var(--header-height) + 12px);
    right: 12px;
  }

  .local-group-bottom-left,
  .local-group-bottom-right {
    left: 12px;
    right: 12px;
    bottom: 12px;
  }

  .local-group-bottom-right {
    position: static;
    align-items: stretch;
    margin: 12px;
  }

  .local-group-bottom-left {
    gap: 10px;
  }

  .local-group-stats-chip {
    justify-content: space-between;
  }
}
</style>
