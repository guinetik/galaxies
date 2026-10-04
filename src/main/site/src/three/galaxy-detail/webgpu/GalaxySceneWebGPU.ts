/**
 * WebGPU Galaxy Scene — Main Orchestrator
 *
 * Replaces GalaxyScene.ts when WebGPU is available.
 * Uses WebGPURenderer with TSL compute shaders for 500k+ particle physics.
 * Preserves the same interface: constructor(canvas, galaxy), start(), dispose().
 */

import * as THREE from 'three/webgpu'
import type { Galaxy } from '@/types/galaxy'
import { mapGalaxyToRenderParams } from '../morphology'
import type { GalaxyRenderParams } from '../morphology'
import { loadGalaxyBandProfile } from '../bandProfileClient'
import {
  createGalaxyBuffers,
  createGalaxyUniforms,
  createComputeInit,
  syncGalaxyUniforms,
  type GalaxyBuffers,
  type GalaxyUniforms,
} from './GalaxyComputeInit'
import { createComputeUpdate } from './GalaxyComputeUpdate'
import {
  createComputeForeground,
  createForegroundUniforms,
  type ForegroundUniforms,
} from './GalaxyComputeForeground'
import { GalaxyParticlesWebGPU } from './GalaxyParticlesWebGPU'
import { GalaxyHaze } from '../GalaxyHaze'
import { GalaxyPostProcessing } from './GalaxyPostProcessing'
import { CINEMATIC, getOverviewZoom, getNucleusVisibility } from '../cinematicAppearance'
import { GalaxyBlackHoleWebGPU } from './GalaxyBlackHoleWebGPU'
import { GalaxyBackdropWebGPU } from './GalaxyBackdropWebGPU'
import { GalaxyNeighborsWebGPU } from './GalaxyNeighborsWebGPU'
import { computeNeighborSprites } from '../neighborField'
import { generateGalaxyTextureAtlas } from '../../GalaxyTextures'
import type { IGalaxyScene } from '../IGalaxyScene'
import { getInitialOrbitAngles } from '../initialOrbit'
import { detectQuality, dprCap, rtScale, type Quality } from '../qualityDetect'

// Reusable math objects (avoid per-frame allocations)
const _yAxis = new THREE.Vector3(0, 1, 0)
const _qDrag = new THREE.Quaternion()
const _mvpMatrix = new THREE.Matrix4()
const _camPos = new THREE.Vector3()
const _mouseNDC = new THREE.Vector2()
const _lensingUV = new THREE.Vector2()
const _right = new THREE.Vector3()

// WebGPU particle count — scaled by device quality
// Mobile (Z Fold Adreno 740): 150k is still 3.5× WebGL's desktop max
function particleCount(quality: Quality): number {
  return quality === 'mobile' ? 150_000 : 500_000
}

export class GalaxySceneWebGPU implements IGalaxyScene {
  private renderer!: THREE.WebGPURenderer
  private scene: THREE.Scene
  private bhScene: THREE.Scene
  private fgScene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private canvas: HTMLCanvasElement
  private galaxy: Galaxy
  private params: GalaxyRenderParams

  // GPU compute
  private buffers!: GalaxyBuffers
  private uniforms!: GalaxyUniforms
  private fgUniforms!: ForegroundUniforms
  private computeInit: any
  private computeUpdate: any
  private computeForeground: any
  private initialized = false
  private disposed = false
  private readonly bandAnalysisAbort = new AbortController()

  // Visual layers
  private backdrop: GalaxyBackdropWebGPU
  private particles!: GalaxyParticlesWebGPU
  private haze: GalaxyHaze
  private blackHole!: GalaxyBlackHoleWebGPU
  private postProcessing!: GalaxyPostProcessing
  private neighborsLayer: GalaxyNeighborsWebGPU | null = null
  private neighborAtlas: THREE.Texture | null = null

  // Reusable vector for BH screen projection
  private _bhScreenVec = new THREE.Vector3()

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
  private isPanning = false
  private pivot = new THREE.Vector3()
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

  // Device quality tier
  private quality: Quality

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
  private onMouseDown: (e: MouseEvent) => void
  private onMouseUp: () => void
  private onMouseMove: (e: MouseEvent) => void
  private onContextMenu: (e: Event) => void
  private resizeObserver: ResizeObserver

  constructor(canvas: HTMLCanvasElement, galaxy: Galaxy, neighbors: Galaxy[] = []) {
    this.canvas = canvas
    this.galaxy = galaxy

    // ─── Quality detection ─────────────────────────────────────────────
    this.quality = detectQuality()
    const count = particleCount(this.quality)

    // ─── Scenes ────────────────────────────────────────────────────────
    this.scene = new THREE.Scene()
    this.bhScene = new THREE.Scene()
    this.fgScene = new THREE.Scene()

    // ─── Galaxy data pipeline ──────────────────────────────────────────
    this.params = mapGalaxyToRenderParams(galaxy)
    const R = this.params.galaxyRadius

    // ─── Camera ────────────────────────────────────────────────────────
    this.baseDistance = R * 1.7
    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, this.baseDistance * 20)

    // ─── GPU buffers & uniforms ────────────────────────────────────────
    this.buffers = createGalaxyBuffers(count)
    this.uniforms = createGalaxyUniforms(this.params)

    // ─── Compute shaders ───────────────────────────────────────────────
    this.computeInit = createComputeInit(count, this.buffers, this.uniforms)
    this.computeUpdate = createComputeUpdate(count, this.buffers, this.uniforms)
    this.fgUniforms = createForegroundUniforms()
    this.computeForeground = createComputeForeground(count, this.buffers, this.fgUniforms)

    // ─── Backdrop (procedural sky) ──────────────────────────────────────
    this.backdrop = new GalaxyBackdropWebGPU(this.baseDistance, galaxy.pgc, this.quality)
    this.scene.add(this.backdrop.mesh)

    // ─── Particle renderer ─────────────────────────────────────────────
    this.particles = new GalaxyParticlesWebGPU(count, this.buffers, this.baseDistance, this.params, this.uniforms)
    this.scene.add(this.particles.sprite)
    this.scene.add(this.particles.bodySprite)
    this.haze = new GalaxyHaze(this.params)
    this.scene.add(this.haze.mesh)

    // ─── Black hole (separate scene — composited on top after lensing+bloom)
    this.blackHole = new GalaxyBlackHoleWebGPU(R * 0.08, rtScale(this.quality))
    this.bhScene.add(this.blackHole.depthMesh)
    this.bhScene.add(this.blackHole.mesh)

    // ─── Foreground stars (separate scene — additive on top of BH composite)
    this.fgScene.add(this.particles.foregroundSprite)

    // ─── Neighbor galaxies (distant sprites, additive, behind galaxy) ──
    const neighborSprites = computeNeighborSprites(galaxy, neighbors, this.baseDistance)
    if (neighborSprites.length > 0) {
      this.neighborAtlas = generateGalaxyTextureAtlas()
      this.neighborsLayer = new GalaxyNeighborsWebGPU(
        neighborSprites,
        this.neighborAtlas,
        this.baseDistance,
      )
      this.scene.add(this.neighborsLayer.sprite)
    }

    // ─── Fit the whole galaxy on both wide and narrow viewports ────────
    const initialZoom = getOverviewZoom(aspect)
    this.zoom = initialZoom
    this.targetZoom = initialZoom

    // ─── Initial orbit from PGC seed ───────────────────────────────────
    const { initRotY, initTiltX } = getInitialOrbitAngles(galaxy)
    const qTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), initTiltX)
    const qRot = new THREE.Quaternion().setFromAxisAngle(_yAxis, initRotY)
    // Tilt first, then yaw around world Y so every galaxy starts above the disk.
    this.orbitQuat.multiplyQuaternions(qRot, qTilt)

    // ─── Input bindings ────────────────────────────────────────────────

    this.onPointerDown = (e: PointerEvent) => {
      if (this.isPinching) return
      // Right button pans; any other button orbits.
      if (e.button === 2) {
        this.isPanning = true
        this.isDragging = false
      } else {
        this.isDragging = true
      }
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.velocityX = 0
      this.velocityY = 0
    }

    this.onPointerMove = (e: PointerEvent) => {
      if (this.isPinching) return
      if (this.isPanning) {
        this.applyPan(e.clientX - this.lastX, e.clientY - this.lastY)
        this.lastX = e.clientX
        this.lastY = e.clientY
        return
      }
      if (!this.isDragging) return
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
      this.isPanning = false
    }

    this.onPointerCancel = () => {
      this.isDragging = false
      this.isPinching = false
      this.isPanning = false
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
    this.onMouseDown = (e: MouseEvent) => { if (e.button !== 2) this.mousePressed = true }
    this.onMouseUp = () => { this.mousePressed = false }
    this.onMouseMove = (e: MouseEvent) => {
      _mouseNDC.set(
        (e.clientX / canvas.clientWidth) * 2 - 1,
        -(e.clientY / canvas.clientHeight) * 2 + 1,
      )
      this.raycaster.setFromCamera(_mouseNDC, this.camera)
      this.raycaster.ray.intersectPlane(this.intersectionPlane, this.mouse3D)
    }

    // Suppress the browser context menu so right-drag can pan.
    this.onContextMenu = (e: Event) => e.preventDefault()

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
    canvas.addEventListener('contextmenu', this.onContextMenu)

    // ─── Resize handling ───────────────────────────────────────────────
    this.resizeObserver = new ResizeObserver(() => {
      const rw = canvas.clientWidth
      const rh = canvas.clientHeight
      if (rw === 0 || rh === 0 || !this.renderer) return
      this.renderer.setSize(rw, rh, false)
      this.renderer.getSize(this.rendererSize)
      const framingScale = getOverviewZoom(rw / rh) / getOverviewZoom(this.camera.aspect)
      this.zoom *= framingScale
      this.targetZoom *= framingScale
      this.camera.aspect = rw / rh
      this.camera.updateProjectionMatrix()
    })
    this.resizeObserver.observe(canvas)
  }

  // ─── Quaternion orbit helpers ──────────────────────────────────────────

  /** Right-drag pan: shift the look-at pivot in the camera's screen plane. */
  private applyPan(dxPix: number, dyPix: number): void {
    const distance = this.baseDistance / this.zoom
    const fov = (this.camera.fov * Math.PI) / 180
    const worldPerPx =
      (2 * distance * Math.tan(fov / 2)) / Math.max(this.canvas.clientHeight, 1)
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.orbitQuat)
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.orbitQuat)
    this.pivot.addScaledVector(right, -dxPix * worldPerPx)
    this.pivot.addScaledVector(up, dyPix * worldPerPx)
    const maxPan = this.baseDistance * 8
    if (this.pivot.length() > maxPan) this.pivot.setLength(maxPan)
  }

  private applyOrbitDelta(dx: number, dy: number): void {
    _qDrag.setFromAxisAngle(_yAxis, -dx)
    this.orbitQuat.premultiply(_qDrag)

    _right.set(1, 0, 0).applyQuaternion(this.orbitQuat)
    _qDrag.setFromAxisAngle(_right, -dy)
    this.orbitQuat.premultiply(_qDrag)

    this.orbitQuat.normalize()
  }

  // ─── Start (async — WebGPU renderer requires init) ─────────────────────

  async start(): Promise<void> {
    const bandProfilePromise = loadGalaxyBandProfile(this.galaxy.pgc, this.bandAnalysisAbort.signal)

    // Create and initialize WebGPU renderer
    this.renderer = new THREE.WebGPURenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap(this.quality)))
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false)
    this.dpr = this.renderer.getPixelRatio()
    this.renderer.getSize(this.rendererSize)

    await this.renderer.init()
    if (this.disposed) return

    // ─── Post-processing (bloom + lensing + BH composite + fg stars) ─
    const postFxScale = rtScale(this.quality)
    this.postProcessing = new GalaxyPostProcessing(
      this.renderer, this.scene, this.bhScene, this.fgScene, this.camera, postFxScale,
    )

    // ─── Run init compute (once) ────────────────────────────────────
    await this.renderer.computeAsync(this.computeInit)
    if (this.disposed) return
    this.initialized = true

    // ─── Start animation loop ───────────────────────────────────────
    this.lastFrameTime = performance.now()
    this.animate()

    // Apply band-guided reinitialization opportunistically without blocking the
    // initial procedural render path.
    void bandProfilePromise.then(async (bandProfile) => {
      if (!bandProfile || this.disposed || !this.initialized) {
        return
      }

      try {
        this.params = mapGalaxyToRenderParams(this.galaxy, bandProfile)
        syncGalaxyUniforms(this.uniforms, this.params)

        if (this.disposed) {
          return
        }
        await this.renderer.computeAsync(this.computeInit)

        if (this.disposed) {
          return
        }
        this.particles.updateAppearance(this.params)
        this.haze.updateAppearance(this.params)
      } catch (error) {
        if (!this.disposed) {
          console.warn('Band-guided WebGPU upgrade failed; keeping procedural render:', error)
        }
      }
    })
  }

  // ─── Animation loop ───────────────────────────────────────────────────

  private animate = () => {
    if (this.disposed) return
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
    _camPos.set(0, 0, distance).applyQuaternion(this.orbitQuat).add(this.pivot)
    this.camera.position.copy(_camPos)
    this.camera.lookAt(this.pivot)
    this.camera.updateMatrixWorld(true)
    const nucleusVisible = getNucleusVisibility(this.camera.position.length(), this.params.galaxyRadius) > 0
    this.particles.updateVisibility(this.camera.position.length(), this.params.galaxyRadius, nucleusVisible)

    // ─── Galaxy rotation (data-driven differential rotation) ────────
    // omega0 from params; curve handled per-star in compute shader.
    // Ellipticals/irregulars now rotate via their reduced omega0 from params.
    const rotSpeed = this.params.rotationOmega0 * CINEMATIC.motionScale
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
      this.particles.advance(dt)
      this.renderer.compute(this.computeUpdate)

      // ─── Foreground detection compute ─────────────────────────────
      const vm = this.camera.matrixWorldInverse.elements
      _mvpMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
      const mvp = _mvpMatrix.elements
      // Pass MVP matrix rows (for NDC projection)
      this.fgUniforms.mvpRow0.value.set(mvp[0], mvp[4], mvp[8], mvp[12])
      this.fgUniforms.mvpRow1.value.set(mvp[1], mvp[5], mvp[9], mvp[13])
      this.fgUniforms.mvpRow3.value.set(mvp[3], mvp[7], mvp[11], mvp[15])
      // Pass view matrix Z-row (for view-space depth)
      this.fgUniforms.viewZRow.value.set(vm[2], vm[6], vm[10], vm[14])
      // BH at origin → view-space Z is just the translation component
      this.fgUniforms.bhViewZ.value = vm[14]

      // BH NDC position (already computed for lensing below, but compute here too)
      const bhNdc = this._bhScreenVec.set(0, 0, 0).project(this.camera)
      this.fgUniforms.bhNdcX.value = bhNdc.x
      this.fgUniforms.bhNdcY.value = bhNdc.y

      // Edge-on adaptive thresholds (matching WebGL GalaxyParticles.update logic)
      const cp = this.camera.position
      const cameraDistance = cp.length()
      const edgeOnFactor = 1.0 - Math.abs(cp.y) / Math.max(cameraDistance, 0.0001)
      const edgeOnMix = THREE.MathUtils.smoothstep(edgeOnFactor, 0.55, 0.95)
      this.fgUniforms.depthThreshold.value = THREE.MathUtils.lerp(
        Math.max(this.baseDistance * 0.03, 6.0),
        Math.max(this.baseDistance * 0.004, 0.75),
        edgeOnMix,
      )
      this.fgUniforms.depthSoftness.value = THREE.MathUtils.lerp(
        Math.max(this.baseDistance * 0.06, 10.0),
        Math.max(this.baseDistance * 0.018, 3.0),
        edgeOnMix,
      )

      // BH screen footprint for overlap detection
      const bhQuadSize = this.params.galaxyRadius * 0.08
      const fov = (this.camera.fov * Math.PI) / 180
      const screenH = this.rendererSize.y * this.dpr
      const tanHalfFov = Math.tan(fov / 2)
      const bhRadiusPx = (bhQuadSize / cameraDistance) * (screenH / (2 * tanHalfFov))

      // Screen-space star sizing
      this.particles.updateSizeUniforms(screenH, tanHalfFov)
      this.neighborsLayer?.updateSizeUniforms(screenH, tanHalfFov)
      const overlapScale = THREE.MathUtils.lerp(0.75, 1.2, edgeOnMix)
      const vpW = this.canvas.clientWidth
      const vpH = this.canvas.clientHeight
      this.fgUniforms.ndcRadiusX.value = Math.max((bhRadiusPx * overlapScale) / Math.max(vpW * 0.5, 1), 0.04)
      this.fgUniforms.ndcRadiusY.value = Math.max((bhRadiusPx * overlapScale) / Math.max(vpH * 0.5, 1), 0.04)

      if (nucleusVisible) this.renderer.compute(this.computeForeground)
    }

    // ─── Backdrop update ─────────────────────────────────────────────
    this.backdrop.update(time, this.camera)
    this.haze.update(this.camera)

    // ─── Black hole update ────────────────────────────────────────────
    const cp = this.camera.position
    const hDist = Math.sqrt(cp.x * cp.x + cp.z * cp.z)
    const tiltX = Math.atan2(cp.y, hDist)
    const rotY = Math.atan2(cp.x, cp.z)
    this.blackHole.update(time, tiltX, rotY, this.camera, this.rendererSize, this.dpr)

    // ─── Lensing ──────────────────────────────────────────────────────
    this._bhScreenVec.set(0, 0, 0).project(this.camera)
    const lod = this.blackHole.getLOD()
    const lensStrength = lod * lod * 0.03
    _lensingUV.set(
      this._bhScreenVec.x * 0.5 + 0.5,
      // TSL screenUV is top-left origin (y-down); projected NDC is y-up.
      // Flip Y so the lens tracks the BH vertically when panned off-center.
      0.5 - this._bhScreenVec.y * 0.5,
    )
    this.postProcessing.updateLensing(_lensingUV, lensStrength, this.camera.aspect)

    // ─── Render ──────────────────────────────────────────────────────
    this.postProcessing.render()
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.bandAnalysisAbort.abort()
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
    canvas.removeEventListener('contextmenu', this.onContextMenu)
    this.resizeObserver.disconnect()

    this.backdrop.dispose()
    this.particles.dispose()
    this.haze.dispose()
    this.blackHole.dispose()
    this.postProcessing?.dispose()
    this.neighborsLayer?.dispose()
    this.neighborAtlas?.dispose()
    this.renderer?.dispose()
  }
}
