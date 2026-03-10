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
const defaultOpacityCurve = (brightness: number): number => {
  return Math.pow(brightness, 0.5); // sqrt for smoother falloff
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
          // Map brightness to z-depth (bright = closer = 0, dim = farther = -zDepthScale)
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
