<template>
  <div class="experiment-container experiment-fullwidth">
    <p class="experiment-intro">{{ t('pages.cosmography.experiments.sbf.intro') }}</p>

    <div class="experiment-visual">
      <h4 class="experiment-chart-title">{{ t('pages.cosmography.experiments.sbf.chartTitle') }}</h4>
      <div class="sbf-preview">
        <div class="sbf-canvas-wrap">
          <canvas
            ref="canvasRef"
            class="sbf-canvas"
            :width="canvasSize"
            :height="canvasSize"
            aria-label="Surface brightness fluctuation — procedurally generated galaxy view"
          />
        </div>
        <span class="sbf-label">{{ interpretation }}</span>
      </div>
    </div>

    <div class="experiment-controls">
      <label class="control-label">
        {{ t('pages.cosmography.experiments.sbf.distanceLabel') }}
        <span class="control-value">{{ distanceMpc.toFixed(1) }} Mpc</span>
      </label>
      <input
        v-model.number="distanceMpc"
        type="range"
        min="5"
        max="120"
        step="1"
        class="distance-slider"
      />
    </div>

    <div class="experiment-data-display">
      <div class="data-item">
        <span class="data-label">{{ t('pages.cosmography.experiments.sbf.grainLevel') }}</span>
        <span class="data-value">{{ (grainLevel * 100).toFixed(0) }}%</span>
      </div>
      <div class="data-item">
        <span class="data-label">{{ t('pages.cosmography.experiments.sbf.interpretation') }}</span>
        <span class="data-value">{{ interpretation }}</span>
      </div>
    </div>

    <p class="experiment-note">{{ t('pages.cosmography.experiments.sbf.note') }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * SBFExperiment
 * Interactive surface brightness fluctuation visualization.
 * Procedurally generates galaxy/star field with SBF-like grain.
 * Slider adjusts distance; graininess increases with distance (unresolved stars).
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { seededRandom } from '@/lib/math'

const { t } = useI18n()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasSize = 320

const distanceMpc = ref(30)

/** Grain level: 1 at 120 Mpc (far, grainy), ~0.05 at 5 Mpc (nearby, resolved) */
const grainLevel = computed(() => {
  const logD = Math.log10(distanceMpc.value)
  const logMin = Math.log10(5)
  const logMax = Math.log10(120)
  const frac = (logD - logMin) / (logMax - logMin)
  return Math.max(0.05, Math.min(1, frac))
})

const interpretation = computed(() => {
  if (grainLevel.value > 0.6) return t('pages.cosmography.experiments.sbf.interpretFar')
  if (grainLevel.value > 0.3) return t('pages.cosmography.experiments.sbf.interpretMid')
  return t('pages.cosmography.experiments.sbf.interpretNearby')
})

/** Draw procedural SBF visualization: star field, central object, grain overlay */
function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvasSize
  const h = canvasSize
  const grain = grainLevel.value

  ctx.fillStyle = '#0a0a12'
  ctx.fillRect(0, 0, w, h)

  // Star field — fewer resolved stars when grainy (distant)
  const starCount = Math.floor(80 + (1 - grain) * 120)
  for (let i = 0; i < starCount; i++) {
    const x = seededRandom(i * 7) * w
    const y = seededRandom(i * 11) * h
    const r = 0.3 + seededRandom(i * 13) * 1.2
    const b = 0.3 + seededRandom(i * 17) * 0.7
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${b})`
    ctx.fill()
  }

  // Central object — bright core + halo (visible when nearby)
  const cx = w * 0.4
  const cy = h * 0.5
  const coreRadius = 8 + (1 - grain) * 12
  const haloRadius = 40 + (1 - grain) * 60

  const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloRadius)
  haloGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * (1 - grain * 0.7)})`)
  haloGrad.addColorStop(coreRadius / haloRadius, `rgba(255, 240, 220, ${0.4 * (1 - grain * 0.8)})`)
  haloGrad.addColorStop(1, 'rgba(80, 70, 90, 0)')
  ctx.fillStyle = haloGrad
  ctx.fillRect(cx - haloRadius, cy - haloRadius, haloRadius * 2, haloRadius * 2)

  // Elongated galaxy blob (when nearby, resolved)
  if (grain < 0.6) {
    ctx.save()
    ctx.translate(w * 0.7, h * 0.45)
    ctx.rotate(-0.4)
    const gw = 25 + (1 - grain) * 20
    const gh = 8 + (1 - grain) * 12
    const blobGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(gw, gh))
    blobGrad.addColorStop(0, `rgba(255, 255, 255, ${0.6 * (1 - grain)})`)
    blobGrad.addColorStop(0.5, `rgba(200, 190, 220, ${0.2 * (1 - grain)})`)
    blobGrad.addColorStop(1, 'rgba(60, 50, 70, 0)')
    ctx.fillStyle = blobGrad
    ctx.beginPath()
    ctx.ellipse(0, 0, gw, gh, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // SBF grain — pixel-scale brightness fluctuations (dominant when distant)
  const grainDensity = 8000 + grain * 12000
  const grainOpacity = 0.15 + grain * 0.25
  for (let i = 0; i < grainDensity; i++) {
    const gx = Math.floor(seededRandom(i * 19) * w)
    const gy = Math.floor(seededRandom(i * 23) * h)
    const lum = 0.5 + seededRandom(i * 29) * 0.5
    ctx.fillStyle = `rgba(255, 255, 255, ${lum * grainOpacity})`
    ctx.fillRect(gx, gy, 1, 1)
  }
}

onMounted(draw)
watch([grainLevel], draw)
</script>

<style scoped>
.experiment-container {
  padding: 1rem 0;
}

.experiment-fullwidth {
  width: 100%;
}

.experiment-intro {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.experiment-visual {
  margin-bottom: 1rem;
}

.experiment-chart-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  text-align: center;
}

.sbf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.sbf-canvas-wrap {
  width: 100%;
  max-width: 320px;
  border-radius: 8px;
  overflow: hidden;
  background: #0a0a12;
}

.sbf-canvas {
  display: block;
  width: 100%;
  height: auto;
}

.sbf-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.experiment-controls {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.control-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
}

.control-value {
  font-family: ui-monospace, monospace;
  color: #22d3ee;
  margin-left: 0.5rem;
}

.distance-slider {
  width: 100%;
  max-width: 400px;
  accent-color: #22d3ee;
}

.experiment-data-display {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.data-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.data-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.data-value {
  font-family: ui-monospace, monospace;
  font-size: 0.9rem;
  color: #22d3ee;
}

.experiment-note {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  font-style: italic;
}
</style>
