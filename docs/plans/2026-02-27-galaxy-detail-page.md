# Galaxy Detail Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Click a galaxy on the home sky view to navigate to `/g/:name`, showing a procedural 3D galaxy visualization (ported from gcanvas) with an info overlay.

**Architecture:** Port the gcanvas galaxy-playground generator + shaders into TypeScript/Three.js. A params mapper translates real catalog data (morphology string, magnitudes, etc.) into generator parameters. The scene renders particles, nebula, black hole, and haze layers with orbit camera controls.

**Tech Stack:** Vue 3, Three.js, GLSL shaders, vue-router, TypeScript

**Reference files (gcanvas — read-only, port from these):**
- `D:\Developer\gcanvas\demos\js\galaxy\galaxy.generator.js` — star generation
- `D:\Developer\gcanvas\demos\js\galaxy\galaxy.config.js` — presets + CONFIG
- `D:\Developer\gcanvas\src\webgl\shaders\nebula-shaders.js` — nebula GLSL
- `D:\Developer\gcanvas\src\webgl\shaders\blackhole-shaders.js` — black hole GLSL
- `D:\Developer\gcanvas\src\webgl\shaders\point-sprite-shaders.js` — particle GLSL
- `D:\Developer\gcanvas\src\webgl\webgl-nebula-renderer.js` — nebula renderer
- `D:\Developer\gcanvas\src\webgl\webgl-blackhole-renderer.js` — black hole renderer

**Base directory for all new/modified files:**
`D:\Developer\galaxies\.worktrees\sprint1-site\src\main\site\src\`

---

## Task 1: Morphology Parser + Params Mapper

**Files:**
- Create: `three/galaxy-detail/GalaxyParamsMapper.ts`

This is the critical bridge layer. Parses the Hubble morphology string and maps catalog data to generator parameters.

**Step 1: Create the morphology parser**

Parse strings like `SBbc`, `E3`, `S0/a`, `Sa`, `Irr` into structured data:

```typescript
// three/galaxy-detail/GalaxyParamsMapper.ts

import type { Galaxy } from '@/types/galaxy'
import type { MorphologyClass } from '@/types/galaxy'
import { classifyMorphology } from '@/types/galaxy'

// ─── Types ──────────────────────────────────────────────────────────────────

interface ParsedMorphology {
  type: 'spiral' | 'barred' | 'elliptical' | 'lenticular' | 'irregular'
  hubbleStage: number     // 1 (Sa) → 9 (Sm), 0 for non-spirals
  eNumber: number | null  // 0-7 for ellipticals
  barStrength: 'strong' | 'weak' | null
  ringType: 'r' | 's' | 'rs' | null
}

// Discriminated union for generator params
export interface SpiralParams {
  type: 'spiral'
  numArms: number
  starCount: number
  galaxyRadius: number
  armWidth: number
  spiralTightness: number
  spiralStart: number
  fieldStarFraction: number
  bulgeRadius: number
  irregularity: number
}

export interface BarredParams {
  type: 'barred'
  numArms: number
  starCount: number
  galaxyRadius: number
  armWidth: number
  spiralTightness: number
  spiralStart: number
  fieldStarFraction: number
  bulgeRadius: number
  barLength: number
  barWidth: number
  irregularity: number
}

export interface EllipticalParams {
  type: 'elliptical'
  starCount: number
  galaxyRadius: number
  ellipticity: number
  axisRatio: number
}

export interface LenticularParams {
  type: 'lenticular'
  starCount: number
  galaxyRadius: number
  bulgeRadius: number
  bulgeFraction: number
  diskThickness: number
}

export interface IrregularParams {
  type: 'irregular'
  starCount: number
  galaxyRadius: number
  irregularity: number
  clumpCount: number
}

export type GeneratorParams =
  | SpiralParams
  | BarredParams
  | EllipticalParams
  | LenticularParams
  | IrregularParams
```

**Step 2: Implement parseMorphology()**

```typescript
// Hubble stage lookup: letter → T-type (1-9)
const HUBBLE_STAGES: Record<string, number> = {
  'a': 1, 'ab': 2, 'b': 3, 'bc': 4, 'c': 5, 'cd': 6, 'd': 7, 'dm': 8, 'm': 9,
}

function parseMorphology(morph: string | null): ParsedMorphology {
  if (!morph) return { type: 'spiral', hubbleStage: 3, eNumber: null, barStrength: null, ringType: null }

  const m = morph.trim()

  // Elliptical: E, E0-E7
  const ellMatch = m.match(/^[cd]?E(\d)?$/i)
  if (ellMatch) {
    return {
      type: 'elliptical',
      hubbleStage: 0,
      eNumber: ellMatch[1] ? parseInt(ellMatch[1]) : 3,
      barStrength: null,
      ringType: null,
    }
  }

  // Lenticular: S0, S0/a, E/S0
  if (/S0|E\/S/i.test(m)) {
    return {
      type: 'lenticular',
      hubbleStage: 0,
      eNumber: null,
      barStrength: null,
      ringType: null,
    }
  }

  // Irregular: Irr, Im, I, IBm
  if (/^I(rr|m|B|$)/i.test(m)) {
    return {
      type: 'irregular',
      hubbleStage: 0,
      eNumber: null,
      barStrength: null,
      ringType: null,
    }
  }

  // Spiral or Barred: parse bar strength, ring type, Hubble stage
  let barStrength: 'strong' | 'weak' | null = null
  if (/^SB/i.test(m)) barStrength = 'strong'
  else if (/^SAB/i.test(m)) barStrength = 'weak'

  // Ring type: (r), (s), (rs)
  let ringType: 'r' | 's' | 'rs' | null = null
  const ringMatch = m.match(/\((rs|r|s)\)/)
  if (ringMatch) {
    ringType = ringMatch[1] as 'r' | 's' | 'rs'
  }

  // Hubble stage letter: extract trailing lowercase letters after stripping prefix
  const stageMatch = m.match(/(?:SAB|SB|SA|S)\(?(?:rs|r|s)?\)?([a-d](?:[a-d])?|m)/i)
  let hubbleStage = 3 // default Sb
  if (stageMatch) {
    const letter = stageMatch[1].toLowerCase()
    hubbleStage = HUBBLE_STAGES[letter] ?? 3
  }

  return {
    type: barStrength ? 'barred' : 'spiral',
    hubbleStage,
    eNumber: null,
    barStrength,
    ringType,
  }
}
```

**Step 3: Implement galaxyToGeneratorParams()**

Seeded PRNG using galaxy ID for deterministic randomization:

```typescript
// Simple seeded PRNG (mulberry32)
function seededRandom(seed: number): () => number {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

export function galaxyToGeneratorParams(galaxy: Galaxy): GeneratorParams {
  const morph = parseMorphology(galaxy.morphology)
  const rand = seededRandom(galaxy.id)

  // Compute physical size if we have the data
  const velocity = galaxy.velocity ?? 0
  const distanceMpc = Math.abs(velocity) / 70 // Hubble law
  const diameterArcsec = galaxy.diameter_arcsec ?? 120
  const physicalKpc = distanceMpc > 0.1
    ? distanceMpc * diameterArcsec / 206.265
    : 30 // default ~Milky Way size

  // Size scaling: log scale from 3 kpc (dwarf) to 100 kpc (giant)
  const sizeT = clamp01((Math.log10(Math.max(physicalKpc, 1)) - 0.5) / 2.0)
  const galaxyRadius = lerp(280, 380, sizeT)

  // Star count from luminosity (if magnitude available)
  const mag = galaxy.b_mag ?? galaxy.r_mag ?? null
  let starCount = 20000
  if (mag !== null && distanceMpc > 0.1) {
    const absMag = mag - 5 * Math.log10(distanceMpc * 1e6) + 5
    const relLum = Math.pow(10, (-20.8 - absMag) / 2.5)
    starCount = Math.round(20000 * Math.max(0.5, Math.min(1.8, relLum)))
  }
  starCount = Math.max(10000, Math.min(36000, starCount))

  switch (morph.type) {
    case 'elliptical': {
      const eNum = morph.eNumber ?? (galaxy.axial_ratio != null ? Math.round((1 - galaxy.axial_ratio) * 10) : 3)
      const ell = Math.min(eNum, 7) / 10
      return {
        type: 'elliptical',
        starCount,
        galaxyRadius,
        ellipticity: ell,
        axisRatio: 1 - ell,
      }
    }

    case 'lenticular': {
      // S0-, S0, S0+ sub-stages randomized
      const sub = rand() // 0-1 maps to early-to-late
      return {
        type: 'lenticular',
        starCount,
        galaxyRadius,
        bulgeRadius: lerp(80, 40, sub),
        bulgeFraction: lerp(0.65, 0.30, sub),
        diskThickness: lerp(2, 8, sub),
      }
    }

    case 'spiral': {
      const t = clamp01((morph.hubbleStage - 1) / 8) // 0 (Sa) → 1 (Sm)
      const spiralStart = morph.ringType === 'r' ? lerp(50, 80, rand())
        : morph.ringType === 's' ? lerp(10, 30, rand())
        : lerp(20, 60, rand())

      // Arm count: earlier types favor 2, later types more varied
      let numArms = 2
      if (t > 0.5) {
        const r = rand()
        numArms = r < 0.3 ? 2 : r < 0.6 ? 3 : r < 0.85 ? 4 : 5
      } else if (rand() < 0.2) {
        numArms = 3
      }

      return {
        type: 'spiral',
        numArms,
        starCount,
        galaxyRadius,
        armWidth: lerp(15, 120, t) + (rand() - 0.5) * 10,
        spiralTightness: lerp(0.08, 0.50, t) + (rand() - 0.5) * 0.04,
        spiralStart,
        fieldStarFraction: lerp(0.05, 0.40, t),
        bulgeRadius: lerp(140, 0, t),
        irregularity: t > 0.7 ? lerp(0, 0.15, (t - 0.7) / 0.3) : 0,
      }
    }

    case 'barred': {
      const t = clamp01((morph.hubbleStage - 1) / 8)
      const spiralStart = morph.ringType === 'r' ? lerp(50, 80, rand())
        : morph.ringType === 's' ? lerp(10, 30, rand())
        : lerp(30, 60, rand())

      const barScale = morph.barStrength === 'weak' ? [0.15, 0.30] as const : [0.30, 0.60] as const
      const barLength = galaxyRadius * lerp(barScale[0], barScale[1], rand())

      // Barred galaxies strongly favor 2 arms
      const numArms = rand() < 0.8 ? 2 : rand() < 0.5 ? 3 : 4

      return {
        type: 'barred',
        numArms,
        starCount,
        galaxyRadius,
        armWidth: lerp(15, 100, t) + (rand() - 0.5) * 10,
        spiralTightness: lerp(0.10, 0.45, t) + (rand() - 0.5) * 0.04,
        spiralStart,
        fieldStarFraction: lerp(0.06, 0.35, t),
        bulgeRadius: lerp(80, 0, t),
        barLength,
        barWidth: barLength * lerp(0.15, 0.30, rand()),
        irregularity: 0,
      }
    }

    case 'irregular': {
      return {
        type: 'irregular',
        starCount: Math.min(starCount, 20000),
        galaxyRadius: Math.min(galaxyRadius, 300),
        irregularity: lerp(0.3, 0.8, rand()),
        clumpCount: Math.floor(lerp(3, 8, rand())),
      }
    }
  }
}
```

**Step 4: Commit**

```bash
git add src/three/galaxy-detail/GalaxyParamsMapper.ts
git commit -m "feat: add morphology parser and catalog-to-generator params mapper"
```

---

## Task 2: Galaxy Generator (port from gcanvas)

**Files:**
- Create: `three/galaxy-detail/GalaxyGenerator.ts`

Port `galaxy.generator.js` and the CONFIG constants to TypeScript. The generator takes `GeneratorParams` and returns a star array.

**Step 1: Create generator with types and CONFIG**

```typescript
// three/galaxy-detail/GalaxyGenerator.ts

import type { GeneratorParams } from './GalaxyParamsMapper'

const TAU = Math.PI * 2

export interface Star {
  radius: number
  angle: number
  y: number
  rotationSpeed: number
  hue: number
  brightness: number
  size: number
  alpha: number
  layer: 'dust' | 'star' | 'bright'
  twinklePhase: number
}

// ─── CONFIG (ported from galaxy.config.js) ──────────────────────────────────

const CONFIG = {
  rotation: { baseSpeed: 0.033, falloff: 0.35, referenceRadius: 20 },
  blackHole: { exclusionRadius: 25 },
  visual: {
    dustFraction: 0.65,
    brightFraction: 0.03,
    coreHueRange: [40, 60] as const,
    armHueRange: [200, 240] as const,
    hiiHueRange: [320, 340] as const,
    fieldHueRange: [10, 30] as const,
    dustHueRange: [240, 280] as const,
    hiiRegionChance: 0.15,
    diskThickness: 8,
    nebulaGlowSamples: 20,
  },
}
```

**Step 2: Port helper functions**

Port `assignLayer`, `layerProperties`, `pickHue`, `computeRotationSpeed` directly from the gcanvas source. These are pure functions that translate 1:1.

Refer to: `D:\Developer\gcanvas\demos\js\galaxy\galaxy.generator.js` lines 28-104

**Step 3: Port generator functions**

Port all 5 generator functions from gcanvas:
- `generateSpiral(params)` — logarithmic spiral arms (lines 198-318)
- `generateBarredSpiral(params)` — bar + spiral arms (lines 326-467)
- `generateLenticular(params)` — bulge + exponential disk (lines 476-539)
- `generateElliptical(params)` — Sersic-like distribution (lines 547-586)
- `generateIrregular(params)` — clumpy distribution (lines 594-657)

Also port `applyCentralClearZone` and `generateFieldStar`.

The main entry point:

```typescript
export function generateGalaxy(params: GeneratorParams): Star[] {
  switch (params.type) {
    case 'spiral': return generateSpiral(params)
    case 'barred': return generateBarredSpiral(params)
    case 'lenticular': return generateLenticular(params)
    case 'elliptical': return generateElliptical(params)
    case 'irregular': return generateIrregular(params)
  }
}
```

Each generator function receives its specific typed params (e.g., `SpiralParams`), so TypeScript enforces that only relevant params are accessed.

**Step 4: Commit**

```bash
git add src/three/galaxy-detail/GalaxyGenerator.ts
git commit -m "feat: port galaxy star generator from gcanvas to TypeScript"
```

---

## Task 3: Galaxy Particles (THREE.Points renderer)

**Files:**
- Create: `three/galaxy-detail/GalaxyParticles.ts`
- Create: `three/galaxy-detail/shaders/particle.vert.glsl`
- Create: `three/galaxy-detail/shaders/particle.frag.glsl`

**Step 1: Create particle shaders**

Vertex shader — takes star attributes, outputs screen position and size:

```glsl
// shaders/particle.vert.glsl
attribute float aSize;
attribute vec4 aColor;  // rgb + alpha

uniform float uPixelRatio;

varying vec4 vColor;

void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (600.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
```

Fragment shader — glow effect ported from gcanvas point-sprite-shaders.js GLOW preset:

```glsl
// shaders/particle.frag.glsl
varying vec4 vColor;

void main() {
  vec2 coord = gl_PointCoord - 0.5;
  float dist = length(coord);
  if (dist > 0.5) discard;

  float core = smoothstep(0.18, 0.0, dist);
  float halo = exp(-dist * dist * 18.0);
  float edge = smoothstep(0.5, 0.4, dist);
  float intensity = max(core, halo * 0.6) * edge;

  vec3 litRgb = mix(vColor.rgb, vec3(1.0), core * 0.6);
  float alpha = vColor.a * intensity;
  gl_FragColor = vec4(litRgb * alpha, alpha);
}
```

**Step 2: Create GalaxyParticles class**

```typescript
// three/galaxy-detail/GalaxyParticles.ts

import * as THREE from 'three'
import type { Star } from './GalaxyGenerator'
import vertexShader from './shaders/particle.vert.glsl?raw'
import fragmentShader from './shaders/particle.frag.glsl?raw'

// Painter.colors.hslToRgb equivalent
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100
  // ... standard HSL→RGB conversion
}

export class GalaxyParticles {
  readonly points: THREE.Points
  private geometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial
  private stars: Star[]
  private angleOffsets: Float32Array  // current angle per star

  constructor(stars: Star[]) {
    this.stars = stars
    // Build position, color, size buffers from stars
    // Store star angle in angleOffsets for per-frame rotation
    // Create THREE.Points with ShaderMaterial
  }

  update(dt: number, time: number): void {
    // Differential rotation: angleOffsets[i] += stars[i].rotationSpeed * dt
    // Rebuild position buffer from polar coords
    // Twinkle: modulate alpha uniform or rebuild color buffer
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
```

The constructor converts each star's (radius, angle, y) to (x, y, z) Cartesian for the position buffer. Each frame, `update()` increments angles and recalculates positions.

**Step 3: Commit**

```bash
git add src/three/galaxy-detail/GalaxyParticles.ts src/three/galaxy-detail/shaders/particle.vert.glsl src/three/galaxy-detail/shaders/particle.frag.glsl
git commit -m "feat: add Three.js galaxy particle renderer with glow shader"
```

---

## Task 4: Galaxy Haze (radial glow sprite)

**Files:**
- Create: `three/galaxy-detail/GalaxyHaze.ts`

**Step 1: Create haze class**

A large transparent sprite at the galaxy center with a radial gradient texture, providing soft background glow. Port the logic from `_drawGalacticHaze` in galaxy-playground.js.

```typescript
// three/galaxy-detail/GalaxyHaze.ts

import * as THREE from 'three'

export class GalaxyHaze {
  readonly mesh: THREE.Mesh
  private material: THREE.MeshBasicMaterial

  constructor(galaxyRadius: number) {
    // Create a radial gradient texture procedurally on an offscreen canvas
    // Apply to a PlaneGeometry with transparent + additive blending
    // Scale to ~galaxyRadius * 2
  }

  dispose(): void { ... }
}
```

**Step 2: Commit**

```bash
git add src/three/galaxy-detail/GalaxyHaze.ts
git commit -m "feat: add galaxy haze radial glow layer"
```

---

## Task 5: Galaxy Nebula (fullscreen shader)

**Files:**
- Create: `three/galaxy-detail/GalaxyNebula.ts`
- Create: `three/galaxy-detail/shaders/nebula.vert.glsl`
- Create: `three/galaxy-detail/shaders/nebula.frag.glsl`

**Step 1: Port nebula shaders**

Copy the GLSL from `D:\Developer\gcanvas\src\webgl\shaders\nebula-shaders.js` into separate `.glsl` files. The fragment shader uses simplex 3D noise, FBM, spiral noise, and emission line colors. It does inverse camera projection to find galaxy-plane position per pixel.

For Three.js, we render a fullscreen quad. The vertex shader is a simple passthrough. The fragment shader needs adaptation:
- Replace `uCenter` pixel-space projection with Three.js camera uniforms
- The inverse projection math stays the same but maps to Three.js camera matrices
- Add Three.js-compatible uniform declarations

**Step 2: Create GalaxyNebula class**

```typescript
// three/galaxy-detail/GalaxyNebula.ts

import * as THREE from 'three'
import type { Star } from './GalaxyGenerator'

export class GalaxyNebula {
  readonly mesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private densityTexture: THREE.DataTexture

  constructor(stars: Star[], galaxyRadius: number) {
    // Build density map from star positions (port updateDensityMap from webgl-nebula-renderer.js)
    // Create fullscreen quad with ShaderMaterial
    // Set up uniforms matching the gcanvas nebula shader
  }

  update(time: number, camera: THREE.PerspectiveCamera, galaxyRotation: number): void {
    // Update time, camera tilt/rotation uniforms each frame
  }

  dispose(): void { ... }
}
```

The density map is built once from star positions (same box-blur algorithm as in `webgl-nebula-renderer.js` `updateDensityMap`). Uploaded as a `THREE.DataTexture`.

**Step 3: Commit**

```bash
git add src/three/galaxy-detail/GalaxyNebula.ts src/three/galaxy-detail/shaders/nebula.vert.glsl src/three/galaxy-detail/shaders/nebula.frag.glsl
git commit -m "feat: add procedural nebula shader layer"
```

---

## Task 6: Galaxy Black Hole (raymarched shader)

**Files:**
- Create: `three/galaxy-detail/GalaxyBlackHole.ts`
- Create: `three/galaxy-detail/shaders/blackhole.vert.glsl`
- Create: `three/galaxy-detail/shaders/blackhole.frag.glsl`

**Step 1: Port black hole shaders**

Copy GLSL from `D:\Developer\gcanvas\src\webgl\shaders\blackhole-shaders.js`. The fragment shader raymarches with Newtonian gravity, renders an FBM accretion disk with Doppler beaming, photon ring, and gravitational halo. This shader is mostly self-contained — it only needs `uTime`, `uTiltX`, `uRotY`, `uDiskOuterLimit`, and `uResolution`.

For Three.js, render on a small quad at galaxy center. Use `THREE.ShaderMaterial` on a `PlaneGeometry`. The quad scales with camera distance to maintain visual size.

**Step 2: Create GalaxyBlackHole class**

```typescript
// three/galaxy-detail/GalaxyBlackHole.ts

import * as THREE from 'three'

export class GalaxyBlackHole {
  readonly mesh: THREE.Mesh
  private material: THREE.ShaderMaterial

  constructor(activityClass: string | null) {
    // Determine disk outer limit from activity class:
    // Sy1/Sy2 → larger/brighter disk, null → default
    // Create small PlaneGeometry with ShaderMaterial
    // Transparent + premultiplied alpha blending
  }

  update(time: number, cameraTiltX: number, cameraRotY: number): void {
    // Update shader uniforms
    // Billboard: mesh.lookAt(camera)
  }

  dispose(): void { ... }
}
```

**Step 3: Commit**

```bash
git add src/three/galaxy-detail/GalaxyBlackHole.ts src/three/galaxy-detail/shaders/blackhole.vert.glsl src/three/galaxy-detail/shaders/blackhole.frag.glsl
git commit -m "feat: add raymarched black hole with accretion disk shader"
```

---

## Task 7: Galaxy Scene Orchestrator

**Files:**
- Create: `three/galaxy-detail/GalaxyScene.ts`

**Step 1: Create the scene orchestrator**

Owns the Three.js scene, orbit camera, and composes all visual layers:

```typescript
// three/galaxy-detail/GalaxyScene.ts

import * as THREE from 'three'
import type { Galaxy } from '@/types/galaxy'
import { galaxyToGeneratorParams } from './GalaxyParamsMapper'
import { generateGalaxy } from './GalaxyGenerator'
import { GalaxyParticles } from './GalaxyParticles'
import { GalaxyHaze } from './GalaxyHaze'
import { GalaxyNebula } from './GalaxyNebula'
import { GalaxyBlackHole } from './GalaxyBlackHole'

export class GalaxyScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private particles: GalaxyParticles
  private haze: GalaxyHaze
  private nebula: GalaxyNebula
  private blackHole: GalaxyBlackHole
  private animationId = 0
  private clock = new THREE.Clock()
  private galaxyRotation = 0

  // Camera orbit state (ported from gcanvas Camera3D drag behavior)
  private tiltX = 0.6     // initial tilt (matches gcanvas CONFIG.camera.initialTiltX)
  private rotY = 0
  private zoom = 1
  private targetZoom = 1
  private isDragging = false
  private lastX = 0
  private lastY = 0
  private velocityX = 0
  private velocityY = 0

  constructor(canvas: HTMLCanvasElement, galaxy: Galaxy) {
    // 1. Init renderer, scene, camera
    // 2. Map galaxy data → generator params
    // 3. Generate stars
    // 4. Create visual layers: particles, haze, nebula, blackHole
    // 5. Add all to scene
    // 6. Bind input events (pointer drag, wheel zoom)
    // 7. Apply position_angle as initial Y rotation if available
  }

  start(): void {
    // Animation loop: update camera orbit, particles, nebula, blackHole
  }

  dispose(): void {
    // Cancel animation, remove listeners, dispose all layers + renderer
  }
}
```

Camera controls: drag to orbit (tilt X, rotate Y), scroll/pinch to zoom. Ported from gcanvas Camera3D with inertia and friction. The orbit is around the galaxy center (camera orbits on a sphere looking at origin).

**Step 2: Commit**

```bash
git add src/three/galaxy-detail/GalaxyScene.ts
git commit -m "feat: add galaxy scene orchestrator with orbit camera"
```

---

## Task 8: Data Layer — getGalaxyByName()

**Files:**
- Modify: `composables/useGalaxyData.ts`

**Step 1: Add getGalaxyByName query**

```typescript
// Add to useGalaxyData.ts, inside the useGalaxyData() function:

function getGalaxyByName(name: string): Galaxy | null {
  if (!db) return null
  const stmt = db.prepare('SELECT * FROM galaxies WHERE name = ?')
  stmt.bind([name])
  if (stmt.step()) {
    const values = stmt.get()
    const columns = stmt.getColumnNames()
    stmt.free()
    return rowToGalaxy(columns, values as any[])
  }
  stmt.free()
  return null
}

// Add to return object:
// return { ..., getGalaxyByName }
```

**Step 2: Commit**

```bash
git add src/composables/useGalaxyData.ts
git commit -m "feat: add getGalaxyByName query to data composable"
```

---

## Task 9: Vue Components — GalaxyInfoCard + GalaxyDetail

**Files:**
- Create: `components/GalaxyInfoCard.vue`
- Create: `components/GalaxyDetail.vue`

**Step 1: Create GalaxyInfoCard.vue**

Compact semi-transparent overlay card:

```vue
<template>
  <div class="galaxy-info-card">
    <div class="info-name">{{ galaxy.name }}</div>
    <div class="info-row">
      <span class="info-label">Catalog</span> {{ galaxy.catalog }}
    </div>
    <div v-if="galaxy.morphology" class="info-row">
      <span class="info-label">Type</span> {{ galaxy.morphology }}
    </div>
    <div v-if="galaxy.redshift != null" class="info-row">
      <span class="info-label">Redshift</span> {{ galaxy.redshift.toFixed(6) }}
    </div>
    <div v-if="galaxy.velocity != null" class="info-row">
      <span class="info-label">Velocity</span> {{ galaxy.velocity.toLocaleString() }} km/s
    </div>
    <div v-if="galaxy.b_mag != null" class="info-row">
      <span class="info-label">B mag</span> {{ galaxy.b_mag.toFixed(2) }}
    </div>
    <div v-if="galaxy.r_mag != null" class="info-row">
      <span class="info-label">R mag</span> {{ galaxy.r_mag.toFixed(2) }}
    </div>
  </div>
</template>

<!-- Props: galaxy: Galaxy -->
<!-- Styling: fixed top-left, semi-transparent dark bg, pointer-events: none -->
```

**Step 2: Create GalaxyDetail.vue**

Canvas component that mounts a GalaxyScene:

```vue
<template>
  <canvas ref="canvasRef" class="fixed inset-0 w-full h-full" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Galaxy } from '@/types/galaxy'
import { GalaxyScene } from '@/three/galaxy-detail/GalaxyScene'

const props = defineProps<{ galaxy: Galaxy }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let scene: GalaxyScene | null = null

onMounted(() => {
  if (!canvasRef.value) return
  scene = new GalaxyScene(canvasRef.value, props.galaxy)
  scene.start()
})

onUnmounted(() => {
  scene?.dispose()
})
</script>
```

**Step 3: Commit**

```bash
git add src/components/GalaxyInfoCard.vue src/components/GalaxyDetail.vue
git commit -m "feat: add galaxy detail canvas and info card components"
```

---

## Task 10: GalaxyView + Router + Navigation

**Files:**
- Create: `views/GalaxyView.vue`
- Modify: `router/index.ts`
- Modify: `components/GalaxyCanvas.vue`

**Step 1: Create GalaxyView.vue**

```vue
<template>
  <div class="w-full h-full">
    <GalaxyDetail v-if="galaxy" :galaxy="galaxy" />
    <GalaxyInfoCard v-if="galaxy" :galaxy="galaxy" />
    <router-link to="/" class="back-button">
      &larr; Back
    </router-link>
    <div v-if="!galaxy && !isLoading" class="not-found">
      Galaxy not found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GalaxyDetail from '@/components/GalaxyDetail.vue'
import GalaxyInfoCard from '@/components/GalaxyInfoCard.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { Galaxy } from '@/types/galaxy'

const route = useRoute()
const { ready, isLoading, getGalaxyByName } = useGalaxyData()
const galaxy = ref<Galaxy | null>(null)

onMounted(async () => {
  await ready
  const name = decodeURIComponent(route.params.name as string)
  galaxy.value = getGalaxyByName(name)
})
</script>

<!-- Styling: back button top-left above info card, styled link -->
```

**Step 2: Add route**

```typescript
// router/index.ts — add to routes array:
{
  path: '/g/:name',
  name: 'galaxy',
  component: () => import('@/views/GalaxyView.vue'),
}
```

**Step 3: Add click-to-navigate on home page**

In `GalaxyCanvas.vue`, add a click handler alongside the existing hover system:

```typescript
// Add to GalaxyCanvas.vue:
import { useRouter } from 'vue-router'

const router = useRouter()

function onPointerClickGalaxy(e: PointerEvent) {
  // Only navigate if we didn't drag
  if (getIsDragging()) return

  // Reuse the same raycast logic from hover
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

  if (!galaxyField) return
  const camera = getCamera()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(galaxyField.points)

  if (intersects.length > 0 && intersects[0].index != null) {
    const galaxy = galaxyField.galaxies[intersects[0].index]
    router.push(`/g/${encodeURIComponent(galaxy.name)}`)
  }
}

// Register in onMounted:
// canvasRef.value.addEventListener('click', onPointerClickGalaxy)
// Clean up in onUnmounted
```

**Step 4: Commit**

```bash
git add src/views/GalaxyView.vue src/router/index.ts src/components/GalaxyCanvas.vue
git commit -m "feat: add galaxy detail route and click-to-navigate from sky view"
```

---

## Task 11: Visual Verification

**Steps:**
1. Run `npm run dev` in `src/main/site/`
2. Verify home page still works — hover shows tooltips, cursor changes
3. Click a galaxy → navigates to `/g/<name>`
4. Galaxy detail page shows:
   - Procedural galaxy visualization matching morphology type
   - Spiral arms for spirals, bar for barred, elliptical shape for E types
   - Rotating particles with differential speed
   - Nebula glow in spiral arms
   - Black hole at center with accretion disk
   - Radial haze background
   - Info card with galaxy data
5. Orbit camera: drag to tilt, scroll to zoom
6. Back button returns to home
7. Try multiple galaxy types: pick an `Sa`, `SBc`, `E3`, `S0`, `Irr` to verify the params mapper produces visually distinct galaxies

---

## Dependency Graph

```
Task 1 (ParamsMapper) ─┐
                       ├→ Task 2 (Generator) → Task 3 (Particles) ─┐
                       │                                             │
Task 4 (Haze) ─────────┤                                             ├→ Task 7 (Scene) → Task 9 (Vue) → Task 10 (Route) → Task 11 (Verify)
                       │                                             │
Task 5 (Nebula) ───────┤                                             │
                       │                                             │
Task 6 (BlackHole) ────┘                                             │
                                                                     │
Task 8 (Data Layer) ─────────────────────────────────────────────────┘
```

Tasks 1, 4, 5, 6, 8 can be parallelized. Tasks 2-3 depend on 1. Task 7 depends on 2-6. Tasks 9-10 depend on 7+8.
