uniform sampler2D uDustMap;
uniform float uGalaxyRadius;
uniform vec4 uDustMotion; // omega, falloff, turnover/R, elapsed simulation time

vec2 restPosition(vec2 p) {
  float r = length(p);
  float omega = uDustMotion.x / pow(max(r / uDustMotion.z, 1.0), uDustMotion.y);
  float angle = -omega * uDustMotion.w;
  return vec2(p.x * cos(angle) - p.y * sin(angle), p.x * sin(angle) + p.y * cos(angle));
}

float bodyHash(vec2 p) {
  return fract(cos(dot(p, vec2(2.31, 53.21)) * 124.123) * 412.0);
}
float bodyNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(bodyHash(i), bodyHash(i + vec2(1.0, 0.0)), u.x),
    mix(bodyHash(i + vec2(0.0, 1.0)), bodyHash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Integrate a thin dust slab along the sightline. One midpoint sample is a
// deliberate approximation; the path length makes edge-on lanes stronger.
vec3 dustTransmission(vec3 p, vec3 cameraWorldPosition) {
  vec3 eye = cameraWorldPosition / uGalaxyRadius;
  vec3 origin = p / uGalaxyRadius;
  vec3 ray = normalize(eye - origin);
  float dy = (ray.y < 0.0 ? -1.0 : 1.0) * max(abs(ray.y), 0.001);
  float a = (-0.018 - origin.y) / dy;
  float b = (0.018 - origin.y) / dy;
  float entry = max(0.0, min(a, b));
  float exitPoint = min(min(length(eye - origin), 2.6), max(a, b));
  float path = max(0.0, exitPoint - entry);
  vec3 mid = origin + ray * (entry + path * 0.5);
  vec2 local = restPosition(mid.xz);
  float tau = texture2D(uDustMap, local / 2.6 + 0.5).r * 8.0;
  tau *= min(path / 0.036, 7.0) * 0.65;
  return exp(-tau * vec3(0.65, 0.9, 1.2));
}
