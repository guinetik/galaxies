/**
 * Returns the seeded initial orbit angles for a galaxy detail scene.
 *
 * The tilt is intentionally negative so that, after applying the tilt first
 * and the random yaw second, the camera always starts above the galaxy plane.
 */
export function getInitialOrbitAngles(galaxyPgc: number): { initRotY: number, initTiltX: number } {
  return {
    initRotY: ((galaxyPgc * 2654435761 >>> 0) / 4294967296) * Math.PI * 2,
    initTiltX: -0.45,
  }
}
