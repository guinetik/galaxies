/**
 * WebGPU Black Hole — Ray-marched accretion disk on billboard quad (native TSL).
 *
 * Ports blackhole.frag.glsl to TSL Fn() nodes on a MeshBasicNodeMaterial.
 * Visual output matches the WebGL version.
 */

import * as THREE from 'three/webgpu'
import {
  uniform,
  vec2,
  vec3,
  vec4,
  float,
  Fn,
  Loop,
  If,
  Break,
  Discard,
  uv,
  length,
  normalize,
  cross,
  dot,
  cos,
  sin,
  atan,
  mix,
  smoothstep,
  step,
  min,
  max,
  clamp,
  pow,
  exp,
} from 'three/tsl'
import { hash13, noise2d, sdSphere, sdTorus } from './tsl-helpers'

export class GalaxyBlackHoleWebGPU {
  readonly mesh: THREE.Mesh
  readonly depthMesh: THREE.Mesh
  private quadSize: number

  // TSL uniforms (reactive via .value)
  private uTime = uniform(0)
  private uTiltX = uniform(0)
  private uRotY = uniform(0)
  private uLOD = uniform(0)

  constructor(quadSize = 60) {
    this.quadSize = quadSize

    // Depth sphere (invisible, writes depth to occlude stars behind BH)
    const depthGeometry = new THREE.SphereGeometry(1, 4, 4)
    const depthMaterial = new THREE.MeshBasicNodeMaterial({ visible: false })
    this.depthMesh = new THREE.Mesh(depthGeometry, depthMaterial)

    // Build TSL fragment
    const uTime = this.uTime
    const uTiltX = this.uTiltX
    const uRotY = this.uRotY
    const uLOD = this.uLOD

    const blackHoleFragment = Fn(() => {
      // UV → NDC
      const pp = uv().sub(0.5).mul(2.0)
      const screenR = length(pp)

      // Early discard outside circle
      If(screenR.greaterThan(1.0), () => {
        Discard()
      })

      // Camera setup
      const lookAt = vec3(0.0, -0.1, 0.0)
      const eyer = float(2.0)
      const eyea = uRotY
      const eyea2 = uTiltX.add(1.2)

      const ro = vec3(
        eyer.mul(cos(eyea)).mul(sin(eyea2)),
        eyer.mul(cos(eyea2)),
        eyer.mul(sin(eyea)).mul(sin(eyea2)),
      )

      const front = normalize(lookAt.sub(ro))
      const left = normalize(cross(normalize(vec3(0.0, 1.0, -0.1)), front))
      const up = normalize(cross(front, left))
      const rd = normalize(front.mul(1.5).add(left.mul(pp.x)).add(up.mul(pp.y)))

      // Black hole parameters
      const bh = vec3(0.0, 0.0, 0.0)
      const bhr = float(0.3)
      const bhmass = float(0.008)

      // Mutable ray state
      const p = ro.toVar()
      const pv = rd.toVar()

      // Jitter to reduce banding
      p.addAssign(pv.mul(hash13(rd.add(uTime)).mul(0.02)))

      // LOD-driven parameters
      const intensity = mix(float(0.3), float(1.0), uLOD)
      const stepSz = mix(float(0.012), float(0.005), uLOD)
      const animSpeed = mix(float(0.005), float(0.02), uLOD)
      const grainMix = mix(float(0.1), float(0.5), uLOD)

      const marchDt = float(0.02)
      const col = vec3(0.0, 0.0, 0.0).toVar()
      const noncaptured = float(1.0).toVar()
      const captured = float(0.0).toVar()

      const c1 = vec3(0.6, 0.25, 0.04)
      const c2 = vec3(0.85, 0.5, 0.15)
      const minDist = float(999.0).toVar()

      // Ray march with gravity
      const t = float(0.0).toVar()
      Loop(200, () => {
        If(t.greaterThanEqual(1.0), () => {
          Break()
        })

        p.addAssign(pv.mul(marchDt).mul(noncaptured))

        const bhv = bh.sub(p)
        const r2 = dot(bhv, bhv)
        minDist.assign(min(minDist, length(bhv)))
        pv.addAssign(normalize(bhv).mul(bhmass.div(r2)))

        noncaptured.assign(
          smoothstep(float(0.0), float(0.01), sdSphere(p.sub(bh), bhr)),
        )
        captured.assign(max(captured, float(1.0).sub(noncaptured)))

        // Disk texture using polar coordinates
        const dr = length(bhv.xz)
        const da = atan(bhv.x, bhv.z)
        const raY = da
          .mul(float(0.01).add(dr.sub(bhr).mul(0.002)))
          .add(Math.PI * 2)
          .add(uTime.mul(animSpeed))
        const ra = vec2(dr, raY).mul(vec2(10.0, 20.0))

        // Procedural noise — coarse structure + fine grain
        const coarse = max(
          float(0.0),
          noise2d(ra.mul(vec2(0.1, 0.5))).add(0.05),
        )
        const grain = noise2d(ra.mul(vec2(1.5, 3.0)).add(77.0))
        const diskTex = coarse.mul(
          float(1.0).sub(grainMix).add(grainMix.mul(grain)),
        )

        // Color gradient
        const bhvLen = length(bhv)
        const dcol = mix(
          c2,
          c1,
          pow(max(bhvLen.sub(bhr), float(0.0)), float(2.0)),
        )
          .mul(diskTex)
          .mul(float(2.5).div(float(0.001).add(bhvLen.sub(bhr).mul(50.0))))

        // Torus constraint
        const torusTest = step(
          float(0.0),
          sdTorus(
            p.mul(vec3(1.0, 20.0, 1.0)).sub(bh),
            vec2(0.85, 1.3),
          ).negate(),
        )

        col.addAssign(
          max(vec3(0.0, 0.0, 0.0), dcol.mul(torusTest).mul(noncaptured)),
        )

        // Glow
        col.addAssign(
          vec3(0.85, 0.5, 0.15)
            .mul(float(1.0).div(r2))
            .mul(0.002)
            .mul(noncaptured),
        )

        t.addAssign(stepSz)
      })

      // Analytical photon ring at ~1.5× BH radius
      const photonR = bhr.mul(1.5)
      const ringDist = minDist.sub(photonR)
      const innerFall = exp(ringDist.mul(ringDist).negate().div(0.003))
      const outerFall = exp(ringDist.mul(ringDist).negate().div(0.05))
      const ringBright = mix(innerFall, outerFall, step(float(0.0), ringDist))
        .mul(float(1.0).sub(captured))
        .mul(3.0)
      col.addAssign(mix(c2, c1, float(0.3)).mul(ringBright))

      // Ensure captured rays are pure black
      col.mulAssign(float(1.0).sub(captured))

      // Apply LOD intensity
      col.mulAssign(intensity)

      // Output with alpha
      const feather = float(1.0).sub(
        smoothstep(float(0.3), float(1.0), screenR),
      )
      const lum = dot(col, vec3(0.299, 0.587, 0.114))
      const glowAlpha = pow(
        clamp(lum.mul(3.0), float(0.0), float(1.0)),
        float(1.5),
      ).mul(feather)
      const alpha = max(glowAlpha, captured)
      col.mulAssign(feather)

      return vec4(col, alpha)
    })

    // Material
    const material = new THREE.MeshBasicNodeMaterial()
    material.transparent = true
    material.depthWrite = false
    material.side = THREE.DoubleSide
    material.fragmentNode = blackHoleFragment()

    // Visual billboard quad
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
    this.mesh.scale.set(quadSize, quadSize, 1)
    this.mesh.renderOrder = 1
  }

  update(
    time: number,
    cameraTiltX: number,
    cameraRotY: number,
    camera: THREE.Camera,
    rendererSize: THREE.Vector2,
    dpr: number,
  ): void {
    this.uTime.value = time
    this.uTiltX.value = cameraTiltX
    this.uRotY.value = cameraRotY

    this.mesh.quaternion.copy(camera.quaternion)

    // LOD: 0 = far away (dim), 1 = close up (full intensity)
    const camDist = camera.position.length()
    const fov = (camera as THREE.PerspectiveCamera).fov ?? 60
    const vFov = (fov * Math.PI) / 180
    const screenH = rendererSize.y * dpr
    const apparentPx =
      (this.quadSize / camDist) * (screenH / (2 * Math.tan(vFov / 2)))
    this.uLOD.value = Math.min(Math.max((apparentPx - 6) / 220, 0), 1)
  }

  getLOD(): number {
    return this.uLOD.value as number
  }

  dispose(): void {
    ;(this.mesh.material as THREE.Material).dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.depthMesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.depthMesh.material as THREE.Material).dispose()
  }
}
