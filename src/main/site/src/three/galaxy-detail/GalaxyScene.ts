import * as THREE from 'three'
import type { Galaxy } from '@/types/galaxy'
import { galaxyToGeneratorParams } from './GalaxyParamsMapper'
import type { GeneratorParams } from './GalaxyParamsMapper'
import { generateGalaxy } from './GalaxyGenerator'
import { GalaxyParticles } from './GalaxyParticles'
import { GalaxyHaze } from './GalaxyHaze'
import { GalaxyNebula } from './GalaxyNebula'
import { GalaxyBlackHole } from './GalaxyBlackHole'

// ─── Reusable math objects (avoid per-frame allocations) ─────────────────────

const _yAxis = new THREE.Vector3(0, 1, 0)
const _qDrag = new THREE.Quaternion()

// ─── GalaxyScene ────────────────────────────────────────────────────────────

export class GalaxyScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private particles: GalaxyParticles
  private haze: GalaxyHaze
  private nebula: GalaxyNebula
  private blackHole: GalaxyBlackHole
  private animationId = 0
  private clock = new THREE.Clock()
  private galaxyRotation = 0
  private params: GeneratorParams

  // Quaternion-based orbit camera (no gimbal lock)
  private orbitQuat = new THREE.Quaternion()
  private zoom = 4
  private targetZoom = 4
  private isDragging = false
  private lastX = 0
  private lastY = 0
  private velocityX = 0
  private velocityY = 0

  // Base orbit distance scales with galaxy radius
  private baseDistance: number

  // Bound event handlers (stored for removal)
  private onPointerDown: (e: PointerEvent) => void
  private onPointerMove: (e: PointerEvent) => void
  private onPointerUp: (e: PointerEvent) => void
  private onWheel: (e: WheelEvent) => void
  private resizeObserver: ResizeObserver

  constructor(canvas: HTMLCanvasElement, galaxy: Galaxy) {
    // ─── Renderer ──────────────────────────────────────────────────────

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

    // ─── Scene ─────────────────────────────────────────────────────────

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)

    // ─── Galaxy data pipeline ──────────────────────────────────────────

    this.params = galaxyToGeneratorParams(galaxy)
    const stars = generateGalaxy(this.params)
    const R = this.params.galaxyRadius

    // ─── Camera ────────────────────────────────────────────────────────

    this.baseDistance = R * 1.7
    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, this.baseDistance * 20)

    // ─── Visual layers ─────────────────────────────────────────────────

    this.particles = new GalaxyParticles(stars, this.baseDistance)
    this.scene.add(this.particles.points)

    this.haze = new GalaxyHaze(R)
    this.scene.add(this.haze.mesh)

    this.nebula = new GalaxyNebula(stars, R, galaxy.id)
    this.scene.add(this.nebula.mesh)

    this.blackHole = new GalaxyBlackHole(galaxy.activity_class, R * 0.08)
    this.scene.add(this.blackHole.depthMesh)
    this.scene.add(this.blackHole.mesh)

    // ─── Initial orbit from position angle ───────────────────────────

    const initRotY = (galaxy.position_angle ?? 0) * Math.PI / 180
    const initTiltX = -0.45

    // Build initial quaternion: tilt around X then rotate around Y
    const qTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), initTiltX)
    const qRot = new THREE.Quaternion().setFromAxisAngle(_yAxis, initRotY)
    this.orbitQuat.multiplyQuaternions(qTilt, qRot)

    // ─── Input bindings ────────────────────────────────────────────────

    this.onPointerDown = (e: PointerEvent) => {
      this.isDragging = true
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.velocityX = 0
      this.velocityY = 0
    }

    this.onPointerMove = (e: PointerEvent) => {
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
    }

    this.onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoomDelta = this.targetZoom * 0.12
      this.targetZoom += e.deltaY > 0 ? -zoomDelta : zoomDelta
      this.targetZoom = Math.max(0.1, Math.min(20, this.targetZoom))
    }

    canvas.addEventListener('pointerdown', this.onPointerDown)
    canvas.addEventListener('pointermove', this.onPointerMove)
    canvas.addEventListener('pointerup', this.onPointerUp)
    canvas.addEventListener('wheel', this.onWheel, { passive: false })

    // ─── Resize handling ───────────────────────────────────────────────

    this.resizeObserver = new ResizeObserver(() => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w === 0 || h === 0) return
      this.renderer.setSize(w, h, false)
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
    })
    this.resizeObserver.observe(canvas)
  }

  // ─── Quaternion orbit helpers ────────────────────────────────────────────────

  private applyOrbitDelta(dx: number, dy: number): void {
    // Horizontal drag: rotate around world Y axis
    _qDrag.setFromAxisAngle(_yAxis, -dx)
    this.orbitQuat.premultiply(_qDrag)

    // Vertical drag: rotate around camera-local X axis
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.orbitQuat)
    _qDrag.setFromAxisAngle(right, -dy)
    this.orbitQuat.premultiply(_qDrag)

    this.orbitQuat.normalize()
  }

  // ─── Animation loop ─────────────────────────────────────────────────────────

  start(): void {
    this.clock.start()

    const animate = () => {
      this.animationId = requestAnimationFrame(animate)

      const dt = this.clock.getDelta()
      const time = this.clock.getElapsedTime()

      // ─── Inertia / friction ────────────────────────────────────────

      if (!this.isDragging) {
        if (Math.abs(this.velocityX) > 0.0001 || Math.abs(this.velocityY) > 0.0001) {
          this.applyOrbitDelta(this.velocityX, this.velocityY)
          this.velocityX *= 0.92
          this.velocityY *= 0.92
        }
      }

      // ─── Zoom lerp ────────────────────────────────────────────────

      this.zoom += (this.targetZoom - this.zoom) * 0.08

      // ─── Camera orbit position (quaternion-based) ─────────────────

      const distance = this.baseDistance / this.zoom
      // Start from (0, 0, distance) and rotate by orbit quaternion
      const camPos = new THREE.Vector3(0, 0, distance).applyQuaternion(this.orbitQuat)
      this.camera.position.copy(camPos)
      this.camera.lookAt(0, 0, 0)

      // Force matrix update so nebula's inverse VP is current-frame, not stale
      this.camera.updateMatrixWorld(true)

      // ─── Galaxy rotation ──────────────────────────────────────────

      this.galaxyRotation += dt * 0.02

      // ─── Update visual layers ─────────────────────────────────────

      this.particles.update(dt, time)

      const axisRatio = this.params.type === 'elliptical' ? this.params.axisRatio : 1.0

      this.nebula.update(
        time,
        this.camera,
        this.galaxyRotation,
        this.params.galaxyRadius,
        axisRatio,
      )

      // Derive tiltX / rotY from camera position for black hole shader
      const cp = this.camera.position
      const hDist = Math.sqrt(cp.x * cp.x + cp.z * cp.z)
      const tiltX = Math.atan2(cp.y, hDist)
      const rotY = Math.atan2(cp.x, cp.z)
      this.blackHole.update(time, tiltX, rotY, this.camera, this.renderer)

      // ─── Render ───────────────────────────────────────────────────

      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────────

  dispose(): void {
    cancelAnimationFrame(this.animationId)

    const canvas = this.renderer.domElement
    canvas.removeEventListener('pointerdown', this.onPointerDown)
    canvas.removeEventListener('pointermove', this.onPointerMove)
    canvas.removeEventListener('pointerup', this.onPointerUp)
    canvas.removeEventListener('wheel', this.onWheel)
    this.resizeObserver.disconnect()

    this.particles.dispose()
    this.haze.dispose()
    this.nebula.dispose()
    this.blackHole.dispose()
    this.renderer.dispose()
  }
}
