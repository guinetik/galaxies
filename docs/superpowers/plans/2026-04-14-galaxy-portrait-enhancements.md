# Galaxy Portrait Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dust particle layer with per-star extinction, add population-aware blackbody coloring, and implement a fake orbit lifecycle to prevent spiral arm winding — inspired by codetard's universe-toolkit galaxy generator.

**Architecture:** Three independent enhancements to the WebGPU compute init and update shaders, plus their CPU fallback equivalents. All changes stay within the existing SpriteNodeMaterial + Points rendering pipeline (compute splatting is deferred). The dust layer is eliminated — all 500k particles become real stars, and dust manifests purely as wavelength-dependent extinction modifying star colors.

**Tech Stack:** Three.js TSL compute shaders (WebGPU), TypeScript CPU fallback, Vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/main/site/src/three/galaxy-detail/webgpu/tsl-helpers.ts` | Modify | Add `kelvinToRgb()` and `fbmNoise2d()` TSL functions |
| `src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeInit.ts` | Modify | Remove dust layer, add population-aware blackbody colors, add per-star dust extinction |
| `src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeUpdate.ts` | Modify | Replace continuous rotation with fake orbit lifecycle |
| `src/main/site/src/three/galaxy-detail/webgpu/GalaxySceneWebGPU.ts` | Modify | Add new uniforms (dustStrength, orbitCycle params), pass them through |
| `src/main/site/src/three/galaxy-detail/morphology/GalaxyMorphology.ts` | Modify | Add `dustStrength` and `dustArmBoost` to `GalaxyMorphology` interface and presets |
| `src/main/site/src/three/galaxy-detail/GalaxyGenerator.ts` | Modify | CPU fallback: remove dust layer, add blackbody colors, add extinction |
| `src/main/site/src/three/galaxy-detail/GalaxyGenerator.test.ts` | Modify | Update tests for new layer system, add extinction + color tests |

---

### Task 1: Add TSL helper functions (kelvinToRgb, fbmNoise2d)

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/webgpu/tsl-helpers.ts:182-202`

These new helpers are needed by the compute init shader for blackbody coloring and dust noise.

- [ ] **Step 1: Add kelvinToRgb TSL function**

Add after the existing `hslToRgb` function at line 202 in `tsl-helpers.ts`:

```typescript
/**
 * Tanner Helland blackbody approximation: color temperature (K) → linear RGB.
 * Valid range: 1000K–40000K. Returns vec3 in [0,1] linear space.
 */
export const kelvinToRgb = Fn(([tempK]: [any]) => {
  const n = clamp(tempK, float(1000), float(40000)).div(100)

  // Red channel
  const rHot = pow(n.sub(60), float(-0.1332)).mul(329.6987).div(255)
  const r = clamp(
    mix(float(1.0), rHot, float(1).sub(float(66).div(max(n, float(1))))),
    float(0), float(1),
  )

  // Green channel
  const gCool = n.log().mul(99.4708).sub(161.1196).div(255)
  const gHot = pow(n.sub(60), float(-0.0755)).mul(288.1222).div(255)
  const g = clamp(
    mix(gCool, gHot, float(1).sub(float(66).div(max(n, float(1))))),
    float(0), float(1),
  )

  // Blue channel
  const bCool = max(n.sub(10), float(1)).log().mul(138.5177).sub(305.0448).div(255)
  const bLow = mix(float(0), bCool, smoothstep(float(19), float(20), n))
  const b = clamp(
    mix(bLow, float(1.0), float(1).sub(float(66).div(max(n, float(1))))),
    float(0), float(1),
  )

  // sRGB → linear
  const toLinear = (c: any) =>
    mix(c.div(12.92), pow(c.add(0.055).div(1.055), float(2.4)), smoothstep(float(0.04045), float(0.04046), c))

  return vec3(toLinear(r), toLinear(g), toLinear(b))
})
```

- [ ] **Step 2: Add fbmNoise2d TSL function**

Add after `kelvinToRgb` in the same file. This provides 2-octave fractal noise for dust clumpiness:

```typescript
/**
 * 2-octave FBM noise for dust lane clumpiness.
 * Returns ~[0, 1] range.
 */
export const fbmNoise2d = Fn(([p]: [any]) => {
  const value = noise2d(p).mul(0.5).add(0.5).toVar()
  value.addAssign(noise2d(p.mul(2.0)).mul(0.25).add(0.125))
  return clamp(value, float(0), float(1))
})
```

- [ ] **Step 3: Update imports in tsl-helpers.ts**

Add `clamp` and `smoothstep` to the import from `three/tsl` (line 8-24):

```typescript
import {
  vec2,
  vec3,
  float,
  Fn,
  length,
  normalize,
  sin,
  cos,
  fract,
  max,
  min,
  pow,
  dot,
  floor,
  mix,
  clamp,
  smoothstep,
  log,
} from 'three/tsl'
```

- [ ] **Step 4: Run type check**

Run: `cd src/main/site && npx vue-tsc --noEmit`
Expected: No errors in tsl-helpers.ts (TSL is `@ts-nocheck` in compute files, but helpers have types)

- [ ] **Step 5: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/webgpu/tsl-helpers.ts
git commit -m "feat(galaxy-detail): add kelvinToRgb and fbmNoise2d TSL helpers"
```

---

### Task 2: Add dustStrength and dustArmBoost to morphology system

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/morphology/GalaxyMorphology.ts`

- [ ] **Step 1: Add fields to GalaxyMorphology interface**

Add two new fields to the `GalaxyMorphology` interface after `fieldStarFraction` (line 86):

```typescript
  // ── Dust extinction ───────────────────────────────────────────────────────
  /** Overall dust extinction strength [0, 10]. 0 = no dust. */
  dustStrength: number
  /** Extra extinction boost along spiral arms [0, 10]. */
  dustArmBoost: number
```

- [ ] **Step 2: Update BASE defaults**

Add the new fields to the `BASE` object (around line 139):

```typescript
const BASE: Omit<GalaxyMorphology, 'preset'> = {
  numArms: 0,
  armWidth: 0,
  spiralTightness: 0,
  spiralStart: 0,
  bulgeRadius: 0,
  bulgeFraction: 0,
  diskThickness: 0,
  barLength: 0,
  barWidth: 0,
  ellipticity: 0,
  axisRatio: 1,
  irregularity: 0,
  clumpCount: 0,
  fieldStarFraction: 0,
  dustStrength: 0,
  dustArmBoost: 0,
}
```

- [ ] **Step 3: Set dust values per preset**

Update each preset that should have dust. Ellipticals and irregulars get 0 (no structured dust). Spirals and barred spirals get moderate values. Lenticulars get minimal.

In the `MORPHOLOGY_PRESETS` object, add to each preset:

**elliptical** — no change (inherits 0 from BASE)

**lenticular** — add:
```typescript
  dustStrength: 0.5,
  dustArmBoost: 0,
```

**spiralSa** — add:
```typescript
  dustStrength: 3.0,
  dustArmBoost: 3.0,
```

**spiral** (SAb) — add:
```typescript
  dustStrength: 4.0,
  dustArmBoost: 4.0,
```

**grandDesign** (SAc) — add:
```typescript
  dustStrength: 4.5,
  dustArmBoost: 5.0,
```

**flocculent** (SAd) — add:
```typescript
  dustStrength: 3.5,
  dustArmBoost: 2.5,
```

**barredTight** (SBa) — add:
```typescript
  dustStrength: 3.0,
  dustArmBoost: 3.5,
```

**barred** (SBb) — add:
```typescript
  dustStrength: 4.0,
  dustArmBoost: 4.0,
```

**barredOpen** (SBc) — add:
```typescript
  dustStrength: 4.0,
  dustArmBoost: 4.5,
```

**irregular** — no change (inherits 0 from BASE)

- [ ] **Step 4: Run existing morphology tests**

Run: `cd src/main/site && npx vitest run src/three/galaxy-detail/morphology`
Expected: All existing morphology tests pass (new fields have defaults, existing assertions unaffected)

- [ ] **Step 5: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/morphology/GalaxyMorphology.ts
git commit -m "feat(morphology): add dustStrength and dustArmBoost to presets"
```

---

### Task 3: Eliminate dust layer and add population-aware blackbody colors (WebGPU compute)

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeInit.ts`

This is the biggest change. We replace the 3-layer system (dust/star/bright) with a 2-layer system (star/bright), switch from HSL to blackbody temperature coloring, and add population-aware distributions that vary by role (arm/bulge/field/halo).

- [ ] **Step 1: Add new uniforms for dust extinction**

Add to the `GalaxyUniforms` interface (after `mouseRadius` at line 98):

```typescript
  // Dust extinction
  dustStrength: any
  dustArmBoost: any
  // Fake orbit lifecycle
  orbitCycleDuration: any
  orbitFadeIn: any
  orbitFadeOut: any
```

- [ ] **Step 2: Initialize new uniforms in createGalaxyUniforms**

Add to the uniforms object in `createGalaxyUniforms()` (around line 157):

```typescript
    dustStrength: uniform(0),
    dustArmBoost: uniform(0),
    orbitCycleDuration: uniform(60.0),
    orbitFadeIn: uniform(0.08),
    orbitFadeOut: uniform(0.08),
```

- [ ] **Step 3: Sync new uniforms in syncGalaxyUniforms**

Add after line 204 (`projectedStrength`):

```typescript
  uniforms.dustStrength.value = m.dustStrength
  uniforms.dustArmBoost.value = m.dustArmBoost
```

- [ ] **Step 4: Update imports**

At the top of GalaxyComputeInit.ts, add the new TSL helpers to the import (line 37):

```typescript
import { hash, hslToRgb, kelvinToRgb, fbmNoise2d, noise2d } from './tsl-helpers'
```

Also add `log` and `abs` to the three/tsl import at the top if not already present.

- [ ] **Step 5: Replace layer assignment (remove dust layer)**

Replace lines 262-282 (the dustFraction, brightFraction, and layer assignment block) with:

```typescript
    // ─── Layer assignment: star ~94%, bright ~6% (no dust layer) ──────
    const brightFraction = mix(
      float(0.04),
      float(0.08),
      clamp(uniforms.bandHotMix.mul(0.7).add(uniforms.bandClumpBoost.mul(0.3)), float(0), float(1)),
    )

    const layerRoll = hash(seed.add(100))
    // 0=star, 1=bright (layer 0 is no longer dust)
    const layerVal = float(0).toVar()
    If(layerRoll.greaterThan(float(1).sub(brightFraction)), () => {
      layerVal.assign(1) // bright
    })
    buffers.layerBuffer.element(idx).assign(layerVal)
```

- [ ] **Step 6: Replace layer-dependent size**

Replace lines 284-294 (size block) with:

```typescript
    // ─── Layer-dependent size ──────────────────────────────────────────
    const sizeRand = hash(seed.add(200))
    const starSize = float(0).toVar()
    If(layerVal.equal(0), () => {
      starSize.assign(sizeRand.mul(3.0).add(1.5)) // star: 1.5-4.5
    }).Else(() => {
      starSize.assign(sizeRand.mul(6.0).add(4.0).mul(mix(float(0.9), float(1.4), uniforms.bandHotMix))) // bright: 4-10
    })
    buffers.sizeBuffer.element(idx).assign(starSize)
```

- [ ] **Step 7: Replace layer-dependent brightness/alpha**

Replace lines 296-310 (brightness/alpha block) with:

```typescript
    // ─── Layer-dependent brightness/alpha ──────────────────────────────
    const brightRand = hash(seed.add(300))
    const alphaRand = hash(seed.add(400))
    const brightness = float(0).toVar()
    const alpha = float(0).toVar()
    If(layerVal.equal(0), () => {
      brightness.assign(brightRand.mul(0.4).add(0.32).mul(mix(float(0.95), float(1.15), uniforms.bandHotMix)))
      alpha.assign(alphaRand.mul(0.4).add(0.4))
    }).Else(() => {
      brightness.assign(brightRand.mul(0.16).add(0.64).mul(mix(float(0.95), float(1.25), uniforms.bandHotMix)))
      alpha.assign(alphaRand.mul(0.24).add(0.56).mul(mix(float(0.95), float(1.2), uniforms.bandClumpBoost)))
    })
```

- [ ] **Step 8: Replace the color section with population-aware blackbody**

Replace lines 592-663 (the entire color section from "Color: realistic spectral class system" through the `hslToRgb` call) with:

```typescript
    // ─── Color: population-aware blackbody temperatures ─────────────────
    // Stellar population distributions vary by location:
    //   Arm stars:  more young blue OBA (16%), fewer M dwarfs (56%)
    //   Off-arm:    mostly M/K dwarfs (78%), few hot stars (3%)
    //   Bulge:      old population, many red giants (19%)
    //   Elliptical: old population, metal-rich red giants (14.5%)
    //
    // Each star rolls a population type → temperature range → kelvinToRgb.

    const tempRand = hash(seed.add(900))
    const typeRand = hash(seed.add(901))
    const temperature = float(5500).toVar() // default Sun-like

    // Population distribution: [M/K dwarf, F/G main-seq, OBA hot, Red giant]
    // Interpolated by arm score for spiral galaxies
    const pMK = float(0.72).toVar()
    const pFG = float(0.20).toVar()
    const pOBA = float(0.065).toVar()
    // Red giant = remainder

    // Determine arm membership score for color population
    // spiralRole: 0=bulge, 1=field, 2=arm, -1=not spiral
    If(spiralRole.equal(2), () => {
      // Arm star: bluer population
      pMK.assign(0.56)
      pFG.assign(0.24)
      pOBA.assign(0.16)
    }).ElseIf(spiralRole.equal(1), () => {
      // Field star: redder population
      pMK.assign(0.78)
      pFG.assign(0.17)
      pOBA.assign(0.03)
    }).ElseIf(spiralRole.equal(0), () => {
      // Bulge star: old population, lots of red giants
      pMK.assign(0.68)
      pFG.assign(0.12)
      pOBA.assign(0.01)
    })

    // Elliptical override
    If(uniforms.ellipticity.greaterThan(0), () => {
      pMK.assign(0.74)
      pFG.assign(0.11)
      pOBA.assign(0.005)
    })

    // Assign temperature based on population type
    const cumMK = pMK
    const cumFG = pMK.add(pFG)
    const cumOBA = cumFG.add(pOBA)

    If(typeRand.lessThan(cumMK), () => {
      // M/K dwarf: 2600-6000K (biased cool)
      temperature.assign(float(2600).add(pow(tempRand, float(0.64)).mul(3400)))
    }).ElseIf(typeRand.lessThan(cumFG), () => {
      // F/G star: 5200-8400K
      temperature.assign(float(5200).add(tempRand.mul(3200)))
    }).ElseIf(typeRand.lessThan(cumOBA), () => {
      // O/B/A hot star: 8500-16000K
      temperature.assign(float(8500).add(tempRand.mul(7500)))
    }).Else(() => {
      // Red giant: 2900-4700K
      temperature.assign(float(2900).add(tempRand.mul(1800)))
    })

    // Bright layer: bias toward extremes (luminous giants or hot OB)
    If(layerVal.equal(1), () => {
      If(typeRand.lessThan(float(0.6)), () => {
        // Red giant: 2900-4700K
        temperature.assign(float(2900).add(tempRand.mul(1800)))
      }).Else(() => {
        // Hot OB: 10000-25000K
        temperature.assign(float(10000).add(tempRand.mul(15000)))
      })
    })

    const baseRgb = kelvinToRgb(temperature)
    const rgb = baseRgb.mul(brightness)
```

- [ ] **Step 9: Add dust extinction after color computation**

Insert right after the `rgb` line, before writing to the color buffer:

```typescript
    // ─── Dust extinction: wavelength-dependent absorption ──────────────
    // Dust concentrated in thin disk, boosted along spiral arms.
    // Blue light absorbed ~1.85x more than red → orange/brown dust lanes.
    const extinctedRgb = rgb.toVar()

    If(uniforms.dustStrength.greaterThan(0), () => {
      const absY = abs(posY)
      const radialR = sqrt(posX.mul(posX).add(posZ.mul(posZ)))
      const radialScale = R.mul(0.34)
      const verticalScale = R.mul(0.06).mul(0.18) // very thin dust disk

      // Base extinction: radial × vertical profile
      const radialExt = float(0).sub(radialR.div(max(radialScale, float(0.01)))).exp()
      const verticalExt = float(0).sub(absY.div(max(verticalScale, float(0.01)))).exp()
      const baseExt = radialExt.mul(verticalExt)

      // Suppress extinction inside bulge core
      const bulgeSuppress = smoothstep(
        uniforms.bulgeRadius.mul(0.4),
        uniforms.bulgeRadius.mul(1.2),
        radialR,
      )

      // Spiral arm dust boost (only for spirals)
      const armDust = float(0).toVar()
      If(uniforms.numArms.greaterThan(0).and(uniforms.dustArmBoost.greaterThan(0)), () => {
        const starAngle = atan(posZ, posX)
        const armSigma = uniforms.armWidth.div(R).mul(0.5) // half arm width
        const spiralStartR = max(uniforms.spiralStart.mul(R), float(0.001))

        // Check proximity to each arm (up to 6 arms)
        const bestArmScore = float(0).toVar()
        // Unrolled loop for arm count (TSL doesn't support dynamic loops easily)
        // Check arms 0-5, skip if armIdx >= numArms
        const checkArm = (armIdx: number) => {
          If(uniforms.numArms.greaterThan(armIdx), () => {
            const armPhase = float(armIdx).mul(TAU).div(uniforms.numArms)
            const expectedAngle = max(radialR.div(spiralStartR), float(1.0)).log()
              .div(max(uniforms.spiralTightness, float(0.001)))
              .mul(2.5)
              .add(armPhase)
            const angDist = starAngle.sub(expectedAngle).toVar()
            // Normalize to [-PI, PI]
            angDist.assign(angDist.sub(floor(angDist.div(TAU).add(0.5)).mul(TAU)))
            const armScore = float(0).sub(angDist.mul(angDist).div(armSigma.mul(armSigma).mul(2))).exp()
            bestArmScore.assign(max(bestArmScore, armScore))
          })
        }
        checkArm(0)
        checkArm(1)
        checkArm(2)
        checkArm(3)
        checkArm(4)
        checkArm(5)

        armDust.assign(bestArmScore.mul(uniforms.dustArmBoost))
      })

      // FBM noise for clumpiness
      const noiseScale = float(8).div(max(R, float(1)))
      const dustNoise = fbmNoise2d(vec2(posX.mul(noiseScale), posZ.mul(noiseScale)))

      // Total extinction
      const extinction = uniforms.dustStrength
        .mul(baseExt)
        .mul(bulgeSuppress)
        .mul(float(1).add(armDust))
        .mul(dustNoise)

      // Wavelength-dependent absorption (red least, blue most)
      extinctedRgb.x.assign(rgb.x.mul(float(0).sub(extinction.mul(0.65)).exp()))
      extinctedRgb.y.assign(rgb.y.mul(float(0).sub(extinction.mul(0.9)).exp()))
      extinctedRgb.z.assign(rgb.z.mul(float(0).sub(extinction.mul(1.2)).exp()))
    })

    buffers.colorBuffer.element(idx).assign(vec4(extinctedRgb.x, extinctedRgb.y, extinctedRgb.z, alpha))
```

- [ ] **Step 10: Remove the old hslToRgb color buffer write**

Delete the old line (was line 663):
```typescript
    // DELETE THIS LINE:
    // buffers.colorBuffer.element(idx).assign(vec4(rgb.x, rgb.y, rgb.z, alpha))
```

This is now handled by the extinction block in step 9.

- [ ] **Step 11: Run dev server and verify visually**

Run: `cd src/main/site && npm run dev`
Open a spiral galaxy (e.g., `/g/2557` or any PGC). Verify:
- No purple/blue dust particles visible (all particles are now stars)
- Spiral arms appear slightly bluer than inter-arm regions
- Brown/orange dust lanes visible along spiral arms (if dustStrength > 0)
- Elliptical galaxies have warm, uniform coloring (no dust)
- Bulge region shows redder/warmer tones

- [ ] **Step 12: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeInit.ts
git commit -m "feat(galaxy-detail): population-aware blackbody colors + dust extinction in WebGPU compute"
```

---

### Task 4: Implement fake orbit lifecycle (WebGPU compute update)

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeUpdate.ts`
- Modify: `src/main/site/src/three/galaxy-detail/webgpu/GalaxySceneWebGPU.ts`

Replace continuous differential rotation with a per-star lifecycle: fade in → orbit → fade out → reset to original position. This prevents spiral arm winding over time.

- [ ] **Step 1: Rewrite GalaxyComputeUpdate.ts**

Replace the entire `createComputeUpdate` function body with:

```typescript
import {
  instanceIndex,
  float,
  Fn,
  If,
  length,
  sin,
  cos,
  fract,
  clamp,
  max,
  min,
  smoothstep,
  vec3,
  vec4,
} from 'three/tsl'
import type { GalaxyBuffers, GalaxyUniforms } from './GalaxyComputeInit'
import { hash, applyDifferentialRotation, rotateXZ } from './tsl-helpers'

export function createComputeUpdate(
  count: number,
  buffers: GalaxyBuffers,
  uniforms: GalaxyUniforms,
) {
  const computeUpdate = Fn(() => {
    const idx = instanceIndex
    const position = buffers.positionBuffer.element(idx).toVar()
    const originalPos = buffers.originalPositionBuffer.element(idx).toVar()
    const layer = buffers.layerBuffer.element(idx)
    const color = buffers.colorBuffer.element(idx)

    // ─── Fake orbit lifecycle ──────────────────────────────────────────
    // Each star gets a random phase offset. During its lifecycle:
    // - Fade in (first fadeIn fraction)
    // - Orbit with differential rotation from original position
    // - Fade out (last fadeOut fraction)
    // - Reset to original position
    // ~84% of stars visible at any time. Arms never wind.
    const cycleDuration = uniforms.orbitCycleDuration
    const fadeInFrac = uniforms.orbitFadeIn
    const fadeOutFrac = uniforms.orbitFadeOut

    // Per-star random phase offset [0, 1)
    const starPhaseOffset = hash(idx.toFloat().mul(0.7531).add(42.0))

    // Current lifecycle phase [0, 1)
    const phase = fract(uniforms.time.div(max(cycleDuration, float(0.1))).add(starPhaseOffset))

    // Fade envelope
    const fadeIn = smoothstep(float(0), fadeInFrac, phase)
    const fadeOut = float(1).sub(smoothstep(float(1).sub(fadeOutFrac), float(1), phase))
    const fadeAlpha = min(fadeIn, fadeOut)

    // ─── Rotation from original position ──────────────────────────────
    // Instead of accumulating rotation on current position (which causes winding),
    // compute rotation FROM the original position based on cycle elapsed time.
    const cycleElapsed = phase.mul(cycleDuration)

    If(uniforms.barLength.greaterThan(0), () => {
      const distFromCenter = length(vec3(originalPos.x, float(0), originalPos.z))
      const rigidAngle = uniforms.rotationSpeed.mul(cycleElapsed).negate()

      If(distFromCenter.lessThan(uniforms.barLength), () => {
        position.assign(rotateXZ(originalPos, rigidAngle))
      }).Else(() => {
        position.assign(applyDifferentialRotation(
          originalPos, uniforms.rotationSpeed, cycleElapsed,
        ))
      })
    }).Else(() => {
      position.assign(applyDifferentialRotation(
        originalPos, uniforms.rotationSpeed, cycleElapsed,
      ))
    })

    buffers.positionBuffer.element(idx).assign(position)

    // ─── Apply fade to alpha channel ──────────────────────────────────
    // Modulate stored alpha by fade envelope
    // Read base alpha from w component (set during init), scale by fade
    const baseAlpha = color.w
    buffers.colorBuffer.element(idx).w.assign(baseAlpha.mul(fadeAlpha))

    // ─── Twinkle for bright layer (layer == 1, was 2) ─────────────────
    If(layer.equal(1), () => {
      const twinklePhase = idx.toFloat().mul(0.7831)
      const twinkle = sin(uniforms.time.mul(2).add(twinklePhase)).mul(0.15).add(0.85)
      buffers.colorBuffer.element(idx).w.assign(baseAlpha.mul(fadeAlpha).mul(twinkle))
    })
  })().compute(count)

  return computeUpdate
}
```

- [ ] **Step 2: Store base alpha separately to avoid compounding**

The fade alpha multiplied each frame would compound and shrink toward 0. To fix this, we need to store the base alpha from init and read it back each frame. The simplest approach: use the velocity buffer (currently unused) to store base alpha.

In `GalaxyComputeInit.ts`, at the very end (just before line 667 `buffers.velocityBuffer.element(idx).assign(vec3(0, 0, 0))`), replace with:

```typescript
    // Store base alpha in velocity buffer x-channel (velocity not used for physics)
    buffers.velocityBuffer.element(idx).assign(vec3(alpha, 0, 0))
```

Then in `GalaxyComputeUpdate.ts`, read the base alpha from velocity buffer instead of color:

Replace:
```typescript
    const baseAlpha = color.w
```
With:
```typescript
    const baseAlpha = buffers.velocityBuffer.element(idx).x
```

- [ ] **Step 3: Update GalaxySceneWebGPU rotation logic**

In `GalaxySceneWebGPU.ts`, the animate method (around line 396-409) sets `rotationSpeed` and `deltaTime` per frame. The fake orbit system uses `time / cycleDuration` instead of accumulated delta, so we just need to make sure `time` keeps incrementing (it already does).

The rotation speed calculation stays the same (lines 400-403) — it's still used by the compute update for per-star differential rotation within each cycle.

No changes needed to the animate loop logic — the uniforms are already being set correctly.

- [ ] **Step 4: Verify the animation**

Run: `cd src/main/site && npm run dev`
Open a spiral galaxy. Verify:
- Stars fade in and out smoothly (~84% visible at any time)
- Spiral arms maintain their structure (don't wind up) even after minutes
- Zooming in speeds up apparent rotation (zoom-based rotation speed still works)
- Elliptical galaxies don't rotate (rotationSpeed = 0, so orbit is static)
- Bar region maintains rigid structure during rotation

- [ ] **Step 5: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeUpdate.ts
git add src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeInit.ts
git commit -m "feat(galaxy-detail): fake orbit lifecycle prevents spiral arm winding"
```

---

### Task 5: Update CPU fallback (GalaxyGenerator.ts)

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/GalaxyGenerator.ts`
- Modify: `src/main/site/src/three/galaxy-detail/GalaxyGenerator.test.ts`

The CPU path must mirror the WebGPU changes so both renderers produce consistent output.

- [ ] **Step 1: Add kelvinToRgb CPU helper**

Add after the `clamp` function (around line 100):

```typescript
/**
 * Tanner Helland blackbody approximation: temperature (K) → linear RGB [0,1].
 */
function kelvinToRgb(tempK: number): { r: number; g: number; b: number } {
  const n = Math.min(Math.max(tempK, 1000), 40000) / 100
  let r: number, g: number, b: number

  if (n <= 66) {
    r = 1.0
    g = Math.min(1, Math.max(0, (Math.log(n) * 99.4708 - 161.1196) / 255))
    b = n <= 19
      ? 0
      : Math.min(1, Math.max(0, (Math.log(n - 10) * 138.5177 - 305.0448) / 255))
  } else {
    const t = n - 60
    r = Math.min(1, Math.max(0, Math.pow(t, -0.1332) * 329.6987 / 255))
    g = Math.min(1, Math.max(0, Math.pow(t, -0.0755) * 288.1222 / 255))
    b = 1.0
  }

  // sRGB → linear
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  return { r: toLinear(r), g: toLinear(g), b: toLinear(b) }
}
```

- [ ] **Step 2: Add population distribution constants**

Add after `kelvinToRgb`:

```typescript
/** Stellar population distributions: [M/K, F/G, OBA, RedGiant] */
const POP_ARM    = [0.56, 0.24, 0.16, 0.04]
const POP_FIELD  = [0.78, 0.17, 0.03, 0.02]
const POP_BULGE  = [0.68, 0.12, 0.01, 0.19]
const POP_ELLIPTICAL = [0.74, 0.11, 0.005, 0.145]
const POP_DEFAULT = [0.72, 0.20, 0.065, 0.015]
```

- [ ] **Step 3: Add pickTemperature function**

Add after the population constants:

```typescript
/**
 * Selects a blackbody temperature based on population distribution.
 * Returns temperature in Kelvin.
 */
function pickTemperature(population: number[]): number {
  const [pMK, pFG, pOBA] = population
  const roll = Math.random()

  if (roll < pMK) {
    // M/K dwarf: 2600-6000K (biased cool)
    return 2600 + Math.pow(Math.random(), 0.64) * 3400
  } else if (roll < pMK + pFG) {
    // F/G star: 5200-8400K
    return 5200 + Math.random() * 3200
  } else if (roll < pMK + pFG + pOBA) {
    // OBA hot: 8500-16000K
    return 8500 + Math.random() * 7500
  } else {
    // Red giant: 2900-4700K
    return 2900 + Math.random() * 1800
  }
}
```

- [ ] **Step 4: Add dust extinction function**

```typescript
/**
 * Computes wavelength-dependent dust extinction for a star position.
 * Returns RGB multipliers in [0, 1].
 */
function computeDustExtinction(
  x: number, y: number, z: number,
  params: GalaxyRenderParams,
  influence: BandInfluenceConfig | null,
): { r: number; g: number; b: number } {
  const m = params.morphology
  if (m.dustStrength <= 0) return { r: 1, g: 1, b: 1 }

  const R = params.galaxyRadius
  const radialR = Math.sqrt(x * x + z * z)
  const radialScale = R * 0.34
  const verticalScale = R * 0.06 * 0.18

  // Base extinction profile
  const radialExt = Math.exp(-radialR / Math.max(radialScale, 0.01))
  const verticalExt = Math.exp(-Math.abs(y) / Math.max(verticalScale, 0.01))
  const baseExt = radialExt * verticalExt

  // Bulge suppression
  const bulgeR = m.bulgeRadius * R
  const bulgeSuppress = smoothstepCPU(bulgeR * 0.4, bulgeR * 1.2, radialR)

  // Arm dust boost
  let armDust = 0
  if (m.numArms > 0 && m.dustArmBoost > 0) {
    const starAngle = Math.atan2(z, x)
    const armSigma = m.armWidth * 0.5
    const spiralStartR = Math.max(m.spiralStart * R, 0.001)

    for (let i = 0; i < m.numArms; i++) {
      const armPhase = (i * TAU) / m.numArms
      const expectedAngle = Math.log(Math.max(radialR / spiralStartR, 1)) /
        Math.max(m.spiralTightness, 0.001) * 2.5 + armPhase
      let angDist = starAngle - expectedAngle
      angDist = angDist - Math.round(angDist / TAU) * TAU
      const score = Math.exp(-(angDist * angDist) / (2 * armSigma * armSigma))
      armDust = Math.max(armDust, score)
    }
    armDust *= m.dustArmBoost
  }

  // Simple 2D noise approximation for CPU (deterministic from position)
  const nx = Math.sin(x * 0.1 + z * 0.13) * 0.5 + 0.5
  const nz = Math.sin(z * 0.11 - x * 0.09 + 3.7) * 0.5 + 0.5
  const noise = (nx + nz) * 0.5

  const extinction = m.dustStrength * baseExt * bulgeSuppress * (1 + armDust) * noise

  return {
    r: Math.exp(-extinction * 0.65),
    g: Math.exp(-extinction * 0.9),
    b: Math.exp(-extinction * 1.2),
  }
}

function smoothstepCPU(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}
```

- [ ] **Step 5: Update assignLayer to remove dust**

Replace the `assignLayer` function:

```typescript
function assignLayer(roll: number, influence: BandInfluenceConfig | null = null): Layer {
  const hotMix = clamp01((influence?.hotMix ?? 0.5) * 0.7)
  const brightF = mix(0.04, 0.08, hotMix)

  if (roll > 1 - brightF) return 'bright'
  return 'star'
}
```

- [ ] **Step 6: Update layerProperties to remove dust case**

Replace the `layerProperties` function:

```typescript
function layerProperties(
  layer: Layer,
  influence: BandInfluenceConfig | null = null,
): LayerProps {
  switch (layer) {
    case 'bright':
      const hotBoost = mix(0.9, 1.4, influence?.hotMix ?? 0.5)
      return {
        size: (4 + Math.random() * 6) * hotBoost,
        brightness: (0.64 + Math.random() * 0.16) * hotBoost,
        alpha: (0.56 + Math.random() * 0.24) * mix(0.95, 1.2, influence?.clumpBoost ?? 0),
      }
    default: // 'star'
      return {
        size: 1.5 + Math.random() * 3.0,
        brightness: 0.32 + Math.random() * 0.4,
        alpha: 0.4 + Math.random() * 0.4,
      }
  }
}
```

- [ ] **Step 7: Update pickHueAndSat to use blackbody + population**

Replace the entire `pickHueAndSat` function with a new `pickColor` function that returns RGB:

```typescript
/**
 * Selects a star color using population-aware blackbody temperatures.
 * Returns hue and sat for compatibility with existing Star interface.
 *
 * @param role - 'arm' | 'field' | 'bulge' | 'elliptical' | 'default'
 */
function pickColor(
  layer: Layer,
  role: 'arm' | 'field' | 'bulge' | 'elliptical' | 'default',
): { hue: number; sat: number; brightness: number } {
  let temp: number

  if (layer === 'bright') {
    // Bright layer: 60% red giants, 40% hot OB
    temp = Math.random() < 0.6
      ? 2900 + Math.random() * 1800  // Red giant
      : 10000 + Math.random() * 15000 // Hot OB
  } else {
    const pop =
      role === 'arm' ? POP_ARM :
      role === 'field' ? POP_FIELD :
      role === 'bulge' ? POP_BULGE :
      role === 'elliptical' ? POP_ELLIPTICAL :
      POP_DEFAULT
    temp = pickTemperature(pop)
  }

  // Convert to hue/sat for Star interface compatibility
  // Map temperature to approximate hue: hot=blue (225°), cool=red (10°)
  const tNorm = clamp01((temp - 2600) / (16000 - 2600))
  let hue: number, sat: number
  if (temp < 4000) {
    hue = 10 + (temp - 2600) / 1400 * 15 // 10-25°
    sat = 0.85
  } else if (temp < 6000) {
    hue = 25 + (temp - 4000) / 2000 * 23 // 25-48°
    sat = 0.4
  } else if (temp < 8500) {
    hue = 48 + (temp - 6000) / 2500 * 7 // 48-55°
    sat = 0.15
  } else {
    hue = 200 + (temp - 8500) / 7500 * 25 // 200-225°
    sat = 0.3
  }

  return { hue, sat, brightness: 1.0 }
}
```

- [ ] **Step 8: Update all generate* functions to use pickColor with role**

In each star generator function, replace calls to `pickHueAndSat(layer, distFactor, influence)` with the appropriate `pickColor(layer, role)` call:

- `generateArmStars`: use `pickColor(layer, 'arm')`
- `generateBarStars`: use `pickColor(layer, 'arm')` (bar stars are arm-adjacent)
- `generateBulgeStars`: use `pickColor(layer, 'bulge')`
- `generateFieldStar`: use `pickColor(layer, 'field')`
- `generateEllipticalStars`: use `pickColor(layer, 'elliptical')`
- `generateLenticularStars`: use `pickColor(layer, 'default')`
- `generateClumpStars`: use `pickColor(layer, 'arm')` (clumps are star-forming)

Also apply dust extinction to each star's final color. In `generateGalaxy`, after all stars are generated and before returning, apply:

```typescript
// Apply dust extinction to all stars
for (const star of stars) {
  const x = Math.cos(star.angle) * star.radius
  const z = Math.sin(star.angle) * star.radius
  const ext = computeDustExtinction(x, star.y, z, params, influence)
  // Modulate brightness by average extinction
  star.brightness *= (ext.r + ext.g + ext.b) / 3
  // Shift hue toward red if heavily extincted
  if (ext.b < 0.5) {
    star.hue = star.hue * 0.5 + 15 * 0.5 // shift toward orange-red
    star.sat = Math.min(star.sat + 0.2, 1.0)
  }
}
```

- [ ] **Step 9: Update tests**

In `GalaxyGenerator.test.ts`, update tests to expect no dust layer stars:

```typescript
describe('layer assignment (no dust)', () => {
  it('assigns only star and bright layers', () => {
    const params = {
      morphology: MORPHOLOGY_PRESETS.spiral,
      galaxyRadius: 350,
      starCount: 1000,
      diameterKpc: 25,
      sizeSource: 'random' as const,
    }
    const stars = generateGalaxy(params)
    const layers = new Set(stars.map(s => s.layer))
    expect(layers.has('dust')).toBe(false)
    expect(layers.has('star')).toBe(true)
    expect(layers.has('bright')).toBe(true)
  })
})
```

- [ ] **Step 10: Run tests**

Run: `cd src/main/site && npx vitest run src/three/galaxy-detail/GalaxyGenerator.test.ts`
Expected: All tests pass

- [ ] **Step 11: Commit**

```bash
git add src/main/site/src/three/galaxy-detail/GalaxyGenerator.ts
git add src/main/site/src/three/galaxy-detail/GalaxyGenerator.test.ts
git commit -m "feat(galaxy-detail): CPU fallback matches WebGPU — blackbody colors, extinction, no dust layer"
```

---

### Task 6: Update GalaxyClouds and twinkle layer references

**Files:**
- Modify: `src/main/site/src/three/galaxy-detail/webgpu/GalaxySceneWebGPU.ts`
- Check: `src/main/site/src/three/galaxy-detail/webgpu/GalaxyClouds.ts`
- Check: `src/main/site/src/three/galaxy-detail/webgpu/GalaxyComputeForeground.ts`

With the dust layer gone, any code that references `layer == 2` for bright stars now needs to use `layer == 1`.

- [ ] **Step 1: Check GalaxyClouds for layer references**

Read `GalaxyClouds.ts` and verify it doesn't reference layer values. The cloud system is separate from particle layers, so it likely doesn't need changes. If it does reference layer 0 (dust), update accordingly.

- [ ] **Step 2: Check GalaxyComputeForeground for layer references**

Read `GalaxyComputeForeground.ts`. The foreground detection shader reads position buffers but likely doesn't filter by layer. Verify and update if needed.

- [ ] **Step 3: Verify layer values are consistent everywhere**

Search the codebase for `layerVal.equal(2)` or `layer.equal(2)` or `== 2` in galaxy-detail files. The new mapping is:
- `0` = star (was dust)
- `1` = bright (was star at 1, bright was 2)

All references to layer == 2 must become layer == 1.

- [ ] **Step 4: Commit if any changes needed**

```bash
git add -u src/main/site/src/three/galaxy-detail/
git commit -m "fix(galaxy-detail): update layer value references for 2-layer system"
```

---

### Task 7: Visual tuning and integration test

**Files:**
- No new files — this is a visual QA pass

- [ ] **Step 1: Test spiral galaxies**

Open `/g/2557` (a spiral). Verify:
- Dense star field with no purple dust particles
- Visible brown/orange dust lanes along spiral arms
- Arms appear bluer than inter-arm regions
- Bulge region has warm/red tones
- Stars fade in/out smoothly, arms don't wind

- [ ] **Step 2: Test barred spirals**

Open a barred spiral (e.g., `/g/2787`). Verify:
- Bar maintains rigid structure during rotation
- Dust lanes visible along arms
- Bar region doesn't show excessive extinction

- [ ] **Step 3: Test elliptical galaxies**

Open an elliptical galaxy. Verify:
- No dust extinction (warm, uniform coloring)
- No rotation
- Mostly warm/red stars with a few blue-white

- [ ] **Step 4: Test lenticular galaxies**

Open a lenticular. Verify:
- Minimal dust (dustStrength = 0.5)
- Smooth oblate shape maintained
- No arm structure

- [ ] **Step 5: Test irregular galaxies**

Open an irregular galaxy. Verify:
- No dust extinction
- Clumpy structure preserved
- No rotation

- [ ] **Step 6: Run full test suite**

Run: `cd src/main/site && npm run test`
Expected: All tests pass

- [ ] **Step 7: Run type check and build**

Run: `cd src/main/site && npm run build`
Expected: Build succeeds

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat(galaxy-detail): galaxy portrait enhancements — blackbody colors, dust extinction, fake orbits"
```
