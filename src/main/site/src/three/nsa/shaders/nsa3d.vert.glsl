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
  // Flatten Z for thin disk appearance (galaxy viewed from above)
  // depthScale is ~0.35 from CPU side; multiplying by 0.15 gives a very thin disk
  vec3 diskPos = aPosition;
  diskPos.z *= 0.15;

  vec4 mvPosition = modelViewMatrix * vec4(diskPos, 1.0);
  float depth = max(-mvPosition.z, 0.001);

  // Large overlapping points create smooth continuous appearance
  // Intensity drives size: bright regions are larger, dim regions smaller
  float sensitivityBoost = mix(0.6, 1.5, uSensitivity);
  float sizeBoost = 1.0 + uAlpha * 2.0;
  float size = aSize * sizeBoost * sensitivityBoost;

  // Points need to be large enough to overlap for smooth look
  // Scale up by 2.5x compared to morphology shader
  gl_PointSize = max(size * uPixelRatio * (5.0 / depth), 2.0);
  gl_Position = projectionMatrix * mvPosition;

  vColor = color;
  vIntensity = aIntensity;
  vDepth = depth;
}
