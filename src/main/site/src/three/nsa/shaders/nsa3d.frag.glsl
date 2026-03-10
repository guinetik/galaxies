precision highp float;

varying vec3 vPosition;

void main() {
  // Simple white mesh with depth-based dimming
  // Layers positioned at explicit z-depths: 0 (bright) to -zDepthScale (dim)
  float depth = abs(vPosition.z);
  float brightness = 1.0 - (depth * 0.5); // Adjust brightness falloff
  brightness = clamp(brightness, 0.2, 1.0); // Keep visible range

  gl_FragColor = vec4(vec3(brightness), 1.0);
}
