/**
 * Shared interface for WebGL and WebGPU galaxy scene implementations.
 */
export interface IGalaxyScene {
  start(): void | Promise<void>
  dispose(): void
}
