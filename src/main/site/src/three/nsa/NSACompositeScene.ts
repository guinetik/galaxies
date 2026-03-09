import * as THREE from 'three'
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

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    })
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.scene = new THREE.Scene()
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

    // Store textures for later disposal
    this.textures = [texI, texR, texG]

    // Ensure textures are not filtered (nearest for raw data)
    this.textures.forEach((tex) => {
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
    })

    // Create shader material with uniforms
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uBandR: { value: texI },
        uBandG: { value: texR },
        uBandB: { value: texG },
        uAlpha: { value: 0.02 },
        uQ: { value: 8.0 },
        uRangeR: { value: new THREE.Vector2(metadata.data_ranges.i[0], metadata.data_ranges.i[1]) },
        uRangeG: { value: new THREE.Vector2(metadata.data_ranges.r[0], metadata.data_ranges.r[1]) },
        uRangeB: { value: new THREE.Vector2(metadata.data_ranges.g[0], metadata.data_ranges.g[1]) },
      },
      vertexShader: luptionVertShader,
      fragmentShader: luptionFragShader,
    })

    // Create and add mesh
    const geometry = new THREE.PlaneGeometry(2, 2)
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.scene.add(this.mesh)

    this.render()
  }

  setParams(Q: number, alpha: number): void {
    if (this.material) {
      this.material.uniforms.uQ.value = Q
      this.material.uniforms.uAlpha.value = alpha
      this.render()
    }
  }

  render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false)
    this.render()
  }

  dispose(): void {
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
