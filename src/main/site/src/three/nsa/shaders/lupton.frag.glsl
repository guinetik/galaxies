precision highp float;

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
