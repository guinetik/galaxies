// ---------------------------------------------------------------------------
// neighborField.ts — pure helper for distant-galaxy sprite descriptors
//
// Given a viewed galaxy and a list of real neighbors (from the DB), produces
// NeighborSprite descriptors that place each neighbor in a display shell
// [8·baseDistance, 16·baseDistance] preserving the real relative direction.
// ---------------------------------------------------------------------------

import type { Galaxy } from '@/types/galaxy'
import { morphologyToAtlasIndex } from '../GalaxyTextures'
import {
  selectPreset,
  assignPresetFromPgc,
  presetToCategory,
} from './morphology'

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface NeighborSprite {
  position: [number, number, number]
  size: number
  brightness: number
  texIndex: number
  color: [number, number, number]
}

// --------------------------------------------------------------------------
// Math helpers
// --------------------------------------------------------------------------

const DEG2RAD = Math.PI / 180

/**
 * Convert supergalactic spherical coordinates (longitude, latitude in degrees,
 * radius in Mpc) to Cartesian [x, y, z].
 *
 * Convention matches the supergalactic coordinate system:
 *   x = r · cos(lat) · cos(lon)
 *   y = r · sin(lat)
 *   z = r · cos(lat) · sin(lon)
 */
export function sphericalToCartesian(
  lonDeg: number,
  latDeg: number,
  r: number,
): [number, number, number] {
  const lon = lonDeg * DEG2RAD
  const lat = latDeg * DEG2RAD
  const c = Math.cos(lat)
  return [r * c * Math.cos(lon), r * Math.sin(lat), r * c * Math.sin(lon)]
}

// --------------------------------------------------------------------------
// Private helpers
// --------------------------------------------------------------------------

/** Deterministic warm/cool color tint per galaxy PGC — avoids green. */
function seededColor(pgc: number): [number, number, number] {
  const h = ((pgc * 2654435761) >>> 0) / 4294967296
  const warm: [number, number, number] = [1.0, 0.85, 0.7]
  const cool: [number, number, number] = [0.8, 0.85, 1.0]
  return h < 0.5 ? warm : cool
}

/**
 * Map a Galaxy's morphology string to an atlas index using the same
 * pipeline as GalaxyField.ts:
 *   selectPreset / assignPresetFromPgc → presetToCategory → morphologyToAtlasIndex
 */
function galaxyToAtlasIndex(g: Galaxy): number {
  const preset = g.morphology
    ? selectPreset(g.morphology)
    : assignPresetFromPgc(g.pgc)
  const category = presetToCategory(preset)
  return morphologyToAtlasIndex(category)
}

// --------------------------------------------------------------------------
// Shell placement constants
// --------------------------------------------------------------------------

/** Maximum real-space Mpc distance used for shell-radius mapping. */
const MAX_MPC = 15

/** Base sprite size in Three.js units. */
const SIZE_BASE = 3.0

// --------------------------------------------------------------------------
// Main export
// --------------------------------------------------------------------------

/**
 * Compute distant-sprite descriptors for a set of neighbor galaxies as seen
 * from `galaxy`.
 *
 * Each neighbor is projected onto a display shell at radius r where:
 *   r ∈ [baseDistance·8, baseDistance·16]
 * mapped logarithmically from the real Mpc separation, preserving direction.
 *
 * Returns [] when the viewed galaxy lacks supergalactic coordinates.
 */
export function computeNeighborSprites(
  galaxy: Galaxy,
  neighbors: Galaxy[],
  baseDistance: number,
): NeighborSprite[] {
  if (
    galaxy.sgl == null ||
    galaxy.sgb == null ||
    galaxy.distance_mpc == null
  ) {
    return []
  }

  const origin = sphericalToCartesian(galaxy.sgl, galaxy.sgb, galaxy.distance_mpc)
  const out: NeighborSprite[] = []

  for (const n of neighbors) {
    if (n.sgl == null || n.sgb == null || n.distance_mpc == null) continue

    // Real-space Cartesian position of the neighbor
    const p = sphericalToCartesian(n.sgl, n.sgb, n.distance_mpc)

    // Offset vector from the viewed galaxy to the neighbor
    const off: [number, number, number] = [
      p[0] - origin[0],
      p[1] - origin[1],
      p[2] - origin[2],
    ]

    const dMpc = Math.hypot(...off)
    if (dMpc < 1e-4) continue // skip co-located (same position)

    // Map real distance to display shell radius [8·base, 16·base]
    // Using logarithmic mapping: r = base · (8 + 8 · log(1+d) / log(1+MAX_MPC))
    const r = baseDistance * (8 + 8 * Math.log(1 + dMpc) / Math.log(1 + MAX_MPC))

    // Unit direction vector
    const dir: [number, number, number] = [
      off[0] / dMpc,
      off[1] / dMpc,
      off[2] / dMpc,
    ]

    // t goes 0→1 as dMpc goes 0→MAX_MPC; farther → smaller, dimmer
    const t = Math.min(1, dMpc / MAX_MPC)

    out.push({
      position: [dir[0] * r, dir[1] * r, dir[2] * r],
      size: SIZE_BASE * (1 - 0.6 * t),
      brightness: 0.5 * (1 - 0.5 * t),
      texIndex: galaxyToAtlasIndex(n),
      color: seededColor(n.pgc),
    })
  }

  return out
}
