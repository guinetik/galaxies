import * as THREE from 'three'

const STAR_COUNT = 3000
const SPHERE_RADIUS = 800
const POINT_SIZE = 1.2

/**
 * Decorative background stars — tiny white dots on a larger sphere
 * behind the galaxy field, giving the night sky depth.
 */
export class BackgroundStars {
  readonly points: THREE.Points

  constructor() {
    const positions = new Float32Array(STAR_COUNT * 3)
    const sizes = new Float32Array(STAR_COUNT)
    const opacities = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      // Uniform distribution on sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      // Only upper hemisphere (above horizon)
      const adjustedPhi = phi * 0.5 // compress to upper half

      positions[i * 3] = SPHERE_RADIUS * Math.sin(adjustedPhi) * Math.cos(theta)
      positions[i * 3 + 1] = SPHERE_RADIUS * Math.cos(adjustedPhi)
      positions[i * 3 + 2] = SPHERE_RADIUS * Math.sin(adjustedPhi) * Math.sin(theta)

      // Vary sizes slightly
      sizes[i] = POINT_SIZE * (0.3 + Math.random() * 0.7)

      // Vary brightness
      opacities[i] = 0.3 + Math.random() * 0.7
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aOpacity;
        uniform float uTime;
        varying float vOpacity;

        void main() {
          vOpacity = aOpacity;

          // Subtle twinkle
          float twinkle = sin(uTime * 1.5 + position.x * 0.05 + position.z * 0.03) * 0.2 + 0.8;
          vOpacity *= twinkle;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (800.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vOpacity;

        void main() {
          // Soft circular point
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
          gl_FragColor = vec4(0.85, 0.88, 0.95, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
      },
    })

    this.points = new THREE.Points(geometry, material)
    this.points.frustumCulled = false
  }

  update(elapsed: number): void {
    ;(this.points.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed
  }

  dispose(): void {
    this.points.geometry.dispose()
    ;(this.points.material as THREE.ShaderMaterial).dispose()
  }
}
