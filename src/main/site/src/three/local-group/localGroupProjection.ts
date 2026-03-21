import type {
  LocalGroupCoordinates,
  LocalGroupProjectedCoordinates,
  LocalGroupProjection,
  LocalGroupProjectionOptions,
  LocalGroupVector3,
} from './localGroupTypes'

export const LOCAL_GROUP_SCENE_UNITS_PER_MPC = 70

const DEFAULT_PROJECTION_OPTIONS: LocalGroupProjectionOptions = {
  planeTiltDeg: 69,
  planeAzimuthDeg: -24,
  sceneUnitsPerMpc: LOCAL_GROUP_SCENE_UNITS_PER_MPC,
  heightScale: 1.15,
}

/**
 * Returns the concentric Local Group range rings in megaparsecs.
 */
export function getLocalGroupRangeRingsMpc(maxRangeMpc: number, stepMpc: number): number[] {
  const rings: number[] = []
  for (let value = stepMpc; value <= maxRangeMpc; value += stepMpc) {
    rings.push(value)
  }
  return rings
}

/**
 * Creates the oblique projection basis used by the Local Group scene.
 */
export function createLocalGroupProjection(
  overrides: Partial<LocalGroupProjectionOptions> = {},
): LocalGroupProjection {
  const options: LocalGroupProjectionOptions = {
    ...DEFAULT_PROJECTION_OPTIONS,
    ...overrides,
  }

  const azimuth = toRadians(options.planeAzimuthDeg)
  const tilt = toRadians(options.planeTiltDeg)

  const tangentX = rotateX(rotateY({ x: 1, y: 0, z: 0 }, azimuth), tilt)
  const tangentY = rotateX(rotateY({ x: 0, y: 0, z: 1 }, azimuth), tilt)
  const normal = rotateX(rotateY({ x: 0, y: 1, z: 0 }, azimuth), tilt)

  return {
    ...options,
    tangentX: normalize(tangentX),
    tangentY: normalize(tangentY),
    normal: normalize(normal),
  }
}

/**
 * Projects SGX, SGY, and SGZ coordinates into the tilted Local Group display frame.
 */
export function projectLocalGroupCoordinates(
  source: LocalGroupCoordinates,
  projection: LocalGroupProjection,
): LocalGroupProjectedCoordinates {
  const stemStart = rotateLocalGroupVectorByProjection(
    toLocalGroupDisplayCoordinates({ ...source, sgz: 0 }, projection.heightScale),
    projection,
  )
  const displayPosition = rotateLocalGroupVectorByProjection(
    toLocalGroupDisplayCoordinates(source, projection.heightScale),
    projection,
  )
  const rangeSceneUnits = Math.hypot(source.sgx, source.sgy)

  return {
    source,
    stemStart,
    displayPosition,
    rangeMpc: rangeSceneUnits / projection.sceneUnitsPerMpc,
    rangeSceneUnits,
    stemLength: Math.abs(source.sgz * projection.heightScale),
  }
}

/**
 * Converts SGX, SGY, and SGZ into the scene-local coordinates used by the tilted range frame.
 */
export function toLocalGroupDisplayCoordinates(
  source: LocalGroupCoordinates,
  heightScale: number,
): LocalGroupVector3 {
  return {
    x: source.sgx,
    y: source.sgz * heightScale,
    z: source.sgy,
  }
}

/**
 * Rotates a scene-local display vector into the world-space oblique projection frame.
 */
export function rotateLocalGroupVectorByProjection(
  vector: LocalGroupVector3,
  projection: LocalGroupProjection,
): LocalGroupVector3 {
  return addVectors(
    addVectors(
      scaleVector(projection.tangentX, vector.x),
      scaleVector(projection.normal, vector.y),
    ),
    scaleVector(projection.tangentY, vector.z),
  )
}

/**
 * Converts degrees into radians for Local Group projection math.
 */
function toRadians(valueDeg: number): number {
  return (valueDeg * Math.PI) / 180
}

/**
 * Rotates a numeric vector around the world Y axis.
 */
function rotateY(vector: LocalGroupVector3, angle: number): LocalGroupVector3 {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: vector.x * cos + vector.z * sin,
    y: vector.y,
    z: -vector.x * sin + vector.z * cos,
  }
}

/**
 * Rotates a numeric vector around the world X axis.
 */
function rotateX(vector: LocalGroupVector3, angle: number): LocalGroupVector3 {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: vector.x,
    y: vector.y * cos - vector.z * sin,
    z: vector.y * sin + vector.z * cos,
  }
}

/**
 * Returns a unit-length version of the provided vector.
 */
function normalize(vector: LocalGroupVector3): LocalGroupVector3 {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  }
}

/**
 * Multiplies a vector by a scalar value.
 */
function scaleVector(vector: LocalGroupVector3, scalar: number): LocalGroupVector3 {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
    z: vector.z * scalar,
  }
}

/**
 * Adds two numeric vectors together.
 */
function addVectors(left: LocalGroupVector3, right: LocalGroupVector3): LocalGroupVector3 {
  return {
    x: left.x + right.x,
    y: left.y + right.y,
    z: left.z + right.z,
  }
}
