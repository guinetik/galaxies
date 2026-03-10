import * as THREE from "three";

/**
 * Generate layered mesh shells from a 2D density image
 * @param densityImage - ImageData or Canvas2D context containing grayscale density [0, 255]
 * @param options - LayerOptions with layerCount, zDepthScale, opacityCurve
 * @returns Array of LayerMesh objects (geometry + material per layer)
 */
export interface LayerOptions {
  layerCount: number;           // Number of density shells (default: 15)
  zDepthScale: number;          // Max Z depth (default: 1.0)
  opacityCurve?: (brightness: number) => number; // Brightness [0,1] -> opacity [0,1]
  imageWidth: number;           // Width of source image
  imageHeight: number;          // Height of source image
}

export interface LayerMesh {
  brightness: number;           // Center brightness level for this layer
  opacity: number;             // Calculated opacity
  geometry: THREE.BufferGeometry;
  zDepth: number;              // Z position for this layer
}

/**
 * Generate layered mesh shells from a 2D density image
 * @param imageData - Uint8ClampedArray containing grayscale density [0, 255]
 * @param imageWidth - Width of the source image
 * @param imageHeight - Height of the source image
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
