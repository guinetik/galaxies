# Tully-Fisher Rotation Curve Visualization

## Reference

Inspired by the M33 rotation curve diagram (`public/tullyfisher.jpg`), which shows:
- **Observed curve**: Rises steeply, then flattens — includes dark matter halo
- **Expected from luminous disk**: Rises, peaks at ~3 kpc, then falls (Keplerian)
- **Divergence**: The gap between curves at large R is evidence for dark matter

## Generated Visualization

TullyFisherExperiment renders a procedural rotation curve:

- **Axes**: R (kpc) 0–12, v (km/s) 0–v_max (dynamic from slider)
- **Observed**: `v(R) = v_flat × (1 - exp(-R/2.5))` — smooth rise to flat
- **Expected**: Rises to peak at 3 kpc, then `v ∝ 1/√R` — luminous matter only
- **Data points**: Yellow squares on observed curve (M33-style)
- **Legend**: "observed" (solid), "expected from luminous disk" (dashed)

## Slider

Controls flat rotation velocity W (80–400 km/s). Tully-Fisher: L ∝ W^3.5. Higher W → brighter galaxy → distance estimate.

## Note

The reference image (`tullyfisher.jpg`) is shown above the experiment. The viz uses generated SVG, not the static image.
