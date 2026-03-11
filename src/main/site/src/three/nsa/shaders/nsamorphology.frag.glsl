precision highp float;

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
