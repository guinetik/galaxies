<template>
  <div ref="container" class="fixed inset-0 -z-10 bg-black"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { generateGalaxyTextureAtlas, ATLAS_ORDER } from '@/three/GalaxyTextures'

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

  // 5. Grid (Section 2)
  gridHelper = new THREE.PolarGridHelper(30, 16, 8, 64, 0x22d3ee, 0x22d3ee)
  gridHelper.position.y = -10
  gridHelper.visible = false
  scene.add(gridHelper)

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

function createMorphologyShowcase() {
  morphologyGroup = new THREE.Group()
  
  // Create a sprite for each galaxy type in the atlas
  // Atlas is 2 cols x 3 rows
  const types = ['Spiral', 'Barred', 'Elliptical', 'Lenticular', 'Irregular']
  const count = types.length
  
  types.forEach((type, i) => {
    // UV mapping logic
    // 2 cols, 3 rows. 
    // 0: 0,0 (top-left) -> u:0-0.5, v:0.66-1
    const col = i % 2
    const row = Math.floor(i / 2)
    
    const material = new THREE.SpriteMaterial({
      map: galaxyAtlas.clone(),
      transparent: true,
      blending: THREE.AdditiveBlending
    })
    
    // Fix UVs for this sprite
    // Note: Three.js textures are 0,0 at bottom-left by default, but canvas is top-left.
    // We need to be careful. Let's assume standard UVs and adjust offset/repeat.
    // Atlas: 2x3. 
    // Width unit: 0.5. Height unit: 1/3 = 0.333
    material.map!.repeat.set(0.5, 0.333)
    material.map!.offset.set(col * 0.5, 1 - (row + 1) * 0.333)
    
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(10, 10, 1)
    sprite.position.set((i - 2) * 12, 0, 0) // Spread horizontally
    
    morphologyGroup.add(sprite)
  })
  
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
    morphologyGroup.visible = false
    
    // Fade in
    const mat = dataCloud.material as THREE.PointsMaterial
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.05)
    
    dataCloud.rotation.y = elapsed * 0.05
    
    targetCameraPos.set(0, 10, 60)
  }
  
  // Section 2: Mapping
  else if (props.currentSection === 2) {
    heroGalaxy.visible = false
    dataCloud.visible = true
    gridHelper.visible = true
    morphologyGroup.visible = false
    
    gridHelper.rotation.y = elapsed * 0.1
    
    targetCameraPos.set(0, 30, 40)
  }
  
  // Section 3: Rendering
  else if (props.currentSection === 3) {
    heroGalaxy.visible = false
    dataCloud.visible = false
    gridHelper.visible = false
    morphologyGroup.visible = true
    
    morphologyGroup.children.forEach((sprite, i) => {
      sprite.position.y = Math.sin(elapsed + i) * 1
    })
    
    targetCameraPos.set(0, 0, 40)
  }
  
  // Section 4: Credits
  else {
    heroGalaxy.visible = false
    dataCloud.visible = false
    gridHelper.visible = false
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
