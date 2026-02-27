import * as THREE from 'three'
import type { Galaxy } from '@/types/galaxy'
import { galaxyToGeneratorParams } from './GalaxyParamsMapper'
import type { GeneratorParams } from './GalaxyParamsMapper'
import { generateGalaxy } from './GalaxyGenerator'
import { GalaxyParticles } from './GalaxyParticles'
import { GalaxyHaze } from './GalaxyHaze'
import { GalaxyNebula } from './GalaxyNebula'
import { GalaxyBlackHole } from './GalaxyBlackHole'

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

  // Camera orbit state
  private tiltX = 0.6
  private rotY = 0
  private zoom = 1
  private targetZoom = 1
  private isDragging = false
  private lastX = 0
  private lastY = 0
  private velocityX = 0
  private velocityY = 0
  private readonly _origin = new THREE.Vector3()

  // Bound event handlers (stored for removal)
  private onPointerDown: (e: PointerEvent) => void
  private onPointerMove: (e: PointerEvent) => void
  private onPointerUp: (e: PointerEvent) => void
  private onWheel: (e: WheelEvent) => void
  private resizeObserver: ResizeObserver

  constructor(canvas: HTMLCanvasElement, galaxy: Galaxy) {
    // ─── Renderer ──────────────────────────────────────────────────────

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

    // ─── Scene ─────────────────────────────────────────────────────────

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)

    // ─── Camera ────────────────────────────────────────────────────────

    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 1, 5000)
    this.camera.position.set(0, 400, 600)
    this.camera.lookAt(0, 0, 0)

    // ─── Galaxy data pipeline ──────────────────────────────────────────

    this.params = galaxyToGeneratorParams(galaxy)
    const stars = generateGalaxy(this.params)

    // ─── Visual layers ─────────────────────────────────────────────────

    this.particles = new GalaxyParticles(stars)
    this.scene.add(this.particles.points)

    this.haze = new GalaxyHaze(this.params.galaxyRadius)
    this.scene.add(this.haze.mesh)

    this.nebula = new GalaxyNebula(stars, this.params.galaxyRadius, galaxy.id)
    this.scene.add(this.nebula.mesh)

    this.blackHole = new GalaxyBlackHole(galaxy.activity_class)
    this.scene.add(this.blackHole.mesh)

    // ─── Initial rotation from position angle ──────────────────────────

    this.rotY = (galaxy.position_angle ?? 0) * Math.PI / 180

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
      this.rotY += dx * 0.005
      this.tiltX += dy * 0.005
      this.tiltX = Math.max(0.05, Math.min(Math.PI / 2 - 0.05, this.tiltX))
      this.velocityX = dx * 0.005
      this.velocityY = dy * 0.005
      this.lastX = e.clientX
      this.lastY = e.clientY
    }

    this.onPointerUp = () => {
      this.isDragging = false
    }

    this.onWheel = (e: WheelEvent) => {
      e.preventDefault()
      this.targetZoom += e.deltaY > 0 ? -0.1 : 0.1
      this.targetZoom = Math.max(0.3, Math.min(5, this.targetZoom))
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

  // ─── Animation loop ─────────────────────────────────────────────────────────

  start(): void {
    this.clock.start()

    const animate = () => {
      this.animationId = requestAnimationFrame(animate)

      const dt = this.clock.getDelta()
      const time = this.clock.getElapsedTime()

      // ─── Inertia / friction ────────────────────────────────────────

      if (!this.isDragging) {
        this.rotY += this.velocityX
        this.tiltX += this.velocityY
        this.tiltX = Math.max(0.05, Math.min(Math.PI / 2 - 0.05, this.tiltX))
        this.velocityX *= 0.92
        this.velocityY *= 0.92
      }

      // ─── Zoom lerp ────────────────────────────────────────────────

      this.zoom += (this.targetZoom - this.zoom) * 0.08

      // ─── Camera orbit position ────────────────────────────────────

      const distance = 800 / this.zoom
      const camX = distance * Math.sin(this.rotY) * Math.cos(this.tiltX)
      const camY = distance * Math.sin(this.tiltX)
      const camZ = distance * Math.cos(this.rotY) * Math.cos(this.tiltX)
      this.camera.position.set(camX, camY, camZ)
      this.camera.lookAt(0, 0, 0)

      // ─── Galaxy rotation ──────────────────────────────────────────

      this.galaxyRotation += dt * 0.02

      // ─── Update visual layers ─────────────────────────────────────

      this.particles.update(dt, time)

      // Nebula needs screen-space projection of galaxy center
      this._origin.set(0, 0, 0)
      this._origin.project(this.camera)
      const width = this.renderer.domElement.clientWidth
      const height = this.renderer.domElement.clientHeight
      const centerX = (this._origin.x * 0.5 + 0.5) * width
      const centerY = (1 - (this._origin.y * 0.5 + 0.5)) * height

      const axisRatio = this.params.type === 'elliptical' ? this.params.axisRatio : 1.0

      this.nebula.update(
        time,
        this.tiltX,
        this.rotY,
        this.galaxyRotation,
        this.zoom,
        this.params.galaxyRadius,
        axisRatio,
        centerX,
        centerY,
        width,
        height,
      )

      this.blackHole.update(time, this.tiltX, this.rotY, this.camera)

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
