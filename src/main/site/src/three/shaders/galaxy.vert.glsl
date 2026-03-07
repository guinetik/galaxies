// Existing attributes
attribute float aSize;
attribute vec3 aColor;
attribute float aRedshift;
attribute float aTexIndex;
attribute float aSelected;
attribute float aFocused;
attribute float aAlpha;
attribute float aSizeMultiplier;

// Galaxy struct attributes (packed for efficiency)
attribute float aType;           // Galaxy type (0-4)
attribute float aSeed;           // Randomness seed
attribute vec3 aAngles;          // angleX, angleY, angleZ
attribute vec3 aPhysicalParams;  // axialRatio, mass_log10, velocity_kmps
attribute float aDistance_mpc;   // Distance in megaparsecs

uniform float uTime;
uniform float uPixelRatio;
uniform float uMaxRedshift;
uniform float uMinRedshift;
uniform float uFov;
uniform float uParallaxX;
uniform float uParallaxY;
uniform float uFocusActive;

// Existing varyings
varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;
varying float vFocused;

// Galaxy struct varyings (packed)
varying float vType;
varying float vSeed;
varying vec3 vAngles;          // angleX, angleY, angleZ
varying vec3 vPhysicalParams;  // axialRatio, mass_log10, velocity_kmps
varying float vDistance_mpc;

void main() {
  vColor = aColor;
  vTexIndex = aTexIndex;
  vSelected = aSelected;
  vFocused = aFocused;

  // Pass Galaxy struct data (packed)
  vType = aType;
  vSeed = aSeed;
  vAngles = aAngles;
  vPhysicalParams = aPhysicalParams;
  vDistance_mpc = aDistance_mpc;

  float sizeScale = 0.0;

  // Smooth fade based on redshift distance from cutoff
  if (aRedshift < uMinRedshift || aRedshift > uMaxRedshift) {
    vAlpha = 0.0;
    sizeScale = 0.0;
  } else {
    // Far fade — outer 30% of range fades out
    float fadeStart = uMaxRedshift * 0.7;
    float farAlpha = aRedshift < fadeStart
      ? 1.0
      : smoothstep(uMaxRedshift, fadeStart, aRedshift);

    // Near fade
    // Avoid division by zero if uMinRedshift is 0
    float nearFadeEnd = uMinRedshift > 0.0 ? uMinRedshift * 1.5 : 0.0;
    float nearAlpha = aRedshift > nearFadeEnd
      ? 1.0
      : smoothstep(uMinRedshift, nearFadeEnd, aRedshift);

    // Depth-based dimming: galaxies farther in the redshift range appear dimmer.
    // Reduces overlap from distant background galaxies.
    float redshiftRange = uMaxRedshift - uMinRedshift;
    float depthT = redshiftRange > 0.0
      ? (aRedshift - uMinRedshift) / redshiftRange
      : 0.0;
    float depthDim = mix(1.0, 0.48, depthT);

    vAlpha = min(farAlpha, nearAlpha) * aAlpha * depthDim;

    // Size scaling logic:
    // 1. Keep galaxies readable longer as they approach the active shell edges.
    // 2. Let them complete the "grow into view" moment before fading away.
    float farScale = mix(0.96, 1.12, farAlpha);
    float nearScale = mix(3.2, 1.0, nearAlpha);
    sizeScale = farScale * nearScale * (0.94 + 0.48 * aAlpha);
  }

  // FOV-based scaling: zoomed out (75°) = compact, zoomed in (10°) = larger for interaction
  // Uses default 60° as reference. Ratio gives ~0.7x at 75° and ~4x at 10°.
  float fovScale = 60.0 / uFov;
  float homeViewBoost = clamp((uFov - 40.0) / 18.0, 0.0, 1.0);
  
  // Detail appears earlier so galaxies can grow into sharp view before fading.
  // vDetailMix = 0.0 (blur) -> 1.0 (texture). Trigger at 55°–32° FOV.
  float fovMix = smoothstep(55.0, 32.0, uFov);
  
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
  float basePx = aSize * uPixelRatio * fovScale * twinkle * sizeScale * aSizeMultiplier * mix(2.8, 3.35, homeViewBoost);
  
  // Show texture detail when sprites reach modest size so galaxies look sharp as they grow.
  float pixelSizeBoost = smoothstep(11.0, 23.0, basePx);
  
  vDetailMix = max(max(max(fovMix, proximityBoost * 0.95), sizeBoost), pixelSizeBoost);

  // Dim blurry galaxies to reduce overlap clutter; in-focus stay full opacity.
  vAlpha *= mix(0.68, 1.0, smoothstep(0.18, 0.72, vDetailMix));
  vAlpha *= mix(1.0, 1.28, homeViewBoost);

  float detailBoost = mix(1.0, 1.18, vDetailMix);
  float farBoost = mix(1.15, 1.0, vDetailMix);
  float focusSize = basePx * detailBoost * farBoost * mix(1.0, 1.12, homeViewBoost);

  // Focus mode: dim non-focused galaxies, grow the focused one
  if (uFocusActive > 0.5) {
    if (aFocused > 0.5) {
      focusSize *= 1.5;
      vAlpha = max(vAlpha, 0.9);
      vDetailMix = 1.0;
    } else {
      vAlpha *= 0.12;
    }
  }

  gl_PointSize = min(max(1.6 * uPixelRatio, focusSize), 140.0 * uPixelRatio);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Keep a baseline parallax even when zoomed far out.
  float parallaxZoomMix = smoothstep(75.0, 16.0, uFov);
  float parallaxMix = mix(0.32, 1.0, parallaxZoomMix);
  float nearFactor = 1.0;
  if (uMaxRedshift > uMinRedshift + 0.000001) {
    nearFactor = 1.0 - smoothstep(uMinRedshift, uMaxRedshift, aRedshift);
  }
  float depthMix = mix(0.45, 1.0, nearFactor);
  mvPosition.x += uParallaxX * parallaxMix * depthMix * 29.0;
  mvPosition.y += uParallaxY * parallaxMix * depthMix * 21.0;
  gl_Position = projectionMatrix * mvPosition;
}
