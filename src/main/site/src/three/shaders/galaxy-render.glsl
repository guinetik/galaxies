/**
 * Galaxy Renderer Library
 * @author guinetik
 * @date 2026-03-05
 *
 * Procedural galaxy rendering using fragment shader generation.
 * Strategy: Simple colored circles with feathered gradients (to be extended).
 *
 * CONTRACT:
 *   - Galaxy struct signature MUST NOT change
 *   - renderGalaxy() signature MUST NOT change
 *   - Copy code freely from Shadertoy into render*() functions
 */

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/** 2D rotation matrix */
mat2 rot2d(float angle) {
  float s = sin(angle), c = cos(angle);
  return mat2(c, -s, s, c);
}

// ─────────────────────────────────────────────────────────────────────────────
// GALAXY DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

/** Galaxy entity with morphology and physical parameters */
struct Galaxy {
  int type;           // 0=spiral, 1=barred, 2=elliptical, 3=lenticular, 4=irregular
  uint seed;          // deterministic randomness
  vec2 center;        // center position (screen space) — not used in frag shader
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

// ─────────────────────────────────────────────────────────────────────────────
// HASH FUNCTIONS (for seeded randomness)
// ─────────────────────────────────────────────────────────────────────────────

/** Simple hash for seeded randomness */
float hash(uint n) {
  n = (n << 13U) ^ n;
  n = n * (n * n * 15731U + 789221U) + 1376312589U;
  return float(n & uint(0x7fffffffU)) / float(0x7fffffff);
}

/** Hash vec2 for 2D randomness */
float hash2(vec2 p) {
  return hash(uint(p.x * 73.0) ^ uint(p.y * 97.0));
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER STUBS (Type-Specific Implementations)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helper: Render simple circle with feathered gradient.
 * For now: colored circle fading from color to transparent (black).
 */
vec3 renderCircleGalaxy(Galaxy g, vec2 fragCoord, float radius) {
  vec2 toGalaxy = fragCoord - g.center;

  // Apply Z rotation
  toGalaxy = toGalaxy * rot2d(g.angleZ);

  // Simple distance-based gradient
  float dist = length(toGalaxy);

  if (dist > radius) return vec3(0.0);

  // Feathered gradient: color at center → transparent at edge
  float falloff = smoothstep(radius, 0.0, dist);
  return g.color * falloff;
}

/** Render spiral galaxy */
vec3 renderSpiral(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 60.0 * g.scale);
}

/** Render barred spiral galaxy */
vec3 renderBarredSpiral(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 60.0 * g.scale);
}

/** Render elliptical galaxy */
vec3 renderElliptical(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 60.0 * g.scale);
}

/** Render lenticular galaxy */
vec3 renderLenticular(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 60.0 * g.scale);
}

/** Render irregular galaxy */
vec3 renderIrregular(Galaxy g, vec2 fragCoord) {
  return renderCircleGalaxy(g, fragCoord, 60.0 * g.scale);
}

// ─────────────────────────────────────────────────────────────────────────────
// POLYMORPHIC DISPATCHER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render galaxy using polymorphic dispatch.
 *
 * Each galaxy type renders differently via type-specific functions.
 *
 * CONTRACT: Signature MUST remain `vec3 renderGalaxy(Galaxy g, vec2 fragCoord)`
 *
 * @param g Galaxy to render
 * @param fragCoord Fragment coordinate
 * @return Color contribution (0–1)
 */
vec3 renderGalaxy(Galaxy g, vec2 fragCoord) {
  switch(g.type) {
    case 0: return renderSpiral(g, fragCoord);
    case 1: return renderBarredSpiral(g, fragCoord);
    case 2: return renderElliptical(g, fragCoord);
    case 3: return renderLenticular(g, fragCoord);
    case 4: return renderIrregular(g, fragCoord);
  }
  return vec3(0.0);
}
