<template>
  <div class="w-full h-full">
    <GalaxyCanvas ref="canvasRef" @ready="onCanvasReady" @hover="onHover" />
    <AppHeader
      :galaxy-count="galaxyCount"
      :current-location="canvasRef?.currentLocation ?? 'North Pole'"
      @update:location="canvasRef?.setLocation($event)"
    />
    
    <!-- HUD Indicators -->
    <div class="absolute top-16 left-0 right-0 z-0 pointer-events-none flex justify-center">
      <div class="w-full max-w-3xl">
        <SpaceCompass :azimuth="currentAzimuth" />
      </div>
    </div>
    
    <div class="absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none">
      <DistanceIndicator :distance="currentDistance" />
    </div>

    <div class="absolute left-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none">
      <ElevationIndicator :elevation="currentElevation" />
    </div>

    <SkyFilterPanel
      v-if="canvasReady"
      :total-count="totalGalaxyCount"
      :filtered-count="filteredCount"
      @filter-change="onFilterChange"
    />
    <GalaxyTooltip :galaxy="hoveredGalaxy" :x="tooltipX" :y="tooltipY" />
    <LoadingOverlay :is-loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GalaxyCanvas from '@/components/GalaxyCanvas.vue'
import type { HoverEvent } from '@/components/GalaxyCanvas.vue'
import AppHeader from '@/components/AppHeader.vue'
import SkyFilterPanel from '@/components/SkyFilterPanel.vue'
import GalaxyTooltip from '@/components/GalaxyTooltip.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import SpaceCompass from '@/components/SpaceCompass.vue'
import DistanceIndicator from '@/components/DistanceIndicator.vue'
import ElevationIndicator from '@/components/ElevationIndicator.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { redshiftToDistanceMLY } from '@/three/celestialMath'
import type { Galaxy, MorphologyClass } from '@/types/galaxy'

const { isLoading, galaxyCount } = useGalaxyData()
const canvasRef = ref<InstanceType<typeof GalaxyCanvas> | null>(null)
const canvasReady = ref(false)
const totalGalaxyCount = ref(0)
const filteredCount = ref(0)
const hoveredGalaxy = ref<Galaxy | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

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
}

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
</script>
