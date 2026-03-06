/**
 * Value Noise — Stateless Math Library
 * Sin-hash value noise for procedural generation.
 * No uniforms, no varyings, no gl_ globals.
 *
 * Adapted from research/galaxy-generator/noise-value.glsl
 */

/** 1D hash: float -> pseudo-random float in [0, 1) */
float hashN(float n) {
  return fract(sin(n) * 43758.5453123);
}

/** 2D hash: vec2 -> pseudo-random float in [0, 1) */
float hashN2(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

/** 2D value noise with Hermite interpolation. Returns [0, 1). */
float valueNoise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hashN2(i + vec2(0.0, 0.0)), hashN2(i + vec2(1.0, 0.0)), u.x),
             mix(hashN2(i + vec2(0.0, 1.0)), hashN2(i + vec2(1.0, 1.0)), u.x), u.y);
}
