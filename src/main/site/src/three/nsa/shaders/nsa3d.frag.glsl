precision highp float;

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
