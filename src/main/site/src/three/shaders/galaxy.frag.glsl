uniform sampler2D uTexture;

varying vec3 vColor;
varying float vAlpha;
varying float vTexIndex;

void main() {
  if (vAlpha < 0.01) discard;

  // Calculate UV within the texture atlas (2 columns x 3 rows)
  float col = mod(vTexIndex, 2.0);
  float row = floor(vTexIndex / 2.0);
  vec2 atlasUV = vec2(
    (col + gl_PointCoord.x) / 2.0,
    (row + gl_PointCoord.y) / 3.0
  );

  vec4 texColor = texture2D(uTexture, atlasUV);

  // Apply color tint
  vec3 finalColor = vColor * texColor.rgb;

  float alpha = texColor.a * vAlpha;
  if (alpha < 0.01) discard;

  gl_FragColor = vec4(finalColor, alpha);
}
