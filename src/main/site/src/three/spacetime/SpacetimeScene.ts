import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SpacetimeFabric } from './SpacetimeFabric'
import { SpacetimePoints } from './SpacetimePoints'
import { SpacetimeLabels } from './SpacetimeLabels'
import { computeDensityField } from './computeDensityField'
import type { GalaxyGroup } from '@/types/galaxy'

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
    this.camera.position.set(5000, 8000, 18000)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 500
    this.controls.maxDistance = 100000
    this.controls.target.set(0, -1000, 0)

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

      this.controls.update()
      this.fabric?.update(elapsed)
      this.groupPoints?.update(elapsed)
      this.renderer.render(this.scene, this.camera)
    }

    animate()
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
