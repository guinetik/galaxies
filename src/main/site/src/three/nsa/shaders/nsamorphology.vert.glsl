precision highp float;

attribute vec3 aPosition;
attribute float aSize;
attribute float aIntensity;
attribute float aFilamentarity;
attribute vec3 color;

uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uTime;
uniform float uPixelRatio;

varying vec3 vColor;
varying float vIntensity;
varying float vCameraDepth;
varying float vFilamentarity;
varying float vMorphDepth;

void main() {
  vec3 displaced = aPosition;

  // Gentle drift — filamentary regions drift less (they're thin sheets)
  float driftScale = mix(0.015, 0.004, aFilamentarity);
  float drift = sin(
    uTime * 0.4 +
    aPosition.x * 6.0 +
    aPosition.y * 4.0 +
    aPosition.z * 2.0
  ) * driftScale * aIntensity;
  vec3 driftDir = normalize(vec3(aPosition.xy + vec2(0.0001), 1.0));
  displaced += driftDir * drift;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  float camDepth = max(-mvPosition.z, 0.001);
  float contrastBoost = 0.6 + log2(1.0 + uQ) * 0.25;
  float sensitivityBoost = mix(0.6, 1.5, uSensitivity);
  float size = aSize * (0.7 + uAlpha * 0.8) * contrastBoost * sensitivityBoost;

  // Filamentary points slightly smaller, round/core slightly larger
  size *= mix(1.1, 0.85, aFilamentarity);

  gl_PointSize = max(size * uPixelRatio * (2.2 / camDepth), 1.5);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
  vIntensity = aIntensity;
  vCameraDepth = camDepth;
  vFilamentarity = aFilamentarity;
  // Morphology z-depth (structural, not camera) normalized to ~[0,1]
  // Raw z is typically in [-0.5, 0.5] from the morphology builder
  vMorphDepth = clamp(aPosition.z * 1.8 + 0.5, 0.0, 1.0);
}
