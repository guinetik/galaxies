import * as THREE from 'three'

const DEFAULT_CLOSE_UP_SCALE = 0.5
const DEFAULT_IDLE_DELAY_SECONDS = 2
const DEFAULT_IDLE_ROTATION_SPEED = 0.08
const DEFAULT_INTRO_DURATION_SECONDS = 5

export interface CosmicMapCameraMotionProfile {
  introStart: THREE.Vector3
  defaultPosition: THREE.Vector3
  introDurationSeconds: number
  idleDelaySeconds: number
  idleRotationSpeed: number
}

export interface IdleCameraMotionState {
  introProgress: number
  isUserInteracting: boolean
  secondsSinceInteraction: number
  hasFocusTransition?: boolean
  idleDelaySeconds?: number
}

/**
 * Builds the default intro and idle motion profile for the cosmic map camera.
 */
export function getCosmicMapCameraMotionProfile(
  basePosition: THREE.Vector3,
  maxDistance: number,
): CosmicMapCameraMotionProfile {
  const defaultPosition = basePosition.clone().multiplyScalar(DEFAULT_CLOSE_UP_SCALE)
  const introStart = defaultPosition.clone().normalize().multiplyScalar(maxDistance)

  return {
    introStart,
    defaultPosition,
    introDurationSeconds: DEFAULT_INTRO_DURATION_SECONDS,
    idleDelaySeconds: DEFAULT_IDLE_DELAY_SECONDS,
    idleRotationSpeed: DEFAULT_IDLE_ROTATION_SPEED,
  }
}

/**
 * Eases the intro camera blend so the opening move starts gently and settles smoothly.
 */
export function getIntroCameraBlend(progress: number): number {
  const clamped = THREE.MathUtils.clamp(progress, 0, 1)
  return THREE.MathUtils.smootherstep(clamped, 0, 1)
}

/**
 * Rotates a camera offset around the y axis while preserving its orbit radius.
 */
export function rotateOffsetAroundYAxis(offset: THREE.Vector3, angle: number): THREE.Vector3 {
  return offset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
}

/**
 * Returns whether the scene should apply idle camera motion this frame.
 */
export function shouldApplyIdleCameraMotion({
  introProgress,
  isUserInteracting,
  secondsSinceInteraction,
  hasFocusTransition = false,
  idleDelaySeconds = DEFAULT_IDLE_DELAY_SECONDS,
}: IdleCameraMotionState): boolean {
  if (introProgress < 1) return false
  if (isUserInteracting) return false
  if (hasFocusTransition) return false
  return secondsSinceInteraction >= idleDelaySeconds
}
