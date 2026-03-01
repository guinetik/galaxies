attribute vec3 aColor;
attribute float aSize;

uniform float uPixelRatio;
uniform float uTime;

varying vec3 vColor;

void main() {
  vColor = aColor;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Fixed screen-space size with subtle distance attenuation
  // Closer points slightly larger for depth perception
  float dist = length(mvPosition.xyz);
  float attenuation = 300.0 / max(dist, 1.0);
  float size = aSize * uPixelRatio * (0.8 + clamp(attenuation, 0.0, 1.5));

  gl_PointSize = max(1.5 * uPixelRatio, size);
  gl_Position = projectionMatrix * mvPosition;
}
