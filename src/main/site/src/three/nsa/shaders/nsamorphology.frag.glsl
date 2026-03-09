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
