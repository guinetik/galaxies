import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SpacetimeFabric } from './SpacetimeFabric'
import { SpacetimePoints } from './SpacetimePoints'
import { SpacetimeLabels } from './SpacetimeLabels'
import { computeDensityField } from './computeDensityField'
import { STRUCTURES } from '@/three/cosmography/CylinderScene'
import type { GalaxyGroup } from '@/types/galaxy'
import type { DensityFieldResult } from './computeDensityField'

const DISPLACE_SCALE = 6000
const LABEL_OFFSET_Y = 300
const FOCUS_CAMERA_DISTANCE_BASE = 4200
const FOCUS_CAMERA_DISTANCE_MIN = 900
const ANDROMEDA_PGC = 2557

export class SpacetimeScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private clock = new THREE.Clock()
  private animationId = 0
  private resizeObserver: ResizeObserver

  private fabric: SpacetimeFabric | null = null
  private groupPoints: SpacetimePoints | null = null
  private labels: SpacetimeLabels | null = null
  private densityField: DensityFieldResult | null = null
  /** Runtime-resolved positions for PGC-based structures (e.g. Andromeda) */
  private resolvedPositions = new Map<string, { sgx: number; sgy: number }>()

  private focusTarget: THREE.Vector3 | null = null
  private focusCamPos: THREE.Vector3 | null = null

  private readonly defaultTarget = new THREE.Vector3(0, -1000, 0)
  private readonly defaultCamPos = new THREE.Vector3(5000, 8000, 18000)

  /** Number of groups in the slab (set after loadGroups) */
  slabCount = 0

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    this.renderer.setClearColor(0x000000, 1)

    this.scene = new THREE.Scene()

    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 1, 200000)
    // Angled view looking down at the fabric
    this.camera.position.copy(this.defaultCamPos)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 500
    this.controls.maxDistance = 100000
    this.controls.target.copy(this.defaultTarget)

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

  /** Compute density field and build all scene objects */
  loadGroups(groups: GalaxyGroup[]): void {
    // Compute density field
    const densityField = computeDensityField(groups)
    this.densityField = densityField
    this.slabCount = densityField.slabCount

    // Filter groups to same slab for points
    const slabGroups = groups.filter((g) => Math.abs(g.sgz) <= 2000)

    // Build fabric
    this.fabric = new SpacetimeFabric(densityField)
    this.scene.add(this.fabric.mesh)

    // Build points
    this.groupPoints = new SpacetimePoints(slabGroups, densityField)
    this.scene.add(this.groupPoints.points)

    // Build labels
    this.labels = new SpacetimeLabels(densityField)
    this.scene.add(this.labels.group)

    // Read Andromeda's position directly from the rendered Float32Array buffer
    const andromedaPos = this.groupPoints.getPositionByPGC(ANDROMEDA_PGC)
    if (andromedaPos) {
      this.resolvedPositions.set('Andromeda (M31)', {
        sgx: andromedaPos.x,
        sgy: andromedaPos.z,
      })
      const sprite = this.makeHighlightLabel('Andromeda (M31)')
      sprite.position.set(andromedaPos.x, andromedaPos.y + 50, andromedaPos.z)
      this.scene.add(sprite)
    }
  }

  /** Start the animation loop */
  start(): void {
    this.clock.start()

    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      const elapsed = this.clock.getElapsedTime()

      if (this.focusTarget && this.focusCamPos) {
        this.controls.target.lerp(this.focusTarget, 0.05)
        this.camera.position.lerp(this.focusCamPos, 0.05)
        if (this.controls.target.distanceTo(this.focusTarget) < 10) {
          this.focusTarget = null
          this.focusCamPos = null
        }
      }

      this.controls.update()
      this.fabric?.update(elapsed)
      this.groupPoints?.update(elapsed)
      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  /** Zoom camera to a named cosmic structure — centers the label in view */
  focusOn(name: string): void {
    const pos = this.getStructurePosition(name)
    if (!pos) return
    this.focusTarget = pos.clone()
    // Deeper wells (more negative Y) need closer zoom — others are too far otherwise
    const depthFactor = Math.max(0, -pos.y / DISPLACE_SCALE)
    const distance = Math.max(
      FOCUS_CAMERA_DISTANCE_MIN,
      FOCUS_CAMERA_DISTANCE_BASE - depthFactor * 3500,
    )
    const offset = new THREE.Vector3(0, distance, distance)
    this.focusCamPos = pos.clone().add(offset)
  }

  /** Reset camera to default view */
  resetView(): void {
    this.focusTarget = this.defaultTarget.clone()
    this.focusCamPos = this.defaultCamPos.clone()
  }

  /** Returns the label position (matches SpacetimeLabels: fabric surface + 300) */
  private getStructurePosition(name: string): THREE.Vector3 | null {
    const structure = STRUCTURES.find((s) => s.name === name)
    if (!structure || !this.densityField) return null

    // Prefer runtime-resolved position (PGC-based entries like Andromeda)
    const resolved = this.resolvedPositions.get(name)
    const sgx = resolved?.sgx ?? structure.sgx
    const sgy = resolved?.sgy ?? structure.sgy

    const { grid, resolution, extent } = this.densityField
    const gx = Math.floor(((sgx + extent) / (extent * 2)) * resolution)
    const gy = Math.floor(((sgy + extent) / (extent * 2)) * resolution)
    const cx = Math.min(Math.max(gx, 0), resolution - 1)
    const cy = Math.min(Math.max(gy, 0), resolution - 1)
    const density = grid[cy * resolution + cx]
    const fabricY = -(Math.pow(density, 0.7) * DISPLACE_SCALE)
    const labelY = fabricY + LABEL_OFFSET_Y

    return new THREE.Vector3(sgx, labelY, sgy)
  }

  /** Creates a highlighted label sprite for landmark galaxies */
  private makeHighlightLabel(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const scale = 2
    canvas.width = 256 * scale
    canvas.height = 48 * scale
    const ctx = canvas.getContext('2d')!
    ctx.scale(scale, scale)
    ctx.font = '700 16px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(255, 200, 100, 0.8)'
    ctx.shadowBlur = 12
    ctx.fillStyle = 'rgba(255, 220, 130, 1.0)'
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
    sprite.scale.set(1000, 200, 1)
    return sprite
  }

  /** Hit-test for tooltip */
  pickAtScreen(
    screenX: number,
    screenY: number,
    viewportWidth: number,
    viewportHeight: number,
  ): { pgc: number; velocity: number; distance: number } | null {
    return this.groupPoints?.pickAtScreen(
      screenX,
      screenY,
      this.camera,
      viewportWidth,
      viewportHeight,
    ) ?? null
  }

  dispose(): void {
    cancelAnimationFrame(this.animationId)
    this.resizeObserver.disconnect()
    this.controls.dispose()
    this.fabric?.dispose()
    this.groupPoints?.dispose()
    this.labels?.dispose()
    this.renderer.dispose()
  }
}
