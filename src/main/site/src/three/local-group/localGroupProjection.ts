// src/three/local-group/localGroupProjection.ts

/**
 * Flat orthographic projection constants
 */
export const LOCAL_GROUP_SCENE_UNITS_PER_MPC = 70

/**
 * Simple flat coordinate transform for 2D orthographic view
 */
export interface FlatLocalGroupProjection {
  sceneUnitsPerMpc: number
}

/**
 * Creates a flat orthographic projection (no tilt, no height scaling)
 */
export function createFlatLocalGroupProjection(): FlatLocalGroupProjection {
  return {
    sceneUnitsPerMpc: LOCAL_GROUP_SCENE_UNITS_PER_MPC,
  }
}

/**
 * Maps SGX, SGY, SGZ coordinates to flat 2D display coordinates
 * Z is always 0 (all points on the plane)
 */
export function toFlatLocalGroupDisplayCoordinates(
  sgx: number,
  sgy: number,
  _sgz: number, // ignored for flat projection
  sceneUnitsPerMpc: number
): { x: number; y: number; z: number } {
  return {
    x: sgx * sceneUnitsPerMpc,
    y: sgy * sceneUnitsPerMpc,
    z: 0,
  }
}

/**
 * Gets range ring distances in Mpc
 */
export function getLocalGroupRangeRingsMpc(maxMpc: number, stepMpc: number): number[] {
  const rings: number[] = []
  for (let i = stepMpc; i <= maxMpc; i += stepMpc) {
    rings.push(i)
  }
  return rings
}
