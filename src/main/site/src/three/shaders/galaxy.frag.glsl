precision highp float;

// ---- Varyings from vertex shader ----

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;
varying float vSelected;
varying float vFocused;

// Galaxy struct varyings (packed)
varying float vType;
varying float vSeed;
varying vec3 vAngles;          // angleX, angleY, angleZ
varying vec3 vPhysicalParams;  // axialRatio, mass_log10, velocity_kmps
varying float vDistance_mpc;

// ---- Uniforms ----

uniform float uTime;

// ---- Main ----

void main() {
  if (vAlpha < 0.01) discard;

  // Assemble Galaxy struct from varyings
  Galaxy g;
  g.type          = int(vType + 0.5);
  g.seed          = vSeed;
  g.center        = vec2(0.0);
  g.scale         = 1.0;
  // Animate only the focused galaxy; others freeze at a seed-derived pose
  g.time          = vFocused > 0.5 ? uTime : vSeed * 0.01;
  g.angleX        = vAngles.x;
  g.angleY        = vAngles.y;
  g.angleZ        = vAngles.z;
  g.color         = vColor;
  g.axialRatio    = vPhysicalParams.x;
  g.mass_log10    = vPhysicalParams.y;
  g.velocity_kmps = vPhysicalParams.z;
  g.distance_mpc  = vDistance_mpc;

  // Map point sprite coordinates to library space [-1, 1]
  vec2 fragCoord = (gl_PointCoord - 0.5) * 2.0;

  // Render
  vec3 galaxyColor = renderGalaxy(g, fragCoord);

  if (length(galaxyColor) < 0.001) discard;

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

  // Gamma correction (linear -> sRGB)
  finalColor = pow(max(finalColor, vec3(0.0)), vec3(0.45));

  gl_FragColor = vec4(finalColor, finalAlpha);
}
