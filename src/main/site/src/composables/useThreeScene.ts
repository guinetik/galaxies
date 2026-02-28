import { ref } from 'vue'
import * as THREE from 'three'
import {
  CAMERA_FOV_DEFAULT,
  CAMERA_FOV_MIN,
  CAMERA_FOV_MAX,
  CAMERA_NEAR,
  CAMERA_FAR,
  CAMERA_POSITION,
  LOCATIONS,
  DEFAULT_LOCATION,
} from '@/three/constants'
import { fovToMaxRedshift } from '@/three/celestialMath'

export function useThreeScene() {
  const currentFov = ref(CAMERA_FOV_DEFAULT)
  const currentMaxRedshift = ref(fovToMaxRedshift(CAMERA_FOV_DEFAULT))
  const currentLocation = ref(DEFAULT_LOCATION)

  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let animationId = 0
  let canvas: HTMLCanvasElement | null = null

  // Pivot group — everything (galaxies, earth, stars) goes in here.
  // We rotate this group around X to simulate observer latitude.
  let pivot: THREE.Group | null = null

  // Spherical look direction
  let theta = Math.PI // azimuth (looking south)
  let phi = 1.68      // start angled down enough for Earth arc visibility

  // Drag state
  let isDragging = false
  let lastX = 0
  let lastY = 0
  const DRAG_SENSITIVITY = 0.003

  // Drag momentum / inertia
  let velocityTheta = 0
  let velocityPhi = 0
  const DRAG_FRICTION = 0.92
  const DRAG_FRICTION_ZOOMED = 0.76
  const VELOCITY_THRESHOLD = 0.00001
  const DRAG_SENSITIVITY_MIN_SCALE = 0.08
  const DRAG_SENSITIVITY_POWER = 0.85
  const DRAG_VELOCITY_CAP = 0.03

  // Smooth zoom — target FOV that we lerp toward each frame
  let targetFov = CAMERA_FOV_DEFAULT
  const ZOOM_LERP = 0.08

  // Location animation — smooth scene rotation
  let currentSceneRotationX = 0
  let targetSceneRotationX = 0
  let targetSceneRotationY = 0
  let currentSceneRotationY = 0
  const LOCATION_LERP = 0.04

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
    pivot = new THREE.Group()
    scene.add(pivot)

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

  /** Returns the pivot group — add all scene objects here instead of scene directly */
  function getPivot(): THREE.Group {
    return pivot!
  }

  function updateCameraLookAt() {
    if (!camera) return
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

  /**
   * Compute drag scaling for the current FOV.
   * Uses tangent-space scaling so narrow FOV pans much less per pixel.
   */
  function getPanSensitivityScale(fov: number): number {
    const fovRad = fov * Math.PI / 180
    const defaultRad = CAMERA_FOV_DEFAULT * Math.PI / 180
    const tanRatio = Math.tan(fovRad * 0.5) / Math.tan(defaultRad * 0.5)
    const scaled = Math.pow(Math.max(0, tanRatio), DRAG_SENSITIVITY_POWER)
    return Math.max(DRAG_SENSITIVITY_MIN_SCALE, scaled)
  }

  /**
   * Increase damping when zoomed in to avoid "slippery telescope" momentum.
   */
  function getDragFriction(fov: number): number {
    const t = Math.max(0, Math.min(1, (fov - CAMERA_FOV_MIN) / (CAMERA_FOV_DEFAULT - CAMERA_FOV_MIN)))
    return DRAG_FRICTION_ZOOMED + (DRAG_FRICTION - DRAG_FRICTION_ZOOMED) * t
  }

  /** Called each frame to apply drag momentum when not dragging */
  function updateDragMomentum() {
    if (isDragging) return
    if (Math.abs(velocityTheta) < VELOCITY_THRESHOLD && Math.abs(velocityPhi) < VELOCITY_THRESHOLD) return
    const currentFovValue = camera?.fov ?? CAMERA_FOV_DEFAULT
    const friction = getDragFriction(currentFovValue)

    theta += velocityTheta
    phi += velocityPhi
    phi = Math.max(0.1, Math.min(Math.PI / 2 + 0.3, phi))

    velocityTheta *= friction
    velocityPhi *= friction

    updateCameraLookAt()
  }

  function setLocation(name: string) {
    const loc = LOCATIONS[name]
    if (!loc) return
    currentLocation.value = name

    // Rotate scene around X based on latitude:
    // North Pole (90°) → 0 rotation (default view, northern sky overhead)
    // Equator (0°) → 90° rotation
    // South Pole (-90°) → 180° rotation (southern sky overhead)
    targetSceneRotationX = (90 - loc.latitude) / 180 * Math.PI

    // Rotate around Y based on longitude
    targetSceneRotationY = (-loc.longitude / 180) * Math.PI
  }

  /** Called each frame to smoothly rotate the scene pivot */
  function updateSceneRotation() {
    if (!pivot) return

    const dX = targetSceneRotationX - currentSceneRotationX
    const dY = targetSceneRotationY - currentSceneRotationY

    if (Math.abs(dX) < 0.0005 && Math.abs(dY) < 0.0005) {
      currentSceneRotationX = targetSceneRotationX
      currentSceneRotationY = targetSceneRotationY
    } else {
      currentSceneRotationX += dX * LOCATION_LERP
      currentSceneRotationY += dY * LOCATION_LERP
    }

    pivot.rotation.x = currentSceneRotationX
    pivot.rotation.y = currentSceneRotationY
  }

  /** Called each frame to smoothly interpolate FOV toward target */
  function updateFov() {
    if (!camera) return
    const diff = targetFov - camera.fov
    if (Math.abs(diff) < 0.01) return
    camera.fov += diff * ZOOM_LERP
    camera.updateProjectionMatrix()
    currentFov.value = camera.fov
    currentMaxRedshift.value = fovToMaxRedshift(camera.fov)
  }

  function onPointerDown(e: PointerEvent) {
    isDragging = true
    lastX = e.clientX
    lastY = e.clientY
    // Prevent old momentum from fighting a new drag gesture.
    velocityTheta = 0
    velocityPhi = 0
    canvas!.style.cursor = 'grabbing'
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY

    // Narrow FOV needs nonlinear damping for precise telescope-like panning.
    const currentFovValue = camera?.fov ?? CAMERA_FOV_DEFAULT
    const sensitivity = DRAG_SENSITIVITY * getPanSensitivityScale(currentFovValue)
    const nextTheta = Math.max(-DRAG_VELOCITY_CAP, Math.min(DRAG_VELOCITY_CAP, -dx * sensitivity))
    const nextPhi = Math.max(-DRAG_VELOCITY_CAP, Math.min(DRAG_VELOCITY_CAP, -dy * sensitivity))

    // Light smoothing prevents micro-jitter from pointer noise.
    velocityTheta = velocityTheta * 0.3 + nextTheta * 0.7
    velocityPhi = velocityPhi * 0.3 + nextPhi * 0.7

    theta += velocityTheta
    phi += velocityPhi
    phi = Math.max(0.1, Math.min(Math.PI / 2 + 0.3, phi))

    updateCameraLookAt()
  }

  function onPointerUp() {
    isDragging = false
    if (canvas) canvas.style.cursor = 'grab'
    // velocityTheta/Phi carry over for momentum
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    // Set target FOV — actual FOV lerps toward it each frame
    const delta = e.deltaY * 0.05
    targetFov = Math.max(CAMERA_FOV_MIN, Math.min(CAMERA_FOV_MAX, targetFov + delta))
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
    if (e.touches.length === 2) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const delta = (lastPinchDist - dist) * 0.1
      lastPinchDist = dist
      targetFov = Math.max(CAMERA_FOV_MIN, Math.min(CAMERA_FOV_MAX, targetFov + delta))
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

  function getCamera(): THREE.PerspectiveCamera {
    return camera!
  }

  function getIsDragging(): boolean {
    return isDragging
  }

  function startLoop(callback: (elapsed: number) => void) {
    const clock = new THREE.Clock()
    function animate() {
      animationId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      updateDragMomentum()
      updateSceneRotation()
      updateFov()
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
    currentLocation,
    init,
    getScene,
    getCamera,
    getIsDragging,
    getPivot,
    startLoop,
    setLocation,
    dispose,
  }
}
