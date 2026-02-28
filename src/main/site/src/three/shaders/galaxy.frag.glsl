precision mediump float;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;

uniform sampler2D uTexture;

void main() {
  if (vAlpha < 0.01) discard;

  // Radial profile for smooth core + halo.
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  float coreMask = 1.0 - smoothstep(0.07, 0.46, dist);
  float haloMask = 1.0 - smoothstep(0.12, 0.62, dist);
  float farStarMix = 1.0 - vDetailMix;
  float markerAlpha = vAlpha * (coreMask * 0.24 + haloMask * 0.07);
  markerAlpha *= mix(1.9, 1.0, vDetailMix);

  // Soft neutral glow avoids the "pixel square" debug look.
  float core = exp(-dist * dist * 20.0);
  vec3 whiteHot = vec3(1.0);
  vec3 markerBaseColor = mix(vColor, whiteHot, mix(0.35, 1.0, farStarMix));
  float outerGlow = (1.0 - smoothstep(0.18, 0.7, dist)) * farStarMix;
  vec3 markerColor = markerBaseColor * (0.95 + core * mix(1.35, 0.45, vDetailMix));
  markerColor += whiteHot * outerGlow * 0.35;

  // Morphology detail from texture atlas.
  float atlasCols = 2.0;
  float atlasRows = 3.0;
  float texIndex = floor(vTexIndex + 0.5);
  float col = mod(texIndex, atlasCols);
  float row = floor(texIndex / atlasCols);

  // Keep sampling away from tile borders to avoid cross-tile bleeding.
  float tileInset = 1.0 / 128.0;
  vec2 localUv = mix(vec2(tileInset), vec2(1.0 - tileInset), gl_PointCoord);
  vec2 tileUv = vec2((col + localUv.x) / atlasCols, (row + localUv.y) / atlasRows);
  vec4 atlasSample = texture2D(uTexture, tileUv);
  float luminance = dot(atlasSample.rgb, vec3(0.2126, 0.7152, 0.0722));
  // Use luminance-driven masking so black tile backgrounds never render as opaque squares.
  float shapeMask = smoothstep(0.03, 0.22, luminance);
  float alphaMask = max(shapeMask * 0.9, atlasSample.a * shapeMask);
  float detailAlpha = alphaMask * vAlpha * vDetailMix * 0.8;
  vec3 detailColor = mix(vColor, atlasSample.rgb, 0.8) * 1.08;

  float finalAlpha = clamp(markerAlpha + detailAlpha * (1.0 - markerAlpha), 0.0, 1.0);
  if (finalAlpha < 0.01) discard;
  vec3 finalColor = mix(markerColor, detailColor, clamp(detailAlpha, 0.0, 1.0));

  gl_FragColor = vec4(finalColor, finalAlpha);
}
