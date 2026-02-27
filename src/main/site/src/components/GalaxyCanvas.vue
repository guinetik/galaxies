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
import { BackgroundStars } from '@/three/BackgroundStars'
import { LOCATIONS } from '@/three/constants'

const emit = defineEmits<{
  ready: []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { currentFov, currentMaxRedshift, currentLocation, init, getScene, getPivot, startLoop, setLocation: setSceneLocation, dispose: disposeScene } = useThreeScene()
const { ready, getAllGalaxies } = useGalaxyData()

function setLocation(name: string) {
  setSceneLocation(name)
  const loc = LOCATIONS[name]
  if (loc && earthHorizon) {
    earthHorizon.setLocation(loc.latitude, loc.longitude)
  }
}

defineExpose({ currentFov, currentMaxRedshift, currentLocation, setLocation })

let galaxyField: GalaxyField | null = null
let earthHorizon: EarthHorizon | null = null
let backgroundStars: BackgroundStars | null = null

onMounted(async () => {
  if (!canvasRef.value) return

  // 1. Init Three.js scene
  init(canvasRef.value)
  const scene = getScene()
  const pivot = getPivot()

  // 2. Load galaxy data
  await ready

  // 3. Generate textures
  const atlasTexture = generateGalaxyTextureAtlas()

  // 4. Create objects
  const galaxies = getAllGalaxies()
  galaxyField = new GalaxyField(galaxies, atlasTexture)
  earthHorizon = new EarthHorizon()
  backgroundStars = new BackgroundStars()

  // Celestial objects go in the pivot — rotated by location changes
  pivot.add(backgroundStars.points)
  pivot.add(galaxyField.points)
  // Earth stays fixed in the scene — always "ground below" regardless of location
  scene.add(earthHorizon.mesh)

  // 5. Start animation loop
  startLoop((elapsed) => {
    galaxyField?.update(elapsed, currentMaxRedshift.value)
    backgroundStars?.update(elapsed)
    earthHorizon?.update()
  })

  emit('ready')
})

onUnmounted(() => {
  galaxyField?.dispose()
  earthHorizon?.dispose()
  backgroundStars?.dispose()
  disposeScene()
})
</script>
