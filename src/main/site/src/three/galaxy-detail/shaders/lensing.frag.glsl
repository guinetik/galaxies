precision highp float;

uniform sampler2D uSceneTexture;
uniform vec2      uBHScreenPos;   // black hole position in UV space (0–1)
uniform float     uLensStrength;  // 0 = no distortion, ~0.03 = max
uniform float     uAspectRatio;   // width / height

varying vec2 vUV;

void main() {
  // Vector from this pixel to the black hole center
  vec2 toBH = uBHScreenPos - vUV;
  toBH.x *= uAspectRatio;              // work in circular space

  float dist = length(toBH);
  vec2  dir  = toBH / max(dist, 0.0001);

  // Compact lensing — peaks very close to center, drops to zero quickly
  float radius = 0.18;                           // influence radius in UV space
  float falloff = smoothstep(radius, 0.0, dist); // 1 at center, 0 at radius
  falloff *= falloff;                             // squared for steep drop-off
  float softDist = max(dist, 0.03);
  float deflection = uLensStrength * falloff * (0.09 / softDist);

  // Compute offset and undo aspect correction
  vec2 offset = dir * deflection;
  offset.x /= uAspectRatio;

  vec2 distortedUV = clamp(vUV + offset, 0.0, 1.0);

  vec4 color = texture2D(uSceneTexture, distortedUV);

  // Subtle Einstein ring glow at characteristic radius
  float ringRadius = 0.02;
  float ring = exp(-pow((dist - ringRadius) / 0.006, 2.0));
  ring *= falloff * uLensStrength * 8.0;
  color.rgb += vec3(0.6, 0.7, 1.0) * ring * 0.12;

  gl_FragColor = color;
}
