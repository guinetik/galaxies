precision highp float;

varying vec3 vDirection;

uniform float uTime;
uniform float uSeed;
uniform float uNebulaIntensity;

#define TAU 6.28318530718

const float MOD_DIVISOR = 289.0;
const float NOISE_OUTPUT_SCALE_3D = 42.0;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

vec3 mod289_3(vec3 x) {
  return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec4 mod289_4(vec4 x) {
  return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR;
}

vec4 permute_4(vec4 x) {
  return mod289_4(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise3D(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289_3(i);
  vec4 p = permute_4(permute_4(permute_4(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;

  return NOISE_OUTPUT_SCALE_3D * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm3D(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise3D(p);
    p = p * 2.0 + vec3(17.0, 29.0, 41.0);
    amplitude *= 0.52;
  }

  return value;
}

vec3 nebulaEmissionColor(float hue, float variation) {
  vec3 hAlpha = vec3(0.92, 0.33, 0.38);
  vec3 oiii = vec3(0.24, 0.73, 0.70);
  vec3 sii = vec3(0.82, 0.30, 0.23);
  vec3 hBeta = vec3(0.34, 0.52, 0.86);

  vec3 color;
  if (hue < 0.25) {
    color = mix(hAlpha, oiii, hue / 0.25);
  } else if (hue < 0.5) {
    color = mix(oiii, hBeta, (hue - 0.25) / 0.25);
  } else if (hue < 0.75) {
    color = mix(hBeta, sii, (hue - 0.5) / 0.25);
  } else {
    color = mix(sii, hAlpha, (hue - 0.75) / 0.25);
  }

  return color + (variation - 0.5) * 0.12;
}

vec4 nebulaCloud(vec3 dir, float seed, vec3 center, float size, float timeOffset) {
  float dist = length(dir - center);
  float shellMask = 1.0 - smoothstep(0.0, size, dist);
  if (shellMask < 0.001) {
    return vec4(0.0);
  }

  vec3 localPos = (dir - center) / max(size, 0.0001);
  vec3 flowA = vec3(timeOffset * 0.03, -timeOffset * 0.018, seed * 9.0);
  vec3 flowB = vec3(-timeOffset * 0.016, timeOffset * 0.024, seed * 17.0);

  float nearLayer = fbm3D(localPos * 2.6 + flowA) * 0.5 + 0.5;
  float farLayer = fbm3D(localPos * 5.8 + flowB) * 0.5 + 0.5;
  float wisps = fbm3D(localPos * 9.0 + vec3(seed * 31.0)) * 0.5 + 0.5;
  float voids = smoothstep(-0.35, 0.45, fbm3D(localPos * 1.7 - vec3(seed * 23.0)));

  float density = shellMask * mix(nearLayer, farLayer, 0.45);
  density *= 0.70 + wisps * 1.10;
  density *= 0.45 + voids * 0.95;

  float emission = pow(max(nearLayer, 0.0), 1.8) * shellMask;
  float hue = fract(seed * 0.137 + farLayer * 0.22 + wisps * 0.08);
  vec3 color = nebulaEmissionColor(hue, nearLayer);
  color *= 0.18 + density * 1.30 + emission * 0.42;

  return vec4(color, density * 0.85);
}

float starLayer(vec3 dir, float scale, float threshold, float falloff, float seedOffset) {
  vec3 cell = floor(dir * scale);
  float h = hash11(dot(cell, vec3(127.1, 311.7, 74.7)) + uSeed * seedOffset);
  if (h < threshold) {
    return 0.0;
  }

  vec3 center = (cell + 0.5) / scale;
  float dist = length(dir - normalize(center));
  float intensity = exp(-dist * falloff) * smoothstep(threshold, 1.0, h);
  float twinkle = 0.96 + 0.04 * sin(uTime * (1.4 + h * 2.6) + h * TAU);
  return intensity * twinkle;
}

vec3 starColor(float seed) {
  float t = hash11(seed * 19.7);
  vec3 warm = vec3(1.0, 0.84, 0.70);
  vec3 neutral = vec3(1.0, 0.98, 0.96);
  vec3 cool = vec3(0.72, 0.82, 1.0);
  return t < 0.5 ? mix(warm, neutral, t * 2.0) : mix(neutral, cool, (t - 0.5) * 2.0);
}

void main() {
  vec3 dir = normalize(vDirection);
  float time = uTime * 0.35;

  float horizon = 1.0 - abs(dir.y);
  vec3 color = mix(
    vec3(0.010, 0.014, 0.026),
    vec3(0.026, 0.038, 0.065),
    smoothstep(0.0, 0.95, horizon)
  );

  for (int i = 0; i < 6; i++) {
    float cloudSeed = uSeed + float(i) * 13.17;
    vec3 center = normalize(hash33(vec3(cloudSeed, cloudSeed + 1.7, cloudSeed + 3.9)) - 0.5);
    float size = 0.40 + hash11(cloudSeed + 0.7) * 0.28;
    vec4 cloud = nebulaCloud(dir, cloudSeed, center, size, time + float(i) * 3.0);
    color = mix(color, color + cloud.rgb * uNebulaIntensity, cloud.a);
  }

  vec3 bandDir = normalize(vec3(
    sin(uSeed * 0.013) * 0.6,
    -0.18 + cos(uSeed * 0.017) * 0.25,
    cos(uSeed * 0.019)
  ));
  float band = 1.0 - abs(dot(dir, bandDir));
  band = smoothstep(0.10, 0.92, band);
  float bandNoise = fbm3D(dir * 3.5 + vec3(0.0, time * 0.02, uSeed * 11.0)) * 0.5 + 0.5;
  vec3 bandColor = nebulaEmissionColor(fract(uSeed * 0.021 + bandNoise * 0.25), bandNoise);
  color += bandColor * band * (0.45 + bandNoise * 0.75) * 0.26 * uNebulaIntensity;

  float brightStars = starLayer(dir, 220.0, 0.9945, 900.0, 1.0);
  float mediumStars = starLayer(dir, 360.0, 0.9895, 1250.0, 2.0);
  float faintStars = starLayer(dir, 560.0, 0.9835, 1700.0, 3.0);

  float starIntensity = brightStars * 1.1 + mediumStars * 0.9 + faintStars * 0.55;
  vec3 stars = starColor(brightStars + mediumStars + faintStars + uSeed) * starIntensity;
  color += stars;

  float vignette = 1.0 - pow(max(abs(dir.y) - 0.10, 0.0), 2.0) * 0.08;
  color *= vignette;
  color = pow(max(color, 0.0), vec3(0.90));

  gl_FragColor = vec4(color, 1.0);
}
