<template>
  <canvas ref="canvasRef" class="galaxy-detail-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Galaxy } from '@/types/galaxy'
import type { IGalaxyScene } from '@/three/galaxy-detail/IGalaxyScene'

const props = defineProps<{ galaxy: Galaxy }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let scene: IGalaxyScene | null = null

onMounted(async () => {
  if (!canvasRef.value) return

  if (navigator.gpu) {
    try {
      const { GalaxySceneWebGPU } = await import(
        '@/three/galaxy-detail/webgpu/GalaxySceneWebGPU'
      )
      scene = new GalaxySceneWebGPU(canvasRef.value, props.galaxy)
      await scene.start()
      return
    } catch (e) {
      console.warn('WebGPU galaxy renderer failed, falling back to WebGL:', e)
    }
  }

  // WebGL fallback
  const { GalaxyScene } = await import('@/three/galaxy-detail/GalaxyScene')
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
  touch-action: none; /* Prevent browser scroll/zoom so touch orbit and pinch work */
}
</style>
