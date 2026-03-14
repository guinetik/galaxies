# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive astronomy visualization platform rendering ~88k galaxies from merged astronomical catalogs (Cosmicflows-4, ALFALFA, FSS, UGC). Built with Vue 3 + Three.js + GLSL shaders, using client-side SQLite (sql.js) for data queries.

## Common Commands

All commands run from `src/main/site/`:

```bash
cd src/main/site
npm run dev          # Vite dev server (requires COOP/COEP headers for SharedArrayBuffer)
npm run build        # vue-tsc type check + vite build
npm run test         # vitest run (all tests)
npm run test:watch   # vitest watch mode
npm run test:shaders # shader compilation tests only
npm run lint:shaders # glslx shader linting
npm run deploy       # build + gh-pages deploy
```

Python ETL (from `src/main/python/`):
```bash
pip install -r requirements.txt
python build.py           # Full rebuild: cosmicflows → alfalfa → fss → combined → galaxies.db
python build.py --deploy  # Rebuild and copy galaxies.db to site/public/data/
```
See `docs/python-etl-rebuild-guide.md` for data sources, file layout, and troubleshooting.

## Architecture

### Directory Layout

```
src/main/
├── python/              # ETL pipelines (CF4 + ALFALFA + FSS/UGC → SQLite)
│   ├── build.py         # Orchestrates full rebuild (run this to regenerate galaxies.db)
│   ├── requirements.txt # astropy, numpy
│   ├── combined/main.py # 8-stage merge pipeline → galaxies.db
│   ├── alfalfa/         # ALFALFA HI catalog ETL (reads research/alfalfa/)
│   ├── cosmicflows/     # Cosmicflows-4 ETL (reads research/cosmicflows-4/)
│   ├── fss/             # FSS/UGC catalog ETL (reads research/fss/, research/ugc/)
│   └── nsa/             # NSA image enrichment (optional, reads research/nsa_v0_1_2.fits)
└── site/                # Vue 3 + Vite application (package.json lives here)
    ├── public/data/     # galaxies.db served to browser
    ├── scripts/         # lint-shaders.mjs
    └── src/
        ├── components/  # Vue components (about/, cosmography/, HUD elements)
        ├── composables/ # useThreeScene, useGalaxyData, useAppHeader
        ├── i18n/        # vue-i18n (en-US, pt-BR)
        ├── router/      # Vue Router (7 routes)
        ├── three/       # All Three.js scene code + GLSL shaders
        ├── types/       # Galaxy/GalaxyGroup interfaces
        └── views/       # 7 view components
```

### Three.js Scene Architecture (`src/three/`)

Four independent scene systems, each with its own scene class:

1. **GalaxyField** (`GalaxyField.ts`) - Main galaxy point cloud (~88k points). Custom vertex/fragment shaders handle redshift-based depth culling, parallax, LOD blending, and hit-testing. Used by HomeView.
2. **GalaxyScene** (`galaxy-detail/GalaxyScene.ts`) - Single galaxy 3D detail view. Procedurally generates 4 visual layers (particles, haze, nebula, black hole) with a 3-pass render pipeline (galaxy→RT, RT+lensing→screen, composite). `GalaxyParamsMapper` maps catalog data to visual params.
3. **CosmicMapScene** (`cosmic-map/CosmicMapScene.ts`) - 3D cosmic flow map using supergalactic coordinates (SGX/SGY/SGZ). Points colored by CMB velocity.
4. **SpacetimeScene** (`spacetime/SpacetimeScene.ts`) - Density field surface mesh with fabric/points/labels. Uses `computeDensityField` for spatial analysis.

Shared utilities: `celestialMath.ts` (RA/Dec conversions, redshift↔distance), `GalaxyTextures.ts` (512x512 procedural texture atlas), `BackgroundStars.ts`, `constants.ts`.

### Composables

- **useThreeScene** - WebGL renderer lifecycle, camera, pointer/touch/wheel interactions, drag momentum, location-based pivot rotation. Returns reactive `currentFov`, `currentMaxRedshift`, `currentMinRedshift`.
- **useGalaxyData** - Loads SQLite via sql.js WASM, exposes query methods (`getAllGalaxies`, `getGalaxyByPgc`, `getAllGroups`, etc.)
- **useAppHeader** - Singleton location state shared across views.

### GLSL Shaders (`src/three/**/shaders/`)

17 shader files across 4 directories. Key patterns:
- `galaxy.vert/frag.glsl` - Main field shaders with `#include`-style dependencies on `noise-value.glsl` and `galaxy-render.glsl`
- `particle/nebula/blackhole/lensing` pairs in `galaxy-detail/shaders/`
- `fabric.vert/frag.glsl` in `spacetime/shaders/` - density displacement mapping
- All shaders validated by `shaders.test.ts` using glslx compiler

### Data Flow

Python ETL merges 4 astronomical catalogs (55k CF4 galaxies, 31k ALFALFA, FSS, UGC) via spatial cross-matching (30 arcsec radius) into a unified SQLite database. The database ships as a static file in `public/data/galaxies.db` and is loaded client-side by sql.js WASM.

### Routes

| Path | View | Purpose |
|------|------|---------|
| `/` | HomeView | Interactive galaxy field with HUD |
| `/g/:pgc` | GalaxyView | Single galaxy 3D detail (PGC identifier) |
| `/about` | AboutView | Educational content + intuition machines |
| `/map` | CosmicMapView | 3D cosmic structure map |
| `/cosmography` | CosmographyView | Distance measurement experiments |
| `/spacetime` | SpacetimeView | Density fabric visualization |
| `/local-group` | LocalGroupView | Local group focus |

## Dual Renderer: WebGL + WebGPU

The galaxy detail view (`/g/:pgc`) has two rendering pipelines selected at runtime (`GalaxyDetail.vue`):
- **WebGPU** (`webgpu/GalaxySceneWebGPU.ts`) — used when `navigator.gpu` is available. Star generation runs on GPU via TSL compute shaders (`GalaxyComputeInit.ts`).
- **WebGL** (`GalaxyScene.ts`) — fallback. Star generation runs on CPU (`GalaxyGenerator.ts`).

**Any change to galaxy morphology, star generation, or visual appearance must be applied to BOTH pipelines.** They share the morphology module (`morphology/`) for types and presets, but star placement logic is duplicated across CPU (TypeScript) and GPU (TSL compute shaders).

## Key Conventions

- Path alias: `@/` maps to `src/main/site/src/`
- TypeScript strict mode, ES2020 target
- Galaxy identification uses PGC numbers (Principal Galaxies Catalogue)
- Distance units: Megaparsecs (Mpc) and Million light-years (Mly), conversion factor 3.2616
- Hubble constant H0 = 75 km/s/Mpc used for distance estimates
- Morphology assignment: deterministic seeded random fallback when catalog data is missing
- Shader includes are handled manually (not preprocessor) - `noise-value.glsl` → `galaxy-render.glsl` → `galaxy.frag.glsl`
