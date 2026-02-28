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

  // Event-horizon clamp — prevents sampling explosion near center
  float softDist = max(dist, 0.02);

  // Smooth falloff so distortion fades to zero at edge of influence
  float falloff    = smoothstep(0.58, 0.1, dist);
  float deflection = uLensStrength * (1.0 / softDist) * falloff;

  // Compute offset and undo aspect correction
  vec2 offset = dir * deflection;
  offset.x /= uAspectRatio;

  vec2 distortedUV = clamp(vUV + offset, 0.0, 1.0);

  vec4 color = texture2D(uSceneTexture, distortedUV);

  // Subtle Einstein ring glow at characteristic radius
  float ringRadius = 0.04;
  float ring = exp(-pow((dist - ringRadius) / 0.012, 2.0));
  ring *= falloff * uLensStrength * 12.0;
  color.rgb += vec3(0.6, 0.7, 1.0) * ring * 0.15;

  gl_FragColor = color;
}
