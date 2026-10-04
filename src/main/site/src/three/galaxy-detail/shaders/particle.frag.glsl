precision highp float;

varying vec4 vColor;
uniform float uBody;
uniform float uBodyOpacity;
uniform float uOldPopulation;
varying float vCoverage;
varying vec3 vTransmission;
varying float vRadius;
varying float vPatchiness;
varying float vResolveFade;

void main() {
    if (uBody > 0.0) {
      vec2 p = gl_PointCoord * 2.0 - 1.0;
      float envelope = max(0.0, exp(-dot(p, p) * 5.0) - exp(-5.0));
      vec3 outerTint = mix(vec3(0.48, 0.62, 0.9), vec3(0.82, 0.71, 0.57), uOldPopulation);
      vec3 tint = mix(vec3(0.92, 0.76, 0.55), outerTint, clamp(vRadius * 2.5, 0.0, 1.0));
      float radialLight = exp(-vRadius * 2.3) * (1.0 - smoothstep(0.85, 1.2, vRadius));
      gl_FragColor = vec4(tint * vTransmission, envelope * radialLight * uBodyOpacity * mix(vPatchiness, 1.0, uOldPopulation) * vResolveFade * vCoverage);
      return;
    }
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float core = exp(-dot(p, p) * 4.5);
    float alpha = vColor.a * core * vCoverage * 0.65;
    if (alpha < 0.004) discard;

    vec3 color = mix(vColor.rgb, vec3(0.85, 0.9, 1.0), 0.12);
    vec3 litRgb = color * 1.8 * vTransmission;

    gl_FragColor = vec4(litRgb, alpha);
}
