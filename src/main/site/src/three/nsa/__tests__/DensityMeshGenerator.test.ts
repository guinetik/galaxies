import { describe, it, expect } from "vitest";
import { generateDensityMeshes } from "../DensityMeshGenerator";

describe("DensityMeshGenerator", () => {
  it("should generate correct number of layers", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 10,
      zDepthScale: 1.0,
      imageWidth: 256,
      imageHeight: 256,
    });
    expect(meshes).toHaveLength(10);
  });

  it("should assign brightness in ascending order", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 10,
      zDepthScale: 1.0,
      imageWidth: 256,
      imageHeight: 256,
    });
    for (let i = 1; i < meshes.length; i++) {
      expect(meshes[i].brightness).toBeGreaterThan(meshes[i - 1].brightness);
    }
  });

  it("should assign z-depth in ascending order (farther = lower brightness)", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 10,
      zDepthScale: 1.0,
      imageWidth: 256,
      imageHeight: 256,
    });
    for (let i = 1; i < meshes.length; i++) {
      expect(meshes[i].zDepth).toBeLessThan(meshes[i - 1].zDepth);
    }
  });

  it("should create valid BufferGeometry per layer", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    imageData[0] = 100; // Set one pixel to non-zero
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 5,
      zDepthScale: 1.0,
      imageWidth: 256,
      imageHeight: 256,
    });
    meshes.forEach((mesh) => {
      expect(mesh.geometry.attributes.position).toBeDefined();
    });
  });
});
