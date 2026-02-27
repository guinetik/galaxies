attribute float aSize;
attribute vec4 aColor;

uniform float uPixelRatio;

varying vec4 vColor;

void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (600.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
