precision highp float;

// ── Band textures ──
uniform sampler2D uBand_u;
uniform sampler2D uBand_g;
uniform sampler2D uBand_r;
uniform sampler2D uBand_i;
uniform sampler2D uBand_z;
uniform sampler2D uBand_nuv;

// ── Band data ranges ──
uniform vec2 uRange_u;
uniform vec2 uRange_g;
uniform vec2 uRange_r;
uniform vec2 uRange_i;
uniform vec2 uRange_z;
uniform vec2 uRange_nuv;

// ── Controls ──
uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uGrayscale;

// ── Theme & Animation ──
uniform float uTheme;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUV;

// ═══════════════════════════════════════
// Noise toolkit
// ═══════════════════════════════════════

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * valueNoise(p);
    p = p * 2.0 + vec2(1.7, 3.2);
    a *= 0.5;
  }
  return v;
}

float ign(vec2 c) {
  return fract(52.9829189 * fract(dot(c, vec2(0.06711056, 0.00583715))));
}

// Rotate point around origin
vec2 rot2(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

// ═══════════════════════════════════════
// Helpers
// ═══════════════════════════════════════

float denorm(float raw, vec2 range) {
  return raw * (range.y - range.x) + range.x;
}

float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

float stretch(float val, float m, float Q, float alpha) {
  return safe_asinh(alpha * Q * max(val - m, 0.0)) / max(Q, 1e-6);
}

void main() {
  float dither = (ign(gl_FragCoord.xy) - 0.5) / 255.0;

  // ═══════════════════════════════════════
  // PHASE 1: Band data → density fields
  // Mipmap LOD bias 3.0 → GPU averages ~8×8 texel blocks
  // Perfectly smooth, no sample dots, single lookup per band
  // ═══════════════════════════════════════

  float dustRaw = max(
    (denorm(texture2D(uBand_z, vUV, 2.0).r + dither, uRange_z) +
     denorm(texture2D(uBand_i, vUV, 2.0).r + dither, uRange_i)) * 0.5,
    0.0
  );
  float starRaw = max(
    (denorm(texture2D(uBand_r, vUV, 2.0).r + dither, uRange_r) +
     denorm(texture2D(uBand_g, vUV, 2.0).r + dither, uRange_g)) * 0.5,
    0.0
  );
  float gasRaw = max(
    (denorm(texture2D(uBand_u, vUV, 2.0).r + dither, uRange_u) +
     denorm(texture2D(uBand_nuv, vUV, 2.0).r + dither, uRange_nuv)) * 0.5,
    0.0
  );

  float totalRaw = (dustRaw + starRaw + gasRaw) / 3.0;

  // Asinh stretch to 0–1
  float avgRange = (
    (uRange_u.y - uRange_u.x) + (uRange_g.y - uRange_g.x) +
    (uRange_r.y - uRange_r.x) + (uRange_i.y - uRange_i.x) +
    (uRange_z.y - uRange_z.x) + (uRange_nuv.y - uRange_nuv.x)
  ) / 6.0;
  float m = (1.0 - uSensitivity) * avgRange * 0.02;

  float sTotal = stretch(totalRaw, m, uQ, uAlpha);
  float sDust  = stretch(dustRaw,  m, uQ, uAlpha);
  float sStar  = stretch(starRaw,  m, uQ, uAlpha);
  float sGas   = stretch(gasRaw,   m, uQ, uAlpha);

  // Per-pixel spectral fractions (for nebula color tinting)
  float totalS = sDust + sStar + sGas + 0.001;
  float dustFrac = sDust / totalS;
  float gasFrac  = sGas  / totalS;
  float starFrac = sStar / totalS;

  // ═══════════════════════════════════════
  // PHASE 2: Layered smoke clouds
  // Stack from faintest (outer) → brightest (core)
  // Each layer: iso-brightness contour shape + FBM smoke texture
  // Noise warps the density field itself so zone edges become cloudy wisps
  // ═══════════════════════════════════════

  vec3 col = vec3(0.0);

  // Maelstrom: rotate noise coords around galaxy center per layer
  // Outer layers drift slowly, inner layers spin faster
  vec2 center = vec2(0.5);
  vec2 pc = vUV - center;

  // ── Layer 4: outer nebula haze (domain-warped for dramatic wisps) ──
  vec2 uv4 = rot2(pc, uTime * 0.04) + center;
  vec2 warp4 = vec2(
    fbm(uv4 * 2.5 + vec2(uTime * 0.005, 0.0)),
    fbm(uv4 * 2.5 + vec2(0.0, uTime * 0.004) + 5.2)
  );
  float n4 = fbm(uv4 * 3.0 + warp4 * 1.5 + vec2(uTime * 0.006, uTime * 0.004));
  // Warp the density field with noise — breaks up pixelated texture boundaries
  float d4 = mix(sTotal, n4, 0.35);
  float mask4 = smoothstep(0.0, 0.20, d4);
  float smoke4 = n4 * 0.6 + 0.4;
  vec3 tint4 = mix(
    vec3(0.14, 0.07, 0.25),    // infra: deep wine
    vec3(0.05, 0.10, 0.30),    // astral: deep ocean blue
    uTheme
  );
  tint4 = mix(tint4, mix(vec3(0.18, 0.04, 0.22), vec3(0.04, 0.15, 0.25), uTheme), n4);
  col += tint4 * mask4 * smoke4 * 0.55;

  // ── Layer 3: mid nebula — saturated color clouds ──
  vec2 uv3 = rot2(pc, uTime * 0.06) + center;
  vec2 warp3 = vec2(
    fbm(uv3 * 4.0 + vec2(-uTime * 0.008, 0.0) + 3.1),
    fbm(uv3 * 4.0 + vec2(0.0, uTime * 0.006) + 7.4)
  );
  float n3 = fbm(uv3 * 5.5 + warp3 * 1.2 + vec2(-uTime * 0.01, uTime * 0.007));
  float d3 = mix(sTotal, n3, 0.30);
  float mask3 = smoothstep(0.02, 0.30, d3);
  float smoke3 = n3 * 0.5 + 0.5;
  vec3 dustTint3 = mix(vec3(0.70, 0.25, 0.05), vec3(0.25, 0.12, 0.55), uTheme);
  vec3 gasTint3  = mix(vec3(0.08, 0.32, 0.75), vec3(0.20, 0.18, 0.70), uTheme);
  vec3 starTint3 = mix(vec3(0.60, 0.50, 0.32), vec3(0.30, 0.25, 0.65), uTheme);
  vec3 tint3 = dustTint3 * dustFrac + gasTint3 * gasFrac + starTint3 * starFrac;
  col += tint3 * mask3 * smoke3 * 0.65;

  // ── Dark absorption lanes ──
  vec2 uvDark = rot2(pc, uTime * 0.05) + center;
  float darkLane = fbm(uvDark * 6.0 + vec2(uTime * 0.004, -uTime * 0.003));
  float darkMask = smoothstep(0.05, 0.40, sTotal);
  col *= 1.0 - smoothstep(0.40, 0.7, darkLane) * darkMask * 0.4;

  // ── Layer 2: inner — clearly brighter, shifting toward white ──
  vec2 uv2 = rot2(pc, uTime * 0.09) + center;
  float n2 = fbm(uv2 * 8.0 + vec2(uTime * 0.012, -uTime * 0.009));
  float d2 = mix(sTotal, n2, 0.25);
  float mask2 = smoothstep(0.08, 0.50, d2);
  float smoke2 = n2 * 0.2 + 0.8;
  vec3 dustTint2 = mix(vec3(0.90, 0.65, 0.30), vec3(0.65, 0.35, 0.60), uTheme);
  vec3 gasTint2  = mix(vec3(0.80, 0.70, 0.40), vec3(0.55, 0.40, 0.85), uTheme);
  vec3 starTint2 = mix(vec3(0.95, 0.85, 0.60), vec3(0.75, 0.55, 0.80), uTheme);
  vec3 tint2 = dustTint2 * dustFrac + gasTint2 * gasFrac + starTint2 * starFrac;
  col += tint2 * mask2 * smoke2 * 0.6;

  // ── Layer 1: core — blazing white hot (replaces, not adds) ──
  vec2 uv1 = rot2(pc, uTime * 0.12) + center;
  float n1 = fbm(uv1 * 4.0 + vec2(uTime * 0.008, uTime * 0.006));
  float d1 = mix(sTotal, n1, 0.18);
  float mask1 = smoothstep(0.15, 0.55, d1);
  // Core tint shifts subtly with spectral content
  vec3 coreBase = mix(
    vec3(1.0, 0.92, 0.80),     // infra: warm gold-white
    vec3(0.82, 0.85, 1.0),     // astral: cool blue-white
    uTheme
  );
  vec3 coreAccent = mix(
    vec3(1.0, 0.80, 0.60),     // infra: amber highlight
    vec3(0.70, 0.80, 1.0),     // astral: ice blue highlight
    uTheme
  );
  vec3 tint1 = mix(coreBase, coreAccent, gasFrac * 0.5 + n1 * 0.3);
  float pulse = sin(uTime * 0.5) * 0.06 + 1.0;
  col = mix(col, tint1 * pulse, mask1);

  // ═══════════════════════════════════════
  // PHASE 3: Data-driven star detection & twinkle
  // Sharp samples vs blurred background → real star locations
  // ═══════════════════════════════════════

  // Sharp (unblurred) samples to find point sources
  float i_sharp = max(denorm(texture2D(uBand_i, vUV).r + dither, uRange_i), 0.0);
  float r_sharp = max(denorm(texture2D(uBand_r, vUV).r + dither, uRange_r), 0.0);
  float g_sharp = max(denorm(texture2D(uBand_g, vUV).r + dither, uRange_g), 0.0);
  float z_sharp = max(denorm(texture2D(uBand_z, vUV).r + dither, uRange_z), 0.0);

  // Star = sharp pixel much brighter than blurred local background
  float peak = max(max(i_sharp, r_sharp), max(g_sharp, z_sharp));
  float localBg = max(max(dustRaw, starRaw), gasRaw);
  float minBright = avgRange * 0.03;
  float starness = smoothstep(
    max(localBg * 1.5, minBright),
    max(localBg * 3.0, minBright * 2.5),
    peak
  );

  // Twinkle animation — two noise layers for richer sparkle
  float twinkle = valueNoise(vUV * 400.0 + vec2(uTime * 3.0, uTime * 2.0));
  float twinkle2 = valueNoise(vUV * 150.0 + vec2(-uTime * 1.5, uTime * 2.5));
  twinkle = twinkle * twinkle * twinkle2;
  col *= mix(1.0, 0.3 + twinkle * 2.0, starness);

  // Additive star glow
  vec3 starCol = mix(vec3(1.0, 0.95, 0.88), vec3(0.88, 0.92, 1.0), uTheme);
  col += starCol * starness * (twinkle * 0.5 + 0.2);

  // ═══════════════════════════════════════
  // PHASE 4: Cinematic color grading
  // ═══════════════════════════════════════

  // Lifted blacks
  vec3 blackFloor = mix(
    vec3(0.010, 0.007, 0.018),
    vec3(0.005, 0.008, 0.025),
    uTheme
  );
  col = max(col, blackFloor);

  // Gentle S-curve (preserve cloud gradients)
  col = mix(col, col * col * (3.0 - 2.0 * col), 0.45);

  // Warm-cool split toning
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float warmW = mix(1.0, 0.25, uTheme);
  float coolW = mix(0.3, 1.0, uTheme);
  col += vec3(0.012, 0.006, -0.012) * smoothstep(0.0, 0.5, lum) * warmW;
  col += vec3(-0.006, 0.0, 0.020) * (1.0 - smoothstep(0.0, 0.3, lum)) * coolW;

  // Vignette
  float vig = 1.0 - smoothstep(0.5, 1.4, length(vUV - 0.5) * 1.3);
  col *= mix(0.8, 1.0, vig);

  col = clamp(col, 0.0, 1.0);

  // Grayscale option
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), 1.0);
}
