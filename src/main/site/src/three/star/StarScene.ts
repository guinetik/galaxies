import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GalaxyBackdrop } from '../galaxy-detail/GalaxyBackdrop'

// Common GLSL libraries
import noiseLib from './shaders/noise.glsl?raw'
import colorLib from './shaders/color.glsl?raw'
import seedLib from './shaders/seed.glsl?raw'
import lightingLib from './shaders/lighting.glsl?raw'

// Star shaders (includes removed — we prepend libs above)
import surfaceVert from './shaders/surface.vert.glsl?raw'
import surfaceFrag from './shaders/surface.frag.glsl?raw'
import coronaVert from './shaders/corona.vert.glsl?raw'
import coronaFrag from './shaders/corona.frag.glsl?raw'
import raysVert from './shaders/rays.vert.glsl?raw'
import raysFrag from './shaders/rays.frag.glsl?raw'
import flameTonguesVert from './shaders/flameTongues.vert.glsl?raw'
import flameTonguesFrag from './shaders/flameTongues.frag.glsl?raw'
import flareVert from './shaders/flare.vert.glsl?raw'
import flareFrag from './shaders/flare.frag.glsl?raw'

import {
  createStarUniforms,
  STAR_RENDERING,
  generateSeed,
  type StarShaderUniforms,
} from './StarUniforms'
import type { PlanetarySystem } from './PlanetGenerator'
import {
  mapPlanetToShaderType,
  getPlanetVertexShader,
  getPlanetFragmentShader,
  createPlanetUniforms,
} from './PlanetUniforms'

// Number of solar flare sites
const NUM_FLARES = 4
const FLARE_CYCLE_DURATION = 60
const MIN_FLARE_SIZE = 1.0

interface FlareData {
  angle: number
  elevation: number
  phase: number
  speed: number
  size: number
  direction: THREE.Vector3
  quaternion: THREE.Quaternion
}

export class StarScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private backdrop: GalaxyBackdrop
  private clock = new THREE.Clock()
  private animationId = 0

  // Shader materials (for uniform updates)
  private surfaceMaterial!: THREE.ShaderMaterial
  private coronaMaterial!: THREE.ShaderMaterial
  private raysMaterial!: THREE.ShaderMaterial
  private flameTonguesMaterial!: THREE.ShaderMaterial
  private glowMaterial!: THREE.ShaderMaterial

  // Flares
  private flareMeshes: THREE.Mesh[] = []
  private flareMaterials: THREE.ShaderMaterial[] = []
  private flareData: FlareData[] = []

  // Star group (for rotation)
  private starGroup: THREE.Group
  private raysMesh!: THREE.Mesh
  private glowMesh!: THREE.Mesh

  // Planets
  private planetGroup: THREE.Group
  private planetMaterials: THREE.ShaderMaterial[] = []
  private planetOrbitalData: Array<{ sceneRadius: number; speed: number }> = []

  private uniforms: StarShaderUniforms

  constructor(
    canvas: HTMLCanvasElement,
    spClass: string,
    teff: number | null,
    starName: string,
  ) {
    this.uniforms = createStarUniforms(spClass, teff, starName)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    })
    // Cap DPR — at 4K native res, supersampling is invisible but halves FPS
    const physicalW = window.screen.width * window.devicePixelRatio
    const maxDpr = physicalW > 3000 ? 1.0 : 2.0
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0

    // Scene
    this.scene = new THREE.Scene()

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      2000,
    )
    this.camera.position.set(0, 8, 14)

    // Controls
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 2
    this.controls.maxDistance = 25
    this.controls.enablePan = false

    // Star group
    this.starGroup = new THREE.Group()
    this.scene.add(this.starGroup)

    this.planetGroup = new THREE.Group()
    this.scene.add(this.planetGroup)

    // Build star layers
    this.buildSurface()
    this.buildCorona()
    this.buildFlameTongues()
    this.buildFlares(starName)
    this.buildRays()
    this.buildGlow()

    // Point light
    const light = new THREE.PointLight(
      this.uniforms.surface.uStarColor.value as THREE.Color,
      STAR_RENDERING.LIGHT_INTENSITY,
      STAR_RENDERING.LIGHT_DISTANCE,
    )
    this.starGroup.add(light)

    // Backdrop
    const seed = generateSeed(starName)
    this.backdrop = new GalaxyBackdrop(10, seed, 'desktop')
    this.scene.add(this.backdrop.mesh)
  }

  // ── Build methods ────────────────────────────────────────────────────

  private buildSurface(): void {
    const geo = new THREE.SphereGeometry(1, 48, 32)
    const vertSrc = noiseLib + colorLib + seedLib + surfaceVert
    const fragSrc = noiseLib + colorLib + lightingLib + seedLib + surfaceFrag
    this.surfaceMaterial = new THREE.ShaderMaterial({
      vertexShader: vertSrc,
      fragmentShader: fragSrc,
      uniforms: this.uniforms.surface,
    })
    this.starGroup.add(new THREE.Mesh(geo, this.surfaceMaterial))
  }

  private buildCorona(): void {
    const geo = new THREE.SphereGeometry(STAR_RENDERING.CORONA_SCALE, 32, 24)
    const fragSrc = noiseLib + colorLib + seedLib + coronaFrag
    this.coronaMaterial = new THREE.ShaderMaterial({
      vertexShader: coronaVert,
      fragmentShader: fragSrc,
      uniforms: this.uniforms.corona,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    })
    this.starGroup.add(new THREE.Mesh(geo, this.coronaMaterial))
  }

  private buildFlameTongues(): void {
    const geo = new THREE.SphereGeometry(STAR_RENDERING.FLAME_TONGUES_SCALE, 32, 24)
    const fragSrc = noiseLib + colorLib + seedLib + flameTonguesFrag
    this.flameTonguesMaterial = new THREE.ShaderMaterial({
      vertexShader: flameTonguesVert,
      fragmentShader: fragSrc,
      uniforms: this.uniforms.flameTongues,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    })
    this.starGroup.add(new THREE.Mesh(geo, this.flameTonguesMaterial))
  }

  private buildFlares(starName: string): void {
    const starSeed = generateSeed(starName)
    const starRadius = 1

    // Generate flare positions (ported from SolarFlares.tsx)
    for (let i = 0; i < NUM_FLARES; i++) {
      const seed = starSeed + i * 0.1
      const angle = generateSeed(`${seed}-angle`) * Math.PI * 2
      const elevation = (generateSeed(`${seed}-elev`) - 0.5) * Math.PI * 0.8
      const phase = generateSeed(`${seed}-phase`) * Math.PI * 2
      const speed = 0.7 + generateSeed(`${seed}-speed`) * 0.6
      const size = 0.8 + generateSeed(`${seed}-size`) * 0.4

      // Position on sphere surface
      const x = Math.cos(elevation) * Math.cos(angle)
      const y = Math.sin(elevation)
      const z = Math.cos(elevation) * Math.sin(angle)
      const direction = new THREE.Vector3(x, y, z)
      const position = direction.clone().multiplyScalar(starRadius * 1.05)
      const quaternion = new THREE.Quaternion()
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)

      this.flareData.push({ angle, elevation, phase, speed, size, direction, quaternion })

      // Create mesh
      const geo = new THREE.PlaneGeometry(
        Math.max(starRadius * 0.25 * size, MIN_FLARE_SIZE),
        Math.max(starRadius * 0.35 * size, MIN_FLARE_SIZE * 1.4),
      )
      const fragSrc = noiseLib + colorLib + seedLib + flareFrag
      const mat = new THREE.ShaderMaterial({
        vertexShader: flareVert,
        fragmentShader: fragSrc,
        uniforms: {
          uStarColor: this.uniforms.surface.uStarColor,
          uTime: { value: 0 },
          uFlarePhase: { value: 0 },
          uFlareLength: { value: Math.max(starRadius * 0.3 * size, MIN_FLARE_SIZE) },
          uFlareSeed: { value: phase },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(position)
      mesh.quaternion.copy(quaternion)

      this.flareMeshes.push(mesh)
      this.flareMaterials.push(mat)
      this.starGroup.add(mesh)
    }
  }

  private buildRays(): void {
    const geo = new THREE.PlaneGeometry(
      2 * STAR_RENDERING.RAYS_SIZE,
      2 * STAR_RENDERING.RAYS_SIZE,
    )
    const fragSrc = colorLib + seedLib + raysFrag
    this.raysMaterial = new THREE.ShaderMaterial({
      vertexShader: raysVert,
      fragmentShader: fragSrc,
      uniforms: this.uniforms.rays,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.raysMesh = new THREE.Mesh(geo, this.raysMaterial)
    this.starGroup.add(this.raysMesh)
  }

  private buildGlow(): void {
    const geo = new THREE.PlaneGeometry(
      2 * STAR_RENDERING.GLOW_SIZE,
      2 * STAR_RENDERING.GLOW_SIZE,
    )
    this.glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uTime;
        uniform float uSeed;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float angle = atan(center.y, center.x);
          float circularMask = 1.0 - smoothstep(0.35, 0.5, dist);
          float rotAngle = angle + uTime * 0.5;
          float n1 = noise(vec2(rotAngle * 3.0, dist * 8.0 + uTime * 0.3 + uSeed));
          float n2 = noise(vec2(rotAngle * 5.0 + 10.0, dist * 12.0 - uTime * 0.2));
          float noiseVal = n1 * 0.6 + n2 * 0.4;
          float glow = exp(-dist * dist * 12.0);
          glow *= 0.85 + noiseVal * 0.25;
          float pulse = 1.0 + sin(uTime * 0.8 + uSeed * 6.28) * 0.08;
          float clampedIntensity = clamp(uIntensity, 0.7, 1.8);
          glow = glow * clampedIntensity * 0.7 * pulse * circularMask;
          gl_FragColor = vec4(uColor, glow);
        }
      `,
      uniforms: this.uniforms.glow,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.glowMesh = new THREE.Mesh(geo, this.glowMaterial)
    this.starGroup.add(this.glowMesh)
  }

  /** Add planets to the scene from a generated system */
  setPlanets(system: PlanetarySystem): void {
    // Clear existing planets
    while (this.planetGroup.children.length > 0) {
      const child = this.planetGroup.children[0]
      this.planetGroup.remove(child)
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (child.material instanceof THREE.Material) child.material.dispose()
      }
      if (child instanceof THREE.LineLoop) {
        child.geometry.dispose()
        if (child.material instanceof THREE.Material) child.material.dispose()
      }
    }
    this.planetMaterials = []
    this.planetOrbitalData = []

    const starTeff = system.host.teff ?? 5800

    // Shared geometry and materials — reduce GPU state changes
    const sharedPlanetGeo = new THREE.SphereGeometry(1, 16, 12)
    const sharedRingMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
    })

    system.planets.forEach((planet, index) => {
      // Visual sizing (logarithmic scale per spec)
      let visualRadius: number
      if (planet.type === 'GasGiant') {
        visualRadius = 0.25 + (planet.radius - 8) / (12 - 8) * 0.15
      } else if (planet.type === 'SubNeptune') {
        visualRadius = 0.12 + (planet.radius - 1.7) / (3.5 - 1.7) * 0.08
      } else {
        visualRadius = 0.08 + (planet.radius - 0.8) / (1.5 - 0.8) * 0.04
      }
      visualRadius = Math.max(0.06, Math.min(0.4, visualRadius))

      // Scene positioning (log-compressed)
      const sceneRadius = 3.5 + (Math.log10(planet.semiMajorAxis + 0.1) + 1.0) * 3.0

      // Orbital speed (inversely proportional to period)
      const speed = planet.orbitalPeriod > 0 ? 0.3 / planet.orbitalPeriod : 0.1

      // Shader setup
      const shaderType = mapPlanetToShaderType(planet)
      const planetSeed = (index + 1) * 0.137
      const uniforms = createPlanetUniforms(planet, shaderType, planetSeed, starTeff)

      const material = new THREE.ShaderMaterial({
        vertexShader: getPlanetVertexShader(),
        fragmentShader: getPlanetFragmentShader(shaderType),
        uniforms,
      })

      // Planet mesh — shared geometry, scaled per planet
      const mesh = new THREE.Mesh(sharedPlanetGeo, material)
      mesh.scale.setScalar(visualRadius)

      // Initial position (golden angle spread)
      const startAngle = index * 2.399
      mesh.position.set(
        Math.cos(startAngle) * sceneRadius,
        0,
        Math.sin(startAngle) * sceneRadius,
      )

      this.planetGroup.add(mesh)
      this.planetMaterials.push(material)
      this.planetOrbitalData.push({ sceneRadius, speed })

      // Orbit ring
      const ringSegments = 64
      const ringGeo = new THREE.BufferGeometry()
      const ringPoints = new Float32Array((ringSegments + 1) * 3)
      for (let i = 0; i <= ringSegments; i++) {
        const angle = (i / ringSegments) * Math.PI * 2
        ringPoints[i * 3] = Math.cos(angle) * sceneRadius
        ringPoints[i * 3 + 1] = 0
        ringPoints[i * 3 + 2] = Math.sin(angle) * sceneRadius
      }
      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPoints, 3))
      this.planetGroup.add(new THREE.LineLoop(ringGeo, sharedRingMat))
    })
  }

  // ── Animation ────────────────────────────────────────────────────────

  start(): void {
    this.clock.start()
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      const elapsed = this.clock.getElapsedTime()
      this.update(elapsed)
      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }

  private update(time: number): void {
    this.controls.update()

    // Billboard rays and glow to face camera
    this.raysMesh.quaternion.copy(this.camera.quaternion)
    this.glowMesh.quaternion.copy(this.camera.quaternion)

    // Update all shader time uniforms
    this.surfaceMaterial.uniforms.uTime.value = time
    this.coronaMaterial.uniforms.uTime.value = time
    this.raysMaterial.uniforms.uTime.value = time
    this.flameTonguesMaterial.uniforms.uTime.value = time
    this.glowMaterial.uniforms.uTime.value = time

    // Animate flares (ported from SolarFlares.tsx useFrame)
    for (let i = 0; i < NUM_FLARES; i++) {
      const data = this.flareData[i]
      const mat = this.flareMaterials[i]
      const mesh = this.flareMeshes[i]

      const cycleTime = (time * data.speed + data.phase) % FLARE_CYCLE_DURATION
      const phase = cycleTime / FLARE_CYCLE_DURATION
      const activeThreshold = 1.0 - (this.uniforms.surface.uActivityLevel.value as number) * 0.15
      const isActive = phase > activeThreshold
      const activePhase = isActive ? (phase - activeThreshold) / (1.0 - activeThreshold) : 0

      // Move flare outward
      let travelDistance = 1.0
      if (activePhase < 0.6) {
        travelDistance = 1.0 + activePhase * 0.33
      } else {
        const escapePhase = (activePhase - 0.6) / 0.4
        travelDistance = 1.2 + escapePhase * escapePhase * 10.0
      }
      mesh.position.copy(data.direction).multiplyScalar(travelDistance)

      mat.uniforms.uTime.value = time
      mat.uniforms.uFlarePhase.value = activePhase
    }

    // Backdrop follows camera
    this.backdrop.update(time, this.camera)

    // Animate planets
    let meshIndex = 0
    for (let i = 0; i < this.planetGroup.children.length; i++) {
      const child = this.planetGroup.children[i]
      if (child instanceof THREE.Mesh && this.planetOrbitalData[meshIndex]) {
        const data = this.planetOrbitalData[meshIndex]
        const angle = time * data.speed + meshIndex * 2.399
        child.position.set(
          Math.cos(angle) * data.sceneRadius,
          0,
          Math.sin(angle) * data.sceneRadius,
        )
        child.rotation.y = time * 0.2
        if (this.planetMaterials[meshIndex]) {
          this.planetMaterials[meshIndex].uniforms.uTime.value = time
        }
        meshIndex++
      }
    }
  }

  // ── Lifecycle ────────────────────────────────────────────────────────

  resize(width: number, height: number): void {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  dispose(): void {
    cancelAnimationFrame(this.animationId)
    this.controls.dispose()
    this.backdrop.dispose()
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (obj.material instanceof THREE.Material) obj.material.dispose()
      }
    })
    this.renderer.dispose()
  }
}
