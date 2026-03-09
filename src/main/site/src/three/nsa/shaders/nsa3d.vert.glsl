precision highp float;

attribute vec3 aPosition;
attribute float aSize;
attribute float aIntensity;
attribute vec3 color;

uniform float uAlpha;
uniform float uQ;
uniform float uSensitivity;
uniform float uTime;
uniform float uPixelRatio;

varying vec3 vColor;
varying float vIntensity;
varying float vDepth;

void main() {
  vec3 displaced = aPosition;

  float drift = sin(
    uTime * 0.4 +
    aPosition.x * 6.0 +
    aPosition.y * 4.0 +
    aPosition.z * 2.0
  ) * 0.015 * aIntensity;
  vec3 driftDir = normalize(vec3(aPosition.xy + vec2(0.0001), 1.0));
  displaced += driftDir * drift;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  float depth = max(-mvPosition.z, 0.001);
  float contrastBoost = 0.6 + log2(1.0 + uQ) * 0.25;
  float sensitivityBoost = mix(0.6, 1.5, uSensitivity);
  float size = aSize * (0.8 + uAlpha * 1.4) * contrastBoost * sensitivityBoost;

  gl_PointSize = max(size * uPixelRatio * (2.2 / depth), 1.5);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
  vIntensity = aIntensity;
  vDepth = depth;
}
