/**
 * WebGPU Black Hole — Volumetric ray-marched accretion disk on billboard quad.
 *
 * Faithfully ported from singularity study project:
 *   - Direction-based gravity steering (normalize each step, power=0.3)
 *   - Double advance per iteration for proper ray deflection
 *   - Y-band volumetric disk with front-to-back compositing
 *   - Hard core capture for pure black center
 *
 * The strong direction steering (~170° total deflection) creates the 3D
 * Einstein ring arcs that curve above and below the black hole shadow.
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
  sqrt,
  max,
  mix,
  smoothstep,
  clamp,
} from 'three/tsl'
import { hash13, noise3d } from './tsl-helpers'

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

      If(screenR.greaterThan(1.0), () => {
        Discard()
      })

      // ─── Camera ─────────────────────────────────────────────────────────

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

      // ─── Black hole parameters (from singularity) ──────────────────────

      const originRadius = float(0.13) // event horizon radius
      const power = float(0.3) // gravity steering strength
      const bandWidth = float(0.04) // disk Y-band half-width

      // Step size: LOD-adaptive
      const stepSize = mix(float(0.018), float(0.012), uLOD)

      // Ray state — direction-based (singularity model)
      const rayPos = ro.toVar()
      const rayDir = rd.toVar()

      // Jitter to reduce banding
      rayPos.addAssign(rayDir.mul(hash13(rd.add(uTime)).mul(0.01)))

      // LOD
      const intensity = mix(float(0.3), float(1.0), uLOD)
      const animSpeed = mix(float(0.005), float(0.02), uLOD)
      const grainMix = mix(float(0.1), float(0.5), uLOD)

      // Front-to-back accumulators
      const col = vec3(0.0, 0.0, 0.0).toVar()
      const alphaAcc = float(0.0).toVar()
      const captured = float(0.0).toVar()

      // Disk colors — hot orange palette
      const cInner = vec3(1.0, 0.55, 0.12)
      const cMid = vec3(1.0, 0.3, 0.03)
      const cOuter = vec3(0.45, 0.1, 0.01)
      const emissionColor = vec3(0.25, 0.15, 0.05)
      const diskRotSpeed = uTime.mul(animSpeed).mul(30.0)

      // ─── Ray march with direction-based gravity steering ────────────────

      Loop(200, () => {
        // ── Gravity steering (singularity model) ──
        // Steer direction toward center, normalized each step
        const rNorm = normalize(rayPos)
        const rLen = length(rayPos)
        const steerMag = stepSize.mul(power).div(max(rLen.mul(rLen), float(0.001)))
        const steer = rNorm.mul(steerMag)
        const steeredDir = normalize(rayDir.sub(steer))

        // ── First advance (with current direction) ──
        const advance = rayDir.mul(stepSize)
        rayPos.addAssign(advance)

        // ── Hard core capture ──
        const rLenNow = length(rayPos)
        If(rLenNow.lessThan(originRadius), () => {
          captured.assign(1.0)
          Break()
        })

        // ── Volumetric accretion disk ──

        // XZ-plane radial distance (disk lies in XZ plane)
        const xyLen = length(vec2(rayPos.x, rayPos.z))

        // Y-band parabolic mask (volumetric disk thickness)
        const yNorm = rayPos.y.div(bandWidth)
        const yBand = max(float(0.0), float(1.0).sub(yNorm.mul(yNorm)))

        // Radial falloff
        const radialFade = smoothstep(float(1.3), float(0.16), xyLen)
        const diskMask = yBand.mul(radialFade)

        // 3D noise at rotated position (differential rotation like singularity)
        const rotPhase = xyLen.mul(4.27).sub(diskRotSpeed)
        const cosRot = cos(rotPhase)
        const sinRot = sin(rotPhase)
        const rotPos = vec3(
          rayPos.x.mul(cosRot).sub(rayPos.z.mul(sinRot)),
          rayPos.y.mul(8.0),
          rayPos.x.mul(sinRot).add(rayPos.z.mul(cosRot)),
        ).mul(14.0)

        // FBM — 3 octaves for dust-like detail
        const n1 = noise3d(rotPos).mul(0.5).add(0.5)
        const n2 = noise3d(rotPos.mul(2.03)).mul(0.5).add(0.5)
        const n3 = noise3d(rotPos.mul(4.01)).mul(0.5).add(0.5)
        const diskTex = n1.mul(0.25).add(n2.mul(0.12)).add(n3.mul(0.06)).add(0.55)

        // Doppler beaming
        const diskAngle = atan(rayPos.x.negate(), rayPos.z.negate())
        const doppler = float(1.0).add(cos(diskAngle.add(diskRotSpeed)).mul(0.7))

        // Color ramp (radial + noise variation)
        const rampInput = clamp(
          xyLen.add(diskTex.sub(0.5).mul(0.4)),
          float(0.0),
          float(1.0),
        )
        const diskColor = mix(
          mix(cInner, cMid, smoothstep(float(0.05), float(0.425), rampInput)),
          cOuter,
          smoothstep(float(0.425), float(1.0), rampInput),
        )

        // Emission (bright, minimum floor so noise doesn't kill it)
        const texBright = max(diskTex, float(0.3))
        const emissiveCol = diskColor
          .mul(texBright)
          .mul(doppler)
          .mul(3.0)
          .add(emissionColor.mul(diskMask).mul(2.0))

        // Alpha from disk mask
        const diskAlpha = diskMask.mul(
          clamp(texBright.mul(2.0), float(0.0), float(1.0)),
        )

        // Front-to-back compositing
        const oneMinusA = float(1.0).sub(alphaAcc)
        const weight = oneMinusA.mul(diskAlpha)
        col.assign(mix(col, emissiveCol, weight))
        alphaAcc.assign(
          clamp(
            mix(alphaAcc, float(1.0), diskAlpha),
            float(0.0),
            float(1.0),
          ),
        )

        // ── Second advance + direction update (singularity double-step) ──
        rayPos.addAssign(advance)
        rayDir.assign(steeredDir)

        // Escape: ray is far and heading outward
        If(
          dot(rayPos, rayPos).greaterThan(16.0).and(
            dot(rayDir, rayPos).greaterThan(0.0),
          ),
          () => {
            Break()
          },
        )
      })

      // Apply LOD intensity
      col.mulAssign(intensity)

      // ─── Output with alpha ──────────────────────────────────────────────

      const feather = float(1.0).sub(
        smoothstep(float(0.3), float(1.0), screenR),
      )
      col.mulAssign(feather)
      const alpha = max(alphaAcc.mul(feather), captured)

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
