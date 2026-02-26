import { ref } from 'vue'
import * as THREE from 'three'
import {
  CAMERA_FOV_DEFAULT,
  CAMERA_FOV_MIN,
  CAMERA_FOV_MAX,
  CAMERA_NEAR,
  CAMERA_FAR,
  CAMERA_POSITION,
} from '@/three/constants'
import { fovToMaxRedshift } from '@/three/celestialMath'

export function useThreeScene() {
  const currentFov = ref(CAMERA_FOV_DEFAULT)
  const currentMaxRedshift = ref(fovToMaxRedshift(CAMERA_FOV_DEFAULT))

  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let animationId = 0
  let canvas: HTMLCanvasElement | null = null

  // Spherical look direction
  let theta = Math.PI // azimuth (looking south)
  let phi = 0.3       // elevation (slightly above horizon)

  // Drag state
  let isDragging = false
  let lastX = 0
  let lastY = 0
  const DRAG_SENSITIVITY = 0.003

  function init(canvasEl: HTMLCanvasElement) {
    canvas = canvasEl

    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: false,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
      CAMERA_FOV_DEFAULT,
      window.innerWidth / window.innerHeight,
      CAMERA_NEAR,
      CAMERA_FAR
    )
    camera.position.set(...CAMERA_POSITION)
    updateCameraLookAt()

    // Event listeners
    canvasEl.addEventListener('pointerdown', onPointerDown)
    canvasEl.addEventListener('pointermove', onPointerMove)
    canvasEl.addEventListener('pointerup', onPointerUp)
    canvasEl.addEventListener('pointerleave', onPointerUp)
    canvasEl.addEventListener('wheel', onWheel, { passive: false })
    canvasEl.addEventListener('touchstart', onTouchStart, { passive: false })
    canvasEl.addEventListener('touchmove', onTouchMove, { passive: false })
    canvasEl.addEventListener('touchend', onTouchEnd)
    window.addEventListener('resize', onResize)
  }

  function updateCameraLookAt() {
    if (!camera) return
    // Convert spherical to cartesian look direction
    const lookX = Math.sin(phi) * Math.sin(theta)
    const lookY = Math.cos(phi)
    const lookZ = Math.sin(phi) * Math.cos(theta)

    const target = new THREE.Vector3(
      camera.position.x + lookX * 100,
      camera.position.y + lookY * 100,
      camera.position.z + lookZ * 100
    )
    camera.lookAt(target)
  }

  function onPointerDown(e: PointerEvent) {
    isDragging = true
    lastX = e.clientX
    lastY = e.clientY
    canvas!.style.cursor = 'grabbing'
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY

    theta -= dx * DRAG_SENSITIVITY
    phi -= dy * DRAG_SENSITIVITY

    // Clamp phi: 0.1 (near zenith) to PI/2 + 0.3 (below horizon)
    phi = Math.max(0.1, Math.min(Math.PI / 2 + 0.3, phi))

    updateCameraLookAt()
  }

  function onPointerUp() {
    isDragging = false
    if (canvas) canvas.style.cursor = 'grab'
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    if (!camera) return

    // Scroll up = zoom in = decrease FOV
    const delta = e.deltaY * 0.05
    const newFov = Math.max(CAMERA_FOV_MIN, Math.min(CAMERA_FOV_MAX, camera.fov + delta))
    camera.fov = newFov
    camera.updateProjectionMatrix()

    currentFov.value = newFov
    currentMaxRedshift.value = fovToMaxRedshift(newFov)
  }

  // Pinch zoom state
  let lastPinchDist = 0

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastPinchDist = Math.sqrt(dx * dx + dy * dy)
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length === 2 && camera) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const delta = (lastPinchDist - dist) * 0.1
      lastPinchDist = dist

      const newFov = Math.max(CAMERA_FOV_MIN, Math.min(CAMERA_FOV_MAX, camera.fov + delta))
      camera.fov = newFov
      camera.updateProjectionMatrix()

      currentFov.value = newFov
      currentMaxRedshift.value = fovToMaxRedshift(newFov)
    }
  }

  function onTouchEnd() {
    lastPinchDist = 0
  }

  function onResize() {
    if (!renderer || !camera) return
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function getScene(): THREE.Scene {
    return scene!
  }

  function startLoop(callback: (elapsed: number) => void) {
    const clock = new THREE.Clock()
    function animate() {
      animationId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      callback(elapsed)
      renderer!.render(scene!, camera!)
    }
    animate()
  }

  function dispose() {
    cancelAnimationFrame(animationId)
    if (canvas) {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
    window.removeEventListener('resize', onResize)
    renderer?.dispose()
  }

  return {
    currentFov,
    currentMaxRedshift,
    init,
    getScene,
    startLoop,
    dispose,
  }
}
