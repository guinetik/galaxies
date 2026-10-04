attribute float aSize;
attribute vec4 aColor;

uniform float uBaseDistance;
uniform float uBody;
uniform float uScreenHeight;
uniform float uTanHalfFov;
uniform float uResolveFade;

varying vec4 vColor;
varying float vCoverage;
varying vec3 vTransmission;
varying float vRadius;
varying float vPatchiness;
varying float vResolveFade;

void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Keep subpixel energy in alpha rather than dropping undersized points.
  float pointSize = clamp((aSize * 0.30 + 0.35) * (uBaseDistance * 1.28 / length(mvPosition.xyz)), 0.25, 3.2);
  gl_PointSize = max(pointSize, 1.0);
  vCoverage = pow(pointSize / gl_PointSize, 2.0);
  if (uBody > 0.0) {
    gl_PointSize = uGalaxyRadius * uBody * uScreenHeight / (2.0 * uTanHalfFov * max(-mvPosition.z, 0.01));
    // The diffuse target is smaller; preserve energy below its one-pixel floor.
    vCoverage = min(1.0, gl_PointSize * gl_PointSize);
    gl_PointSize = max(gl_PointSize, 1.0);
  }
  vTransmission = dustTransmission(position, cameraPosition);
  vRadius = length(position) / uGalaxyRadius;
  vResolveFade = uResolveFade;
  float mottling = bodyNoise(restPosition(position.xz / uGalaxyRadius) * 22.0);
  vPatchiness = 0.25 + mottling * mottling * 2.0;
  gl_Position = projectionMatrix * mvPosition;
}
