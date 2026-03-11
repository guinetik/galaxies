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
import { LOCATIONS, CAMERA_FOV_MIN, CAMERA_FOV_DEFAULT } from '@/three/constants'
import { clamp, easeInOutCubic } from '@/lib/math'
import type { Galaxy } from '@/types/galaxy'
import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'
import { selectPreset, assignPresetFromPgc, presetToCategory } from '@/three/galaxy-detail/morphology'

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
const { currentFov, currentMaxRedshift, currentMinRedshift, currentLocation, currentLookAt, init, getScene, getCamera, getIsDragging, getPivot, startLoop, setLocation: setSceneLocation, setFovImmediate, setZoomLock, dispose: disposeScene } = useThreeScene()
const { ready, getAllGalaxies } = useGalaxyData()

function setLocation(name: string) {
  setSceneLocation(name)
  const loc = LOCATIONS[name]
  if (loc && earthHorizon) {
    earthHorizon.setLocation(loc.latitude, loc.longitude)
  }
}

let allGalaxies: Galaxy[] = []

function applyFilter(morphologies: Set<MorphologyCategory>, sources: Set<string>) {
  if (!galaxyField) return 0
  const filtered = allGalaxies.filter(g => {
    const preset = g.morphology ? selectPreset(g.morphology) : assignPresetFromPgc(g.pgc)
    const category = presetToCategory(preset)
    return morphologies.has(category) && sources.has(g.source ?? 'CF4')
  })
  galaxyField.rebuild(filtered)
  return filtered.length
}

function getAllGalaxiesCount() {
  return allGalaxies.length
}

const INTRO_DURATION_MS = 10000

/**
 * Animate FOV from CAMERA_FOV_MIN (deep space) back to CAMERA_FOV_DEFAULT (local).
 * Creates a cinematic "reverse scroll" journey from billions of light-years to the present.
 * Zoom is locked for the duration to prevent user input from fighting the animation.
 */
function animateIntroZoom(): Promise<void> {
  return new Promise((resolve) => {
    const startFov = CAMERA_FOV_MIN
    const endFov = CAMERA_FOV_DEFAULT

    setZoomLock(true)
    setFovImmediate(startFov)

    const startTime = performance.now()

    function tick() {
      const elapsed = performance.now() - startTime
      const t = Math.min(1, elapsed / INTRO_DURATION_MS)
      const eased = easeInOutCubic(t)
      const fov = startFov + (endFov - startFov) * eased

      setFovImmediate(fov)

      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        setZoomLock(false)
        resolve()
      }
    }

    requestAnimationFrame(tick)
  })
}

defineExpose({ currentFov, currentMaxRedshift, currentLocation, currentLookAt, setLocation, applyFilter, getAllGalaxiesCount, animateIntroZoom, setZoomLock })

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
let lastParallaxElapsed = 0
let lastHoverPickElapsed = 0
let latestPointerClientX = 0
let latestPointerClientY = 0
let pointerInsideCanvas = false
let hoveredGalaxyPgc: number | null = null
const HOVER_PICK_INTERVAL_SECONDS = 1 / 24

/**
 * Compute frame-rate independent parallax follow strength.
 * Zoomed-in views use a lower response rate so pointer motion stays fluid.
 */
function getParallaxFollowAlpha(deltaSeconds: number, fov: number): number {
  const zoomT = clamp(
    (CAMERA_FOV_DEFAULT - fov) / (CAMERA_FOV_DEFAULT - CAMERA_FOV_MIN),
    0,
    1
  )
  const responseRate = 12 - zoomT * 7
  return 1 - Math.exp(-deltaSeconds * responseRate)
}

/**
 * Perform pointer hit detection against square galaxy sprite bounds.
 * Coordinates are converted from viewport space into canvas-local space.
 */
function pickGalaxyAtClient(clientX: number, clientY: number): Galaxy | null {
  if (!galaxyField || !canvasRef.value) return null

  const rect = canvasRef.value.getBoundingClientRect()
  const localX = clientX - rect.left
  const localY = clientY - rect.top
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

/**
 * Apply the latest hover state without spamming duplicate clear events.
 */
function updateHoveredGalaxy(galaxy: Galaxy | null, clientX: number, clientY: number) {
  if (galaxy) {
    hoveredGalaxyPgc = galaxy.pgc
    canvasRef.value!.style.cursor = 'pointer'
    galaxyField?.setHoveredPgc(galaxy.pgc)
    emit('hover', { galaxy, screenX: clientX, screenY: clientY })
    return
  }

  canvasRef.value!.style.cursor = 'grab'
  galaxyField?.setHoveredPgc(null)
  if (hoveredGalaxyPgc !== null && !isMobile) {
    emit('hover', null)
  }
  hoveredGalaxyPgc = null
}

/**
 * Refresh hover picking on the render loop so pointer motion stays smooth.
 */
function updateHoverPicking(elapsed: number) {
  if (isMobile || !pointerInsideCanvas || !canvasRef.value) return
  if (getIsDragging()) {
    updateHoveredGalaxy(null, latestPointerClientX, latestPointerClientY)
    return
  }
  if (elapsed - lastHoverPickElapsed < HOVER_PICK_INTERVAL_SECONDS) return
  lastHoverPickElapsed = elapsed

  const galaxy = pickGalaxyAtClient(latestPointerClientX, latestPointerClientY)
  updateHoveredGalaxy(galaxy, latestPointerClientX, latestPointerClientY)
}

/**
 * Record pointer motion for smooth parallax and deferred hover picking.
 */
function onPointerMoveHover(e: PointerEvent) {
  pointerInsideCanvas = true
  latestPointerClientX = e.clientX
  latestPointerClientY = e.clientY
  updatePointerParallaxTarget(e.clientX, e.clientY)

  if (pointerIsDown) {
    const dx = e.clientX - pointerDownX
    const dy = e.clientY - pointerDownY
    if (dx * dx + dy * dy > CLICK_CANCEL_DISTANCE_PX * CLICK_CANCEL_DISTANCE_PX) {
      pointerMovedDuringGesture = true
    }
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
  pointerInsideCanvas = false
  pointerIsDown = false
  pointerMovedDuringGesture = false
  pointerParallaxTargetX = 0
  pointerParallaxTargetY = 0
  updateHoveredGalaxy(null, latestPointerClientX, latestPointerClientY)
  if (!isMobile) return
  setSelection(null)
}

/**
 * Track pointer gesture lifecycle to suppress click navigation after drags.
 */
function onPointerDownCapture(e: PointerEvent) {
  pointerInsideCanvas = true
  latestPointerClientX = e.clientX
  latestPointerClientY = e.clientY
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

  const galaxy = pickGalaxyAtClient(e.clientX, e.clientY)
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
    // Use time-based damping so high-zoom parallax stays fluid instead of stepping.
    const deltaSeconds = lastParallaxElapsed > 0
      ? Math.min(0.1, elapsed - lastParallaxElapsed)
      : 1 / 60
    lastParallaxElapsed = elapsed
    const parallaxFollowAlpha = getParallaxFollowAlpha(deltaSeconds, currentFov.value)
    pointerParallaxX += (pointerParallaxTargetX - pointerParallaxX) * parallaxFollowAlpha
    pointerParallaxY += (pointerParallaxTargetY - pointerParallaxY) * parallaxFollowAlpha
    updateHoverPicking(elapsed)
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
  lastParallaxElapsed = 0
  lastHoverPickElapsed = 0
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
