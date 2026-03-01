# Spacetime Fabric Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a `/spacetime` page that renders a wireframe grid plane warped by galaxy density — gravity wells where clusters concentrate, flat regions where voids exist — with velocity-colored galaxy dots on the surface and labeled major structures.

**Architecture:** A new Vue page loads galaxy groups from the existing SQL.js database, filters to the supergalactic XY slab, computes a 2D density grid via Gaussian kernel accumulation, and renders a displaced `PlaneGeometry` wireframe with custom shaders. Galaxy dots sit on the surface using the same density lookup. Reuses existing patterns: `useGalaxyData` composable, `VELOCITY_COLOR_BINS` constants, `velocityToColor()`, `OrbitControls`.

**Tech Stack:** Vue 3 Composition API, Three.js (PlaneGeometry, ShaderMaterial, Points, OrbitControls), GLSL, sql.js, vue-i18n

---

### Task 1: Route, Nav Link, and Stub View

**Files:**
- Modify: `src/main/site/src/router/index.ts:26-31`
- Modify: `src/main/site/src/components/AppHeader.vue:13-15`
- Modify: `src/main/site/src/i18n/locales/en-US.json:11-14`
- Modify: `src/main/site/src/i18n/locales/pt-BR.json:11-14`
- Create: `src/main/site/src/views/SpacetimeView.vue`

**Step 1: Add route**

In `router/index.ts`, add after the cosmography route:

```ts
{
  path: '/spacetime',
  name: 'spacetime',
  component: () => import('@/views/SpacetimeView.vue'),
},
```

**Step 2: Add nav link**

In `AppHeader.vue`, add after the cosmography router-link (line 15):

```html
<router-link to="/spacetime" class="text-xs text-white/50 hover:text-white/80 transition-colors">
  {{ t('nav.spacetime') }}
</router-link>
```

**Step 3: Add i18n strings**

In `en-US.json`, add to the `"nav"` section:

```json
"spacetime": "Spacetime"
```

In `pt-BR.json`, add to the `"nav"` section:

```json
"spacetime": "Espaço-Tempo"
```

Also add the full page strings. In `en-US.json`, add a new `"spacetime"` key inside `"pages"`:

```json
"spacetime": {
  "title": "Spacetime Fabric",
  "subtitle": "Gravity warps the fabric of spacetime. Where galaxies cluster, the grid sinks into deep wells — revealing the invisible architecture of mass.",
  "backToSky": "Back to Sky",
  "loading": "Computing density field...",
  "velocityLabel": "Velocity (km/s)",
  "infoTitle": "What You're Seeing",
  "infoBody": "This grid represents the supergalactic plane — a 2D slice through the universe where most of the large-scale structure lives. Each vertex is displaced downward in proportion to the local galaxy density: clusters create deep wells, voids remain flat. The galaxy dots are color-coded by recession velocity, the same scale as the Cosmic Map.",
  "stats": {
    "groups": "Galaxy groups in slab",
    "gridRes": "Grid resolution",
    "slabThickness": "Slab thickness"
  }
}
```

In `pt-BR.json`, add:

```json
"spacetime": {
  "title": "Tecido do Espaço-Tempo",
  "subtitle": "A gravidade deforma o tecido do espaço-tempo. Onde as galáxias se agrupam, a grade afunda em poços profundos — revelando a arquitetura invisível da massa.",
  "backToSky": "Voltar ao Céu",
  "loading": "Calculando campo de densidade...",
  "velocityLabel": "Velocidade (km/s)",
  "infoTitle": "O Que Você Está Vendo",
  "infoBody": "Esta grade representa o plano supergaláctico — um corte 2D pelo universo onde a maior parte da estrutura em larga escala existe. Cada vértice é deslocado para baixo proporcionalmente à densidade local de galáxias: aglomerados criam poços profundos, vazios permanecem planos. Os pontos de galáxias são coloridos por velocidade de recessão, a mesma escala do Mapa Cósmico.",
  "stats": {
    "groups": "Grupos no corte",
    "gridRes": "Resolução da grade",
    "slabThickness": "Espessura do corte"
  }
}
```

**Step 4: Create stub view**

Create `src/main/site/src/views/SpacetimeView.vue`:

```vue
<template>
  <div class="spacetime-page">
    <router-link to="/" class="back-button">&larr; {{ t('pages.spacetime.backToSky') }}</router-link>
    <div v-if="loading" class="loading-overlay">
      <p>{{ t('pages.spacetime.loading') }}</p>
    </div>
    <canvas ref="canvasRef" class="spacetime-canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
</script>

<style scoped>
.spacetime-page {
  position: fixed;
  inset: 0;
  background: #000;
}

.spacetime-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.back-button {
  position: fixed;
  top: 24px;
  right: 24px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  z-index: 20;
  backdrop-filter: blur(8px);
  transition: color 0.2s, background 0.2s;
}

.back-button:hover {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  z-index: 15;
}
</style>
```

**Step 5: Verify and commit**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors.

```bash
git add src/main/site/src/views/SpacetimeView.vue \
  src/main/site/src/router/index.ts \
  src/main/site/src/components/AppHeader.vue \
  src/main/site/src/i18n/locales/en-US.json \
  src/main/site/src/i18n/locales/pt-BR.json
git commit -m "feat: add spacetime route, nav link, stub view, and i18n strings"
```

---

### Task 2: Density Field Computation Utility

**Files:**
- Create: `src/main/site/src/three/spacetime/computeDensityField.ts`

This is a pure function — no Three.js dependency, just math. Takes galaxy groups, returns a flat Float32Array density grid.

**Step 1: Create the density computation module**

Create `src/main/site/src/three/spacetime/computeDensityField.ts`:

```ts
import type { GalaxyGroup } from '@/types/galaxy'

export interface DensityFieldResult {
  /** 256×256 normalized density values (0–1), row-major */
  grid: Float32Array
  /** Number of groups that fell within the slab */
  slabCount: number
  /** Grid resolution */
  resolution: number
  /** World-space extent: grid covers [-extent, +extent] on both axes */
  extent: number
}

/**
 * Compute a 2D density field from galaxy groups projected onto the
 * supergalactic XY plane. Groups are filtered to a slab around SGZ ≈ 0.
 *
 * Algorithm:
 *  1. Filter groups to |SGZ| < slabHalf
 *  2. For each group, splat a Gaussian kernel onto the grid
 *  3. Box-blur smooth the result
 *  4. Normalize to [0, 1]
 */
export function computeDensityField(
  groups: GalaxyGroup[],
  resolution = 256,
  extent = 16000,
  slabHalf = 2000,
  kernelRadius = 3,
  sigma = 1.5,
): DensityFieldResult {
  const grid = new Float32Array(resolution * resolution)
  const cellSize = (extent * 2) / resolution

  // Pre-compute Gaussian kernel weights
  const kernelSize = kernelRadius * 2 + 1
  const kernel = new Float32Array(kernelSize * kernelSize)
  for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
    for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
      const d2 = kx * kx + ky * ky
      kernel[(ky + kernelRadius) * kernelSize + (kx + kernelRadius)] =
        Math.exp(-d2 / (2 * sigma * sigma))
    }
  }

  // Splat each group onto the grid
  let slabCount = 0
  for (const g of groups) {
    if (Math.abs(g.sgz) > slabHalf) continue
    slabCount++

    // Map SGX/SGY to grid cell
    const gx = Math.floor(((g.sgx + extent) / (extent * 2)) * resolution)
    const gy = Math.floor(((g.sgy + extent) / (extent * 2)) * resolution)

    // Splat kernel
    for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
      for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
        const cx = gx + kx
        const cy = gy + ky
        if (cx < 0 || cx >= resolution || cy < 0 || cy >= resolution) continue
        grid[cy * resolution + cx] +=
          kernel[(ky + kernelRadius) * kernelSize + (kx + kernelRadius)]
      }
    }
  }

  // Box blur (3×3, 2 passes for smoothness)
  const temp = new Float32Array(resolution * resolution)
  for (let pass = 0; pass < 2; pass++) {
    const src = pass === 0 ? grid : temp
    const dst = pass === 0 ? temp : grid

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        let sum = 0
        let count = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx
            const ny = y + dy
            if (nx >= 0 && nx < resolution && ny >= 0 && ny < resolution) {
              sum += src[ny * resolution + nx]
              count++
            }
          }
        }
        dst[y * resolution + x] = sum / count
      }
    }
  }

  // Normalize to [0, 1]
  let max = 0
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] > max) max = grid[i]
  }
  if (max > 0) {
    for (let i = 0; i < grid.length; i++) {
      grid[i] /= max
    }
  }

  return { grid, slabCount, resolution, extent }
}
```

**Step 2: Verify and commit**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors.

```bash
git add src/main/site/src/three/spacetime/computeDensityField.ts
git commit -m "feat: add density field computation for spacetime fabric"
```

---

### Task 3: Fabric Mesh Shaders

**Files:**
- Create: `src/main/site/src/three/spacetime/shaders/fabric.vert.glsl`
- Create: `src/main/site/src/three/spacetime/shaders/fabric.frag.glsl`

**Step 1: Write vertex shader**

The vertex shader samples a density texture and displaces vertices downward (negative Y). It passes the displacement amount and UV to the fragment shader for wireframe glow.

Create `src/main/site/src/three/spacetime/shaders/fabric.vert.glsl`:

```glsl
uniform sampler2D uDensity;
uniform float uDisplaceScale;
uniform float uTime;

varying float vDepth;
varying vec2 vUv;

void main() {
  vUv = uv;

  // Sample density at this vertex's UV
  float density = texture2D(uDensity, uv).r;

  // Displace Y downward — deeper wells for higher density
  // Apply power curve to exaggerate deep wells
  float displacement = pow(density, 0.7) * uDisplaceScale;

  vec3 displaced = position;
  displaced.y -= displacement;

  vDepth = density;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
```

**Step 2: Write fragment shader**

The fragment shader draws wireframe grid lines using UV derivatives (screen-space grid). Lines glow brighter at deeper wells.

Create `src/main/site/src/three/spacetime/shaders/fabric.frag.glsl`:

```glsl
precision highp float;

varying float vDepth;
varying vec2 vUv;

uniform float uGridLines;
uniform float uTime;

void main() {
  // Grid line detection via UV fract
  vec2 gridUV = vUv * uGridLines;
  vec2 gridFrac = abs(fract(gridUV - 0.5) - 0.5);
  vec2 gridWidth = fwidth(gridUV);
  vec2 line = smoothstep(gridWidth * 0.5, gridWidth * 1.5, gridFrac);
  float gridLine = 1.0 - min(line.x, line.y);

  // Discard non-wireframe pixels
  if (gridLine < 0.01) discard;

  // Glow: base cyan, brightening to white at deep wells
  float glow = 0.15 + vDepth * 0.85;
  vec3 cyanBase = vec3(0.133, 0.827, 0.933); // #22d3ee
  vec3 white = vec3(1.0);
  vec3 color = mix(cyanBase * 0.3, mix(cyanBase, white, vDepth * 0.5), glow);

  // Subtle pulse at deep wells
  float pulse = 1.0 + 0.05 * sin(uTime * 2.0) * vDepth;

  gl_FragColor = vec4(color * pulse, gridLine * glow);
}
```

**Step 3: Verify and commit**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors (GLSL files are imported as raw strings, no TS checking).

```bash
git add src/main/site/src/three/spacetime/shaders/
git commit -m "feat: add fabric wireframe vertex displacement and glow shaders"
```

---

### Task 4: SpacetimeFabric Class

**Files:**
- Create: `src/main/site/src/three/spacetime/SpacetimeFabric.ts`

This class builds the PlaneGeometry, creates the ShaderMaterial, and applies the density DataTexture.

**Step 1: Create SpacetimeFabric**

Create `src/main/site/src/three/spacetime/SpacetimeFabric.ts`:

```ts
import * as THREE from 'three'
import type { DensityFieldResult } from './computeDensityField'
import vertexShader from './shaders/fabric.vert.glsl?raw'
import fragmentShader from './shaders/fabric.frag.glsl?raw'

/**
 * A PlaneGeometry mesh with vertex displacement driven by a density field.
 * Renders as a glowing wireframe — deep wells where galaxies cluster.
 */
export class SpacetimeFabric {
  readonly mesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private geometry: THREE.PlaneGeometry
  private densityTexture: THREE.DataTexture

  constructor(densityField: DensityFieldResult) {
    const { grid, resolution, extent } = densityField

    // Create density DataTexture (single-channel float)
    this.densityTexture = new THREE.DataTexture(
      grid,
      resolution,
      resolution,
      THREE.RedFormat,
      THREE.FloatType,
    )
    this.densityTexture.minFilter = THREE.LinearFilter
    this.densityTexture.magFilter = THREE.LinearFilter
    this.densityTexture.wrapS = THREE.ClampToEdgeWrapping
    this.densityTexture.wrapT = THREE.ClampToEdgeWrapping
    this.densityTexture.needsUpdate = true

    // PlaneGeometry on XZ plane (Y is up/down for displacement)
    // Three.js PlaneGeometry lies on XY by default, we rotate to XZ
    this.geometry = new THREE.PlaneGeometry(
      extent * 2,
      extent * 2,
      resolution - 1,
      resolution - 1,
    )
    // Rotate from XY to XZ (so Y axis is available for displacement)
    this.geometry.rotateX(-Math.PI / 2)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uDensity: { value: this.densityTexture },
        uDisplaceScale: { value: 4000.0 },
        uGridLines: { value: 64.0 },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  update(elapsed: number): void {
    this.material.uniforms.uTime.value = elapsed
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
    this.densityTexture.dispose()
  }
}
```

**Step 2: Verify and commit**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors.

```bash
git add src/main/site/src/three/spacetime/SpacetimeFabric.ts
git commit -m "feat: add SpacetimeFabric class with density-displaced wireframe mesh"
```

---

### Task 5: SpacetimePoints Class (Galaxy Dots on Surface)

**Files:**
- Create: `src/main/site/src/three/spacetime/SpacetimePoints.ts`

Galaxy group dots that sit on the warped fabric surface. Uses the same density grid to compute each dot's Y displacement.

**Step 1: Create SpacetimePoints**

Create `src/main/site/src/three/spacetime/SpacetimePoints.ts`:

```ts
import * as THREE from 'three'
import type { GalaxyGroup } from '@/types/galaxy'
import { velocityToColor } from '@/types/galaxy'
import type { DensityFieldResult } from './computeDensityField'
import vertexShader from '../cosmic-map/shaders/cosmicmap.vert.glsl?raw'
import fragmentShader from '../cosmic-map/shaders/cosmicmap.frag.glsl?raw'

/**
 * Galaxy group dots positioned on the warped fabric surface.
 * Reuses the cosmic map point shaders for consistent visual style.
 */
export class SpacetimePoints {
  readonly points: THREE.Points
  private material: THREE.ShaderMaterial
  private geometry: THREE.BufferGeometry

  // For hit-testing
  private groupData: GalaxyGroup[] = []
  private positions: Float32Array = new Float32Array(0)

  constructor(
    groups: GalaxyGroup[],
    densityField: DensityFieldResult,
    displaceScale: number = 4000.0,
  ) {
    this.groupData = groups
    const { grid, resolution, extent } = densityField
    const count = groups.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const g = groups[i]

      // XZ position from SGX/SGY (plane is XZ after rotation)
      const x = g.sgx
      const z = g.sgy

      // Sample density at this position to get Y displacement
      const u = (g.sgx + extent) / (extent * 2)
      const v = (g.sgy + extent) / (extent * 2)
      const gx = Math.min(Math.floor(u * resolution), resolution - 1)
      const gy = Math.min(Math.floor(v * resolution), resolution - 1)
      const density = grid[gy * resolution + gx]
      const y = -(Math.pow(density, 0.7) * displaceScale)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const c = velocityToColor(g.vh ?? 0)
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]

      sizes[i] = 3.0
    }

    this.positions = positions
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.frustumCulled = false
  }

  update(elapsed: number): void {
    this.material.uniforms.uTime.value = elapsed
  }

  /** Screen-space hit test — returns closest group under cursor, or null */
  pickAtScreen(
    screenX: number,
    screenY: number,
    camera: THREE.PerspectiveCamera,
    viewportWidth: number,
    viewportHeight: number,
  ): { pgc: number; velocity: number; distance: number } | null {
    this.points.updateWorldMatrix(true, false)
    const tempLocal = new THREE.Vector3()
    const tempProj = new THREE.Vector3()
    const pixelRatio = Math.min(window.devicePixelRatio, 2)

    let bestIndex = -1
    let bestDistSq = Infinity
    const count = this.positions.length / 3

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      tempLocal.set(this.positions[i3], this.positions[i3 + 1], this.positions[i3 + 2])
      tempProj.copy(tempLocal).applyMatrix4(this.points.matrixWorld).project(camera)

      if (tempProj.z < -1 || tempProj.z > 1) continue

      const px = (tempProj.x * 0.5 + 0.5) * viewportWidth
      const py = (-tempProj.y * 0.5 + 0.5) * viewportHeight

      const half = 8.0 * pixelRatio
      const dx = screenX - px
      const dy = screenY - py
      if (Math.abs(dx) > half || Math.abs(dy) > half) continue

      const distSq = dx * dx + dy * dy
      if (distSq < bestDistSq) {
        bestDistSq = distSq
        bestIndex = i
      }
    }

    if (bestIndex < 0) return null
    const g = this.groupData[bestIndex]
    return { pgc: g.group_pgc, velocity: g.vh ?? 0, distance: g.dist_mpc }
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
```

**Step 2: Verify and commit**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors.

```bash
git add src/main/site/src/three/spacetime/SpacetimePoints.ts
git commit -m "feat: add SpacetimePoints class for velocity-colored dots on fabric"
```

---

### Task 6: SpacetimeLabels (Cluster Names)

**Files:**
- Create: `src/main/site/src/three/spacetime/SpacetimeLabels.ts`

Floating text labels for major galaxy clusters/superclusters positioned on the fabric surface.

**Step 1: Create SpacetimeLabels**

Create `src/main/site/src/three/spacetime/SpacetimeLabels.ts`:

```ts
import * as THREE from 'three'
import type { DensityFieldResult } from './computeDensityField'

interface ClusterInfo {
  name: string
  sgx: number  // Supergalactic X (Mpc-equivalent in km/s space)
  sgy: number  // Supergalactic Y
}

/**
 * Approximate supergalactic XY positions of major clusters.
 * Coordinates are in the same km/s velocity-space as galaxy group SGX/SGY.
 * Values derived from Cosmicflows-4 group catalog positions.
 */
const CLUSTERS: ClusterInfo[] = [
  { name: 'Virgo',           sgx: -200,   sgy: 1100 },
  { name: 'Coma',            sgx: -300,   sgy: 6800 },
  { name: 'Perseus-Pisces',  sgx: -4800,  sgy: 4500 },
  { name: 'Great Attractor',  sgx: -4200,  sgy: 1800 },
  { name: 'Shapley',         sgx: -6800,  sgy: 6200 },
  { name: 'Centaurus',       sgx: -3200,  sgy: 3200 },
  { name: 'Hydra',           sgx: -2800,  sgy: 3800 },
]

/**
 * Sprite-based labels for major galaxy clusters.
 * Positioned on the warped fabric surface.
 */
export class SpacetimeLabels {
  readonly group: THREE.Group
  private sprites: THREE.Sprite[] = []

  constructor(densityField: DensityFieldResult, displaceScale: number = 4000.0) {
    this.group = new THREE.Group()
    const { grid, resolution, extent } = densityField

    for (const cluster of CLUSTERS) {
      // Sample density to get Y displacement (same math as fabric + points)
      const u = (cluster.sgx + extent) / (extent * 2)
      const v = (cluster.sgy + extent) / (extent * 2)
      const gx = Math.min(Math.max(Math.floor(u * resolution), 0), resolution - 1)
      const gy = Math.min(Math.max(Math.floor(v * resolution), 0), resolution - 1)
      const density = grid[gy * resolution + gx]
      const y = -(Math.pow(density, 0.7) * displaceScale) + 300 // Float above surface

      const sprite = this.makeLabel(cluster.name)
      sprite.position.set(cluster.sgx, y, cluster.sgy)
      this.group.add(sprite)
      this.sprites.push(sprite)
    }
  }

  private makeLabel(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const scale = 2
    canvas.width = 256 * scale
    canvas.height = 48 * scale
    const ctx = canvas.getContext('2d')!
    ctx.scale(scale, scale)

    // Text with subtle glow
    ctx.font = '500 14px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Glow
    ctx.shadowColor = 'rgba(34, 211, 238, 0.6)'
    ctx.shadowBlur = 8
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.fillText(text, 128, 24)

    // Second pass without shadow for crispness
    ctx.shadowBlur = 0
    ctx.fillText(text, 128, 24)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(800, 150, 1)
    return sprite
  }

  dispose(): void {
    for (const sprite of this.sprites) {
      ;(sprite.material as THREE.SpriteMaterial).map?.dispose()
      sprite.material.dispose()
    }
  }
}
```

**Step 2: Verify and commit**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors.

```bash
git add src/main/site/src/three/spacetime/SpacetimeLabels.ts
git commit -m "feat: add SpacetimeLabels with major cluster names on fabric"
```

---

### Task 7: SpacetimeScene (Orchestrator)

**Files:**
- Create: `src/main/site/src/three/spacetime/SpacetimeScene.ts`

Wires together fabric, points, labels, axes, and controls. Same architecture as `CosmicMapScene`.

**Step 1: Create SpacetimeScene**

Create `src/main/site/src/three/spacetime/SpacetimeScene.ts`:

```ts
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SpacetimeFabric } from './SpacetimeFabric'
import { SpacetimePoints } from './SpacetimePoints'
import { SpacetimeLabels } from './SpacetimeLabels'
import { computeDensityField } from './computeDensityField'
import type { GalaxyGroup } from '@/types/galaxy'

export class SpacetimeScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private clock = new THREE.Clock()
  private animationId = 0
  private resizeObserver: ResizeObserver

  private fabric: SpacetimeFabric | null = null
  private groupPoints: SpacetimePoints | null = null
  private labels: SpacetimeLabels | null = null

  /** Number of groups in the slab (set after loadGroups) */
  slabCount = 0

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    this.renderer.setClearColor(0x000000, 1)

    this.scene = new THREE.Scene()

    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 1, 200000)
    // Angled view looking down at the fabric
    this.camera.position.set(5000, 8000, 18000)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 500
    this.controls.maxDistance = 60000
    this.controls.target.set(0, -1000, 0)

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

  /** Compute density field and build all scene objects */
  loadGroups(groups: GalaxyGroup[]): void {
    // Compute density field
    const densityField = computeDensityField(groups)
    this.slabCount = densityField.slabCount

    // Filter groups to same slab for points
    const slabGroups = groups.filter((g) => Math.abs(g.sgz) < 2000)

    // Build fabric
    this.fabric = new SpacetimeFabric(densityField)
    this.scene.add(this.fabric.mesh)

    // Build points
    this.groupPoints = new SpacetimePoints(slabGroups, densityField)
    this.scene.add(this.groupPoints.points)

    // Build labels
    this.labels = new SpacetimeLabels(densityField)
    this.scene.add(this.labels.group)
  }

  /** Start the animation loop */
  start(): void {
    this.clock.start()

    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      const elapsed = this.clock.getElapsedTime()

      this.controls.update()
      this.fabric?.update(elapsed)
      this.groupPoints?.update(elapsed)
      this.renderer.render(this.scene, this.camera)
    }

    animate()
  }

  /** Hit-test for tooltip */
  pickAtScreen(
    screenX: number,
    screenY: number,
    viewportWidth: number,
    viewportHeight: number,
  ): { pgc: number; velocity: number; distance: number } | null {
    return this.groupPoints?.pickAtScreen(
      screenX,
      screenY,
      this.camera,
      viewportWidth,
      viewportHeight,
    ) ?? null
  }

  dispose(): void {
    cancelAnimationFrame(this.animationId)
    this.resizeObserver.disconnect()
    this.controls.dispose()
    this.fabric?.dispose()
    this.groupPoints?.dispose()
    this.labels?.dispose()
    this.renderer.dispose()
  }
}
```

**Step 2: Verify and commit**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors.

```bash
git add src/main/site/src/three/spacetime/SpacetimeScene.ts
git commit -m "feat: add SpacetimeScene orchestrator wiring fabric, points, and labels"
```

---

### Task 8: Complete SpacetimeView with UI

**Files:**
- Modify: `src/main/site/src/views/SpacetimeView.vue`

Wire up the scene, add velocity legend, tooltip, info panel, and stats.

**Step 1: Complete the view**

Replace the contents of `src/main/site/src/views/SpacetimeView.vue` with the full implementation. Reference existing patterns from `CosmicMapView.vue`:

- Load data via `useGalaxyData().getAllGroups()`
- Create `SpacetimeScene` on mounted
- Pointer events for tooltip (same drag detection + throttle pattern)
- Velocity legend (same `VELOCITY_COLOR_BINS` pattern)
- Info panel toggle
- Stats display (slab count, grid resolution, slab thickness)
- Back button, loading overlay

The view should include:

```vue
<template>
  <div class="spacetime-page">
    <router-link to="/" class="back-button">&larr; {{ t('pages.spacetime.backToSky') }}</router-link>

    <div v-if="loading" class="loading-overlay">
      <p>{{ t('pages.spacetime.loading') }}</p>
    </div>

    <canvas
      ref="canvasRef"
      class="spacetime-canvas"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @click="onClick"
    />

    <!-- Tooltip -->
    <div
      v-if="tooltip"
      class="tooltip"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <div class="tooltip-pgc">PGC {{ tooltip.pgc }}</div>
      <div class="tooltip-detail">{{ tooltip.velocity.toLocaleString() }} km/s</div>
      <div class="tooltip-detail">{{ tooltip.distance.toFixed(1) }} Mpc</div>
    </div>

    <!-- Velocity legend -->
    <div v-if="!loading" class="map-legend">
      <div class="map-legend-title">{{ t('pages.spacetime.velocityLabel') }}</div>
      <div class="map-legend-items">
        <div v-for="bin in velocityBins" :key="bin.label" class="map-legend-item">
          <span class="map-legend-swatch" :style="{ background: binToCSS(bin.color) }" />
          <span class="map-legend-label">{{ bin.label }}</span>
        </div>
      </div>
    </div>

    <!-- Info toggle -->
    <button v-if="!loading" class="info-toggle" @click="showInfo = !showInfo">
      {{ showInfo ? '×' : 'i' }}
    </button>

    <!-- Info panel -->
    <div v-if="showInfo" class="info-panel">
      <h3 class="info-title">{{ t('pages.spacetime.infoTitle') }}</h3>
      <p class="info-body">{{ t('pages.spacetime.infoBody') }}</p>
      <div class="info-stats">
        <div><span class="info-stat-value">{{ slabCount.toLocaleString() }}</span> {{ t('pages.spacetime.stats.groups') }}</div>
        <div><span class="info-stat-value">256 × 256</span> {{ t('pages.spacetime.stats.gridRes') }}</div>
        <div><span class="info-stat-value">±2,000 Mpc</span> {{ t('pages.spacetime.stats.slabThickness') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { SpacetimeScene } from '@/three/spacetime/SpacetimeScene'
import { VELOCITY_COLOR_BINS } from '@/three/constants'

const { t } = useI18n()
const { ready, getAllGroups } = useGalaxyData()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
const showInfo = ref(false)
const slabCount = ref(0)
const velocityBins = VELOCITY_COLOR_BINS

// Tooltip state
const tooltip = ref<{ pgc: number; velocity: number; distance: number } | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

// Pointer tracking for drag detection
let pointerDownX = 0
let pointerDownY = 0
let isDragging = false

let scene: SpacetimeScene | null = null

function binToCSS(c: [number, number, number]): string {
  return `rgb(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)})`
}

function onPointerDown(e: PointerEvent) {
  pointerDownX = e.clientX
  pointerDownY = e.clientY
  isDragging = false
}

let lastMoveTime = 0
function onPointerMove(e: PointerEvent) {
  const dx = e.clientX - pointerDownX
  const dy = e.clientY - pointerDownY
  if (dx * dx + dy * dy > 16) isDragging = true

  // Throttle pick to 60fps
  const now = performance.now()
  if (now - lastMoveTime < 16) return
  lastMoveTime = now

  if (!scene || !canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const hit = scene.pickAtScreen(
    e.clientX - rect.left,
    e.clientY - rect.top,
    rect.width,
    rect.height,
  )
  if (hit) {
    tooltip.value = hit
    tooltipX.value = e.clientX + 12
    tooltipY.value = e.clientY - 10
  } else {
    tooltip.value = null
  }
}

function onClick() {
  if (isDragging) return
  // Could navigate to galaxy detail in the future
}

onMounted(async () => {
  await ready
  if (!canvasRef.value) return

  scene = new SpacetimeScene(canvasRef.value)
  const groups = getAllGroups()
  scene.loadGroups(groups)
  slabCount.value = scene.slabCount
  scene.start()
  loading.value = false
})

onUnmounted(() => {
  scene?.dispose()
  scene = null
})
</script>

<style scoped>
.spacetime-page {
  position: fixed;
  inset: 0;
  background: #000;
}

.spacetime-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.back-button {
  position: fixed;
  top: 24px;
  right: 24px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  z-index: 20;
  backdrop-filter: blur(8px);
  transition: color 0.2s, background 0.2s;
}

.back-button:hover {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  z-index: 15;
}

/* Tooltip */
.tooltip {
  position: fixed;
  z-index: 30;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 8px 12px;
  backdrop-filter: blur(8px);
}

.tooltip-pgc {
  font-size: 13px;
  font-weight: 600;
  color: #22d3ee;
  margin-bottom: 2px;
}

.tooltip-detail {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  font-family: ui-monospace, monospace;
}

/* Velocity legend */
.map-legend {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  backdrop-filter: blur(8px);
}

.map-legend-title {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.map-legend-items {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.map-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.map-legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.map-legend-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-family: ui-monospace, monospace;
}

/* Info toggle */
.info-toggle {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 20;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: color 0.2s, background 0.2s;
}

.info-toggle:hover {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
}

/* Info panel */
.info-panel {
  position: fixed;
  top: 68px;
  left: 24px;
  z-index: 20;
  max-width: 360px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 20px;
  backdrop-filter: blur(12px);
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.info-body {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
  margin-bottom: 16px;
}

.info-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

.info-stat-value {
  color: #22d3ee;
  font-family: ui-monospace, monospace;
  font-weight: 600;
}
</style>
```

**Step 2: Verify and commit**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No type errors.

```bash
git add src/main/site/src/views/SpacetimeView.vue
git commit -m "feat: complete SpacetimeView with legend, tooltip, info panel, and stats"
```

---

### Task 9: Visual Polish and Verification

**Step 1: Run dev server and test**

Run: `cd src/main/site && npm run dev`

Open browser to `http://localhost:5173/spacetime` and verify:

1. Page loads, density field computes, fabric renders
2. Wireframe grid visible with visible gravity wells
3. Galaxy dots sit on the surface with correct velocity colors
4. Cluster labels visible at correct positions
5. Orbit controls work (rotate, zoom, pan)
6. Velocity legend shows in bottom-left
7. Tooltip appears on hover over galaxy dots
8. Info panel toggles with "i" button
9. Back button navigates to home
10. Nav link visible in header

**Step 2: Tune displacement scale and grid parameters if needed**

The `uDisplaceScale` uniform (default 4000.0) and `uGridLines` (default 64.0) may need adjustment based on visual results. Key tuning points:

- `computeDensityField.ts`: `sigma` (Gaussian width), `kernelRadius`, `slabHalf`
- `SpacetimeFabric.ts`: `uDisplaceScale` (well depth), `uGridLines` (wireframe density)
- `SpacetimeLabels.ts`: `CLUSTERS` coordinates may need adjustment based on actual data positions

**Step 3: Final type-check and commit**

Run: `cd src/main/site && npx vue-tsc --noEmit`

```bash
git add -A
git commit -m "feat: polish spacetime fabric visualization"
```
