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
 *
 * Algorithm:
 * 1. Quantize brightness [0,255] into N discrete layers (default 15)
 * 2. For each layer, find pixels within ±tolerance of target brightness
 * 3. Convert matched pixels to world coordinates [-1, 1]
 * 4. Map brightness to z-depth: bright (high brightness) → closer (z=0), dim → farther (z=-zDepthScale)
 * 5. Create BufferGeometry with matched vertices; opacity follows sqrt falloff for smooth transitions
 * 6. Return ordered LayerMesh array (bright layer first, dim layer last)
 *
 * Design: This creates a volumetric approximation without ray marching by stacking 2D point clouds
 * at different depths. Additive blending combines layers into a smooth 3D perception.
 */
const defaultOpacityCurve = (brightness: number): number => {
  // sqrt(brightness) gives smooth falloff: bright=1.0 → 1.0 opacity, dim=0.0 → 0.0 opacity
  // Linear falloff (brightness) would make dim layers too faint; sqrt is empirically smoother
  return Math.pow(brightness, 0.5);
};

export function generateDensityMeshes(
  imageData: Uint8ClampedArray,
  imageWidth: number,
  imageHeight: number,
  options: LayerOptions
): LayerMesh[] {
  const {
    layerCount,
    zDepthScale,
    opacityCurve = defaultOpacityCurve,
  } = options;

  const meshes: LayerMesh[] = [];
  // Tolerance: each layer captures pixels in range [targetByte ± tolerance]
  // For 15 layers: 255 / 15 = 17 bytes per layer, tolerance = 8.5 bytes
  // This ~25-30% overlap between adjacent layers creates smooth transitions
  const tolerance = 255 / layerCount / 2;

  // Check if image is completely empty (all zeros)
  let hasAnyData = false;
  for (let i = 0; i < imageData.length; i += 4) {
    if (imageData[i] > 0) {
      hasAnyData = true;
      break;
    }
  }

  for (let layer = 0; layer < layerCount; layer++) {
    const normalizedBrightness = layerCount === 1 ? 0.5 : layer / (layerCount - 1);
    const targetByte = Math.round(normalizedBrightness * 255);

    const vertices: number[] = [];

    // Scan image for pixels matching this brightness
    for (let y = 0; y < imageHeight; y++) {
      for (let x = 0; x < imageWidth; x++) {
        const pixelIdx = (y * imageWidth + x) * 4; // RGBA
        const pixelBrightness = imageData[pixelIdx]; // R channel

        if (Math.abs(pixelBrightness - targetByte) <= tolerance) {
          // Map to world coordinates [-1, 1]
          const worldX = (x / imageWidth) * 2 - 1;
          const worldY = (y / imageHeight) * 2 - 1;
          // Map brightness to z-depth: brighter pixels closer to camera (z=0),
          // dimmer pixels farther away (z=-zDepthScale). This creates depth perception:
          // brain interprets bright & close = dense core, dim & far = sparse halo
          const worldZ = -(normalizedBrightness * zDepthScale);

          vertices.push(worldX, worldY, worldZ);
        }
      }
    }

    // Create geometry if vertices exist, or if image is empty (create all layers for empty images)
    if (vertices.length > 0 || !hasAnyData) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(vertices), 3)
      );

      const opacity = opacityCurve(normalizedBrightness);

      meshes.push({
        brightness: normalizedBrightness,
        opacity,
        geometry,
        zDepth: -normalizedBrightness * zDepthScale,
      });
    }
  }

  return meshes;
}
