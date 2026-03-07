/**
 * WebGPU Galaxy Scene — Main Orchestrator
 *
 * Replaces GalaxyScene.ts when WebGPU is available.
 * Uses WebGPURenderer with TSL compute shaders for 500k+ particle physics.
 * Preserves the same interface: constructor(canvas, galaxy), start(), dispose().
 */

import * as THREE from 'three/webgpu'
import type { Galaxy } from '@/types/galaxy'
import { galaxyToGeneratorParams } from '../GalaxyParamsMapper'
import type { GeneratorParams } from '../GalaxyParamsMapper'
import {
  createGalaxyBuffers,
  createGalaxyUniforms,
  createComputeInit,
  type GalaxyBuffers,
  type GalaxyUniforms,
} from './GalaxyComputeInit'
import { createComputeUpdate } from './GalaxyComputeUpdate'
import { GalaxyParticlesWebGPU } from './GalaxyParticlesWebGPU'
import { GalaxyPostProcessing } from './GalaxyPostProcessing'
import { GalaxyClouds } from './GalaxyClouds'
import type { IGalaxyScene } from '../IGalaxyScene'

// Reusable math objects (avoid per-frame allocations)
const _yAxis = new THREE.Vector3(0, 1, 0)
const _qDrag = new THREE.Quaternion()

// WebGPU particle count — much higher than WebGL's 42k-120k
const PARTICLE_COUNT = 500000

export class GalaxySceneWebGPU implements IGalaxyScene {
  private renderer!: THREE.WebGPURenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private canvas: HTMLCanvasElement
  private params: GeneratorParams

  // GPU compute
  private buffers!: GalaxyBuffers
  private uniforms!: GalaxyUniforms
  private computeInit: any
  private computeUpdate: any
  private initialized = false

  // Visual layers
  private particles!: GalaxyParticlesWebGPU
  private clouds: GalaxyClouds
  private postProcessing!: GalaxyPostProcessing

  // Animation
  private animationId = 0
  private lastFrameTime = 0
  private galaxyRotation = 0

  // Quaternion-based orbit camera
  private orbitQuat = new THREE.Quaternion()
  private zoom = 4
  private targetZoom = 4
  private isDragging = false
  private isPinching = false
  private lastX = 0
  private lastY = 0
  private velocityX = 0
  private velocityY = 0
  private baseDistance: number
  private lastPinchDist = 0

  // Mouse interaction for particle repulsion
  private mouse3D = new THREE.Vector3(0, 0, 0)
  private raycaster = new THREE.Raycaster()
  private intersectionPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  private mousePressed = false

  // Renderer size cache
  private rendererSize = new THREE.Vector2()
  private dpr = 1

  // Bound event handlers
  private onPointerDown: (e: PointerEvent) => void
  private onPointerMove: (e: PointerEvent) => void
  private onPointerUp: () => void
  private onPointerCancel: () => void
  private onWheel: (e: WheelEvent) => void
  private onTouchStart: (e: TouchEvent) => void
  private onTouchMove: (e: TouchEvent) => void
  private onTouchEnd: () => void
  private onMouseDown: () => void
  private onMouseUp: () => void
  private onMouseMove: (e: MouseEvent) => void
  private resizeObserver: ResizeObserver

  constructor(canvas: HTMLCanvasElement, galaxy: Galaxy) {
    this.canvas = canvas

    // ─── Scene ─────────────────────────────────────────────────────────
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)

    // ─── Galaxy data pipeline ──────────────────────────────────────────
    this.params = galaxyToGeneratorParams(galaxy)
    const R = this.params.galaxyRadius

    // ─── Camera ────────────────────────────────────────────────────────
    this.baseDistance = R * 1.7
    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, this.baseDistance * 20)

    // ─── GPU buffers & uniforms ────────────────────────────────────────
    this.buffers = createGalaxyBuffers(PARTICLE_COUNT)
    this.uniforms = createGalaxyUniforms(this.params)

    // ─── Compute shaders ───────────────────────────────────────────────
    this.computeInit = createComputeInit(PARTICLE_COUNT, this.buffers, this.uniforms)
    this.computeUpdate = createComputeUpdate(PARTICLE_COUNT, this.buffers, this.uniforms)

    // ─── Particle renderer ─────────────────────────────────────────────
    this.particles = new GalaxyParticlesWebGPU(PARTICLE_COUNT, this.buffers, this.baseDistance)
    this.scene.add(this.particles.sprite)

    // ─── Dust clouds ─────────────────────────────────────────────────
    this.clouds = new GalaxyClouds(this.uniforms, this.baseDistance)
    this.scene.add(this.clouds.sprite)

    // ─── Mobile: start more zoomed out ─────────────────────────────────
    const isNarrowViewport = typeof window !== 'undefined' && window.innerWidth < 768
    const initialZoom = isNarrowViewport ? 2 : 4
    this.zoom = initialZoom
    this.targetZoom = initialZoom

    // ─── Initial orbit from PGC seed ───────────────────────────────────
    const initRotY = ((galaxy.pgc * 2654435761 >>> 0) / 4294967296) * Math.PI * 2
    const initTiltX = -0.45
    const qTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), initTiltX)
    const qRot = new THREE.Quaternion().setFromAxisAngle(_yAxis, initRotY)
    this.orbitQuat.multiplyQuaternions(qTilt, qRot)

    // ─── Input bindings ────────────────────────────────────────────────

    this.onPointerDown = (e: PointerEvent) => {
      if (this.isPinching) return
      this.isDragging = true
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.velocityX = 0
      this.velocityY = 0
    }

    this.onPointerMove = (e: PointerEvent) => {
      if (this.isPinching || !this.isDragging) return
      const dx = e.clientX - this.lastX
      const dy = e.clientY - this.lastY
      this.velocityX = dx * 0.005
      this.velocityY = dy * 0.005
      this.applyOrbitDelta(this.velocityX, this.velocityY)
      this.lastX = e.clientX
      this.lastY = e.clientY
    }

    this.onPointerUp = () => {
      this.isDragging = false
    }

    this.onPointerCancel = () => {
      this.isDragging = false
      this.isPinching = false
    }

    this.onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoomDelta = this.targetZoom * 0.12
      this.targetZoom += e.deltaY > 0 ? -zoomDelta : zoomDelta
      this.targetZoom = Math.max(0.1, Math.min(20, this.targetZoom))
    }

    this.onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        this.isPinching = true
        this.isDragging = false
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        this.lastPinchDist = Math.sqrt(dx * dx + dy * dy)
      }
    }

    this.onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const zoomDelta = (dist - this.lastPinchDist) * 0.01
        this.lastPinchDist = dist
        this.targetZoom = Math.max(0.1, Math.min(20, this.targetZoom + zoomDelta))
      }
    }

    this.onTouchEnd = () => {
      if (this.lastPinchDist > 0) this.lastPinchDist = 0
      this.isPinching = false
    }

    // Mouse interaction for particle repulsion
    this.onMouseDown = () => { this.mousePressed = true }
    this.onMouseUp = () => { this.mousePressed = false }
    this.onMouseMove = (e: MouseEvent) => {
      const mouse = new THREE.Vector2(
        (e.clientX / canvas.clientWidth) * 2 - 1,
        -(e.clientY / canvas.clientHeight) * 2 + 1,
      )
      this.raycaster.setFromCamera(mouse, this.camera)
      this.raycaster.ray.intersectPlane(this.intersectionPlane, this.mouse3D)
    }

    canvas.addEventListener('pointerdown', this.onPointerDown)
    canvas.addEventListener('pointermove', this.onPointerMove)
    canvas.addEventListener('pointerup', this.onPointerUp)
    canvas.addEventListener('pointercancel', this.onPointerCancel)
    canvas.addEventListener('pointerleave', this.onPointerUp)
    canvas.addEventListener('wheel', this.onWheel, { passive: false })
    canvas.addEventListener('touchstart', this.onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', this.onTouchMove, { passive: false })
    canvas.addEventListener('touchend', this.onTouchEnd)
    canvas.addEventListener('mousedown', this.onMouseDown)
    canvas.addEventListener('mouseup', this.onMouseUp)
    canvas.addEventListener('mousemove', this.onMouseMove)

    // ─── Resize handling ───────────────────────────────────────────────
    this.resizeObserver = new ResizeObserver(() => {
      const rw = canvas.clientWidth
      const rh = canvas.clientHeight
      if (rw === 0 || rh === 0) return
      this.renderer.setSize(rw, rh, false)
      this.camera.aspect = rw / rh
      this.camera.updateProjectionMatrix()
    })
    this.resizeObserver.observe(canvas)
  }

  // ─── Quaternion orbit helpers ──────────────────────────────────────────

  private applyOrbitDelta(dx: number, dy: number): void {
    _qDrag.setFromAxisAngle(_yAxis, -dx)
    this.orbitQuat.premultiply(_qDrag)

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.orbitQuat)
    _qDrag.setFromAxisAngle(right, -dy)
    this.orbitQuat.premultiply(_qDrag)

    this.orbitQuat.normalize()
  }

  // ─── Start (async — WebGPU renderer requires init) ─────────────────────

  async start(): Promise<void> {
    // Create and initialize WebGPU renderer
    this.renderer = new THREE.WebGPURenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false)
    this.dpr = this.renderer.getPixelRatio()
    this.renderer.getSize(this.rendererSize)

    await this.renderer.init()

    // ─── Post-processing (bloom) ────────────────────────────────────
    this.postProcessing = new GalaxyPostProcessing(this.renderer, this.scene, this.camera)

    // ─── Run init compute (once) ────────────────────────────────────
    await this.renderer.computeAsync(this.computeInit)
    await this.renderer.computeAsync(this.clouds.computeInit)
    this.initialized = true

    // ─── Start animation loop ───────────────────────────────────────
    this.lastFrameTime = performance.now()
    this.animate()
  }

  // ─── Animation loop ───────────────────────────────────────────────────

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate)

    const currentTime = performance.now()
    const dt = Math.min((currentTime - this.lastFrameTime) / 1000, 0.033)
    this.lastFrameTime = currentTime

    // ─── Inertia / friction ──────────────────────────────────────────
    if (!this.isDragging) {
      if (Math.abs(this.velocityX) > 0.0001 || Math.abs(this.velocityY) > 0.0001) {
        this.applyOrbitDelta(this.velocityX, this.velocityY)
        this.velocityX *= 0.92
        this.velocityY *= 0.92
      }
    }

    // ─── Zoom lerp ───────────────────────────────────────────────────
    this.zoom += (this.targetZoom - this.zoom) * 0.08

    // ─── Camera orbit position ───────────────────────────────────────
    const distance = this.baseDistance / this.zoom
    const camPos = new THREE.Vector3(0, 0, distance).applyQuaternion(this.orbitQuat)
    this.camera.position.copy(camPos)
    this.camera.lookAt(0, 0, 0)
    this.camera.updateMatrixWorld(true)

    // ─── Galaxy rotation (faster as we zoom in) ─────────────────────
    const zoomNorm = Math.min(this.zoom / 20, 1)
    const rotSpeed = 0.02 + 0.18 * zoomNorm * zoomNorm
    this.galaxyRotation += dt * rotSpeed
    const time = this.uniforms.time.value + dt

    // ─── Update compute uniforms ─────────────────────────────────────
    this.uniforms.time.value = time
    this.uniforms.deltaTime.value = dt
    this.uniforms.rotationSpeed.value = rotSpeed
    this.uniforms.mouse.value.copy(this.mouse3D)
    this.uniforms.mouseActive.value = this.mousePressed ? 1.0 : 0.0

    // ─── Run physics compute (non-blocking for better frame pacing) ──
    if (this.initialized) {
      this.renderer.compute(this.computeUpdate)
      this.renderer.compute(this.clouds.computeUpdate)
    }

    // ─── Render ──────────────────────────────────────────────────────
    this.postProcessing.render()
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────

  dispose(): void {
    cancelAnimationFrame(this.animationId)

    const canvas = this.canvas
    canvas.removeEventListener('pointerdown', this.onPointerDown)
    canvas.removeEventListener('pointermove', this.onPointerMove)
    canvas.removeEventListener('pointerup', this.onPointerUp)
    canvas.removeEventListener('pointercancel', this.onPointerCancel)
    canvas.removeEventListener('pointerleave', this.onPointerUp)
    canvas.removeEventListener('wheel', this.onWheel)
    canvas.removeEventListener('touchstart', this.onTouchStart)
    canvas.removeEventListener('touchmove', this.onTouchMove)
    canvas.removeEventListener('touchend', this.onTouchEnd)
    canvas.removeEventListener('mousedown', this.onMouseDown)
    canvas.removeEventListener('mouseup', this.onMouseUp)
    canvas.removeEventListener('mousemove', this.onMouseMove)
    this.resizeObserver.disconnect()

    this.particles.dispose()
    this.clouds.dispose()
    this.postProcessing.dispose()
    this.renderer.dispose()
  }
}
