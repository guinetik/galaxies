# Cosmography Detection Experiments

## Design Rationale

The CosmographyView presents eight galaxy distance methods (Cepheids, TRGB, Masers, SBF, SNII, Tully-Fisher, Fundamental Plane, SNIa). To make the science more accessible and interactive, we added method-specific experiments inspired by the exoplanets project's RadialVelocitySection and TransitSection patterns.

Each experiment:
- Uses **visual schematics** (Earth, telescope, light path, galaxy) so non-astronomers understand how observations work
- Uses **accessible copy** — plain language ("we see a star that brightens and dims") instead of jargon ("period-luminosity relation")
- Spans **full width** below the method description and CTA for more space
- Uses sliders or controls to vary parameters
- Shows real-time data display (magnitudes, distances, etc.)
- Reuses the cosmography glassmorphism theme (cyan/amber accents)

## Component Map

```
CosmographyView.vue
└── MethodExperiment.vue (per method card)
    ├── CepheidExperiment.vue   (ceph)
    ├── SBFExperiment.vue       (sbf)
    ├── TullyFisherExperiment.vue (tf)
    └── SNIaExperiment.vue      (snia)
```

Methods without dedicated experiments (trgb, mas, snii, fp) do not show the "Explore" section.

## Method-to-Experiment Mapping

| Method | Experiment | Key Interaction |
|--------|------------|-----------------|
| ceph | CepheidExperiment | Earth→galaxy schematic, period slider, pulsing Cepheid, distance |
| sbf | SBFExperiment | Distance slider → procedurally generated star field + SBF grain |
| tf | TullyFisherExperiment | Rotation curve (v vs R): observed vs expected from luminous disk; slider → flat velocity, luminosity, distance |
| snia | SNIaExperiment | Stretch slider → light curve (observed vs reference), Phillips correction, peak magnitude, distance |
| trgb | — | (future) |
| mas | — | (future) |
| snii | — | (future) |
| fp | — | (future) |

## i18n Keys

### Experiment UI
- `pages.cosmography.experimentTitle` — "Explore: How it works"
- `pages.cosmography.experiments.{method}.intro` — Short intro text
- `pages.cosmography.experiments.{method}.chartTitle` — Chart/viz title
- `pages.cosmography.experiments.{method}.*` — Method-specific labels

### ExplainableTerm (PropertyExplanationDialog)
- `propertyExplanations.cosmography.{termKey}.title`
- `propertyExplanations.cosmography.{termKey}.description`
- `propertyExplanations.cosmography.{termKey}.example` (optional)
- `propertyExplanations.cosmography.{termKey}.technicalNote` (optional)
- `propertyExplanations.cosmography.{termKey}.funFact` (optional)

Current terms: `periodLuminosity`, `standardCandle`, `distanceModulus`

## Future Methods

### TRGB
- Color-magnitude diagram with red giant branch
- Sharp cutoff at helium flash
- Slider for simulated stellar population

### Masers
- Orbital geometry diagram
- VLBI baseline visualization
- Geometric distance (no luminosity assumption)

### SNII
- Expanding photosphere
- Velocity vs radius
- Geometric distance indicator

### Fundamental Plane
- 3D parameter space (size, surface brightness, velocity dispersion)
- Elliptical galaxy relation
- Distance from plane fit

## Dependencies

- **Vue 3** (Composition API)
- **vue-i18n** for translations
- **D3** (optional, for future experiments)
- **SVG** — schematics and charts use Vue computed properties and SVG paths

## Assets

- `public/sbf.png` — Reference SBF diagram (TelescopeLens observation for sbf). SBFExperiment uses procedurally generated graphics.
- `public/tullyfisher.jpg` — M33 rotation curve (TelescopeLens for tf). TullyFisherExperiment uses generated rotation curve.
- `public/supernovaIa.webp` — Type Ia light curves (TelescopeLens for snia). SNIaExperiment uses generated light curve with stretch correction.

## File Locations

- `src/main/site/src/components/ExplainableTerm.vue`
- `src/main/site/src/components/PropertyExplanationDialog.vue`
- `src/main/site/src/components/cosmography/MethodExperiment.vue`
- `src/main/site/src/components/cosmography/experiments/*.vue`
