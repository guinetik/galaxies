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
  // LOD bias 0.5 preserves galaxy structure while smoothing noise
  // ═══════════════════════════════════════

  float dustRaw = max(
    (denorm(texture2D(uBand_z, vUV, 0.5).r + dither, uRange_z) +
     denorm(texture2D(uBand_i, vUV, 0.5).r + dither, uRange_i)) * 0.5,
    0.0
  );
  float starRaw = max(
    (denorm(texture2D(uBand_r, vUV, 0.5).r + dither, uRange_r) +
     denorm(texture2D(uBand_g, vUV, 0.5).r + dither, uRange_g)) * 0.5,
    0.0
  );
  float gasRaw = max(
    (denorm(texture2D(uBand_u, vUV, 0.5).r + dither, uRange_u) +
     denorm(texture2D(uBand_nuv, vUV, 0.5).r + dither, uRange_nuv)) * 0.5,
    0.0
  );

  // Also sample at higher LOD for smooth background envelope
  float dustSmooth = max(
    (denorm(texture2D(uBand_z, vUV, 3.0).r, uRange_z) +
     denorm(texture2D(uBand_i, vUV, 3.0).r, uRange_i)) * 0.5,
    0.0
  );
  float starSmooth = max(
    (denorm(texture2D(uBand_r, vUV, 3.0).r, uRange_r) +
     denorm(texture2D(uBand_g, vUV, 3.0).r, uRange_g)) * 0.5,
    0.0
  );
  float gasSmooth = max(
    (denorm(texture2D(uBand_u, vUV, 3.0).r, uRange_u) +
     denorm(texture2D(uBand_nuv, vUV, 3.0).r, uRange_nuv)) * 0.5,
    0.0
  );

  float totalRaw = (dustRaw + starRaw + gasRaw) / 3.0;
  float totalSmooth = (dustSmooth + starSmooth + gasSmooth) / 3.0;

  // Asinh stretch
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
  float sTotalSmooth = stretch(totalSmooth, m, uQ, uAlpha);

  // Per-pixel spectral fractions
  float totalS = sDust + sStar + sGas + 0.001;
  float dustFrac = sDust / totalS;
  float gasFrac  = sGas  / totalS;
  float starFrac = sStar / totalS;

  // ═══════════════════════════════════════
  // PHASE 2: Data-driven nebula rendering
  // The actual band data shapes the galaxy, noise adds atmosphere
  // ═══════════════════════════════════════

  vec3 col = vec3(0.0);
  vec2 center = vec2(0.5);
  vec2 pc = vUV - center;
  float dist = length(pc) * 2.0; // 0 at center, 1 at edge

  // ── Base color from spectral data ──
  // Warm core (dust-dominated) → cool arms (gas/star-dominated)
  vec3 dustCol = mix(
    vec3(0.85, 0.45, 0.12),   // infra: warm amber
    vec3(0.55, 0.40, 0.70),   // astral: muted purple
    uTheme
  );
  vec3 starCol_base = mix(
    vec3(0.95, 0.88, 0.65),   // infra: golden white
    vec3(0.65, 0.72, 0.95),   // astral: blue-white
    uTheme
  );
  vec3 gasCol = mix(
    vec3(0.30, 0.15, 0.60),   // infra: deep violet
    vec3(0.20, 0.50, 0.90),   // astral: vivid blue
    uTheme
  );

  // Spectral-weighted base color per pixel
  vec3 dataColor = dustCol * dustFrac + starCol_base * starFrac + gasCol * gasFrac;

  // ── Layer 4: outer nebula haze — faint wispy envelope ──
  vec2 uv4 = rot2(pc, uTime * 0.02) + center;
  vec2 warp4 = vec2(
    fbm(uv4 * 2.0 + vec2(uTime * 0.003, 0.0)),
    fbm(uv4 * 2.0 + vec2(0.0, uTime * 0.002) + 5.2)
  );
  float n4 = fbm(uv4 * 2.5 + warp4 * 0.8);
  // Data drives shape, noise adds wispy edges
  float mask4 = smoothstep(0.0, 0.12, sTotalSmooth) * smoothstep(1.2, 0.3, dist);
  float smoke4 = n4 * 0.4 + 0.6;
  vec3 tint4 = mix(
    vec3(0.10, 0.05, 0.18),   // infra: deep wine
    vec3(0.04, 0.08, 0.20),   // astral: deep navy
    uTheme
  );
  col += tint4 * mask4 * smoke4 * 0.4;

  // ── Layer 3: mid nebula — spectral color clouds following data ──
  vec2 uv3 = rot2(pc, uTime * 0.03) + center;
  float n3 = fbm(uv3 * 4.0 + vec2(-uTime * 0.005, uTime * 0.004));
  // Noise only warps edges, data is primary shape
  float d3 = sTotal * (0.85 + n3 * 0.15);
  float mask3 = smoothstep(0.03, 0.25, d3);
  float smoke3 = n3 * 0.3 + 0.7;
  col += dataColor * mask3 * smoke3 * 0.5;

  // ── Dark absorption lanes — stronger, data-aware ──
  vec2 uvDark = rot2(pc, uTime * 0.025) + center;
  float darkNoise = fbm(uvDark * 5.0 + vec2(uTime * 0.003, -uTime * 0.002));
  // Lanes are stronger where there IS data (mid-brightness regions)
  float darkMask = smoothstep(0.08, 0.35, sTotal) * (1.0 - smoothstep(0.5, 0.8, sTotal));
  float darkAmount = smoothstep(0.35, 0.65, darkNoise) * darkMask * 0.6;
  col *= 1.0 - darkAmount;

  // ── Layer 2: inner body — brighter, more saturated ──
  vec2 uv2 = rot2(pc, uTime * 0.05) + center;
  float n2 = fbm(uv2 * 6.0 + vec2(uTime * 0.007, -uTime * 0.005));
  float d2 = sTotal * (0.9 + n2 * 0.1);
  float mask2 = smoothstep(0.10, 0.45, d2);
  float smoke2 = n2 * 0.15 + 0.85;
  // Shift toward warmer tones for inner regions
  vec3 innerColor = mix(dataColor, mix(
    vec3(0.95, 0.80, 0.50),   // infra: warm gold
    vec3(0.70, 0.78, 1.0),    // astral: bright blue-white
    uTheme
  ), 0.4);
  col += innerColor * mask2 * smoke2 * 0.5;

  // ── Layer 1: core — blazing bright (replaces, not adds) ──
  float n1 = fbm(rot2(pc, uTime * 0.07) * 3.0 + center + vec2(uTime * 0.004));
  // Core driven purely by data brightness
  float coreMask = smoothstep(0.20, 0.65, sTotal) * smoothstep(0.8, 0.15, dist);
  vec3 coreColor = mix(
    vec3(1.0, 0.92, 0.75),    // infra: warm white
    vec3(0.85, 0.88, 1.0),    // astral: cool white
    uTheme
  );
  // Slight spectral tint
  coreColor = mix(coreColor, dataColor * 1.5, 0.15);
  float pulse = sin(uTime * 0.4) * 0.04 + 1.0;
  col = mix(col, coreColor * pulse, coreMask * (n1 * 0.1 + 0.9));

  // ── HII regions: red/pink emission in gas-rich areas ──
  float hiiNoise = fbm(vUV * 8.0 + vec2(uTime * 0.002, uTime * 0.003) + 2.7);
  float hiiMask = gasFrac * smoothstep(0.05, 0.30, sGas) * smoothstep(0.6, 0.2, sTotal);
  hiiMask *= smoothstep(0.4, 0.7, hiiNoise);
  vec3 hiiColor = mix(
    vec3(0.90, 0.20, 0.25),   // infra: red emission
    vec3(0.70, 0.30, 0.50),   // astral: pink-magenta
    uTheme
  );
  col += hiiColor * hiiMask * 0.5;

  // ═══════════════════════════════════════
  // PHASE 3: Data-driven star detection & twinkle
  // Sharp samples vs blurred background → real star locations
  // ═══════════════════════════════════════

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

  // Twinkle animation
  float twinkle = valueNoise(vUV * 400.0 + vec2(uTime * 3.0, uTime * 2.0));
  float twinkle2 = valueNoise(vUV * 150.0 + vec2(-uTime * 1.5, uTime * 2.5));
  twinkle = twinkle * twinkle * twinkle2;
  col *= mix(1.0, 0.3 + twinkle * 2.0, starness);

  // Star glow from actual band data
  float r_star = stretch(r_sharp, m, uQ, uAlpha) * 1.5;
  float g_star = stretch(g_sharp, m, uQ, uAlpha) * 1.5;
  float u_star = stretch(max(denorm(texture2D(uBand_u, vUV).r + dither, uRange_u), 0.0), m, uQ, uAlpha) * 1.5;
  vec3 starCol = vec3(r_star, g_star, u_star);
  starCol = mix(mix(vec3(1.0, 0.95, 0.88), vec3(0.88, 0.92, 1.0), uTheme), starCol, 0.85);
  col += starCol * starness * (twinkle * 0.5 + 0.2);

  // ═══════════════════════════════════════
  // PHASE 4: Cinematic color grading
  // ═══════════════════════════════════════

  // Lifted blacks — very subtle
  vec3 blackFloor = mix(
    vec3(0.008, 0.005, 0.015),
    vec3(0.004, 0.006, 0.018),
    uTheme
  );
  col = max(col, blackFloor);

  // Stronger S-curve for punch
  col = mix(col, col * col * (3.0 - 2.0 * col), 0.55);

  // Warm-cool split toning
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float warmW = mix(1.0, 0.25, uTheme);
  float coolW = mix(0.3, 1.0, uTheme);
  col += vec3(0.015, 0.008, -0.015) * smoothstep(0.0, 0.5, lum) * warmW;
  col += vec3(-0.008, 0.0, 0.025) * (1.0 - smoothstep(0.0, 0.3, lum)) * coolW;

  // Vignette
  float vig = 1.0 - smoothstep(0.45, 1.3, dist * 0.65);
  col *= mix(0.7, 1.0, vig);

  col = clamp(col, 0.0, 1.0);

  // Grayscale option
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), 1.0);
}
