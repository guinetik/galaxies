attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;
uniform float uFov;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = aColor;

  // Smooth fade based on redshift distance from cutoff
  if (aRedshift < 0.0 || aRedshift > uMaxRedshift) {
    vAlpha = 0.0;
  } else {
    float fadeStart = uMaxRedshift * 0.6;
    vAlpha = aRedshift < fadeStart
      ? 1.0
      : smoothstep(uMaxRedshift, fadeStart, aRedshift);
  }

  // Subtle twinkle
  float twinkle = sin(uTime * 2.0 + position.x * 0.1 + position.z * 0.07) * 0.1 + 1.0;

  // Scale size with fade so galaxies grow in as they appear
  float sizeScale = mix(0.5, 1.0, vAlpha);

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Base ~4px at default zoom, grows when zooming in
  gl_PointSize = aSize * uPixelRatio * fovScale * twinkle * sizeScale * 3.0;
  gl_Position = projectionMatrix * mvPosition;
}
