<template>
  <div class="w-full h-full">
    <GalaxyCanvas ref="canvasRef" @ready="onCanvasReady" @hover="onHover" />
    <AppHeader
      :galaxy-count="galaxyCount"
      :current-location="canvasRef?.currentLocation ?? 'North Pole'"
      @update:location="canvasRef?.setLocation($event)"
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
import GalaxyTooltip from '@/components/GalaxyTooltip.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { Galaxy } from '@/types/galaxy'

const { isLoading, galaxyCount } = useGalaxyData()
const canvasRef = ref<InstanceType<typeof GalaxyCanvas> | null>(null)
const canvasReady = ref(false)
const hoveredGalaxy = ref<Galaxy | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

function onCanvasReady() {
  canvasReady.value = true
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
