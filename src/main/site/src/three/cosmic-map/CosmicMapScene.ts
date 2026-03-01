import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CosmicMapField } from './CosmicMapField'
import { CosmicMapAxes } from './CosmicMapAxes'
import type { Galaxy, GalaxyGroup } from '@/types/galaxy'
import type { MapDataMode } from './CosmicMapField'

export class CosmicMapScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private clock = new THREE.Clock()
  private animationId = 0
  private resizeObserver: ResizeObserver

  readonly field: CosmicMapField
  readonly axes: CosmicMapAxes

  constructor(canvas: HTMLCanvasElement) {
    // --- Renderer ---
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    this.renderer.setClearColor(0x000000, 1)

    // --- Scene ---
    this.scene = new THREE.Scene()

    // --- Camera (Mpc scale: data extends ~±16,000 Mpc) ---
    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 1, 200000)
    this.camera.position.set(2000, 4000, 12000)

    // --- OrbitControls ---
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 100
    this.controls.maxDistance = 80000
    this.controls.target.set(0, 0, 0)

    // --- Scene objects ---
    this.field = new CosmicMapField()
    this.scene.add(this.field.points)

    this.axes = new CosmicMapAxes()
    this.scene.add(this.axes.group)

    // --- Resize ---
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
      const elapsed = this.clock.getElapsedTime()

      this.controls.update()
      this.field.update(elapsed)
      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  /** Load groups data into the field */
  loadGroups(groups: GalaxyGroup[]): void {
    this.field.setGroups(groups)
  }

  /** Load galaxies data into the field */
  loadGalaxies(galaxies: Galaxy[]): void {
    this.field.setGalaxies(galaxies)
  }

  /** Toggle axes visibility */
  setAxesVisible(visible: boolean): void {
    this.axes.setVisible(visible)
  }

  dispose(): void {
    cancelAnimationFrame(this.animationId)
    this.resizeObserver.disconnect()
    this.controls.dispose()
    this.field.dispose()
    this.axes.dispose()
    this.renderer.dispose()
  }
}
