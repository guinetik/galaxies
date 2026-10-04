/** Shared presentation settings; morphology remains responsible for all positions. */
export const CINEMATIC = {
  motionScale: 0.12,
  nebulaIntensity: 0.16,
  bodySamples: 30000,
  bodyDiameter: 0.12,
  bodyOpacity: 0.012,
  bodyResolutionScale: 0.25,
} as const

/** Shared CPU fade also determines whether the diffuse draw is needed at all. */
export function getStellarBodyVisibility(distance: number, galaxyRadius: number): number {
  const t = Math.max(0, Math.min(1, (distance / galaxyRadius - 0.35) / 0.95))
  return t * t * (3 - 2 * t)
}

/** Fit a sphere of radius R within both camera axes, with breathing room. */
export function getOverviewZoom(aspect: number, fovDegrees = 60): number {
  const halfVertical = fovDegrees * Math.PI / 360
  const halfHorizontal = Math.atan(Math.tan(halfVertical) * Math.max(aspect, 0.1))
  const distanceInRadii = 1.2 / Math.sin(Math.min(halfVertical, halfHorizontal))
  return 1.7 / distanceInRadii
}

/** The stylized accretion disk is a close-up detail, not a galaxy-scale landmark. */
export function getNucleusVisibility(distance: number, galaxyRadius: number): number {
  const t = Math.max(0, Math.min(1, (0.8 - distance / galaxyRadius) / 0.5))
  return t * t * (3 - 2 * t)
}
