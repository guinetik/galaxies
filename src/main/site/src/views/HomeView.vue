<template>
  <div class="w-full h-full">
    <GalaxyCanvas ref="canvasRef" @ready="onCanvasReady" @hover="onHover" @select="onSelect" />
    
    <!-- HUD Indicators -->
    <div class="absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center hud-soft">
      <div class="w-full max-w-3xl">
        <SpaceCompass :azimuth="currentAzimuth" />
      </div>
    </div>
    
    <div class="absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none hud-soft hud-telemetry">
      <DistanceIndicator :distance="currentDistance" />
    </div>

    <div class="absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none hud-soft hud-telemetry">
      <ElevationIndicator :elevation="currentElevation" />
    </div>

    <SkyFilterPanel
      v-if="canvasReady"
      :total-count="totalGalaxyCount"
      :filtered-count="filteredCount"
      @filter-change="onFilterChange"
    />
    <GalaxyTooltip
      :galaxy="tooltipGalaxy"
      :x="tooltipX"
      :y="tooltipY"
      :show-cta="isMobile"
      @navigate="onTooltipNavigate"
    />
    <LoadingOverlay :is-loading="isLoading" />

    <!-- Galaxy count badge (bottom right) -->
    <div
      v-if="canvasReady && filteredCount > 0"
      class="galaxy-count-badge"
    >
      {{ t('app.loaded', { count: filteredCount.toLocaleString() }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GalaxyCanvas from '@/components/GalaxyCanvas.vue'
import type { HoverEvent } from '@/components/GalaxyCanvas.vue'
import SkyFilterPanel from '@/components/SkyFilterPanel.vue'
import { useAppHeader } from '@/composables/useAppHeader'
import GalaxyTooltip from '@/components/GalaxyTooltip.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import SpaceCompass from '@/components/SpaceCompass.vue'
import DistanceIndicator from '@/components/DistanceIndicator.vue'
import ElevationIndicator from '@/components/ElevationIndicator.vue'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { redshiftToDistanceMLY } from '@/three/celestialMath'
import type { Galaxy, MorphologyClass } from '@/types/galaxy'

const router = useRouter()
const { t } = useI18n()
const { isLoading } = useGalaxyData()
const { currentLocation, locationSetter } = useAppHeader()
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const canvasRef = ref<InstanceType<typeof GalaxyCanvas> | null>(null)
const canvasReady = ref(false)
const totalGalaxyCount = ref(0)
const filteredCount = ref(0)
const hoveredGalaxy = ref<Galaxy | null>(null)
const selectedGalaxy = ref<Galaxy | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

const tooltipGalaxy = computed(() =>
  isMobile ? selectedGalaxy.value : hoveredGalaxy.value
)
const currentAzimuth = computed(() => canvasRef.value?.currentLookAt?.azimuth ?? 0)
const currentElevation = computed(() => canvasRef.value?.currentLookAt?.elevation ?? 0)
const currentDistance = computed(() => {
  const z = canvasRef.value?.currentMaxRedshift ?? 0
  return redshiftToDistanceMLY(z)
})

function onCanvasReady() {
  canvasReady.value = true
  const total = canvasRef.value?.getAllGalaxiesCount() ?? 0
  totalGalaxyCount.value = total
  filteredCount.value = total
  if (canvasRef.value) {
    locationSetter.value = canvasRef.value.setLocation
    currentLocation.value = canvasRef.value.currentLocation
  }
}

onUnmounted(() => {
  locationSetter.value = null
})

function onFilterChange(payload: { morphologies: Set<MorphologyClass>; sources: Set<string> }) {
  const count = canvasRef.value?.applyFilter(payload.morphologies, payload.sources) ?? 0
  filteredCount.value = count
}

function onHover(payload: HoverEvent | null) {
  if (payload) {
    hoveredGalaxy.value = payload.galaxy
    tooltipX.value = payload.screenX
    tooltipY.value = payload.screenY
  } else {
    hoveredGalaxy.value = null
  }
}

function onSelect(payload: HoverEvent | null) {
  if (payload) {
    selectedGalaxy.value = payload.galaxy
    tooltipX.value = payload.screenX
    tooltipY.value = payload.screenY
  } else {
    selectedGalaxy.value = null
  }
}

function onTooltipNavigate() {
  if (selectedGalaxy.value) {
    router.push(`/g/${selectedGalaxy.value.pgc}`)
  }
}
</script>

<style scoped>
.galaxy-count-badge {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10;
  padding: 7px 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
  background: rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(6px);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.hud-soft {
  opacity: 0.42;
  transition: opacity 220ms ease;
}

.hud-soft:hover {
  opacity: 0.72;
}

.hud-telemetry {
  opacity: 0.36;
}
</style>
