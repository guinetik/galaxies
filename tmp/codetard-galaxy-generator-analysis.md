# Codetard Galaxy Generator — Technical Reference

Source: https://universe-toolkit.vibe-coded.com/galaxy-generator
Analyzed: 2026-04-14

## Architecture

Three.js WebGPU + TSL compute shaders (compiles to WGSL at runtime).
Two GPU stages:
1. **Galaxy generation compute** — runs once when topology changes
2. **Star splat renderer compute** — runs every frame

## Particle Counts

- Hard cap: 30M stars
- Practical: 56K–1M depending on preset
- Dynamic mode (with orbits): 420K stars, max buffer 1M
- Buffer clamped by `device.limits.maxStorageBufferBindingSize`

## Galaxy Parameters (Default Config)

```js
{
  type: "spiral",            // "spiral" | "elliptical" | "lenticular"
  starCount: 96000,
  maxStarCount: 96000,
  seed: 101,
  radiusPc: 16500,
  diskHeightPc: 2066,
  bulgeRadiusPc: 14570,
  bulgeFraction: 0.05,
  haloRadiusPc: 34800,
  haloFraction: 0.012,
  armCount: 4,
  armStrength: 0.73,
  armWidthDeg: 16.7,
  armTwistDeg: 300,
  diskTiltDeg: 62,
  biasStrength: 1,
  dustStrength: 4,
  dustArmBoost: 4,
  fakeOrbitDurationMyr: 60,
  fakeOrbitFadeIn: 0.08,
  fakeOrbitFadeOut: 0.08,
  dynamic: false,
  dynamicMode: "fake single-axis orbit",
  rotationSpeedDegPerMyr: 0,
  systemStarCount: 10000,
}
```

## Star Placement — GPU Compute (TSL)

### PRNG (PCG-style per star)
```js
seed = starIndex * 2246822519 + (galaxySeed + 3266489917)
// Each random call increments counter C:
state = (seed + C * 747796405) * 747796405 + 2891336453
result = ((state >> (state >> 28 + 4)) ^ state) * 277803737
output = ((result >> 22) ^ result) / 2^32   // float [0,1)
C += 1
```

### Three-Component Model

**Halo (1.2%)**: Spherical shell, truncated King profile
**Bulge (5%)**: Spherical with 0.78 Y-axis squashing (oblate)
**Disk (93.8%)**: Exponential radial + spiral arm rejection sampling

### Radial Sampling (Exponential Disk)
```
scaleLength = max(1, radiusPc * 0.22)
// Sum of 4 exponential samples, rejection if > maxRadius:
for (c = 0; c < 4; c++) {
  b = random().clamp(1e-7, 1)
  A = random().clamp(1e-7, 1)
  I = log(b * A) * (-scaleLength)
  if (I <= maxRadius) { r = I; break; }
}
```

### Spiral Arm Rejection Sampling (24 attempts)
```
radialProgress = log(1 + r/scaleLength) / log(1 + galaxyRadius/scaleLength)

For each arm k:
  armPhase = k * (2*PI/armCount) + radialProgress * armTwistRad
  angDist = acos(clamp(cos(angle - armPhase), -1, 1))
  armScore = exp(-0.5 * (angDist/armSigma)^2)

totalScore = clamp(min(1, sumArmScores)^0.75 * bulgeFade, 0, 1)

baseProb = 1 + (0.025 - 1) * armStrength^0.9
acceptProb = baseProb + (1 - baseProb) * totalScore
// Accept candidate if random() < acceptProb
```

### Vertical Displacement (Logistic/Cauchy)
```
y = log(u / (1 - u)) * verticalScale * 0.5
```

### Disk Tilt
```
positions[i]   = x
positions[i+1] = y * cos(tilt) - z * sin(tilt)
positions[i+2] = y * sin(tilt) + z * cos(tilt)
```

## Star Color/Temperature Model

### Stellar Population Distributions

Six probability arrays: [M/K dwarf, F/G main-seq, OBA hot, Red giant]

```js
Ye = [0.72, 0.20, 0.065, 0.015]  // Default/baseline
He = [0.90, 0.07, 0.005, 0.025]  // Halo (old, metal-poor)
Ne = [0.68, 0.12, 0.01,  0.19]   // Bulge (old population)
je = [0.78, 0.17, 0.03,  0.02]   // Disk non-arm
Ue = [0.56, 0.24, 0.16,  0.04]   // Disk arm (young, blue!)
Xe = [0.74, 0.11, 0.005, 0.145]  // Elliptical (old population)
```

Key insight: arm stars get 16% OBA hot vs 3% off-arm. Makes arms visibly bluer.

### Interpolation by Arm Score
```js
mK  = mix(Ye[0], mix(je[0], Ue[0], armScore), biasStrength)
fG  = mix(Ye[1], mix(je[1], Ue[1], armScore), biasStrength)
oba = mix(Ye[2], mix(je[2], Ue[2], armScore), biasStrength)
// Red giants = remainder
```

### Temperature per Type
```
M/K dwarfs:  T = 2600 + 3400 * pow(rand, 0.64)     // 2600-6000K
             Mv = 10.5 + (4.4 - 10.5) * pow(rand, 0.76)

F/G stars:   T = 5200 + 3200 * rand                  // 5200-8400K
             Mv = 5.2 + (0.4 - 5.2) * pow(rand, 0.84)

OBA hot:     T = 8500 + 7500 * rand                  // 8500-16000K
             Mv = 1.5 + (-4.6 - 1.5) * pow(rand, 0.76)

Red giants:  T = 2900 + 1800 * rand                  // 2900-4700K
             Mv = -5.5 + (-1.1 + 5.5) * pow(rand, 0.64)
```

### Tanner Helland Blackbody (Kelvin → RGB)
```js
n = clamp(temperature, 1000, 40000) / 100
if (n <= 66) {
  R = 255
  G = log(n) * 99.4708 - 161.1196
  B = n <= 19 ? 0 : log(n - 10) * 138.5177 - 305.0448
} else {
  r = n - 60
  R = pow(r, -0.1332) * 329.6987
  G = pow(r, -0.0755) * 288.1222
  B = 255
}
// Then sRGB-to-linear:
linear = srgb <= 0.04045 ? srgb / 12.92 : pow((srgb + 0.055) / 1.055, 2.4)
```

## Dust Lane Rendering (Per-Star Extinction)

NOT a separate layer. Applied as color modification per star in splat shader.

### Dust Parameters
```js
{
  enabled: type !== "elliptical" && dustStrength > 0,
  armEnabled: type === "spiral" && armStrength > 0.01 && dustArmBoost > 0,
  dustStrength: dustStrength,
  dustArmBoost: dustArmBoost,
  radialScalePc: radiusPc * 0.34,
  verticalScalePc: diskHeightPc * 0.18,    // Very thin!
  innerSuppressionPc: bulgeRadiusPc * 0.65,
  bulgeInnerFadeScalePc: bulgeRadiusPc * 1.35,
  armSigmaRad: armWidth / 2.355,
  armTwistRad: armTwistDeg * PI/180,
}
```

### Extinction Computation (per star)
1. **Smooth radial**: `exp(-radius / radialScale) * exp(-|height| / verticalScale)`
2. **Inner bulge suppression**: Gaussian fade near center
3. **Arm proximity boost**: For each arm, Gaussian-weight angular distance, sum
4. **3D FBM noise**: 3 octaves for clumpiness
5. **Wavelength-dependent absorption**:
```
dustColor = vec3(
  exp(extinction * -0.65),   // Red: least absorbed
  exp(extinction * -0.9),    // Green: moderate
  exp(extinction * -1.2)     // Blue: most absorbed
)
finalColor = starColor * dustColor
```
Blue absorbed ~1.85x more than red → brown/orange dust lanes.

## Fake Dynamics System

### Per-Star Lifecycle
```
// Random phase offset per star:
timeOffset = hash(starIndex * 747796405 + 2891336453)  // [0,1)

// Cycle phase (wraps continuously):
phase = fract(simulationTime / fakeOrbitDuration + timeOffset)

// Keplerian-ish angular velocity:
angVel = 220000/parsec / max(radius, galaxyRadius * 0.08)

// Current orbital angle:
angle = baseAngle + phase * fakeOrbitDuration * angVel

// Fade envelope:
fadeIn  = smoothstep(0, 0.08, phase)       // first 8%
fadeOut = 1 - smoothstep(0.92, 1, phase)   // last 8%
opacity = min(fadeIn, fadeOut)
```

~84% of stars fully visible at any time. Arms never wind up because stars reset before accumulating differential rotation.

System stars (first N) are exempt — orbit continuously.

## Rendering: Compute-Based Splatting

NOT GL_POINTS or sprites. Software rasterizer via compute shader.

### Pipeline
1. **Clear pass**: Zero out Uint32 R/G/B accumulator buffers (screen resolution)
2. **Splat pass** (per star):
   - Transform through dynamics
   - Project to clip space
   - Apparent magnitude: `absMag + 5 * (log10(distPc) - 1)`
   - Pixel radius from absolute magnitude (1.15-3.0 px)
   - Brightness: `10^(-0.4 * apparentMag) * brightness * fovBoost * 160`
   - Apply dust extinction to color
   - Splat 7x7 pixel kernel with radial falloff: `weight = 1 - smoothstep(r*0.7, r, dist)`
   - Atomic add to R/G/B accumulators (fixed-point × 65536)
3. **Composite pass**: Full-screen quad samples accumulators, converts to float, additive blend

### Advantages over GL_POINTS
- Sub-pixel accuracy
- Smooth density accumulation (50 stars on same pixel → correct additive light)
- No z-fighting or blending artifacts

## Blackbody Lookup Table
```
1601 entries: 1000K to 40000K at 25K steps
Float32Array of size 1601 * 3 (RGB triplets, linear space)
```
