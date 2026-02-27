import * as THREE from 'three'
import vertexShader from './shaders/nebula.vert.glsl?raw'
import fragmentShader from './shaders/nebula.frag.glsl?raw'

export class GalaxyNebula {
  readonly mesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private densityTexture: THREE.DataTexture

  constructor(stars: Array<{ radius: number; angle: number }>, galaxyRadius: number, seed: number) {
    // 1. Build density map from star positions (64x64 grid)
    const size = 64
    const grid = new Float32Array(size * size)
    const extent = galaxyRadius * 1.3 // match shader's UV mapping

    // Rasterize star positions into grid
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i]
      const wx = Math.cos(star.angle) * star.radius
      const wz = Math.sin(star.angle) * star.radius

      // Map to grid cell: [-extent, +extent] -> [0, size-1]
      const gx = Math.floor((wx / extent * 0.5 + 0.5) * (size - 1))
      const gz = Math.floor((wz / extent * 0.5 + 0.5) * (size - 1))

      if (gx >= 0 && gx < size && gz >= 0 && gz < size) {
        grid[gz * size + gx] += 1.0
      }
    }

    // Box blur (3 passes with 5x5 kernel for smooth falloff)
    const tmp = new Float32Array(size * size)
    for (let pass = 0; pass < 3; pass++) {
      const src = pass % 2 === 0 ? grid : tmp
      const dst = pass % 2 === 0 ? tmp : grid

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          let sum = 0
          let count = 0
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const nx = x + dx
              const ny = y + dy
              if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                sum += src[ny * size + nx]
                count++
              }
            }
          }
          dst[y * size + x] = sum / count
        }
      }
    }
    // After 3 passes (even count starting from grid), result is in tmp
    grid.set(tmp)

    // Find max for normalization
    let max = 0
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] > max) max = grid[i]
    }

    // Normalize to 0-255
    const pixels = new Uint8Array(size * size)
    if (max > 0) {
      for (let i = 0; i < grid.length; i++) {
        pixels[i] = Math.min(255, Math.floor((grid[i] / max) * 255))
      }
    }

    // Create THREE.DataTexture (luminance format, LinearFilter, ClampToEdge)
    this.densityTexture = new THREE.DataTexture(
      pixels,
      size,
      size,
      THREE.RedFormat,
      THREE.UnsignedByteType,
    )
    this.densityTexture.minFilter = THREE.LinearFilter
    this.densityTexture.magFilter = THREE.LinearFilter
    this.densityTexture.wrapS = THREE.ClampToEdgeWrapping
    this.densityTexture.wrapT = THREE.ClampToEdgeWrapping
    this.densityTexture.needsUpdate = true

    // 2. Create fullscreen quad with custom ShaderMaterial
    const geometry = new THREE.PlaneGeometry(2, 2)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uInvViewProj: { value: new THREE.Matrix4() },
        uTime: { value: 0 },
        uGalaxyRadius: { value: galaxyRadius },
        uSeed: { value: seed },
        uNebulaIntensity: { value: 0.4 },
        uGalaxyRotation: { value: 0 },
        uAxisRatio: { value: 1.0 },
        uDensityMap: { value: this.densityTexture },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })

    // 3. Create mesh; renderOrder ensures it renders before particles
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -1
  }

  update(
    time: number,
    camera: THREE.PerspectiveCamera,
    galaxyRotation: number,
    galaxyRadius: number,
    axisRatio: number,
  ): void {
    const u = this.material.uniforms
    u.uTime.value = time
    u.uGalaxyRotation.value = galaxyRotation
    u.uGalaxyRadius.value = galaxyRadius
    u.uAxisRatio.value = axisRatio

    // Compute inverse view-projection matrix for ray-plane intersection in shader
    const vpMatrix = new THREE.Matrix4()
    vpMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    u.uInvViewProj.value.copy(vpMatrix).invert()
  }

  dispose(): void {
    this.densityTexture.dispose()
    this.material.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
  }
}
