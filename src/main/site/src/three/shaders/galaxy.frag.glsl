precision highp float;

// ─────────────────────────────────────────────────────────────────────────────
// GALAXY RENDER LIBRARY (inlined from galaxy-render.glsl)
// ─────────────────────────────────────────────────────────────────────────────

/** 2D rotation matrix */
mat2 rot2d(float angle) {
  float s = sin(angle), c = cos(angle);
  return mat2(c, -s, s, c);
}

/** Galaxy entity with morphology and physical parameters */
struct Galaxy {
  int type;           // 0=spiral, 1=barred, 2=elliptical, 3=lenticular, 4=irregular
  int seed;           // deterministic randomness (stored as int)
  vec2 center;        // center position (screen space)
  float scale;        // relative size multiplier
  float angleX;       // rotation around X axis
  float angleY;       // rotation around Y axis
  float angleZ;       // rotation around Z axis
  vec3 color;         // random color for this galaxy
  float axialRatio;   // b/a elongation (0.3-1.0, from DB axial_ratio)
  float mass_log10;   // log10 stellar mass (9-12, from DB log_ms_t)
  float velocity_kmps;// CMB velocity in km/s (0-14000+, from DB vcmb)
  float distance_mpc; // distance in megaparsecs (always populated)
};

/** Simple hash for seeded randomness */
float hash(int n) {
  float x = sin(float(n)) * 43758.5453123;
  return x - floor(x);
}

/**
 * Helper: Render elliptical galaxy with feathered gradient.
 * Distorts circle into ellipse using axial ratio.
 */
vec3 renderCircleGalaxy(Galaxy g, vec2 fragCoord, float radius) {
  vec2 toGalaxy = fragCoord - g.center;

  // Apply Z rotation
  toGalaxy = toGalaxy * rot2d(g.angleZ);

  // Apply elliptical distortion using axial ratio (b/a)
  // Stretch in Y direction (minor axis)
  toGalaxy.y *= (1.0 / max(0.1, g.axialRatio));

  // Distance from center (now accounting for ellipse)
  float dist = length(toGalaxy);

  // Feathered gradient: color at center → transparent at edge
  // More gradual falloff: starts opaque, fades across a wider range
  float falloff = smoothstep(radius * 1.5, -radius * 0.2, dist);

  return g.color * falloff;
}

/** Render spiral galaxy */
vec3 renderSpiral(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 40.0 * g.scale);
}

/** Render barred spiral galaxy */
vec3 renderBarredSpiral(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 40.0 * g.scale);
}

/** Render elliptical galaxy */
vec3 renderElliptical(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 40.0 * g.scale);
}

/** Render lenticular galaxy */
vec3 renderLenticular(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 40.0 * g.scale);
}

/** Render irregular galaxy */
vec3 renderIrregular(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 40.0 * g.scale);
}

/**
 * Render galaxy using polymorphic dispatch.
 * CONTRACT: Signature MUST remain `vec3 renderGalaxy(Galaxy g, vec2 fragCoord)`
 */
vec3 renderGalaxy(Galaxy g, vec2 fragCoord) {
  if (g.type == 0) return renderSpiral(g, fragCoord);
  if (g.type == 1) return renderBarredSpiral(g, fragCoord);
  if (g.type == 2) return renderElliptical(g, fragCoord);
  if (g.type == 3) return renderLenticular(g, fragCoord);
  if (g.type == 4) return renderIrregular(g, fragCoord);
  return vec3(0.0);
}

// ─────────────────────────────────────────────────────────────────────────────
// SHADER VARYINGS
// ─────────────────────────────────────────────────────────────────────────────

// Existing varyings
varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;

// Galaxy struct varyings (packed)
varying float vType;
varying float vSeed;
varying vec3 vAngles;          // angleX, angleY, angleZ
varying vec3 vPhysicalParams;  // axialRatio, mass_log10, velocity_kmps
varying float vDistance_mpc;

uniform sampler2D uTexture;

void main() {
  if (vAlpha < 0.01) discard;

  // Construct Galaxy struct from varyings (unpacking packed attributes)
  Galaxy g = Galaxy(
    int(vType + 0.5),           // type
    int(vSeed + 0.5),           // seed
    vec2(0.5),                  // center (in normalized point coords, center is 0.5)
    1.0,                        // scale (normalized to 1.0 in point space)
    vAngles.x,                  // angleX
    vAngles.y,                  // angleY
    vAngles.z,                  // angleZ
    vColor,                     // color
    vPhysicalParams.x,          // axialRatio
    vPhysicalParams.y,          // mass_log10
    vPhysicalParams.z,          // velocity_kmps
    vDistance_mpc               // distance_mpc
  );

  // Work in normalized point coordinates (0-1, center at 0.5)
  // Convert to local screen space: offset from 0.5 center, scaled to pixel-like units
  vec2 localCoord = (gl_PointCoord - 0.5) * 100.0; // -50 to 50 range, centered at 0
  vec2 fragCoord = localCoord + g.center; // Offset by center (0.5 in normalized = 50 in this scale)

  // Render galaxy using polymorphic dispatcher
  vec3 galaxyColor = renderGalaxy(g, fragCoord);

  // Early discard if no color generated
  if (length(galaxyColor) < 0.001) discard;

  // Apply visibility alpha from depth culling
  vec3 finalColor = galaxyColor;
  float finalAlpha = length(galaxyColor) * vAlpha;

  // Selected outline: cyan glow at sprite edge
  if (vSelected > 0.5) {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    float outline = 1.0 - smoothstep(0.35, 0.65, dist);
    vec3 outlineColor = vec3(0.4, 0.9, 1.0);
    finalColor = mix(finalColor, outlineColor, outline * 0.5);
    finalAlpha = max(finalAlpha, outline * 0.75 * vAlpha);
  }

  if (finalAlpha < 0.01) discard;
  gl_FragColor = vec4(finalColor, finalAlpha);
}
