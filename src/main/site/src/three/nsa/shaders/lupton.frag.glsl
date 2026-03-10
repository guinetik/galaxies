precision highp float;

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
