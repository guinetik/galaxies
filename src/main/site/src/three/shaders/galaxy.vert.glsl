attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;
attribute float aTexIndex;
attribute float aSelected;
attribute float aAlpha;
attribute float aSizeMultiplier;

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;
uniform float uMinRedshift;
uniform float uFov;
uniform float uParallaxX;
uniform float uParallaxY;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;

void main() {
  vColor = aColor;
  vTexIndex = aTexIndex;
  vSelected = aSelected;

  float sizeScale = 0.0;

  // Smooth fade based on redshift distance from cutoff
  if (aRedshift < uMinRedshift || aRedshift > uMaxRedshift) {
    vAlpha = 0.0;
    sizeScale = 0.0;
  } else {
    // Far fade
    float fadeStart = uMaxRedshift * 0.6;
    float farAlpha = aRedshift < fadeStart
      ? 1.0
      : smoothstep(uMaxRedshift, fadeStart, aRedshift);

    // Near fade (steeper to clear foreground quickly)
    // Avoid division by zero if uMinRedshift is 0
    float nearFadeEnd = uMinRedshift > 0.0 ? uMinRedshift * 1.5 : 0.0;
    float nearAlpha = aRedshift > nearFadeEnd
      ? 1.0
      : smoothstep(uMinRedshift, nearFadeEnd, aRedshift);

    vAlpha = min(farAlpha, nearAlpha) * aAlpha;

    // Size scaling logic:
    // 1. Far fade: shrink to keep dense deep fields readable.
    // 2. Near fade: modest growth only, avoiding giant foreground blobs.
    float farScale = mix(0.5, 1.0, farAlpha);
    float nearScale = mix(3.2, 1.0, nearAlpha);
    sizeScale = farScale * nearScale * (0.5 + 0.5 * aAlpha);
  }

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;
  
  // Default wide view stays low-LOD dots; detail appears later while zooming in.
  // vDetailMix = 0.0 (blur) -> 1.0 (texture)
  float fovMix = smoothstep(44.0, 24.0, uFov);
  
  // Proximity boost: if galaxy is very close (low redshift), show detail sooner!
  // Very near galaxies can gain detail sooner, but less aggressively.
  float proximityBoost = 1.0 - smoothstep(0.0, 0.0025, aRedshift);
  
  // Size-based boost: if galaxy is being artificially scaled up (foreground fly-by),
  // force texture detail so it doesn't look like a blurry blob.
  // aSizeMultiplier > 1.0 implies we are zooming past it or it's growing.
  float sizeBoost = smoothstep(1.2, 1.8, aSizeMultiplier);
  
  float farTwinkleMix = 1.0 - max(max(fovMix, proximityBoost * 0.95), sizeBoost);
  // Low-LOD galaxies visibly twinkle; effect fades as thumbnail detail appears.
  float twinkle = 1.0 + farTwinkleMix * (
    0.06 * sin(uTime * 1.8 + aTexIndex * 1.3) +
    0.03 * sin(uTime * 3.1 + aTexIndex * 2.1)
  );

  // Base marker stays visible at all zoom levels to avoid LOD dead zones.
  // Apply controlled proximity scaling for deep-field readability.
  float basePx = aSize * uPixelRatio * fovScale * twinkle * sizeScale * aSizeMultiplier * 2.35;
  
  // If the sprite is going to be large on screen, we MUST show texture detail
  // regardless of zoom level, otherwise it looks like a blurry blob.
  // Smoothly transition to texture only when sprites are clearly large.
  float pixelSizeBoost = smoothstep(20.0, 40.0, basePx);
  
  vDetailMix = max(max(max(fovMix, proximityBoost * 0.95), sizeBoost), pixelSizeBoost);

  float detailBoost = mix(1.0, 1.18, vDetailMix);
  float farBoost = mix(1.15, 1.0, vDetailMix);
  gl_PointSize = max(1.1 * uPixelRatio, basePx * detailBoost * farBoost);
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float parallaxMix = smoothstep(72.0, 16.0, uFov);
  float nearFactor = 1.0;
  if (uMaxRedshift > uMinRedshift + 0.000001) {
    nearFactor = 1.0 - smoothstep(uMinRedshift, uMaxRedshift, aRedshift);
  }
  mvPosition.x += uParallaxX * parallaxMix * nearFactor * 26.0;
  mvPosition.y += uParallaxY * parallaxMix * nearFactor * 18.0;
  gl_Position = projectionMatrix * mvPosition;
}
