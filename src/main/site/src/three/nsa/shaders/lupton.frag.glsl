precision highp float;

uniform sampler2D uBandR;      // i-band → Red
uniform sampler2D uBandG;      // r-band → Green
uniform sampler2D uBandB;      // g-band → Blue

uniform float uAlpha;          // linear stretch factor (~0.02)
uniform float uQ;              // softening parameter (~8.0)

uniform vec2 uRangeR;          // [min, max] for i-band
uniform vec2 uRangeG;          // [min, max] for r-band
uniform vec2 uRangeB;          // [min, max] for g-band

varying vec2 vUV;

// Manual asinh for GLSL ES 1.0 compatibility
float asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

// Lupton asinh stretch function
float asinhStretch(float x) {
  float arg = uAlpha * uQ * x;
  return asinh(arg) / uQ;
}

void main() {
  // Sample textures (values in [0,1] from WebP)
  float r_raw = texture2D(uBandR, vUV).r;
  float g_raw = texture2D(uBandG, vUV).r;
  float b_raw = texture2D(uBandB, vUV).r;

  // Rescale from [0,1] back to physical units using data_ranges
  // physical = min + webp_value * (max - min)
  float r = mix(uRangeR.x, uRangeR.y, r_raw);
  float g = mix(uRangeG.x, uRangeG.y, g_raw);
  float b = mix(uRangeB.x, uRangeB.y, b_raw);

  // Clamp negatives (sky subtraction can produce negative values)
  r = max(r, 0.0);
  g = max(g, 0.0);
  b = max(b, 0.0);

  // Compute combined intensity (Eq. 2 from Lupton et al.)
  float I = (r + g + b) / 3.0;

  // Apply asinh stretch to intensity
  float fI = asinhStretch(I);

  // Scale each band by f(I)/I to preserve color
  vec3 rgb = vec3(0.0);
  if (I > 0.0) {
    float scale = fI / I;
    rgb = vec3(r * scale, g * scale, b * scale);
  }

  // Clip intensity at unity, preserve color by dividing by max
  float maxRGB = max(rgb.r, max(rgb.g, rgb.b));
  if (maxRGB > 1.0) {
    rgb /= maxRGB;
  }

  // Final clamp to [0,1]
  rgb = clamp(rgb, 0.0, 1.0);

  gl_FragColor = vec4(rgb, 1.0);
}
