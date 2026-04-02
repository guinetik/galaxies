# Star Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render SIMBAD stars in 3D using 5 ported GLSL shaders from the exoplanets project, accessible from the KnownStarsCard on the galaxy detail page.

**Architecture:** New `/star/:id` route with a Vue view that loads star data from SIMBAD TAP API and renders it in a Three.js scene with surface/corona/flameTongues/flare/rays shaders, backed by the existing GalaxyBackdrop nebula skybox. The KnownStarsCard links star-type objects to this internal route instead of external SIMBAD.

**Tech Stack:** Vue 3, Three.js, GLSL, SIMBAD TAP API (ADQL), Vite raw shader imports

**Source project for shader port:** `D:\Developer\exoplanets`

---

## File Structure

```
src/main/site/src/
  composables/useSimbadStar.ts         # CREATE - Single-star SIMBAD TAP query
  three/star/StarUniforms.ts           # CREATE - Spectral maps, seed gen, uniform factory
  three/star/StarScene.ts              # CREATE - Three.js scene (star + backdrop + controls)
  three/star/shaders/noise.glsl        # CREATE - Port from exoplanets common/noise.glsl
  three/star/shaders/color.glsl        # CREATE - Port from exoplanets common/color.glsl
  three/star/shaders/seed.glsl         # CREATE - Port from exoplanets common/seed.glsl
  three/star/shaders/lighting.glsl     # CREATE - Port from exoplanets common/lighting.glsl
  three/star/shaders/surface.vert.glsl # CREATE - Port from exoplanets star/surface.vert
  three/star/shaders/surface.frag.glsl # CREATE - Port from exoplanets star/surface.frag
  three/star/shaders/corona.vert.glsl  # CREATE - Port from exoplanets star/corona.vert
  three/star/shaders/corona.frag.glsl  # CREATE - Port from exoplanets star/corona.frag
  three/star/shaders/rays.vert.glsl    # CREATE - Port from exoplanets star/rays.vert
  three/star/shaders/rays.frag.glsl    # CREATE - Port from exoplanets star/rays.frag
  three/star/shaders/flameTongues.vert.glsl  # CREATE - Port
  three/star/shaders/flameTongues.frag.glsl  # CREATE - Port
  three/star/shaders/flare.vert.glsl   # CREATE - Port from exoplanets star/flare.vert
  three/star/shaders/flare.frag.glsl   # CREATE - Port from exoplanets star/flare.frag
  views/StarView.vue                   # CREATE - Page component (layout + info card)
  router/index.ts                      # MODIFY - Add /star/:id route
  components/KnownStarsCard.vue        # MODIFY - Link stars to /star/:id
```

---

### Task 1: Port shared GLSL utilities

Port the 4 common shader utility files from exoplanets. These are self-contained GLSL libraries used by all 5 star shaders. In the exoplanets project they use `#include` directives resolved by a custom shader service. In galaxies, we use Vite `?raw` imports and manual string concatenation (same pattern as `GalaxyField.ts` which concatenates `noise-value.glsl` + `galaxy-render.glsl` + `galaxy.frag.glsl`).

**Files:**
- Create: `src/main/site/src/three/star/shaders/noise.glsl`
- Create: `src/main/site/src/three/star/shaders/color.glsl`
- Create: `src/main/site/src/three/star/shaders/seed.glsl`
- Create: `src/main/site/src/three/star/shaders/lighting.glsl`

- [ ] **Step 1: Copy noise.glsl from exoplanets**

Copy `D:\Developer\exoplanets\public\shaders\v2\common\noise.glsl` to `src/main/site/src/three/star/shaders/noise.glsl`. This file is self-contained (no `#include` directives). Keep it exactly as-is.

- [ ] **Step 2: Copy color.glsl from exoplanets**

Copy `D:\Developer\exoplanets\public\shaders\v2\common\color.glsl` to `src/main/site/src/three/star/shaders/color.glsl`. Self-contained, no changes needed.

- [ ] **Step 3: Copy seed.glsl from exoplanets**

Copy `D:\Developer\exoplanets\public\shaders\v2\common\seed.glsl` to `src/main/site/src/three/star/shaders/seed.glsl`. This file has a comment `REQUIRES: color.glsl must be included before this file (provides TAU constant)` — that dependency is handled at import time in Task 4 (StarScene concatenates color before seed).

- [ ] **Step 4: Copy lighting.glsl from exoplanets**

Copy `D:\Developer\exoplanets\public\shaders\v2\common\lighting.glsl` to `src/main/site/src/three/star/shaders/lighting.glsl`. Self-contained.

- [ ] **Step 5: Commit**

```bash
cd src/main/site
git add src/three/star/shaders/noise.glsl src/three/star/shaders/color.glsl src/three/star/shaders/seed.glsl src/three/star/shaders/lighting.glsl
git commit -m "feat(star): port shared GLSL utilities from exoplanets"
```

---

### Task 2: Port star shaders

Port all 5 star shader pairs (10 files). Each shader in exoplanets uses `#include "v2/common/..."` directives. Remove those `#include` lines — the common code will be prepended at runtime by StarScene.ts via string concatenation.

**Files:**
- Create: `src/main/site/src/three/star/shaders/surface.vert.glsl`
- Create: `src/main/site/src/three/star/shaders/surface.frag.glsl`
- Create: `src/main/site/src/three/star/shaders/corona.vert.glsl`
- Create: `src/main/site/src/three/star/shaders/corona.frag.glsl`
- Create: `src/main/site/src/three/star/shaders/rays.vert.glsl`
- Create: `src/main/site/src/three/star/shaders/rays.frag.glsl`
- Create: `src/main/site/src/three/star/shaders/flameTongues.vert.glsl`
- Create: `src/main/site/src/three/star/shaders/flameTongues.frag.glsl`
- Create: `src/main/site/src/three/star/shaders/flare.vert.glsl`
- Create: `src/main/site/src/three/star/shaders/flare.frag.glsl`

- [ ] **Step 1: Copy surface shaders**

Copy from `D:\Developer\exoplanets\public\shaders\v2\star\surface.vert` → `surface.vert.glsl` and `surface.frag` → `surface.frag.glsl`.

Remove all `#include` lines from both files. The surface vertex shader has:
```glsl
#include "v2/common/noise.glsl"
#include "v2/common/color.glsl"
#include "v2/common/seed.glsl"
```
Remove those 3 lines.

The surface fragment shader has:
```glsl
#include "v2/common/noise.glsl"
#include "v2/common/color.glsl"
#include "v2/common/lighting.glsl"
#include "v2/common/seed.glsl"
```
Remove those 4 lines.

- [ ] **Step 2: Copy corona shaders**

Copy `corona.vert` → `corona.vert.glsl` and `corona.frag` → `corona.frag.glsl`. The vertex shader has no includes. The fragment shader has:
```glsl
#include "v2/common/noise.glsl"
#include "v2/common/color.glsl"
#include "v2/common/seed.glsl"
```
Remove those 3 lines.

- [ ] **Step 3: Copy rays shaders**

Copy `rays.vert` → `rays.vert.glsl` and `rays.frag` → `rays.frag.glsl`. The vertex shader has no includes. The fragment shader has:
```glsl
#include "v2/common/color.glsl"
#include "v2/common/seed.glsl"
```
Remove those 2 lines.

- [ ] **Step 4: Copy flameTongues shaders**

Copy `flameTongues.vert` → `flameTongues.vert.glsl` and `flameTongues.frag` → `flameTongues.frag.glsl`. The vertex shader has no includes. The fragment shader has:
```glsl
#include "v2/common/noise.glsl"
#include "v2/common/color.glsl"
#include "v2/common/seed.glsl"
```
Remove those 3 lines.

- [ ] **Step 5: Copy flare shaders**

Copy `flare.vert` → `flare.vert.glsl` and `flare.frag` → `flare.frag.glsl`. The vertex shader has no includes. The fragment shader has:
```glsl
#include "v2/common/noise.glsl"
#include "v2/common/color.glsl"
#include "v2/common/seed.glsl"
```
Remove those 3 lines.

- [ ] **Step 6: Commit**

```bash
cd src/main/site
git add src/three/star/shaders/surface.vert.glsl src/three/star/shaders/surface.frag.glsl \
        src/three/star/shaders/corona.vert.glsl src/three/star/shaders/corona.frag.glsl \
        src/three/star/shaders/rays.vert.glsl src/three/star/shaders/rays.frag.glsl \
        src/three/star/shaders/flameTongues.vert.glsl src/three/star/shaders/flameTongues.frag.glsl \
        src/three/star/shaders/flare.vert.glsl src/three/star/shaders/flare.frag.glsl
git commit -m "feat(star): port 5 star shader pairs from exoplanets"
```

---

### Task 3: Create StarUniforms.ts

Uniform factory, spectral color/activity maps, and seed generation. This is a pure TypeScript module with no DOM or Three.js scene dependencies — just data and factory functions.

**Files:**
- Create: `src/main/site/src/three/star/StarUniforms.ts`

- [ ] **Step 1: Create StarUniforms.ts**

```typescript
import * as THREE from 'three'

// Spectral class → hex color (ported from exoplanets astronomy.ts)
const STAR_COLORS: Record<string, number> = {
  O: 0x5b7cff,
  B: 0x7b9fff,
  A: 0xcad7ff,
  F: 0xf8f7ff,
  G: 0xfff4ea,
  K: 0xffd2a1,
  M: 0xff6644,
  L: 0xcc4422,
  T: 0x9944aa,
  Y: 0x663377,
}

// Spectral class → activity level (ported from exoplanets planetUniforms.ts)
const ACTIVITY_MAP: Record<string, number> = {
  M: 0.95,
  K: 0.65,
  G: 0.55,
  F: 0.35,
  A: 0.25,
  B: 0.85,
  O: 0.90,
  L: 0.20,
  T: 0.15,
  Y: 0.10,
}

// Default temperature by spectral class (used when SIMBAD has no Teff)
const DEFAULT_TEMP: Record<string, number> = {
  O: 35000,
  B: 20000,
  A: 8500,
  F: 6500,
  G: 5778,
  K: 4500,
  M: 3200,
  L: 1800,
  T: 1000,
  Y: 400,
}

/**
 * Extract spectral class letter from a spectral type string.
 * "G2V" → "G", "K5III" → "K", null → "G"
 */
export function parseSpectralClass(spType: string | null): string {
  if (!spType) return 'G'
  const first = spType.charAt(0).toUpperCase()
  return STAR_COLORS[first] !== undefined ? first : 'G'
}

/** Get hex color for a spectral class */
export function getStarColor(spClass: string): number {
  return STAR_COLORS[spClass] ?? STAR_COLORS.G
}

/** Get activity level for a spectral class */
export function getStarActivityLevel(spClass: string): number {
  return ACTIVITY_MAP[spClass] ?? 0.5
}

/** Get default temperature for a spectral class */
export function getDefaultTemperature(spClass: string): number {
  return DEFAULT_TEMP[spClass] ?? 5778
}

/** Deterministic seed from a string (ported from exoplanets planetUniforms.ts) */
export function generateSeed(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash % 1000) / 1000
}

/** Star rendering size constants */
export const STAR_RENDERING = {
  CORONA_SCALE: 1.8,
  FLAME_TONGUES_SCALE: 1.4,
  GLOW_SIZE: 3.0,
  RAYS_SIZE: 6.0,
  RAY_STAR_RADIUS: 0.08,
  LIGHT_INTENSITY: 2.0,
  LIGHT_DISTANCE: 50,
}

export interface StarShaderUniforms {
  surface: Record<string, { value: unknown }>
  corona: Record<string, { value: unknown }>
  rays: Record<string, { value: unknown }>
  flameTongues: Record<string, { value: unknown }>
  glow: Record<string, { value: unknown }>
}

/**
 * Create all shader uniforms for a star.
 * @param spClass - Spectral class letter (O/B/A/F/G/K/M/L/T/Y)
 * @param teff - Effective temperature in Kelvin (null = infer from class)
 * @param name - Star identifier (for deterministic seed)
 */
export function createStarUniforms(
  spClass: string,
  teff: number | null,
  name: string,
): StarShaderUniforms {
  const color = new THREE.Color(getStarColor(spClass))
  const temperature = teff ?? getDefaultTemperature(spClass)
  const activity = getStarActivityLevel(spClass)
  const seed = generateSeed(name)

  return {
    surface: {
      uStarColor: { value: color },
      uTime: { value: 0 },
      uTemperature: { value: temperature },
      uSeed: { value: seed },
      uActivityLevel: { value: activity },
    },
    corona: {
      uStarColor: { value: color },
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
      uSeed: { value: seed },
      uActivityLevel: { value: activity },
    },
    rays: {
      uStarColor: { value: color },
      uTime: { value: 0 },
      uTemperature: { value: temperature },
      uSeed: { value: seed },
      uActivityLevel: { value: activity },
      uStarRadius: { value: STAR_RENDERING.RAY_STAR_RADIUS },
    },
    flameTongues: {
      uStarColor: { value: color },
      uTime: { value: 0 },
      uSeed: { value: seed },
      uActivityLevel: { value: activity },
    },
    glow: {
      uColor: { value: color },
      uIntensity: { value: 1.0 },
      uTime: { value: 0 },
      uSeed: { value: seed },
    },
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd src/main/site
git add src/three/star/StarUniforms.ts
git commit -m "feat(star): add StarUniforms with spectral maps and uniform factory"
```

---

### Task 4: Create StarScene.ts

The main Three.js scene class. Renders 6 visual layers (surface sphere, corona sphere, flame tongues sphere, 4 flare planes, rays billboard, glow billboard) plus the GalaxyBackdrop nebula skybox. Uses OrbitControls for camera interaction.

**Files:**
- Create: `src/main/site/src/three/star/StarScene.ts`

- [ ] **Step 1: Create StarScene.ts**

This is the largest file. Key design decisions:
- Shader strings are built by concatenating common GLSL libraries + shader-specific code via Vite `?raw` imports (same pattern as `GalaxyField.ts`).
- The `#include` directives were removed from shader files in Task 2, so we prepend the library code here.
- Surface shader needs: `noise.glsl + color.glsl + seed.glsl` prepended to vertex, `noise.glsl + color.glsl + lighting.glsl + seed.glsl` prepended to fragment.
- Corona frag needs: `noise.glsl + color.glsl + seed.glsl`.
- Rays frag needs: `color.glsl + seed.glsl`.
- FlameTongues frag needs: `noise.glsl + color.glsl + seed.glsl`.
- Flare frag needs: `noise.glsl + color.glsl + seed.glsl`.
- Solar flares are 4 plane meshes positioned on the star surface, animated outward. Port the logic from `SolarFlares.tsx` into the scene's animation loop (no React component needed — it's vanilla Three.js here).
- The glow is an inline billboard shader (not a file), same as in `CelestialBody.tsx`.
- OrbitControls imported from `three/addons/controls/OrbitControls.js`.

```typescript
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
    this.camera.position.set(0, 0, 4)

    // Controls
    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 2
    this.controls.maxDistance = 15
    this.controls.enablePan = false

    // Star group
    this.starGroup = new THREE.Group()
    this.scene.add(this.starGroup)

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
    const geo = new THREE.SphereGeometry(1, 64, 64)
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
    const geo = new THREE.SphereGeometry(STAR_RENDERING.CORONA_SCALE, 64, 64)
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
    const geo = new THREE.SphereGeometry(STAR_RENDERING.FLAME_TONGUES_SCALE, 64, 64)
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
    const mesh = new THREE.Mesh(geo, this.raysMaterial)
    // Billboard: always face camera — done in animate loop
    mesh.name = 'rays-billboard'
    this.starGroup.add(mesh)
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
    const mesh = new THREE.Mesh(geo, this.glowMaterial)
    mesh.name = 'glow-billboard'
    this.starGroup.add(mesh)
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
    const raysMesh = this.starGroup.getObjectByName('rays-billboard') as THREE.Mesh | undefined
    const glowMesh = this.starGroup.getObjectByName('glow-billboard') as THREE.Mesh | undefined
    if (raysMesh) raysMesh.quaternion.copy(this.camera.quaternion)
    if (glowMesh) glowMesh.quaternion.copy(this.camera.quaternion)

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
      mesh.position.copy(data.direction.clone().multiplyScalar(travelDistance))

      mat.uniforms.uTime.value = time
      mat.uniforms.uFlarePhase.value = activePhase
    }

    // Backdrop follows camera
    this.backdrop.update(time, this.camera)
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
```

- [ ] **Step 2: Verify the build compiles**

Run: `cd src/main/site && npx vue-tsc --noEmit`

Expected: No type errors related to StarScene.ts or StarUniforms.ts. Shader `?raw` imports resolve to `string` type via Vite.

- [ ] **Step 3: Commit**

```bash
cd src/main/site
git add src/three/star/StarScene.ts
git commit -m "feat(star): add StarScene with 5-layer shader rendering and backdrop"
```

---

### Task 5: Create useSimbadStar composable

Queries SIMBAD TAP API for a single star by its main_id, returning extended physical properties.

**Files:**
- Create: `src/main/site/src/composables/useSimbadStar.ts`

- [ ] **Step 1: Create useSimbadStar.ts**

```typescript
import { ref, readonly } from 'vue'

export interface SimbadStar {
  mainId: string
  ra: number
  dec: number
  objectType: string
  spectralType: string | null
  parallax: number | null
  vMag: number | null
  bMag: number | null
  teff: number | null
  logg: number | null
  feh: number | null
  simbadUrl: string
}

export function useSimbadStar() {
  const loading = ref(false)
  const star = ref<SimbadStar | null>(null)
  const error = ref<string | null>(null)
  let fetchAbort: AbortController | null = null

  async function query(mainId: string): Promise<void> {
    fetchAbort?.abort()
    fetchAbort = new AbortController()
    const signal = fetchAbort.signal

    loading.value = true
    error.value = null
    star.value = null

    try {
      const adql = `SELECT TOP 1
  b.main_id, b.ra, b.dec, b.otype_txt, b.sp_type, b.plx_value,
  a.V, a.B,
  f.teff, f.log_g, f.fe_h
FROM basic AS b
LEFT JOIN allfluxes AS a ON b.oid = a.oidref
LEFT JOIN (
  SELECT oidref, teff, log_g, fe_h
  FROM mesFe_h
  WHERE mespos = 1
) AS f ON b.oid = f.oidref
WHERE b.main_id = '${mainId.replace(/'/g, "''")}'`

      const url = `https://simbad.cds.unistra.fr/simbad/sim-tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=${encodeURIComponent(adql)}`
      const response = await fetch(url, { signal })
      if (!response.ok) throw new Error(`SIMBAD TAP error: ${response.statusText}`)
      const data = await response.json()

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const row = data.data[0] as unknown[]
        // Columns: main_id(0), ra(1), dec(2), otype_txt(3), sp_type(4), plx_value(5),
        //          V(6), B(7), teff(8), log_g(9), fe_h(10)
        star.value = {
          mainId: String(row[0] ?? mainId),
          ra: Number(row[1]) || 0,
          dec: Number(row[2]) || 0,
          objectType: String(row[3] ?? 'Star'),
          spectralType: row[4] != null ? String(row[4]) : null,
          parallax: typeof row[5] === 'number' ? row[5] : null,
          vMag: typeof row[6] === 'number' ? row[6] : null,
          bMag: typeof row[7] === 'number' ? row[7] : null,
          teff: typeof row[8] === 'number' ? row[8] : null,
          logg: typeof row[9] === 'number' ? row[9] : null,
          feh: typeof row[10] === 'number' ? row[10] : null,
          simbadUrl: `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(mainId)}`,
        }
      } else {
        error.value = 'Star not found in SIMBAD'
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      if (!signal.aborted) {
        loading.value = false
        fetchAbort = null
      }
    }
  }

  function reset(): void {
    fetchAbort?.abort()
    fetchAbort = null
    loading.value = false
    error.value = null
    star.value = null
  }

  return {
    loading: readonly(loading),
    star: readonly(star),
    error: readonly(error),
    query,
    reset,
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd src/main/site
git add src/composables/useSimbadStar.ts
git commit -m "feat(star): add useSimbadStar composable for SIMBAD TAP queries"
```

---

### Task 6: Create StarView.vue

Page component with the 3D canvas and info card sidebar.

**Files:**
- Create: `src/main/site/src/views/StarView.vue`

- [ ] **Step 1: Create StarView.vue**

```vue
<template>
  <div class="star-page">
    <canvas ref="canvasRef" class="star-canvas" />
    <div v-if="star" class="star-info-card">
      <div class="card-header">
        <span class="star-name">{{ star.mainId }}</span>
        <span v-if="spClass" class="spectral-badge" :style="{ background: badgeColor }">
          {{ star.spectralType || spClass }}
        </span>
      </div>
      <div class="card-body">
        <div class="info-row">
          <span class="label">Type</span>
          <span class="value">{{ star.objectType }}</span>
        </div>
        <div class="info-row">
          <span class="label">Temperature</span>
          <span class="value">{{ star.teff != null ? `${star.teff} K` : '--' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Surface gravity</span>
          <span class="value">{{ star.logg != null ? `log g = ${star.logg.toFixed(2)}` : '--' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Metallicity</span>
          <span class="value">{{ star.feh != null ? `[Fe/H] = ${star.feh.toFixed(2)}` : '--' }}</span>
        </div>
        <div class="info-row">
          <span class="label">V magnitude</span>
          <span class="value">{{ star.vMag != null ? star.vMag.toFixed(2) : '--' }}</span>
        </div>
        <div class="info-row">
          <span class="label">B-V</span>
          <span class="value">{{ bvColor }}</span>
        </div>
        <div class="info-row">
          <span class="label">Distance</span>
          <span class="value">{{ distanceDisplay }}</span>
        </div>
      </div>
      <a :href="star.simbadUrl" target="_blank" rel="noopener noreferrer" class="simbad-link">
        SIMBAD <span class="link-icon">↗</span>
      </a>
    </div>
    <div v-if="loading" class="loading-overlay">
      <span class="loading-text">Loading star data...</span>
    </div>
    <div v-if="error" class="error-overlay">
      <span>{{ error }}</span>
      <router-link to="/" class="back-link">Back to home</router-link>
    </div>
    <button class="back-btn" @click="$router.back()">←</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSimbadStar } from '@/composables/useSimbadStar'
import { parseSpectralClass, getStarColor } from '@/three/star/StarUniforms'
import { StarScene } from '@/three/star/StarScene'

const route = useRoute()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { loading, star, error, query } = useSimbadStar()
let scene: StarScene | null = null

const spClass = computed(() => star.value ? parseSpectralClass(star.value.spectralType) : null)

const badgeColor = computed(() => {
  if (!spClass.value) return '#666'
  const hex = getStarColor(spClass.value)
  return `#${hex.toString(16).padStart(6, '0')}`
})

const bvColor = computed(() => {
  const s = star.value
  if (!s || s.bMag == null || s.vMag == null) return '--'
  return (s.bMag - s.vMag).toFixed(2)
})

const distanceDisplay = computed(() => {
  const s = star.value
  if (!s || s.parallax == null || s.parallax <= 0) return '--'
  const pc = 1000 / s.parallax
  const ly = pc * 3.2616
  if (ly < 100) return `${ly.toFixed(1)} ly`
  return `${Math.round(ly).toLocaleString()} ly`
})

function initScene(): void {
  if (!canvasRef.value || !star.value) return
  scene?.dispose()
  const sc = spClass.value || 'G'
  scene = new StarScene(canvasRef.value, sc, star.value.teff, star.value.mainId)
  scene.resize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  scene.start()
}

function onResize(): void {
  if (!canvasRef.value || !scene) return
  scene.resize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
}

watch(star, (s) => {
  if (s) initScene()
})

onMounted(() => {
  const id = decodeURIComponent(route.params.id as string)
  query(id)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  scene?.dispose()
  scene = null
})
</script>

<style scoped>
.star-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.star-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.star-info-card {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 240px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 16px;
  color: #e0e0e0;
  backdrop-filter: blur(12px);
  pointer-events: auto;
  z-index: 10;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.star-name {
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.spectral-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  color: #000;
  flex-shrink: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.label {
  color: rgba(255, 255, 255, 0.45);
}

.value {
  color: #e0e0e0;
  text-align: right;
}

.simbad-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 6px;
  color: #22d3ee;
  text-decoration: none;
  font-size: 12px;
  transition: background 0.2s;
}

.simbad-link:hover {
  background: rgba(34, 211, 238, 0.2);
}

.link-icon {
  font-size: 10px;
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #e0e0e0;
  font-size: 18px;
  padding: 4px 12px;
  cursor: pointer;
  z-index: 20;
  backdrop-filter: blur(8px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.loading-overlay,
.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  z-index: 30;
}

.back-link {
  color: #22d3ee;
  font-size: 12px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
cd src/main/site
git add src/views/StarView.vue
git commit -m "feat(star): add StarView with 3D scene and info card"
```

---

### Task 7: Add route and update KnownStarsCard links

Wire up the `/star/:id` route and change KnownStarsCard to link star-type objects internally.

**Files:**
- Modify: `src/main/site/src/router/index.ts`
- Modify: `src/main/site/src/components/KnownStarsCard.vue`

- [ ] **Step 1: Add route to router/index.ts**

Add this route entry after the `/tour` route (before the closing `]` of the routes array):

```typescript
{
  path: '/star/:id',
  name: 'star',
  component: () => import('@/views/StarView.vue'),
  meta: {
    title: 'Star | Galaxies',
    description: 'Explore a star with procedural 3D rendering driven by SIMBAD catalog data.',
  },
},
```

- [ ] **Step 2: Update KnownStarsCard.vue template**

Replace the current `<a>` element in the results list with a conditional that uses `<router-link>` for star-type objects and keeps `<a>` for everything else:

Change the template `<a>` block from:
```html
<a
  v-for="obj in objects"
  :key="obj.name"
  :href="obj.simbadUrl"
  target="_blank"
  rel="noopener noreferrer"
  class="result-item"
>
```

To:
```html
<component
  :is="isStarLike(obj.type) ? 'router-link' : 'a'"
  v-for="obj in objects"
  :key="obj.name"
  v-bind="isStarLike(obj.type)
    ? { to: `/star/${encodeURIComponent(obj.name)}` }
    : { href: obj.simbadUrl, target: '_blank', rel: 'noopener noreferrer' }"
  class="result-item"
>
```

The `isStarLike` function already exists in the script and correctly identifies star-type objects. The link icon `↗` should only show for external links. Update the `<span class="link-icon">` to:

```html
<span v-if="!isStarLike(obj.type)" class="link-icon">↗</span>
```

- [ ] **Step 3: Verify the build compiles**

Run: `cd src/main/site && npx vue-tsc --noEmit`

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
cd src/main/site
git add src/router/index.ts src/components/KnownStarsCard.vue
git commit -m "feat(star): add /star/:id route and link stars from KnownStarsCard"
```

---

### Task 8: Manual smoke test

Verify the full flow end-to-end.

- [ ] **Step 1: Start dev server**

Run: `cd src/main/site && npm run dev`

- [ ] **Step 2: Test star rendering via direct URL**

Navigate to `http://localhost:5173/star/*+alf+CMa` (Sirius). Verify:
- SIMBAD data loads (spectral type A1V, temperature ~9940K)
- Star renders with blue-white surface shader
- Corona, flame tongues, and rays are visible
- Glow billboard renders
- OrbitControls work (drag to rotate, scroll to zoom)
- Nebula backdrop is visible behind the star
- Info card shows on the left with star properties
- SIMBAD link opens external page

- [ ] **Step 3: Test navigation from galaxy page**

Navigate to a galaxy detail page (e.g., `/g/2557` — M31 Andromeda). Wait for KnownStarsCard to populate. Click a star entry. Verify:
- Navigation goes to `/star/...` (not external SIMBAD)
- Star renders correctly
- Back button returns to galaxy page

- [ ] **Step 4: Test with a cool star**

Navigate to `http://localhost:5173/star/*+alf+Ori` (Betelgeuse). Verify:
- Red/orange surface (M-type)
- High activity level (M=0.95) — visible flares and flame tongues
- Temperature shows ~3600K

- [ ] **Step 5: Fix any issues found**

Address any shader compilation errors, layout issues, or API problems discovered during testing.

- [ ] **Step 6: Final commit if fixes were needed**

```bash
cd src/main/site
git add -A
git commit -m "fix(star): address issues found during smoke test"
```
