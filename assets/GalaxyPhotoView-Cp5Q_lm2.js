import{K as z,d as _t,u as Ct,G as _e,A as Mt,L as Rt,c as M,a,k as ue,t as _,e as S,l as X,M as $e,N as St,n as Ce,f as Q,v as kt,m as We,b as ce,w as ae,T as he,F as Me,r as Re,h as j,g as w,O as Bt,P as qe,C as Dt,Q as de,E as ze,H as Pt,I as Tt,J as zt,j as At,o as C}from"./vue-vendor-BVmPiw82.js";import{u as Ft}from"./useGalaxyData-C2QhOPvi.js";import{u as Vt}from"./useSimbadLookup-CCRbtexY.js";import{B as Ge,c as G,C as Ut,V as It,W as Gt,O as Nt,P as Ot,S as Ht,D as Qt,g as Yt,h as Lt,L as Xt,i as Et,j as je,k as Ze,l as $t,M as Wt,a as Ae,A as Fe,b as Ve,m as qt,n as Ue}from"./three-CWiM2Iz1.js";import{d as jt,b as Zt,g as Jt}from"./nsaMorphologyPointCloud-Ct5fnwAD.js";import{G as oe,_ as Kt}from"./index-BzX7cb2b.js";import{f as en,a as tn}from"./coordinates-DJOk_Dvx.js";import"./sqljs-M9QnmiAb.js";function Je(c,e){const n=e>>>1;let o=0;for(let s=0;s<256;s++)if(o+=c[s],o>n)return s/255;return 1}function nt(c,e){return c<=0?0:c>=1?1:c===e?.5:(e-1)*c/((2*e-1)*c-e)}function nn(c,e){const s=Je(c,e),f=new Uint32Array(256);for(let l=0;l<256;l++){if(c[l]===0)continue;const h=Math.round(Math.abs(l/255-s)*255);f[Math.min(h,255)]+=c[l]}const m=Je(f,e),p=Math.max(0,Math.min(1,s+-2.8*1.4826*m)),y=s-p,d=y>0?nt(y,.1):.5;return{c0:p,m:d}}function an(c){const{data:e,width:n,height:o}=c,s=n*o;for(let f=0;f<3;f++){const m=new Uint32Array(256);for(let l=0;l<s;l++)m[e[l*4+f]]++;const{c0:p,m:y}=nn(m,s),d=new Uint8Array(256);for(let l=0;l<256;l++){let h=l/255;h=Math.max(0,(h-p)/(1-p)),h=nt(h,y),d[l]=Math.round(h*255)}for(let l=0;l<s;l++){const h=l*4+f;e[h]=d[e[h]]}}}const Ke=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,on=`precision highp float;

uniform sampler2D uBandR;
uniform sampler2D uBandG;
uniform sampler2D uBandB;
uniform float uBrightness;
uniform float uQ;
uniform float uStretch;
uniform float uSensitivity;
uniform vec2 uRangeR;
uniform vec2 uRangeG;
uniform vec2 uRangeB;
uniform float uGrayscale;
uniform float uTheme;

varying vec2 vUV;

// GLSL ES 1.00 does not provide asinh
float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

float ign(vec2 coord) {
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(coord, magic.xy)));
}

float denorm(float raw, vec2 range) {
  return raw * (range.y - range.x) + range.x;
}

float lupton_stretch(float intensity) {
  const float frac = 0.1;
  float q = max(uQ, 1e-6);
  float stretch = max(uStretch / max(uSensitivity, 1e-3), 1e-6);
  float slope = frac / safe_asinh(frac * q);
  return safe_asinh((q * max(intensity, 0.0)) / stretch) * slope;
}

void main() {
  float dither = (ign(gl_FragCoord.xy) - 0.5) / 255.0;

  // Sample each band (grayscale stored in .r channel)
  float r_raw = clamp(texture2D(uBandR, vUV).r + dither, 0.0, 1.0);
  float g_raw = clamp(texture2D(uBandG, vUV).r + dither, 0.0, 1.0);
  float b_raw = clamp(texture2D(uBandB, vUV).r + dither, 0.0, 1.0);

  // Denormalize back to physical units (nanomaggies). Data is already
  // sky-subtracted, so just clamp negative noise to zero.
  float r = max(denorm(r_raw, uRangeR), 0.0);
  float g = max(denorm(g_raw, uRangeG), 0.0);
  float b = max(denorm(b_raw, uRangeB), 0.0);

  // Mean intensity: I = (r + g + b) / 3  (Lupton et al. 2004, Eq. 2)
  float I = (r + g + b) / 3.0;

  // Lupton asinh stretch: f(I) = asinh(Q * I / stretch) * frac / asinh(frac * Q)
  float fI = lupton_stretch(I);

  // Color-preserving scaling (Eq. 2): R = r · f(I) / I
  float scale = I <= 0.0 ? 0.0 : fI / I;

  float R = r * scale;
  float G = g * scale;
  float B = b * scale;

  // Desaturate when max channel > 1 — preserves color, clips intensity
  // (Paper: "if max(R,G,B) > 1, set R/=max, G/=max, B/=max")
  float maxRGB = max(max(R, G), max(B, 1.0));
  R /= maxRGB;
  G /= maxRGB;
  B /= maxRGB;

  // Noise gate: suppress sky noise below signal threshold.
  // Threshold scales with data range so it adapts per galaxy.
  float rangeScale = (uRangeR.y - uRangeR.x + uRangeG.y - uRangeG.x + uRangeB.y - uRangeB.x) / 3.0;
  float noiseFloor = rangeScale * 0.003;
  float signal = smoothstep(0.0, noiseFloor, I);

  // Theme color shift: infrared (0) = true color, astral (1) = cool blue remap
  float lum = R * 0.2126 + G * 0.7152 + B * 0.0722;
  vec3 coolColor = vec3(
    lum * 0.25 + B * 0.15,
    lum * 0.35 + G * 0.25,
    lum * 0.7 + B * 0.5
  );
  vec3 trueColor = vec3(max(R, 0.0), max(G, 0.0), max(B, 0.0));

  // Mix color and grayscale (stretched intensity) output
  vec3 colorOut = mix(trueColor, coolColor, uTheme);
  vec3 grayOut = vec3(clamp(fI, 0.0, 1.0));
  float brightnessGain = max(uBrightness, 0.0) / 0.5;
  vec3 outColor = mix(colorOut, grayOut, uGrayscale) * brightnessGain * signal;
  gl_FragColor = vec4(clamp(outColor, 0.0, 1.0), 1.0);
}
`,sn=`precision highp float;

uniform sampler2D uBand_u;
uniform sampler2D uBand_g;
uniform sampler2D uBand_r;
uniform sampler2D uBand_i;
uniform sampler2D uBand_z;
uniform sampler2D uBand_nuv;

uniform float uHas_u;
uniform float uHas_g;
uniform float uHas_r;
uniform float uHas_i;
uniform float uHas_z;
uniform float uHas_nuv;

uniform float uBrightness;
uniform float uSensitivity;
uniform float uTheme;
uniform float uGrayscale;

varying vec2 vUV;

float ign(vec2 coord) {
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(coord, magic.xy)));
}

float normalize_band(float raw, float enabled) {
  if (enabled < 0.5) {
    return 0.0;
  }

  // The source band textures are already exported as linear per-band 0..1 images.
  // Composite mode intentionally keeps that raw normalization instead of applying
  // a second range-derived remap like Lupton or STF would.
  float normalized = clamp(raw, 0.0, 1.0);

  // Sensitivity acts as a linear black-point gate, not a nonlinear reveal curve.
  float floorLevel = (1.0 - clamp(uSensitivity, 0.0, 1.0)) * 0.25;
  return clamp((normalized - floorLevel) / max(1.0 - floorLevel, 1e-6), 0.0, 1.0);
}

float mean2(float a, float wa, float b, float wb) {
  float weight = wa + wb;
  return weight > 0.0 ? (a * wa + b * wb) / weight : 0.0;
}

float mean6(float a, float wa, float b, float wb, float c, float wc, float d, float wd, float e, float we, float f, float wf) {
  float weight = wa + wb + wc + wd + we + wf;
  return weight > 0.0 ? (a * wa + b * wb + c * wc + d * wd + e * we + f * wf) / weight : 0.0;
}

void main() {
  float dither = (ign(gl_FragCoord.xy) - 0.5) / 255.0;

  float uNorm = normalize_band(clamp(texture2D(uBand_u, vUV).r + dither, 0.0, 1.0), uHas_u);
  float gNorm = normalize_band(clamp(texture2D(uBand_g, vUV).r + dither, 0.0, 1.0), uHas_g);
  float rNorm = normalize_band(clamp(texture2D(uBand_r, vUV).r + dither, 0.0, 1.0), uHas_r);
  float iNorm = normalize_band(clamp(texture2D(uBand_i, vUV).r + dither, 0.0, 1.0), uHas_i);
  float zNorm = normalize_band(clamp(texture2D(uBand_z, vUV).r + dither, 0.0, 1.0), uHas_z);
  float nuvNorm = normalize_band(clamp(texture2D(uBand_nuv, vUV).r + dither, 0.0, 1.0), uHas_nuv);

  float longWave = mean2(zNorm, uHas_z, iNorm, uHas_i);
  float visible = mean2(rNorm, uHas_r, gNorm, uHas_g);
  float shortWave = mean2(uNorm, uHas_u, nuvNorm, uHas_nuv);
  float luminance = mean6(
    uNorm, uHas_u,
    gNorm, uHas_g,
    rNorm, uHas_r,
    iNorm, uHas_i,
    zNorm, uHas_z,
    nuvNorm, uHas_nuv
  );

  vec3 infra = vec3(longWave, visible, shortWave);
  vec3 astral = vec3(
    luminance * 0.25 + shortWave * 0.15,
    luminance * 0.35 + visible * 0.25,
    luminance * 0.70 + shortWave * 0.50
  );

  vec3 themed = mix(infra, astral, clamp(uTheme, 0.0, 1.0));
  vec3 grayscale = vec3(luminance);
  vec3 outColor = mix(themed, grayscale, clamp(uGrayscale, 0.0, 1.0)) * max(uBrightness, 0.0);

  gl_FragColor = vec4(clamp(outColor, 0.0, 1.0), 1.0);
}
`,rn=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ln=`precision highp float;

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
`,un=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,cn=`precision highp float;

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

  // Normalize so that contrast slider changes curve shape, not overall brightness
  float stretchRef = stretch(avgRange * 0.3, m, uQ, uAlpha);
  float normF = 1.0 / max(stretchRef, 0.01);
  sTotal *= normF;
  sDust  *= normF;
  sStar  *= normF;
  sGas   *= normF;
  sTotalSmooth *= normF;

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
    vec3(0.35, 0.40, 0.70),   // astral: cool slate blue
    uTheme
  );
  vec3 starCol_base = mix(
    vec3(0.95, 0.88, 0.65),   // infra: golden white
    vec3(0.75, 0.80, 1.0),    // astral: blue-white
    uTheme
  );
  vec3 gasCol = mix(
    vec3(0.30, 0.15, 0.60),   // infra: deep violet
    vec3(0.35, 0.50, 0.90),   // astral: vivid blue
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
  // Data drives shape, noise adds wispy edges — hard gate on data presence
  float dataPresence4 = smoothstep(0.02, 0.20, sTotalSmooth);
  float mask4 = dataPresence4 * smoothstep(1.2, 0.3, dist);
  float smoke4 = n4 * 0.3 + 0.7;
  vec3 tint4 = mix(
    vec3(0.10, 0.05, 0.18),   // infra: deep wine
    vec3(0.04, 0.06, 0.16),   // astral: deep navy-indigo
    uTheme
  );
  col += tint4 * mask4 * smoke4 * 0.5;

  // ── Layer 3: mid nebula — spectral color clouds following data ──
  vec2 uv3 = rot2(pc, uTime * 0.03) + center;
  float n3 = fbm(uv3 * 4.0 + vec2(-uTime * 0.005, uTime * 0.004));
  // Noise only warps edges, data is primary shape — gate on actual data
  float d3 = sTotal * (0.85 + n3 * 0.15);
  float mask3 = smoothstep(0.05, 0.30, d3);
  float smoke3 = n3 * 0.3 + 0.7;
  col += dataColor * mask3 * smoke3 * 0.7;

  // ── Dark absorption lanes — stronger, data-aware ──
  vec2 uvDark = rot2(pc, uTime * 0.025) + center;
  float darkNoise = fbm(uvDark * 5.0 + vec2(uTime * 0.003, -uTime * 0.002));
  // Lanes are stronger where there IS data (mid-brightness regions)
  float darkMask = smoothstep(0.08, 0.35, sTotal) * (1.0 - smoothstep(0.5, 0.8, sTotal));
  float darkAmount = smoothstep(0.35, 0.65, darkNoise) * darkMask * 0.35;
  col *= 1.0 - darkAmount;

  // ── Layer 2: inner body — brighter, more saturated ──
  vec2 uv2 = rot2(pc, uTime * 0.05) + center;
  float n2 = fbm(uv2 * 6.0 + vec2(uTime * 0.007, -uTime * 0.005));
  float d2 = sTotal * (0.9 + n2 * 0.1);
  float mask2 = smoothstep(0.10, 0.45, d2);
  float smoke2 = n2 * 0.15 + 0.85;
  // Shift toward brighter tones for inner regions
  vec3 innerColor = mix(dataColor, mix(
    vec3(0.95, 0.80, 0.50),   // infra: warm gold
    vec3(0.80, 0.85, 1.0),    // astral: bright blue-white
    uTheme
  ), 0.4);
  col += innerColor * mask2 * smoke2 * 0.6;

  // ── Layer 1: core — blazing bright (replaces, not adds) ──
  float n1 = fbm(rot2(pc, uTime * 0.07) * 3.0 + center + vec2(uTime * 0.004));
  // Core driven purely by data brightness
  float coreMask = smoothstep(0.15, 0.50, sTotal) * smoothstep(0.9, 0.10, dist);
  vec3 coreColor = mix(
    vec3(1.0, 0.92, 0.75),    // infra: warm white
    vec3(0.88, 0.92, 1.0),    // astral: cool bright white
    uTheme
  );
  // Slight spectral tint
  coreColor = mix(coreColor, dataColor * 1.5, 0.15);
  float pulse = sin(uTime * 0.4) * 0.04 + 1.0;
  col = mix(col, coreColor * pulse * 1.1, coreMask * (n1 * 0.1 + 0.9));

  // ── HII regions: red/pink emission in gas-rich areas ──
  float hiiNoise = fbm(vUV * 8.0 + vec2(uTime * 0.002, uTime * 0.003) + 2.7);
  float hiiMask = gasFrac * smoothstep(0.03, 0.20, sGas) * smoothstep(0.7, 0.15, sTotal);
  hiiMask *= smoothstep(0.35, 0.65, hiiNoise);
  vec3 hiiColor = mix(
    vec3(0.95, 0.25, 0.20),   // infra: bright red emission
    vec3(0.95, 0.30, 0.35),   // astral: vivid red-pink
    uTheme
  );
  col += hiiColor * hiiMask * 0.8;

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

  // Star glow from actual band data — rainbow colors
  float r_star = stretch(r_sharp, m, uQ, uAlpha) * 2.0;
  float g_star = stretch(g_sharp, m, uQ, uAlpha) * 2.0;
  float u_star = stretch(max(denorm(texture2D(uBand_u, vUV).r + dither, uRange_u), 0.0), m, uQ, uAlpha) * 2.0;
  vec3 starCol = vec3(r_star, g_star, u_star);
  starCol = mix(mix(vec3(1.0, 0.95, 0.88), vec3(0.88, 0.92, 1.0), uTheme), starCol, 0.85);
  col += starCol * starness * (twinkle * 0.6 + 0.3);

  // ═══════════════════════════════════════
  // PHASE 4: Cinematic color grading
  // ═══════════════════════════════════════

  // Lifted blacks — very subtle dark navy
  vec3 blackFloor = mix(
    vec3(0.006, 0.004, 0.012),
    vec3(0.003, 0.003, 0.010),
    uTheme
  );
  col = max(col, blackFloor);

  // Gentle S-curve — preserve brightness, add contrast
  col = mix(col, col * col * (3.0 - 2.0 * col), 0.3);

  // Warm-cool split toning
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float warmW = mix(1.0, 0.2, uTheme);
  float coolW = mix(0.3, 0.8, uTheme);
  col += vec3(0.015, 0.008, -0.01) * smoothstep(0.0, 0.5, lum) * warmW;
  col += vec3(-0.008, 0.0, 0.02) * (1.0 - smoothstep(0.0, 0.3, lum)) * coolW;

  // Subtle vignette
  float vig = 1.0 - smoothstep(0.5, 1.4, dist * 0.6);
  col *= mix(0.8, 1.0, vig);

  col = clamp(col, 0.0, 1.0);

  // Grayscale option
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), 1.0);
}
`,hn=`precision highp float;

attribute vec3 aPosition;
attribute float aSize;
attribute float aIntensity;
attribute vec3 color;

uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uTime;
uniform float uPixelRatio;

varying vec3 vColor;
varying float vIntensity;
varying float vDepth;

void main() {
  // Flatten Z for thin disk appearance (galaxy viewed from above)
  // depthScale is ~0.35 from CPU side; multiplying by 0.15 gives a very thin disk
  vec3 diskPos = aPosition;
  diskPos.z *= 0.15;

  vec4 mvPosition = modelViewMatrix * vec4(diskPos, 1.0);
  float depth = max(-mvPosition.z, 0.001);

  // Large overlapping points create smooth continuous appearance
  // Intensity drives size: bright regions are larger, dim regions smaller
  float sensitivityBoost = mix(0.6, 1.5, uSensitivity);
  float contrastBoost = 0.6 + log2(1.0 + uQ) * 0.25;
  float size = aSize * (0.7 + uAlpha * 0.8) * contrastBoost * sensitivityBoost;

  // Points need to be large enough to overlap for smooth look
  gl_PointSize = max(size * uPixelRatio * (3.0 / depth), 2.0);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
  vIntensity = aIntensity;
  vDepth = depth;
}
`,dn=`precision highp float;

uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uTheme;
uniform float uGrayscale;

varying vec3 vColor;
varying float vIntensity;
varying float vDepth;

float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

// ── Nebula color from intensity layer ──
// Ported from morphology shader — uses intensity as depth proxy
// (bright points = core, dim points = outer structure)

vec3 nebulaWarm(float depth, float stretch) {
  vec3 deep   = vec3(0.12, 0.04, 0.18);  // dark violet dust
  vec3 back   = vec3(0.55, 0.08, 0.12);  // deep crimson
  vec3 mid    = vec3(0.90, 0.35, 0.08);  // ember orange
  vec3 front  = vec3(1.00, 0.75, 0.30);  // warm gold
  vec3 bright = vec3(1.00, 0.55, 0.35);  // bright coral-orange
  vec3 core   = vec3(1.00, 0.85, 0.65);  // warm peach

  vec3 c;
  if (depth < 0.2) {
    c = mix(deep, back, depth / 0.2);
  } else if (depth < 0.4) {
    c = mix(back, mid, (depth - 0.2) / 0.2);
  } else if (depth < 0.6) {
    c = mix(mid, front, (depth - 0.4) / 0.2);
  } else if (depth < 0.8) {
    c = mix(front, bright, (depth - 0.6) / 0.2);
  } else {
    c = mix(bright, core, (depth - 0.8) / 0.2);
  }

  return c;
}

vec3 nebulaCool(float depth, float stretch) {
  vec3 deep   = vec3(0.03, 0.06, 0.18);  // void blue-black
  vec3 back   = vec3(0.08, 0.18, 0.45);  // deep sapphire
  vec3 mid    = vec3(0.45, 0.10, 0.55);  // rich magenta-violet
  vec3 front  = vec3(0.15, 0.50, 0.55);  // teal emission
  vec3 bright = vec3(0.55, 0.35, 0.90);  // bright electric violet
  vec3 core   = vec3(0.75, 0.65, 0.95);  // pale violet

  vec3 c;
  if (depth < 0.2) {
    c = mix(deep, back, depth / 0.2);
  } else if (depth < 0.4) {
    c = mix(back, mid, (depth - 0.2) / 0.2);
  } else if (depth < 0.6) {
    c = mix(mid, front, (depth - 0.4) / 0.2);
  } else if (depth < 0.8) {
    c = mix(front, bright, (depth - 0.6) / 0.2);
  } else {
    c = mix(bright, core, (depth - 0.8) / 0.2);
  }

  return c;
}

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float r = length(p);
  if (r > 0.5) {
    discard;
  }

  // Soft gaussian falloff — large overlap creates smooth continuous appearance
  float gauss = exp(-r * r * 6.0);

  // Lupton-style asinh stretch for proper dynamic range
  float boosted = pow(vIntensity, 0.5) * (0.3 + uAlpha * 0.4);
  float stretch = safe_asinh(boosted * (1.0 + uQ * 0.08)) / max(1.0 + uQ * 0.08, 1.0);
  stretch = max(stretch, 0.04);

  float sensitivityBoost = mix(0.5, 1.3, uSensitivity);

  // ── Depth-layered nebula colors ──
  // Use sqrt(intensity) as depth proxy: maps [0,1] intensity to palette stops
  // sqrt compresses brights so mid-tones get more color range
  float depthProxy = sqrt(vIntensity);

  vec3 warm = nebulaWarm(depthProxy, stretch);
  vec3 cool = nebulaCool(depthProxy, stretch);
  vec3 nebula = mix(warm, cool, uTheme);

  // Blend spectral band data for real color variance
  vec3 spectralInfluence = vColor * 0.7 + 0.3;
  nebula *= mix(vec3(1.0), spectralInfluence, 0.4);

  // Brightness
  float brightness = (0.3 + stretch * 1.4) * sensitivityBoost;
  vec3 col = nebula * brightness * gauss;

  // Core glow: tinted by the nebula color, not flat white
  vec3 coreHue = nebula * 0.6 + 0.4;
  float coreBrightness = pow(gauss, 3.0) * stretch * 0.25;
  col += coreHue * coreBrightness;

  col = clamp(col, 0.0, 1.0);

  // Alpha: gaussian falloff with intensity gating
  float alpha = gauss * stretch * sensitivityBoost * 1.5;
  alpha = clamp(alpha, 0.0, 1.0);

  // Gentle noise gate: only suppress true background noise
  float signal = smoothstep(0.01, 0.05, vIntensity);
  alpha *= signal;

  // Grayscale support
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), alpha);
}
`,at=`precision highp float;

attribute vec3 aPosition;
attribute float aSize;
attribute float aIntensity;
attribute float aFilamentarity;
attribute vec3 color;

uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uTime;
uniform float uPixelRatio;

varying vec3 vColor;
varying float vIntensity;
varying float vCameraDepth;
varying float vFilamentarity;
varying float vMorphDepth;

void main() {
  // Flatten Z for disk appearance — enough depth to separate layers on rotation
  vec3 displaced = aPosition;
  displaced.z *= 0.45;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  float camDepth = max(-mvPosition.z, 0.001);
  float contrastBoost = 0.6 + log2(1.0 + uQ) * 0.25;
  float sensitivityBoost = mix(0.6, 1.5, uSensitivity);
  float size = aSize * (0.7 + uAlpha * 0.8) * contrastBoost * sensitivityBoost;

  // Filamentary points slightly smaller, round/core slightly larger
  size *= mix(1.1, 0.85, aFilamentarity);

  gl_PointSize = max(size * uPixelRatio * (2.2 / camDepth), 1.5);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
  vIntensity = aIntensity;
  vCameraDepth = camDepth;
  vFilamentarity = aFilamentarity;
  // Color-driving depth: use intensity, not random z-position.
  // Intensity correlates with galaxy structure (core=bright, arms=dim)
  // so colors naturally reveal the silhouette.
  // The random z still drives physical parallax during rotation.
  vMorphDepth = sqrt(aIntensity);
}
`,ot=`precision highp float;

uniform float uTheme;
uniform float uGrayscale;
uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;

varying vec3 vColor;
varying float vIntensity;
varying float vCameraDepth;
varying float vFilamentarity;
varying float vMorphDepth;

float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

// ── Two-axis color: depth layer × structural shape ──
// Depth (vMorphDepth) separates z-layers during rotation.
// Filamentarity separates arms (high F, cool/teal) from core (low F, warm/magenta).
// Together they create enough color contrast that the galaxy silhouette
// reveals itself through parallax as the camera orbits.

// Round/isotropic structures (F≈0): warm core hues
vec3 coreWarm(float depth) {
  vec3 deep  = vec3(0.20, 0.04, 0.12);  // dark burgundy
  vec3 mid   = vec3(0.85, 0.20, 0.35);  // hot rose
  vec3 front = vec3(1.00, 0.65, 0.40);  // peach-gold
  vec3 peak  = vec3(1.00, 0.80, 0.55);  // warm cream

  vec3 c;
  if (depth < 0.33) {
    c = mix(deep, mid, depth / 0.33);
  } else if (depth < 0.66) {
    c = mix(mid, front, (depth - 0.33) / 0.33);
  } else {
    c = mix(front, peak, (depth - 0.66) / 0.34);
  }
  return c;
}

vec3 coreCool(float depth) {
  vec3 deep  = vec3(0.08, 0.04, 0.20);  // dark indigo
  vec3 mid   = vec3(0.50, 0.15, 0.65);  // electric violet
  vec3 front = vec3(0.70, 0.45, 0.85);  // bright lavender
  vec3 peak  = vec3(0.80, 0.65, 0.95);  // pale orchid

  vec3 c;
  if (depth < 0.33) {
    c = mix(deep, mid, depth / 0.33);
  } else if (depth < 0.66) {
    c = mix(mid, front, (depth - 0.33) / 0.33);
  } else {
    c = mix(front, peak, (depth - 0.66) / 0.34);
  }
  return c;
}

// Filamentary structures (F≈1): cool arm hues — distinctly different from core
vec3 armWarm(float depth) {
  vec3 deep  = vec3(0.05, 0.08, 0.15);  // dark steel-blue
  vec3 mid   = vec3(0.15, 0.30, 0.45);  // dusty blue
  vec3 front = vec3(0.30, 0.55, 0.50);  // muted teal
  vec3 peak  = vec3(0.50, 0.70, 0.55);  // sage green

  vec3 c;
  if (depth < 0.33) {
    c = mix(deep, mid, depth / 0.33);
  } else if (depth < 0.66) {
    c = mix(mid, front, (depth - 0.33) / 0.33);
  } else {
    c = mix(front, peak, (depth - 0.66) / 0.34);
  }
  return c;
}

vec3 armCool(float depth) {
  vec3 deep  = vec3(0.02, 0.06, 0.18);  // void navy
  vec3 mid   = vec3(0.05, 0.25, 0.50);  // ocean blue
  vec3 front = vec3(0.10, 0.50, 0.60);  // bright teal
  vec3 peak  = vec3(0.25, 0.65, 0.55);  // cyan-green

  vec3 c;
  if (depth < 0.33) {
    c = mix(deep, mid, depth / 0.33);
  } else if (depth < 0.66) {
    c = mix(mid, front, (depth - 0.33) / 0.33);
  } else {
    c = mix(front, peak, (depth - 0.66) / 0.34);
  }
  return c;
}

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float r = length(p);
  if (r > 0.5) {
    discard;
  }

  // Soft organic point shape
  float disc = 1.0 - smoothstep(0.15, 0.5, r);
  float halo = exp(-r * r * 8.0);

  // Intensity stretch — exponential saturation prevents additive blowout
  float compressed = 1.0 - exp(-vIntensity * 2.5);
  float boosted = compressed * (0.2 + uAlpha * 0.3);
  float stretch = safe_asinh(boosted * (1.0 + uQ * 0.08)) / max(1.0 + uQ * 0.08, 1.0);
  stretch = max(stretch, 0.06);

  float sensitivityBoost = mix(0.5, 1.2, uSensitivity);
  float camFade = 1.0 / (1.0 + vCameraDepth * 0.12);

  // ── Two-axis nebula color: shape × depth ──
  // Galaxy images produce mostly F≈0-0.3 (smooth gradients).
  // Low threshold so even moderate anisotropy shifts toward arm palette.
  float F = smoothstep(0.05, 0.30, vFilamentarity);

  // Core palette (round structures, F≈0)
  vec3 coreC = mix(coreWarm(vMorphDepth), coreCool(vMorphDepth), uTheme);
  // Arm palette (filamentary structures, F≈1)
  vec3 armC = mix(armWarm(vMorphDepth), armCool(vMorphDepth), uTheme);
  // Blend by structural shape
  vec3 nebula = mix(coreC, armC, F);

  // Blend spectral band data for real per-pixel color variance
  vec3 spectralInfluence = vColor * 0.7 + 0.3;
  nebula *= mix(vec3(1.0), spectralInfluence, 0.35);

  // Brightness
  float brightness = (0.3 + stretch * 1.4) * sensitivityBoost * camFade;
  vec3 col = nebula * brightness * halo;

  // Core glow: tinted by nebula color, not flat white
  vec3 coreHue = nebula * 0.6 + 0.4;
  float coreGlow = pow(disc, 3.0) * stretch * mix(0.18, 0.05, vFilamentarity);
  col += coreHue * coreGlow;

  col = clamp(col, 0.0, 1.0);

  // Alpha: filamentary points slightly more transparent
  float filamAlphaScale = mix(1.0, 0.65, vFilamentarity);
  float alpha = clamp(
    (halo * 0.85 + disc * 0.5) * stretch * sensitivityBoost * camFade * 2.5 * filamAlphaScale,
    0.0, 1.0
  );

  // Noise gate: suppress true background noise
  float signal = smoothstep(0.01, 0.05, vIntensity);
  alpha *= signal;

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), alpha);
}
`;function ve(c){return c==="nsa3d"||c==="nsamorphology"?"orbit":"image-plane"}function vn(c,e,n){return{yaw:c.yaw-e*.008,pitch:c.pitch+n*.006}}function mn(c,e,n){return{sampleStep:Math.max(1,Math.ceil(Math.max(c,e)/500)),intensityThreshold:.003,depthScale:.35,sizeRange:[1.5,8.5],seed:n}}function pn(c,e){const n=[],o=Math.max(1,Math.floor(e.sampleStep)),[s,f]=e.sizeRange,m=Math.max(1,c.width-1),p=Math.max(1,c.height-1);for(let y=0;y<c.height;y+=o)for(let d=0;d<c.width;d+=o){const l=y*c.width+d,h=Math.sqrt(Y(c.bands.u[l]??0)),g=Math.sqrt(Y(c.bands.g[l]??0)),x=Math.sqrt(Y(c.bands.r[l]??0)),R=Math.sqrt(Y(c.bands.i[l]??0)),b=Math.sqrt(Y(c.bands.z[l]??0)),k=Math.sqrt(Y(c.bands.nuv[l]??0)),A=(R+b)*.5,v=(g+x)*.5,D=(h+k)*.5,P=A*.25+v*.4+D*.35;if(P<e.intensityThreshold)continue;const B=D-A,F=(et(d,y,e.seed)-.5)*2,E=(et(d+137,y+251,e.seed)-.5)*2,Z=(F*.7+E*.3+B*.25)*e.depthScale,V=c.width===1?0:d/m-.5,J=c.height===1?0:.5-y/p,N=gn(s,f,Y(P)),$=fn(h,g,x,R,b,k);n.push({x:V,y:J,z:Z,color:$,size:N,intensity:P})}return{points:n}}function fn(c,e,n,o,s,f){const m=c+e+n+o+s+f+.001,p=f/m,y=c/m,d=e/m,l=n/m,h=o/m,g=s/m,x=Y(p*.45+y*.15+d*.1+l*1+h*.9+g*.7),R=Y(p*.15+y*.2+d*.95+l*.4+h*.12+g*.05),b=Y(p*1+y*.95+d*.5+l*.08+h*.1+g*.15);return[x,R,b]}function et(c,e,n){const o=Math.sin(c*127.1+e*311.7+n*74.7)*43758.5453123;return o-Math.floor(o)}function Y(c){return Math.max(0,Math.min(1,c))}function gn(c,e,n){return c+(e-c)*n}const yn=c=>Math.pow(c,.5);function xn(c,e,n,o){const{layerCount:s,zDepthScale:f,opacityCurve:m=yn}=o,p=[],y=255/s/2;let d=!1;for(let l=0;l<c.length;l+=4)if(c[l]>0){d=!0;break}for(let l=0;l<s;l++){const h=l/(s-1),g=Math.round(h*255),x=[];for(let R=0;R<n;R++)for(let b=0;b<e;b++){const k=(R*e+b)*4,A=c[k];if(Math.abs(A-g)<=y){const v=b/e*2-1,D=R/n*2-1,P=-(h*f);x.push(v,D,P)}}if(x.length>0||!d){const R=new Ge;R.setAttribute("position",new G(new Float32Array(x),3));const b=m(h);p.push({brightness:h,opacity:b,geometry:R,zDepth:-h*f})}}return p}function tt(c){if(c.length===0)return .001;const e=c.reduce((n,o)=>{const s=Array.isArray(o)?o[0]:o.x,f=Array.isArray(o)?o[1]:o.y;return n+Math.max(f-s,0)},0);return Math.max(e/c.length*.02,.001)}function Se(c,e){return e==="nsa3d"?{Q:5,alpha:.5,sensitivity:1}:e==="nsamorphology"?{Q:5,alpha:.503,sensitivity:1}:e==="composite"?{Q:1,alpha:1,sensitivity:1}:{Q:e==="custom"?20:10,alpha:.5,sensitivity:1}}const Ie={lupton:{vert:Ke,frag:on},composite:{vert:Ke,frag:sn},custom:{vert:rn,frag:ln},volumetric:{vert:un,frag:cn},nsamorphology:{vert:at,frag:ot}};class bn{constructor(e){this.planeMaterial=null,this.pointMaterial=null,this.morphMaterial=null,this.mesh=null,this.pointCloud=null,this.morphCloud=null,this.densityMeshes=[],this.densityMaterials=[],this.textures=[],this.animationId=null,this.bandData={},this.currentTheme="astral",this.currentShader="lupton",this.width=1,this.height=1,this.clock=new Ut,this.autoParams={Q:10,alpha:.5,sensitivity:1},this.targetZoom=1,this.targetX=0,this.targetY=0,this.velX=0,this.velY=0,this.lerpSpeed=.15,this.friction=.92,this.velThreshold=1e-4,this.orbitYaw=0,this.orbitPitch=0,this.orbitRadius=2.5,this.targetOrbitYaw=0,this.targetOrbitPitch=0,this.targetOrbitRadius=2.5,this.minOrbitRadius=1.1,this.maxOrbitRadius=5,this.orbitLerpSpeed=.12,this.orbitTarget=z(new It(0,0,0)),this.renderer=z(new Gt({canvas:e,antialias:!1,alpha:!1})),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.orthographicCamera=z(new Nt(-1,1,1,-1,0,100)),this.orthographicCamera.position.z=10,this.perspectiveCamera=z(new Ot(48,1,.01,100)),this.perspectiveCamera.position.set(0,0,2.5),this.activeCamera=this.orthographicCamera,this.scene=z(new Ht)}async load(e,n){var h,g;const o=`${oe}/${e}/`,s=["i","r","g"];n.bands.includes("u")&&s.push("u"),n.bands.includes("z")&&s.push("z"),n.bands.includes("nuv")&&s.push("nuv");const f=await Promise.all(s.map(async x=>{const b=await(await fetch(`${o}${x}.png`)).arrayBuffer(),k=jt(new Uint8Array(b)),A=k.depth===16?65535:255,v=new Float32Array(k.width*k.height),D=k.data,P=k.channels;for(let F=0;F<v.length;F++)v[F]=D[F*P]/A;const B=z(new Qt(v,k.width,k.height,Yt,Lt));return B.generateMipmaps=!0,B.minFilter=Xt,B.magFilter=Et,B.wrapS=je,B.wrapT=je,B.needsUpdate=!0,{tex:B,floats:v,width:k.width,height:k.height}}));s.forEach((x,R)=>{const{tex:b,floats:k,width:A,height:v}=f[R];this.textures.push(b),this.bandData[x]={tex:b,range:new Ze(n.data_ranges[x][0],n.data_ranges[x][1]),raw:k,width:A,height:v}});const m=this.bandData.g?this.bandData.g.range.y-this.bandData.g.range.x:1;for(const x of["u","z","nuv"]){const R=this.bandData[x];if(!R)continue;const b=R.range.y-R.range.x;b<m*.01&&(console.warn(`[NSA] Discarding ${x}-band: dynamic range ${b.toFixed(4)} too narrow (g-band: ${m.toFixed(4)})`),delete this.bandData[x])}const p=((h=this.renderer.domElement.parentElement)==null?void 0:h.clientWidth)||window.innerWidth,y=((g=this.renderer.domElement.parentElement)==null?void 0:g.clientHeight)||window.innerHeight*.6,d=this.bandData;this.planeMaterial=z(this.createPlaneMaterial(d,p,y)),this.pointMaterial=z(this.createPointMaterial()),this.morphMaterial=z(this.createMorphMaterial());const l=z(new $t(2,2));this.mesh=z(new Wt(l,this.planeMaterial)),this.scene.add(this.mesh),this.pointCloud=z(this.createPointCloudObject(e)),this.pointCloud.visible=!1,this.scene.add(this.pointCloud),this.morphCloud=z(this.createMorphCloudObject(e)),this.morphCloud.visible=!1,this.scene.add(this.morphCloud),this.resize(p,y),this.applyCurrentShaderMode(),this.setTheme(this.currentTheme),this.autoParams=Se(n,this.currentShader),this.startAnimation()}createPlaneMaterial(e,n,o){var f,m,p,y,d,l,h,g;const s=[e.i.range,e.r.range,e.g.range];return new Ae({uniforms:{uBandR:{value:e.i.tex},uBandG:{value:e.r.tex},uBandB:{value:e.g.tex},uAlpha:{value:.014},uBrightness:{value:.5},uQ:{value:20},uStretch:{value:tt(s)},uSensitivity:{value:.88},uRangeR:{value:e.i.range},uRangeG:{value:e.r.range},uRangeB:{value:e.g.range},uGrayscale:{value:0},uTheme:{value:1},uBand_u:{value:((f=e.u)==null?void 0:f.tex)??e.g.tex},uBand_g:{value:e.g.tex},uBand_r:{value:e.r.tex},uBand_i:{value:e.i.tex},uBand_z:{value:((m=e.z)==null?void 0:m.tex)??e.i.tex},uBand_nuv:{value:((p=e.nuv)==null?void 0:p.tex)??((y=e.u)==null?void 0:y.tex)??e.g.tex},uRange_u:{value:((d=e.u)==null?void 0:d.range)??e.g.range},uRange_g:{value:e.g.range},uRange_r:{value:e.r.range},uRange_i:{value:e.i.range},uRange_z:{value:((l=e.z)==null?void 0:l.range)??e.i.range},uRange_nuv:{value:((h=e.nuv)==null?void 0:h.range)??((g=e.u)==null?void 0:g.range)??e.g.range},uHas_u:{value:e.u?1:0},uHas_g:{value:e.g?1:0},uHas_r:{value:e.r?1:0},uHas_i:{value:e.i?1:0},uHas_z:{value:e.z?1:0},uHas_nuv:{value:e.nuv?1:0},uTime:{value:0},uResolution:{value:new Ze(n*this.renderer.getPixelRatio(),o*this.renderer.getPixelRatio())}},vertexShader:Ie.lupton.vert,fragmentShader:Ie.lupton.frag})}createPointMaterial(){return new Ae({uniforms:{uAlpha:{value:1},uQ:{value:20},uSensitivity:{value:1},uTheme:{value:1},uGrayscale:{value:0},uTime:{value:0},uPixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:hn,fragmentShader:dn,transparent:!0,depthWrite:!1,blending:Fe})}createMorphMaterial(){return new Ae({uniforms:{uAlpha:{value:1},uQ:{value:20},uSensitivity:{value:1},uTheme:{value:1},uGrayscale:{value:0},uTime:{value:0},uPixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:at,fragmentShader:ot,transparent:!0,depthWrite:!1,blending:Fe})}createPointCloudObject(e){const n=this.extractPointCloudBands(),o=pn(n,mn(n.width,n.height,e)),s=o.points.length,f=new Float32Array(s*3),m=new Float32Array(s*3),p=new Float32Array(s),y=new Float32Array(s);let d=1;for(let h=0;h<s;h+=1){const g=o.points[h];f[h*3]=g.x,f[h*3+1]=g.y,f[h*3+2]=g.z,m[h*3]=g.color[0],m[h*3+1]=g.color[1],m[h*3+2]=g.color[2],p[h]=g.size,y[h]=g.intensity,d=Math.max(d,Math.sqrt(g.x*g.x+g.y*g.y+g.z*g.z))}const l=z(new Ge);return l.setAttribute("position",new G(f,3)),l.setAttribute("aPosition",new G(f,3)),l.setAttribute("color",new G(m,3)),l.setAttribute("aSize",new G(p,1)),l.setAttribute("aIntensity",new G(y,1)),l.computeBoundingSphere(),this.minOrbitRadius=Math.max(.15,d*.2),this.maxOrbitRadius=Math.max(4.5,d*5),this.orbitRadius=Math.max(this.minOrbitRadius*1.4,d*1.3),this.targetOrbitRadius=this.orbitRadius,this.perspectiveCamera.near=.01,this.perspectiveCamera.far=this.maxOrbitRadius*4,this.perspectiveCamera.updateProjectionMatrix(),new Ve(l,this.pointMaterial??void 0)}createMorphCloudObject(e){const n=this.extractPointCloudBands(),o=Zt(n,Jt(n.width,n.height,e)),s=o.points.length,f=new Float32Array(s*3),m=new Float32Array(s*3),p=new Float32Array(s),y=new Float32Array(s),d=new Float32Array(s);for(let h=0;h<s;h+=1){const g=o.points[h];f[h*3]=g.x,f[h*3+1]=g.y,f[h*3+2]=g.z,m[h*3]=g.color[0],m[h*3+1]=g.color[1],m[h*3+2]=g.color[2],p[h]=g.size,y[h]=g.intensity,d[h]=g.filamentarity}const l=z(new Ge);return l.setAttribute("position",new G(f,3)),l.setAttribute("aPosition",new G(f,3)),l.setAttribute("color",new G(m,3)),l.setAttribute("aSize",new G(p,1)),l.setAttribute("aIntensity",new G(y,1)),l.setAttribute("aFilamentarity",new G(d,1)),l.computeBoundingSphere(),new Ve(l,this.morphMaterial??void 0)}extractPointCloudBands(){const e=s=>this.bandData[s]?s:s==="u"?"g":s==="z"?"i":this.bandData.u?"u":"g",{width:n,height:o}=this.bandData.i;return{width:n,height:o,bands:{u:this.extractSingleBand(e("u")),g:this.extractSingleBand(e("g")),r:this.extractSingleBand(e("r")),i:this.extractSingleBand(e("i")),z:this.extractSingleBand(e("z")),nuv:this.extractSingleBand(e("nuv"))}}}extractSingleBand(e){const n=this.bandData[e],o=n.raw,s=n.range,f=s.x,m=s.y-s.x,p=new Float32Array(o.length);for(let d=0;d<o.length;d++){const l=o[d]*m+f;p[d]=Math.max(l,0)}let y=0;for(let d=0;d<p.length;d++)p[d]>y&&(y=p[d]);if(y>0)for(let d=0;d<p.length;d++)p[d]/=y;return p}extractImageData(e){const n=this.bandData[e],o=n.raw,s=n.width,f=n.height,m=new Uint8ClampedArray(o.length*4);for(let p=0;p<o.length;p++){const y=Math.round(o[p]*255);m[p*4]=y,m[p*4+1]=y,m[p*4+2]=y,m[p*4+3]=255}return{data:m,width:s,height:f}}createDensityMeshes(){this.disposeDensityMeshes();const{data:e,width:n,height:o}=this.extractImageData("i");xn(e,n,o,{layerCount:15,zDepthScale:1}).forEach(m=>{const p=z(new qt({color:16777215,size:.015,opacity:m.opacity,transparent:!0,depthWrite:!1,blending:Fe,sizeAttenuation:!0})),y=z(new Ve(m.geometry,p));y.position.z=m.zDepth,this.scene.add(y),this.densityMeshes.push(y),this.densityMaterials.push(p)})}disposeDensityMeshes(){for(const e of this.densityMeshes)this.scene.remove(e),e.geometry&&e.geometry.dispose();for(const e of this.densityMaterials)e.dispose();this.densityMeshes=[],this.densityMaterials=[]}applyCurrentShaderMode(){const n=ve(this.currentShader)==="orbit";if(this.activeCamera=n?this.perspectiveCamera:this.orthographicCamera,this.mesh&&(this.mesh.visible=!n),this.pointCloud&&(this.pointCloud.visible=this.currentShader==="nsa3d"),this.morphCloud&&(this.morphCloud.visible=this.currentShader==="nsamorphology"),!n&&this.planeMaterial){const o=Ie[this.currentShader];this.planeMaterial.vertexShader=o.vert,this.planeMaterial.fragmentShader=o.frag,this.planeMaterial.needsUpdate=!0}}startAnimation(){const e=()=>{const n=this.clock.getElapsedTime();if(this.planeMaterial&&(this.planeMaterial.uniforms.uTime.value=n),this.pointMaterial&&(this.pointMaterial.uniforms.uTime.value=n),this.morphMaterial&&(this.morphMaterial.uniforms.uTime.value=n),ve(this.currentShader)==="image-plane"){Math.abs(this.velX)>this.velThreshold||Math.abs(this.velY)>this.velThreshold?(this.targetX+=this.velX,this.targetY+=this.velY,this.velX*=this.friction,this.velY*=this.friction):(this.velX=0,this.velY=0);const o=Math.max(0,1-1/this.targetZoom);this.targetX=Math.max(-o,Math.min(o,this.targetX)),this.targetY=Math.max(-o,Math.min(o,this.targetY));const s=this.lerpSpeed;this.orthographicCamera.zoom+=(this.targetZoom-this.orthographicCamera.zoom)*s,this.orthographicCamera.position.x+=(this.targetX-this.orthographicCamera.position.x)*s,this.orthographicCamera.position.y+=(this.targetY-this.orthographicCamera.position.y)*s,this.orthographicCamera.updateProjectionMatrix()}else this.updateOrbitCamera();this.render(),this.animationId=requestAnimationFrame(e)};this.animationId=requestAnimationFrame(e)}updateOrbitCamera(){this.targetOrbitPitch=Ue.clamp(this.targetOrbitPitch,-1.25,1.25),this.targetOrbitRadius=Ue.clamp(this.targetOrbitRadius,this.minOrbitRadius,this.maxOrbitRadius);const e=this.orbitLerpSpeed;this.orbitYaw+=(this.targetOrbitYaw-this.orbitYaw)*e,this.orbitPitch+=(this.targetOrbitPitch-this.orbitPitch)*e,this.orbitRadius+=(this.targetOrbitRadius-this.orbitRadius)*e;const n=Math.cos(this.orbitPitch);this.perspectiveCamera.position.set(Math.sin(this.orbitYaw)*n*this.orbitRadius,Math.sin(this.orbitPitch)*this.orbitRadius,Math.cos(this.orbitYaw)*n*this.orbitRadius),this.perspectiveCamera.lookAt(this.orbitTarget),this.perspectiveCamera.updateProjectionMatrix()}stopAnimation(){this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null)}setParams(e,n,o){ve(this.currentShader)==="image-plane"?this.planeMaterial&&(this.planeMaterial.uniforms.uQ.value=e,this.planeMaterial.uniforms.uAlpha.value=n,this.planeMaterial.uniforms.uBrightness.value=n,this.planeMaterial.uniforms.uSensitivity.value=o):this.currentShader==="nsa3d"?this.pointMaterial&&(this.pointMaterial.uniforms.uQ.value=e,this.pointMaterial.uniforms.uAlpha.value=n,this.pointMaterial.uniforms.uSensitivity.value=o):this.currentShader==="nsamorphology"&&this.morphMaterial&&(this.morphMaterial.uniforms.uQ.value=e,this.morphMaterial.uniforms.uAlpha.value=n,this.morphMaterial.uniforms.uSensitivity.value=o),this.render()}setBands(e,n,o){const s=this.bandData;!this.planeMaterial||!s[e]||!s[n]||!s[o]||(this.planeMaterial.uniforms.uBandR.value=s[e].tex,this.planeMaterial.uniforms.uBandG.value=s[n].tex,this.planeMaterial.uniforms.uBandB.value=s[o].tex,this.planeMaterial.uniforms.uRangeR.value=s[e].range,this.planeMaterial.uniforms.uRangeG.value=s[n].range,this.planeMaterial.uniforms.uRangeB.value=s[o].range,this.planeMaterial.uniforms.uStretch.value=tt([s[e].range,s[n].range,s[o].range]))}setTheme(e){if(!this.planeMaterial&&!this.pointMaterial||this.currentTheme===e)return;const n=[this.planeMaterial,this.pointMaterial,this.morphMaterial].filter(Boolean);for(const o of n)o.uniforms.uGrayscale.value=0;if(e==="grayscale"){this.setBands("i","r","g");for(const o of n)o.uniforms.uGrayscale.value=1,o.uniforms.uTheme.value=0}else if(e==="infra"){this.setBands("i","r","g");for(const o of n)o.uniforms.uTheme.value=0}else if(e==="astral"){this.setBands("i","r","g");for(const o of n)o.uniforms.uTheme.value=1}this.currentTheme=e,this.render()}getAutoParams(){return this.autoParams}setShader(e){!this.planeMaterial&&!this.pointMaterial||this.currentShader===e||(this.currentShader=e,this.applyCurrentShaderMode(),this.render())}is3DMode(){return ve(this.currentShader)==="orbit"}supportsSkyPicking(){return ve(this.currentShader)==="image-plane"}render(){!this.planeMaterial&&!this.pointMaterial&&!this.morphMaterial||this.renderer.render(this.scene,this.activeCamera)}resize(e,n){if(this.width=e,this.height=n,this.renderer.setSize(e,n,!1),this.planeMaterial){const o=this.renderer.getPixelRatio();this.planeMaterial.uniforms.uResolution.value.set(e*o,n*o)}this.pointMaterial&&(this.pointMaterial.uniforms.uPixelRatio.value=this.renderer.getPixelRatio()),this.morphMaterial&&(this.morphMaterial.uniforms.uPixelRatio.value=this.renderer.getPixelRatio()),this.perspectiveCamera.aspect=e/Math.max(n,1),this.perspectiveCamera.updateProjectionMatrix(),this.render()}pan(e,n){if(this.is3DMode())return;const o=this.targetZoom,s=e/this.width*2/o,f=n/this.height*2/o;this.targetX-=s,this.targetY+=f,this.velX=0,this.velY=0}fling(e,n){if(this.is3DMode())return;const o=this.targetZoom;this.velX=-(e/this.width)*2/o,this.velY=n/this.height*2/o}zoomAt(e,n,o){if(this.is3DMode())return;const s=this.targetZoom,f=Math.max(1,Math.min(s*e,50)),m=n/this.width*2-1,p=-(o/this.height)*2+1,y=this.targetX+m/s,d=this.targetY+p/s;this.targetZoom=f,this.targetX=y-m/f,this.targetY=d-p/f,this.velX=0,this.velY=0}orbit(e,n){if(!this.is3DMode())return;const o=vn({yaw:this.targetOrbitYaw,pitch:this.targetOrbitPitch},e,n);this.targetOrbitYaw=o.yaw,this.targetOrbitPitch=o.pitch}dolly(e){if(!this.is3DMode())return;const n=this.targetOrbitRadius/Math.max(e,.01);this.targetOrbitRadius=Ue.clamp(n,this.minOrbitRadius,this.maxOrbitRadius)}screenToRaDec(e,n,o){if(!this.supportsSkyPicking())return null;const s=this.orthographicCamera.zoom,f=e/this.width*2-1,m=-(n/this.height)*2+1,p=this.orthographicCamera.position.x+f/s,y=this.orthographicCamera.position.y+m/s,d=(p+1)/2,l=(y+1)/2;if(d<0||d>1||l<0||l>1)return null;const[h,g]=o.dimensions,x=d*h,R=(1-l)*g,b=x-h/2,k=R-g/2,A=(o.pixel_scale??.396)/3600,v=o.dec*Math.PI/180,D=o.dec-k*A;return{ra:o.ra-b*A/Math.cos(v),dec:D}}resetView(){if(this.is3DMode()){this.targetOrbitYaw=0,this.targetOrbitPitch=0,this.targetOrbitRadius=Math.max(this.minOrbitRadius*1.4,1.5);return}this.targetZoom=1,this.targetX=0,this.targetY=0,this.velX=0,this.velY=0}dispose(){var e,n,o;this.stopAnimation(),this.textures.forEach(s=>s.dispose()),this.textures=[],this.planeMaterial&&this.planeMaterial.dispose(),this.pointMaterial&&this.pointMaterial.dispose(),this.morphMaterial&&this.morphMaterial.dispose(),(e=this.mesh)!=null&&e.geometry&&this.mesh.geometry.dispose(),(n=this.pointCloud)!=null&&n.geometry&&this.pointCloud.geometry.dispose(),(o=this.morphCloud)!=null&&o.geometry&&this.morphCloud.geometry.dispose(),this.disposeDensityMeshes(),this.renderer.dispose()}}async function wn(c){const e=new Image;e.crossOrigin="anonymous",e.src=c,await new Promise((f,m)=>{e.onload=()=>f(),e.onerror=()=>m(new Error("Failed to load image"))});const n=document.createElement("canvas");n.width=e.naturalWidth,n.height=e.naturalHeight;const o=n.getContext("2d");o.drawImage(e,0,0);const s=o.getImageData(0,0,n.width,n.height);return an(s),s}const _n=[{label:"Normal",value:"none"},{label:"Negative",value:"invert(1)"},{label:"Cyanotype",value:"sepia(1) hue-rotate(180deg) saturate(1.5)"},{label:"Amber",value:"sepia(1) saturate(1.5)"},{label:"Hard",value:"contrast(1.5) brightness(0.9)"}],Cn={class:"photo-scroll",ref:"scrollContainer"},Mn={class:"photo-page"},Rn={class:"photo-hero"},Sn={class:"hero-content"},kn={class:"hero-links"},Bn=["disabled"],Dn={class:"photo-hero-title"},Pn={class:"photo-hero-subtitle"},Tn={key:0,class:"status-container"},zn={key:1,class:"status-container error"},An={key:2,class:"content-grid"},Fn={class:"glass-card canvas-card"},Vn={class:"card-header"},Un={class:"header-actions"},In={class:"canvas-wrapper"},Gn={class:"canvas-loading-overlay"},Nn={key:0,class:"crosshair-overlay",style:{cursor:"crosshair"}},On=["x1","x2","y2"],Hn=["y1","x2","y2"],Qn=["cx","cy"],Yn={key:1,class:"coord-hud"},Ln={class:"params-overlay"},Xn=["aria-expanded","aria-label"],En={key:0,class:"tune-drawer"},$n={class:"tune-drawer-content"},Wn={class:"tune-drawer-header"},qn={class:"tune-drawer-title"},jn={class:"tune-drawer-body"},Zn={class:"control-group"},Jn={class:"theme-toggle"},Kn=["onClick"],ea={key:0,class:"control-group"},ta={class:"label-row"},na={class:"param-value"},aa={class:"control-group"},oa={class:"label-row"},ia={class:"param-value"},sa={class:"control-group"},ra={class:"label-row"},la={class:"param-value"},ua={class:"glass-card bands-card"},ca={class:"card-header"},ha={class:"card-title"},da={class:"bands-grid"},va=["onClick"],ma={class:"band-img-wrap"},pa=["src","alt"],fa={class:"band-badge"},ga={class:"lightbox-content"},ya={class:"lightbox-header"},xa={class:"lightbox-title"},ba={class:"lightbox-body"},wa={class:"lightbox-image-wrap"},_a=["src","alt"],Ca={class:"lightbox-controls"},Ma={class:"lb-control-group"},Ra={class:"lb-control-group"},Sa=["value"],ka={class:"lb-control-group"},Ba={class:"lb-control-group"},Da=["aria-label"],Pa={class:"sidebar-content"},Ta=["aria-label"],za={class:"sidebar-title"},Aa={class:"sidebar-section"},Fa={class:"sidebar-section"},Va={class:"tooltip-content"},Ua={key:0,class:"loading-state"},Ia={key:1,class:"error-state"},Ga={key:2,class:"empty-state"},Na={key:3,class:"results-list"},Oa={class:"obj-name"},Ha={class:"obj-type"},Qa={key:0,class:"link-icon"},Ya=_t({__name:"GalaxyPhotoView",setup(c){const{t:e}=Ct(),n=At(),o=Dt(),{ready:s,getGalaxyByPgc:f,getRandomGalaxies:m}=Ft(),{loading:p,results:y,query:d,error:l}=Vt(),h=j(()=>{const i=y.value.filter(t=>t.type==="Star"||t.type==="Galaxy");return i.length>0?i:y.value.slice(0,5)}),g=j(()=>Number(n.params.pgc)),x=w(null),R=w(null),b=w(null),k=w(!0),A=w(!1),v=Bt(null),D=w(10),P=w(.0515),B=w(1),F=w(null),E=w(null),Ne=j(()=>{var i;return((i=b.value)==null?void 0:i.bands)||["u","g","r","i","z"]}),Z=w("astral"),V=w("lupton"),J=j(()=>V.value==="nsa3d"||V.value==="nsamorphology"),N=w(!1),$=w(!1),K=w(!1),L=w(!1),U=w({visible:!1,x:0,y:0,objects:[]}),ee=w(!1),me=w(0),pe=w(0),I=new Map;let ie=-1,O=[];const te=w(null),ne=w(null);let se=-1,fe=-1;const ge=w(0),ye=w(0),ke=w(0),Be=w(0),xe=w(100),be=w(100),re=w("none"),W=w(!1),Oe=w(null),De=new Map,He=j(()=>{const i=`brightness(${xe.value}%) contrast(${be.value}%)`,t=re.value!=="none"?re.value:"";return{filter:`${i} ${t}`}}),it=j(()=>{const u=U.value.x,r=U.value.y-120-16;return{left:u+"px",top:Math.max(60,r)+"px"}}),st=j(()=>!J.value&&te.value!==null&&ne.value!==null);function Qe(){if(!v.value||!b.value)return;const{Q:i,alpha:t,sensitivity:u}=Se(b.value,V.value);D.value=i,P.value=t,B.value=u,le(),V.value==="lupton"&&(H.Q=i,H.alpha=t,H.sensitivity=u)}function Ye(){o.push(`/g/${g.value}`)}async function rt(i){try{return(await fetch(`${oe}/${i}/metadata.json`)).ok}catch{return!1}}async function lt(){if(K.value)return;K.value=!0;const i=100;for(let t=0;t<i;t++){const r=m(20).filter(T=>T.pgc!==g.value);for(const T of r)if(await rt(T.pgc)){o.push(`/g/${T.pgc}/photo`),K.value=!1;return}}K.value=!1}function le(){v.value&&v.value.setParams(D.value,P.value,B.value)}_e(Z,i=>{v.value&&v.value.setTheme(i)});const H={Q:10,alpha:.1555,sensitivity:.88};_e(V,(i,t)=>{if(v.value){if(t==="lupton"&&(H.Q=D.value,H.alpha=P.value,H.sensitivity=B.value),i==="lupton"&&b.value){const u=H,r=Se(b.value,"lupton");D.value=u.Q!==r.Q?u.Q:r.Q,P.value=u.alpha!==r.alpha?u.alpha:r.alpha,B.value=u.sensitivity}else if(b.value){const u=Se(b.value,i);D.value=u.Q,P.value=u.alpha,B.value=u.sensitivity}(i==="nsa3d"||i==="nsamorphology")&&(L.value=!1,U.value.visible=!1,te.value=null,ne.value=null),v.value.setShader(i),le()}});function ut(i){const t=Oe.value;if(!t)return;t.width=i.width,t.height=i.height,t.getContext("2d").putImageData(i,0,0)}async function ct(){if(W.value=!W.value,W.value&&F.value){await qe();const i=F.value;let t=De.get(i);if(!t){const u=`${oe}/${g.value}/${i}.png`;t=await wn(u),De.set(i,t)}ut(t)}}function ht(i){F.value=i,xe.value=100,be.value=100,re.value="none",W.value=!1}function Le(){F.value=null}function dt(){J.value||(L.value=!L.value,U.value.visible=!1)}function vt(i){if(i.preventDefault(),!v.value||!x.value)return;const t=i.deltaY>0?.9:1.1,u=x.value.getBoundingClientRect(),r=i.clientX-u.left,T=i.clientY-u.top;v.value.is3DMode()?v.value.dolly(t):(v.value.zoomAt(t,r,T),we())}function Xe(){const[i,t]=Array.from(I.values()),u=i.clientX-t.clientX,r=i.clientY-t.clientY;return Math.sqrt(u*u+r*r)}function mt(){const[i,t]=Array.from(I.values());return{x:(i.clientX+t.clientX)/2,y:(i.clientY+t.clientY)/2}}function pt(i){!v.value||!x.value||(x.value.setPointerCapture(i.pointerId),I.set(i.pointerId,i),I.size===1?(ee.value=!0,me.value=i.clientX,pe.value=i.clientY,O=[{x:i.clientX,y:i.clientY,t:performance.now()}]):I.size===2&&(ee.value=!1,ie=Xe()))}function ft(i){if(!(!v.value||!x.value)&&I.has(i.pointerId)){if(I.set(i.pointerId,i),I.size===1&&ee.value){const t=i.clientX-me.value,u=i.clientY-pe.value;v.value.is3DMode()?v.value.orbit(t,u):v.value.pan(t,u),me.value=i.clientX,pe.value=i.clientY;const r=performance.now();for(O.push({x:i.clientX,y:i.clientY,t:r});O.length>1&&r-O[0].t>80;)O.shift();v.value.is3DMode()||we()}else if(I.size===2){const t=Xe();if(ie>0){const u=t/ie,r=mt(),T=x.value.getBoundingClientRect();v.value.is3DMode()?v.value.dolly(u):v.value.zoomAt(u,r.x-T.left,r.y-T.top)}ie=t,v.value.is3DMode()||we()}}}function Pe(i){if(!x.value)return;const t=ee.value&&I.size===1;if(x.value.releasePointerCapture(i.pointerId),I.delete(i.pointerId),I.size<2&&(ie=-1),I.size===1){const u=I.values().next().value;u&&(me.value=u.clientX,pe.value=u.clientY),ee.value=!0}else{if(ee.value=!1,t&&v.value&&!v.value.is3DMode()&&O.length>=2){const u=O[0],r=O[O.length-1],T=(r.t-u.t)/1e3;if(T>.005){const q=(r.x-u.x)/T*.016,wt=(r.y-u.y)/T*.016;v.value.fling(q,wt)}}O=[]}}function we(){if(!v.value||!b.value||se<0||!v.value.supportsSkyPicking())return;const i=v.value.screenToRaDec(se,fe,b.value);i?(te.value=i.ra,ne.value=i.dec):(te.value=null,ne.value=null)}function gt(i){if(J.value||!x.value)return;const t=x.value.getBoundingClientRect();se=i.clientX-t.left,fe=i.clientY-t.top,L.value&&(ge.value=se,ye.value=fe),we()}async function yt(i){if(!L.value||!x.value||!b.value||!v.value||!v.value.supportsSkyPicking())return;const t=x.value.getBoundingClientRect(),u=i.clientX-t.left,r=i.clientY-t.top,T=v.value.screenToRaDec(u,r,b.value);if(T){U.value={visible:!0,x:i.clientX,y:i.clientY,objects:[],error:void 0};try{await d(T.ra,T.dec,30),l.value?U.value.error=l.value:U.value.objects=h.value.map(q=>({name:q.name,type:q.type,simbadUrl:q.simbadUrl}))}catch(q){U.value.error="Failed to query SIMBAD",console.error("SIMBAD query error:",q)}}}function xt(){se=-1,fe=-1,te.value=null,ne.value=null}async function bt(i){try{const t=await fetch(`${oe}/${i}/metadata.json`);t.ok?b.value=await t.json():b.value=null}catch(t){console.error("Failed to load NSA metadata:",t),b.value=null}}async function Ee(i){var t;k.value=!0,b.value=null,A.value=!1,F.value=null,De.clear(),(t=E.value)==null||t.disconnect(),E.value=null,v.value&&(v.value.dispose(),v.value=null),await s,R.value=f(i),await bt(i),k.value=!1;for(let u=0;u<3&&(await qe(),!x.value);u++);if(b.value&&x.value){await new Promise(u=>setTimeout(u,0));try{if(v.value=new bn(x.value),await v.value.load(i,b.value),A.value=!0,v.value.setParams(D.value,P.value,B.value),v.value.setTheme(Z.value),Qe(),H.Q=D.value,H.alpha=P.value,H.sensitivity=B.value,E.value=new ResizeObserver(()=>{if(v.value&&x.value){const u=x.value.parentElement.getBoundingClientRect();v.value.resize(u.width,u.height),ke.value=u.width,Be.value=u.height}}),E.value.observe(x.value.parentElement),x.value.parentElement){const u=x.value.parentElement.getBoundingClientRect();ke.value=u.width,Be.value=u.height}}catch(u){console.error("Failed to load NSA scene:",u),A.value=!0}}}Mt(()=>{Ee(g.value)}),_e(()=>n.params.pgc,(i,t)=>{if(!t)return;const u=Number(i),r=Number(t);u&&u!==r&&Ee(u)});const Te=i=>{i.key==="Escape"&&(N.value=!1)};return _e(N,i=>{i?document.addEventListener("keydown",Te):document.removeEventListener("keydown",Te)},{immediate:!0}),Rt(()=>{var i;document.removeEventListener("keydown",Te),(i=E.value)==null||i.disconnect(),v.value&&v.value.dispose()}),(i,t)=>{var u;return C(),M("div",Cn,[a("div",Mn,[a("section",Rn,[a("div",Sn,[a("div",kn,[a("button",{class:"back-link",onClick:Ye},[t[13]||(t[13]=a("span",null,"←",-1)),ue(" "+_(S(e)("pages.galaxyPhoto.back")||"Back to Galaxy"),1)]),a("button",{class:"shuffle-link",disabled:K.value,onClick:lt},_(K.value?"…":"↻")+" "+_(S(e)("pages.galaxyPhoto.shuffleAnother")),9,Bn)]),a("h1",Dn,[t[14]||(t[14]=a("span",{class:"title-accent"},"PGC",-1)),ue(" "+_(((u=R.value)==null?void 0:u.pgc)||g.value),1)]),a("p",Pn,_(S(e)("pages.galaxyPhoto.title")),1)])]),k.value?(C(),M("div",Tn,[t[15]||(t[15]=a("div",{class:"loading-spinner"},null,-1)),a("p",null,_(S(e)("app.loading")),1)])):b.value?(C(),M("div",An,[a("div",Fn,[a("div",Vn,[t[17]||(t[17]=a("h2",{class:"card-title"},"Composite Imaging",-1)),a("div",Un,[X(a("select",{"onUpdate:modelValue":t[0]||(t[0]=r=>V.value=r),class:"shader-select"},[...t[16]||(t[16]=[St('<option value="lupton" data-v-1593dbcd>Lupton et al.</option><option value="composite" data-v-1593dbcd>Composite</option><option value="custom" data-v-1593dbcd>Custom</option><option value="volumetric" data-v-1593dbcd>Volumetric</option><option value="nsa3d" data-v-1593dbcd>NSA 3D</option><option value="nsamorphology" data-v-1593dbcd>Morphology 3D</option>',6)])],512),[[$e,V.value]]),J.value?Q("",!0):(C(),M("button",{key:0,class:Ce(["find-objects-btn",{active:L.value}]),onClick:dt,"aria-label":"Find objects at location",title:"Click to activate, then click canvas to query SIMBAD"}," ✦ ",2)),a("button",{class:"info-btn",onClick:t[1]||(t[1]=r=>N.value=!N.value),"aria-label":"Info"}," i ")])]),a("div",In,[X(a("div",Gn,[t[18]||(t[18]=a("div",{class:"loading-spinner"},null,-1)),a("p",null,_(S(e)("app.loading")||"Loading..."),1)],512),[[kt,!A.value]]),a("canvas",{ref_key:"canvasEl",ref:x,class:Ce(["composite-canvas",{"find-objects-mode":L.value}]),onWheel:We(vt,["prevent"]),onClick:yt,onPointerdown:pt,onPointermove:ft,onPointerup:Pe,onPointercancel:Pe,onPointerleave:Pe,onMousemove:gt,onMouseleave:xt},null,34),L.value?(C(),M("svg",Nn,[a("line",{x1:ge.value,y1:"0",x2:ge.value,y2:Be.value,class:"crosshair-line"},null,8,On),a("line",{x1:"0",y1:ye.value,x2:ke.value,y2:ye.value,class:"crosshair-line"},null,8,Hn),a("circle",{cx:ge.value,cy:ye.value,r:"4",class:"crosshair-dot"},null,8,Qn)])):Q("",!0),st.value?(C(),M("div",Yn,[t[19]||(t[19]=a("span",{class:"coord-label"},"RA",-1)),ue(" "+_(S(en)(te.value))+"   ",1),t[20]||(t[20]=a("span",{class:"coord-label"},"Dec",-1)),ue(" "+_(S(tn)(ne.value)),1)])):Q("",!0),a("div",Ln,[a("button",{class:"params-toggle",onClick:t[2]||(t[2]=r=>$.value=!$.value),"aria-expanded":$.value,"aria-label":S(e)("pages.galaxyPhoto.tuneImage")},_(S(e)("pages.galaxyPhoto.tuneImage")),9,Xn)]),ce(he,{name:"drawer"},{default:ae(()=>[$.value?(C(),M("div",En,[a("div",$n,[a("div",Wn,[a("h2",qn,_(S(e)("pages.galaxyPhoto.params.title")||"Rendering Parameters"),1),a("button",{class:"tune-drawer-close",onClick:t[3]||(t[3]=r=>$.value=!1),"aria-label":"Close"}," × ")]),a("div",jn,[a("button",{class:"best-fit-btn tune-best-fit",onClick:Qe,title:"Reset to auto-calibrated values"}," Best Fit "),a("div",Zn,[t[21]||(t[21]=a("label",null,"Spectral Theme",-1)),a("div",Jn,[(C(),M(Me,null,Re([{id:"grayscale",label:"Grayscale"},{id:"infra",label:"Infrared"},{id:"astral",label:"Astral"}],r=>a("button",{key:r.id,class:Ce(["theme-btn",{active:Z.value===r.id}]),onClick:T=>Z.value=r.id},_(r.label),11,Kn)),64))])]),V.value!=="composite"?(C(),M("div",ea,[a("div",ta,[a("label",null,_(S(e)("pages.galaxyPhoto.params.q"))+" (Stretch)",1),a("span",na,_(D.value.toFixed(1)),1)]),X(a("input",{"onUpdate:modelValue":t[4]||(t[4]=r=>D.value=r),type:"range",min:"1",max:"100",step:"0.5",class:"custom-range",onInput:le},null,544),[[de,D.value,void 0,{number:!0}]])])):Q("",!0),a("div",aa,[a("div",oa,[a("label",null,_(S(e)("pages.galaxyPhoto.params.alpha"))+" (Brightness)",1),a("span",ia,_(P.value.toFixed(4)),1)]),X(a("input",{"onUpdate:modelValue":t[5]||(t[5]=r=>P.value=r),type:"range",min:"0.001",max:"10.0",step:"0.001",class:"custom-range",onInput:le},null,544),[[de,P.value,void 0,{number:!0}]])]),a("div",sa,[a("div",ra,[t[22]||(t[22]=a("label",null,"Sensitivity",-1)),a("span",la,_(B.value.toFixed(2)),1)]),X(a("input",{"onUpdate:modelValue":t[6]||(t[6]=r=>B.value=r),type:"range",min:"0.01",max:"1.0",step:"0.01",class:"custom-range",onInput:le},null,544),[[de,B.value,void 0,{number:!0}]])])])])])):Q("",!0)]),_:1})])]),a("section",ua,[a("div",ca,[a("h2",ha,_(S(e)("pages.galaxyPhoto.bands")),1)]),a("div",da,[(C(!0),M(Me,null,Re(Ne.value,r=>(C(),M("div",{key:r,class:"band-item",onClick:T=>ht(r)},[a("div",ma,[a("img",{src:`${S(oe)}/${g.value}/${r}.png`,alt:`${r}-band`,loading:"lazy",crossorigin:"anonymous"},null,8,pa),t[23]||(t[23]=a("div",{class:"band-overlay"},[a("span",{class:"zoom-icon"},"⤢")],-1))]),a("span",fa,_(r),1)],8,va))),128))])])])):(C(),M("div",zn,[a("p",null,_(S(e)("pages.galaxyPhoto.notAvailable")),1),a("button",{class:"action-btn",onClick:Ye},"Return to Map")]))]),ce(he,{name:"fade"},{default:ae(()=>[F.value?(C(),M("div",{key:0,class:"lightbox",onClick:We(Le,["self"])},[a("div",ga,[a("button",{class:"lightbox-close",onClick:Le},"×"),a("div",ya,[a("h2",xa,_(F.value)+"-band Raw Data",1),t[24]||(t[24]=a("span",{class:"lightbox-subtitle"},"Sloan Digital Sky Survey",-1))]),a("div",ba,[a("div",wa,[W.value?(C(),M("canvas",{key:0,ref_key:"stfCanvasEl",ref:Oe,class:"lightbox-image",style:ze(He.value)},null,4)):(C(),M("img",{key:1,class:"lightbox-image",src:`${S(oe)}/${g.value}/${F.value}.png`,alt:`${F.value}-band`,style:ze(He.value),crossorigin:"anonymous"},null,12,_a)),a("div",Ca,[a("div",Ma,[t[25]||(t[25]=a("label",null,"Auto STF",-1)),a("button",{class:Ce(["stf-toggle",{active:W.value}]),onClick:ct},_(W.value?"ON":"OFF"),3)]),a("div",Ra,[t[26]||(t[26]=a("label",null,"Filter",-1)),X(a("select",{"onUpdate:modelValue":t[7]||(t[7]=r=>re.value=r),class:"lb-select"},[(C(!0),M(Me,null,Re(S(_n),r=>(C(),M("option",{key:r.label,value:r.value},_(r.label),9,Sa))),128))],512),[[$e,re.value]])]),a("div",ka,[t[27]||(t[27]=a("label",null,"Brightness",-1)),X(a("input",{type:"range","onUpdate:modelValue":t[8]||(t[8]=r=>xe.value=r),min:"0",max:"200",class:"custom-range"},null,512),[[de,xe.value,void 0,{number:!0}]])]),a("div",Ba,[t[28]||(t[28]=a("label",null,"Contrast",-1)),X(a("input",{type:"range","onUpdate:modelValue":t[9]||(t[9]=r=>be.value=r),min:"0",max:"200",class:"custom-range"},null,512),[[de,be.value,void 0,{number:!0}]])])])])])])])):Q("",!0)]),_:1}),ce(he,{name:"fade"},{default:ae(()=>[N.value?(C(),M("div",{key:0,class:"info-sidebar-backdrop","aria-hidden":"true",onClick:t[10]||(t[10]=r=>N.value=!1)})):Q("",!0)]),_:1}),ce(he,{name:"sidebar"},{default:ae(()=>[N.value?(C(),M("div",{key:0,class:"info-sidebar",role:"dialog","aria-modal":"true","aria-label":S(e)("pages.galaxyPhoto.info.title")},[a("div",Pa,[a("button",{class:"sidebar-close",type:"button","aria-label":S(e)("app.close")||"Close",onClick:t[11]||(t[11]=r=>N.value=!1)}," × ",8,Ta),a("h2",za,_(S(e)("pages.galaxyPhoto.info.title")),1),a("div",Aa,[t[29]||(t[29]=a("h3",null,"Data Source",-1)),a("p",null,_(S(e)("pages.galaxyPhoto.info.dataSource")),1)]),a("div",Fa,[a("h3",null,_(V.value==="lupton"?"Lupton Composite":V.value==="composite"?"Raw Composite":V.value==="custom"?"Custom Composite":V.value==="volumetric"?"Volumetric Rendering":V.value==="nsa3d"?"NSA 3D Point Cloud":"Morphology 3D"),1),a("p",null,_(S(e)("pages.galaxyPhoto.info."+V.value)),1)])])],8,Da)):Q("",!0)]),_:1}),ce(he,{name:"fade"},{default:ae(()=>[U.value.visible?(C(),M("div",{key:0,class:"simbad-tooltip",style:ze(it.value)},[t[32]||(t[32]=a("div",{class:"tooltip-arrow"},null,-1)),a("div",Va,[S(p)?(C(),M("div",Ua,[...t[30]||(t[30]=[a("div",{class:"mini-spinner"},null,-1),a("span",null,"Querying SIMBAD...",-1)])])):U.value.error?(C(),M("div",Ia,[t[31]||(t[31]=a("span",{class:"error-icon"},"⚠",-1)),ue(" "+_(U.value.error),1)])):U.value.objects.length===0?(C(),M("div",Ga," No objects found ")):(C(),M("div",Na,[(C(!0),M(Me,null,Re(U.value.objects,r=>(C(),Pt(zt(r.type==="Star"||r.type&&r.type.includes("*")?"router-link":"a"),Tt({key:r.name},{ref_for:!0},r.type==="Star"||r.type&&r.type.includes("*")?{to:`/star/${encodeURIComponent(r.name)}`}:{href:r.simbadUrl,target:"_blank",rel:"noopener noreferrer"},{class:"result-item result-link"}),{default:ae(()=>[a("span",Oa,_(r.name),1),a("span",Ha,_(r.type),1),r.type!=="Star"&&!(r.type&&r.type.includes("*"))?(C(),M("span",Qa,"↗")):Q("",!0)]),_:2},1040))),128))])),a("button",{class:"tooltip-close",onClick:t[12]||(t[12]=r=>U.value.visible=!1)},"×")])],4)):Q("",!0)]),_:1})],512)}}}),Ja=Kt(Ya,[["__scopeId","data-v-1593dbcd"]]);export{Ja as default};
