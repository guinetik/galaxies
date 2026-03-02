uniform sampler2D uDensity;
uniform float uDisplaceScale;
uniform float uTime;

varying float vDepth;
varying vec2 vUv;

void main() {
  vUv = uv;

  // Sample density at this vertex's UV
  // Flip V because PlaneGeometry rotated to XZ inverts the V-to-Z mapping
  float density = texture2D(uDensity, vec2(uv.x, 1.0 - uv.y)).r;

  // Displace Y downward — deeper wells for higher density
  // Apply power curve to exaggerate deep wells
  float displacement = pow(density, 0.7) * uDisplaceScale;

  vec3 displaced = position;
  displaced.y -= displacement;

  vDepth = density;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
