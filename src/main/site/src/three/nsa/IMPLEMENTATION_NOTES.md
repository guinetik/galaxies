# NSA 3D Volumetric Shells - Implementation Notes

## Overview

Phase 1 of the volumetric shells system replaces pixelated point clouds with smooth, layered mesh structures that better communicate 3D density gradients.

## Key Components

### DensityMeshGenerator

**Purpose:** Convert 2D density image into 3D layered mesh geometries

**Algorithm:**
1. Quantize brightness into N layers (default 15)
2. For each layer:
   - Calculate normalized brightness level (0-1)
   - Set tolerance: 255 / layerCount / 2 (pixel range to match)
   - Scan image for pixels matching brightness ± tolerance
   - Convert pixel coords to world coords [-1, 1]
   - Map brightness to z-depth (brightness → depth)
   - Create BufferGeometry with matched vertices
3. Return LayerMesh array with geometry + opacity per layer

**Key Parameters:**
- `layerCount`: Number of density shells (10-20 recommended)
- `zDepthScale`: Max depth range (1.0-2.0 recommended)
- `opacityCurve`: Function mapping brightness [0,1] → opacity [0,1] (default: sqrt for smooth falloff)

### NSACompositeScene Integration

**Where meshes are created:** `createDensityMeshes()` method

**When:** During scene initialization (load() method)

**Materials:** MeshPhongMaterial with:
- White base color (0xffffff)
- Opacity from layer brightness
- Additive blending (THREE.AdditiveBlending)
- depthWrite=false (allows layer compositing)

**Visibility:** Toggled in `applyCurrentShaderMode()` when nsa3d mode is selected

### Shader Pipeline

**nsa3d.vert.glsl:** Pass-through shader
- Input: position attribute from BufferGeometry
- Output: gl_Position (MVP transform)
- Also passes vPosition to fragment for depth-based effects

**nsa3d.frag.glsl:** Simple surface rendering
- Input: vPosition (depth from layer positioning)
- Calculation: brightness = 1.0 - (abs(z) * 0.5), clamped [0.2, 1.0]
- Output: white color with depth-based brightness modulation

## Design Decisions

### Why 15 Layers?

From empirical tuning:
- Each layer targets a brightness range of ~17 bytes (255 ÷ 15)
- Tolerance of ~8.5 bytes means ~25-30% pixel overlap between adjacent layers
- Result: smooth transitions without visible banding
- Performance: 15 render passes acceptable on modern hardware

### Why Additive Blending?

Physics-inspired choice:
- Each layer's brightness = intensity of light from that density level
- Additive blending = summing light contributions = optical depth accumulation
- Bright core (high opacity) → dominant light source
- Dim halo (low opacity) → small light contribution
- Result: Perceived volumetric depth without explicit ray marching

### Why z-depth Mapping?

Perceptual ordering:
- Bright regions (galaxy core) positioned closer to camera (z=0)
- Dim regions (halo) positioned farther from camera (z=-zDepthScale)
- Viewer's brain interprets: close & bright = dense, far & dim = sparse
- Combined with shader brightness modulation = strong depth cues

## Known Limitations

1. **Monochrome rendering:** Current shaders output white (phase 2 adds color)
2. **No lighting:** Using simple depth-based dimming (phase 3 adds lighting)
3. **Point cloud geometry:** Each layer is a point set, not a connected mesh surface (phase 3 improvement)
4. **Fixed layer count:** Parameter tuning required per galaxy morphology (future: adaptive layer count)
5. **No real-time adjustment:** Q/alpha sliders don't affect mesh rendering (future: could update opacity per layer)

## Testing Strategy

### Unit Tests
- `DensityMeshGenerator.test.ts`: 10 tests covering layer generation, ordering, bounds validation

### Build Validation
- TypeScript compilation
- Shader compilation (glslx, 28 tests)
- Vite build verification

### Manual Testing (Browser)
- Visual verification: no pixelation, smooth gradients, clear depth
- Parameter tuning: adjust layerCount/zDepthScale if issues arise
- Cross-galaxy testing: verify structure works for various morphologies

## Common Issues & Fixes

**Issue:** Meshes look pixelated
- **Cause:** Layer tolerance too large, gaps between matched pixels
- **Fix:** Increase `zDepthScale` (1.0 → 1.5) to spread layers more; OR reduce image resolution in upstream ETL

**Issue:** No clear depth perception
- **Cause:** zDepthScale too small, layers too close together
- **Fix:** Increase `zDepthScale` (1.0 → 2.0) for stronger depth separation

**Issue:** Meshes invisible or too dark
- **Cause:** Brightness clamping too aggressive
- **Fix:** Adjust shader clamping range in nsa3d.frag.glsl (0.2 → 0.1 for darker galaxies)

**Issue:** Banding visible (distinct layer boundaries)
- **Cause:** Too few layers or opacity curve too linear
- **Fix:** Increase `layerCount` (15 → 20) OR adjust `opacityCurve` exponent (0.5 → 0.3 for gentler falloff)

## Future Work

### Phase 2: Color Integration
- Pass all 6 bands (u, g, r, i, z, NUV) to DensityMeshGenerator
- Implement Lupton asinh stretch per layer
- Map RGB colors based on band ratios
- Expected visual: colorful 3D galaxy like the 2D composites

### Phase 3: Advanced Rendering
- Compute proper mesh surfaces (not point clouds)
- Add vertex normals for Phong/PBR lighting
- Implement MeshStandardMaterial for photorealism
- Add volumetric effects (fog, glow, dust lanes)

### Performance Optimization
- Profile on mobile/low-end GPUs
- Implement LOD (level-of-detail) for high-performance scenarios
- Consider compute shaders for layer generation (GPU-side quantization)

## References

- Three.js Documentation: https://threejs.org/docs/
- Lupton et al. Asinh Stretch: (referenced in lupton.frag.glsl)
- NSACompositeScene Implementation: NSACompositeScene.ts
- Architecture Overview: ARCHITECTURE.md
