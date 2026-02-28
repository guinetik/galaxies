attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;
attribute float aTexIndex;

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;
uniform float uFov;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;

void main() {
  vColor = aColor;
  vTexIndex = aTexIndex;

  // Smooth fade based on redshift distance from cutoff
  if (aRedshift < 0.0 || aRedshift > uMaxRedshift) {
    vAlpha = 0.0;
  } else {
    float fadeStart = uMaxRedshift * 0.6;
    vAlpha = aRedshift < fadeStart
      ? 1.0
      : smoothstep(uMaxRedshift, fadeStart, aRedshift);
  }

  // Galaxies should feel stable; keep only a very subtle pulse.
  float twinkle = sin(uTime * 0.6 + aTexIndex * 0.7) * 0.03 + 1.0;

  // Scale size with fade so galaxies grow in as they appear
  float sizeScale = mix(0.5, 1.0, vAlpha);

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;
  // Bring texture detail in earlier so points read as galaxies, not debug squares.
  vDetailMix = smoothstep(80.0, 40.0, uFov);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Base marker stays visible at all zoom levels to avoid LOD dead zones.
  float basePx = aSize * uPixelRatio * fovScale * twinkle * sizeScale * 3.0;
  float detailBoost = mix(1.0, 1.35, vDetailMix);
  float farBoost = mix(1.32, 1.0, vDetailMix);
  gl_PointSize = max(2.3 * uPixelRatio, basePx * detailBoost * farBoost);
  gl_Position = projectionMatrix * mvPosition;
}
