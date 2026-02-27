<template>
  <canvas ref="canvasRef" class="fixed inset-0 w-full h-full" style="cursor: grab" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { useThreeScene } from '@/composables/useThreeScene'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { GalaxyField } from '@/three/GalaxyField'
import { EarthHorizon } from '@/three/EarthHorizon'
import { BackgroundStars } from '@/three/BackgroundStars'
import { LOCATIONS } from '@/three/constants'
import type { Galaxy } from '@/types/galaxy'

export interface HoverEvent {
  galaxy: Galaxy
  screenX: number
  screenY: number
}

const emit = defineEmits<{
  ready: []
  hover: [payload: HoverEvent | null]
}>()

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { currentFov, currentMaxRedshift, currentLocation, init, getScene, getCamera, getIsDragging, getPivot, startLoop, setLocation: setSceneLocation, dispose: disposeScene } = useThreeScene()
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

// Raycaster for hover detection
const raycaster = new THREE.Raycaster()
raycaster.params.Points.threshold = 0.6
const mouse = new THREE.Vector2()

function onPointerMoveHover(e: PointerEvent) {
  if (getIsDragging()) {
    emit('hover', null)
    return
  }

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

  if (!galaxyField) return
  const camera = getCamera()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(galaxyField.points)

  if (intersects.length > 0 && intersects[0].index != null) {
    const galaxy = galaxyField.galaxies[intersects[0].index]
    canvasRef.value!.style.cursor = 'pointer'
    emit('hover', { galaxy, screenX: e.clientX, screenY: e.clientY })
  } else {
    canvasRef.value!.style.cursor = 'grab'
    emit('hover', null)
  }
}

function onPointerLeave() {
  emit('hover', null)
}

function onPointerClickGalaxy(e: PointerEvent) {
  if (getIsDragging()) return

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

  if (!galaxyField) return
  const camera = getCamera()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(galaxyField.points)

  if (intersects.length > 0 && intersects[0].index != null) {
    const galaxy = galaxyField.galaxies[intersects[0].index]
    router.push(`/g/${encodeURIComponent(galaxy.name)}`)
  }
}

onMounted(async () => {
  if (!canvasRef.value) return

  // 1. Init Three.js scene
  init(canvasRef.value)
  const scene = getScene()
  const pivot = getPivot()

  // 2. Load galaxy data
  await ready

  // 3. Create objects
  const galaxies = getAllGalaxies()
  galaxyField = new GalaxyField(galaxies)
  earthHorizon = new EarthHorizon()
  backgroundStars = new BackgroundStars()

  // Celestial objects go in the pivot — rotated by location changes
  pivot.add(backgroundStars.points)
  pivot.add(galaxyField.points)
  // Earth stays fixed in the scene — always "ground below" regardless of location
  scene.add(earthHorizon.mesh)

  // 5. Start animation loop
  startLoop((elapsed) => {
    galaxyField?.update(elapsed, currentMaxRedshift.value, currentFov.value)
    backgroundStars?.update(elapsed)
    earthHorizon?.update()
  })

  canvasRef.value.addEventListener('pointermove', onPointerMoveHover)
  canvasRef.value.addEventListener('pointerleave', onPointerLeave)
  canvasRef.value.addEventListener('click', onPointerClickGalaxy)

  emit('ready')
})

onUnmounted(() => {
  canvasRef.value?.removeEventListener('pointermove', onPointerMoveHover)
  canvasRef.value?.removeEventListener('pointerleave', onPointerLeave)
  canvasRef.value?.removeEventListener('click', onPointerClickGalaxy)
  galaxyField?.dispose()
  earthHorizon?.dispose()
  backgroundStars?.dispose()
  disposeScene()
})
</script>
