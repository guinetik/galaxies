precision highp float;

uniform sampler2D uBandR;
uniform sampler2D uBandG;
uniform sampler2D uBandB;
uniform float uAlpha;
uniform float uQ;
uniform vec2 uRangeR;
uniform vec2 uRangeG;
uniform vec2 uRangeB;

varying vec2 vUV;

void main() {
  // Sample the three band textures
  float r_raw = texture2D(uBandR, vUV).r;
  float g_raw = texture2D(uBandG, vUV).r;
  float b_raw = texture2D(uBandB, vUV).r;

  // Denormalize from [0,1] to original FITS data range
  float r = r_raw * (uRangeR.y - uRangeR.x) + uRangeR.x;
  float g = g_raw * (uRangeG.y - uRangeG.x) + uRangeG.x;
  float b = b_raw * (uRangeB.y - uRangeB.x) + uRangeB.x;

  // Clamp negative values
  r = max(r, 0.0);
  g = max(g, 0.0);
  b = max(b, 0.0);

  // Apply contrast (Q) via power curve
  float contrast = 0.3 + (uQ / 30.0);
  float R = pow(r, contrast);
  float G = pow(g, contrast);
  float B = pow(b, contrast);

  // Normalize to [0, 1] first to get color balance
  float maxVal = max(max(R, G), B);
  if (maxVal > 0.0) {
    R /= maxVal;
    G /= maxVal;
    B /= maxVal;
  }

  // Now apply brightness multiplier AFTER normalization
  // This way brightness actually changes the output intensity
  float brightness = uAlpha * 100.0;
  R = min(R * brightness, 1.0);
  G = min(G * brightness, 1.0);
  B = min(B * brightness, 1.0);

  gl_FragColor = vec4(R, G, B, 1.0);
}
