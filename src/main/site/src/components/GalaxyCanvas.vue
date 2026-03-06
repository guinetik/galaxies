<template>
  <canvas ref="canvasRef" class="fixed inset-0 w-full h-full galaxy-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThreeScene } from '@/composables/useThreeScene'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { GalaxyField } from '@/three/GalaxyField'
import { EarthHorizon } from '@/three/EarthHorizon'
import { BackgroundStars } from '@/three/BackgroundStars'
import { generateGalaxyTextureAtlas } from '@/three/GalaxyTextures'
import { LOCATIONS } from '@/three/constants'
import type { Galaxy, MorphologyClass } from '@/types/galaxy'
import { assignMorphology } from '@/types/galaxy'

export interface HoverEvent {
  galaxy: Galaxy
  screenX: number
  screenY: number
}

const emit = defineEmits<{
  ready: []
  hover: [payload: HoverEvent | null]
  select: [payload: HoverEvent | null]
}>()

/** Mobile: touch-primary device (e.g. phone) — use tap-to-select instead of hover */
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { currentFov, currentMaxRedshift, currentMinRedshift, currentLocation, currentLookAt, init, getScene, getCamera, getIsDragging, getPivot, startLoop, setLocation: setSceneLocation, dispose: disposeScene } = useThreeScene()
const { ready, getAllGalaxies } = useGalaxyData()

function setLocation(name: string) {
  setSceneLocation(name)
  const loc = LOCATIONS[name]
  if (loc && earthHorizon) {
    earthHorizon.setLocation(loc.latitude, loc.longitude)
  }
}

let allGalaxies: Galaxy[] = []

function applyFilter(morphologies: Set<MorphologyClass>, sources: Set<string>) {
  if (!galaxyField) return 0
  const filtered = allGalaxies.filter(g => {
    const morph = assignMorphology(g.pgc, g.morphology)
    return morphologies.has(morph) && sources.has(g.source ?? 'CF4')
  })
  galaxyField.rebuild(filtered)
  return filtered.length
}

function getAllGalaxiesCount() {
  return allGalaxies.length
}

defineExpose({ currentFov, currentMaxRedshift, currentLocation, currentLookAt, setLocation, applyFilter, getAllGalaxiesCount })

let galaxyField: GalaxyField | null = null
let earthHorizon: EarthHorizon | null = null
let backgroundStars: BackgroundStars | null = null
const CLICK_CANCEL_DISTANCE_PX = 5
let pointerIsDown = false
let pointerDownX = 0
let pointerDownY = 0
let pointerMovedDuringGesture = false
let suppressNextClick = false
let selectedGalaxy: Galaxy | null = null
let pointerParallaxTargetX = 0
let pointerParallaxTargetY = 0
let pointerParallaxX = 0
let pointerParallaxY = 0

/**
 * Perform pointer hit detection against square galaxy sprite bounds.
 * Coordinates are converted from viewport space into canvas-local space.
 */
function pickGalaxyFromPointer(e: PointerEvent): Galaxy | null {
  if (!galaxyField || !canvasRef.value) return null

  const rect = canvasRef.value.getBoundingClientRect()
  const localX = e.clientX - rect.left
  const localY = e.clientY - rect.top
  if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) return null

  return galaxyField.pickGalaxyAtScreen(
    localX,
    localY,
    getCamera(),
    rect.width,
    rect.height,
    currentMaxRedshift.value,
    currentMinRedshift.value,
    currentFov.value
  )
}

function onPointerMoveHover(e: PointerEvent) {
  updatePointerParallaxTarget(e.clientX, e.clientY)

  if (pointerIsDown) {
    const dx = e.clientX - pointerDownX
    const dy = e.clientY - pointerDownY
    if (dx * dx + dy * dy > CLICK_CANCEL_DISTANCE_PX * CLICK_CANCEL_DISTANCE_PX) {
      pointerMovedDuringGesture = true
    }
  }

  if (getIsDragging()) {
    galaxyField?.setHoveredPgc(null)
    emit('hover', null)
    return
  }

  const galaxy = pickGalaxyFromPointer(e)
  if (galaxy) {
    canvasRef.value!.style.cursor = 'pointer'
    galaxyField?.setHoveredPgc(galaxy.pgc)
    emit('hover', { galaxy, screenX: e.clientX, screenY: e.clientY })
  } else {
    canvasRef.value!.style.cursor = 'grab'
    galaxyField?.setHoveredPgc(null)
    if (!isMobile) emit('hover', null)
  }
}

/**
 * Convert viewport coordinates into normalized parallax range [-1, 1].
 */
function updatePointerParallaxTarget(clientX: number, clientY: number) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return
  const x = (clientX - rect.left) / rect.width
  const y = (clientY - rect.top) / rect.height
  pointerParallaxTargetX = Math.max(-1, Math.min(1, x * 2 - 1))
  pointerParallaxTargetY = Math.max(-1, Math.min(1, 1 - y * 2))
}

function setSelection(payload: HoverEvent | null) {
  selectedGalaxy = payload?.galaxy ?? null
  galaxyField?.setSelectedPgc(selectedGalaxy?.pgc ?? null)
  galaxyField?.setHoveredPgc(selectedGalaxy?.pgc ?? null)
  emit('select', payload ?? null)
}

function onPointerLeave() {
  pointerIsDown = false
  pointerMovedDuringGesture = false
  pointerParallaxTargetX = 0
  pointerParallaxTargetY = 0
  galaxyField?.setHoveredPgc(null)
  emit('hover', null)
  if (!isMobile) return
  setSelection(null)
}

/**
 * Track pointer gesture lifecycle to suppress click navigation after drags.
 */
function onPointerDownCapture(e: PointerEvent) {
  pointerIsDown = true
  pointerDownX = e.clientX
  pointerDownY = e.clientY
  updatePointerParallaxTarget(e.clientX, e.clientY)
  pointerMovedDuringGesture = false
}

function onPointerUpCapture() {
  if (pointerMovedDuringGesture) {
    suppressNextClick = true
  }
  pointerIsDown = false
  pointerMovedDuringGesture = false
}

function onPointerClickGalaxy(e: MouseEvent) {
  if (suppressNextClick) {
    suppressNextClick = false
    return
  }
  if (getIsDragging()) return

  const galaxy = pickGalaxyFromPointer(e as PointerEvent)
  if (isMobile) {
    if (galaxy) {
      if (selectedGalaxy?.pgc === galaxy.pgc) {
        router.push(`/g/${galaxy.pgc}`)
      } else {
        setSelection({ galaxy, screenX: e.clientX, screenY: e.clientY })
      }
    } else {
      setSelection(null)
    }
  } else if (galaxy) {
    router.push(`/g/${galaxy.pgc}`)
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
  allGalaxies = getAllGalaxies()
  const atlasTexture = generateGalaxyTextureAtlas()
  galaxyField = new GalaxyField(allGalaxies, atlasTexture)
  earthHorizon = new EarthHorizon()
  backgroundStars = new BackgroundStars()

  // Celestial objects go in the pivot — rotated by location changes
  pivot.add(backgroundStars.points)
  pivot.add(galaxyField.points)
  // Earth stays fixed in the scene — always "ground below" regardless of location
  scene.add(earthHorizon.mesh)

  // 5. Start animation loop
  startLoop((elapsed) => {
    // Smooth pointer-driven parallax so reveal lanes glide while dragging.
    pointerParallaxX += (pointerParallaxTargetX - pointerParallaxX) * 0.18
    pointerParallaxY += (pointerParallaxTargetY - pointerParallaxY) * 0.18
    galaxyField?.update(
      elapsed,
      currentMaxRedshift.value,
      currentMinRedshift.value,
      currentFov.value,
      pointerParallaxX,
      pointerParallaxY
    )
    backgroundStars?.update(elapsed)
    earthHorizon?.update()
  })

  canvasRef.value.addEventListener('pointermove', onPointerMoveHover)
  canvasRef.value.addEventListener('pointerdown', onPointerDownCapture)
  canvasRef.value.addEventListener('pointerup', onPointerUpCapture)
  canvasRef.value.addEventListener('pointercancel', onPointerUpCapture)
  canvasRef.value.addEventListener('pointerleave', onPointerLeave)
  canvasRef.value.addEventListener('click', onPointerClickGalaxy)

  emit('ready')
})

onUnmounted(() => {
  canvasRef.value?.removeEventListener('pointermove', onPointerMoveHover)
  canvasRef.value?.removeEventListener('pointerdown', onPointerDownCapture)
  canvasRef.value?.removeEventListener('pointerup', onPointerUpCapture)
  canvasRef.value?.removeEventListener('pointercancel', onPointerUpCapture)
  canvasRef.value?.removeEventListener('pointerleave', onPointerLeave)
  canvasRef.value?.removeEventListener('click', onPointerClickGalaxy)
  galaxyField?.dispose()
  earthHorizon?.dispose()
  backgroundStars?.dispose()
  disposeScene()
})
</script>

<style scoped>
.galaxy-canvas {
  cursor: grab;
  touch-action: none; /* Prevent browser scroll/zoom so pan and pinch work on mobile */
}
</style>
