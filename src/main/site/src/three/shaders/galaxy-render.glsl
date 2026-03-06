/**
 * Galaxy Render Library — Stateless
 *
 * Procedural galaxy rendering using the Megaparsecs ring-loop technique.
 * Overlapping rotated elliptical orbits with Keplerian motion.
 * No uniforms, no varyings, no gl_ globals — pure functions.
 * All state flows through the Galaxy struct.
 *
 * Based on "Megaparsecs" by Martijn Steinrucken (BigWings), CC BY-NC-SA 3.0.
 * Requires: noise-value.glsl (hashN2, valueNoise2D)
 */

#ifndef _GAL_TAU
#define _GAL_TAU 6.2831853
#endif

#define GAL_MAX_RADIUS 1.5
#define GAL_MIN_COS_TILT 0.15
#define GAL_RING_PHASE_OFFSET 100.0
#define GAL_ORBIT_SPEED 0.1
#define GAL_DUST_UV_SCALE 0.2
#define GAL_DUST_NOISE_FREQ 4.0
#define GAL_STAR_GLOW_RADIUS 0.5
#define GAL_STAR_BRIGHTNESS 0.2
#define GAL_SUPERNOVA_THRESH 0.9999
#define GAL_SUPERNOVA_MULT 10.0
#define GAL_INNER_RADIUS 0.1
#define GAL_OUTER_RADIUS 1.0
#define GAL_MAX_RINGS 25
#define GAL_RING_DECORR_A 563.2
#define GAL_RING_DECORR_B 673.2
#define GAL_STAR_OFFSET_A 17.3
#define GAL_STAR_OFFSET_B 31.7
#define GAL_TWINKLE_FREQ 784.0
#define GAL_SUPERNOVA_TIME_SCALE 0.05
#define GAL_STAR_COLOR_FREQ 100.0

// ---- Utilities ----

mat2 _galRot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

// ---- Data Structures ----

struct Galaxy {
  int type;            // 0=spiral, 1=barred, 2=elliptical, 3=lenticular, 4=irregular
  float seed;          // deterministic randomness (float, not uint)
  vec2 center;         // center position
  float scale;         // radius scale
  float time;          // animation time (caller passes elapsed seconds)
  float angleX;        // tilt angle (fake 3D via UV Y-stretch)
  float angleY;        // secondary tilt (reserved)
  float angleZ;        // in-plane rotation
  vec3 color;          // base tint color
  float axialRatio;    // b/a elongation (0.3-1.0)
  float mass_log10;    // log10 stellar mass (9-12)
  float velocity_kmps; // CMB velocity km/s
  float distance_mpc;  // distance in Mpc
};

struct GalaxyStyle {
  float twist;         // spiral winding per ring (0=none, 1=classic, 1.3+=tight)
  float innerStretch;  // inner ring X elongation (1=circular, 4=strong bar)
  float ringWidth;     // Gaussian sharpness (8=diffuse, 25=tight)
  float numRings;      // ring count (15-25)
  float diskThickness; // ring Y perturbation amplitude (0.01-0.1)
  float bulgeSize;     // center glow Gaussian tightness
  float bulgeBright;   // center glow intensity (0.5-2.0)
  float dustContrast;  // dust pow() exponent
  float starDensity;   // star grid resolution (4-12)
};

// ---- Shared Helpers ----

vec2 _galApplyTilt(vec2 uv, float angleX) {
  uv.y /= max(abs(cos(angleX)), GAL_MIN_COS_TILT);
  return uv;
}

vec3 _galRenderBulge(vec2 uv, float size, float brightness, vec3 tint) {
  return vec3(exp(-0.5 * dot(uv, uv) * size)) * brightness * tint;
}

vec3 _galRenderRingLoop(Galaxy g, vec2 uv, GalaxyStyle style) {
  vec3 col = vec3(0.0);
  vec3 dustCol = vec3(0.3, 0.6, 1.0);

  float flip = 1.0;
  float t = g.time * GAL_ORBIT_SPEED;
  t *= (mod(g.seed, 2.0) < 1.0 ? 1.0 : -1.0);

  for (int j = 0; j < GAL_MAX_RINGS; j++) {
    float i = float(j) / style.numRings;
    if (i >= 1.0) break;
    flip *= -1.0;

    float z = mix(style.diskThickness, 0.0, i) * flip
            * fract(sin(i * GAL_RING_DECORR_A) * GAL_RING_DECORR_B);

    float r = mix(GAL_INNER_RADIUS, GAL_OUTER_RADIUS, i);
    vec2 ringUv = uv + vec2(0.0, z * 0.5);

    vec2 st = ringUv * _galRot(i * _GAL_TAU * style.twist);

    st.x *= mix(style.innerStretch, 1.0, i);

    float ell = exp(-0.5 * abs(dot(st, st) - r) * style.ringWidth);

    vec2 texUv = GAL_DUST_UV_SCALE * st * _galRot(i * GAL_RING_PHASE_OFFSET + t / r);

    vec3 dust = vec3(valueNoise2D((texUv + vec2(i)) * GAL_DUST_NOISE_FREQ));
    vec3 dL = pow(max(ell * dust / r, vec3(0.0)), vec3(0.5 + style.dustContrast));

    col += dL * dustCol;

    vec2 starId = floor(texUv * style.starDensity);
    vec2 starUv = fract(texUv * style.starDensity) - 0.5;
    float n = hashN2(starId + vec2(i * GAL_STAR_OFFSET_A, i * GAL_STAR_OFFSET_B));
    float starDist = length(starUv);

    float sL = smoothstep(GAL_STAR_GLOW_RADIUS, 0.0, starDist)
             * pow(max(dL.r, 0.0), 2.0) * GAL_STAR_BRIGHTNESS
             / max(starDist, 0.001);

    float sN = sL;
    sL *= sin(n * GAL_TWINKLE_FREQ + g.time) * 0.5 + 0.5;
    sL += sN * smoothstep(GAL_SUPERNOVA_THRESH, 1.0,
            sin(n * GAL_TWINKLE_FREQ + g.time * GAL_SUPERNOVA_TIME_SCALE))
          * GAL_SUPERNOVA_MULT;

    if (i > 3.0 / style.starDensity) {
      vec3 starCol = mix(dustCol, vec3(1.0), 0.3 + n * 0.5);
      col += sL * starCol;
    }
  }

  col /= style.numRings;
  return col;
}

// ---- Type-Specific Renderers ----

vec3 renderSpiral(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  GalaxyStyle s;
  s.twist         = 1.0;
  s.innerStretch  = mix(1.8, 2.2, g.axialRatio);
  s.ringWidth     = 15.0;
  s.numRings      = 20.0;
  s.diskThickness = 0.04;
  s.bulgeSize     = 25.0;
  s.bulgeBright   = 1.2;
  s.dustContrast  = 0.5;
  s.starDensity   = 8.0;

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(1.0, 0.9, 0.8), g.color, 0.6));
  col *= g.color;
  return col;
}

vec3 renderBarredSpiral(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  GalaxyStyle s;
  s.twist         = 1.3;
  s.innerStretch  = mix(3.0, 4.0, g.axialRatio);
  s.ringWidth     = 12.0;
  s.numRings      = 20.0;
  s.diskThickness = 0.04;
  s.bulgeSize     = 20.0;
  s.bulgeBright   = 1.0;
  s.dustContrast  = 0.5;
  s.starDensity   = 8.0;

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(1.0, 0.9, 0.7), g.color, 0.6));
  col *= g.color;
  return col;
}

vec3 renderElliptical(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  GalaxyStyle s;
  s.twist         = 0.0;
  s.innerStretch  = mix(1.0, 1.4, 1.0 - g.axialRatio);
  s.ringWidth     = 8.0;
  s.numRings      = 15.0;
  s.diskThickness = 0.08;
  s.bulgeSize     = 15.0;
  s.bulgeBright   = 2.0;
  s.dustContrast  = 0.8;
  s.starDensity   = 4.0;

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(1.0, 0.8, 0.6), g.color, 0.7));
  col *= g.color;
  return col;
}

vec3 renderLenticular(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  GalaxyStyle s;
  s.twist         = 0.05;
  s.innerStretch  = mix(1.5, 2.0, 1.0 - g.axialRatio);
  s.ringWidth     = 20.0;
  s.numRings      = 18.0;
  s.diskThickness = 0.02;
  s.bulgeSize     = 30.0;
  s.bulgeBright   = 1.5;
  s.dustContrast  = 0.6;
  s.starDensity   = 6.0;

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(1.0, 0.85, 0.65), g.color, 0.6));
  col *= g.color;
  return col;
}

vec3 renderIrregular(Galaxy g, vec2 fragCoord) {
  vec2 uv = (fragCoord - g.center) / g.scale;
  uv = _galApplyTilt(uv * _galRot(g.angleZ), g.angleX);
  if (length(uv) > GAL_MAX_RADIUS) return vec3(0.0);

  GalaxyStyle s;
  s.twist         = 0.3;
  s.innerStretch  = 1.5;
  s.ringWidth     = 10.0;
  s.numRings      = 16.0;
  s.diskThickness = 0.1;
  s.bulgeSize     = 40.0;
  s.bulgeBright   = 0.6;
  s.dustContrast  = 0.4;
  s.starDensity   = 10.0;

  vec3 col = _galRenderRingLoop(g, uv, s);
  col += _galRenderBulge(uv, s.bulgeSize, s.bulgeBright,
           mix(vec3(0.9, 0.85, 1.0), g.color, 0.6));
  col *= g.color;
  return col;
}

// ---- Polymorphic Dispatcher ----

vec3 renderGalaxy(Galaxy g, vec2 fragCoord) {
  if (g.type == 0) return renderSpiral(g, fragCoord);
  if (g.type == 1) return renderBarredSpiral(g, fragCoord);
  if (g.type == 2) return renderElliptical(g, fragCoord);
  if (g.type == 3) return renderLenticular(g, fragCoord);
  if (g.type == 4) return renderIrregular(g, fragCoord);
  return vec3(0.0);
}
