/**
 * A lightweight numeric vector used by the Local Group projection helpers.
 */
export interface LocalGroupVector3 {
  x: number
  y: number
  z: number
}

/**
 * Source coordinates for a Local Group point expressed in scene units.
 * SGX and SGY define the in-plane position while SGZ becomes the lifted height.
 */
export interface LocalGroupCoordinates {
  sgx: number
  sgy: number
  sgz: number
}

/**
 * Projection settings for the oblique NASA-style range frame.
 */
export interface LocalGroupProjectionOptions {
  planeTiltDeg: number
  planeAzimuthDeg: number
  sceneUnitsPerMpc: number
  heightScale: number
}

/**
 * Resolved basis vectors used to project Local Group coordinates into display space.
 */
export interface LocalGroupProjection {
  planeTiltDeg: number
  planeAzimuthDeg: number
  sceneUnitsPerMpc: number
  heightScale: number
  tangentX: LocalGroupVector3
  tangentY: LocalGroupVector3
  normal: LocalGroupVector3
}

/**
 * Projection result for one Local Group point.
 */
export interface LocalGroupProjectedCoordinates {
  source: LocalGroupCoordinates
  stemStart: LocalGroupVector3
  displayPosition: LocalGroupVector3
  rangeMpc: number
  rangeSceneUnits: number
  stemLength: number
}

/**
 * Named focus preset shown by the Local Group overlay.
 */
export interface LocalGroupLandmark {
  id: string
  label: string
  description: string
  coordinates: LocalGroupCoordinates
  accent: string
  groupPgc?: number
}

/**
 * Visibility controls for the Local Group scene layers.
 */
export interface LocalGroupLayerVisibility {
  shells: boolean
  rings: boolean
  stems: boolean
  labels: boolean
}

/**
 * Hover and click payload returned by Local Group point picking.
 */
export interface LocalGroupPointHit {
  pgc: number
  velocity: number
  distance: number
}
