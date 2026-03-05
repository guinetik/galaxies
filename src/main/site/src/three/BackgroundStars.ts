import * as THREE from 'three'

const STAR_COUNT = 5200
const SPHERE_RADIUS = 800
const POINT_SIZE = 0.9

/**
 * Decorative background stars — tiny white dots on a larger sphere
 * behind the galaxy field, giving the night sky depth at every location.
 */
export class BackgroundStars {
  readonly points: THREE.Points

  constructor() {
    const positions = new Float32Array(STAR_COUNT * 3)
    const sizes = new Float32Array(STAR_COUNT)
    const opacities = new Float32Array(STAR_COUNT)
    const colors = new Float32Array(STAR_COUNT * 3)
    const phases = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      // Uniform distribution on full celestial sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = SPHERE_RADIUS * Math.cos(phi)
      positions[i * 3 + 2] = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta)

      // Vary sizes slightly
      sizes[i] = POINT_SIZE * (0.35 + Math.random() * 0.85)

      // Keep background stars subtle so galaxies remain dominant.
      opacities[i] = 0.06 + Math.random() * 0.16
      phases[i] = Math.random() * Math.PI * 2

      // Subtle full-sky color variation (cool whites + warm whites).
      const t = Math.random()
      if (t < 0.55) {
        colors[i * 3] = 0.72 + Math.random() * 0.10
        colors[i * 3 + 1] = 0.79 + Math.random() * 0.09
        colors[i * 3 + 2] = 0.89 + Math.random() * 0.05
      } else if (t < 0.88) {
        colors[i * 3] = 0.82 + Math.random() * 0.07
        colors[i * 3 + 1] = 0.80 + Math.random() * 0.09
        colors[i * 3 + 2] = 0.72 + Math.random() * 0.10
      } else {
        colors[i * 3] = 0.70 + Math.random() * 0.14
        colors[i * 3 + 1] = 0.78 + Math.random() * 0.10
        colors[i * 3 + 2] = 0.89 + Math.random() * 0.05
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    const material = new THREE.RawShaderMaterial({
      vertexShader: /* glsl */ `
        precision mediump float;
        attribute float aSize;
        attribute float aOpacity;
        attribute vec3 aColor;
        attribute float aPhase;
        attribute vec3 position;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          vOpacity = aOpacity;
          vColor = aColor;

          // Subtle twinkle
          float twinkle = sin(uTime * 1.2 + aPhase) * 0.08 + 0.92;
          vOpacity *= twinkle;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (620.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;

        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          // Soft circular point
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
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
