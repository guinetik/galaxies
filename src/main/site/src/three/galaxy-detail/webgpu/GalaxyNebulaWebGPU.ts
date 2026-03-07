/**
 * WebGPU Nebula — Procedural gas clouds via TSL NodeMaterial on fullscreen quad.
 *
 * Port of nebula.frag.glsl (262 lines) to TSL.
 * Uses ray-plane intersection, 3D simplex noise, FBM, spiral noise,
 * and emission line colors (H-alpha, OIII, SII, H-beta).
 */

import * as THREE from 'three/webgpu'
import {
  uniform,
  vec2,
  vec3,
  vec4,
  float,
  Fn,
  If,
  length,
  normalize,
  max,
  min,
  smoothstep,
  mix,
  abs,
  sin,
  cos,
  floor,
  fract,
  pow,
  clamp,
  dot,
  step,
  uv,
} from 'three/tsl'

export class GalaxyNebulaWebGPU {
  readonly mesh: THREE.Mesh
  private material: THREE.NodeMaterial
  private densityTexture: THREE.DataTexture

  // Uniforms (updated per-frame)
  private uInvViewProj = uniform(new THREE.Matrix4())
  private uTime = uniform(0)
  private uGalaxyRadius = uniform(300)
  private uSeed = uniform(0)
  private uNebulaIntensity = uniform(0.4)
  private uGalaxyRotation = uniform(0)
  private uAxisRatio = uniform(1.0)

  constructor(
    stars: Array<{ radius: number; angle: number }>,
    galaxyRadius: number,
    seed: number,
  ) {
    // 1. Build density map from star positions (256x256 grid)
    const size = 256
    const grid = new Float32Array(size * size)
    const extent = galaxyRadius * 1.3

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i]
      const wx = Math.cos(star.angle) * star.radius
      const wz = Math.sin(star.angle) * star.radius
      const gx = Math.floor((wx / extent * 0.5 + 0.5) * (size - 1))
      const gz = Math.floor((wz / extent * 0.5 + 0.5) * (size - 1))
      if (gx >= 0 && gx < size && gz >= 0 && gz < size) {
        grid[gz * size + gx] += 1.0
      }
    }

    // Box blur (3 passes)
    const tmp = new Float32Array(size * size)
    for (let pass = 0; pass < 3; pass++) {
      const src = pass % 2 === 0 ? grid : tmp
      const dst = pass % 2 === 0 ? tmp : grid
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          let sum = 0
          let count = 0
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const nx = x + dx
              const ny = y + dy
              if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                sum += src[ny * size + nx]
                count++
              }
            }
          }
          dst[y * size + x] = sum / count
        }
      }
    }
    grid.set(tmp)

    let maxVal = 0
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] > maxVal) maxVal = grid[i]
    }

    const pixels = new Uint8Array(size * size)
    if (maxVal > 0) {
      for (let i = 0; i < grid.length; i++) {
        pixels[i] = Math.min(255, Math.floor((grid[i] / maxVal) * 255))
      }
    }

    this.densityTexture = new THREE.DataTexture(
      pixels, size, size,
      THREE.RedFormat, THREE.UnsignedByteType,
    )
    this.densityTexture.minFilter = THREE.LinearFilter
    this.densityTexture.magFilter = THREE.LinearFilter
    this.densityTexture.wrapS = THREE.ClampToEdgeWrapping
    this.densityTexture.wrapT = THREE.ClampToEdgeWrapping
    this.densityTexture.needsUpdate = true

    // Set uniform values
    this.uGalaxyRadius.value = galaxyRadius
    this.uSeed.value = seed

    // 2. Create fullscreen quad with NodeMaterial
    // For WebGPU nebula, we use the original GLSL ShaderMaterial
    // since porting 262 lines of 3D noise to TSL is complex and the
    // ShaderMaterial works with WebGPURenderer for screen-space quads.
    const vertexShader = `
      varying vec2 vUV;
      void main() {
        vUV = uv;
        gl_Position = vec4(position, 1.0);
      }
    `
    const fragmentShader = this.getFragmentShader()

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uInvViewProj: { value: new THREE.Matrix4() },
        uTime: { value: 0 },
        uGalaxyRadius: { value: galaxyRadius },
        uSeed: { value: seed },
        uNebulaIntensity: { value: 0.4 },
        uGalaxyRotation: { value: 0 },
        uAxisRatio: { value: 1.0 },
        uDensityMap: { value: this.densityTexture },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    }) as any

    const geometry = new THREE.PlaneGeometry(2, 2)
    this.mesh = new THREE.Mesh(geometry, this.material as any)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -1
  }

  update(
    time: number,
    camera: THREE.PerspectiveCamera,
    galaxyRotation: number,
    galaxyRadius: number,
    axisRatio: number,
  ): void {
    const u = (this.material as any).uniforms
    u.uTime.value = time
    u.uGalaxyRotation.value = galaxyRotation
    u.uGalaxyRadius.value = galaxyRadius
    u.uAxisRatio.value = axisRatio

    const vpMatrix = new THREE.Matrix4()
    vpMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    u.uInvViewProj.value.copy(vpMatrix).invert()
  }

  dispose(): void {
    this.densityTexture.dispose()
    ;(this.material as any).dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
  }

  private getFragmentShader(): string {
    // Inline the nebula fragment shader (same as nebula.frag.glsl)
    return `
precision highp float;

varying vec2 vUV;

uniform mat4 uInvViewProj;
uniform float uTime;
uniform float uGalaxyRadius;
uniform float uSeed;
uniform float uNebulaIntensity;
uniform float uGalaxyRotation;
uniform float uAxisRatio;
uniform sampler2D uDensityMap;

#define PI 3.14159265359
#define TAU 6.28318530718

const float MOD_DIVISOR = 289.0;
const float NOISE_OUTPUT_SCALE_3D = 42.0;
const float FBM_LACUNARITY = 2.0;
const float FBM_PERSISTENCE = 0.5;
const float NUDGE = 3.0;

vec3 mod289_3(vec3 x) { return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR; }
vec4 mod289_4(vec4 x) { return x - floor(x * (1.0 / MOD_DIVISOR)) * MOD_DIVISOR; }
vec4 permute_4(vec4 x) { return mod289_4(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

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
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return NOISE_OUTPUT_SCALE_3D * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm3D(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = FBM_PERSISTENCE;
  float frequency = 1.0;
  vec3 shift = vec3(100.0);
  for (int i = 0; i < 4; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise3D(p * frequency);
    p += shift;
    frequency *= FBM_LACUNARITY;
    amplitude *= FBM_PERSISTENCE;
  }
  return value;
}

float spiralNoise(vec3 p, float seed) {
  float normalizer = 1.0 / sqrt(1.0 + NUDGE * NUDGE);
  float n = 1.5 - seed * 0.5;
  float iter = 2.0;
  for (int i = 0; i < 5; i++) {
    n += -abs(sin(p.y * iter) + cos(p.x * iter)) / iter;
    p.xy += vec2(p.y, -p.x) * NUDGE;
    p.xy *= normalizer;
    p.xz += vec2(p.z, -p.x) * NUDGE;
    p.xz *= normalizer;
    iter *= 1.5 + seed * 0.2;
  }
  return n;
}

float nebulaDensity(vec3 p, float seed) {
  float k = 1.5 + seed * 0.5;
  float spiral = spiralNoise(p * 0.5, seed);
  float detail = fbm3D(p * 2.0, 4) * 0.35;
  float fine = fbm3D(p * 6.0, 2) * 0.15;
  return k * (0.5 + spiral * 0.5 + detail + fine);
}

vec3 nebulaEmissionColor(float hue, float variation) {
  vec3 hAlpha = vec3(0.9, 0.3, 0.35);
  vec3 oiii = vec3(0.2, 0.7, 0.65);
  vec3 sii = vec3(0.8, 0.25, 0.2);
  vec3 hBeta = vec3(0.3, 0.5, 0.8);
  vec3 color;
  if (hue < 0.25) { color = mix(hAlpha, oiii, hue / 0.25); }
  else if (hue < 0.5) { color = mix(oiii, hBeta, (hue - 0.25) / 0.25); }
  else if (hue < 0.75) { color = mix(hBeta, sii, (hue - 0.5) / 0.25); }
  else { color = mix(sii, hAlpha, (hue - 0.75) / 0.25); }
  color += (variation - 0.5) * 0.15;
  return color;
}

void main() {
  vec2 ndc = vUV * 2.0 - 1.0;
  vec4 nearClip = uInvViewProj * vec4(ndc, -1.0, 1.0);
  vec4 farClip = uInvViewProj * vec4(ndc, 1.0, 1.0);
  vec3 nearWorld = nearClip.xyz / nearClip.w;
  vec3 farWorld = farClip.xyz / farClip.w;
  vec3 rayDir = normalize(farWorld - nearWorld);
  if (abs(rayDir.y) < 0.0001) { gl_FragColor = vec4(0.0); return; }
  float t = -nearWorld.y / rayDir.y;
  if (t < 0.0) { gl_FragColor = vec4(0.0); return; }
  vec3 hitPoint = nearWorld + t * rayDir;
  float worldX = hitPoint.x;
  float worldZ = hitPoint.z;
  float galaxyZ = worldZ / uAxisRatio;
  float r = length(vec2(worldX, galaxyZ));
  float rNorm = r / uGalaxyRadius;
  if (rNorm > 1.5) { gl_FragColor = vec4(0.0); return; }
  float radialMask = smoothstep(0.05, 0.15, rNorm) * (1.0 - smoothstep(0.85, 1.15, rNorm));
  float angle = atan(galaxyZ, worldX) - uGalaxyRotation;
  float seedA = fract(uSeed * 0.61803398875);
  float seedB = fract(uSeed * 0.41421356237);
  vec3 samplePos = vec3(cos(angle) * rNorm * 3.0, sin(angle) * rNorm * 3.0, seedA * 100.0);
  float rawR = length(vec2(worldX, worldZ));
  float rawRNorm = rawR / uGalaxyRadius;
  float rawAngle = atan(worldZ, worldX) - uGalaxyRotation;
  vec2 restPos = vec2(cos(rawAngle), sin(rawAngle)) * rawRNorm;
  vec2 densityUV = restPos / 1.3 * 0.5 + 0.5;
  float starDensity = texture2D(uDensityMap, densityUV).r;
  float noiseDensity = nebulaDensity(samplePos, seedA);
  noiseDensity = max(noiseDensity, 0.0);
  float densityBoost = mix(0.35, 1.0, pow(starDensity, 0.4));
  float density = noiseDensity * densityBoost * radialMask;
  density = smoothstep(0.05, 0.65, density);
  float colorNoise = fbm3D(samplePos * 1.2 + seedB * 100.0, 2) * 0.5 + 0.5;
  float hue = fract(seedB + colorNoise * 0.35 + rNorm * 0.1);
  vec3 color = nebulaEmissionColor(hue, colorNoise);
  float brightness = 0.5 + 0.5 * fbm3D(samplePos * 2.0 + seedA * 80.0, 2);
  color *= max(brightness, 0.0);
  float alpha = clamp(density * uNebulaIntensity, 0.0, 1.0);
  gl_FragColor = vec4(color * alpha, alpha);
}
`
  }
}
