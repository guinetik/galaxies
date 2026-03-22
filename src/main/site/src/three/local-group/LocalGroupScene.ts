import * as THREE from 'three'
import type { LocalGroupPointHit } from './localGroupTypes'

/**
 * Minimal Local Group scene - single white dot for visual testing
 */
export class LocalGroupScene {
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene: THREE.Scene
  private readonly camera: THREE.OrthographicCamera
  private animationId = 0

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    this.renderer.setClearColor(0x02060b, 1)

    this.scene = new THREE.Scene()

    // Simple orthographic camera
    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.OrthographicCamera(-500, 500, 500 / aspect, -500 / aspect, 1, 10000)
    this.camera.position.z = 100

    // Single white dot
    const dotGeometry = new THREE.SphereGeometry(10, 32, 32)
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const dot = new THREE.Mesh(dotGeometry, dotMaterial)
    this.scene.add(dot)

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width === 0 || height === 0) return
      this.renderer.setSize(width, height, false)
      const aspect = width / height
      this.camera.left = -500
      this.camera.right = 500
      this.camera.top = 500 / aspect
      this.camera.bottom = -500 / aspect
      this.camera.updateProjectionMatrix()
    })
    resizeObserver.observe(canvas)
  }

  getCamera(): THREE.OrthographicCamera {
    return this.camera
  }

  start(): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }

  loadGroups(groups: any, landmarks?: any): void {
    // No-op
  }

  focusOn(id: string): any {
    return undefined
  }

  resetView(): void {
    // No-op
  }

  setLayerVisibility(visibility: any): void {
    // No-op
  }

  pickAtScreen(screenX: number, screenY: number, width: number, height: number): LocalGroupPointHit | null {
    return null
  }

  dispose(): void {
    cancelAnimationFrame(this.animationId)
    this.renderer.dispose()
  }
}
