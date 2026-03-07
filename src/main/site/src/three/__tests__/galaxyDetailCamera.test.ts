import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { getInitialOrbitAngles } from '../galaxy-detail/initialOrbit'

describe('getInitialOrbitAngles', () => {
  it('keeps the initial camera above the galaxy plane for different seeds', () => {
    const forward = new THREE.Vector3(0, 0, 1)
    const pgcs = [1, 2, 17, 101, 1024, 8192, 65535]

    for (const pgc of pgcs) {
      const { initRotY, initTiltX } = getInitialOrbitAngles(pgc)
      const qTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), initTiltX)
      const qRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), initRotY)
      const cameraPosition = forward.clone().applyQuaternion(
        new THREE.Quaternion().multiplyQuaternions(qRot, qTilt),
      )

      expect(cameraPosition.y).toBeGreaterThan(0)
    }
  })
})
