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
import morphVertShader from './shaders/nsamorphology.vert.glsl?raw'
import morphFragShader from './shaders/nsamorphology.frag.glsl?raw'
import {
  applyNsaOrbitDrag,
  buildNsaPointCloud,
  getDefaultNsaPointCloudOptions,
  getInteractionMode,
  type NsaPointBand,
  type NsaShaderMode,
} from './nsa3dPointCloud'
import {
  buildMorphologyPointCloud,
  getDefaultMorphologyOptions,
} from './nsaMorphologyPointCloud'

export type ShaderMode = NsaShaderMode

export interface AutoParams {
  Q: number
  alpha: number
  sensitivity: number
}

/**
 * Computes auto-calibrated rendering parameters from the galaxy's band data
 * ranges so that the asinh stretch knee lands at a useful brightness level
 * regardless of source magnitude.
 *
 * For 3D modes, returns fixed defaults (those modes don't use the image-plane
 * stretch formula).
 */
export function computeAutoParams(metadata: NSAMetadata, mode: ShaderMode): AutoParams {
  if (mode === 'nsa3d') return { Q: 1.0, alpha: 0.05, sensitivity: 0.5 }
  if (mode === 'nsamorphology') return { Q: 5.0, alpha: 0.503, sensitivity: 1.0 }

  const Q = mode === 'custom' ? 20.0 : 10.0
  return { Q, alpha: 0.5, sensitivity: 1.0 }
}

const PLANE_SHADERS: Record<Exclude<ShaderMode, 'nsa3d'>, { vert: string; frag: string }> = {
  lupton: { vert: luptonVertShader, frag: luptonFragShader },
  custom: { vert: nsacustomVertShader, frag: nsacustomFragShader },
  volumetric: { vert: volumetricVertShader, frag: volumetricFragShader },
  nsamorphology: { vert: morphVertShader, frag: morphFragShader },
}

type BandData = Record<string, { tex: THREE.Texture; range: THREE.Vector2 }>

/**
 * Interactive renderer for NSA galaxy composites, supporting both flat
 * image-plane shaders and a heuristic 3D point-cloud view.
 */
export class NSACompositeScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private orthographicCamera: THREE.OrthographicCamera
  private perspectiveCamera: THREE.PerspectiveCamera
  private activeCamera: THREE.Camera
  private planeMaterial: THREE.ShaderMaterial | null = null
  private pointMaterial: THREE.ShaderMaterial | null = null
  private morphMaterial: THREE.ShaderMaterial | null = null
  private mesh: THREE.Mesh | null = null
  private pointCloud: THREE.Points | null = null
  private morphCloud: THREE.Points | null = null
  private textures: THREE.Texture[] = []
  private animationId: number | null = null
  private bandData: BandData = {}
  private currentTheme: 'grayscale' | 'infra' | 'astral' = 'astral'
  private currentShader: ShaderMode = 'lupton'
  private width: number = 1
  private height: number = 1
  private clock = new THREE.Clock()
  private autoParams: AutoParams = { Q: 10.0, alpha: 0.5, sensitivity: 1.0 }

  // ── Smooth zoom/pan state ──
  private targetZoom: number = 1
  private targetX: number = 0
  private targetY: number = 0
  private velX: number = 0
  private velY: number = 0
  private readonly lerpSpeed = 0.15
  private readonly friction = 0.92
  private readonly velThreshold = 0.0001

  // ── Orbit camera state ──
  private orbitYaw: number = 0
  private orbitPitch: number = 0
  private orbitRadius: number = 2.5
  private targetOrbitYaw: number = 0
  private targetOrbitPitch: number = 0
  private targetOrbitRadius: number = 2.5
  private minOrbitRadius: number = 1.1
  private maxOrbitRadius: number = 5.0
  private readonly orbitLerpSpeed = 0.12
  private readonly orbitTarget = markRaw(new THREE.Vector3(0, 0, 0))

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = markRaw(new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    }))
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.orthographicCamera = markRaw(new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 100))
    this.orthographicCamera.position.z = 10
    this.perspectiveCamera = markRaw(new THREE.PerspectiveCamera(48, 1, 0.01, 100))
    this.perspectiveCamera.position.set(0, 0, 2.5)
    this.activeCamera = this.orthographicCamera
    this.scene = markRaw(new THREE.Scene())
  }

  /**
   * Loads spectral textures, prepares the flat composite plane, and builds the
   * heuristic point-cloud representation used by the `nsa3d` mode.
   */
  async load(pgc: number, metadata: NSAMetadata): Promise<void> {
    const loader = new THREE.TextureLoader()
    const base = `/galaxy-img/${pgc}/`

    const bandsToLoad = ['i', 'r', 'g']
    if (metadata.bands.includes('u')) bandsToLoad.push('u')
    if (metadata.bands.includes('z')) bandsToLoad.push('z')
    if (metadata.bands.includes('nuv')) bandsToLoad.push('nuv')

    const loaded = await Promise.all(
      bandsToLoad.map(band => loader.loadAsync(`${base}${band}.webp`)),
    )

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

    const width = this.renderer.domElement.parentElement?.clientWidth || window.innerWidth
    const height = this.renderer.domElement.parentElement?.clientHeight || window.innerHeight * 0.6
    const bd = this.bandData

    this.planeMaterial = markRaw(this.createPlaneMaterial(bd, width, height))
    this.pointMaterial = markRaw(this.createPointMaterial())
    this.morphMaterial = markRaw(this.createMorphMaterial())

    const geometry = markRaw(new THREE.PlaneGeometry(2, 2))
    this.mesh = markRaw(new THREE.Mesh(geometry, this.planeMaterial))
    this.scene.add(this.mesh)

    this.pointCloud = markRaw(this.createPointCloudObject(pgc))
    this.pointCloud.visible = false
    this.scene.add(this.pointCloud)

    this.morphCloud = markRaw(this.createMorphCloudObject(pgc))
    this.morphCloud.visible = false
    this.scene.add(this.morphCloud)

    this.resize(width, height)
    this.applyCurrentShaderMode()
    this.setTheme(this.currentTheme)
    this.autoParams = computeAutoParams(metadata, this.currentShader)
    this.startAnimation()
  }

  /**
   * Creates the shader material used by the 2D image-plane composite modes.
   */
  private createPlaneMaterial(
    bandData: BandData,
    width: number,
    height: number,
  ): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uBandR: { value: bandData.u?.tex ?? bandData.g.tex },
        uBandG: { value: bandData.g.tex },
        uBandB: { value: bandData.i.tex },
        uAlpha: { value: 0.014 },
        uQ: { value: 20.0 },
        uSensitivity: { value: 0.88 },
        uRangeR: { value: bandData.u?.range ?? bandData.g.range },
        uRangeG: { value: bandData.g.range },
        uRangeB: { value: bandData.i.range },
        uGrayscale: { value: 0.0 },
        uBand_u: { value: bandData.u?.tex ?? bandData.g.tex },
        uBand_g: { value: bandData.g.tex },
        uBand_r: { value: bandData.r.tex },
        uBand_i: { value: bandData.i.tex },
        uBand_z: { value: bandData.z?.tex ?? bandData.i.tex },
        uBand_nuv: { value: bandData.nuv?.tex ?? bandData.u?.tex ?? bandData.g.tex },
        uRange_u: { value: bandData.u?.range ?? bandData.g.range },
        uRange_g: { value: bandData.g.range },
        uRange_r: { value: bandData.r.range },
        uRange_i: { value: bandData.i.range },
        uRange_z: { value: bandData.z?.range ?? bandData.i.range },
        uRange_nuv: { value: bandData.nuv?.range ?? bandData.u?.range ?? bandData.g.range },
        uTheme: { value: 1.0 },
        uTime: { value: 0.0 },
        uResolution: {
          value: new THREE.Vector2(width * this.renderer.getPixelRatio(), height * this.renderer.getPixelRatio()),
        },
      },
      vertexShader: PLANE_SHADERS.lupton.vert,
      fragmentShader: PLANE_SHADERS.lupton.frag,
    })
  }

  /**
   * Creates the shader material used by the volumetric `nsa3d` point cloud.
   */
  private createPointMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uAlpha: { value: 1.0 },
        uQ: { value: 20.0 },
        uSensitivity: { value: 1.0 },
        uTheme: { value: 1.0 },
        uGrayscale: { value: 0.0 },
        uTime: { value: 0.0 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
      },
      vertexShader: nsa3dVertShader,
      fragmentShader: nsa3dFragShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }

  /**
   * Creates the shader material for the filamentarity-based morphology cloud.
   */
  private createMorphMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uAlpha: { value: 1.0 },
        uQ: { value: 20.0 },
        uSensitivity: { value: 1.0 },
        uTheme: { value: 1.0 },
        uGrayscale: { value: 0.0 },
        uTime: { value: 0.0 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
      },
      vertexShader: morphVertShader,
      fragmentShader: morphFragShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }

  /**
   * Builds the 3D point cloud from the loaded band textures.
   */
  private createPointCloudObject(seed: number): THREE.Points {
    const bandSamples = this.extractPointCloudBands()
    const cloud = buildNsaPointCloud(
      bandSamples,
      getDefaultNsaPointCloudOptions(bandSamples.width, bandSamples.height, seed),
    )

    const pointCount = cloud.points.length
    const positions = new Float32Array(pointCount * 3)
    const colors = new Float32Array(pointCount * 3)
    const sizes = new Float32Array(pointCount)
    const intensities = new Float32Array(pointCount)
    let maxDistance = 1

    for (let index = 0; index < pointCount; index += 1) {
      const point = cloud.points[index]
      positions[index * 3] = point.x
      positions[index * 3 + 1] = point.y
      positions[index * 3 + 2] = point.z
      colors[index * 3] = point.color[0]
      colors[index * 3 + 1] = point.color[1]
      colors[index * 3 + 2] = point.color[2]
      sizes[index] = point.size
      intensities[index] = point.intensity
      maxDistance = Math.max(maxDistance, Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z))
    }

    const geometry = markRaw(new THREE.BufferGeometry())
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aPosition', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensities, 1))
    geometry.computeBoundingSphere()

    this.minOrbitRadius = Math.max(0.15, maxDistance * 0.2)
    this.maxOrbitRadius = Math.max(4.5, maxDistance * 5.0)
    this.orbitRadius = Math.max(this.minOrbitRadius * 1.4, maxDistance * 1.3)
    this.targetOrbitRadius = this.orbitRadius
    this.perspectiveCamera.near = 0.01
    this.perspectiveCamera.far = this.maxOrbitRadius * 4.0
    this.perspectiveCamera.updateProjectionMatrix()

    return new THREE.Points(geometry, this.pointMaterial ?? undefined)
  }

  /**
   * Builds the morphology-based 3D point cloud using structure tensor
   * filamentarity for depth assignment (Makarenko et al. 2014).
   */
  private createMorphCloudObject(seed: number): THREE.Points {
    const bandSamples = this.extractPointCloudBands()
    const cloud = buildMorphologyPointCloud(
      bandSamples,
      getDefaultMorphologyOptions(bandSamples.width, bandSamples.height, seed),
    )

    const pointCount = cloud.points.length
    const positions = new Float32Array(pointCount * 3)
    const colors = new Float32Array(pointCount * 3)
    const sizes = new Float32Array(pointCount)
    const intensities = new Float32Array(pointCount)
    const filamentarities = new Float32Array(pointCount)

    for (let index = 0; index < pointCount; index += 1) {
      const point = cloud.points[index]
      positions[index * 3] = point.x
      positions[index * 3 + 1] = point.y
      positions[index * 3 + 2] = point.z
      colors[index * 3] = point.color[0]
      colors[index * 3 + 1] = point.color[1]
      colors[index * 3 + 2] = point.color[2]
      sizes[index] = point.size
      intensities[index] = point.intensity
      filamentarities[index] = point.filamentarity
    }

    const geometry = markRaw(new THREE.BufferGeometry())
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aPosition', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensities, 1))
    geometry.setAttribute('aFilamentarity', new THREE.BufferAttribute(filamentarities, 1))
    geometry.computeBoundingSphere()

    return new THREE.Points(geometry, this.morphMaterial ?? undefined)
  }

  /**
   * Extracts normalized 0..1 grayscale band samples from the loaded textures.
   */
  private extractPointCloudBands(): {
    width: number
    height: number
    bands: Record<NsaPointBand, Float32Array>
  } {
    const resolveBand = (band: NsaPointBand): string => {
      if (this.bandData[band]) return band
      if (band === 'u') return 'g'
      if (band === 'z') return 'i'
      return this.bandData.u ? 'u' : 'g'
    }

    const imageSource = this.bandData.i.tex.image as CanvasImageSource
    const width = getImageWidth(imageSource)
    const height = getImageHeight(imageSource)

    return {
      width,
      height,
      bands: {
        u: this.extractSingleBand(resolveBand('u')),
        g: this.extractSingleBand(resolveBand('g')),
        r: this.extractSingleBand(resolveBand('r')),
        i: this.extractSingleBand(resolveBand('i')),
        z: this.extractSingleBand(resolveBand('z')),
        nuv: this.extractSingleBand(resolveBand('nuv')),
      },
    }
  }

  /**
   * Converts a loaded texture into normalized grayscale pixel data.
   */
  private extractSingleBand(bandName: string): Float32Array {
    const texture = this.bandData[bandName].tex
    const image = texture.image as CanvasImageSource
    const width = getImageWidth(image)
    const height = getImageHeight(image)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      throw new Error(`Unable to create 2D context for band '${bandName}'`)
    }

    ctx.drawImage(image, 0, 0, width, height)
    const imageData = ctx.getImageData(0, 0, width, height).data
    const result = new Float32Array(width * height)

    for (let src = 0, dst = 0; src < imageData.length; src += 4, dst += 1) {
      result[dst] = (imageData[src] + imageData[src + 1] + imageData[src + 2]) / (3 * 255)
    }

    return result
  }

  /**
   * Applies the currently selected shader mode by toggling visibility, camera,
   * and shader programs for the plane or point-cloud path.
   */
  private applyCurrentShaderMode(): void {
    const interactionMode = getInteractionMode(this.currentShader)
    const usePointCloud = interactionMode === 'orbit'
    this.activeCamera = usePointCloud ? this.perspectiveCamera : this.orthographicCamera

    if (this.mesh) {
      this.mesh.visible = !usePointCloud
    }
    if (this.pointCloud) {
      this.pointCloud.visible = this.currentShader === 'nsa3d'
    }
    if (this.morphCloud) {
      this.morphCloud.visible = this.currentShader === 'nsamorphology'
    }

    if (!usePointCloud && this.planeMaterial) {
      const shader = PLANE_SHADERS[this.currentShader as Exclude<ShaderMode, 'nsa3d' | 'nsamorphology'>]
      this.planeMaterial.vertexShader = shader.vert
      this.planeMaterial.fragmentShader = shader.frag
      this.planeMaterial.needsUpdate = true
    }
  }

  /**
   * Starts the render loop and updates the active camera model.
   */
  private startAnimation(): void {
    const animate = () => {
      const elapsed = this.clock.getElapsedTime()
      if (this.planeMaterial) {
        this.planeMaterial.uniforms.uTime.value = elapsed
      }
      if (this.pointMaterial) {
        this.pointMaterial.uniforms.uTime.value = elapsed
      }
      if (this.morphMaterial) {
        this.morphMaterial.uniforms.uTime.value = elapsed
      }

      if (getInteractionMode(this.currentShader) === 'image-plane') {
        if (Math.abs(this.velX) > this.velThreshold || Math.abs(this.velY) > this.velThreshold) {
          this.targetX += this.velX
          this.targetY += this.velY
          this.velX *= this.friction
          this.velY *= this.friction
        } else {
          this.velX = 0
          this.velY = 0
        }

        const tLimit = Math.max(0, 1 - 1 / this.targetZoom)
        this.targetX = Math.max(-tLimit, Math.min(tLimit, this.targetX))
        this.targetY = Math.max(-tLimit, Math.min(tLimit, this.targetY))

        const ls = this.lerpSpeed
        this.orthographicCamera.zoom += (this.targetZoom - this.orthographicCamera.zoom) * ls
        this.orthographicCamera.position.x += (this.targetX - this.orthographicCamera.position.x) * ls
        this.orthographicCamera.position.y += (this.targetY - this.orthographicCamera.position.y) * ls
        this.orthographicCamera.updateProjectionMatrix()
      } else {
        this.updateOrbitCamera()
      }

      this.render()
      this.animationId = requestAnimationFrame(animate)
    }

    this.animationId = requestAnimationFrame(animate)
  }

  /**
   * Smoothly updates the perspective camera for orbit-based interaction.
   */
  private updateOrbitCamera(): void {
    this.targetOrbitPitch = THREE.MathUtils.clamp(this.targetOrbitPitch, -1.25, 1.25)
    this.targetOrbitRadius = THREE.MathUtils.clamp(
      this.targetOrbitRadius,
      this.minOrbitRadius,
      this.maxOrbitRadius,
    )

    const ls = this.orbitLerpSpeed
    this.orbitYaw += (this.targetOrbitYaw - this.orbitYaw) * ls
    this.orbitPitch += (this.targetOrbitPitch - this.orbitPitch) * ls
    this.orbitRadius += (this.targetOrbitRadius - this.orbitRadius) * ls

    const cosPitch = Math.cos(this.orbitPitch)
    this.perspectiveCamera.position.set(
      Math.sin(this.orbitYaw) * cosPitch * this.orbitRadius,
      Math.sin(this.orbitPitch) * this.orbitRadius,
      Math.cos(this.orbitYaw) * cosPitch * this.orbitRadius,
    )
    this.perspectiveCamera.lookAt(this.orbitTarget)
    this.perspectiveCamera.updateProjectionMatrix()
  }

  /**
   * Stops the requestAnimationFrame loop.
   */
  private stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  /**
   * Updates rendering parameters for both flat and 3D shader modes.
   */
  setParams(Q: number, alpha: number, sensitivity: number): void {
    if (this.planeMaterial) {
      this.planeMaterial.uniforms.uQ.value = Q
      this.planeMaterial.uniforms.uAlpha.value = alpha
      this.planeMaterial.uniforms.uSensitivity.value = sensitivity
    }
    if (this.pointMaterial) {
      this.pointMaterial.uniforms.uQ.value = Q
      this.pointMaterial.uniforms.uAlpha.value = alpha
      this.pointMaterial.uniforms.uSensitivity.value = sensitivity
    }
    if (this.morphMaterial) {
      this.morphMaterial.uniforms.uQ.value = Q
      this.morphMaterial.uniforms.uAlpha.value = alpha
      this.morphMaterial.uniforms.uSensitivity.value = sensitivity
    }
    this.render()
  }

  /**
   * Updates the three-band mapping used by the flat composite shader themes.
   */
  private setBands(r: string, g: string, b: string): void {
    const bd = this.bandData
    if (!this.planeMaterial || !bd[r] || !bd[g] || !bd[b]) return
    this.planeMaterial.uniforms.uBandR.value = bd[r].tex
    this.planeMaterial.uniforms.uBandG.value = bd[g].tex
    this.planeMaterial.uniforms.uBandB.value = bd[b].tex
    this.planeMaterial.uniforms.uRangeR.value = bd[r].range
    this.planeMaterial.uniforms.uRangeG.value = bd[g].range
    this.planeMaterial.uniforms.uRangeB.value = bd[b].range
  }

  /**
   * Updates spectral theme controls for both flat and 3D render paths.
   */
  setTheme(themeName: 'grayscale' | 'infra' | 'astral'): void {
    if ((!this.planeMaterial && !this.pointMaterial) || this.currentTheme === themeName) return

    const allMats = [this.planeMaterial, this.pointMaterial, this.morphMaterial].filter(Boolean) as THREE.ShaderMaterial[]
    for (const mat of allMats) {
      mat.uniforms.uGrayscale.value = 0.0
    }

    if (themeName === 'grayscale') {
      this.setBands('i', 'r', 'g')
      for (const mat of allMats) {
        mat.uniforms.uGrayscale.value = 1.0
        mat.uniforms.uTheme.value = 0.0
      }
    } else if (themeName === 'infra') {
      this.setBands('i', 'r', 'g')
      for (const mat of allMats) {
        mat.uniforms.uTheme.value = 0.0
      }
    } else if (themeName === 'astral') {
      this.setBands(this.bandData.u ? 'u' : 'g', 'g', 'i')
      for (const mat of allMats) {
        mat.uniforms.uTheme.value = 1.0
      }
    }

    this.currentTheme = themeName
    this.render()
  }

  /**
   * Returns the auto-calibrated params computed from metadata on load.
   */
  getAutoParams(): AutoParams {
    return this.autoParams
  }

  /**
   * Switches between flat composite shader programs and the 3D point-cloud mode.
   */
  setShader(mode: ShaderMode): void {
    if ((!this.planeMaterial && !this.pointMaterial) || this.currentShader === mode) return
    this.currentShader = mode
    this.applyCurrentShaderMode()
    this.render()
  }

  /**
   * Returns whether the active mode uses orbit-style 3D interaction.
   */
  is3DMode(): boolean {
    return getInteractionMode(this.currentShader) === 'orbit'
  }

  /**
   * Returns whether screen coordinates can be mapped back to image-plane UVs.
   */
  supportsSkyPicking(): boolean {
    return getInteractionMode(this.currentShader) === 'image-plane'
  }

  /**
   * Renders the active camera view.
   */
  render(): void {
    if (!this.planeMaterial && !this.pointMaterial && !this.morphMaterial) return
    this.renderer.render(this.scene, this.activeCamera)
  }

  /**
   * Resizes the renderer and updates camera-dependent uniforms.
   */
  resize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.renderer.setSize(width, height, false)
    if (this.planeMaterial) {
      const dpr = this.renderer.getPixelRatio()
      this.planeMaterial.uniforms.uResolution.value.set(width * dpr, height * dpr)
    }
    if (this.pointMaterial) {
      this.pointMaterial.uniforms.uPixelRatio.value = this.renderer.getPixelRatio()
    }
    if (this.morphMaterial) {
      this.morphMaterial.uniforms.uPixelRatio.value = this.renderer.getPixelRatio()
    }
    this.perspectiveCamera.aspect = width / Math.max(height, 1)
    this.perspectiveCamera.updateProjectionMatrix()
    this.render()
  }

  /**
   * Pans the flat image-plane camera.
   */
  pan(dx: number, dy: number): void {
    if (this.is3DMode()) return
    const zoom = this.targetZoom
    const moveX = (dx / this.width) * 2 / zoom
    const moveY = (dy / this.height) * 2 / zoom
    this.targetX -= moveX
    this.targetY += moveY
    this.velX = 0
    this.velY = 0
  }

  /**
   * Adds momentum to the flat image-plane camera after drag release.
   */
  fling(vx: number, vy: number): void {
    if (this.is3DMode()) return
    const zoom = this.targetZoom
    this.velX = -(vx / this.width) * 2 / zoom
    this.velY = (vy / this.height) * 2 / zoom
  }

  /**
   * Zooms the flat image plane while preserving the point beneath the cursor.
   */
  zoomAt(factor: number, x: number, y: number): void {
    if (this.is3DMode()) return
    const oldZoom = this.targetZoom
    const newZoom = Math.max(1, Math.min(oldZoom * factor, 50))

    const ndcX = (x / this.width) * 2 - 1
    const ndcY = -(y / this.height) * 2 + 1
    const wx = this.targetX + ndcX / oldZoom
    const wy = this.targetY + ndcY / oldZoom

    this.targetZoom = newZoom
    this.targetX = wx - ndcX / newZoom
    this.targetY = wy - ndcY / newZoom
    this.velX = 0
    this.velY = 0
  }

  /**
   * Rotates the 3D point cloud camera around the galaxy center.
   */
  orbit(deltaX: number, deltaY: number): void {
    if (!this.is3DMode()) return
    const nextOrbit = applyNsaOrbitDrag(
      {
        yaw: this.targetOrbitYaw,
        pitch: this.targetOrbitPitch,
      },
      deltaX,
      deltaY,
    )
    this.targetOrbitYaw = nextOrbit.yaw
    this.targetOrbitPitch = nextOrbit.pitch
  }

  /**
   * Dollies the 3D camera toward or away from the point cloud.
   */
  dolly(factor: number): void {
    if (!this.is3DMode()) return
    const nextRadius = this.targetOrbitRadius / Math.max(factor, 0.01)
    this.targetOrbitRadius = THREE.MathUtils.clamp(nextRadius, this.minOrbitRadius, this.maxOrbitRadius)
  }

  /**
   * Converts canvas screen coordinates to RA/Dec sky coordinates.
   */
  screenToRaDec(
    screenX: number,
    screenY: number,
    meta: NSAMetadata,
  ): { ra: number; dec: number } | null {
    if (!this.supportsSkyPicking()) {
      return null
    }

    const zoom = this.orthographicCamera.zoom
    const ndcX = (screenX / this.width) * 2 - 1
    const ndcY = -(screenY / this.height) * 2 + 1
    const wx = this.orthographicCamera.position.x + ndcX / zoom
    const wy = this.orthographicCamera.position.y + ndcY / zoom
    const u = (wx + 1) / 2
    const v = (wy + 1) / 2

    if (u < 0 || u > 1 || v < 0 || v > 1) return null

    const [imgW, imgH] = meta.dimensions
    const px = u * imgW
    const py = (1 - v) * imgH
    const dx = px - imgW / 2
    const dy = py - imgH / 2
    const scale = (meta.pixel_scale ?? 0.396) / 3600  // SDSS standard fallback
    const decRad = (meta.dec * Math.PI) / 180
    const dec = meta.dec - dy * scale
    const ra = meta.ra - (dx * scale) / Math.cos(decRad)

    return { ra, dec }
  }

  /**
   * Resets the current interaction state for the active render path.
   */
  resetView(): void {
    if (this.is3DMode()) {
      this.targetOrbitYaw = 0
      this.targetOrbitPitch = 0
      this.targetOrbitRadius = Math.max(this.minOrbitRadius * 1.4, 1.5)
      return
    }

    this.targetZoom = 1
    this.targetX = 0
    this.targetY = 0
    this.velX = 0
    this.velY = 0
  }

  /**
   * Releases WebGL resources created by the scene.
   */
  dispose(): void {
    this.stopAnimation()
    this.textures.forEach((tex) => tex.dispose())
    this.textures = []

    if (this.planeMaterial) {
      this.planeMaterial.dispose()
    }
    if (this.pointMaterial) {
      this.pointMaterial.dispose()
    }
    if (this.morphMaterial) {
      this.morphMaterial.dispose()
    }
    if (this.mesh?.geometry) {
      this.mesh.geometry.dispose()
    }
    if (this.pointCloud?.geometry) {
      this.pointCloud.geometry.dispose()
    }
    if (this.morphCloud?.geometry) {
      this.morphCloud.geometry.dispose()
    }
    this.renderer.dispose()
  }
}

/**
 * Returns the rendered width of an image source.
 */
function getImageWidth(source: CanvasImageSource): number {
  const sized = source as { naturalWidth?: number; videoWidth?: number; width?: number }
  return sized.naturalWidth ?? sized.videoWidth ?? sized.width ?? 0
}

/**
 * Returns the rendered height of an image source.
 */
function getImageHeight(source: CanvasImageSource): number {
  const sized = source as { naturalHeight?: number; videoHeight?: number; height?: number }
  return sized.naturalHeight ?? sized.videoHeight ?? sized.height ?? 0
}
