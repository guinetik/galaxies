precision highp float;

uniform sampler2D uBand_u;
uniform sampler2D uBand_g;
uniform sampler2D uBand_r;
uniform sampler2D uBand_i;
uniform sampler2D uBand_z;
uniform sampler2D uBand_nuv;

uniform float uHas_u;
uniform float uHas_g;
uniform float uHas_r;
uniform float uHas_i;
uniform float uHas_z;
uniform float uHas_nuv;

uniform float uBrightness;
uniform float uSensitivity;
uniform float uTheme;
uniform float uGrayscale;

varying vec2 vUV;

float ign(vec2 coord) {
  vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(magic.z * fract(dot(coord, magic.xy)));
}

float normalize_band(float raw, float enabled) {
  if (enabled < 0.5) {
    return 0.0;
  }

  // The source band textures are already exported as linear per-band 0..1 images.
  // Composite mode intentionally keeps that raw normalization instead of applying
  // a second range-derived remap like Lupton or STF would.
  float normalized = clamp(raw, 0.0, 1.0);

  // Sensitivity acts as a linear black-point gate, not a nonlinear reveal curve.
  float floorLevel = (1.0 - clamp(uSensitivity, 0.0, 1.0)) * 0.25;
  return clamp((normalized - floorLevel) / max(1.0 - floorLevel, 1e-6), 0.0, 1.0);
}

float mean2(float a, float wa, float b, float wb) {
  float weight = wa + wb;
  return weight > 0.0 ? (a * wa + b * wb) / weight : 0.0;
}

float mean6(float a, float wa, float b, float wb, float c, float wc, float d, float wd, float e, float we, float f, float wf) {
  float weight = wa + wb + wc + wd + we + wf;
  return weight > 0.0 ? (a * wa + b * wb + c * wc + d * wd + e * we + f * wf) / weight : 0.0;
}

void main() {
  float dither = (ign(gl_FragCoord.xy) - 0.5) / 255.0;

  float uNorm = normalize_band(clamp(texture2D(uBand_u, vUV).r + dither, 0.0, 1.0), uHas_u);
  float gNorm = normalize_band(clamp(texture2D(uBand_g, vUV).r + dither, 0.0, 1.0), uHas_g);
  float rNorm = normalize_band(clamp(texture2D(uBand_r, vUV).r + dither, 0.0, 1.0), uHas_r);
  float iNorm = normalize_band(clamp(texture2D(uBand_i, vUV).r + dither, 0.0, 1.0), uHas_i);
  float zNorm = normalize_band(clamp(texture2D(uBand_z, vUV).r + dither, 0.0, 1.0), uHas_z);
  float nuvNorm = normalize_band(clamp(texture2D(uBand_nuv, vUV).r + dither, 0.0, 1.0), uHas_nuv);

  float longWave = mean2(zNorm, uHas_z, iNorm, uHas_i);
  float visible = mean2(rNorm, uHas_r, gNorm, uHas_g);
  float shortWave = mean2(uNorm, uHas_u, nuvNorm, uHas_nuv);
  float luminance = mean6(
    uNorm, uHas_u,
    gNorm, uHas_g,
    rNorm, uHas_r,
    iNorm, uHas_i,
    zNorm, uHas_z,
    nuvNorm, uHas_nuv
  );

  vec3 infra = vec3(longWave, visible, shortWave);
  vec3 astral = vec3(
    visible * 0.45 + shortWave * 0.10,
    visible * 0.80 + longWave * 0.05,
    shortWave + longWave * 0.12
  );

  vec3 themed = mix(infra, astral, clamp(uTheme, 0.0, 1.0));
  vec3 grayscale = vec3(luminance);
  vec3 outColor = mix(themed, grayscale, clamp(uGrayscale, 0.0, 1.0)) * max(uBrightness, 0.0);

  gl_FragColor = vec4(clamp(outColor, 0.0, 1.0), 1.0);
}
