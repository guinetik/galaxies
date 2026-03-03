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
/** Label floats this far above the fabric surface (matches SpacetimeLabels) */
const LABEL_OFFSET_Y = 300
/** Camera distance when zoomed to a structure — centers the label in view */
const FOCUS_CAMERA_DISTANCE = 4500

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
    // Position camera above and in front of the label for a centered view
    const offset = new THREE.Vector3(0, FOCUS_CAMERA_DISTANCE, FOCUS_CAMERA_DISTANCE)
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

    const { grid, resolution, extent } = this.densityField
    const gx = Math.floor(((structure.sgx + extent) / (extent * 2)) * resolution)
    const gy = Math.floor(((structure.sgy + extent) / (extent * 2)) * resolution)
    const cx = Math.min(Math.max(gx, 0), resolution - 1)
    const cy = Math.min(Math.max(gy, 0), resolution - 1)
    const density = grid[cy * resolution + cx]
    const fabricY = -(Math.pow(density, 0.7) * DISPLACE_SCALE)
    const labelY = fabricY + LABEL_OFFSET_Y

    return new THREE.Vector3(structure.sgx, labelY, structure.sgy)
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
