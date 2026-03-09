import * as THREE from 'three'
import { markRaw } from 'vue'
import type { NSAMetadata } from '@/types/nsa'
import luptonVertShader from './shaders/lupton.vert.glsl?raw'
import luptonFragShader from './shaders/lupton.frag.glsl?raw'
import nsacustomVertShader from './shaders/nsacustom.vert.glsl?raw'
import nsacustomFragShader from './shaders/nsacustom.frag.glsl?raw'
import volumetricVertShader from './shaders/volumetric.vert.glsl?raw'
import volumetricFragShader from './shaders/volumetric.frag.glsl?raw'
import nsa3dVertShader from './shaders/nsa3d.vert.glsl?raw'
import nsa3dFragShader from './shaders/nsa3d.frag.glsl?raw'

export type ShaderMode = 'lupton' | 'custom' | 'volumetric' | 'nsa3d'

const SHADERS: Record<ShaderMode, { vert: string; frag: string }> = {
  lupton: { vert: luptonVertShader, frag: luptonFragShader },
  custom: { vert: nsacustomVertShader, frag: nsacustomFragShader },
  volumetric: { vert: volumetricVertShader, frag: volumetricFragShader },
  nsa3d: { vert: nsa3dVertShader, frag: nsa3dFragShader },
}

export class NSACompositeScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.OrthographicCamera
  private material: THREE.ShaderMaterial | null = null
  private mesh: THREE.Mesh | null = null
  private textures: THREE.Texture[] = []
  private animationId: number | null = null
  private bandData: Record<string, { tex: THREE.Texture; range: THREE.Vector2 }> = {}
  private currentTheme: 'grayscale' | 'infra' | 'astral' = 'astral'
  private currentShader: ShaderMode = 'lupton'
  private width: number = 1
  private height: number = 1
  private clock = new THREE.Clock()

  // ── Smooth zoom/pan state ──
  private targetZoom: number = 1
  private targetX: number = 0
  private targetY: number = 0
  private velX: number = 0
  private velY: number = 0
  private readonly lerpSpeed = 0.15      // zoom/pan interpolation (0–1, higher = snappier)
  private readonly friction = 0.92       // velocity decay per frame
  private readonly velThreshold = 0.0001 // stop threshold

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = markRaw(new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    }))
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.camera = markRaw(new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 100))
    this.camera.position.z = 10
    this.scene = markRaw(new THREE.Scene())
  }

  async load(pgc: number, metadata: NSAMetadata): Promise<void> {
    const loader = new THREE.TextureLoader()
    const base = `/galaxy-img/${pgc}/`

    // Load bands needed for all themes: i, r, g (infra) + u (astral blue channel)
    const bandsToLoad = ['i', 'r', 'g']
    if (metadata.bands.includes('u')) bandsToLoad.push('u')
    if (metadata.bands.includes('z')) bandsToLoad.push('z')
    if (metadata.bands.includes('nuv')) bandsToLoad.push('nuv')

    const loaded = await Promise.all(
      bandsToLoad.map(band => loader.loadAsync(`${base}${band}.webp`))
    )

    // Store band data for theme switching and configure textures
    bandsToLoad.forEach((band, idx) => {
      const tex = markRaw(loaded[idx])
      tex.generateMipmaps = true
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      this.textures.push(tex)
      this.bandData[band] = {
        tex,
        range: new THREE.Vector2(metadata.data_ranges[band][0], metadata.data_ranges[band][1]),
      }
    })

    // Compute initial size before material creation (needed for uResolution)
    const width = this.renderer.domElement.parentElement?.clientWidth || window.innerWidth
    const height = this.renderer.domElement.parentElement?.clientHeight || window.innerHeight * 0.6

    // Initial material: astral theme (u→R, g→G, i→B)
    const bd = this.bandData
    this.material = markRaw(new THREE.ShaderMaterial({
      uniforms: {
        uBandR: { value: bd.u?.tex ?? bd.g.tex },
        uBandG: { value: bd.g.tex },
        uBandB: { value: bd.i.tex },
        uAlpha: { value: 0.014 },
        uQ: { value: 20.0 },
        uSensitivity: { value: 0.88 },
        uRangeR: { value: bd.u?.range ?? bd.g.range },
        uRangeG: { value: bd.g.range },
        uRangeB: { value: bd.i.range },
        uGrayscale: { value: 0.0 },
        // Custom shader uniforms (6 named spectral bands)
        uBand_u:   { value: bd.u?.tex   ?? bd.g.tex },
        uBand_g:   { value: bd.g.tex },
        uBand_r:   { value: bd.r.tex },
        uBand_i:   { value: bd.i.tex },
        uBand_z:   { value: bd.z?.tex   ?? bd.i.tex },
        uBand_nuv: { value: bd.nuv?.tex ?? bd.u?.tex ?? bd.g.tex },
        uRange_u:   { value: bd.u?.range   ?? bd.g.range },
        uRange_g:   { value: bd.g.range },
        uRange_r:   { value: bd.r.range },
        uRange_i:   { value: bd.i.range },
        uRange_z:   { value: bd.z?.range   ?? bd.i.range },
        uRange_nuv: { value: bd.nuv?.range ?? bd.u?.range ?? bd.g.range },
        // Theme & Animation
        uTheme: { value: 1.0 },
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(width * this.renderer.getPixelRatio(), height * this.renderer.getPixelRatio()) },
      },
      vertexShader: SHADERS.lupton.vert,
      fragmentShader: SHADERS.lupton.frag,
    }))

    // Create and add mesh
    const geometry = markRaw(new THREE.PlaneGeometry(2, 2))
    this.mesh = markRaw(new THREE.Mesh(geometry, this.material!))
    this.scene.add(this.mesh)

    // Set canvas size and render
    this.resize(width, height)

    // Start animation loop
    this.startAnimation()
  }

  private startAnimation(): void {
    const animate = () => {
      if (this.material) {
        this.material.uniforms.uTime.value = this.clock.getElapsedTime()
      }

      // Apply momentum velocity
      if (Math.abs(this.velX) > this.velThreshold || Math.abs(this.velY) > this.velThreshold) {
        this.targetX += this.velX
        this.targetY += this.velY
        this.velX *= this.friction
        this.velY *= this.friction
      } else {
        this.velX = 0
        this.velY = 0
      }

      // Clamp targets
      const tLimit = Math.max(0, 1 - 1 / this.targetZoom)
      this.targetX = Math.max(-tLimit, Math.min(tLimit, this.targetX))
      this.targetY = Math.max(-tLimit, Math.min(tLimit, this.targetY))

      // Lerp camera toward targets
      const ls = this.lerpSpeed
      this.camera.zoom += (this.targetZoom - this.camera.zoom) * ls
      this.camera.position.x += (this.targetX - this.camera.position.x) * ls
      this.camera.position.y += (this.targetY - this.camera.position.y) * ls
      this.camera.updateProjectionMatrix()

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

  /**
   * Updates rendering parameters for the Lupton composite shader.
   * @param Q - Contrast stretch exponent (higher = sharper transitions)
   * @param alpha - Brightness/softness multiplier
   * @param sensitivity - Black-point cutoff (0 = only brightest pixels, 1 = full range)
   */
  setParams(Q: number, alpha: number, sensitivity: number): void {
    if (this.material) {
      this.material.uniforms.uQ.value = Q
      this.material.uniforms.uAlpha.value = alpha
      this.material.uniforms.uSensitivity.value = sensitivity
      this.render()
    }
  }

  private setBands(r: string, g: string, b: string): void {
    const bd = this.bandData
    if (!this.material || !bd[r] || !bd[g] || !bd[b]) return
    this.material.uniforms.uBandR.value = bd[r].tex
    this.material.uniforms.uBandG.value = bd[g].tex
    this.material.uniforms.uBandB.value = bd[b].tex
    this.material.uniforms.uRangeR.value = bd[r].range
    this.material.uniforms.uRangeG.value = bd[g].range
    this.material.uniforms.uRangeB.value = bd[b].range
  }

  setTheme(themeName: 'grayscale' | 'infra' | 'astral'): void {
    if (!this.material || this.currentTheme === themeName) return

    this.material.uniforms.uGrayscale.value = 0.0

    if (themeName === 'grayscale') {
      this.setBands('i', 'r', 'g')
      this.material.uniforms.uGrayscale.value = 1.0
      this.material.uniforms.uTheme.value = 0.0
    } else if (themeName === 'infra') {
      // Near-IR emphasis: i→R, r→G, g→B
      this.setBands('i', 'r', 'g')
      this.material.uniforms.uTheme.value = 0.0
    } else if (themeName === 'astral') {
      // UV/IR: u→R, g→G, i→B — blue-dominant with purple where UV meets IR
      this.setBands(this.bandData.u ? 'u' : 'g', 'g', 'i')
      this.material.uniforms.uTheme.value = 1.0
    }

    this.currentTheme = themeName
    this.render()
  }

  setShader(mode: ShaderMode): void {
    if (!this.material || this.currentShader === mode) return
    const s = SHADERS[mode]
    this.material.vertexShader = s.vert
    this.material.fragmentShader = s.frag
    this.material.needsUpdate = true
    this.currentShader = mode
    this.render()
  }

  render(): void {
    if (!this.material) return
    this.renderer.render(this.scene, this.camera)
  }

  resize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.renderer.setSize(width, height, false)
    if (this.material) {
      // Use actual device pixel dimensions for correct dither/noise
      const dpr = this.renderer.getPixelRatio()
      this.material.uniforms.uResolution.value.set(width * dpr, height * dpr)
    }
    this.render()
  }

  pan(dx: number, dy: number): void {
    const zoom = this.targetZoom
    const moveX = (dx / this.width) * 2 / zoom
    const moveY = (dy / this.height) * 2 / zoom
    this.targetX -= moveX
    this.targetY += moveY
    // Kill momentum while actively dragging
    this.velX = 0
    this.velY = 0
  }

  /** Add momentum velocity (called on pointer release) */
  fling(vx: number, vy: number): void {
    const zoom = this.targetZoom
    this.velX = -(vx / this.width) * 2 / zoom
    this.velY = (vy / this.height) * 2 / zoom
  }

  zoomAt(factor: number, x: number, y: number): void {
    const oldZoom = this.targetZoom
    const newZoom = Math.max(1, Math.min(oldZoom * factor, 50))

    // Convert screen pixel to NDC (-1 to 1)
    const ndcX = (x / this.width) * 2 - 1
    const ndcY = -(y / this.height) * 2 + 1

    // World point under cursor (use target position, not current)
    const wx = this.targetX + ndcX / oldZoom
    const wy = this.targetY + ndcY / oldZoom

    // Set target zoom and adjust target position to keep world point under cursor
    this.targetZoom = newZoom
    this.targetX = wx - ndcX / newZoom
    this.targetY = wy - ndcY / newZoom

    // Kill momentum on zoom
    this.velX = 0
    this.velY = 0
  }

  /**
   * Converts canvas screen coordinates to RA/Dec sky coordinates.
   *
   * Mapping chain: screen px → NDC → world → UV → FITS pixel → RA/Dec.
   *
   * @param screenX - X position relative to canvas left edge
   * @param screenY - Y position relative to canvas top edge
   * @param meta - NSA metadata with center coords, dimensions, and pixel scale
   * @returns RA/Dec in decimal degrees, or null if the cursor is outside the image
   */
  screenToRaDec(
    screenX: number,
    screenY: number,
    meta: NSAMetadata,
  ): { ra: number; dec: number } | null {
    const zoom = this.camera.zoom

    // Screen px → NDC (-1 .. 1)
    const ndcX = (screenX / this.width) * 2 - 1
    const ndcY = -(screenY / this.height) * 2 + 1

    // NDC → world (account for camera pan + zoom)
    const wx = this.camera.position.x + ndcX / zoom
    const wy = this.camera.position.y + ndcY / zoom

    // World → UV (plane spans -1..1, UV spans 0..1)
    const u = (wx + 1) / 2
    const v = (wy + 1) / 2

    if (u < 0 || u > 1 || v < 0 || v > 1) return null

    // UV → FITS pixel (v is flipped: UV v=0 is bottom, FITS row 0 is top)
    const [imgW, imgH] = meta.dimensions
    const px = u * imgW
    const py = (1 - v) * imgH

    // Pixel offset from image center
    const dx = px - imgW / 2
    const dy = py - imgH / 2

    const scale = (meta.pixel_scale ?? 1.0) / 3600 // arcsec → degrees
    const decRad = (meta.dec * Math.PI) / 180

    const dec = meta.dec - dy * scale
    const ra = meta.ra - (dx * scale) / Math.cos(decRad)

    return { ra, dec }
  }

  resetView(): void {
    this.targetZoom = 1
    this.targetX = 0
    this.targetY = 0
    this.velX = 0
    this.velY = 0
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
