precision highp float;

varying vec3 vColor;

void main() {
  // Soft circular point with glow
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);

  // Core + halo falloff
  float core = exp(-dist * dist * 18.0);
  float halo = 1.0 - smoothstep(0.1, 0.5, dist);

  float alpha = core * 0.8 + halo * 0.3;
  if (alpha < 0.01) discard;

  // Bright core fading to colored halo
  vec3 color = mix(vColor, vec3(1.0), core * 0.4);

  gl_FragColor = vec4(color, alpha);
}
