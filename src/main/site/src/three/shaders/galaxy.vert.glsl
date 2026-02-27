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

  // Smooth fade based on redshift distance from cutoff
  // Uses smoothstep for eased fade-in as galaxies enter visible range
  if (aRedshift < 0.0 || aRedshift > uMaxRedshift) {
    vAlpha = 0.0;
  } else {
    // Fade in over the last 40% of visible range for a gentler transition
    float fadeStart = uMaxRedshift * 0.6;
    vAlpha = aRedshift < fadeStart
      ? 1.0
      : smoothstep(uMaxRedshift, fadeStart, aRedshift);
  }

  // Twinkle effect
  float twinkle = sin(uTime * 2.0 + position.x * 0.1 + position.z * 0.07) * 0.15 + 1.0;

  // Scale size with fade so galaxies grow in as they appear
  float sizeScale = mix(0.5, 1.0, vAlpha);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (3000.0 / -mvPosition.z) * twinkle * sizeScale;
  gl_Position = projectionMatrix * mvPosition;
}
