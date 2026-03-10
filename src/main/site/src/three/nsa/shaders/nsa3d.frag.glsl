precision highp float;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Simple white mesh with slight depth-based darkening
  float depth = length(vPosition); // Distance from origin
  float brightness = 1.0 - (depth * 0.1); // Darken farther layers slightly
  brightness = clamp(brightness, 0.5, 1.0); // Keep reasonable brightness range

  gl_FragColor = vec4(vec3(brightness), 1.0);
}
