<template>
  <div class="experiment-container experiment-fullwidth">
    <p class="experiment-intro">{{ t('pages.cosmography.experiments.tf.intro') }}</p>

    <div class="experiment-visual">
      <h4 class="experiment-chart-title">{{ t('pages.cosmography.experiments.tf.chartTitle') }}</h4>
      <div class="tf-rotation-curve" ref="chartRef">
        <svg
          :viewBox="`0 0 ${width} ${height}`"
          preserveAspectRatio="xMidYMid meet"
          class="tf-svg"
        >
          <defs>
            <linearGradient id="tf-observed-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="rgba(34, 211, 238, 0)" />
              <stop offset="100%" stop-color="rgba(34, 211, 238, 0.15)" />
            </linearGradient>
          </defs>
          <!-- Grid -->
          <g class="tf-grid">
            <line
              v-for="i in 4"
              :key="'v' + i"
              :x1="margin.left + (i / 4) * innerWidth"
              :y1="margin.top"
              :x2="margin.left + (i / 4) * innerWidth"
              :y2="margin.top + innerHeight"
              stroke="rgba(255,255,255,0.06)"
              stroke-width="0.5"
            />
            <line
              v-for="i in 4"
              :key="'h' + i"
              :x1="margin.left"
              :y1="margin.top + (i / 4) * innerHeight"
              :x2="margin.left + innerWidth"
              :y2="margin.top + (i / 4) * innerHeight"
              stroke="rgba(255,255,255,0.06)"
              stroke-width="0.5"
            />
          </g>
          <!-- Expected curve (dashed) - luminous matter only -->
          <path
            :d="expectedPath"
            fill="none"
            stroke="rgba(34, 211, 238, 0.7)"
            stroke-width="1.5"
            stroke-dasharray="6,4"
          />
          <!-- Observed curve (solid) - includes dark matter -->
          <path
            :d="observedPath"
            fill="url(#tf-observed-grad)"
            stroke="rgba(34, 211, 238, 0.95)"
            stroke-width="2"
          />
          <!-- Data points on observed curve -->
          <g v-for="(pt, i) in observedPoints" :key="i">
            <rect
              :x="pt.x - 2"
              :y="pt.y - 2"
              width="4"
              height="4"
              fill="#fbbf24"
              stroke="rgba(0,0,0,0.3)"
              stroke-width="0.5"
            />
          </g>
          <!-- Axes -->
          <line
            :x1="margin.left"
            :y1="margin.top"
            :x2="margin.left"
            :y2="margin.top + innerHeight"
            stroke="#c084fc"
            stroke-width="1"
          />
          <line
            :x1="margin.left"
            :y1="margin.top + innerHeight"
            :x2="margin.left + innerWidth"
            :y2="margin.top + innerHeight"
            stroke="#c084fc"
            stroke-width="1"
          />
          <!-- Axis labels -->
          <text
            :x="margin.left - 8"
            :y="margin.top + innerHeight / 2"
            text-anchor="middle"
            fill="rgba(255,255,255,0.7)"
            font-size="11"
            :transform="`rotate(-90, ${margin.left - 8}, ${margin.top + innerHeight / 2})`"
          >
            v (km/s)
          </text>
          <text
            :x="margin.left + innerWidth / 2"
            :y="height - 8"
            text-anchor="middle"
            fill="rgba(255,255,255,0.7)"
            font-size="11"
          >
            R (kpc)
          </text>
          <!-- Legend -->
          <text
            :x="margin.left + innerWidth - 4"
            :y="margin.top + 14"
            text-anchor="end"
            fill="rgba(34, 211, 238, 0.95)"
            font-size="10"
          >
            {{ t('pages.cosmography.experiments.tf.observed') }}
          </text>
          <line
            :x1="margin.left + innerWidth - 70"
            :y1="margin.top + 14"
            :x2="margin.left + innerWidth - 4"
            :y2="margin.top + 14"
            stroke="rgba(34, 211, 238, 0.95)"
            stroke-width="2"
          />
          <text
            :x="margin.left + innerWidth - 4"
            :y="margin.top + 28"
            text-anchor="end"
            fill="rgba(34, 211, 238, 0.7)"
            font-size="10"
          >
            {{ t('pages.cosmography.experiments.tf.expectedLuminous') }}
          </text>
          <line
            :x1="margin.left + innerWidth - 70"
            :y1="margin.top + 28"
            :x2="margin.left + innerWidth - 4"
            :y2="margin.top + 28"
            stroke="rgba(34, 211, 238, 0.7)"
            stroke-width="1.5"
            stroke-dasharray="6,4"
          />
        </svg>
      </div>
    </div>

    <div class="experiment-controls">
      <label class="control-label">
        {{ t('pages.cosmography.experiments.tf.rotationLabel') }}
        <span class="control-value">{{ rotationWidth.toFixed(0) }} km/s</span>
      </label>
      <input
        v-model.number="rotationWidth"
        type="range"
        min="80"
        max="400"
        step="10"
        class="rotation-slider"
      />
    </div>

    <div class="experiment-data-display">
      <div class="data-item">
        <span class="data-label">{{ t('pages.cosmography.experiments.tf.predictedLum') }}</span>
        <span class="data-value">{{ logLum.toFixed(2) }} log L☉</span>
      </div>
      <div class="data-item">
        <span class="data-label">{{ t('pages.cosmography.experiments.tf.distance') }}</span>
        <span class="data-value">{{ distanceMpc.toFixed(1) }} Mpc</span>
      </div>
    </div>

    <p class="experiment-note">{{ t('pages.cosmography.experiments.tf.note') }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * TullyFisherExperiment
 * Rotation curve visualization inspired by M33: v (km/s) vs R (kpc).
 * Shows observed (flat) vs expected from luminous disk (peaks then falls).
 * Slider controls flat rotation velocity → Tully-Fisher luminosity → distance.
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const chartRef = ref<HTMLElement | null>(null)

const width = 420
const height = 260
const margin = { left: 55, right: 90, top: 45, bottom: 45 }
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom

const rMax = 12
/** Fixed y-axis max so the curve visibly grows as slider increases */
const vMax = 450

// Flat rotation velocity (km/s) — Tully-Fisher observable
const rotationWidth = ref(200)

/** Tully-Fisher: log L ∝ 3.5 * log W (approx) */
const logLum = computed(() => {
  const logW = Math.log10(rotationWidth.value)
  return 2.5 * logW - 1.5
})

/** Simulated distance from apparent vs absolute magnitude (distance modulus) */
const distanceMpc = computed(() => {
  const absLogL = logLum.value
  const M = -2.5 * absLogL + 4.74
  const m = 22
  const dm = m - M
  return Math.pow(10, dm / 5 - 5)
})

function x(r: number) {
  return margin.left + (r / rMax) * innerWidth
}

function y(v: number) {
  return margin.top + innerHeight - (v / vMax) * innerHeight
}

/** Observed rotation curve: rises then flattens (includes dark matter halo) */
function vObserved(r: number): number {
  const vFlat = rotationWidth.value
  const rScale = 2.5
  return vFlat * (1 - Math.exp(-r / rScale))
}

/** Expected from luminous disk only: rises, peaks, then Keplerian falloff */
function vExpected(r: number): number {
  const vFlat = rotationWidth.value
  const rPeak = 3
  const peakFrac = 0.6
  if (r <= rPeak) {
    return vFlat * peakFrac * (r / rPeak) * Math.exp(1 - r / rPeak)
  }
  return vFlat * peakFrac * Math.sqrt(rPeak / r)
}

const observedPath = computed(() => {
  const pts: string[] = []
  const n = 60
  for (let i = 0; i <= n; i++) {
    const r = (i / n) * rMax
    const v = vObserved(r)
    pts.push(`${i === 0 ? 'M' : 'L'} ${x(r)} ${y(v)}`)
  }
  pts.push(`L ${x(rMax)} ${y(0)} L ${x(0)} ${y(0)} Z`)
  return pts.join(' ')
})

const expectedPath = computed(() => {
  const pts: string[] = []
  const n = 60
  for (let i = 0; i <= n; i++) {
    const r = (i / n) * rMax
    const v = vExpected(r)
    pts.push(`${i === 0 ? 'M' : 'L'} ${x(r)} ${y(v)}`)
  }
  return pts.join(' ')
})

/** Data points on observed curve (like M33 diagram) */
const observedPoints = computed(() => {
  const rValues = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5]
  return rValues.map((r) => ({
    x: x(r),
    y: y(vObserved(r)),
  }))
})
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

.tf-rotation-curve {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 0.75rem;
}

.tf-svg {
  display: block;
  width: 100%;
  max-width: 420px;
  height: auto;
  margin: 0 auto;
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

.rotation-slider {
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
