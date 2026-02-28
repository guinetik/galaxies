precision mediump float;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;
varying float vDetailMix;

uniform sampler2D uTexture;

void main() {
  if (vAlpha < 0.01) discard;

  // Soft circular dot with bright core and gentle falloff
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  float markerAlpha = vAlpha * smoothstep(0.5, 0.15, dist);
  markerAlpha = max(markerAlpha, vAlpha * 0.32);
  if (markerAlpha < 0.01) discard;

  // Always-visible acquisition marker.
  float core = exp(-dist * dist * 20.0);
  vec3 markerColor = vColor * (1.2 + core * 0.9);

  // Morphology detail fades in as user zooms in.
  float atlasCols = 2.0;
  float atlasRows = 3.0;
  float texIndex = floor(vTexIndex + 0.5);
  float col = mod(texIndex, atlasCols);
  float row = floor(texIndex / atlasCols);
  vec2 tileUv = vec2((col + gl_PointCoord.x) / atlasCols, (row + gl_PointCoord.y) / atlasRows);
  vec4 atlasSample = texture2D(uTexture, tileUv);

  // Texture tiles were authored on black; use luminance as alpha mask.
  float detailAlpha = dot(atlasSample.rgb, vec3(0.2126, 0.7152, 0.0722));
  detailAlpha = smoothstep(0.05, 0.9, detailAlpha) * vAlpha * vDetailMix;
  vec3 detailColor = mix(vColor, atlasSample.rgb, 0.45);

  float finalAlpha = clamp(markerAlpha + detailAlpha * (1.0 - markerAlpha), 0.0, 1.0);
  vec3 finalColor = mix(markerColor, detailColor, clamp(detailAlpha, 0.0, 1.0));

  gl_FragColor = vec4(finalColor, finalAlpha);
}
