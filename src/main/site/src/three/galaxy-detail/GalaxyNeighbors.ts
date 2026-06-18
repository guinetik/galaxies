// ---------------------------------------------------------------------------
// GalaxyNeighbors.ts — distant neighbor galaxy sprite layer
//
// Renders neighbor galaxies as subtle background sprites using the shared
// galaxy texture atlas. Points are screen-space-clamped to stay small and
// unobtrusive. Atlas tile UV is derived from aTexIndex at render time.
//
// Atlas layout: 4 columns × 2 rows, each tile 1/4 wide × 1/2 tall.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import type { NeighborSprite } from './neighborField'

// ─── Inline shader strings ──────────────────────────────────────────────────
//
// Kept short and inline (rather than ?raw files) because neighbor sprites
// are a self-contained, auxiliary layer with no shared includes.

const NEIGHBOR_VERT = /* glsl */ `
attribute float aSize;
attribute vec3  aColor;
attribute float aTexIndex;
attribute float aBrightness;

uniform float uPixelRatio;
uniform float uBaseDistance;

varying vec3  vColor;
varying float vTexIndex;
varying float vBrightness;

void main() {
  vColor      = aColor;
  vTexIndex   = aTexIndex;
  vBrightness = aBrightness;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  // Screen-space size: same formula as particle.vert.glsl, clamped smaller.
  float pointSize = aSize * uPixelRatio * (uBaseDistance * 1.28 / -mvPosition.z);
  gl_PointSize = clamp(pointSize, 1.0 * uPixelRatio, 5.0 * uPixelRatio);
  gl_Position  = projectionMatrix * mvPosition;
}
`

const NEIGHBOR_FRAG = /* glsl */ `
precision highp float;

uniform sampler2D uAtlas;
uniform float     uBrightness;  // global master dim (0.7)

varying vec3  vColor;
varying float vTexIndex;
varying float vBrightness;  // per-sprite distance fade from aBrightness

void main() {
  // Atlas layout: 4 cols x 2 rows
  const float COLS = 4.0;
  const float ROWS = 2.0;
  float idx  = floor(vTexIndex + 0.5);
  float col  = mod(idx, COLS);
  float row  = floor(idx / COLS);

  // Map gl_PointCoord [0,1]^2 into the tile's UV window
  vec2 tileUV = vec2(
    (col + gl_PointCoord.x) / COLS,
    (row + gl_PointCoord.y) / ROWS
  );

  vec4 tex = texture2D(uAtlas, tileUV);

  // Apply brightness once: per-sprite distance fade × global master dim.
  float dim   = vBrightness * uBrightness;
  float alpha = tex.a;
  if (alpha < 0.005) discard;

  gl_FragColor = vec4(tex.rgb * vColor * dim, alpha * dim);
}
`

// ─── GalaxyNeighbors ────────────────────────────────────────────────────────

export class GalaxyNeighbors {
  readonly points: THREE.Points
  private geometry: THREE.BufferGeometry
  private material: THREE.ShaderMaterial

  constructor(
    sprites: NeighborSprite[],
    atlas: THREE.Texture,
    baseDistance: number,
  ) {
    const count = sprites.length

    // ─── Build attribute buffers ─────────────────────────────────────────

    const positions   = new Float32Array(count * 3)
    const colors      = new Float32Array(count * 3)
    const sizes       = new Float32Array(count)
    const texIndices  = new Float32Array(count)
    const brightnesses = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const s = sprites[i]

      positions[i * 3]     = s.position[0]
      positions[i * 3 + 1] = s.position[1]
      positions[i * 3 + 2] = s.position[2]

      colors[i * 3]     = s.color[0]
      colors[i * 3 + 1] = s.color[1]
      colors[i * 3 + 2] = s.color[2]

      sizes[i]        = s.size
      texIndices[i]   = s.texIndex
      brightnesses[i] = s.brightness
    }

    // ─── Geometry ─────────────────────────────────────────────────────────

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position',    new THREE.BufferAttribute(positions,    3))
    this.geometry.setAttribute('aColor',      new THREE.BufferAttribute(colors,       3))
    this.geometry.setAttribute('aSize',       new THREE.BufferAttribute(sizes,        1))
    this.geometry.setAttribute('aTexIndex',   new THREE.BufferAttribute(texIndices,   1))
    this.geometry.setAttribute('aBrightness', new THREE.BufferAttribute(brightnesses, 1))

    // ─── Material ─────────────────────────────────────────────────────────

    this.material = new THREE.ShaderMaterial({
      vertexShader:   NEIGHBOR_VERT,
      fragmentShader: NEIGHBOR_FRAG,
      uniforms: {
        uPixelRatio:   { value: Math.min(window.devicePixelRatio, 2) },
        uBaseDistance: { value: baseDistance },
        uAtlas:        { value: atlas },
        uBrightness:   { value: 0.7 },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    })

    // ─── Points ───────────────────────────────────────────────────────────

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.frustumCulled = false
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
    // Atlas is owned by the caller — do not dispose here.
  }
}
