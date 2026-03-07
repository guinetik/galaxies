/**
 * WebGPU Black Hole — Ray-marched accretion disk on billboard quad.
 *
 * Uses GLSL ShaderMaterial (works with WebGPURenderer for screen-space effects).
 * Same shader as the WebGL version — identical visual output.
 */

import * as THREE from 'three'
import blackholeVert from '../shaders/blackhole.vert.glsl?raw'
import blackholeFrag from '../shaders/blackhole.frag.glsl?raw'

export class GalaxyBlackHoleWebGPU {
  readonly mesh: THREE.Mesh
  readonly depthMesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private quadSize: number

  constructor(quadSize = 60) {
    this.quadSize = quadSize

    // Depth sphere (invisible, writes depth to occlude stars behind BH)
    const depthGeometry = new THREE.SphereGeometry(1, 4, 4)
    const depthMaterial = new THREE.MeshBasicMaterial({ visible: false })
    this.depthMesh = new THREE.Mesh(depthGeometry, depthMaterial)

    // Visual billboard quad
    this.material = new THREE.ShaderMaterial({
      vertexShader: blackholeVert,
      fragmentShader: blackholeFrag,
      uniforms: {
        uResolution: { value: new THREE.Vector2(512, 512) },
        uTime: { value: 0.0 },
        uTiltX: { value: 0.0 },
        uRotY: { value: 0.0 },
        uLOD: { value: 0.0 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material)
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
    this.material.uniforms.uTime.value = time
    this.material.uniforms.uTiltX.value = cameraTiltX
    this.material.uniforms.uRotY.value = cameraRotY
    this.material.uniforms.uResolution.value.set(rendererSize.x * dpr, rendererSize.y * dpr)

    this.mesh.quaternion.copy(camera.quaternion)

    // LOD: 0 = far away (dim), 1 = close up (full intensity)
    const camDist = camera.position.length()
    const fov = (camera as THREE.PerspectiveCamera).fov ?? 60
    const vFov = (fov * Math.PI) / 180
    const screenH = this.material.uniforms.uResolution.value.y
    const apparentPx = (this.quadSize / camDist) * (screenH / (2 * Math.tan(vFov / 2)))
    this.material.uniforms.uLOD.value = Math.min(Math.max((apparentPx - 6) / 220, 0), 1)
  }

  getLOD(): number {
    return this.material.uniforms.uLOD.value
  }

  dispose(): void {
    this.material.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.depthMesh.geometry as THREE.BufferGeometry).dispose()
    ;(this.depthMesh.material as THREE.Material).dispose()
  }
}
