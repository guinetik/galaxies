precision highp float;

varying vec3 vDirection;

uniform float uTime;
uniform float uSeed;
uniform float uNebulaIntensity;

#define PI 3.14159265359
#define TAU 6.28318530718

// Noise constants
const float MOD_DIVISOR = 289.0;
const float NOISE_OUTPUT_SCALE_3D = 42.0;
const int FBM_MAX_OCTAVES = 8;

// Nebula structure
const float NEBULA_SCALE = 0.5;
const float NEBULA_DETAIL = 2.0;
const int SPIRAL_NOISE_ITER = 5;
const float NUDGE = 3.0;
const float DENSITY_THRESHOLD = 0.02;
const float DENSITY_FALLOFF = 0.5;

// =============================================================================
// HASH FUNCTIONS
// =============================================================================

float seedHash(float seed) {
  vec3 p3 = fract(vec3(seed) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

// =============================================================================
// SIMPLEX NOISE 3D
// =============================================================================

vec3 mod289_3(vec3 x) {
  return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec4 mod289_4(vec4 x) {
  return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec4 permute_4(vec4 x) {
  return mod289_4(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise3D(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289_3(i);
  vec4 p = permute_4(permute_4(permute_4(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;

  return NOISE_OUTPUT_SCALE_3D * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// =============================================================================
// FBM (variable octaves)
// =============================================================================

float fbm3D(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  vec3 shift = vec3(100.0);

  for (int i = 0; i < FBM_MAX_OCTAVES; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise3D(p * frequency);
    p += shift;
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

// =============================================================================
// SPIRAL NOISE — creates organic filamentary structure
// =============================================================================

float spiralNoise(vec3 p, float seed) {
  float normalizer = 1.0 / sqrt(1.0 + NUDGE * NUDGE);
  float n = 1.5 - seed * 0.5;
  float iter = 2.0;

  for (int i = 0; i < SPIRAL_NOISE_ITER; i++) {
    n += -abs(sin(p.y * iter) + cos(p.x * iter)) / iter;
    p.xy += vec2(p.y, -p.x) * NUDGE;
    p.xy *= normalizer;
    p.xz += vec2(p.z, -p.x) * NUDGE;
    p.xz *= normalizer;
    iter *= 1.5 + seed * 0.2;
  }

  return n;
}

// =============================================================================
// NEBULA DENSITY — heterogeneous with bright/dark regions
// =============================================================================

float nebulaDensity(vec3 p, float seed) {
  float k = 1.5 + seed * 0.5;
  float spiral = spiralNoise(p * NEBULA_SCALE, seed);
  float detail = fbm3D(p * NEBULA_DETAIL, 4) * 0.35;
  float fine = fbm3D(p * NEBULA_DETAIL * 3.0, 2) * 0.15;
  return k * (0.5 + spiral * 0.5 + detail + fine);
}

float densityVariation(vec3 p, float seed) {
  float largeBright = fbm3D(p * 0.3 + seed * 50.0, 2);
  largeBright = smoothstep(-0.4, 0.4, largeBright);
  float mediumVar = fbm3D(p * 0.8 + seed * 30.0, 2);
  mediumVar = mediumVar * 0.5 + 0.5;
  return 0.3 + largeBright * (0.4 + mediumVar * 0.3);
}

float voidMask(vec3 p, float seed) {
  float voidNoise = fbm3D(p * 0.6 + seed * 70.0, 2);
  float voids = smoothstep(-0.5, 0.3, voidNoise);
  float smallVoids = fbm3D(p * 1.5 + seed * 90.0, 2);
  smallVoids = smoothstep(-0.5, 0.2, smallVoids);
  return 0.55 + voids * smallVoids * 0.45;
}

float brightRegions(vec3 p, float seed) {
  float patch1 = fbm3D(p * 0.5 + seed * 40.0, 2);
  patch1 = pow(max(patch1 + 0.3, 0.0), 2.0);
  float cores = fbm3D(p * 1.5 + seed * 60.0, 2);
  cores = pow(max(cores + 0.5, 0.0), 3.0) * 0.5;
  return patch1 + cores;
}

// =============================================================================
// EMISSION COLORS — physically-inspired nebula palette
// =============================================================================

vec3 nebulaEmissionColor(float hue, float variation) {
  vec3 hAlpha = vec3(0.9, 0.3, 0.35);   // H-alpha red
  vec3 oiii   = vec3(0.2, 0.7, 0.65);   // OIII teal
  vec3 sii    = vec3(0.8, 0.25, 0.2);   // SII deep red
  vec3 hBeta  = vec3(0.3, 0.5, 0.8);    // H-beta blue

  vec3 color;
  if (hue < 0.25) {
    color = mix(hAlpha, oiii, hue / 0.25);
  } else if (hue < 0.5) {
    color = mix(oiii, hBeta, (hue - 0.25) / 0.25);
  } else if (hue < 0.75) {
    color = mix(hBeta, sii, (hue - 0.5) / 0.25);
  } else {
    color = mix(sii, hAlpha, (hue - 0.75) / 0.25);
  }

  color += (variation - 0.5) * 0.15;
  return color;
}

// =============================================================================
// STAR COLOR FROM TEMPERATURE
// =============================================================================

vec3 starColorFromTemp(float temp) {
  if (temp < 0.2) {
    return mix(vec3(1.0, 0.6, 0.4), vec3(1.0, 0.75, 0.5), temp / 0.2);
  } else if (temp < 0.4) {
    return mix(vec3(1.0, 0.75, 0.5), vec3(1.0, 0.9, 0.75), (temp - 0.2) / 0.2);
  } else if (temp < 0.6) {
    return mix(vec3(1.0, 0.9, 0.75), vec3(1.0, 1.0, 1.0), (temp - 0.4) / 0.2);
  } else if (temp < 0.8) {
    return mix(vec3(1.0, 1.0, 1.0), vec3(0.85, 0.9, 1.0), (temp - 0.6) / 0.2);
  } else {
    return mix(vec3(0.85, 0.9, 1.0), vec3(0.7, 0.8, 1.0), (temp - 0.8) / 0.2);
  }
}

// =============================================================================
// STAR SCINTILLATION
// =============================================================================

float starScintillation(float baseIntensity, float starHash, float time) {
  if (baseIntensity < 0.5) return baseIntensity;
  float scint = 1.0;
  scint += 0.03 * sin(time * 1.5 + starHash * TAU);
  scint += 0.02 * sin(time * 2.7 + starHash * TAU * 1.3);
  return baseIntensity * scint;
}

// =============================================================================
// DISTANT GAS CLOUD — background nebula patches
// =============================================================================

vec4 distantGasCloud(vec3 dir, float seed, vec3 cloudCenter, float cloudSize, vec3 cloudColor) {
  float dist = length(dir - cloudCenter);
  float mask = 1.0 - smoothstep(0.0, cloudSize, dist);
  mask = pow(max(mask, 0.0), 1.5);

  if (mask < 0.01) return vec4(0.0);

  vec3 localPos = (dir - cloudCenter) / cloudSize;
  float noise = fbm3D(localPos * 3.0 + seed * 10.0, 3) * 0.5 + 0.5;
  float detail = fbm3D(localPos * 8.0 + seed * 20.0, 2) * 0.5 + 0.5;

  float voidNoise = fbm3D(localPos * 2.0 + seed * 30.0, 2);
  float voids = smoothstep(-0.3, 0.2, voidNoise);

  float brightCore = fbm3D(localPos * 4.0 + seed * 40.0, 2);
  brightCore = pow(max(brightCore + 0.4, 0.0), 2.5);

  float density = mask * noise * (0.7 + detail * 0.3) * voids;
  density += brightCore * mask * 0.3;

  float edge = smoothstep(0.0, 0.3, mask) * (1.0 - smoothstep(0.7, 1.0, mask));
  density *= 0.4 + edge * 0.6;

  float colorVar = fbm3D(localPos * 2.5 + seed * 15.0, 2) * 0.15;
  vec3 variedColor = cloudColor * (0.85 + colorVar * 2.0);
  variedColor = mix(variedColor, cloudColor * 1.3, brightCore);

  vec3 color = variedColor * (0.12 + density * 0.28);

  return vec4(color, density * 0.45);
}

// =============================================================================
// EMISSION KNOT — compact bright HII region
// =============================================================================

vec4 emissionKnot(vec3 dir, float seed, vec3 center, float size, vec3 knotColor) {
  float dist = length(dir - center);
  float mask = 1.0 - smoothstep(0.0, size, dist);
  mask = pow(max(mask, 0.0), 2.0);

  if (mask < 0.01) return vec4(0.0);

  vec3 localPos = (dir - center) / size;
  float noise = fbm3D(localPos * 5.0 + seed * 25.0, 2) * 0.5 + 0.5;
  float density = mask * noise;

  float core = exp(-dist * 30.0 / size) * 0.8;
  density += core;

  vec3 color = knotColor * density * 0.6;
  return vec4(color, min(density * 0.5, 1.0));
}

// =============================================================================
// DISTANT GALAXY — tiny background smudge
// =============================================================================

vec3 distantGalaxy(vec3 dir, float seed, vec3 center, float size) {
  float dist = length(dir - center);
  if (dist > size * 2.0) return vec3(0.0);

  vec3 toCenter = dir - center;
  vec3 tiltAxis = normalize(hash33(vec3(seed * 100.0)) - 0.5);

  float diskDist = length(toCenter - tiltAxis * dot(toCenter, tiltAxis));
  float heightDist = abs(dot(toCenter, tiltAxis));

  float angle = atan(toCenter.y, toCenter.x);
  float spiral = sin(angle * 2.0 + diskDist * 20.0 / size + seed * TAU) * 0.5 + 0.5;

  float disk = exp(-diskDist * 8.0 / size) * exp(-heightDist * 40.0 / size);
  float bulge = exp(-dist * 15.0 / size) * 0.8;

  float brightness = (disk * (0.3 + spiral * 0.7) + bulge) * 0.15;

  vec3 galaxyColor = mix(vec3(1.0, 0.9, 0.7), vec3(0.9, 0.85, 1.0), seedHash(seed + 0.5));
  return galaxyColor * brightness;
}

// =============================================================================
// MAIN
// =============================================================================

void main() {
  vec3 dir = normalize(vDirection);
  float time = uTime * 0.35;
  float realTime = uTime;

  // Seed-derived parameters for this galaxy's sky
  float sh1 = seedHash(uSeed);
  float sh2 = seedHash(uSeed + 1.0);
  float sh3 = seedHash(uSeed + 2.0);
  float sh4 = seedHash(uSeed + 3.0);
  float sh5 = seedHash(uSeed + 4.0);
  float sh6 = seedHash(uSeed + 5.0);

  float flowTime = uTime * 0.008;

  // Animated position for main nebula
  vec3 animPos = dir + vec3(
    flowTime * 0.03 * (sh1 - 0.5),
    flowTime * 0.03 * 0.5,
    flowTime * 0.03 * (sh2 - 0.5)
  );

  // === DEEP SPACE BACKGROUND ===
  vec3 finalColor = vec3(0.005, 0.005, 0.008);

  // === DISTANT GALAXIES (very far background) ===
  int numGalaxies = 2 + int(sh5 * 3.0);
  for (int i = 0; i < 4; i++) {
    if (i >= numGalaxies) break;
    float galSeed = seedHash(uSeed + float(i) * 7.0 + 100.0);
    vec3 galCenter = normalize(vec3(
      seedHash(galSeed) - 0.5,
      seedHash(galSeed + 0.1) - 0.5,
      seedHash(galSeed + 0.2) - 0.5
    ));
    float galSize = 0.03 + seedHash(galSeed + 0.3) * 0.04;
    finalColor += distantGalaxy(dir, galSeed, galCenter, galSize);
  }

  // === STARS — 4 layers, jittered positions to break grid artifacts ===
  float starField = 0.0;
  vec3 starColor = vec3(1.0);

  // Bright stars (sparse, vivid color, scintillation)
  vec3 starCell1 = floor(dir * 180.0);
  float starHash1 = seedHash(dot(starCell1, vec3(127.1, 311.7, 74.7)) + uSeed);
  if (starHash1 > 0.993) {
    vec3 jitter1 = hash33(starCell1 + uSeed) * 0.8 + 0.1;
    vec3 starCenter = (starCell1 + jitter1) / 180.0;
    float dist = length(dir - normalize(starCenter));
    float star = exp(-dist * 800.0) * (0.6 + starHash1 * 0.4);
    star = starScintillation(star, starHash1, realTime);
    starField = star;
    starColor = starColorFromTemp(seedHash(starHash1 * 77.7));
  }

  // Medium stars
  vec3 starCell2 = floor(dir * 320.0);
  float starHash2 = seedHash(dot(starCell2, vec3(93.1, 157.3, 211.7)) + uSeed * 2.0);
  if (starHash2 > 0.988) {
    vec3 jitter2 = hash33(starCell2 + uSeed + 7.0) * 0.8 + 0.1;
    vec3 starCenter2 = (starCell2 + jitter2) / 320.0;
    float dist2 = length(dir - normalize(starCenter2));
    float star2 = exp(-dist2 * 1000.0) * (0.35 + starHash2 * 0.35);
    if (star2 > starField) {
      starField = star2;
      starColor = starColorFromTemp(seedHash(starHash2 * 77.7));
    }
  }

  // Faint stars (dense layer)
  vec3 starCell3 = floor(dir * 520.0);
  float starHash3 = seedHash(dot(starCell3, vec3(41.1, 89.3, 173.7)) + uSeed * 3.0);
  if (starHash3 > 0.978) {
    vec3 jitter3 = hash33(starCell3 + uSeed + 13.0) * 0.8 + 0.1;
    vec3 starCenter3 = (starCell3 + jitter3) / 520.0;
    float dist3 = length(dir - normalize(starCenter3));
    float faint = exp(-dist3 * 1400.0) * 0.25;
    starField = max(starField, faint);
  }

  // Very faint stars (densest layer — fills the sky)
  vec3 starCell4 = floor(dir * 850.0);
  float starHash4 = seedHash(dot(starCell4, vec3(17.3, 43.7, 97.1)) + uSeed * 4.0);
  if (starHash4 > 0.970) {
    vec3 jitter4 = hash33(starCell4 + uSeed + 19.0) * 0.8 + 0.1;
    vec3 starCenter4 = (starCell4 + jitter4) / 850.0;
    float dist4 = length(dir - normalize(starCenter4));
    starField = max(starField, exp(-dist4 * 2000.0) * 0.1);
  }

  finalColor += starColor * starField;

  // === DISTANT GAS CLOUDS (background nebula patches) ===
  int numClouds = 3 + int(sh4 * 4.0);
  for (int i = 0; i < 6; i++) {
    if (i >= numClouds) break;
    float cloudSeed = seedHash(uSeed + float(i) * 13.0 + 50.0);
    vec3 cloudCenter = normalize(vec3(
      seedHash(cloudSeed) - 0.5,
      seedHash(cloudSeed + 0.1) - 0.5,
      seedHash(cloudSeed + 0.2) - 0.5
    ));
    float cloudSize = 0.15 + seedHash(cloudSeed + 0.3) * 0.25;
    float cloudHue = fract(sh1 + 0.3 + seedHash(cloudSeed + 0.4) * 0.4);
    vec3 cloudColor = nebulaEmissionColor(cloudHue, seedHash(cloudSeed + 0.5));
    vec4 cloud = distantGasCloud(dir, cloudSeed, cloudCenter, cloudSize, cloudColor);
    finalColor = mix(finalColor, finalColor + cloud.rgb * uNebulaIntensity, cloud.a);
  }

  // (dark nebulae removed — they created unwanted dark spots in the backdrop)

  // === MAIN NEBULA — spiral noise with heterogeneous density ===
  vec3 lightDir = normalize(vec3(sh1 - 0.5, 0.3, sh2 - 0.5));

  float mainDensity = nebulaDensity(animPos * 2.0, sh1);
  float offsetDensity = nebulaDensity(animPos * 2.0 + lightDir * 0.15, sh1);
  float density = mainDensity * 0.65 + offsetDensity * 0.35;

  // Heterogeneous density: bright regions + voids
  float variation = densityVariation(animPos, sh1);
  density *= 0.3 + variation * 1.2;

  float voids = voidMask(animPos, sh2);
  density *= voids;

  float brightSpots = brightRegions(animPos, sh3);
  density += brightSpots * 0.4;

  float cloudMask = smoothstep(DENSITY_THRESHOLD, DENSITY_THRESHOLD + DENSITY_FALLOFF, density);
  cloudMask *= 0.85;

  // Color variation across nebula
  float colorNoise = fbm3D(animPos * 1.2 + vec3(sh3 * 10.0), 3);
  colorNoise = colorNoise * 0.5 + 0.5;
  float regionalHue = fbm3D(animPos * 0.4 + sh4 * 20.0, 2) * 0.3;
  float hue = fract(sh1 + colorNoise * 0.25 + regionalHue);
  vec3 nebulaColor = nebulaEmissionColor(hue, colorNoise);

  // Brightness
  float hotspots = fbm3D(animPos * 2.5 + sh6 * 30.0, 2);
  hotspots = pow(max(hotspots + 0.3, 0.0), 2.0);

  float brightness = 0.5 + cloudMask * 0.8;
  brightness *= 0.85 + sh4 * 0.3;
  brightness *= 0.6 + brightSpots * 1.2;
  brightness *= 0.8 + hotspots * 0.8;
  brightness *= 0.7 + variation * 0.8;
  nebulaColor *= brightness;

  // Structure detail
  float structure = fbm3D(animPos * 4.0, 2) * 0.5 + 0.5;
  nebulaColor *= 0.85 + structure * 0.3;

  // Edge glow (ionization fronts)
  float edgeGlow = pow(max(cloudMask, 0.0), 0.6) - pow(max(cloudMask, 0.0), 1.8);
  nebulaColor += nebulaColor * edgeGlow * 0.5;

  float brightEdge = pow(max(brightSpots - 0.2, 0.0), 0.5);
  nebulaColor += nebulaEmissionColor(hue + 0.1, 0.8) * brightEdge * 0.3;

  // Dust lanes
  float dustLane = fbm3D(animPos * 1.5 + vec3(sh2 * 5.0), 3);
  dustLane = smoothstep(0.2, 0.5, dustLane);
  nebulaColor *= 0.5 + dustLane * 0.5;

  // Void regions dim
  nebulaColor *= 0.2 + voids * 0.8;

  float nebulaAlpha = cloudMask * 0.7 * voids;

  // === EMISSION KNOTS ===
  int numKnots = 2 + int(sh3 * 4.0);
  for (int i = 0; i < 5; i++) {
    if (i >= numKnots) break;
    float knotSeed = seedHash(uSeed + float(i) * 23.0 + 300.0);
    vec3 knotCenter = normalize(vec3(
      (seedHash(knotSeed) - 0.5) * 0.8,
      (seedHash(knotSeed + 0.1) - 0.5) * 0.8,
      0.5 + seedHash(knotSeed + 0.2) * 0.3
    ));
    float knotSize = 0.02 + seedHash(knotSeed + 0.3) * 0.03;
    float knotHue = fract(sh1 + 0.15 + seedHash(knotSeed + 0.4) * 0.2);
    vec3 knotColor = nebulaEmissionColor(knotHue, 0.7) * 1.5;
    vec4 knot = emissionKnot(dir, knotSeed, knotCenter, knotSize, knotColor);
    nebulaColor += knot.rgb;
    nebulaAlpha = max(nebulaAlpha, knot.a);
  }

  // === COMBINE NEBULA WITH BACKGROUND ===
  float obscuration = nebulaAlpha * 0.8 * uNebulaIntensity;
  finalColor = mix(finalColor, nebulaColor, obscuration);

  // Stars punch through slightly
  finalColor += starColor * starField * (1.0 - obscuration) * 0.3;


  // === FINAL ADJUSTMENTS ===
  // Subtle vignette on vertical extremes
  float vignette = 1.0 - pow(max(abs(dir.y) - 0.10, 0.0), 2.0) * 0.08;
  finalColor *= vignette;

  // Dim for intergalactic backdrop: this sky should feel remote and subdued,
  // with nebula light reading as far-off emission rather than a local glow.
  finalColor *= 0.45;
  finalColor = clamp(finalColor, 0.0, 1.0);

  gl_FragColor = vec4(finalColor, 1.0);
}
