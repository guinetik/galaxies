# Star Planetarium Design

## Overview

Extend the star detail page (`/star/:id`) to generate and render a procedural planetary system around the star. Planets are generated using science-based heuristics driven by SIMBAD stellar properties (metallicity, temperature, surface gravity), then rendered with ported GLSL shaders from the exoplanets project. An info button explains the methodology to the user.

## Goals

1. Generate a plausible planetary system for any SIMBAD star using the heuristics in `docs/planets.md`
2. Render each planet as a 3D shader-driven sphere orbiting the star
3. Show orbit rings for each planet
4. Add an "i" button that explains what the user is seeing and the methodology behind it

## Data Flow

```
SimbadStar (from useSimbadStar composable)
  --> generatePlanetarySystem(star, seed) [deterministic]
  --> PlanetarySystem { host, planets[] }
  --> mapPlanetToShaderType(planet, star) [selects 1 of 10 shaders]
  --> StarScene renders: star (existing) + planets (new) + orbit rings (new)
```

## Planet Generator

Move `docs/planet-heuristics.ts` into `src/main/site/src/three/star/PlanetGenerator.ts` as production code. Key changes:

- Use the `SimbadStar` interface from `useSimbadStar.ts` (adapt field names: `mainId` not `main_id`, `spectralType` not `spectralType`, etc.)
- Add `temperature` field to `Planet` interface (equilibrium temperature, derived from semi-major axis and stellar luminosity: `Teq = Teff_star * sqrt(R_star / (2 * a))` where R_star is estimated from Teff)
- Add `orbitalPeriod` field (Kepler's third law: `P = sqrt(a^3 / M_star)` years)
- The `PlanetType` enum maps to shader selection

## Planet Shader Port

Port 10 planet fragment shaders + 1 shared vertex shader from `D:\Developer\exoplanets\public\shaders\v2\planet/`:

**Vertex shader (shared):**
- `planet.vert` --> `planet.vert.glsl`

**Fragment shaders (10 types):**
- `rocky.frag` --> `rocky.frag.glsl`
- `gasGiant.frag` --> `gasGiant.frag.glsl`
- `hotJupiter.frag` --> `hotJupiter.frag.glsl`
- `iceGiant.frag` --> `iceGiant.frag.glsl`
- `icyWorld.frag` --> `icyWorld.frag.glsl`
- `lavaWorld.frag` --> `lavaWorld.frag.glsl`
- `oceanWorld.frag` --> `oceanWorld.frag.glsl`
- `subNeptune.frag` --> `subNeptune.frag.glsl`
- `desertWorld.frag` --> `desertWorld.frag.glsl`
- `tidallyLocked.frag` --> `tidallyLocked.frag.glsl`

All go into `src/main/site/src/three/star/shaders/planet/`. Same pattern as star shaders: remove `#include` directives, prepend common GLSL libraries at runtime.

All planet fragment shaders use the same includes: `noise.glsl + color.glsl + lighting.glsl + seed.glsl` (already ported in Task 1 of the star feature).

## Shader Type Selection

Map `PlanetType` + physical properties to one of 10 shader types. Simplified from exoplanets' `getV2PlanetShaderType`:

```
GasGiant + Teq > 1000K  --> hotJupiter
GasGiant + Teq < 200K   --> iceGiant
GasGiant (else)          --> gasGiant
SubNeptune + Teq < 200K  --> iceGiant
SubNeptune (else)         --> subNeptune
Rocky + Teq > 800K       --> lavaWorld
Rocky + Teq < 200K       --> icyWorld
Rocky + 250K < Teq < 350K + low density --> oceanWorld
Rocky + 400K < Teq < 800K --> desertWorld
Rocky (else)              --> rocky
```

## Planet Uniforms

Each planet shader needs these uniforms (from exoplanets `createPlanetUniforms`):

```typescript
{
  uBaseColor: THREE.Color,        // derived from planet type
  uTime: number,                  // animation
  uTemperature: number,           // equilibrium temp (K)
  uHasAtmosphere: number,         // 0-1
  uSeed: number,                  // deterministic
  uDensity: number,               // 0-1 normalized
  uInsolation: number,            // 0-1 normalized
  uStarTemp: number,              // host star Teff
  uDetailLevel: number,           // 1.0 (detailed)
  uEnableTerminator: number,      // 0.0 (star provides lighting)
  uColorTempFactor: number,       // 0-1
  uColorCompositionFactor: number, // 0-1
  uColorIrradiationFactor: number, // 0-1
  uColorMetallicityFactor: number, // 0-1
}
```

## Planet Visual Sizing and Positioning

**Sizing:** Planet visual radius scales logarithmically to prevent gas giants from overwhelming the scene:
- Rocky (0.8-1.5 Re): visual radius 0.08-0.12
- SubNeptune (1.7-3.5 Re): visual radius 0.12-0.20
- GasGiant (8-12 Re): visual radius 0.25-0.40

**Positioning:** Semi-major axis (AU) mapped to scene units. Use logarithmic compression so inner and outer planets are all visible:
- `sceneRadius = 2.0 + log10(semiMajorAxis_AU + 0.1) * 3.0`
- This gives inner planets (0.1 AU) at ~2.0 units, outer planets (5 AU) at ~4.1 units

**Orbit rings:** Simple `RingGeometry` or `LineLoop` (circle) at each planet's scene radius, white with low opacity (0.15).

**Orbital animation:** Planets orbit at speed inversely proportional to period. No eccentricity in visual orbit (circular for simplicity).

## StarScene Changes

Add to existing `StarScene.ts`:
- Accept optional `PlanetarySystem` in constructor (or via a `setPlanets()` method called after generation)
- For each planet: create sphere mesh with planet shader, orbit ring, and position group
- Animate planets in the `update()` loop (orbital motion + shader time)
- Planet meshes rotate on their own axis slowly

## Info Button and Methodology Panel

Add an "i" button to `StarView.vue` (top-right area, same style as GalaxyView's info button). Clicking toggles a sidebar panel explaining:

- "This star's planetary system is procedurally generated based on scientific heuristics"
- Brief explanation of how metallicity drives gas giant probability
- How stellar mass/type affects planet count
- Note that this is speculative (not observed data)
- Link to the full methodology doc if we want

Content kept short (3-4 paragraphs). Styled like GalaxyView's info sidebar (dark glass, slide transition).

## StarView.vue Changes

After SIMBAD data loads:
1. Call `generatePlanetarySystem(star, seed)` to get planets
2. Pass planets to `StarScene`
3. Show planet count in info card (e.g. "Planets: 3 (generated)")
4. Add "i" button that opens methodology sidebar

## File Structure (new/modified)

```
src/main/site/src/three/star/
  PlanetGenerator.ts              # CREATE - moved from docs/, adapted
  PlanetUniforms.ts               # CREATE - shader type selection + uniform factory
  StarScene.ts                    # MODIFY - add planet rendering
  shaders/planet/
    planet.vert.glsl              # CREATE - port from exoplanets
    rocky.frag.glsl               # CREATE - port
    gasGiant.frag.glsl            # CREATE - port
    hotJupiter.frag.glsl          # CREATE - port
    iceGiant.frag.glsl            # CREATE - port
    icyWorld.frag.glsl            # CREATE - port
    lavaWorld.frag.glsl           # CREATE - port
    oceanWorld.frag.glsl          # CREATE - port
    subNeptune.frag.glsl          # CREATE - port
    desertWorld.frag.glsl         # CREATE - port
    tidallyLocked.frag.glsl       # CREATE - port

src/main/site/src/views/
  StarView.vue                    # MODIFY - planet generation, info button, methodology panel
```

## Scope Exclusions

- No planet detail view (clicking a planet does nothing for now)
- No planet labels/names in the 3D scene
- No moons
- No rings on gas giants (shader handles visual rings internally)
- No habitable zone visualization
- No planetary data in the info card beyond count
