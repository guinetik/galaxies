import * as THREE from 'three'
import type { Galaxy } from '@/types/galaxy'
import { galaxyToGeneratorParams } from './GalaxyParamsMapper'
import type { GeneratorParams } from './GalaxyParamsMapper'
import { generateGalaxy } from './GalaxyGenerator'
import { GalaxyParticles } from './GalaxyParticles'
import { GalaxyHaze } from './GalaxyHaze'
import { GalaxyNebula } from './GalaxyNebula'
import { GalaxyBlackHole } from './GalaxyBlackHole'
import lensingVert from './shaders/lensing.vert.glsl?raw'
import lensingFrag from './shaders/lensing.frag.glsl?raw'

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

  // Lensing post-process
  private galaxyRT: THREE.WebGLRenderTarget
  private lensingMaterial: THREE.ShaderMaterial
  private lensingScene: THREE.Scene
  private lensingCamera: THREE.OrthographicCamera
  private _bhScreenVec = new THREE.Vector3()

  // Quaternion-based orbit camera (no gimbal lock)
  private orbitQuat = new THREE.Quaternion()
  private zoom = 4
  private targetZoom = 4
  private isDragging = false
  private isPinching = false
  private lastX = 0
  private lastY = 0
  private velocityX = 0
  private velocityY = 0

  // Base orbit distance scales with galaxy radius
  private baseDistance: number

  // Pinch zoom state
  private lastPinchDist = 0

  // Bound event handlers (stored for removal)
  private onPointerDown: (e: PointerEvent) => void
  private onPointerMove: (e: PointerEvent) => void
  private onPointerUp: (e: PointerEvent) => void
  private onPointerCancel: (e: PointerEvent) => void
  private onWheel: (e: WheelEvent) => void
  private onTouchStart: (e: TouchEvent) => void
  private onTouchMove: (e: TouchEvent) => void
  private onTouchEnd: () => void
  private resizeObserver: ResizeObserver

  constructor(canvas: HTMLCanvasElement, galaxy: Galaxy) {
    // ─── Renderer ──────────────────────────────────────────────────────

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

    // ─── Scene ─────────────────────────────────────────────────────────

    this.scene = new THREE.Scene()
    this.renderer.setClearColor(0x000000, 1)

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

    this.nebula = new GalaxyNebula(stars, R, galaxy.pgc)
    this.scene.add(this.nebula.mesh)

    this.blackHole = new GalaxyBlackHole(null, R * 0.08)
    this.scene.add(this.blackHole.depthMesh)
    this.scene.add(this.blackHole.mesh)

    // ─── Layer assignments ───────────────────────────────────────────
    // Layer 1: galaxy objects (rendered to RT for lensing)
    // Layer 2: black hole (rendered on top after lensing pass)
    this.particles.points.layers.set(1)
    this.haze.mesh.layers.set(1)
    this.nebula.mesh.layers.set(1)
    // Black hole layers are set in GalaxyBlackHole constructor (layer 2)

    // ─── Lensing render target & fullscreen quad ─────────────────────

    const w = canvas.clientWidth
    const h = canvas.clientHeight
    this.galaxyRT = new THREE.WebGLRenderTarget(
      w * window.devicePixelRatio,
      h * window.devicePixelRatio,
      { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter },
    )

    this.lensingMaterial = new THREE.ShaderMaterial({
      vertexShader: lensingVert,
      fragmentShader: lensingFrag,
      uniforms: {
        uSceneTexture: { value: this.galaxyRT.texture },
        uBHScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
        uLensStrength: { value: 0.0 },
        uAspectRatio: { value: w / h },
      },
      depthTest: false,
      depthWrite: false,
    })

    const lensingQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      this.lensingMaterial,
    )

    this.lensingScene = new THREE.Scene()
    this.lensingScene.add(lensingQuad)
    this.lensingCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // ─── Mobile: start more zoomed out for better fit on narrow viewports ───
    const isNarrowViewport = typeof window !== 'undefined' && window.innerWidth < 768
    const initialZoom = isNarrowViewport ? 2 : 4
    this.zoom = initialZoom
    this.targetZoom = initialZoom

    // ─── Initial orbit from position angle ───────────────────────────

    // PGC-seeded random angle (no position_angle in CF4)
    const initRotY = ((galaxy.pgc * 2654435761 >>> 0) / 4294967296) * Math.PI * 2
    const initTiltX = -0.45

    // Build initial quaternion: tilt around X then rotate around Y
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
        const zoomDelta = (this.lastPinchDist - dist) * 0.01
        this.lastPinchDist = dist
        this.targetZoom = Math.max(0.1, Math.min(20, this.targetZoom + zoomDelta))
      }
    }

    this.onTouchEnd = () => {
      if (this.lastPinchDist > 0) this.lastPinchDist = 0
      this.isPinching = false
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

    // ─── Resize handling ───────────────────────────────────────────────

    this.resizeObserver = new ResizeObserver(() => {
      const rw = canvas.clientWidth
      const rh = canvas.clientHeight
      if (rw === 0 || rh === 0) return
      this.renderer.setSize(rw, rh, false)
      this.camera.aspect = rw / rh
      this.camera.updateProjectionMatrix()
      const dpr = this.renderer.getPixelRatio()
      this.galaxyRT.setSize(rw * dpr, rh * dpr)
      this.lensingMaterial.uniforms.uAspectRatio.value = rw / rh
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

      // ─── Galaxy rotation (faster as we zoom in) ──────────────────

      const zoomNorm = Math.min(this.zoom / 20, 1)  // 0 at min zoom, 1 at max
      const rotSpeed = 0.02 + 0.18 * zoomNorm * zoomNorm  // 0.02 far → 0.20 close
      this.galaxyRotation += dt * rotSpeed

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

      // ─── Render (3-pass lensing pipeline) ─────────────────────────

      // Project black hole world position (0,0,0) to screen UV
      this._bhScreenVec.set(0, 0, 0).project(this.camera)
      const bhU = this._bhScreenVec.x * 0.5 + 0.5
      const bhV = this._bhScreenVec.y * 0.5 + 0.5

      // LOD-driven lens strength: 0 when far, 0.03 when close
      const lod = this.blackHole.getLOD()
      const lensStrength = lod * lod * 0.03

      if (lensStrength < 0.001) {
        // ─── Fast path: no visible lensing, single render ──────────
        this.camera.layers.enableAll()
        this.renderer.setRenderTarget(null)
        this.renderer.render(this.scene, this.camera)
      } else {
        // ─── Pass 1: Galaxy objects → render target ────────────────
        this.camera.layers.set(1)
        this.renderer.setRenderTarget(this.galaxyRT)
        this.renderer.clear()
        this.renderer.render(this.scene, this.camera)

        // ─── Pass 2: Lensing quad → screen ─────────────────────────
        this.lensingMaterial.uniforms.uBHScreenPos.value.set(bhU, bhV)
        this.lensingMaterial.uniforms.uLensStrength.value = lensStrength
        this.renderer.setRenderTarget(null)
        this.renderer.clear()
        this.renderer.render(this.lensingScene, this.lensingCamera)

        // ─── Pass 3: Black hole billboard → screen (composite) ─────
        this.camera.layers.set(2)
        this.renderer.autoClear = false
        this.renderer.render(this.scene, this.camera)
        this.renderer.autoClear = true
      }
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
    canvas.removeEventListener('pointercancel', this.onPointerCancel)
    canvas.removeEventListener('pointerleave', this.onPointerUp)
    canvas.removeEventListener('wheel', this.onWheel)
    canvas.removeEventListener('touchstart', this.onTouchStart)
    canvas.removeEventListener('touchmove', this.onTouchMove)
    canvas.removeEventListener('touchend', this.onTouchEnd)
    this.resizeObserver.disconnect()

    this.particles.dispose()
    this.haze.dispose()
    this.nebula.dispose()
    this.blackHole.dispose()
    this.galaxyRT.dispose()
    this.lensingMaterial.dispose()
    this.renderer.dispose()
  }
}
