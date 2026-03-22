<template>
  <div class="known-stars-card">
    <div class="card-header">
      <span class="info-label">{{ t('pages.galaxy.knownStars.title') }}</span>
      <span v-if="loading" class="loading-dot">⋯</span>
    </div>
    <div v-if="error" class="error-row">
      {{ error }}
    </div>
    <div v-else-if="hasQueried && !loading && objects.length === 0" class="empty-row">
      {{ t('pages.galaxy.knownStars.empty') }}
    </div>
    <div v-else class="results-list">
      <a
        v-for="obj in objects"
        :key="obj.name"
        :href="obj.simbadUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="result-item"
      >
        <span class="obj-name">{{ obj.name }}</span>
        <span class="obj-type">{{ obj.type }}</span>
        <span class="link-icon">↗</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSimbadLookup } from '@/composables/useSimbadLookup'
import { mapGalaxyToRenderParams } from '@/three/galaxy-detail/morphology'
import type { Galaxy } from '@/types/galaxy'

const { t } = useI18n()

/** Delay after 3D scene is ready before querying SIMBAD (reduces contention with WebGPU init). */
const SIMBAD_DELAY_AFTER_SCENE_MS = 2000

const props = defineProps<{
  galaxy: Galaxy
  /** When true, the galaxy detail canvas has finished initializing (WebGPU or WebGL). */
  sceneReady: boolean
}>()

const { loading, results, error, query, reset: resetSimbad } = useSimbadLookup()
const isNarrowViewport = ref(false)
/** True after the first SIMBAD request has been started (avoids showing "empty" before deferred load). */
const hasQueried = ref(false)

let simbadDelayTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Clears the pending SIMBAD schedule (e.g. scene reset or unmount).
 */
function clearSimbadDelayTimer(): void {
  if (simbadDelayTimer !== null) {
    clearTimeout(simbadDelayTimer)
    simbadDelayTimer = null
  }
}

function checkViewport() {
  isNarrowViewport.value = window.innerWidth < 768
}

onMounted(() => {
  checkViewport()
  window.addEventListener('resize', checkViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkViewport)
  clearSimbadDelayTimer()
})

/** Minimum search radius in arcseconds when galaxy size is unknown or very small */
const MIN_RADIUS_ARCSEC = 60

/**
 * Compute SIMBAD search radius from galaxy's estimated angular size.
 * Uses diameter_arcsec when available, else diameterKpc / distance_mpc * 206.265.
 * Radius = half the galaxy extent, with a minimum of 60 arcsec.
 */
function getSearchRadiusArcsec(galaxy: Galaxy): number {
  try {
    let diameterArcsec: number
    if (galaxy.diameter_arcsec != null && galaxy.diameter_arcsec > 0) {
      diameterArcsec = galaxy.diameter_arcsec
    } else {
      const params = mapGalaxyToRenderParams(galaxy)
      diameterArcsec = (params.diameterKpc / galaxy.distance_mpc) * 206.265
    }
    const radius = diameterArcsec / 2
    return Math.max(radius, MIN_RADIUS_ARCSEC)
  } catch {
    return MIN_RADIUS_ARCSEC
  }
}

/** Max objects: 5 on mobile, 10 on desktop */
const MAX_OBJECTS_DESKTOP = 10
const MAX_OBJECTS_MOBILE = 5

/** Types that should appear first: literal "star" (cone) or "*" (TAP condensed for Star). */
function hasStarInType(otype: string): boolean {
  if (!otype) return false
  return otype === '*' || otype.toLowerCase().includes('star')
}

function isStarLike(otype: string): boolean {
  if (!otype) return false
  const lower = otype.toLowerCase()
  return (
    hasStarInType(otype) ||
    (otype.includes('*') && !lower.includes('cluster') && !lower.includes('group'))
  )
}

/**
 * Order: 1) types containing "star", 2) other star-like (c*, s?r), 3) galaxies, 4) other.
 */
const objects = computed(() => {
  const r = results.value
  const withStar = r.filter((o) => hasStarInType(o.type))
  const otherStarLike = r.filter((o) => isStarLike(o.type) && !hasStarInType(o.type))
  const galaxies = r.filter((o) => o.type === 'Galaxy' || o.type?.toLowerCase().includes('galaxy'))
  const other = r.filter((o) => !isStarLike(o.type) && o.type !== 'Galaxy' && !o.type?.toLowerCase().includes('galaxy'))
  const combined = [...withStar, ...otherStarLike, ...galaxies, ...other]
  const limit = isNarrowViewport.value ? MAX_OBJECTS_MOBILE : MAX_OBJECTS_DESKTOP
  return combined.slice(0, limit)
})

/**
 * Query SIMBAD for catalogued objects near the galaxy (RA/Dec from the database).
 */
function fetchKnownStars(): void {
  const g = props.galaxy
  if (!g || g.ra == null || g.dec == null) return
  hasQueried.value = true
  const radiusArcsec = getSearchRadiusArcsec(g)
  void query(g.ra, g.dec, radiusArcsec, { objectTypeFilter: 'starsAndGalaxies' })
}

watch(
  () => [props.sceneReady, props.galaxy] as const,
  ([ready, g]) => {
    clearSimbadDelayTimer()
    resetSimbad()
    hasQueried.value = false
    if (!ready || !g || g.ra == null || g.dec == null) return
    simbadDelayTimer = setTimeout(() => {
      simbadDelayTimer = null
      fetchKnownStars()
    }, SIMBAD_DELAY_AFTER_SCENE_MS)
  },
  { immediate: true }
)
</script>

<style scoped>
.known-stars-card {
  position: relative;
  width: 100%;
  min-width: 180px;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 12px;
  color: #e0e0e0;
  backdrop-filter: blur(12px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.info-label {
  color: rgba(255, 255, 255, 0.45);
}

.loading-dot {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.4;
  }
}

.error-row,
.empty-row {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  line-height: 1.5;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 11px;
  text-decoration: none;
  color: #e0e0e0;
  border-left: 2px solid #22d3ee;
  transition: background 0.2s, color 0.2s;
}

.result-item:hover {
  background: rgba(34, 211, 238, 0.15);
  color: #ffffff;
}

.obj-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.obj-type {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
  flex-shrink: 0;
}

.link-icon {
  font-size: 10px;
  color: rgba(34, 211, 238, 0.8);
  flex-shrink: 0;
}
</style>
