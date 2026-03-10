import * as THREE from "three";

/**
 * Configuration for generating layered mesh shells
 */
export interface LayerOptions {
  layerCount: number;           // Number of density shells (default: 15)
  zDepthScale: number;          // Max Z depth (default: 1.0)
  opacityCurve?: (brightness: number) => number; // Brightness [0,1] -> opacity [0,1]
}

export interface LayerMesh {
  brightness: number;           // Center brightness level for this layer
  opacity: number;             // Calculated opacity
  geometry: THREE.BufferGeometry;
  zDepth: number;              // Z position for this layer
}

/**
 * Generate layered mesh shells from a 2D density image
 * @param imageData - Uint8ClampedArray with RGBA format (4 bytes per pixel).
 *                    Grayscale density uses R channel [0, 255], G/B/A ignored.
 * @param imageWidth - Width of the source image in pixels
 * @param imageHeight - Height of the source image in pixels
 * @param options - LayerOptions with layerCount, zDepthScale, opacityCurve
 * @returns Array of LayerMesh objects (geometry + material per layer)
 */
export function generateDensityMeshes(
  imageData: Uint8ClampedArray,
  imageWidth: number,
  imageHeight: number,
  options: LayerOptions
): LayerMesh[] {
  // Implementation in Task 3
  throw new Error("Not implemented");
}
