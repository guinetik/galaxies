<template>
  <canvas ref="canvasRef" class="galaxy-detail-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Galaxy } from '@/types/galaxy'
import { GalaxyScene } from '@/three/galaxy-detail/GalaxyScene'

const props = defineProps<{ galaxy: Galaxy }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let scene: GalaxyScene | null = null

onMounted(() => {
  if (!canvasRef.value) return
  scene = new GalaxyScene(canvasRef.value, props.galaxy)
  scene.start()
})

onUnmounted(() => {
  scene?.dispose()
  scene = null
})
</script>

<style scoped>
.galaxy-detail-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
