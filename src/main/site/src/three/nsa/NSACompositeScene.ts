import * as THREE from 'three'
import { markRaw } from 'vue'
import type { NSAMetadata } from '@/types/nsa'
import luptionVertShader from './shaders/lupton.vert.glsl?raw'
import luptionFragShader from './shaders/lupton.frag.glsl?raw'

export class NSACompositeScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.OrthographicCamera
  private material: THREE.ShaderMaterial | null = null
  private mesh: THREE.Mesh | null = null
  private textures: THREE.Texture[] = []
  private animationId: number | null = null
  private originalBandR: THREE.Texture | null = null
  private originalBandB: THREE.Texture | null = null
  private originalRangeR: THREE.Vector2 | null = null
  private originalRangeB: THREE.Vector2 | null = null
  private currentTheme: 'infra' | 'astral' = 'infra'

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = markRaw(new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    }))
    this.camera = markRaw(new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1))
    this.scene = markRaw(new THREE.Scene())
  }

  async load(pgc: number, metadata: NSAMetadata): Promise<void> {
    const loader = new THREE.TextureLoader()
    const base = `/galaxy-img/${pgc}/`

    // Load i, r, g band images (mapped to R, G, B)
    const [texI, texR, texG] = await Promise.all([
      loader.loadAsync(`${base}i.webp`),
      loader.loadAsync(`${base}r.webp`),
      loader.loadAsync(`${base}g.webp`),
    ])

    // Store textures for later disposal (mark as non-reactive)
    this.textures = [markRaw(texI), markRaw(texR), markRaw(texG)]

    // Ensure textures are not filtered (nearest for raw data)
    this.textures.forEach((tex) => {
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
    })

    // Create shader material with uniforms
    const rangeR = new THREE.Vector2(metadata.data_ranges.i[0], metadata.data_ranges.i[1])
    const rangeB = new THREE.Vector2(metadata.data_ranges.g[0], metadata.data_ranges.g[1])

    this.originalBandR = texI
    this.originalBandB = texG
    this.originalRangeR = rangeR
    this.originalRangeB = rangeB

    this.material = markRaw(new THREE.ShaderMaterial({
      uniforms: {
        uBandR: { value: texI },
        uBandG: { value: texR },
        uBandB: { value: texG },
        uAlpha: { value: 0.02 },
        uQ: { value: 8.0 },
        uRangeR: { value: rangeR },
        uRangeG: { value: new THREE.Vector2(metadata.data_ranges.r[0], metadata.data_ranges.r[1]) },
        uRangeB: { value: rangeB },
      },
      vertexShader: luptionVertShader,
      fragmentShader: luptionFragShader,
    }))

    // Create and add mesh
    const geometry = markRaw(new THREE.PlaneGeometry(2, 2))
    this.mesh = markRaw(new THREE.Mesh(geometry, this.material!))
    this.scene.add(this.mesh)

    // Set canvas size and render
    const width = this.renderer.domElement.parentElement?.clientWidth || window.innerWidth
    const height = this.renderer.domElement.parentElement?.clientHeight || window.innerHeight * 0.6
    this.resize(width, height)

    // Start animation loop
    this.startAnimation()
  }

  private startAnimation(): void {
    const animate = () => {
      this.render()
      this.animationId = requestAnimationFrame(animate)
    }
    this.animationId = requestAnimationFrame(animate)
  }

  private stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  setParams(Q: number, alpha: number): void {
    if (this.material) {
      this.material.uniforms.uQ.value = Q
      this.material.uniforms.uAlpha.value = alpha
      this.render()
    }
  }

  setTheme(themeName: 'infra' | 'astral'): void {
    if (!this.material || this.currentTheme === themeName) return

    if (themeName === 'infra') {
      // Restore original Infra configuration (i→R, r→G, g→B)
      if (this.originalBandR && this.originalBandB && this.originalRangeR && this.originalRangeB) {
        this.material.uniforms.uBandR.value = this.originalBandR
        this.material.uniforms.uBandB.value = this.originalBandB
        this.material.uniforms.uRangeR.value = this.originalRangeR
        this.material.uniforms.uRangeB.value = this.originalRangeB
      }
    } else if (themeName === 'astral') {
      // Astral: swap R and B channels for different color tone
      const tempR = this.material.uniforms.uBandR.value
      this.material.uniforms.uBandR.value = this.material.uniforms.uBandB.value
      this.material.uniforms.uBandB.value = tempR

      const tempRangeR = this.material.uniforms.uRangeR.value
      this.material.uniforms.uRangeR.value = this.material.uniforms.uRangeB.value
      this.material.uniforms.uRangeB.value = tempRangeR
    }

    this.currentTheme = themeName
    this.render()
  }

  render(): void {
    if (!this.material) return
    this.renderer.render(this.scene, this.camera)
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false)
    this.render()
  }

  dispose(): void {
    // Stop animation loop
    this.stopAnimation()

    // Dispose textures
    this.textures.forEach((tex) => tex.dispose())
    this.textures = []

    if (this.material) {
      this.material.dispose()
    }
    if (this.mesh && this.mesh.geometry) {
      this.mesh.geometry.dispose()
    }
    this.renderer.dispose()
  }
}
