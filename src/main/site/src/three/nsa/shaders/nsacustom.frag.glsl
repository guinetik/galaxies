precision highp float;

// ── 6 spectral band textures ──
uniform sampler2D uBand_u;
uniform sampler2D uBand_g;
uniform sampler2D uBand_r;
uniform sampler2D uBand_i;
uniform sampler2D uBand_z;
uniform sampler2D uBand_nuv;

// ── Band data ranges (min, max) for denormalization ──
uniform vec2 uRange_u;
uniform vec2 uRange_g;
uniform vec2 uRange_r;
uniform vec2 uRange_i;
uniform vec2 uRange_z;
uniform vec2 uRange_nuv;

// ── Controls (shared with Lupton shader) ──
uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uGrayscale;

// ── Theme & Animation ──
uniform float uTheme;  // 0.0 = infra (warm), 1.0 = astral (cool)
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUV;

// ── Noise ──

float hashN2(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

float valueNoise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hashN2(i), hashN2(i + vec2(1.0, 0.0)), u.x),
    mix(hashN2(i + vec2(0.0, 1.0)), hashN2(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// FBM for richer organic noise
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * valueNoise2D(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// Interleaved gradient noise — fast screen-space dither
float ign(vec2 coord) {
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(coord, magic.xy)));
}

// ── Helpers ──

float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

float denorm(float raw, vec2 range) {
  return raw * (range.y - range.x) + range.x;
}

float stretch(float val, float m) {
  return safe_asinh(uAlpha * uQ * max(val - m, 0.0)) / max(uQ, 1e-6);
}

void main() {
  vec2 pixel = vUV * uResolution;
  vec2 texel = 1.0 / uResolution;

  // ── 1. Sample all 6 bands ──
  float u_raw = texture2D(uBand_u, vUV).r;
  float g_raw = texture2D(uBand_g, vUV).r;
  float r_raw = texture2D(uBand_r, vUV).r;
  float i_raw = texture2D(uBand_i, vUV).r;
  float z_raw = texture2D(uBand_z, vUV).r;
  float n_raw = texture2D(uBand_nuv, vUV).r;

  // ── 2. Dither to break 8-bit quantization banding ──
  float dither = (ign(gl_FragCoord.xy) - 0.5) / 255.0;
  u_raw += dither;
  g_raw += dither;
  r_raw += dither;
  i_raw += dither;
  z_raw += dither;
  n_raw += dither;

  // ── 3. Denormalize to FITS data range ──
  float u_val = max(denorm(u_raw, uRange_u), 0.0);
  float g_val = max(denorm(g_raw, uRange_g), 0.0);
  float r_val = max(denorm(r_raw, uRange_r), 0.0);
  float i_val = max(denorm(i_raw, uRange_i), 0.0);
  float z_val = max(denorm(z_raw, uRange_z), 0.0);
  float n_val = max(denorm(n_raw, uRange_nuv), 0.0);

  // ── 4. Spectral layers ──
  float dust    = (z_val + i_val) * 0.5;     // dust lanes & old stars
  float stellar = (r_val + g_val) * 0.5;     // main stellar body
  float hot     = (u_val + n_val) * 0.5;     // star-forming / UV emission
  float total   = (dust + stellar + hot) / 3.0;

  // ── 5. Black-point from sensitivity ──
  float avgRange = (
    (uRange_u.y - uRange_u.x) + (uRange_g.y - uRange_g.x) +
    (uRange_r.y - uRange_r.x) + (uRange_i.y - uRange_i.x) +
    (uRange_z.y - uRange_z.x) + (uRange_nuv.y - uRange_nuv.x)
  ) / 6.0;
  float m = (1.0 - uSensitivity) * avgRange * 0.02;

  // ── 6. Asinh stretch per layer ──
  float sDust    = stretch(dust, m);
  float sStellar = stretch(stellar, m);
  float sHot     = stretch(hot, m);
  float sTotal   = stretch(total, m);

  // ── 7. Per-layer animation ──
  // Dust: flowing wisps via FBM noise
  float dustFlow = fbm(vUV * 6.0 + vec2(uTime * 0.02, uTime * 0.012));
  sDust *= dustFlow * 0.3 + 0.85;

  // Stellar: gentle shimmer
  float starShimmer = valueNoise2D(vUV * 14.0 + vec2(-uTime * 0.015, uTime * 0.01));
  sStellar *= starShimmer * 0.15 + 0.925;

  // Hot emission: pulsing waves radiating from center
  float hotPulse = sin(uTime * 1.5 + length(vUV - 0.5) * 10.0);
  sHot *= hotPulse * 0.18 + 1.0;

  // ── 8. Theme-dependent color compositing ──
  vec3 dustCol = mix(
    vec3(0.85, 0.45, 0.15),   // infra: warm amber
    vec3(0.15, 0.45, 0.90),   // astral: lupton-like blue
    uTheme
  );
  vec3 starCol = mix(
    vec3(1.0, 0.95, 0.88),    // infra: warm cream
    vec3(0.70, 0.80, 0.95),   // astral: cool blue-white (lupton match)
    uTheme
  );
  vec3 hotCol = mix(
    vec3(0.35, 0.55, 1.0),    // infra: blue-cyan
    vec3(0.35, 0.65, 0.95),   // astral: lupton-like cyan-blue
    uTheme
  );

  vec3 col = vec3(0.0);
  col += dustCol * sDust;
  col += starCol * sStellar;
  col += hotCol  * sHot;

  // ── 9. Feathered edge softening ──
  // Noise breaks up hard galaxy silhouette boundary
  float edgeNoise = fbm(vUV * 15.0 + vec2(uTime * 0.005));
  float edgeMask = smoothstep(0.0, 0.08 + edgeNoise * 0.06, sTotal);
  col *= edgeMask;

  // ── 10. Glow: 8-tap blurred i-band halo ──
  float glw = 0.0;
  // inner ring (radius ~4 texels)
  glw += texture2D(uBand_i, vUV + texel * vec2( 4.0,  0.0)).r;
  glw += texture2D(uBand_i, vUV + texel * vec2(-4.0,  0.0)).r;
  glw += texture2D(uBand_i, vUV + texel * vec2( 0.0,  4.0)).r;
  glw += texture2D(uBand_i, vUV + texel * vec2( 0.0, -4.0)).r;
  // outer ring (radius ~14 texels, half weight)
  glw += texture2D(uBand_i, vUV + texel * vec2( 10.0,  10.0)).r * 0.5;
  glw += texture2D(uBand_i, vUV + texel * vec2(-10.0,  10.0)).r * 0.5;
  glw += texture2D(uBand_i, vUV + texel * vec2( 10.0, -10.0)).r * 0.5;
  glw += texture2D(uBand_i, vUV + texel * vec2(-10.0, -10.0)).r * 0.5;
  float glowVal = max(denorm(glw / 6.0, uRange_i), 0.0);
  float sGlow = stretch(glowVal, m);
  vec3 glowCol = mix(
    vec3(0.95, 0.88, 0.75),   // infra: warm glow
    vec3(0.75, 0.85, 1.0),    // astral: bright cool glow
    uTheme
  );
  col += glowCol * sGlow * 0.6;

  // ── 11. Core breathing ──
  float pulse = sin(uTime * 0.7) * 0.10 + 1.0;
  col *= mix(1.0, pulse, smoothstep(0.1, 0.5, sTotal));

  // ── 12. Star detection & twinkle ──
  // Detect point sources: must be both bright AND stand out from local glow
  float peak = max(max(i_val, r_val), max(g_val, z_val));
  float minStarBright = avgRange * 0.05;  // minimum brightness to qualify as star
  float starness = smoothstep(
    max(glowVal * 2.0, minStarBright),
    max(glowVal * 4.0, minStarBright * 3.0),
    peak
  );

  // Animated sparkle
  float twinkle = valueNoise2D(vUV * 300.0 + vec2(uTime * 2.5, uTime * 1.8));
  twinkle = twinkle * twinkle;  // sharpen peaks for sparkle effect
  col *= mix(1.0, 0.4 + twinkle * 1.6, starness);

  // Additive sparkle glow on bright stars - use actual RGB band data for rainbow colors
  // Map SDSS bands to RGB: r→R, g→G, u→B (like traditional RGB composites)
  float star_r = stretch(r_val, m) * 1.5;
  float star_g = stretch(g_val, m) * 1.5;
  float star_b = stretch(u_val, m) * 1.5;
  vec3 sparkleCol = vec3(star_r, star_g, star_b);
  // Fallback to white if no data
  sparkleCol = mix(mix(vec3(1.0, 0.95, 0.85), vec3(0.95, 0.98, 1.0), uTheme), sparkleCol, 0.9);
  col += sparkleCol * starness * twinkle * 0.6;

  // ── 13. Cinematic color grading ──
  // Lifted blacks — theme-tinted floor
  vec3 blackFloor = mix(
    vec3(0.015, 0.010, 0.025),  // infra: warm purple
    vec3(0.008, 0.012, 0.035),  // astral: deeper blue
    uTheme
  );
  col = max(col, blackFloor);

  // S-curve contrast (Hermite smoothstep on color)
  col = col * col * (3.0 - 2.0 * col);

  // Warm-cool split (theme-weighted)
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float warmW = mix(1.0, 0.3, uTheme);
  float coolW = mix(0.5, 1.0, uTheme);
  col += vec3(0.02, 0.01, -0.02) * smoothstep(0.0, 0.5, lum) * warmW;
  col += vec3(-0.01, 0.0, 0.03) * (1.0 - smoothstep(0.0, 0.3, lum)) * coolW;

  // Soft vignette
  float vig = 1.0 - smoothstep(0.4, 1.2, length(vUV - 0.5) * 1.5);
  col *= mix(0.7, 1.0, vig);

  col = clamp(col, 0.0, 1.0);

  // Grayscale option
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), 1.0);
}
