import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { getInitialOrbitAngles } from '../galaxy-detail/initialOrbit'

describe('getInitialOrbitAngles', () => {
  it('keeps the initial camera above the galaxy plane for different seeds', () => {
    const forward = new THREE.Vector3(0, 0, 1)
    const pgcs = [1, 2, 17, 101, 1024, 8192, 65535]

    for (const pgc of pgcs) {
      const { initRotY, initTiltX } = getInitialOrbitAngles({
        pgc,
        position_angle: null,
        axial_ratio: null,
        ba: null,
      })
      const qTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), initTiltX)
      const qRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), initRotY)
      const cameraPosition = forward.clone().applyQuaternion(
        new THREE.Quaternion().multiplyQuaternions(qRot, qTilt),
      )

      expect(cameraPosition.y).toBeGreaterThan(0)
    }
  })

  it('uses observed position angle when available', () => {
    const { initRotY, initTiltX } = getInitialOrbitAngles({
      pgc: 1234,
      position_angle: 90,
      axial_ratio: null,
      ba: null,
    })

    expect(initRotY).toBeCloseTo(Math.PI / 2)
    expect(initTiltX).toBeCloseTo(-0.45)
  })

  it('infers tilt from axial ratio when available', () => {
    const baseline = getInitialOrbitAngles({
      pgc: 4321,
      position_angle: null,
      axial_ratio: null,
      ba: null,
    })
    const { initRotY, initTiltX } = getInitialOrbitAngles({
      pgc: 4321,
      position_angle: null,
      axial_ratio: 0.5,
      ba: null,
    })

    expect(initRotY).toBeCloseTo(baseline.initRotY)
    expect(initTiltX).toBeCloseTo(-Math.asin(0.5))
  })

  it('falls back to ba when axial ratio is missing', () => {
    const { initTiltX } = getInitialOrbitAngles({
      pgc: 4321,
      position_angle: null,
      axial_ratio: null,
      ba: 0.25,
    })

    expect(initTiltX).toBeCloseTo(-Math.asin(0.25))
  })

  it('falls back to ba when axial ratio is invalid', () => {
    const { initTiltX } = getInitialOrbitAngles({
      pgc: 4321,
      position_angle: null,
      axial_ratio: Number.NaN,
      ba: 0.25,
    })

    expect(initTiltX).toBeCloseTo(-Math.asin(0.25))
  })

  it('keeps observed edge-on galaxies slightly above the plane', () => {
    const forward = new THREE.Vector3(0, 0, 1)
    const { initRotY, initTiltX } = getInitialOrbitAngles({
      pgc: 999,
      position_angle: null,
      axial_ratio: 0,
      ba: null,
    })
    const qTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), initTiltX)
    const qRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), initRotY)
    const cameraPosition = forward.clone().applyQuaternion(
      new THREE.Quaternion().multiplyQuaternions(qRot, qTilt),
    )

    expect(cameraPosition.y).toBeGreaterThan(0)
  })
})
