import { describe, it, expect } from "vitest";
import { generateDensityMeshes } from "../DensityMeshGenerator";

describe("DensityMeshGenerator", () => {
  it("should generate correct number of layers", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 10,
      zDepthScale: 1.0,
    });
    expect(meshes).toHaveLength(10);
  });

  it("should assign brightness in ascending order", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 10,
      zDepthScale: 1.0,
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
    });
    meshes.forEach((mesh) => {
      expect(mesh.geometry.attributes.position).toBeDefined();
    });
  });

  it("should validate z-depth values within [0, -zDepthScale] range", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    const zDepthScale = 2.5;
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 10,
      zDepthScale,
    });
    meshes.forEach((mesh) => {
      expect(mesh.zDepth).toBeGreaterThanOrEqual(-zDepthScale);
      expect(mesh.zDepth).toBeLessThanOrEqual(0);
    });
  });

  it("should validate opacity values within [0, 1] range", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 10,
      zDepthScale: 1.0,
    });
    meshes.forEach((mesh) => {
      expect(mesh.opacity).toBeGreaterThanOrEqual(0);
      expect(mesh.opacity).toBeLessThanOrEqual(1);
    });
  });

  it("should assign valid opacity for each layer", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 8,
      zDepthScale: 1.0,
    });
    expect(meshes).toHaveLength(8);
    meshes.forEach((mesh) => {
      expect(mesh.opacity).toBeDefined();
      expect(typeof mesh.opacity).toBe("number");
      expect(mesh.opacity).toBeGreaterThanOrEqual(0);
      expect(mesh.opacity).toBeLessThanOrEqual(1);
    });
  });

  it("should handle single layer case", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    imageData[0] = 255; // Set one pixel to bright
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 1,
      zDepthScale: 1.0,
    });
    expect(meshes).toHaveLength(1);
    expect(meshes[0].geometry.attributes.position).toBeDefined();
    expect(meshes[0].opacity).toBeGreaterThanOrEqual(0);
    expect(meshes[0].opacity).toBeLessThanOrEqual(1);
  });

  it("should handle empty imageData (all zeros)", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4); // All zeros by default
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 5,
      zDepthScale: 1.0,
    });
    expect(meshes).toHaveLength(5);
    meshes.forEach((mesh) => {
      expect(mesh.geometry.attributes.position).toBeDefined();
      expect(mesh.zDepth).toBeGreaterThanOrEqual(-1.0);
      expect(mesh.zDepth).toBeLessThanOrEqual(0);
    });
  });

  it("should have position attribute with itemSize=3 and valid count", () => {
    const imageData = new Uint8ClampedArray(256 * 256 * 4);
    imageData[0] = 200; // Set one pixel
    const meshes = generateDensityMeshes(imageData, 256, 256, {
      layerCount: 3,
      zDepthScale: 1.0,
    });
    meshes.forEach((mesh) => {
      const posAttr = mesh.geometry.attributes.position;
      expect(posAttr).toBeDefined();
      expect(posAttr?.itemSize).toBe(3);
      expect(posAttr?.count).toBeGreaterThan(0);
    });
  });
});
