# NSACompositeScene Architecture

## Overview

NSACompositeScene is an interactive multi-mode renderer for NSA (Sloan Digital Sky Survey) galaxy composites. It supports six shader modes:
- **Flat image-plane modes**: `lupton`, `custom`, `volumetric` (2D image-plane shaders)
- **3D point-cloud modes**: `nsa3d`, `nsamorphology` (orbit-interactive 3D)

The scene manages texture loading, material creation, camera interaction, and animation.

## Current Flow: How It Loads and Renders

### 1. Scene Initialization (Constructor)
```typescript
new NSACompositeScene(canvas)
```
- Creates WebGL renderer with alpha blending disabled
- Initializes two cameras: orthographic (for 2D) and perspective (for 3D)
- Creates empty Three.js Scene

### 2. Asset Loading (`load()`)
Called with PGC number and NSAMetadata:

1. **Texture Loading**: Loads 3–6 WebP band images (u, g, r, i, z, nuv)
   - Source: `{GALAXY_IMG_BASE_URL}/{pgc}/{band}.webp`
   - Each texture: linear mipmapping, clamp-to-edge wrapping
   - Stored in `bandData` map with associated data ranges

2. **Material Creation**:
   - `planeMaterial` (ShaderMaterial) — used by flat image-plane modes
   - `pointMaterial` (ShaderMaterial) — used by `nsa3d` point cloud
   - `morphMaterial` (ShaderMaterial) — used by `nsamorphology` point cloud

3. **Geometry Setup**:
   - Flat plane: 2×2 PlaneGeometry for image-plane modes
   - Point cloud: Built from textures via `buildNsaPointCloud()` → BufferGeometry with attributes
   - Morph cloud: Built from textures via `buildMorphologyPointCloud()` → BufferGeometry with attributes

4. **Auto-calibration**: Computes Q, alpha, sensitivity based on metadata and mode

5. **Animation Start**: Kicks off requestAnimationFrame loop with THREE.Clock

### 3. Point Cloud Geometry Creation (`createPointCloudObject()`)
1. Extract grayscale pixel data from loaded textures (u, g, r, i, z, nuv bands)
2. Call `buildNsaPointCloud()` which:
   - Samples pixels on a grid (sampleStep)
   - Filters by intensity threshold
   - Derives depth from deterministic noise + spectral tilt
   - Maps 6 spectral bands → RGB color
   - Outputs array of `NsaPointCloudPoint` objects
3. Populate Float32Array attributes from points:
   - `position` / `aPosition` (xyz)
   - `color` (rgb, 0–1)
   - `aSize` (size scalar)
   - `aIntensity` (intensity 0–1)
4. Compute bounding sphere, set camera near/far based on point cloud extent

### 4. Animation Loop (`startAnimation()`)
Runs via requestAnimationFrame:
- Update `uTime` uniform from elapsed clock time
- For 2D modes: smooth pan/zoom with momentum (lerp-based camera pan + friction)
- For 3D modes: smooth orbit camera update (lerp yaw/pitch/radius)
- Call `render()` to draw frame

### 5. Render Call (`render()`)
Simple: `renderer.render(scene, activeCamera)`

### 6. Mode Switching (`applyCurrentShaderMode()`)
- 2D modes use orthographic camera + plane mesh
- 3D modes use perspective camera + point cloud (orbit interaction)
- Updates visibility, camera, and shader programs
- Triggers shader recompilation if mode changed

---

## Key Attributes

All attributes are populated in BufferGeometry and read by vertex shaders:

| Attribute | Type | Range | Purpose |
|-----------|------|-------|---------|
| `position` | vec3 | [-0.5, 0.5] × [-0.5, 0.5] × [-depth_scale, +depth_scale] | World position of each point |
| `aPosition` | vec3 | Same as position | Duplicate for shader access (used in drift calculation) |
| `color` | vec3 | [0, 1] × [0, 1] × [0, 1] | Spectral color from 6-band mapping |
| `aSize` | float | [1.5, 8.5] | Base size scalar (scaled by uniforms in vertex shader) |
| `aIntensity` | float | [0, 1] | Brightness/visibility scalar (affects drift, alpha, halo) |
| `aFilamentarity` | float | [0, 1] | **Morphology mode only**: structure tensor filamentarity (depth cue) |

---

## Key Uniforms

All uniforms are used by shaders and updated by NSACompositeScene.

### Common to All Modes
| Uniform | Type | Default | Purpose |
|---------|------|---------|---------|
| `uAlpha` | float | 0.014–1.0 | Intensity multiplier; controls contrast/visibility |
| `uQ` | float | 10–20 | Stretch parameter (asinh stretch knee position) |
| `uSensitivity` | float | 0.5–1.0 | Brightness boost (mix 0.6–1.5) |
| `uTime` | float | elapsed time | Animation parameter (drift, flicker) |
| `uTheme` | float | 0.0 / 1.0 | Theme selector (infra=0, astral=1) |
| `uGrayscale` | float | 0.0 / 1.0 | Grayscale toggle (mix color with luminance) |

### Image-Plane Only (planeMaterial)
| Uniform | Type | Purpose |
|---------|------|---------|
| `uBandR/G/B` | sampler2D | RGB band textures for 3-band composite |
| `uRangeR/G/B` | vec2 | [min, max] data range per band |
| `uBand_u/g/r/i/z/nuv` | sampler2D | All 6 band textures (for theme switching) |
| `uRange_u/g/r/i/z/nuv` | vec2 | Data ranges for all 6 bands |
| `uResolution` | vec2 | Canvas resolution in pixels × DPR |

### Point Cloud Only (pointMaterial, morphMaterial)
| Uniform | Type | Purpose |
|---------|------|---------|
| `uPixelRatio` | float | Device pixel ratio (point size scaling) |

---

## Shaders

### Vertex Shader: `nsa3d.vert.glsl`

**Purpose**: Compute per-vertex position, size, color, and depth.

**Logic**:
1. **Drift Animation**: Sinusoidal displacement based on `uTime` + position
   - Drift amount scaled by `aIntensity`
   - Direction: normalized vector from (x, y) toward camera
2. **Model-View Transform**: Apply standard MVP transform
3. **Depth Calculation**: Extract depth from view-space z
4. **Size Computation**:
   - Base: `aSize * (0.8 + uAlpha * 1.4)`
   - Boost: `contrastBoost = 0.6 + log2(1.0 + uQ) * 0.25`
   - Sensitivity: `sensitivityBoost = mix(0.6, 1.5, uSensitivity)`
   - Final: `aSize * boost * contrast * sensitivity * dpr / depth`
   - Minimum: 1.5 pixels
5. **Varyings Passed**: `vColor`, `vIntensity`, `vDepth`

**Key Parameters**:
- `uTime`: animates drift
- `uAlpha`: affects size and intensity
- `uQ`: affects size via contrastBoost
- `uSensitivity`: affects size via sensitivityBoost
- `uPixelRatio`: scales final point size for HiDPI displays

---

### Fragment Shader: `nsa3d.frag.glsl`

**Purpose**: Shade each point with a soft circular disc + halo, apply intensity stretch and theme coloring.

**Logic**:
1. **Disc Masking**: Discard fragments outside point circle (r > 0.5)
2. **Intensity Stretch**: Apply `safe_asinh()` stretch to `vIntensity`
   - Boosted first: `pow(vIntensity, 0.45) * (0.5 + uAlpha * 0.5)`
   - Stretched: `asinh(boosted * (1 + uQ * 0.15)) / (1 + uQ * 0.15)`
   - Clamped minimum: 0.08 (ensure faint points are visible)
3. **Disc & Halo**:
   - `disc = 1.0 - smoothstep(0.18, 0.5, r)` — soft inner edge
   - `halo = exp(-r * r * 10.0)` — gaussian falloff
4. **Coloring**:
   - **Infra theme**: warm amber (1.15, 0.85, 0.60) blended with data color
   - **Astral theme**: 3-stop gradient (deep blue → purple → blue-white) based on stretched intensity
5. **Depth Fade**: Dim distant points with `1 / (1 + vDepth * 0.12)`
6. **Final Alpha**: `(halo * 0.85 + disc * 0.5) * stretch * sensitivity * depthFade * 2.5`
7. **Grayscale**: If `uGrayscale = 1`, mix to luminance

**Key Parameters**:
- `uAlpha`: affects intensity boost
- `uQ`: affects stretch formula
- `uSensitivity`: affects brightness
- `uTheme`: blends infra ↔ astral
- `uGrayscale`: toggles color→grayscale

---

## Point Cloud Generation Pipeline

The 3D volumetric effect is created by `buildNsaPointCloud()` (in nsa3dPointCloud.ts):

1. **Sampling**: Grid sample at `sampleStep` (computed from image dimensions)
2. **Multi-Band Extraction**: Load u, g, r, i, z, nuv and apply sqrt stretch
3. **Intensity Calculation**: Weighted mix
   - dust = (i + z) * 0.5
   - stellar = (g + r) * 0.5
   - hot = (u + nuv) * 0.5
   - intensity = dust * 0.25 + stellar * 0.4 + hot * 0.35
4. **Depth Assignment** (heuristic): Mostly deterministic noise + gentle spectral tilt
   - `noise1 = hash3(col, row, seed)`
   - `noise2 = hash3(col + 137, row + 251, seed)`
   - `thickness = noise1 * 0.7 + noise2 * 0.3`
   - `heatContrast = hot - dust`
   - **depth = (thickness + heatContrast * 0.25) * depthScale**
   - Result: cloud has volume (noise-driven) + subtle spectral tilt
5. **Color Mapping**: `deriveSpectralColor6()` maps 6 bands → RGB
   - Each band has a display color (violet → red → infrared)
   - Weighted by local band strength
   - Produces color variation across galaxy structure

---

## Interaction Modes

### Image-Plane (Lupton, Custom, Volumetric)
- **Camera**: Orthographic, positioned at z=10
- **Interactions**: Pan (drag), zoom (wheel + cursor point preservation), fling (momentum)
- **State**: targetX/Y (pan), targetZoom, velX/velY (momentum)
- **Lerp**: Smooth 0.15-second convergence

### Orbit (3D, Morphology)
- **Camera**: Perspective, orbits around origin
- **Interactions**: Drag to rotate (yaw/pitch), wheel to dolly (zoom in/out)
- **State**: targetOrbitYaw/Pitch/Radius
- **Lerp**: Smooth 0.12-second convergence
- **Bounds**: Radius clamped to [minOrbitRadius, maxOrbitRadius] based on point cloud extent

---

## Theme System

Three spectral themes update both image-plane and 3D modes:

| Theme | 2D Bands | 3D Effect |
|-------|----------|-----------|
| **Grayscale** | i, r, g (mapped to gray) | Desaturated point colors |
| **Infra** | i, r, g (natural colors) | Warm amber/gold tint |
| **Astral** | u/g, g, i (UV-heavy) | Cool blue-purple gradient (intensity-dependent) |

All themes share the same underlying data; only the presentation changes.

---

## Performance Considerations

1. **Texture Loading**: Uses async TextureLoader + Promise.all (parallel load)
2. **Mipmapping**: Enabled for linear interpolation at zoom
3. **Sampling**: Point cloud sampled on grid (sampleStep) to reduce point count
4. **Additive Blending**: Point clouds use additive blending (no depth-write) for speed
5. **GPU Memory**: 3–6 textures (up to 4K²) + BufferGeometry with ~1000–5000 points typical
6. **CPU Overhead**: Pixel extraction to Float32Array done once at load; GPU handles animation

---

## Next Step: Volumetric Mesh Replacement

The current system creates a heuristic point cloud from pixels. **Task 2 onwards** will:
1. Generate a smooth 3D mesh surface from the point cloud density field
2. Replace Points geometry with Mesh geometry
3. Update shaders to render mesh surface with proper normals
4. Preserve the spectral coloring and theme system
5. Add camera-tracking normal maps for silhouette contrast

This will transition from "pixelated volumetric effect" to "smooth organic surface."

---

## File Dependencies

```
NSACompositeScene.ts
├─ nsa3dPointCloud.ts (buildNsaPointCloud, getDefaultNsaPointCloudOptions, applyNsaOrbitDrag)
├─ nsaMorphologyPointCloud.ts (buildMorphologyPointCloud, getDefaultMorphologyOptions)
├─ shaders/
│  ├─ lupton.vert/frag.glsl
│  ├─ custom.vert/frag.glsl
│  ├─ volumetric.vert/frag.glsl
│  ├─ nsa3d.vert/frag.glsl
│  ├─ nsamorphology.vert/frag.glsl
│  └─ ... (also volume/mesh shaders for future use)
└─ ../constants.ts (GALAXY_IMG_BASE_URL)
```
