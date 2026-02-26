<template>
  <div class="w-full h-full">
    <GalaxyCanvas @ready="onCanvasReady" />
    <AppHeader :galaxy-count="galaxyCount" />
    <LoadingOverlay :is-loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GalaxyCanvas from '@/components/GalaxyCanvas.vue'
import AppHeader from '@/components/AppHeader.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'

const { isLoading, galaxyCount } = useGalaxyData()
const canvasReady = ref(false)

function onCanvasReady() {
  canvasReady.value = true
}
</script>
