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
    // 1. Far fade: shrink to 0.5x as they disappear into the distance
    // 2. Near fade: grow to 10.0x as they dissolve in the foreground ("grow off view")
    float farScale = mix(0.5, 1.0, farAlpha);
    float nearScale = mix(10.0, 1.0, nearAlpha); // 1.0 when visible, 10.0 when faded
    sizeScale = farScale * nearScale * (0.5 + 0.5 * aAlpha);
  }

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;
  
  // Default view (60°) stays low-LOD dots; detail appears only once zooming in.
  // vDetailMix = 0.0 (blur) -> 1.0 (texture)
  // Changed to start showing detail much earlier (at 55°) and fully at 30°
  float fovMix = smoothstep(60.0, 30.0, uFov);
  
  // Proximity boost: if galaxy is very close (low redshift), show detail sooner!
  // This ensures 1 MLY galaxies are textured even at wide FOV.
  // z < 0.005 (approx 70 MLY) gets boost.
  float proximityBoost = 1.0 - smoothstep(0.0, 0.005, aRedshift);
  
  // Size-based boost: if galaxy is being artificially scaled up (foreground fly-by),
  // force texture detail so it doesn't look like a blurry blob.
  // aSizeMultiplier > 1.0 implies we are zooming past it or it's growing.
  float sizeBoost = smoothstep(1.0, 1.5, aSizeMultiplier);
  
  float farTwinkleMix = 1.0 - max(max(fovMix, proximityBoost * 0.95), sizeBoost);
  // Low-LOD galaxies visibly twinkle; effect fades as thumbnail detail appears.
  float twinkle = 1.0 + farTwinkleMix * (
    0.12 * sin(uTime * 1.8 + aTexIndex * 1.3) +
    0.05 * sin(uTime * 3.1 + aTexIndex * 2.1)
  );

  // Base marker stays visible at all zoom levels to avoid LOD dead zones.
  // Apply aSizeMultiplier based on distance proximity to camera for cosmic scaling effect
  // Boost base scale slightly to ensure textures are resolvable
  float basePx = aSize * uPixelRatio * fovScale * twinkle * sizeScale * aSizeMultiplier * 4.0;
  
  // If the sprite is going to be large on screen, we MUST show texture detail
  // regardless of zoom level, otherwise it looks like a blurry blob.
  // Smoothly transition to texture between 32px and 64px projected size.
  float pixelSizeBoost = smoothstep(32.0, 64.0, basePx);
  
  vDetailMix = max(max(max(fovMix, proximityBoost * 0.95), sizeBoost), pixelSizeBoost);

  float detailBoost = mix(1.0, 1.5, vDetailMix); // More boost when textured
  float farBoost = mix(1.75, 1.0, vDetailMix);
  gl_PointSize = max(2.8 * uPixelRatio, basePx * detailBoost * farBoost);
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
