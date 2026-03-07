precision highp float;

void main() {
  vec2 coord = gl_PointCoord * 2.0 - vec2(1.0);
  if (length(coord) > 0.72) {
    discard;
  }

  gl_FragColor = vec4(0.0);
}
