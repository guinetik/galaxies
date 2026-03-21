import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CosmicMapField } from './CosmicMapField'
import { COSMIC_MAP_EXTENT, CosmicMapAxes } from './CosmicMapAxes'
import {
  getCosmicMapCameraMotionProfile,
  getIntroCameraBlend,
  rotateOffsetAroundYAxis,
  shouldApplyIdleCameraMotion,
} from './CosmicMapCameraMotion'
import {
  CosmicMapCylinderFrame,
  getDefaultCosmicMapCylinderExtents,
} from './CosmicMapCylinderFrame'
import { STRUCTURES } from '@/three/cosmography/CylinderScene'
import type { Galaxy, GalaxyGroup } from '@/types/galaxy'
import type { MapDataMode } from './CosmicMapField'

const FOCUS_DISTANCE = 1500

export class CosmicMapScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private clock = new THREE.Clock()
  private animationId = 0
  private resizeObserver: ResizeObserver

  private structurePositions = new Map<string, THREE.Vector3>()
  private focusTarget: THREE.Vector3 | null = null
  private focusCamPos: THREE.Vector3 | null = null
  private readonly defaultTarget = new THREE.Vector3(0, 0, 0)
  private readonly baseCamPos = new THREE.Vector3(2000, 4000, 12000)
  private readonly defaultCamPos: THREE.Vector3
  private readonly introStartCamPos: THREE.Vector3
  private readonly introDurationSeconds: number
  private readonly idleDelaySeconds: number
  private readonly idleRotationSpeed: number
  private introElapsed = 0
  private introProgress = 0
  private isUserInteracting = false
  private lastInteractionElapsed = 0

  private readonly onControlsStart = (): void => {
    this.isUserInteracting = true
    this.introProgress = 1
    this.lastInteractionElapsed = this.clock.elapsedTime
  }

  private readonly onControlsEnd = (): void => {
    this.isUserInteracting = false
    this.lastInteractionElapsed = this.clock.elapsedTime
  }

  readonly field: CosmicMapField
  readonly axes: CosmicMapAxes
  readonly frame: CosmicMapCylinderFrame

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    this.renderer.setClearColor(0x000000, 1)

    this.scene = new THREE.Scene()

    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 1, 200000)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 100
    this.controls.maxDistance = 80000
    this.controls.target.copy(this.defaultTarget)
    this.controls.addEventListener('start', this.onControlsStart)
    this.controls.addEventListener('end', this.onControlsEnd)

    const cameraMotion = getCosmicMapCameraMotionProfile(this.baseCamPos, this.controls.maxDistance)
    this.defaultCamPos = cameraMotion.defaultPosition
    this.introStartCamPos = cameraMotion.introStart
    this.introDurationSeconds = cameraMotion.introDurationSeconds
    this.idleDelaySeconds = cameraMotion.idleDelaySeconds
    this.idleRotationSpeed = cameraMotion.idleRotationSpeed
    this.camera.position.copy(this.introStartCamPos)

    this.field = new CosmicMapField()
    this.scene.add(this.field.points)

    this.axes = new CosmicMapAxes()
    this.scene.add(this.axes.group)

    this.frame = new CosmicMapCylinderFrame(getDefaultCosmicMapCylinderExtents(COSMIC_MAP_EXTENT))
    this.scene.add(this.frame.group)

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

  getCamera(): THREE.PerspectiveCamera {
    return this.camera
  }

  /** Start the animation loop */
  start(): void {
    this.clock.start()

    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      const delta = this.clock.getDelta()
      const elapsed = this.clock.elapsedTime

      if (this.introProgress < 1) {
        this.introElapsed = Math.min(this.introElapsed + delta, this.introDurationSeconds)
        this.introProgress = Math.min(this.introElapsed / this.introDurationSeconds, 1)
        const easedProgress = getIntroCameraBlend(this.introProgress)
        this.camera.position.lerpVectors(this.introStartCamPos, this.defaultCamPos, easedProgress)
      }

      if (this.focusTarget && this.focusCamPos) {
        this.controls.target.lerp(this.focusTarget, 0.05)
        this.camera.position.lerp(this.focusCamPos, 0.05)
        if (this.controls.target.distanceTo(this.focusTarget) < 10) {
          this.focusTarget = null
          this.focusCamPos = null
        }
      }

      if (shouldApplyIdleCameraMotion({
        introProgress: this.introProgress,
        isUserInteracting: this.isUserInteracting,
        secondsSinceInteraction: elapsed - this.lastInteractionElapsed,
        hasFocusTransition: this.focusTarget != null || this.focusCamPos != null,
        idleDelaySeconds: this.idleDelaySeconds,
      })) {
        const offset = this.camera.position.clone().sub(this.controls.target)
        const rotatedOffset = rotateOffsetAroundYAxis(offset, delta * this.idleRotationSpeed)
        this.camera.position.copy(this.controls.target).add(rotatedOffset)
      }

      this.controls.update()
      this.field.update(elapsed)
      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  /** Load groups data into the field and build structure labels */
  loadGroups(groups: GalaxyGroup[]): void {
    this.field.setGroups(groups)
    this.buildLabels(groups)
  }

  /** Load galaxies data into the field */
  loadGalaxies(galaxies: Galaxy[]): void {
    this.field.setGalaxies(galaxies)
  }

  /** Toggle axes visibility */
  setAxesVisible(visible: boolean): void {
    this.axes.setVisible(visible)
    this.frame.setVisible(visible)
  }

  /** Zoom camera to a named cosmic structure */
  focusOn(name: string): void {
    const pos = this.structurePositions.get(name)
    if (!pos) return
    this.introProgress = 1
    this.focusTarget = pos.clone()
    const dir = this.camera.position.clone().sub(pos).normalize()
    this.focusCamPos = pos.clone().add(dir.multiplyScalar(FOCUS_DISTANCE))
  }

  /** Reset camera to default view */
  resetView(): void {
    this.introProgress = 1
    this.focusTarget = this.defaultTarget.clone()
    this.focusCamPos = this.defaultCamPos.clone()
  }

  /**
   * Creates sprite labels for major cosmic structures.
   * Coordinate mapping: SGX→X, SGY→Y, SGZ→Z (groups mode).
   */
  private buildLabels(groups: GalaxyGroup[]): void {
    for (const structure of STRUCTURES) {
      let { sgx, sgy } = structure

      // Resolve from real group data for PGC-based entries (e.g. Andromeda)
      if (structure.pgc != null) {
        const match = groups.find((g) => g.group_pgc === structure.pgc)
        if (match) {
          sgx = match.sgx
          sgy = match.sgy
        }
      }

      // Find real SGZ from closest group
      let sgz = 0
      if (structure.name !== 'Milky Way') {
        let bestDist = Infinity
        for (const g of groups) {
          const dx = g.sgx - sgx
          const dy = g.sgy - sgy
          const d = dx * dx + dy * dy
          if (d < bestDist) {
            bestDist = d
            sgz = g.sgz
          }
        }
      }

      const pos = new THREE.Vector3(sgx, sgy, sgz)
      this.structurePositions.set(structure.name, pos)

      const isMW = structure.name === 'Milky Way'
      const isAndromeda = structure.pgc != null && structure.name !== 'Milky Way'
      const labelY = sgy + 300 + (isAndromeda ? -600 : 0)
      const sprite = this.makeLabel(structure.name, isMW || isAndromeda)
      sprite.position.set(sgx, labelY, sgz)
      this.scene.add(sprite)
    }
  }

  private makeLabel(text: string, highlight = false): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const scale = 2
    canvas.width = 256 * scale
    canvas.height = 48 * scale
    const ctx = canvas.getContext('2d')!
    ctx.scale(scale, scale)

    const fontSize = highlight ? 14 : 12
    ctx.font = `${highlight ? '700' : '500'} ${fontSize}px system-ui, -apple-system, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.shadowColor = highlight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(34, 211, 238, 0.6)'
    ctx.shadowBlur = highlight ? 12 : 8
    ctx.fillStyle = highlight ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.85)'
    ctx.fillText(text, 128, 24)

    ctx.shadowBlur = 0
    ctx.fillText(text, 128, 24)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(highlight ? 1000 : 800, highlight ? 200 : 150, 1)
    return sprite
  }

  dispose(): void {
    cancelAnimationFrame(this.animationId)
    this.resizeObserver.disconnect()
    this.controls.removeEventListener('start', this.onControlsStart)
    this.controls.removeEventListener('end', this.onControlsEnd)
    this.controls.dispose()
    this.field.dispose()
    this.axes.dispose()
    this.frame.dispose()
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Sprite) {
        ;(obj.material as THREE.SpriteMaterial).map?.dispose()
        obj.material.dispose()
      }
    })
    this.renderer.dispose()
  }
}
