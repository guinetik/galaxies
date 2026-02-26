attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;
attribute float aTexIndex;

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;

void main() {
  vColor = aColor;
  vTexIndex = aTexIndex;

  // Fade out galaxies near the redshift cutoff (smooth spawn-in)
  float redshiftRatio = aRedshift / uMaxRedshift;
  if (aRedshift > uMaxRedshift || aRedshift < 0.0) {
    vAlpha = 0.0;
  } else if (redshiftRatio > 0.8) {
    // Fade in over the last 20% of the visible range
    vAlpha = 1.0 - (redshiftRatio - 0.8) / 0.2;
  } else {
    vAlpha = 1.0;
  }

  // Twinkle effect
  float twinkle = sin(uTime * 2.0 + position.x * 0.1 + position.z * 0.07) * 0.15 + 1.0;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z) * twinkle;
  gl_Position = projectionMatrix * mvPosition;
}
