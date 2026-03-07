attribute float aSize;

uniform float uPixelRatio;
uniform float uBaseDistance;
uniform float uOcclusionScale;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float pointSize = aSize * uPixelRatio * (uBaseDistance * 1.28 / -mvPosition.z) * uOcclusionScale;
  gl_PointSize = clamp(pointSize, 1.5 * uPixelRatio, 18.0 * uPixelRatio);
  gl_Position = projectionMatrix * mvPosition;
}
