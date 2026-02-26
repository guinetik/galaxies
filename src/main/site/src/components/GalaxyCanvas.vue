<template>
  <canvas ref="canvasRef" class="fixed inset-0 w-full h-full" style="cursor: grab" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '@/composables/useThreeScene'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { GalaxyField } from '@/three/GalaxyField'
import { EarthHorizon } from '@/three/EarthHorizon'
import { generateGalaxyTextureAtlas } from '@/three/GalaxyTextures'

const emit = defineEmits<{
  ready: []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { currentFov, currentMaxRedshift, init, getScene, startLoop, dispose: disposeScene } = useThreeScene()
const { ready, getAllGalaxies } = useGalaxyData()

defineExpose({ currentFov, currentMaxRedshift })

let galaxyField: GalaxyField | null = null
let earthHorizon: EarthHorizon | null = null

onMounted(async () => {
  if (!canvasRef.value) return

  // 1. Init Three.js scene
  init(canvasRef.value)
  const scene = getScene()

  // 2. Load galaxy data
  await ready

  // 3. Generate textures
  const atlasTexture = generateGalaxyTextureAtlas()

  // 4. Create objects
  const galaxies = getAllGalaxies()
  galaxyField = new GalaxyField(galaxies, atlasTexture)
  earthHorizon = new EarthHorizon()

  scene.add(galaxyField.points)
  scene.add(earthHorizon.mesh)

  // 5. Start animation loop
  startLoop((elapsed) => {
    galaxyField?.update(elapsed, currentMaxRedshift.value)
  })

  emit('ready')
})

onUnmounted(() => {
  galaxyField?.dispose()
  earthHorizon?.dispose()
  disposeScene()
})
</script>
