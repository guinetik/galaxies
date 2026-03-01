# Spacetime Fabric — Design Document

**Date:** 2026-03-01
**Status:** Approved

## Concept

A new `/spacetime` page showing a wireframe grid plane representing the supergalactic XY plane. Galaxy group density warps the grid downward — clusters like Virgo, Coma, and the Great Attractor become visible gravity wells. The user orbits the fabric in 3D to explore the curvature of local spacetime. Galaxy dots sit on the warped surface, color-coded by CMB velocity using the same color scale as the Cosmic Map.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Projection | Supergalactic XY plane (SGZ ≈ 0) | Most cosmic web structure lives near this plane |
| Warp source | Galaxy density | Simple, intuitive, uses all 38K groups |
| Camera | Angled perspective + OrbitControls | Consistent with Cosmic Map, full 3D exploration |
| Visual style | Wireframe grid with glow | Classic sci-fi spacetime look, clean, performant |
| Dot coloring | Velocity bins (VELOCITY_COLOR_BINS) | Same as Cosmic Map, identifies cluster distance |
| Cluster labels | Yes, major structures labeled | Virgo, Coma, Perseus-Pisces, Great Attractor, Shapley, Centaurus, Hydra |

## Data Flow

1. Load 38,053 galaxy groups via `useGalaxyData().getAllGroups()`
2. Extend query to include `vpec` (already in DB, not yet fetched)
3. Filter to supergalactic slab: |SGZ| < 2,000 Mpc
4. Build 256×256 density grid over SGX/SGY extent (±16,000 Mpc)
5. Gaussian kernel accumulation per group → box blur smooth → normalize
6. Output: `THREE.DataTexture` for vertex displacement + density lookup

## Three.js Architecture

```
SpacetimeScene
├── SpacetimeFabric (PlaneGeometry wireframe, vertex displacement)
│   ├── Custom vertex shader: displace Y by density texture lookup
│   └── Custom fragment shader: cyan wireframe, glow = depth
├── SpacetimePoints (galaxy group dots on fabric surface)
│   └── Same density lookup for Y positioning, velocity-colored
├── SpacetimeLabels (CSS2DRenderer or sprite text)
│   └── Major cluster names at known SGX/SGY, Y = surface height
├── CosmicMapAxes (reuse — SGX/SGY labels)
└── OrbitControls (angled perspective)
```

## Fabric Mesh

- `PlaneGeometry(32000, 32000, 255, 255)` — covers ±16K Mpc, 256×256 vertex grid
- Custom `ShaderMaterial` with wireframe rendering
- **Vertex shader**: Sample density `DataTexture`, displace `position.y` downward
- **Fragment shader**: Wireframe via barycentric coordinates, glow intensity ∝ displacement depth
- Base color: dim cyan grid lines. Deep wells: bright cyan → white

## Galaxy Dots

- `Points` geometry from slab-filtered groups
- Y position = density displacement sampled at each group's SGX/SGY
- Color = `VELOCITY_COLOR_BINS` (purple → blue → cyan → green → yellow → red → brown)
- Same soft glow shader (Gaussian core + smoothstep halo)

## Cluster Labels

Known structures with approximate supergalactic XY positions:
- Virgo Cluster (~0, ~1200)
- Coma Cluster (~0, ~7000)
- Perseus-Pisces (~-5000, ~5000)
- Great Attractor (~-4500, ~1500)
- Shapley Supercluster (~-7000, ~6000)
- Centaurus Cluster (~-3500, ~3500)
- Hydra Cluster (~-3000, ~4000)

Rendered as floating labels, semi-transparent, positioned at fabric surface height.

## UI Elements

- **Back button**: Fixed top-right (same pattern as Cosmography)
- **Velocity legend**: Bottom-left, reuse `VELOCITY_COLOR_BINS` pattern from Cosmic Map
- **Info panel**: Explanation text about what the visualization represents
- **Hover tooltip**: Group PGC, velocity, distance, member count

## Route & Nav

- Route: `/spacetime` (lazy-loaded)
- Nav link in `AppHeader.vue`
- i18n strings: title, subtitle, info text (en-US, pt-BR)
- Background: black (the fabric IS the visual)
