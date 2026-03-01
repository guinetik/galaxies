<template>
  <div class="w-full h-full">
    <GalaxyCanvas ref="canvasRef" @ready="onCanvasReady" @hover="onHover" />
    <AppHeader
      :galaxy-count="galaxyCount"
      :current-location="canvasRef?.currentLocation ?? 'North Pole'"
      @update:location="canvasRef?.setLocation($event)"
    />
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
import { ref } from 'vue'
import GalaxyCanvas from '@/components/GalaxyCanvas.vue'
import type { HoverEvent } from '@/components/GalaxyCanvas.vue'
import AppHeader from '@/components/AppHeader.vue'
import SkyFilterPanel from '@/components/SkyFilterPanel.vue'
import GalaxyTooltip from '@/components/GalaxyTooltip.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { Galaxy, MorphologyClass } from '@/types/galaxy'

const { isLoading, galaxyCount } = useGalaxyData()
const canvasRef = ref<InstanceType<typeof GalaxyCanvas> | null>(null)
const canvasReady = ref(false)
const totalGalaxyCount = ref(0)
const filteredCount = ref(0)
const hoveredGalaxy = ref<Galaxy | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

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
