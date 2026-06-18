<template>
  <canvas ref="canvasRef" class="galaxy-detail-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Galaxy } from '@/types/galaxy'
import type { IGalaxyScene } from '@/three/galaxy-detail/IGalaxyScene'
import { useGalaxyData } from '@/composables/useGalaxyData'

const props = withDefaults(defineProps<{
  galaxy: Galaxy
  renderer?: 'webgpu' | 'webgl'
}>(), {
  renderer: 'webgpu',
})

const emit = defineEmits<{
  activeRenderer: [value: 'webgpu' | 'webgl']
  ready: []
}>()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let scene: IGalaxyScene | null = null

const { ready: dbReady, getNearbyGalaxies } = useGalaxyData()

onMounted(async () => {
  if (!canvasRef.value) return

  // Fetch neighbor galaxies from the DB (non-blocking — DB may still be loading)
  await dbReady
  const neighbors: Galaxy[] = getNearbyGalaxies(props.galaxy)

  if (props.renderer === 'webgpu' && navigator.gpu) {
    try {
      const { GalaxySceneWebGPU } = await import(
        '@/three/galaxy-detail/webgpu/GalaxySceneWebGPU'
      )
      scene = new GalaxySceneWebGPU(canvasRef.value, props.galaxy, neighbors)
      await scene.start()
      emit('activeRenderer', 'webgpu')
      emit('ready')
      return
    } catch (e) {
      console.warn('WebGPU galaxy renderer failed, falling back to WebGL:', e)
    }
  }

  // WebGL fallback
  const { GalaxyScene } = await import('@/three/galaxy-detail/GalaxyScene')
  scene = new GalaxyScene(canvasRef.value, props.galaxy, neighbors)
  scene.start()
  emit('activeRenderer', 'webgl')
  emit('ready')
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
