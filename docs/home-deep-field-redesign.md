# Home Deep-Field Redesign Notes

## Intent

The home screen now prioritizes a Hubble deep-field metaphor:
- Sparse visible galaxies at any given zoom level.
- Tiny-first point appearance with restrained growth.
- Earlier foreground fade to prevent oversized visual blobs.
- Reduced background star competition and softer HUD presence.

## Implementation Summary

### Galaxy lifecycle (`src/main/site/src/three/GalaxyField.ts`)

- Replaced broad foreground-heavy visibility behavior with a narrow logarithmic depth window.
- Added decoupled lifecycle helpers:
  - `computeDepthWindowAlpha(logOffset)`
  - `computeGrowthMultiplier(logOffset)`
  - `computeForegroundFade(logOffset)`
- Retuned growth to be modest in foreground and shrinking in background.
- Updated picker size estimate math to stay aligned with new shader scaling.

### Galaxy shader profile

- `src/main/site/src/three/shaders/galaxy.vert.glsl`
  - Reduced near-scale amplification.
  - Lowered base pixel multiplier and minimum point size floor.
  - Reduced twinkle amplitude.
  - Delayed detail transition to larger projected sizes.
  - Reduced detail and far boosts to avoid compounding size inflation.

- `src/main/site/src/three/shaders/galaxy.frag.glsl`
  - Rebalanced marker core/halo alpha for less bloom.
  - Reduced white-hot glow contribution.
  - Softened selected outline intensity.

### Density mapping (`src/main/site/src/three/constants.ts`)

- Retuned `REDSHIFT_RANGES` to reveal distant populations more gradually.
- Raised `MIN_REDSHIFT_RANGES` at narrower FOV levels to reduce local foreground haze in deep views.

### Background star field (`src/main/site/src/three/BackgroundStars.ts`)

- Simple dots: small circular points with slight size variation.
- Visible opacity (0.35–0.8) so stars read clearly against the dark sky.
- Tinkle effect: per-star phase offset with ~32% brightness modulation for a living sky.
- Dense starfield (~14k stars) for deep-field atmosphere.

### HUD cleanup (`src/main/site/src/views/HomeView.vue`)

- Kept filter, tooltip, and loaded-count features.
- Made telemetry side indicators conditional on active hover/select context.
- Softened compass and count-badge visual weight.

## Tuning Guidance

If further iteration is needed, these are the highest-impact knobs:
- `computeDepthWindowAlpha` window edges for visible density.
- `computeGrowthMultiplier` max foreground multiplier for bloom control.
- `REDSHIFT_RANGES` mid-FOV values (`55`, `45`, `35`) for crowding at default view.
- Vertex shader `gl_PointSize` floor and `basePx` multiplier for overall point footprint.
- `BackgroundStars` `STAR_COUNT`, opacity range, and twinkle amplitude (vertex shader).
