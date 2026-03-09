import { describe, expect, it } from 'vitest'
import {
  applyNsaOrbitDrag,
  buildNsaPointCloud,
  getDefaultNsaPointCloudOptions,
  getInteractionMode,
} from '../nsa/nsa3dPointCloud'

describe('getInteractionMode', () => {
  it('switches to orbit controls only for nsa3d', () => {
    expect(getInteractionMode('lupton')).toBe('image-plane')
    expect(getInteractionMode('custom')).toBe('image-plane')
    expect(getInteractionMode('volumetric')).toBe('image-plane')
    expect(getInteractionMode('nsa3d')).toBe('orbit')
  })
})

describe('getDefaultNsaPointCloudOptions', () => {
  it('uses a much lower default threshold so diffuse galaxy structure survives', () => {
    const options = getDefaultNsaPointCloudOptions(4544, 4544, 2557)

    expect(options.intensityThreshold).toBeLessThanOrEqual(0.02)
  })
})

describe('buildNsaPointCloud', () => {
  it('keeps bright pixels, drops dark pixels, and normalizes positions around center', () => {
    const pointCloud = buildNsaPointCloud(
      {
        width: 2,
        height: 2,
        bands: {
          u: new Float32Array([0.0, 0.9, 0.1, 0.001]),
          g: new Float32Array([0.0, 0.7, 0.2, 0.001]),
          r: new Float32Array([0.0, 0.6, 0.15, 0.001]),
          i: new Float32Array([0.0, 0.3, 0.1, 0.001]),
          z: new Float32Array([0.0, 0.2, 0.08, 0.001]),
          nuv: new Float32Array([0.0, 0.95, 0.15, 0.001]),
        },
      },
      {
        sampleStep: 1,
        intensityThreshold: 0.12,
        depthScale: 1.5,
        sizeRange: [2, 8],
        seed: 7,
      },
    )

    expect(pointCloud.points).toHaveLength(2)
    expect(pointCloud.points[0].x).toBeCloseTo(0.5, 4)
    expect(pointCloud.points[0].y).toBeCloseTo(0.5, 4)
    expect(pointCloud.points[1].x).toBeCloseTo(-0.5, 4)
    expect(pointCloud.points[1].y).toBeCloseTo(-0.5, 4)
    expect(pointCloud.points[0].size).toBeGreaterThan(pointCloud.points[1].size)
  })

  it('pushes hotter spectral samples farther forward than colder samples at similar brightness', () => {
    const hotCloud = buildNsaPointCloud(
      {
        width: 1,
        height: 1,
        bands: {
          u: new Float32Array([0.9]),
          g: new Float32Array([0.8]),
          r: new Float32Array([0.6]),
          i: new Float32Array([0.2]),
          z: new Float32Array([0.1]),
          nuv: new Float32Array([1.0]),
        },
      },
      {
        sampleStep: 1,
        intensityThreshold: 0.01,
        depthScale: 2.0,
        sizeRange: [2, 8],
        seed: 11,
      },
    )
    const coldCloud = buildNsaPointCloud(
      {
        width: 1,
        height: 1,
        bands: {
          u: new Float32Array([0.1]),
          g: new Float32Array([0.2]),
          r: new Float32Array([0.45]),
          i: new Float32Array([0.85]),
          z: new Float32Array([0.95]),
          nuv: new Float32Array([0.05]),
        },
      },
      {
        sampleStep: 1,
        intensityThreshold: 0.01,
        depthScale: 2.0,
        sizeRange: [2, 8],
        seed: 11,
      },
    )

    expect(hotCloud.points).toHaveLength(1)
    expect(coldCloud.points).toHaveLength(1)
    expect(hotCloud.points[0].z).toBeGreaterThan(coldCloud.points[0].z)
    expect(hotCloud.points[0].color[2]).toBeGreaterThan(coldCloud.points[0].color[2])
  })

  it('supports downsampling for performance-sensitive point cloud generation', () => {
    const pointCloud = buildNsaPointCloud(
      {
        width: 4,
        height: 4,
        bands: {
          u: new Float32Array(16).fill(0.8),
          g: new Float32Array(16).fill(0.7),
          r: new Float32Array(16).fill(0.6),
          i: new Float32Array(16).fill(0.5),
          z: new Float32Array(16).fill(0.4),
          nuv: new Float32Array(16).fill(0.9),
        },
      },
      {
        sampleStep: 2,
        intensityThreshold: 0.01,
        depthScale: 1.0,
        sizeRange: [2, 8],
        seed: 3,
      },
    )

    expect(pointCloud.points).toHaveLength(4)
  })
})

describe('applyNsaOrbitDrag', () => {
  it('treats upward drag as pitching the camera downward around the galaxy', () => {
    const start = { yaw: 0, pitch: 0.35 }
    const next = applyNsaOrbitDrag(start, 0, -12)

    expect(next.pitch).toBeLessThan(start.pitch)
  })

  it('treats downward drag as pitching the camera upward around the galaxy', () => {
    const start = { yaw: 0, pitch: 0.35 }
    const next = applyNsaOrbitDrag(start, 0, 12)

    expect(next.pitch).toBeGreaterThan(start.pitch)
  })
})
