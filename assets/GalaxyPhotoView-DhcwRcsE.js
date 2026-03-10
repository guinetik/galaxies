import{I as wt,f as _,J as I,d as ce,u as he,G as zt,z as ve,K as de,L as me,c as k,a,h as st,t as R,e as V,i as Z,M as At,N as pe,n as Ft,D as et,j as It,F as mt,r as pt,O as rt,b as _t,w as Mt,T as Rt,l as fe,P as ge,m as nt,B as xe,E as Vt,o as T}from"./vue-vendor-CxKBfOLG.js";import{u as ye}from"./useGalaxyData-BLZxfCfc.js";import{C as be,V as we,W as _e,O as Me,P as Re,S as Se,T as Ce,L as Be,g as ke,h as Ut,i as Gt,j as Te,M as Pe,a as St,A as Ot,B as Yt,c as Q,b as Qt,k as Ct}from"./three-BivkH6X_.js";import{_ as De}from"./index-CXI754MP.js";import"./sqljs-M9QnmiAb.js";function ze(){const r=_(!1),t=_([]),e=_(null);async function i(u,v,m=30){r.value=!0,e.value=null,t.value=[];try{const g=m/3600,f=new URL("https://simbad.cds.unistra.fr/cone/");f.searchParams.set("RA",u.toString()),f.searchParams.set("DEC",v.toString()),f.searchParams.set("SR",g.toString()),f.searchParams.set("RESPONSEFORMAT","json"),f.searchParams.set("VERB","2");const d=await fetch(f.toString());if(!d.ok)throw new Error(`SIMBAD API error: ${d.statusText}`);const h=await d.json();if(h.data&&h.data.length>0,h.columns&&h.data&&Array.isArray(h.data)){const l={};h.columns.forEach((s,b)=>{l[s.name.toLowerCase()]=b}),console.log("Column map:",l),t.value=h.data.map(s=>{const b=l.main_id,y=l.otype,w=l.ra,p=l.dec,M=s[b]||"Unknown";return{name:M,type:s[y]||"Unknown",ra:w!==void 0?parseFloat(s[w]):void 0,dec:p!==void 0?parseFloat(s[p]):void 0,simbadUrl:`https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(M)}`}}).filter(s=>s.name&&s.name!=="Unknown").slice(0,50)}else t.value=[]}catch(g){e.value=g instanceof Error?g.message:"Unknown error",t.value=[]}finally{r.value=!1}}return{loading:wt(r),results:wt(t),error:wt(e),query:i}}const Ae=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Fe=`precision highp float;

uniform sampler2D uBandR;
uniform sampler2D uBandG;
uniform sampler2D uBandB;
uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform vec2 uRangeR;
uniform vec2 uRangeG;
uniform vec2 uRangeB;
uniform float uGrayscale;

varying vec2 vUV;

// GLSL ES 1.00 does not provide asinh
float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

void main() {
  // Sample each band (grayscale stored in .r channel)
  float r_raw = texture2D(uBandR, vUV).r;
  float g_raw = texture2D(uBandG, vUV).r;
  float b_raw = texture2D(uBandB, vUV).r;

  // Denormalize from [0,1] to original FITS data range
  float r = r_raw * (uRangeR.y - uRangeR.x) + uRangeR.x;
  float g = g_raw * (uRangeG.y - uRangeG.x) + uRangeG.x;
  float b = b_raw * (uRangeB.y - uRangeB.x) + uRangeB.x;

  // Mean intensity: I = (r + g + b) / 3  (Lupton et al. 2004, Eq. 2)
  float I = (r + g + b) / 3.0;

  // Minimum (black-point) from sensitivity slider
  // sensitivity = 1 → m = 0 (most sensitive); sensitivity → 0 → m grows
  float avgRange = ((uRangeR.y - uRangeR.x) + (uRangeG.y - uRangeG.x) + (uRangeB.y - uRangeB.x)) / 3.0;
  float m = (1.0 - uSensitivity) * avgRange * 0.02;

  // Lupton asinh stretch: f(I) = asinh(α Q (I - m)) / Q
  // Linear for faint signals (I ≈ m), logarithmic for bright (I >> m)
  float fI = safe_asinh(uAlpha * uQ * max(I - m, 0.0)) / uQ;

  // Color-preserving scaling (Eq. 2): R = r · f(I) / I
  float scale = fI / max(I, 1e-10);

  float R = r * scale;
  float G = g * scale;
  float B = b * scale;

  // Desaturate when max channel > 1 — preserves color, clips intensity
  // (Paper: "if max(R,G,B) > 1, set R/=max, G/=max, B/=max")
  float maxRGB = max(max(R, G), max(B, 1.0));
  R /= maxRGB;
  G /= maxRGB;
  B /= maxRGB;

  // Mix color and grayscale (stretched intensity) output
  vec3 colorOut = vec3(max(R, 0.0), max(G, 0.0), max(B, 0.0));
  vec3 grayOut = vec3(clamp(fI, 0.0, 1.0));
  gl_FragColor = vec4(mix(colorOut, grayOut, uGrayscale), 1.0);
}
`,Ie=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ve=`precision highp float;

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
    vec3(0.50, 0.22, 0.70),   // astral: muted purple
    uTheme
  );
  vec3 starCol = mix(
    vec3(1.0, 0.95, 0.88),    // infra: warm cream
    vec3(0.75, 0.85, 1.0),    // astral: cool blue-white
    uTheme
  );
  vec3 hotCol = mix(
    vec3(0.35, 0.55, 1.0),    // infra: blue-cyan
    vec3(0.65, 0.30, 1.0),    // astral: violet-magenta
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
    vec3(0.65, 0.75, 1.0),    // astral: cool glow
    uTheme
  );
  col += glowCol * sGlow * 0.5;

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

  // Additive sparkle glow on bright stars
  vec3 sparkleCol = mix(vec3(1.0, 0.95, 0.85), vec3(0.85, 0.9, 1.0), uTheme);
  col += sparkleCol * starness * twinkle * 0.4;

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
`,Ue=`varying vec2 vUV;

void main() {
  vUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ge=`precision highp float;

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
`,Oe=`precision highp float;

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
  vec3 displaced = aPosition;

  float drift = sin(
    uTime * 0.4 +
    aPosition.x * 6.0 +
    aPosition.y * 4.0 +
    aPosition.z * 2.0
  ) * 0.015 * aIntensity;
  vec3 driftDir = normalize(vec3(aPosition.xy + vec2(0.0001), 1.0));
  displaced += driftDir * drift;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  float depth = max(-mvPosition.z, 0.001);
  float contrastBoost = 0.6 + log2(1.0 + uQ) * 0.25;
  float sensitivityBoost = mix(0.6, 1.5, uSensitivity);
  float size = aSize * (0.8 + uAlpha * 1.4) * contrastBoost * sensitivityBoost;

  gl_PointSize = max(size * uPixelRatio * (2.2 / depth), 1.5);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
  vIntensity = aIntensity;
  vDepth = depth;
}
`,Ye=`precision highp float;

uniform float uTheme;
uniform float uGrayscale;
uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;

varying vec3 vColor;
varying float vIntensity;
varying float vDepth;

float safe_asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float r = length(p);
  if (r > 0.5) {
    discard;
  }

  float disc = 1.0 - smoothstep(0.18, 0.5, r);
  float halo = exp(-r * r * 10.0);

  // Boost intensity before stretch so faint pixels aren't crushed
  float boosted = pow(vIntensity, 0.45) * (0.5 + uAlpha * 0.5);
  float stretch = safe_asinh(boosted * (1.0 + uQ * 0.15)) / max(1.0 + uQ * 0.15, 1.0);
  // Ensure minimum visibility for any surviving point
  stretch = max(stretch, 0.08);

  float sensitivityBoost = mix(0.6, 1.5, uSensitivity);
  float depthFade = 1.0 / (1.0 + vDepth * 0.12);

  // ── Infra theme: warm amber/gold, data-colored ──
  vec3 warmTint = vec3(1.15, 0.85, 0.60);
  vec3 coreWarm = vec3(1.0, 0.82, 0.55);

  // ── Astral theme: intensity-layered like volumetric shader ──
  // Outer/faint → deep blue, mid → purple/violet, bright → blue-white
  vec3 astralOuter = vec3(0.08, 0.12, 0.35);   // deep ocean blue
  vec3 astralMid   = vec3(0.30, 0.15, 0.60);   // deep purple
  vec3 astralInner = vec3(0.65, 0.40, 0.80);   // orchid/violet
  vec3 astralCore  = vec3(0.82, 0.85, 1.0);    // cool blue-white

  // 3-stop gradient based on stretched intensity
  vec3 astralTint;
  if (stretch < 0.2) {
    astralTint = mix(astralOuter, astralMid, stretch / 0.2);
  } else if (stretch < 0.5) {
    astralTint = mix(astralMid, astralInner, (stretch - 0.2) / 0.3);
  } else {
    astralTint = mix(astralInner, astralCore, clamp((stretch - 0.5) / 0.5, 0.0, 1.0));
  }

  // Blend spectral color variation into the astral tint (keep some data color)
  vec3 astralCol = mix(astralTint, astralTint * (vColor + 0.3), 0.35);
  vec3 coreCool = vec3(0.82, 0.85, 1.0);

  vec3 infraCol = vColor * warmTint;
  vec3 themed = mix(infraCol, astralCol, uTheme);

  float brightness = (0.5 + stretch * 2.2) * sensitivityBoost * depthFade;
  vec3 col = themed * brightness * halo;
  col += mix(coreWarm, coreCool, uTheme) * pow(disc, 3.0) * stretch * 0.6;

  col = clamp(col, 0.0, 1.0);
  float alpha = clamp((halo * 0.85 + disc * 0.5) * stretch * sensitivityBoost * depthFade * 2.5, 0.0, 1.0);
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), alpha);
}
`,Lt=`precision highp float;

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
  vec3 displaced = aPosition;

  // Gentle drift — filamentary regions drift less (they're thin sheets)
  float driftScale = mix(0.015, 0.004, aFilamentarity);
  float drift = sin(
    uTime * 0.4 +
    aPosition.x * 6.0 +
    aPosition.y * 4.0 +
    aPosition.z * 2.0
  ) * driftScale * aIntensity;
  vec3 driftDir = normalize(vec3(aPosition.xy + vec2(0.0001), 1.0));
  displaced += driftDir * drift;

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
  // Morphology z-depth (structural, not camera) normalized to ~[0,1]
  // Raw z is typically in [-0.5, 0.5] from the morphology builder
  vMorphDepth = clamp(aPosition.z * 1.8 + 0.5, 0.0, 1.0);
}
`,Et=`precision highp float;

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

// ── Nebula color from depth layer ──
// Different z-layers get different hues. With additive blending,
// overlapping layers naturally mix: blue + red = magenta, teal + gold = white.
// Rotating the cloud separates and recombines these layers, creating
// the color mixing effect of real emission nebulae.

vec3 nebulaWarm(float depth, float filam, float stretch) {
  // Warm nebula palette (infra theme) — protostellar / emission
  vec3 deep   = vec3(0.12, 0.04, 0.18);  // dark violet dust
  vec3 back   = vec3(0.55, 0.08, 0.12);  // deep crimson
  vec3 mid    = vec3(0.90, 0.35, 0.08);  // ember orange
  vec3 front  = vec3(1.00, 0.75, 0.30);  // warm gold
  // Core stays colored — warm peach instead of flat white
  vec3 core   = vec3(1.00, 0.80, 0.55);

  // 4-stop depth gradient
  vec3 c;
  if (depth < 0.25) {
    c = mix(deep, back, depth / 0.25);
  } else if (depth < 0.5) {
    c = mix(back, mid, (depth - 0.25) / 0.25);
  } else if (depth < 0.75) {
    c = mix(mid, front, (depth - 0.5) / 0.25);
  } else {
    c = mix(front, core, (depth - 0.75) / 0.25);
  }

  // Gentle brightening for round regions — keeps hue, just lifts luminance
  c *= 1.0 + (1.0 - filam) * stretch * 0.2;

  return c;
}

vec3 nebulaCool(float depth, float filam, float stretch) {
  // Cool nebula palette (astral theme) — planetary nebula / reflection
  vec3 deep   = vec3(0.03, 0.06, 0.18);  // void blue-black
  vec3 back   = vec3(0.08, 0.18, 0.45);  // deep sapphire
  vec3 mid    = vec3(0.45, 0.10, 0.55);  // rich magenta-violet
  vec3 front  = vec3(0.15, 0.50, 0.55);  // teal emission
  // Core stays colored — pale violet instead of flat white
  vec3 core   = vec3(0.60, 0.55, 0.85);

  vec3 c;
  if (depth < 0.25) {
    c = mix(deep, back, depth / 0.25);
  } else if (depth < 0.5) {
    c = mix(back, mid, (depth - 0.25) / 0.25);
  } else if (depth < 0.75) {
    c = mix(mid, front, (depth - 0.5) / 0.25);
  } else {
    c = mix(front, core, (depth - 0.75) / 0.25);
  }

  c *= 1.0 + (1.0 - filam) * stretch * 0.2;

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

  // Intensity stretch — gentler curve so sliders don't blow out
  float boosted = pow(vIntensity, 0.55) * (0.3 + uAlpha * 0.4);
  float stretch = safe_asinh(boosted * (1.0 + uQ * 0.08)) / max(1.0 + uQ * 0.08, 1.0);
  stretch = max(stretch, 0.06);

  float sensitivityBoost = mix(0.5, 1.2, uSensitivity);
  float camFade = 1.0 / (1.0 + vCameraDepth * 0.12);

  // ── Depth-layered nebula colors ──
  vec3 warm = nebulaWarm(vMorphDepth, vFilamentarity, stretch);
  vec3 cool = nebulaCool(vMorphDepth, vFilamentarity, stretch);
  vec3 nebula = mix(warm, cool, uTheme);

  // Blend spectral band data — stronger influence so real color differences
  // create variance even in bright core regions
  vec3 spectralInfluence = vColor * 0.7 + 0.3;
  nebula *= mix(vec3(1.0), spectralInfluence, 0.4);

  // Brightness
  float brightness = (0.3 + stretch * 1.4) * sensitivityBoost * camFade;
  vec3 col = nebula * brightness * halo;

  // Core glow: tinted by the nebula color, not flat white
  // This keeps color variance in the bright core instead of washing out
  vec3 coreHue = nebula * 0.6 + 0.4;
  float coreGlow = pow(disc, 3.0) * stretch * mix(0.35, 0.1, vFilamentarity);
  col += coreHue * coreGlow;

  col = clamp(col, 0.0, 1.0);

  // Alpha: softer falloff for filamentary points
  float filamAlphaScale = mix(1.0, 0.7, vFilamentarity);
  float alpha = clamp(
    (halo * 0.85 + disc * 0.5) * stretch * sensitivityBoost * camFade * 2.5 * filamAlphaScale,
    0.0, 1.0
  );

  // Noise floor: fade out sub-signal points so background noise doesn't accumulate.
  // Lower edge (0.04) ~= 13x the CPU pre-filter threshold (0.003), chosen to absorb
  // sampling noise at the edge of detectability. Upper edge (0.12) is the empirical
  // "signal present" knee. Both values assume sqrt-stretched input intensities.
  float signal = smoothstep(0.04, 0.12, vIntensity);
  alpha *= signal;

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), alpha);
}
`;function ft(r){return r==="nsa3d"||r==="nsamorphology"?"orbit":"image-plane"}function Qe(r,t,e){return{yaw:r.yaw-t*.008,pitch:r.pitch+e*.006}}function Xe(r,t,e){return{sampleStep:Math.max(1,Math.ceil(Math.max(r,t)/500)),intensityThreshold:.003,depthScale:.35,sizeRange:[1.5,8.5],seed:e}}function qe(r,t){const e=[],i=Math.max(1,Math.floor(t.sampleStep)),[u,v]=t.sizeRange,m=Math.max(1,r.width-1),g=Math.max(1,r.height-1);for(let f=0;f<r.height;f+=i)for(let d=0;d<r.width;d+=i){const h=f*r.width+d,l=Math.sqrt(L(r.bands.u[h]??0)),s=Math.sqrt(L(r.bands.g[h]??0)),b=Math.sqrt(L(r.bands.r[h]??0)),y=Math.sqrt(L(r.bands.i[h]??0)),w=Math.sqrt(L(r.bands.z[h]??0)),p=Math.sqrt(L(r.bands.nuv[h]??0)),M=(y+w)*.5,S=(s+b)*.5,C=(l+p)*.5,z=M*.25+S*.4+C*.35;if(z<t.intensityThreshold)continue;const X=C-M,j=(Xt(d,f,t.seed)-.5)*2,Y=(Xt(d+137,f+251,t.seed)-.5)*2,U=(j*.7+Y*.3+X*.25)*t.depthScale,$=r.width===1?0:d/m-.5,G=r.height===1?0:.5-f/g,D=Le(u,v,L(z)),q=Ne(l,s,b,y,w,p);e.push({x:$,y:G,z:U,color:q,size:D,intensity:z})}return{points:e}}function Ne(r,t,e,i,u,v){const m=r+t+e+i+u+v+.001,g=v/m,f=r/m,d=t/m,h=e/m,l=i/m,s=u/m,b=L(g*.45+f*.15+d*.1+h*1+l*.9+s*.7),y=L(g*.15+f*.2+d*.95+h*.4+l*.12+s*.05),w=L(g*1+f*.95+d*.5+h*.08+l*.1+s*.15);return[b,y,w]}function Xt(r,t,e){const i=Math.sin(r*127.1+t*311.7+e*74.7)*43758.5453123;return i-Math.floor(i)}function L(r){return Math.max(0,Math.min(1,r))}function Le(r,t,e){return r+(t-r)*e}function Ee(r,t,e){return{sampleStep:Math.max(1,Math.ceil(Math.max(r,t)/550)),intensityThreshold:.003,depthScale:.4,sizeRange:[1.5,8.5],seed:e}}function $e(r,t){const e=[],i=Math.max(1,Math.floor(t.sampleStep)),[u,v]=t.sizeRange,m=Math.max(1,r.width-1),g=Math.max(1,r.height-1),{field:f,w:d,h}=We(r,i),l=Math.max(1,Math.min(3,Math.floor(Math.min(d,h)/20)));for(let s=0;s<r.height;s+=i)for(let b=0;b<r.width;b+=i){const y=s*r.width+b,w=Math.sqrt(F(r.bands.u[y]??0)),p=Math.sqrt(F(r.bands.g[y]??0)),M=Math.sqrt(F(r.bands.r[y]??0)),S=Math.sqrt(F(r.bands.i[y]??0)),C=Math.sqrt(F(r.bands.z[y]??0)),z=Math.sqrt(F(r.bands.nuv[y]??0)),X=(S+C)*.5,j=(p+M)*.5,Y=(w+z)*.5,B=X*.25+j*.4+Y*.35;if(B<t.intensityThreshold)continue;const U=Math.floor(b/i),$=Math.floor(s/i),{F:G}=je(f,d,h,U,$,l),D=(Ze(b,s,t.seed)-.5)*2,q=1/(1+G*9),J=(Y-X)*.2,K=(D*q+J)*t.depthScale,A=r.width===1?0:b/m-.5,H=r.height===1?0:.5-s/g,O=Je(u,v,F(B)),W=He(w,p,M,S,C,z);e.push({x:A,y:H,z:K,color:W,size:O,intensity:B,filamentarity:G})}return{points:e}}function We(r,t){const e=Math.ceil(r.width/t),i=Math.ceil(r.height/t),u=new Float32Array(e*i);for(let v=0;v<i;v++)for(let m=0;m<e;m++){const g=Math.min(v*t,r.height-1),f=Math.min(m*t,r.width-1),d=g*r.width+f,h=Math.sqrt(F(r.bands.u[d]??0)),l=Math.sqrt(F(r.bands.g[d]??0)),s=Math.sqrt(F(r.bands.r[d]??0)),b=Math.sqrt(F(r.bands.i[d]??0)),y=Math.sqrt(F(r.bands.z[d]??0)),w=Math.sqrt(F(r.bands.nuv[d]??0)),p=(b+y)*.5,M=(l+s)*.5,S=(h+w)*.5;u[v*e+m]=p*.25+M*.4+S*.35}return{field:u,w:e,h:i}}function je(r,t,e,i,u,v){let m=0,g=0,f=0;for(let p=-v;p<=v;p++)for(let M=-v;M<=v;M++){const S=Math.max(0,Math.min(t-1,i+M)),C=Math.max(0,Math.min(e-1,u+p)),z=Math.max(0,S-1),X=Math.min(t-1,S+1),j=Math.max(0,C-1),Y=Math.min(e-1,C+1),B=r[C*t+X]-r[C*t+z],U=r[Y*t+S]-r[j*t+S];m+=B*B,g+=B*U,f+=U*U}const d=m+f,h=m*f-g*g,l=Math.sqrt(Math.max(0,d*d-4*h)),s=(d+l)*.5,b=(d-l)*.5,y=d>1e-4?(s-b)/(s+b):0,w=Math.atan2(2*g,m-f)*.5;return{F:y,angle:w}}function He(r,t,e,i,u,v){const m=r+t+e+i+u+v+.001,g=v/m,f=r/m,d=t/m,h=e/m,l=i/m,s=u/m,b=F(g*.45+f*.15+d*.1+h*1+l*.9+s*.7),y=F(g*.15+f*.2+d*.95+h*.4+l*.12+s*.05),w=F(g*1+f*.95+d*.5+h*.08+l*.1+s*.15);return[b,y,w]}function Ze(r,t,e){const i=Math.sin(r*127.1+t*311.7+e*74.7)*43758.5453123;return i-Math.floor(i)}function F(r){return Math.max(0,Math.min(1,r))}function Je(r,t,e){return r+(t-r)*e}function gt(r,t){return t==="nsa3d"?{Q:1,alpha:.05,sensitivity:.5}:t==="nsamorphology"?{Q:5,alpha:.503,sensitivity:1}:{Q:t==="custom"?20:10,alpha:.5,sensitivity:1}}const Bt={lupton:{vert:Ae,frag:Fe},custom:{vert:Ie,frag:Ve},volumetric:{vert:Ue,frag:Ge},nsamorphology:{vert:Lt,frag:Et}};class Ke{constructor(t){this.planeMaterial=null,this.pointMaterial=null,this.morphMaterial=null,this.mesh=null,this.pointCloud=null,this.morphCloud=null,this.textures=[],this.animationId=null,this.bandData={},this.currentTheme="astral",this.currentShader="lupton",this.width=1,this.height=1,this.clock=new be,this.autoParams={Q:10,alpha:.5,sensitivity:1},this.targetZoom=1,this.targetX=0,this.targetY=0,this.velX=0,this.velY=0,this.lerpSpeed=.15,this.friction=.92,this.velThreshold=1e-4,this.orbitYaw=0,this.orbitPitch=0,this.orbitRadius=2.5,this.targetOrbitYaw=0,this.targetOrbitPitch=0,this.targetOrbitRadius=2.5,this.minOrbitRadius=1.1,this.maxOrbitRadius=5,this.orbitLerpSpeed=.12,this.orbitTarget=I(new we(0,0,0)),this.renderer=I(new _e({canvas:t,antialias:!1,alpha:!1})),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.orthographicCamera=I(new Me(-1,1,1,-1,0,100)),this.orthographicCamera.position.z=10,this.perspectiveCamera=I(new Re(48,1,.01,100)),this.perspectiveCamera.position.set(0,0,2.5),this.activeCamera=this.orthographicCamera,this.scene=I(new Se)}async load(t,e){var l,s;const i=new Ce,u=`/galaxy-img/${t}/`,v=["i","r","g"];e.bands.includes("u")&&v.push("u"),e.bands.includes("z")&&v.push("z"),e.bands.includes("nuv")&&v.push("nuv");const m=await Promise.all(v.map(b=>i.loadAsync(`${u}${b}.webp`)));v.forEach((b,y)=>{const w=I(m[y]);w.generateMipmaps=!0,w.minFilter=Be,w.magFilter=ke,w.wrapS=Ut,w.wrapT=Ut,this.textures.push(w),this.bandData[b]={tex:w,range:new Gt(e.data_ranges[b][0],e.data_ranges[b][1])}});const g=((l=this.renderer.domElement.parentElement)==null?void 0:l.clientWidth)||window.innerWidth,f=((s=this.renderer.domElement.parentElement)==null?void 0:s.clientHeight)||window.innerHeight*.6,d=this.bandData;this.planeMaterial=I(this.createPlaneMaterial(d,g,f)),this.pointMaterial=I(this.createPointMaterial()),this.morphMaterial=I(this.createMorphMaterial());const h=I(new Te(2,2));this.mesh=I(new Pe(h,this.planeMaterial)),this.scene.add(this.mesh),this.pointCloud=I(this.createPointCloudObject(t)),this.pointCloud.visible=!1,this.scene.add(this.pointCloud),this.morphCloud=I(this.createMorphCloudObject(t)),this.morphCloud.visible=!1,this.scene.add(this.morphCloud),this.resize(g,f),this.applyCurrentShaderMode(),this.setTheme(this.currentTheme),this.autoParams=gt(e,this.currentShader),this.startAnimation()}createPlaneMaterial(t,e,i){var u,v,m,g,f,d,h,l,s,b;return new St({uniforms:{uBandR:{value:((u=t.u)==null?void 0:u.tex)??t.g.tex},uBandG:{value:t.g.tex},uBandB:{value:t.i.tex},uAlpha:{value:.014},uQ:{value:20},uSensitivity:{value:.88},uRangeR:{value:((v=t.u)==null?void 0:v.range)??t.g.range},uRangeG:{value:t.g.range},uRangeB:{value:t.i.range},uGrayscale:{value:0},uBand_u:{value:((m=t.u)==null?void 0:m.tex)??t.g.tex},uBand_g:{value:t.g.tex},uBand_r:{value:t.r.tex},uBand_i:{value:t.i.tex},uBand_z:{value:((g=t.z)==null?void 0:g.tex)??t.i.tex},uBand_nuv:{value:((f=t.nuv)==null?void 0:f.tex)??((d=t.u)==null?void 0:d.tex)??t.g.tex},uRange_u:{value:((h=t.u)==null?void 0:h.range)??t.g.range},uRange_g:{value:t.g.range},uRange_r:{value:t.r.range},uRange_i:{value:t.i.range},uRange_z:{value:((l=t.z)==null?void 0:l.range)??t.i.range},uRange_nuv:{value:((s=t.nuv)==null?void 0:s.range)??((b=t.u)==null?void 0:b.range)??t.g.range},uTheme:{value:1},uTime:{value:0},uResolution:{value:new Gt(e*this.renderer.getPixelRatio(),i*this.renderer.getPixelRatio())}},vertexShader:Bt.lupton.vert,fragmentShader:Bt.lupton.frag})}createPointMaterial(){return new St({uniforms:{uAlpha:{value:1},uQ:{value:20},uSensitivity:{value:1},uTheme:{value:1},uGrayscale:{value:0},uTime:{value:0},uPixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:Oe,fragmentShader:Ye,transparent:!0,depthWrite:!1,blending:Ot})}createMorphMaterial(){return new St({uniforms:{uAlpha:{value:1},uQ:{value:20},uSensitivity:{value:1},uTheme:{value:1},uGrayscale:{value:0},uTime:{value:0},uPixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:Lt,fragmentShader:Et,transparent:!0,depthWrite:!1,blending:Ot})}createPointCloudObject(t){const e=this.extractPointCloudBands(),i=qe(e,Xe(e.width,e.height,t)),u=i.points.length,v=new Float32Array(u*3),m=new Float32Array(u*3),g=new Float32Array(u),f=new Float32Array(u);let d=1;for(let l=0;l<u;l+=1){const s=i.points[l];v[l*3]=s.x,v[l*3+1]=s.y,v[l*3+2]=s.z,m[l*3]=s.color[0],m[l*3+1]=s.color[1],m[l*3+2]=s.color[2],g[l]=s.size,f[l]=s.intensity,d=Math.max(d,Math.sqrt(s.x*s.x+s.y*s.y+s.z*s.z))}const h=I(new Yt);return h.setAttribute("position",new Q(v,3)),h.setAttribute("aPosition",new Q(v,3)),h.setAttribute("color",new Q(m,3)),h.setAttribute("aSize",new Q(g,1)),h.setAttribute("aIntensity",new Q(f,1)),h.computeBoundingSphere(),this.minOrbitRadius=Math.max(.15,d*.2),this.maxOrbitRadius=Math.max(4.5,d*5),this.orbitRadius=Math.max(this.minOrbitRadius*1.4,d*1.3),this.targetOrbitRadius=this.orbitRadius,this.perspectiveCamera.near=.01,this.perspectiveCamera.far=this.maxOrbitRadius*4,this.perspectiveCamera.updateProjectionMatrix(),new Qt(h,this.pointMaterial??void 0)}createMorphCloudObject(t){const e=this.extractPointCloudBands(),i=$e(e,Ee(e.width,e.height,t)),u=i.points.length,v=new Float32Array(u*3),m=new Float32Array(u*3),g=new Float32Array(u),f=new Float32Array(u),d=new Float32Array(u);for(let l=0;l<u;l+=1){const s=i.points[l];v[l*3]=s.x,v[l*3+1]=s.y,v[l*3+2]=s.z,m[l*3]=s.color[0],m[l*3+1]=s.color[1],m[l*3+2]=s.color[2],g[l]=s.size,f[l]=s.intensity,d[l]=s.filamentarity}const h=I(new Yt);return h.setAttribute("position",new Q(v,3)),h.setAttribute("aPosition",new Q(v,3)),h.setAttribute("color",new Q(m,3)),h.setAttribute("aSize",new Q(g,1)),h.setAttribute("aIntensity",new Q(f,1)),h.setAttribute("aFilamentarity",new Q(d,1)),h.computeBoundingSphere(),new Qt(h,this.morphMaterial??void 0)}extractPointCloudBands(){const t=v=>this.bandData[v]?v:v==="u"?"g":v==="z"?"i":this.bandData.u?"u":"g",e=this.bandData.i.tex.image,i=qt(e),u=Nt(e);return{width:i,height:u,bands:{u:this.extractSingleBand(t("u")),g:this.extractSingleBand(t("g")),r:this.extractSingleBand(t("r")),i:this.extractSingleBand(t("i")),z:this.extractSingleBand(t("z")),nuv:this.extractSingleBand(t("nuv"))}}}extractSingleBand(t){const i=this.bandData[t].tex.image,u=qt(i),v=Nt(i),m=document.createElement("canvas");m.width=u,m.height=v;const g=m.getContext("2d",{willReadFrequently:!0});if(!g)throw new Error(`Unable to create 2D context for band '${t}'`);g.drawImage(i,0,0,u,v);const f=g.getImageData(0,0,u,v).data,d=new Float32Array(u*v);for(let h=0,l=0;h<f.length;h+=4,l+=1)d[l]=(f[h]+f[h+1]+f[h+2])/765;return d}applyCurrentShaderMode(){const e=ft(this.currentShader)==="orbit";if(this.activeCamera=e?this.perspectiveCamera:this.orthographicCamera,this.mesh&&(this.mesh.visible=!e),this.pointCloud&&(this.pointCloud.visible=this.currentShader==="nsa3d"),this.morphCloud&&(this.morphCloud.visible=this.currentShader==="nsamorphology"),!e&&this.planeMaterial){const i=Bt[this.currentShader];this.planeMaterial.vertexShader=i.vert,this.planeMaterial.fragmentShader=i.frag,this.planeMaterial.needsUpdate=!0}}startAnimation(){const t=()=>{const e=this.clock.getElapsedTime();if(this.planeMaterial&&(this.planeMaterial.uniforms.uTime.value=e),this.pointMaterial&&(this.pointMaterial.uniforms.uTime.value=e),this.morphMaterial&&(this.morphMaterial.uniforms.uTime.value=e),ft(this.currentShader)==="image-plane"){Math.abs(this.velX)>this.velThreshold||Math.abs(this.velY)>this.velThreshold?(this.targetX+=this.velX,this.targetY+=this.velY,this.velX*=this.friction,this.velY*=this.friction):(this.velX=0,this.velY=0);const i=Math.max(0,1-1/this.targetZoom);this.targetX=Math.max(-i,Math.min(i,this.targetX)),this.targetY=Math.max(-i,Math.min(i,this.targetY));const u=this.lerpSpeed;this.orthographicCamera.zoom+=(this.targetZoom-this.orthographicCamera.zoom)*u,this.orthographicCamera.position.x+=(this.targetX-this.orthographicCamera.position.x)*u,this.orthographicCamera.position.y+=(this.targetY-this.orthographicCamera.position.y)*u,this.orthographicCamera.updateProjectionMatrix()}else this.updateOrbitCamera();this.render(),this.animationId=requestAnimationFrame(t)};this.animationId=requestAnimationFrame(t)}updateOrbitCamera(){this.targetOrbitPitch=Ct.clamp(this.targetOrbitPitch,-1.25,1.25),this.targetOrbitRadius=Ct.clamp(this.targetOrbitRadius,this.minOrbitRadius,this.maxOrbitRadius);const t=this.orbitLerpSpeed;this.orbitYaw+=(this.targetOrbitYaw-this.orbitYaw)*t,this.orbitPitch+=(this.targetOrbitPitch-this.orbitPitch)*t,this.orbitRadius+=(this.targetOrbitRadius-this.orbitRadius)*t;const e=Math.cos(this.orbitPitch);this.perspectiveCamera.position.set(Math.sin(this.orbitYaw)*e*this.orbitRadius,Math.sin(this.orbitPitch)*this.orbitRadius,Math.cos(this.orbitYaw)*e*this.orbitRadius),this.perspectiveCamera.lookAt(this.orbitTarget),this.perspectiveCamera.updateProjectionMatrix()}stopAnimation(){this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null)}setParams(t,e,i){this.planeMaterial&&(this.planeMaterial.uniforms.uQ.value=t,this.planeMaterial.uniforms.uAlpha.value=e,this.planeMaterial.uniforms.uSensitivity.value=i),this.pointMaterial&&(this.pointMaterial.uniforms.uQ.value=t,this.pointMaterial.uniforms.uAlpha.value=e,this.pointMaterial.uniforms.uSensitivity.value=i),this.morphMaterial&&(this.morphMaterial.uniforms.uQ.value=t,this.morphMaterial.uniforms.uAlpha.value=e,this.morphMaterial.uniforms.uSensitivity.value=i),this.render()}setBands(t,e,i){const u=this.bandData;!this.planeMaterial||!u[t]||!u[e]||!u[i]||(this.planeMaterial.uniforms.uBandR.value=u[t].tex,this.planeMaterial.uniforms.uBandG.value=u[e].tex,this.planeMaterial.uniforms.uBandB.value=u[i].tex,this.planeMaterial.uniforms.uRangeR.value=u[t].range,this.planeMaterial.uniforms.uRangeG.value=u[e].range,this.planeMaterial.uniforms.uRangeB.value=u[i].range)}setTheme(t){if(!this.planeMaterial&&!this.pointMaterial||this.currentTheme===t)return;const e=[this.planeMaterial,this.pointMaterial,this.morphMaterial].filter(Boolean);for(const i of e)i.uniforms.uGrayscale.value=0;if(t==="grayscale"){this.setBands("i","r","g");for(const i of e)i.uniforms.uGrayscale.value=1,i.uniforms.uTheme.value=0}else if(t==="infra"){this.setBands("i","r","g");for(const i of e)i.uniforms.uTheme.value=0}else if(t==="astral"){this.setBands(this.bandData.u?"u":"g","g","i");for(const i of e)i.uniforms.uTheme.value=1}this.currentTheme=t,this.render()}getAutoParams(){return this.autoParams}setShader(t){!this.planeMaterial&&!this.pointMaterial||this.currentShader===t||(this.currentShader=t,this.applyCurrentShaderMode(),this.render())}is3DMode(){return ft(this.currentShader)==="orbit"}supportsSkyPicking(){return ft(this.currentShader)==="image-plane"}render(){!this.planeMaterial&&!this.pointMaterial&&!this.morphMaterial||this.renderer.render(this.scene,this.activeCamera)}resize(t,e){if(this.width=t,this.height=e,this.renderer.setSize(t,e,!1),this.planeMaterial){const i=this.renderer.getPixelRatio();this.planeMaterial.uniforms.uResolution.value.set(t*i,e*i)}this.pointMaterial&&(this.pointMaterial.uniforms.uPixelRatio.value=this.renderer.getPixelRatio()),this.morphMaterial&&(this.morphMaterial.uniforms.uPixelRatio.value=this.renderer.getPixelRatio()),this.perspectiveCamera.aspect=t/Math.max(e,1),this.perspectiveCamera.updateProjectionMatrix(),this.render()}pan(t,e){if(this.is3DMode())return;const i=this.targetZoom,u=t/this.width*2/i,v=e/this.height*2/i;this.targetX-=u,this.targetY+=v,this.velX=0,this.velY=0}fling(t,e){if(this.is3DMode())return;const i=this.targetZoom;this.velX=-(t/this.width)*2/i,this.velY=e/this.height*2/i}zoomAt(t,e,i){if(this.is3DMode())return;const u=this.targetZoom,v=Math.max(1,Math.min(u*t,50)),m=e/this.width*2-1,g=-(i/this.height)*2+1,f=this.targetX+m/u,d=this.targetY+g/u;this.targetZoom=v,this.targetX=f-m/v,this.targetY=d-g/v,this.velX=0,this.velY=0}orbit(t,e){if(!this.is3DMode())return;const i=Qe({yaw:this.targetOrbitYaw,pitch:this.targetOrbitPitch},t,e);this.targetOrbitYaw=i.yaw,this.targetOrbitPitch=i.pitch}dolly(t){if(!this.is3DMode())return;const e=this.targetOrbitRadius/Math.max(t,.01);this.targetOrbitRadius=Ct.clamp(e,this.minOrbitRadius,this.maxOrbitRadius)}screenToRaDec(t,e,i){if(!this.supportsSkyPicking())return null;const u=this.orthographicCamera.zoom,v=t/this.width*2-1,m=-(e/this.height)*2+1,g=this.orthographicCamera.position.x+v/u,f=this.orthographicCamera.position.y+m/u,d=(g+1)/2,h=(f+1)/2;if(d<0||d>1||h<0||h>1)return null;const[l,s]=i.dimensions,b=d*l,y=(1-h)*s,w=b-l/2,p=y-s/2,M=(i.pixel_scale??.396)/3600,S=i.dec*Math.PI/180,C=i.dec-p*M;return{ra:i.ra-w*M/Math.cos(S),dec:C}}resetView(){if(this.is3DMode()){this.targetOrbitYaw=0,this.targetOrbitPitch=0,this.targetOrbitRadius=Math.max(this.minOrbitRadius*1.4,1.5);return}this.targetZoom=1,this.targetX=0,this.targetY=0,this.velX=0,this.velY=0}dispose(){var t,e,i;this.stopAnimation(),this.textures.forEach(u=>u.dispose()),this.textures=[],this.planeMaterial&&this.planeMaterial.dispose(),this.pointMaterial&&this.pointMaterial.dispose(),this.morphMaterial&&this.morphMaterial.dispose(),(t=this.mesh)!=null&&t.geometry&&this.mesh.geometry.dispose(),(e=this.pointCloud)!=null&&e.geometry&&this.pointCloud.geometry.dispose(),(i=this.morphCloud)!=null&&i.geometry&&this.morphCloud.geometry.dispose(),this.renderer.dispose()}}function qt(r){const t=r;return t.naturalWidth??t.videoWidth??t.width??0}function Nt(r){const t=r;return t.naturalHeight??t.videoHeight??t.height??0}const tn={class:"photo-scroll",ref:"scrollContainer"},en={class:"photo-page"},nn={class:"photo-hero"},an={class:"hero-content"},on={class:"photo-hero-title"},sn={class:"photo-hero-subtitle"},rn={key:0,class:"status-container"},ln={key:1,class:"status-container error"},un={key:2,class:"content-grid"},cn={class:"glass-card canvas-card"},hn={class:"card-header"},vn={class:"header-actions"},dn={class:"canvas-wrapper"},mn={key:0,class:"crosshair-overlay",style:{cursor:"crosshair"}},pn=["x1","x2","y2"],fn=["y1","x2","y2"],gn=["cx","cy"],xn={key:1,class:"coord-hud"},yn={class:"sidebar-stack"},bn={class:"glass-card controls-card"},wn={class:"card-header"},_n={class:"card-title"},Mn={class:"control-group"},Rn={class:"theme-toggle"},Sn=["onClick"],Cn={class:"control-group"},Bn={class:"label-row"},kn={class:"param-value"},Tn={class:"control-group"},Pn={class:"label-row"},Dn={class:"param-value"},zn={class:"control-group"},An={class:"label-row"},Fn={class:"param-value"},In={class:"glass-card bands-card"},Vn={class:"card-header"},Un={class:"card-title"},Gn={class:"bands-grid"},On=["onClick"],Yn={class:"band-img-wrap"},Qn=["src","alt"],Xn={class:"band-badge"},qn={class:"lightbox-content"},Nn={class:"lightbox-header"},Ln={class:"lightbox-title"},En={class:"lightbox-body"},$n={class:"lightbox-image-wrap"},Wn=["src","alt"],jn={class:"lightbox-controls"},Hn={class:"lb-control-group"},Zn=["value"],Jn={class:"lb-control-group"},Kn={class:"lb-control-group"},ta={key:0,class:"info-sidebar"},ea={class:"sidebar-content"},na={class:"sidebar-title"},aa={class:"sidebar-section"},ia={class:"sidebar-section"},oa={class:"tooltip-content"},sa={key:0,class:"loading-state"},ra={key:1,class:"error-state"},la={key:2,class:"empty-state"},ua={key:3,class:"results-list"},ca=["href"],ha={class:"obj-name"},va={class:"obj-type"},da=ce({__name:"GalaxyPhotoView",setup(r){const{t}=he(),e=fe(),i=xe(),{ready:u,getGalaxyByPgc:v}=ye(),{loading:m,results:g,query:f,error:d}=ze(),h=nt(()=>{const o=g.value.filter(n=>n.type==="Star"||n.type==="Galaxy");return o.length>0?o:g.value.slice(0,5)}),l=Number(e.params.pgc),s=_(null),b=_(null),y=_(null),w=_(!0),p=ge(null),M=_(10),S=_(.0515),C=_(1),z=_(null),X=_(null),j=nt(()=>{var o;return((o=y.value)==null?void 0:o.bands)||["u","g","r","i","z"]}),Y=_("astral"),B=_("lupton"),U=nt(()=>B.value==="nsa3d"||B.value==="nsamorphology"),$=_(!1),G=_(!1),D=_({visible:!1,x:0,y:0,objects:[]}),q=_(!1),J=_(0),K=_(0),A=new Map;let H=-1,O=[];const W=_(null),tt=_(null);let at=-1,lt=-1;const ut=_(0),ct=_(0),xt=_(0),yt=_(0),ht=_(100),vt=_(100),it=_("none"),$t=[{label:"Normal",value:"none"},{label:"Negative",value:"invert(1)"},{label:"Cyanotype",value:"sepia(1) hue-rotate(180deg) saturate(1.5)"},{label:"Amber",value:"sepia(1) saturate(1.5)"},{label:"Hard",value:"contrast(1.5) brightness(0.9)"}],Wt=nt(()=>{const o=`brightness(${ht.value}%) contrast(${vt.value}%)`,n=it.value!=="none"?it.value:"";return{filter:`${o} ${n}`}}),jt=nt(()=>{const x=D.value.x,c=D.value.y-120-16;return{left:x+"px",top:Math.max(60,c)+"px"}}),Ht=nt(()=>!U.value&&W.value!==null&&tt.value!==null);function kt(){if(!p.value||!y.value)return;const{Q:o,alpha:n,sensitivity:x}=gt(y.value,B.value);M.value=o,S.value=n,C.value=x,ot(),B.value==="lupton"&&(N.Q=o,N.alpha=n,N.sensitivity=x)}function Tt(){i.push(`/g/${l}`)}function ot(){p.value&&p.value.setParams(M.value,S.value,C.value)}zt(Y,o=>{p.value&&p.value.setTheme(o)});const N={Q:10,alpha:.1555,sensitivity:.88};zt(B,(o,n)=>{if(p.value){if(n==="lupton"&&(N.Q=M.value,N.alpha=S.value,N.sensitivity=C.value),o==="lupton"&&y.value){const x=N,c=gt(y.value,"lupton");M.value=x.Q!==c.Q?x.Q:c.Q,S.value=x.alpha!==c.alpha?x.alpha:c.alpha,C.value=x.sensitivity}else if(y.value){const x=gt(y.value,o);M.value=x.Q,S.value=x.alpha,C.value=x.sensitivity}(o==="nsa3d"||o==="nsamorphology")&&(G.value=!1,D.value.visible=!1,W.value=null,tt.value=null),p.value.setShader(o),ot()}});function Zt(o){z.value=o,ht.value=100,vt.value=100,it.value="none"}function Pt(){z.value=null}function Jt(){U.value||(G.value=!G.value,D.value.visible=!1)}function Kt(o){if(o.preventDefault(),!p.value||!s.value)return;const n=o.deltaY>0?.9:1.1,x=s.value.getBoundingClientRect(),c=o.clientX-x.left,P=o.clientY-x.top;p.value.is3DMode()?p.value.dolly(n):(p.value.zoomAt(n,c,P),dt())}function Dt(){const[o,n]=Array.from(A.values()),x=o.clientX-n.clientX,c=o.clientY-n.clientY;return Math.sqrt(x*x+c*c)}function te(){const[o,n]=Array.from(A.values());return{x:(o.clientX+n.clientX)/2,y:(o.clientY+n.clientY)/2}}function ee(o){!p.value||!s.value||(s.value.setPointerCapture(o.pointerId),A.set(o.pointerId,o),A.size===1?(q.value=!0,J.value=o.clientX,K.value=o.clientY,O=[{x:o.clientX,y:o.clientY,t:performance.now()}]):A.size===2&&(q.value=!1,H=Dt()))}function ne(o){if(!(!p.value||!s.value)&&A.has(o.pointerId)){if(A.set(o.pointerId,o),A.size===1&&q.value){const n=o.clientX-J.value,x=o.clientY-K.value;p.value.is3DMode()?p.value.orbit(n,x):p.value.pan(n,x),J.value=o.clientX,K.value=o.clientY;const c=performance.now();for(O.push({x:o.clientX,y:o.clientY,t:c});O.length>1&&c-O[0].t>80;)O.shift();p.value.is3DMode()||dt()}else if(A.size===2){const n=Dt();if(H>0){const x=n/H,c=te(),P=s.value.getBoundingClientRect();p.value.is3DMode()?p.value.dolly(x):p.value.zoomAt(x,c.x-P.left,c.y-P.top)}H=n,p.value.is3DMode()||dt()}}}function bt(o){if(!s.value)return;const n=q.value&&A.size===1;if(s.value.releasePointerCapture(o.pointerId),A.delete(o.pointerId),A.size<2&&(H=-1),A.size===1){const x=A.values().next().value;x&&(J.value=x.clientX,K.value=x.clientY),q.value=!0}else{if(q.value=!1,n&&p.value&&!p.value.is3DMode()&&O.length>=2){const x=O[0],c=O[O.length-1],P=(c.t-x.t)/1e3;if(P>.005){const E=(c.x-x.x)/P*.016,ue=(c.y-x.y)/P*.016;p.value.fling(E,ue)}}O=[]}}function ae(o){const n=o/15,x=Math.floor(n),c=Math.floor((n-x)*60),P=((n-x)*60-c)*60;return`${String(x).padStart(2,"0")}h${String(c).padStart(2,"0")}m${P.toFixed(1).padStart(4,"0")}s`}function ie(o){const n=o>=0?"+":"-",x=Math.abs(o),c=Math.floor(x),P=Math.floor((x-c)*60),E=((x-c)*60-P)*60;return`${n}${String(c).padStart(2,"0")}°${String(P).padStart(2,"0")}'${E.toFixed(1).padStart(4,"0")}"`}function dt(){if(!p.value||!y.value||at<0||!p.value.supportsSkyPicking())return;const o=p.value.screenToRaDec(at,lt,y.value);o?(W.value=o.ra,tt.value=o.dec):(W.value=null,tt.value=null)}function oe(o){if(U.value||!s.value)return;const n=s.value.getBoundingClientRect();at=o.clientX-n.left,lt=o.clientY-n.top,G.value&&(ut.value=at,ct.value=lt),dt()}async function se(o){if(!G.value||!s.value||!y.value||!p.value||!p.value.supportsSkyPicking())return;const n=s.value.getBoundingClientRect(),x=o.clientX-n.left,c=o.clientY-n.top,P=p.value.screenToRaDec(x,c,y.value);if(P){D.value={visible:!0,x:o.clientX,y:o.clientY,objects:[],error:void 0};try{await f(P.ra,P.dec,30),d.value?D.value.error=d.value:D.value.objects=h.value.map(E=>({name:E.name,type:E.type,simbadUrl:E.simbadUrl}))}catch(E){D.value.error="Failed to query SIMBAD",console.error("SIMBAD query error:",E)}}}function re(){at=-1,lt=-1,W.value=null,tt.value=null}async function le(){try{const o=await fetch(`/galaxy-img/${l}/metadata.json`);o.ok&&(y.value=await o.json())}catch(o){console.error("Failed to load NSA metadata:",o)}}return ve(async()=>{if(await u,b.value=v(l),await le(),w.value=!1,await de(),y.value&&s.value){await new Promise(o=>setTimeout(o,0));try{if(p.value=new Ke(s.value),await p.value.load(l,y.value),p.value.setParams(M.value,S.value,C.value),p.value.setTheme(Y.value),kt(),N.Q=M.value,N.alpha=S.value,N.sensitivity=C.value,X.value=new ResizeObserver(()=>{if(p.value&&s.value){const o=s.value.parentElement.getBoundingClientRect();p.value.resize(o.width,o.height),xt.value=o.width,yt.value=o.height}}),X.value.observe(s.value.parentElement),s.value.parentElement){const o=s.value.parentElement.getBoundingClientRect();xt.value=o.width,yt.value=o.height}}catch(o){console.error("Failed to load NSA scene:",o)}}}),me(()=>{var o;(o=X.value)==null||o.disconnect(),p.value&&p.value.dispose()}),(o,n)=>{var x;return T(),k("div",tn,[a("div",en,[a("section",nn,[a("div",an,[a("button",{class:"back-link",onClick:Tt},[n[10]||(n[10]=a("span",null,"←",-1)),st(" "+R(V(t)("pages.galaxyPhoto.back")||"Back to Galaxy"),1)]),a("h1",on,[n[11]||(n[11]=a("span",{class:"title-accent"},"PGC",-1)),st(" "+R(((x=b.value)==null?void 0:x.pgc)||V(l)),1)]),a("p",sn,R(V(t)("pages.galaxyPhoto.title")),1)])]),w.value?(T(),k("div",rn,[n[12]||(n[12]=a("div",{class:"loading-spinner"},null,-1)),a("p",null,R(V(t)("app.loading")),1)])):y.value?(T(),k("div",un,[a("div",cn,[a("div",hn,[n[14]||(n[14]=a("h2",{class:"card-title"},"Composite Imaging",-1)),a("div",vn,[Z(a("select",{"onUpdate:modelValue":n[0]||(n[0]=c=>B.value=c),class:"shader-select"},[...n[13]||(n[13]=[pe('<option value="lupton" data-v-9b22e74b>Lupton et al.</option><option value="custom" data-v-9b22e74b>Custom</option><option value="volumetric" data-v-9b22e74b>Volumetric</option><option value="nsa3d" data-v-9b22e74b>NSA 3D</option><option value="nsamorphology" data-v-9b22e74b>Morphology 3D</option>',5)])],512),[[At,B.value]]),U.value?et("",!0):(T(),k("button",{key:0,class:Ft(["find-objects-btn",{active:G.value}]),onClick:Jt,"aria-label":"Find objects at location",title:"Click to activate, then click canvas to query SIMBAD"}," ✦ ",2)),a("button",{class:"info-btn",onClick:n[1]||(n[1]=c=>$.value=!$.value),"aria-label":"Info"}," i ")])]),a("div",dn,[a("canvas",{ref_key:"canvasEl",ref:s,class:"composite-canvas",onWheel:It(Kt,["prevent"]),onClick:se,onPointerdown:ee,onPointermove:ne,onPointerup:bt,onPointercancel:bt,onPointerleave:bt,onMousemove:oe,onMouseleave:re},null,544),G.value?(T(),k("svg",mn,[a("line",{x1:ut.value,y1:"0",x2:ut.value,y2:yt.value,class:"crosshair-line"},null,8,pn),a("line",{x1:"0",y1:ct.value,x2:xt.value,y2:ct.value,class:"crosshair-line"},null,8,fn),a("circle",{cx:ut.value,cy:ct.value,r:"4",class:"crosshair-dot"},null,8,gn)])):et("",!0),Ht.value?(T(),k("div",xn,[n[15]||(n[15]=a("span",{class:"coord-label"},"RA",-1)),st(" "+R(ae(W.value))+"   ",1),n[16]||(n[16]=a("span",{class:"coord-label"},"Dec",-1)),st(" "+R(ie(tt.value)),1)])):et("",!0)])]),a("div",yn,[a("div",bn,[a("div",wn,[a("h2",_n,R(V(t)("pages.galaxyPhoto.params.title")||"Rendering Parameters"),1),a("button",{class:"best-fit-btn",onClick:kt,title:"Reset to auto-calibrated values"}," Best Fit ")]),a("div",Mn,[n[17]||(n[17]=a("label",null,"Spectral Theme",-1)),a("div",Rn,[(T(),k(mt,null,pt([{id:"grayscale",label:"Grayscale"},{id:"infra",label:"Infrared"},{id:"astral",label:"Astral"}],c=>a("button",{key:c.id,class:Ft(["theme-btn",{active:Y.value===c.id}]),onClick:P=>Y.value=c.id},R(c.label),11,Sn)),64))])]),a("div",Cn,[a("div",Bn,[a("label",null,R(V(t)("pages.galaxyPhoto.params.q"))+" (Stretch)",1),a("span",kn,R(M.value.toFixed(1)),1)]),Z(a("input",{"onUpdate:modelValue":n[2]||(n[2]=c=>M.value=c),type:"range",min:"1",max:"100",step:"0.5",class:"custom-range",onInput:ot},null,544),[[rt,M.value,void 0,{number:!0}]])]),a("div",Tn,[a("div",Pn,[a("label",null,R(V(t)("pages.galaxyPhoto.params.alpha"))+" (Brightness)",1),a("span",Dn,R(S.value.toFixed(4)),1)]),Z(a("input",{"onUpdate:modelValue":n[3]||(n[3]=c=>S.value=c),type:"range",min:"0.001",max:"10.0",step:"0.001",class:"custom-range",onInput:ot},null,544),[[rt,S.value,void 0,{number:!0}]])]),a("div",zn,[a("div",An,[n[18]||(n[18]=a("label",null,"Sensitivity",-1)),a("span",Fn,R(C.value.toFixed(2)),1)]),Z(a("input",{"onUpdate:modelValue":n[4]||(n[4]=c=>C.value=c),type:"range",min:"0.01",max:"1.0",step:"0.01",class:"custom-range",onInput:ot},null,544),[[rt,C.value,void 0,{number:!0}]])])]),a("div",In,[a("div",Vn,[a("h2",Un,R(V(t)("pages.galaxyPhoto.bands")),1)]),a("div",Gn,[(T(!0),k(mt,null,pt(j.value,c=>(T(),k("div",{key:c,class:"band-item",onClick:P=>Zt(c)},[a("div",Yn,[a("img",{src:`/galaxy-img/${V(l)}/${c}.webp`,alt:`${c}-band`,loading:"lazy"},null,8,Qn),n[19]||(n[19]=a("div",{class:"band-overlay"},[a("span",{class:"zoom-icon"},"⤢")],-1))]),a("span",Xn,R(c),1)],8,On))),128))])])])])):(T(),k("div",ln,[a("p",null,R(V(t)("pages.galaxyPhoto.notAvailable")),1),a("button",{class:"action-btn",onClick:Tt},"Return to Map")]))]),_t(Rt,{name:"fade"},{default:Mt(()=>[z.value?(T(),k("div",{key:0,class:"lightbox",onClick:It(Pt,["self"])},[a("div",qn,[a("button",{class:"lightbox-close",onClick:Pt},"×"),a("div",Nn,[a("h2",Ln,R(z.value)+"-band Raw Data",1),n[20]||(n[20]=a("span",{class:"lightbox-subtitle"},"Sloan Digital Sky Survey",-1))]),a("div",En,[a("div",$n,[a("img",{class:"lightbox-image",src:`/galaxy-img/${V(l)}/${z.value}.webp`,alt:`${z.value}-band`,style:Vt(Wt.value)},null,12,Wn),a("div",jn,[a("div",Hn,[n[21]||(n[21]=a("label",null,"Filter",-1)),Z(a("select",{"onUpdate:modelValue":n[5]||(n[5]=c=>it.value=c),class:"lb-select"},[(T(),k(mt,null,pt($t,c=>a("option",{key:c.label,value:c.value},R(c.label),9,Zn)),64))],512),[[At,it.value]])]),a("div",Jn,[n[22]||(n[22]=a("label",null,"Brightness",-1)),Z(a("input",{type:"range","onUpdate:modelValue":n[6]||(n[6]=c=>ht.value=c),min:"0",max:"200",class:"custom-range"},null,512),[[rt,ht.value,void 0,{number:!0}]])]),a("div",Kn,[n[23]||(n[23]=a("label",null,"Contrast",-1)),Z(a("input",{type:"range","onUpdate:modelValue":n[7]||(n[7]=c=>vt.value=c),min:"0",max:"200",class:"custom-range"},null,512),[[rt,vt.value,void 0,{number:!0}]])])])])])])])):et("",!0)]),_:1}),_t(Rt,{name:"sidebar"},{default:Mt(()=>[$.value?(T(),k("div",ta,[a("div",ea,[a("button",{class:"sidebar-close",onClick:n[8]||(n[8]=c=>$.value=!1)},"×"),a("h2",na,R(V(t)("pages.galaxyPhoto.info.title")),1),a("div",aa,[n[24]||(n[24]=a("h3",null,"Data Source",-1)),a("p",null,R(V(t)("pages.galaxyPhoto.info.dataSource")),1)]),a("div",ia,[a("h3",null,R(B.value==="lupton"?"Lupton Composite":B.value==="custom"?"Custom Composite":B.value==="volumetric"?"Volumetric Rendering":B.value==="nsa3d"?"NSA 3D Point Cloud":"Morphology 3D"),1),a("p",null,R(V(t)("pages.galaxyPhoto.info."+B.value)),1)])])])):et("",!0)]),_:1}),_t(Rt,{name:"fade"},{default:Mt(()=>[D.value.visible?(T(),k("div",{key:0,class:"simbad-tooltip",style:Vt(jt.value)},[n[28]||(n[28]=a("div",{class:"tooltip-arrow"},null,-1)),a("div",oa,[V(m)?(T(),k("div",sa,[...n[25]||(n[25]=[a("div",{class:"mini-spinner"},null,-1),a("span",null,"Querying SIMBAD...",-1)])])):D.value.error?(T(),k("div",ra,[n[26]||(n[26]=a("span",{class:"error-icon"},"⚠",-1)),st(" "+R(D.value.error),1)])):D.value.objects.length===0?(T(),k("div",la," No objects found ")):(T(),k("div",ua,[(T(!0),k(mt,null,pt(D.value.objects,c=>(T(),k("a",{key:c.name,href:c.simbadUrl,target:"_blank",rel:"noopener noreferrer",class:"result-item result-link"},[a("span",ha,R(c.name),1),a("span",va,R(c.type),1),n[27]||(n[27]=a("span",{class:"link-icon"},"↗",-1))],8,ca))),128))])),a("button",{class:"tooltip-close",onClick:n[9]||(n[9]=c=>D.value.visible=!1)},"×")])],4)):et("",!0)]),_:1})],512)}}}),ya=De(da,[["__scopeId","data-v-9b22e74b"]]);export{ya as default};
