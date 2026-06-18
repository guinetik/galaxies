attribute float aSize;
attribute vec4 aColor;

uniform float uPixelRatio;
uniform float uBaseDistance;

varying vec4 vColor;

void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Give the fragment shader room for a corona while capping the largest
  // sprites well before they bloom into soft blobs.
  float pointSize = aSize * uPixelRatio * (uBaseDistance * 1.28 / -mvPosition.z);
  gl_PointSize = clamp(pointSize, 1.0 * uPixelRatio, 5.0 * uPixelRatio);
  gl_Position = projectionMatrix * mvPosition;
}
