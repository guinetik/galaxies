import * as THREE from 'three'
import vertexShader from './shaders/backdrop.vert.glsl?raw'
import fragmentShader from './shaders/backdrop.frag.glsl?raw'
import type { Quality } from './qualityDetect'
import { CINEMATIC } from './cinematicAppearance'

/**
 * Camera-centered procedural sky shell for the WebGL galaxy scene.
 * It provides distant nebulae and stars without interfering with the
 * galaxy-local haze, disk nebula, or black hole layers.
 */
export class GalaxyBackdrop {
  readonly mesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private cachedMaterial: THREE.ShaderMaterial | null = null
  private cache: THREE.WebGLCubeRenderTarget | null = null
  private readonly cacheSize: number

  /**
   * Creates a background sphere sized to stay inside the scene far plane.
   */
  constructor(baseDistance: number, seed: number, quality: Quality) {
    this.cacheSize = quality === 'mobile' ? 512 : 2048
    const radius = baseDistance * 12
    const isMobile = quality === 'mobile'
    const segments = isMobile ? [48, 32] : [192, 128]
    const geometry = new THREE.SphereGeometry(radius, segments[0], segments[1])

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      defines: {
        BACKDROP_CACHE: 1,
        SPIRAL_NOISE_ITER:  isMobile ? 3 : 5,
        MAX_GALAXIES:       isMobile ? 2 : 4,
        MAX_CLOUDS:         isMobile ? 3 : 6,
        MAX_KNOTS:          isMobile ? 2 : 5,
        STAR_LAYERS:        isMobile ? 2 : 4,
        FBM_DETAIL_OCTAVES: isMobile ? 2 : 4,
      },
      uniforms: {
        uTime: { value: 0 },
        uSeed: { value: seed },
        uNebulaIntensity: { value: CINEMATIC.nebulaIntensity },
      },
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
    })

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -10
  }

  /** Bake display-encoded RGBA8 once, then decode to linear when sampling. */
  prepare(renderer: THREE.WebGLRenderer): void {
    if (this.cache) return
    this.cache = new THREE.WebGLCubeRenderTarget(this.cacheSize, { depthBuffer: false, generateMipmaps: false })
    const bakeScene = new THREE.Scene()
    bakeScene.add(new THREE.Mesh(this.mesh.geometry, this.material))
    const radius = this.mesh.geometry.boundingSphere?.radius ?? 1e6
    new THREE.CubeCamera(0.1, radius * 2, this.cache).update(renderer, bakeScene)
    this.cachedMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: `uniform samplerCube uSky;
        varying vec3 vDirection;
        void main() { gl_FragColor = vec4(pow(textureCube(uSky, normalize(vDirection)).rgb, vec3(2.2)), 1.0); }`,
      uniforms: { uSky: { value: this.cache.texture } },
      side: THREE.BackSide, depthWrite: false, depthTest: false,
    })
    this.mesh.material = this.cachedMaterial
    this.material.dispose()
  }

  /**
   * Keeps the shell centered on the camera so it behaves like a distant skybox.
   */
  update(_time: number, camera: THREE.PerspectiveCamera): void {
    this.mesh.position.copy(camera.position)
  }

  /**
   * Releases GPU resources owned by the backdrop.
   */
  dispose(): void {
    this.material.dispose()
    this.cachedMaterial?.dispose()
    this.cache?.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
  }
}
