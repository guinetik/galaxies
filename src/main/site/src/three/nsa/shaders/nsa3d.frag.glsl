precision highp float;

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
