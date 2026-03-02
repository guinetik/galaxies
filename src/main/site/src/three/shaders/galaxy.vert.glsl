attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;
attribute float aTexIndex;
attribute float aSelected;

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;
uniform float uFov;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;

void main() {
  vColor = aColor;
  vTexIndex = aTexIndex;
  vSelected = aSelected;

  // Smooth fade based on redshift distance from cutoff
  if (aRedshift < 0.0 || aRedshift > uMaxRedshift) {
    vAlpha = 0.0;
  } else {
    float fadeStart = uMaxRedshift * 0.6;
    vAlpha = aRedshift < fadeStart
      ? 1.0
      : smoothstep(uMaxRedshift, fadeStart, aRedshift);
  }

  // Scale size with fade so galaxies grow in as they appear
  float sizeScale = mix(0.5, 1.0, vAlpha);

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;
  // Default view (60°) stays low-LOD dots; detail appears only once zooming in.
  vDetailMix = smoothstep(52.0, 20.0, uFov);
  float farTwinkleMix = 1.0 - vDetailMix;
  // Low-LOD galaxies visibly twinkle; effect fades as thumbnail detail appears.
  float twinkle = 1.0 + farTwinkleMix * (
    0.12 * sin(uTime * 1.8 + aTexIndex * 1.3) +
    0.05 * sin(uTime * 3.1 + aTexIndex * 2.1)
  );

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Base marker stays visible at all zoom levels to avoid LOD dead zones.
  float basePx = aSize * uPixelRatio * fovScale * twinkle * sizeScale * 3.0;
  float detailBoost = mix(1.0, 1.35, vDetailMix);
  float farBoost = mix(1.75, 1.0, vDetailMix);
  gl_PointSize = max(2.8 * uPixelRatio, basePx * detailBoost * farBoost);
  gl_Position = projectionMatrix * mvPosition;
}
