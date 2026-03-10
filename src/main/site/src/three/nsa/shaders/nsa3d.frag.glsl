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

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float r = length(p);
  if (r > 0.5) {
    discard;
  }

  // Soft gaussian falloff — large overlap creates smooth continuous appearance
  float gauss = exp(-r * r * 6.0);

  // Lupton-style asinh stretch for proper dynamic range
  float boosted = pow(vIntensity, 0.45) * (0.4 + uAlpha * 0.6);
  float stretch = safe_asinh(boosted * (1.0 + uQ * 0.1)) / max(1.0 + uQ * 0.1, 1.0);
  stretch = max(stretch, 0.02);

  float sensitivityBoost = mix(0.5, 1.3, uSensitivity);

  // ── Theme-aware color ──
  // Convert spectral color to luminance for remapping
  float lum = dot(vColor, vec3(0.2126, 0.7152, 0.0722));

  // Infrared (uTheme=0): warm palette — amber/gold from IR bands
  vec3 warmColor = vColor * vec3(1.2, 0.7, 0.3);

  // Astral (uTheme=1): cool palette — remap to blue/cyan/violet
  vec3 coolColor = vec3(
    lum * 0.3 + vColor.b * 0.2,
    lum * 0.4 + vColor.g * 0.3,
    lum * 0.9 + vColor.b * 0.4
  );

  vec3 themedColor = mix(warmColor, coolColor, uTheme);

  vec3 col = themedColor * stretch * sensitivityBoost * gauss;

  // Core glow: slightly desaturated for natural bright-core look
  float coreBrightness = pow(gauss, 3.0) * stretch * 0.3;
  vec3 coreTint = themedColor * 0.6 + 0.4;
  col += coreTint * coreBrightness;

  col = clamp(col, 0.0, 1.0);

  // Alpha: gaussian falloff with intensity gating
  float alpha = gauss * stretch * sensitivityBoost * 1.5;
  alpha = clamp(alpha, 0.0, 1.0);

  // Noise floor: fade sub-signal points
  float signal = smoothstep(0.03, 0.10, vIntensity);
  alpha *= signal;

  // Grayscale support
  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(mix(col, vec3(gray), uGrayscale), alpha);
}
