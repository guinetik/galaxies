precision highp float;

varying float vDepth;
varying vec2 vUv;

uniform float uGridLines;
uniform float uTime;

void main() {
  // Grid line detection via UV fract
  vec2 gridUV = vUv * uGridLines;
  vec2 gridFrac = abs(fract(gridUV - 0.5) - 0.5);
  vec2 gridWidth = fwidth(gridUV);
  vec2 line = smoothstep(gridWidth * 0.5, gridWidth * 1.5, gridFrac);
  float gridLine = 1.0 - min(line.x, line.y);

  // Discard non-wireframe pixels
  if (gridLine < 0.01) discard;

  // Glow: base cyan, brightening to white at deep wells
  float glow = 0.4 + vDepth * 0.6;
  vec3 cyanBase = vec3(0.133, 0.827, 0.933); // #22d3ee
  vec3 white = vec3(1.0);
  vec3 color = mix(cyanBase * 0.6, mix(cyanBase, white, vDepth * 0.5), glow);

  // Subtle pulse at deep wells
  float pulse = 1.0 + 0.08 * sin(uTime * 2.0) * vDepth;

  // Boost line alpha so flat regions are clearly visible
  float alpha = gridLine * (0.5 + glow * 0.5);
  gl_FragColor = vec4(color * pulse, alpha);
}
