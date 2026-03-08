<template>
  <div ref="container" class="fixed inset-0 -z-10 bg-black"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { generateGalaxyTextureAtlas, ATLAS_ORDER } from '@/three/GalaxyTextures'
import galaxyVertShader from '@/three/shaders/galaxy.vert.glsl?raw'
import noiseLib from '@/three/shaders/noise-value.glsl?raw'
import renderLib from '@/three/shaders/galaxy-render.glsl?raw'
import fragMain from '@/three/shaders/galaxy.frag.glsl?raw'

const galaxyFragShader = noiseLib + '\n' + renderLib + '\n' + fragMain

const props = defineProps<{
  scrollProgress: number // 0 to 1 overall progress
  currentSection: number // 0 to N based on sections
}>()

const container = ref<HTMLDivElement | null>(null)

// Three.js variables
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let clock: THREE.Clock

// Objects
let starField: THREE.Points
let heroGalaxy: THREE.Points
let dataCloud: THREE.Points
let morphologyGroup: THREE.Group
let gridHelper: THREE.PolarGridHelper
let cylinderWireframe: THREE.LineSegments

// Textures
const galaxyAtlas = generateGalaxyTextureAtlas()
const particleTexture = createCircleTexture()

// Constants
const PARTICLE_COUNT = 2000
const GALAXY_SIZE = 100

function createCircleTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  const center = size / 2
  const radius = size / 2

  const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

function init() {
  if (!container.value) return

  // Scene setup
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.002)

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 50

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  clock = new THREE.Clock()

  // 1. Starfield (Always visible but subtle)
  createStarField()

  // 2. Hero Galaxy (Section 0)
  createHeroGalaxy()

  // 3. Data Cloud (Section 1)
  createDataCloud()

  // 4. Morphology Showcase (Section 3)
  createMorphologyShowcase()

  // 5. Grid + Cylinder (Section 3 — From Data to Sky / mapping)
  gridHelper = new THREE.PolarGridHelper(30, 16, 8, 64, 0x22d3ee, 0x22d3ee)
  gridHelper.position.y = -10
  gridHelper.visible = false
  scene.add(gridHelper)

  // 6. Cylinder wireframe (observation volume for celestial sphere)
  const cylGeo = new THREE.CylinderGeometry(30, 30, 40, 32, 8, true)
  const cylEdges = new THREE.EdgesGeometry(cylGeo)
  cylinderWireframe = new THREE.LineSegments(
    cylEdges,
    new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    })
  )
  cylinderWireframe.position.y = -10
  cylinderWireframe.visible = false
  scene.add(cylinderWireframe)
  cylGeo.dispose()

  // Start loop
  animate()

  window.addEventListener('resize', onResize)
}

function createStarField() {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(3000 * 3)
  
  for (let i = 0; i < 3000; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 600
    positions[i * 3 + 1] = (Math.random() - 0.5) * 600
    positions[i * 3 + 2] = (Math.random() - 0.5) * 600
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    map: particleTexture,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  
  starField = new THREE.Points(geometry, material)
  scene.add(starField)
}

function createHeroGalaxy() {
  // A spiral galaxy made of particles
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const sizes = new Float32Array(PARTICLE_COUNT)

  const colorInside = new THREE.Color(0xff6030)
  const colorOutside = new THREE.Color(0x1b3984)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Spiral logic
    const radius = Math.random() * 20
    const spinAngle = radius * 0.8
    const branchAngle = (i % 3) * ((Math.PI * 2) / 3)
    
    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5

    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i * 3 + 1] = randomY * (20 - radius) * 0.1 // Flattened
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    // Color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / 20)
    
    colors[i * 3] = mixedColor.r
    colors[i * 3 + 1] = mixedColor.g
    colors[i * 3 + 2] = mixedColor.b

    sizes[i] = Math.random() * 2
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: particleTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true
  })

  heroGalaxy = new THREE.Points(geometry, material)
  heroGalaxy.rotation.x = 0.5
  scene.add(heroGalaxy)
}

function createDataCloud() {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const material = new THREE.PointsMaterial({
    color: 0x22d3ee,
    size: 0.5, // Slightly larger to account for soft edges
    map: particleTexture,
    transparent: true,
    opacity: 0, // Start invisible
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  
  dataCloud = new THREE.Points(geometry, material)
  scene.add(dataCloud)
}

/** Simple deterministic hash. */
function _aboutHash(n: number): number {
  let x = ((n * 2654435761) >>> 0)
  x = (((x >> 16) ^ x) * 0x45d9f3b) >>> 0
  return (x & 0x7fffffff) / 0x7fffffff
}

/** Astronomical color palette (no green). */
const ABOUT_PALETTE: [number, number, number][] = [
  [0.45, 0.55, 1.00], [0.60, 0.70, 1.00], [0.90, 0.88, 0.95],
  [1.00, 0.88, 0.60], [1.00, 0.72, 0.38], [0.95, 0.50, 0.25],
  [0.85, 0.35, 0.30], [0.80, 0.40, 0.55],
]

function _aboutSampleColor(t: number): [number, number, number] {
  const idx = t * (ABOUT_PALETTE.length - 1)
  const lo = Math.floor(idx), hi = Math.min(lo + 1, ABOUT_PALETTE.length - 1), f = idx - lo
  return [
    ABOUT_PALETTE[lo][0] + (ABOUT_PALETTE[hi][0] - ABOUT_PALETTE[lo][0]) * f,
    ABOUT_PALETTE[lo][1] + (ABOUT_PALETTE[hi][1] - ABOUT_PALETTE[lo][1]) * f,
    ABOUT_PALETTE[lo][2] + (ABOUT_PALETTE[hi][2] - ABOUT_PALETTE[lo][2]) * f,
  ]
}

let morphologyMaterial: THREE.ShaderMaterial

function createMorphologyShowcase() {
  morphologyGroup = new THREE.Group()

  // ~30 procedural galaxies scattered like a deep field, spanning full viewport
  const count = 30
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const redshifts = new Float32Array(count)
  const texIndices = new Float32Array(count)
  const selected = new Float32Array(count)
  const focused = new Float32Array(count)
  const alphas = new Float32Array(count)
  const sizeMultipliers = new Float32Array(count).fill(1.0)
  const types = new Float32Array(count)
  const seeds = new Float32Array(count)
  const angles = new Float32Array(count * 3)
  const physicalParams = new Float32Array(count * 3)
  const distances_mpc = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // Scatter across a wide area with jitter
    const cols = 6
    const rows = 5
    const col = i % cols
    const row = Math.floor(i / cols) % rows
    const jx = (_aboutHash(i * 7 + 1) - 0.5) * 18
    const jy = (_aboutHash(i * 7 + 2) - 0.5) * 14
    const z = -10 - _aboutHash(i * 7 + 3) * 40

    positions[i * 3] = (col - cols / 2 + 0.5) * 22 + jx
    positions[i * 3 + 1] = (row - rows / 2 + 0.5) * 18 + jy
    positions[i * 3 + 2] = z

    const [r, g, b] = _aboutSampleColor(_aboutHash(i * 13 + 5))
    const bri = 0.75 + _aboutHash(i * 13 + 6) * 0.4
    const sat = 0.55 + _aboutHash(i * 13 + 7) * 0.45
    colors[i * 3] = Math.min(1, (r * sat + (1 - sat) * 0.92) * bri)
    colors[i * 3 + 1] = Math.min(1, (g * sat + (1 - sat) * 0.87) * bri)
    colors[i * 3 + 2] = Math.min(1, (b * sat + (1 - sat) * 0.82) * bri)

    // Size varies with depth — foreground larger, background smaller
    const depthT = (-z - 10) / 40
    sizes[i] = 6.0 + (1.0 - depthT) * 14.0 + _aboutHash(i * 13 + 8) * 5.0
    alphas[i] = 0.5 + (1.0 - depthT) * 0.5

    redshifts[i] = 0.01
    types[i] = Math.floor(_aboutHash(i * 13 + 9) * 5.0)
    seeds[i] = ((i * 73856093 ^ ((i >> 4) * 19349663)) >>> 0) % 100000
    angles[i * 3] = _aboutHash(i * 7 + 10) * Math.PI * 2
    angles[i * 3 + 2] = _aboutHash(i * 7 + 11) * Math.PI * 2
    physicalParams[i * 3] = 0.3 + _aboutHash(i * 7 + 12) * 0.7
    physicalParams[i * 3 + 1] = 10.0
    distances_mpc[i] = 10.0
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geo.setAttribute('aRedshift', new THREE.BufferAttribute(redshifts, 1))
  geo.setAttribute('aTexIndex', new THREE.BufferAttribute(texIndices, 1))
  geo.setAttribute('aSelected', new THREE.BufferAttribute(selected, 1))
  geo.setAttribute('aFocused', new THREE.BufferAttribute(focused, 1))
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
  geo.setAttribute('aSizeMultiplier', new THREE.BufferAttribute(sizeMultipliers, 1))
  geo.setAttribute('aType', new THREE.BufferAttribute(types, 1))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  geo.setAttribute('aAngles', new THREE.BufferAttribute(angles, 3))
  geo.setAttribute('aPhysicalParams', new THREE.BufferAttribute(physicalParams, 3))
  geo.setAttribute('aDistance_mpc', new THREE.BufferAttribute(distances_mpc, 1))

  morphologyMaterial = new THREE.ShaderMaterial({
    vertexShader: galaxyVertShader,
    fragmentShader: galaxyFragShader,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMaxRedshift: { value: 0.1 },
      uMinRedshift: { value: 0.0 },
      uFov: { value: 25.0 },
      uParallaxX: { value: 0.0 },
      uParallaxY: { value: 0.0 },
      uFocusActive: { value: 0.0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  })

  const points = new THREE.Points(geo, morphologyMaterial)
  morphologyGroup.add(points)
  morphologyGroup.visible = false
  scene.add(morphologyGroup)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  const elapsed = clock.getElapsedTime()

  // Global animations
  starField.rotation.y = elapsed * 0.02

  // Section-based animations
  updateSceneState(elapsed)

  renderer.render(scene, camera)
}

// Target camera state
const targetCameraPos = new THREE.Vector3(0, 0, 50)

function updateSceneState(elapsed: number) {
  // Smooth transitions based on props.currentSection
  
  // Section 0: Hero
  if (props.currentSection < 1) {
    heroGalaxy.visible = true
    dataCloud.visible = false
    gridHelper.visible = false
    cylinderWireframe.visible = false
    morphologyGroup.visible = false
    
    heroGalaxy.rotation.y = elapsed * 0.1
    heroGalaxy.rotation.z = elapsed * 0.05
    
    targetCameraPos.set(0, 0, 50)
  }
  
  // Section 1: Data
  else if (props.currentSection === 1) {
    heroGalaxy.visible = false
    dataCloud.visible = true
    gridHelper.visible = false
    cylinderWireframe.visible = false
    morphologyGroup.visible = false
    
    // Fade in
    const mat = dataCloud.material as THREE.PointsMaterial
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.05)
    
    dataCloud.rotation.y = elapsed * 0.05
    
    targetCameraPos.set(0, 10, 60)
  }
  
  // Section 2: Measurements — data cloud only
  else if (props.currentSection === 2) {
    heroGalaxy.visible = false
    dataCloud.visible = true
    gridHelper.visible = false
    cylinderWireframe.visible = false
    morphologyGroup.visible = false

    dataCloud.rotation.y = elapsed * 0.05
    targetCameraPos.set(0, 10, 60)
  }

  // Section 3: From Data to Sky (mapping) — cylinder + grid + data cloud
  else if (props.currentSection === 3) {
    heroGalaxy.visible = false
    dataCloud.visible = true
    gridHelper.visible = true
    cylinderWireframe.visible = true
    morphologyGroup.visible = false

    const mat = dataCloud.material as THREE.PointsMaterial
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.6, 0.05)
    dataCloud.rotation.y = elapsed * 0.05
    gridHelper.rotation.y = elapsed * 0.1
    cylinderWireframe.rotation.y = elapsed * 0.1

    targetCameraPos.set(0, 30, 40)
  }

  // Section 4: Procedural Rendering — galaxy deep field
  else if (props.currentSection === 4) {
    heroGalaxy.visible = false
    dataCloud.visible = false
    gridHelper.visible = false
    cylinderWireframe.visible = false
    morphologyGroup.visible = true

    if (morphologyMaterial) {
      morphologyMaterial.uniforms.uTime.value = elapsed
    }

    targetCameraPos.set(0, 0, 50)
  }
  
  // Section 5+: Credits
  else {
    heroGalaxy.visible = false
    dataCloud.visible = false
    gridHelper.visible = false
    cylinderWireframe.visible = false
    morphologyGroup.visible = false
    
    // Continuous forward movement
    // We don't use targetCameraPos here, we just modify camera directly
    camera.position.z -= 0.2
    if (camera.position.z < -100) camera.position.z = 100 // Loop
    return // Skip lerp
  }

  // Apply lerp
  camera.position.lerp(targetCameraPos, 0.05)
  camera.lookAt(0, 0, 0)
}

function onResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (morphologyMaterial) {
    morphologyMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
  }
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
  // Dispose geometries/materials...
})
</script>
