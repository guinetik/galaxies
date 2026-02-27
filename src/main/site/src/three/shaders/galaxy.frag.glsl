varying vec3 vColor;
varying float vAlpha;

void main() {
  if (vAlpha < 0.01) discard;

  // Soft circular dot with bright core and gentle falloff
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  float alpha = vAlpha * smoothstep(0.5, 0.15, dist);
  if (alpha < 0.01) discard;

  // Bright core glow
  float core = exp(-dist * dist * 20.0);
  vec3 finalColor = vColor * (1.0 + core * 0.5);

  gl_FragColor = vec4(finalColor, alpha);
}
