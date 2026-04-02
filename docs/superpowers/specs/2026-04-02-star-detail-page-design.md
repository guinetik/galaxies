# Star Detail Page Design

## Overview

A new route (`/star/:id`) renders a single star in 3D using 5 GLSL shaders ported from the exoplanets project, with a procedural nebula backdrop and an info card sidebar. Stars are reached from the KnownStarsCard on the galaxy detail page -- internal links replace the current external SIMBAD links for star-type objects.

## Route & Navigation

- **Route**: `/star/:id` where `:id` is the URL-encoded SIMBAD `main_id` (e.g. `/star/*+alf+CMa`)
- **KnownStarsCard**: Star-type results link to `/star/:id` internally; non-star results keep their external SIMBAD links
- **Star page** links out to SIMBAD for the full catalog entry via an external link button

## Data Flow

```
KnownStarsCard click --> router push /star/:id
  --> StarView.vue loads
  --> useSimbadStar(id) composable queries SIMBAD TAP API:
      SELECT main_id, ra, dec, otype_txt, sp_type, plx_value,
             a.V, a.B, f.teff, f.log_g, f.fe_h
      FROM basic b
      LEFT JOIN allfluxes a ON b.oid = a.oidref
      LEFT JOIN (SELECT oidref, teff, log_g, fe_h
                 FROM mesFe_h WHERE mespos = 1) f ON b.oid = f.oidref
      WHERE main_id = :id
  --> SimbadStar data drives shader uniforms + info card
```

## SimbadStar Interface

```typescript
interface SimbadStar {
  mainId: string
  ra: number
  dec: number
  objectType: string           // e.g. "Star", "Variable Star"
  spectralType: string | null  // e.g. "G2V", "K5III"
  parallax: number | null      // milliarcseconds --> distance
  vMag: number | null          // V-band magnitude
  bMag: number | null          // B-band magnitude
  teff: number | null          // effective temperature in Kelvin
  logg: number | null          // surface gravity (log scale)
  feh: number | null           // metallicity [Fe/H]
  simbadUrl: string            // external link to SIMBAD page
}
```

## 3D Scene: StarScene.ts

Single star at center with OrbitControls and procedural nebula background. No other 3D elements.

### Ported Shader Layers (from exoplanets project)

| Layer | Geometry | Shader | Blending | Purpose |
|-------|----------|--------|----------|---------|
| Surface | Sphere (r=1, 64seg) | `surface.vert/frag` | Opaque | Boiling plasma |
| Corona | Sphere (r=1.8) | `corona.vert/frag` | Additive | Fiery outer glow |
| Flame tongues | Sphere (r=1.4) | `flameTongues.vert/frag` | Additive | Edge protrusions |
| Flares | Sphere (r=1.2) x4 | `flare.vert/frag` | Additive | Solar eruptions |
| Rays | Billboard quad (6x) | `rays.vert/frag` | Additive | Radiating light |

Additional elements:
- Billboard glow quad (inline shader, same as exoplanets CelestialBody)
- Point light at center for scene illumination

### Shared GLSL Utilities to Port

From exoplanets `public/shaders/v2/common/`:
- `noise.glsl` - 3D Simplex noise
- `seed.glsl` - Hash/seed functions for deterministic randomness
- `color.glsl` - Color utility functions

### Background

Reuse `GalaxyBackdrop` from the galaxy detail page -- procedural nebula sphere behind the star. Camera-centered, rendered at lowest order.

### Uniforms (driven by SIMBAD data)

| Uniform | Source | Fallback |
|---------|--------|----------|
| `uStarColor` | Spectral type first letter --> color map (O=blue ... M=red) | White (#ffffff) |
| `uTemperature` | `teff` from mesFe_h, or inferred from spectral type | 5778 K (Sun) |
| `uActivityLevel` | Spectral type --> activity map (M=0.95, G=0.55, A=0.25...) | 0.5 |
| `uSeed` | Deterministic hash of `main_id` | 0.5 |
| `uTime` | Animation clock (elapsed seconds) | -- |
| `uIntensity` | 1.0 (corona) | -- |
| `uStarRadius` | 0.08 (rays scaling) | -- |

### Spectral Class Color Map (ported from exoplanets)

```
O: #5b7cff  (Blue, >30,000 K)
B: #7b9fff  (Blue-white, 10,000-30,000 K)
A: #cad7ff  (White, 7,500-10,000 K)
F: #f8f7ff  (Yellow-white, 6,000-7,500 K)
G: #fff4ea  (Yellow, 5,200-6,000 K)
K: #ffd2a1  (Orange, 3,700-5,200 K)
M: #ff6644  (Red-orange, 2,400-3,700 K)
L: #cc4422  (Deep red-brown, 1,300-2,400 K)
T: #9944aa  (Magenta-purple, 500-1,400 K)
Y: #663377  (Dark purple, <500 K)
```

### Activity Level Map (ported from exoplanets)

```
M: 0.95  (Flare stars - very active)
K: 0.65
G: 0.55  (Sun-like - steady)
F: 0.35
A: 0.25  (Radiative envelope - low)
B: 0.85  (Violent stellar winds)
O: 0.90  (Extremely violent)
L: 0.20  (Brown dwarfs - calm)
T: 0.15
Y: 0.10  (Ultra-cool - minimal)
```

## Star Info Card (left sidebar)

Floating card, roughly same visual height as the rendered star. Styled like KnownStarsCard (dark glass, backdrop blur, 1px white border at 12% opacity).

### Contents

- Star name (`main_id`)
- Spectral type badge (background colored by spectral class)
- Temperature (K) -- from `teff` or inferred
- Surface gravity (log g)
- Metallicity [Fe/H]
- V magnitude
- B-V color index (computed from B and V magnitudes)
- Distance (computed from parallax: `1000 / plx_value` parsecs, converted to light-years)
- SIMBAD external link button

Null/missing values show "--" rather than hiding the row.

## File Structure

```
src/main/site/src/
  views/StarView.vue              # Page component (layout + info card)
  composables/useSimbadStar.ts    # Single-star SIMBAD TAP query
  three/star/
    StarScene.ts                  # Scene class (star meshes + backdrop + controls)
    StarUniforms.ts               # Uniform factory, spectral color/activity maps, seed gen
    shaders/
      surface.vert.glsl           # Ported from exoplanets
      surface.frag.glsl
      corona.vert.glsl
      corona.frag.glsl
      rays.vert.glsl
      rays.frag.glsl
      flameTongues.vert.glsl
      flameTongues.frag.glsl
      flare.vert.glsl
      flare.frag.glsl
      noise.glsl                  # Shared noise (from exoplanets common/)
      seed.glsl                   # Hash functions (from exoplanets common/)
      color.glsl                  # Color utilities (from exoplanets common/)
  router/index.ts                 # + /star/:id route
```

## Integration Points

### KnownStarsCard Changes

- Star-type objects (`isStarLike()` returns true): render as `<router-link :to="'/star/' + encodeURIComponent(obj.name)">`
- Non-star objects: keep current external `<a :href="obj.simbadUrl">` behavior

### Router Addition

```typescript
{
  path: '/star/:id',
  name: 'star',
  component: () => import('@/views/StarView.vue'),
  meta: { title: 'Star', description: 'Star detail view' }
}
```

## Scope Exclusions

- No star catalog/listing page (just the detail view for now)
- No planets in the scene (star only)
- No binary system support
- No thumbnail generation
- No starfield point cloud
- No WebGPU pipeline (WebGL only)
