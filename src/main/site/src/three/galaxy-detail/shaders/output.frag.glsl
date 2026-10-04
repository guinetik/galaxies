precision highp float;
uniform sampler2D uSceneTexture;
varying vec2 vUV;

void main() {
  vec4 color = texture2D(uSceneTexture, vUV);
  // Match the WebGPU composite: all layers accumulate in linear HDR before
  // highlight compression and the final display conversion.
  color.rgb = color.rgb / (vec3(1.0) + color.rgb);
  color.rgb = pow(max(color.rgb, 0.0), vec3(1.0 / 2.2));
  gl_FragColor = color;
}
