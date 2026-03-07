# Shared Galaxy Morphology Model

**Date:** 2026-03-07
**Status:** Approved

## Goal

Unify galaxy morphology handling across WebGL and WebGPU rendering pipelines with a shared, renderer-agnostic math module. Support all 10 Hubble-sequence presets (matching the GCanvas demo vocabulary) so that catalog Hubble type strings like "SAd" or "SBc" produce visually correct galaxies.

## Morphology Presets

10 presets across 5 base types:

| Preset Key | Label | Base Type |
|---|---|---|
| `elliptical` | Elliptical (E) | elliptical |
| `lenticular` | Lenticular (S0) | lenticular |
| `spiralSa` | Tight Spiral (SAa) | spiral |
| `spiral` | Spiral (SAb) | spiral |
| `grandDesign` | Grand Design (SAc) | spiral |
| `flocculent` | Flocculent (SAd) | spiral |
| `barredTight` | Barred Tight (SBa) | barred |
| `barred` | Barred Spiral (SBb) | barred |
| `barredOpen` | Barred Open (SBc) | barred |
| `irregular` | Irregular (Irr) | irregular |

## Architecture

### Shared Math Module

**Location:** `src/main/site/src/three/galaxy-detail/morphology/`

Pure TypeScript. Stateless. No rendering dependencies. Three files:

1. **`GalaxyMorphology.ts`** — Flat parameter struct and 10 preset constant tables.
2. **`morphologyMapper.ts`** — Maps catalog data (Hubble string, PGC, observed properties) to `GalaxyMorphology` params. Includes size estimation and seeded PRNG fallback.
3. **`morphologyParser.ts`** — Parses Hubble type strings into structured classification (extracted from current `parseMorphology`).

### Flat Parameter Struct

Instead of a discriminated union (current 5-type `GeneratorParams`), a single flat struct with all numeric fields. Presets are named constant sets. Renderers read numbers directly — no switch on type.

```ts
export interface GalaxyMorphology {
  preset: MorphologyPreset     // one of the 10 keys

  // Structure
  numArms: number              // 0 for E/S0/Irr
  armWidth: number             // fraction of galaxyRadius
  spiralTightness: number      // pitch angle parameter
  spiralStart: number          // fraction of galaxyRadius

  // Bulge
  bulgeRadius: number          // fraction of galaxyRadius
  bulgeFraction: number        // fraction of stars in bulge

  // Bar
  barLength: number            // fraction of galaxyRadius (0 = no bar)
  barWidth: number             // fraction of galaxyRadius

  // Shape
  ellipticity: number          // 0-1
  axisRatio: number            // 0-1
  diskThickness: number        // fraction of galaxyRadius

  // Disorder
  irregularity: number         // 0-1
  clumpCount: number           // for irregulars

  // Stellar population
  fieldStarFraction: number    // fraction of non-structured stars
}
```

All spatial params as fractions of `galaxyRadius` so they scale naturally.

### Hubble String → Preset Mapping

```
Catalog string → morphologyParser → structured classification
                                   → morphologyMapper → preset selection
                                                       → catalog overrides
                                                       → GalaxyMorphology
```

| Parsed Type | Hubble Stage | Preset |
|---|---|---|
| elliptical | — | `elliptical` |
| lenticular | — | `lenticular` |
| spiral | 1-2 (a, ab) | `spiralSa` |
| spiral | 3-4 (b, bc) | `spiral` |
| spiral | 5-6 (c, cd) | `grandDesign` |
| spiral | 7-9 (d, dm, m) | `flocculent` |
| barred | 1-2 | `barredTight` |
| barred | 3-4 | `barred` |
| barred | 5-9 | `barredOpen` |
| irregular | — | `irregular` |

Catalog overrides (observed axis ratio, mass-derived size, bar strength) nudge preset defaults. Seeded PRNG adds per-galaxy variation within a preset.

### Render Params

A separate struct adds renderer-specific fields on top of morphology:

```ts
export interface GalaxyRenderParams {
  morphology: GalaxyMorphology
  starCount: number
  galaxyRadius: number        // absolute rendering units
  diameterKpc: number
  sizeSource: SizeSource
}
```

### Renderer Changes

**WebGL CPU (`GalaxyGenerator.ts`):**
- Consumes `GalaxyRenderParams` instead of `GeneratorParams`
- No type-switch — reads flat params: `barLength > 0` → bar stars, `numArms > 0` → arm stars, etc.
- Generation functions merge into fewer, parameter-driven code paths

**WebGPU GPU (`GalaxyComputeInit.ts`):**
- Keeps generation on GPU (compute shader)
- Reads the same uniform values from `GalaxyMorphology`
- `morphType` integer uniform goes away — shader uses numeric params directly
- Simpler branching: check `barLength > 0` instead of `morphType == 1`

Both produce similar-looking results but don't need to be pixel-identical. The GPU can use different sampling strategies for performance.

### Changes to `types/galaxy.ts`

- `MorphologyClass` (6 broad types) → replaced by `MorphologyPreset` (10 keys) in new module
- `assignMorphology()` → moves into morphology mapper
- `estimateGalaxySize()` → moves into morphology mapper
- `Galaxy`, `GalaxyGroup`, `velocityToColor()` → stay unchanged

### Changes to `constants.ts`

- `MORPHOLOGY_COLORS` → keyed by 10 presets instead of 5 classes

### What Stays the Same

- `IGalaxyScene` interface
- `GalaxyScene.ts` / `GalaxySceneWebGPU.ts` orchestrators (call new mapper instead of old)
- All GLSL shader files, post-processing, visual layers
- `GalaxyComputeUpdate.ts` (per-frame animation stays on GPU)

## Non-Goals

- No shared package with GCanvas — this is standalone, inspired by the same presets
- No pixel-identical output between WebGL and WebGPU
- No GPU compute for initial star generation in WebGL pipeline
