// ─── Hash functions ────────────────────────────────────────────────────────

fn seedHash(seed: f32) -> f32 {
  var p3 = fract(vec3<f32>(seed) * vec3<f32>(0.1031, 0.1030, 0.0973));
  p3 = p3 + vec3<f32>(dot(p3, p3.yzx + vec3<f32>(33.33)));
  return fract((p3.x + p3.y) * p3.z);
}

fn hash33(p_in: vec3<f32>) -> vec3<f32> {
  var p = fract(p_in * vec3<f32>(0.1031, 0.1030, 0.0973));
  p = p + vec3<f32>(dot(p, p.yxz + vec3<f32>(33.33)));
  return fract((p.xxy + p.yxx) * p.zyx);
}

// ─── Simplex noise 3D ─────────────────────────────────────────────────────

fn mod289_3(x: vec3<f32>) -> vec3<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289_4(x: vec4<f32>) -> vec4<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn permute_4(x: vec4<f32>) -> vec4<f32> {
  return mod289_4(((x * 34.0) + 1.0) * x);
}

fn taylorInvSqrt_4(r: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(1.79284291400159) - 0.85373472095314 * r;
}

fn snoise3D(v: vec3<f32>) -> f32 {
  let Cx = 1.0 / 6.0;
  let Cy = 1.0 / 3.0;

  var i = floor(v + vec3<f32>(dot(v, vec3<f32>(Cy))));
  let x0 = v - i + vec3<f32>(dot(i, vec3<f32>(Cx)));

  let g = step(x0.yzx, x0.xyz);
  let l = vec3<f32>(1.0) - g;
  let i1 = min(g, l.zxy);
  let i2 = max(g, l.zxy);

  let x1 = x0 - i1 + vec3<f32>(Cx);
  let x2 = x0 - i2 + vec3<f32>(Cy);
  let x3 = x0 - vec3<f32>(0.5);

  i = mod289_3(i);
  let p = permute_4(permute_4(permute_4(
              i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0));

  let n_ = 0.142857142857;
  // D = vec4(0, 0.5, 1, 2) → D.wyz = vec3(2, 0.5, 1), D.xzx = vec3(0, 1, 0)
  let ns = n_ * vec3<f32>(2.0, 0.5, 1.0) - vec3<f32>(0.0, 1.0, 0.0);

  let j = p - 49.0 * floor(p * ns.z * ns.z);
  let x_v = floor(j * ns.z);
  let y_v = floor(j - 7.0 * x_v);

  let xr = x_v * ns.x + vec4<f32>(ns.y);
  let yr = y_v * ns.x + vec4<f32>(ns.y);
  let h = vec4<f32>(1.0) - abs(xr) - abs(yr);

  let b0 = vec4<f32>(xr.xy, yr.xy);
  let b1 = vec4<f32>(xr.zw, yr.zw);

  let s0 = floor(b0) * 2.0 + 1.0;
  let s1 = floor(b1) * 2.0 + 1.0;
  let sh = -step(h, vec4<f32>(0.0));

  let a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  let a1 = b1.xzyw + s1.xzyw * sh.zzww;

  let p0 = vec3<f32>(a0.xy, h.x);
  let p1 = vec3<f32>(a0.zw, h.y);
  let p2 = vec3<f32>(a1.xy, h.z);
  let p3 = vec3<f32>(a1.zw, h.w);

  let norm = taylorInvSqrt_4(vec4<f32>(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  let p0n = p0 * norm.x;
  let p1n = p1 * norm.y;
  let p2n = p2 * norm.z;
  let p3n = p3 * norm.w;

  var m = max(vec4<f32>(0.6) - vec4<f32>(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), vec4<f32>(0.0));
  m = m * m;

  return 42.0 * dot(m * m, vec4<f32>(dot(p0n, x0), dot(p1n, x1), dot(p2n, x2), dot(p3n, x3)));
}

// ─── FBM ──────────────────────────────────────────────────────────────────

fn fbm3D(p_in: vec3<f32>, octaves: i32) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var frequency = 1.0;
  var p = p_in;
  let shift = vec3<f32>(100.0);

  for (var i = 0; i < 8; i = i + 1) {
    if (i >= octaves) { break; }
    value = value + amplitude * snoise3D(p * frequency);
    p = p + shift;
    frequency = frequency * 2.0;
    amplitude = amplitude * 0.5;
  }
  return value;
}

// ─── Spiral noise ─────────────────────────────────────────────────────────

fn spiralNoise(p_in: vec3<f32>, seed: f32) -> f32 {
  let normalizer = 1.0 / sqrt(10.0); // 1 + NUDGE^2 = 10
  var n = 1.5 - seed * 0.5;
  var it = 2.0;
  var p = p_in;

  for (var i = 0; i < SPIRAL_NOISE_ITER; i = i + 1) {
    n = n - abs(sin(p.y * it) + cos(p.x * it)) / it;
    let xy1 = p.xy + vec2<f32>(p.y, -p.x) * 3.0;
    p = vec3<f32>(xy1 * normalizer, p.z);
    let xz1 = vec2<f32>(p.x, p.z) + vec2<f32>(p.z, -p.x) * 3.0;
    p = vec3<f32>(xz1.x * normalizer, p.y, xz1.y * normalizer);
    it = it * (1.5 + seed * 0.2);
  }
  return n;
}

// ─── Nebula density functions ─────────────────────────────────────────────

fn nebulaDensity(p: vec3<f32>, seed: f32) -> f32 {
  let k = 1.5 + seed * 0.5;
  let sp = spiralNoise(p * 0.5, seed);
  let detail = fbm3D(p * 2.0, FBM_DETAIL_OCTAVES) * 0.35;
  let fine = fbm3D(p * 6.0, 2) * 0.15;
  return k * (0.5 + sp * 0.5 + detail + fine);
}

fn densityVariation(p: vec3<f32>, seed: f32) -> f32 {
  var largeBright = fbm3D(p * 0.3 + seed * 50.0, 2);
  largeBright = smoothstep(-0.4, 0.4, largeBright);
  var mediumVar = fbm3D(p * 0.8 + seed * 30.0, 2);
  mediumVar = mediumVar * 0.5 + 0.5;
  return 0.3 + largeBright * (0.4 + mediumVar * 0.3);
}

fn voidMask(p: vec3<f32>, seed: f32) -> f32 {
  let voidNoise = fbm3D(p * 0.6 + seed * 70.0, 2);
  let voids = smoothstep(-0.5, 0.3, voidNoise);
  let smallVoids = fbm3D(p * 1.5 + seed * 90.0, 2);
  let sv = smoothstep(-0.5, 0.2, smallVoids);
  return 0.55 + voids * sv * 0.45;
}

fn brightRegions(p: vec3<f32>, seed: f32) -> f32 {
  var patch1 = fbm3D(p * 0.5 + seed * 40.0, 2);
  patch1 = pow(max(patch1 + 0.3, 0.0), 2.0);
  var cores = fbm3D(p * 1.5 + seed * 60.0, 2);
  cores = pow(max(cores + 0.5, 0.0), 3.0) * 0.5;
  return patch1 + cores;
}

// ─── Emission colors ──────────────────────────────────────────────────────

fn nebulaEmissionColor(hue: f32, variation: f32, seed: f32) -> vec3<f32> {
  // IQ cosine palette with seed-driven phase for unique colors per galaxy
  let s1 = seedHash(seed + 10.0);
  let s2 = seedHash(seed + 20.0);
  let s3 = seedHash(seed + 30.0);

  let a = vec3<f32>(0.5, 0.4, 0.5);
  let b = vec3<f32>(0.5, 0.4, 0.45);
  let c = vec3<f32>(1.0, 1.0, 0.8);
  let d = vec3<f32>(s1, s2, s3);

  var col = a + b * cos(6.283185 * (c * hue + d));
  col = col + (variation - 0.5) * 0.12;
  return max(col, vec3<f32>(0.0));
}

fn starColorFromTemp(temp: f32) -> vec3<f32> {
  if (temp < 0.2) {
    return mix(vec3<f32>(1.0, 0.6, 0.4), vec3<f32>(1.0, 0.75, 0.5), temp / 0.2);
  } else if (temp < 0.4) {
    return mix(vec3<f32>(1.0, 0.75, 0.5), vec3<f32>(1.0, 0.9, 0.75), (temp - 0.2) / 0.2);
  } else if (temp < 0.6) {
    return mix(vec3<f32>(1.0, 0.9, 0.75), vec3<f32>(1.0, 1.0, 1.0), (temp - 0.4) / 0.2);
  } else if (temp < 0.8) {
    return mix(vec3<f32>(1.0, 1.0, 1.0), vec3<f32>(0.85, 0.9, 1.0), (temp - 0.6) / 0.2);
  }
  return mix(vec3<f32>(0.85, 0.9, 1.0), vec3<f32>(0.7, 0.8, 1.0), (temp - 0.8) / 0.2);
}

fn starScintillation(base: f32, sh: f32, t: f32) -> f32 {
  if (base < 0.5) { return base; }
  var s = 1.0 + 0.03 * sin(t * 1.5 + sh * 6.28318) + 0.02 * sin(t * 2.7 + sh * 8.168);
  return base * s;
}

// ─── Distant gas cloud ────────────────────────────────────────────────────

fn distantGasCloud(dir: vec3<f32>, seed: f32, cc: vec3<f32>, cs: f32, ccol: vec3<f32>) -> vec4<f32> {
  let d = length(dir - cc);
  var mask = 1.0 - smoothstep(0.0, cs, d);
  mask = pow(max(mask, 0.0), 1.5);
  if (mask < 0.01) { return vec4<f32>(0.0); }

  let lp = (dir - cc) / cs;
  let n1 = fbm3D(lp * 3.0 + seed * 10.0, 3) * 0.5 + 0.5;
  let n2 = fbm3D(lp * 8.0 + seed * 20.0, 2) * 0.5 + 0.5;
  let vn = fbm3D(lp * 2.0 + seed * 30.0, 2);
  let voids = smoothstep(-0.3, 0.2, vn);
  var bc = fbm3D(lp * 4.0 + seed * 40.0, 2);
  bc = pow(max(bc + 0.4, 0.0), 2.5);

  var density = mask * n1 * (0.7 + n2 * 0.3) * voids;
  density = density + bc * mask * 0.3;
  let edge = smoothstep(0.0, 0.3, mask) * (1.0 - smoothstep(0.7, 1.0, mask));
  density = density * (0.4 + edge * 0.6);

  let cv = fbm3D(lp * 2.5 + seed * 15.0, 2) * 0.15;
  var vc = ccol * (0.85 + cv * 2.0);
  vc = mix(vc, ccol * 1.3, bc);

  return vec4<f32>(vc * (0.12 + density * 0.28), density * 0.45);
}

// ─── Emission knot ────────────────────────────────────────────────────────

fn emissionKnot(dir: vec3<f32>, seed: f32, center: vec3<f32>, size: f32, kcol: vec3<f32>) -> vec4<f32> {
  let d = length(dir - center);
  var mask = 1.0 - smoothstep(0.0, size, d);
  mask = pow(max(mask, 0.0), 2.0);
  if (mask < 0.01) { return vec4<f32>(0.0); }

  let lp = (dir - center) / size;
  let n = fbm3D(lp * 5.0 + seed * 25.0, 2) * 0.5 + 0.5;
  var density = mask * n + exp(-d * 30.0 / size) * 0.8;
  return vec4<f32>(kcol * density * 0.6, min(density * 0.5, 1.0));
}

// ─── Distant galaxy ───────────────────────────────────────────────────────

fn distantGalaxy(dir: vec3<f32>, seed: f32, center: vec3<f32>, size: f32) -> vec3<f32> {
  let d = length(dir - center);
  if (d > size * 2.0) { return vec3<f32>(0.0); }

  let tc = dir - center;
  let tiltAxis = normalize(hash33(vec3<f32>(seed * 100.0)) - 0.5);
  let diskDist = length(tc - tiltAxis * dot(tc, tiltAxis));
  let heightDist = abs(dot(tc, tiltAxis));
  let angle = atan2(tc.y, tc.x);
  let sp = sin(angle * 2.0 + diskDist * 20.0 / size + seed * 6.28318) * 0.5 + 0.5;
  let disk = exp(-diskDist * 8.0 / size) * exp(-heightDist * 40.0 / size);
  let bulge = exp(-d * 15.0 / size) * 0.8;
  let brightness = (disk * (0.3 + sp * 0.7) + bulge) * 0.15;
  let gc = mix(vec3<f32>(1.0, 0.9, 0.7), vec3<f32>(0.9, 0.85, 1.0), seedHash(seed + 0.5));
  return gc * brightness;
}

// ─── Entry point ──────────────────────────────────────────────────────────

fn backdrop(dir: vec3<f32>, uTime: f32, uSeed: f32, uNebulaIntensity: f32) -> vec4<f32> {
  let realTime = uTime;
  let flowTime = uTime * 0.008;

  let sh1 = seedHash(uSeed);
  let sh2 = seedHash(uSeed + 1.0);
  let sh3 = seedHash(uSeed + 2.0);
  let sh4 = seedHash(uSeed + 3.0);
  let sh5 = seedHash(uSeed + 4.0);
  let sh6 = seedHash(uSeed + 5.0);

  let animPos = dir + vec3<f32>(
    flowTime * 0.03 * (sh1 - 0.5),
    flowTime * 0.03 * 0.5,
    flowTime * 0.03 * (sh2 - 0.5)
  );

  var finalColor = vec3<f32>(0.005, 0.005, 0.008);

  // ── Distant galaxies ──
  let numGalaxies = 2 + i32(sh5 * 3.0);
  for (var i = 0; i < MAX_GALAXIES; i = i + 1) {
    if (i >= numGalaxies) { break; }
    let gs = seedHash(uSeed + f32(i) * 7.0 + 100.0);
    let gc = normalize(vec3<f32>(seedHash(gs) - 0.5, seedHash(gs + 0.1) - 0.5, seedHash(gs + 0.2) - 0.5));
    finalColor = finalColor + distantGalaxy(dir, gs, gc, 0.03 + seedHash(gs + 0.3) * 0.04);
  }

  // ── Stars — 4 jittered layers ──
  var starField = 0.0;
  var starColor = vec3<f32>(1.0);

  // Bright
  let sc1 = floor(dir * 180.0);
  let sh1v = seedHash(dot(sc1, vec3<f32>(127.1, 311.7, 74.7)) + uSeed);
  if (sh1v > 0.993) {
    let j1 = hash33(sc1 + uSeed) * 0.8 + 0.1;
    let d1 = length(dir - normalize((sc1 + j1) / 180.0));
    var s1 = exp(-d1 * 800.0) * (0.6 + sh1v * 0.4);
    s1 = starScintillation(s1, sh1v, realTime);
    starField = s1;
    starColor = starColorFromTemp(seedHash(sh1v * 77.7));
  }

  // Medium
  let sc2 = floor(dir * 320.0);
  let sh2v = seedHash(dot(sc2, vec3<f32>(93.1, 157.3, 211.7)) + uSeed * 2.0);
  if (sh2v > 0.988) {
    let j2 = hash33(sc2 + uSeed + 7.0) * 0.8 + 0.1;
    let d2 = length(dir - normalize((sc2 + j2) / 320.0));
    let s2 = exp(-d2 * 1000.0) * (0.35 + sh2v * 0.35);
    if (s2 > starField) {
      starField = s2;
      starColor = starColorFromTemp(seedHash(sh2v * 77.7));
    }
  }

  // Faint (skipped on mobile: STAR_LAYERS <= 2)
  if (STAR_LAYERS > 2) {
    let sc3 = floor(dir * 520.0);
    let sh3v = seedHash(dot(sc3, vec3<f32>(41.1, 89.3, 173.7)) + uSeed * 3.0);
    if (sh3v > 0.978) {
      let j3 = hash33(sc3 + uSeed + 13.0) * 0.8 + 0.1;
      let d3 = length(dir - normalize((sc3 + j3) / 520.0));
      starField = max(starField, exp(-d3 * 1400.0) * 0.25);
    }
  }

  // Very faint (skipped on mobile: STAR_LAYERS <= 3)
  if (STAR_LAYERS > 3) {
    let sc4 = floor(dir * 850.0);
    let sh4v = seedHash(dot(sc4, vec3<f32>(17.3, 43.7, 97.1)) + uSeed * 4.0);
    if (sh4v > 0.970) {
      let j4 = hash33(sc4 + uSeed + 19.0) * 0.8 + 0.1;
      let d4 = length(dir - normalize((sc4 + j4) / 850.0));
      starField = max(starField, exp(-d4 * 2000.0) * 0.1);
    }
  }

  finalColor = finalColor + starColor * starField;

  // ── Distant gas clouds ──
  let numClouds = 3 + i32(sh4 * 4.0);
  for (var ci = 0; ci < MAX_CLOUDS; ci = ci + 1) {
    if (ci >= numClouds) { break; }
    let cs = seedHash(uSeed + f32(ci) * 13.0 + 50.0);
    let cc = normalize(vec3<f32>(seedHash(cs) - 0.5, seedHash(cs + 0.1) - 0.5, seedHash(cs + 0.2) - 0.5));
    let csz = 0.15 + seedHash(cs + 0.3) * 0.25;
    let ch = fract(sh1 + 0.3 + seedHash(cs + 0.4) * 0.4);
    let ccol = nebulaEmissionColor(ch, seedHash(cs + 0.5), uSeed);
    let cloud = distantGasCloud(dir, cs, cc, csz, ccol);
    finalColor = mix(finalColor, finalColor + cloud.rgb * uNebulaIntensity, cloud.a);
  }

  // ── Main nebula ──
  let lightDir = normalize(vec3<f32>(sh1 - 0.5, 0.3, sh2 - 0.5));
  let mainDen = nebulaDensity(animPos * 2.0, sh1);
  let offDen = nebulaDensity(animPos * 2.0 + lightDir * 0.15, sh1);
  var density = mainDen * 0.65 + offDen * 0.35;

  let variation = densityVariation(animPos, sh1);
  density = density * (0.3 + variation * 1.2);
  let voids = voidMask(animPos, sh2);
  density = density * voids;
  let brightSpots = brightRegions(animPos, sh3);
  density = density + brightSpots * 0.4;

  var cloudMask = smoothstep(0.02, 0.52, density);
  cloudMask = cloudMask * 0.85;

  let colorNoise = fbm3D(animPos * 1.2 + vec3<f32>(sh3 * 10.0), 3) * 0.5 + 0.5;
  let regionalHue = fbm3D(animPos * 0.4 + sh4 * 20.0, 2) * 0.3;
  let hue = fract(sh1 + colorNoise * 0.25 + regionalHue);
  var nebulaColor = nebulaEmissionColor(hue, colorNoise, uSeed);

  var hotspots = fbm3D(animPos * 2.5 + sh6 * 30.0, 2);
  hotspots = pow(max(hotspots + 0.3, 0.0), 2.0);

  var brightness = 0.5 + cloudMask * 0.8;
  brightness = brightness * (0.85 + sh4 * 0.3);
  brightness = brightness * (0.6 + brightSpots * 1.2);
  brightness = brightness * (0.8 + hotspots * 0.8);
  brightness = brightness * (0.7 + variation * 0.8);
  nebulaColor = nebulaColor * brightness;

  let structure = fbm3D(animPos * 4.0, 2) * 0.5 + 0.5;
  nebulaColor = nebulaColor * (0.85 + structure * 0.3);

  let edgeGlow = pow(max(cloudMask, 0.0), 0.6) - pow(max(cloudMask, 0.0), 1.8);
  nebulaColor = nebulaColor + nebulaColor * edgeGlow * 0.5;

  let brightEdge = pow(max(brightSpots - 0.2, 0.0), 0.5);
  nebulaColor = nebulaColor + nebulaEmissionColor(hue + 0.1, 0.8, uSeed) * brightEdge * 0.3;

  let dustLane = smoothstep(0.2, 0.5, fbm3D(animPos * 1.5 + vec3<f32>(sh2 * 5.0), 3));
  nebulaColor = nebulaColor * (0.5 + dustLane * 0.5);
  nebulaColor = nebulaColor * (0.2 + voids * 0.8);

  var nebulaAlpha = cloudMask * 0.7 * voids;

  // ── Emission knots ──
  let numKnots = 2 + i32(sh3 * 4.0);
  for (var ki = 0; ki < MAX_KNOTS; ki = ki + 1) {
    if (ki >= numKnots) { break; }
    let ks = seedHash(uSeed + f32(ki) * 23.0 + 300.0);
    let kc = normalize(vec3<f32>(
      (seedHash(ks) - 0.5) * 0.8,
      (seedHash(ks + 0.1) - 0.5) * 0.8,
      0.5 + seedHash(ks + 0.2) * 0.3
    ));
    let ksz = 0.02 + seedHash(ks + 0.3) * 0.03;
    let kh = fract(sh1 + 0.15 + seedHash(ks + 0.4) * 0.2);
    let kcol = nebulaEmissionColor(kh, 0.7, uSeed) * 1.5;
    let knot = emissionKnot(dir, ks, kc, ksz, kcol);
    nebulaColor = nebulaColor + knot.rgb;
    nebulaAlpha = max(nebulaAlpha, knot.a);
  }

  // ── Composite ──
  let obscuration = nebulaAlpha * 0.8 * uNebulaIntensity;
  finalColor = mix(finalColor, nebulaColor, obscuration);
  finalColor = finalColor + starColor * starField * (1.0 - obscuration) * 0.3;

  let vignette = 1.0 - pow(max(abs(dir.y) - 0.10, 0.0), 2.0) * 0.08;
  finalColor = finalColor * vignette;
  // Dim for intergalactic backdrop — light from far outside the galaxy should
  // be subtle, not vivid.  Then clamp HDR and convert to linear for WebGPU's
  // sRGB output encoding.
  finalColor = finalColor * 0.45;
  finalColor = clamp(finalColor, vec3<f32>(0.0), vec3<f32>(1.0));
  finalColor = pow(finalColor, vec3<f32>(2.2));

  return vec4<f32>(finalColor, 1.0);
}
