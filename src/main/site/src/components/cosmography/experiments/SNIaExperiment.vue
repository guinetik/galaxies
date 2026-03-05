<template>
  <div class="experiment-container experiment-fullwidth">
    <p class="experiment-intro">{{ t('pages.cosmography.experiments.snia.intro') }}</p>

    <div class="experiment-visual">
      <!-- Parametrized explosion: stretch s controls size, distance controls apparent brightness -->
      <div class="snia-explosion-wrap">
        <div
          class="snia-explosion-dimness"
          :style="{ filter: `brightness(${apparentBrightness})` }"
        >
          <svg
            class="snia-explosion"
            viewBox="0 0 120 120"
            :style="{ '--explosion-scale': stretchFactor }"
          >
          <defs>
            <radialGradient id="snia-burst-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fff" stop-opacity="0.9" />
              <stop offset="25%" stop-color="#fcd34d" stop-opacity="0.7" />
              <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.4" />
              <stop offset="75%" stop-color="#ea580c" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#7c2d12" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="snia-core" cx="50%" cy="50%" r="30%">
              <stop offset="0%" stop-color="#fff" />
              <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.3" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="55" fill="url(#snia-burst-grad)" class="explosion-burst" />
          <circle cx="60" cy="60" r="12" fill="url(#snia-core)" class="explosion-core" />
          <circle
            v-for="i in 5"
            :key="i"
            cx="60"
            cy="60"
            :r="8 + i * 6"
            fill="none"
            stroke="rgba(251, 191, 36, 0.4)"
            stroke-width="1"
            class="explosion-ring"
            :style="{ animationDelay: `${i * 0.15}s` }"
          />
          </svg>
        </div>
        <span class="explosion-caption">{{ t('pages.cosmography.experiments.snia.explosionCaption') }}</span>
        <span class="explosion-caption dimness-caption">{{ t('pages.cosmography.experiments.snia.dimnessCaption') }}</span>
      </div>
      <h4 class="experiment-chart-title">{{ t('pages.cosmography.experiments.snia.chartTitle') }}</h4>
      <div class="snia-visual" ref="chartRef">
        <svg
          :viewBox="`0 0 ${width} ${height}`"
          preserveAspectRatio="xMidYMid meet"
          class="snia-svg"
        >
          <defs>
            <linearGradient id="snia-curve-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="rgba(245, 158, 11, 0)" />
              <stop offset="100%" stop-color="rgba(245, 158, 11, 0.2)" />
            </linearGradient>
          </defs>
          <!-- Grid -->
          <g class="snia-grid">
            <line
              v-for="i in 5"
              :key="'v' + i"
              :x1="margin.left + (i / 5) * innerWidth"
              :y1="margin.top"
              :x2="margin.left + (i / 5) * innerWidth"
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
          <!-- Reference curve (s=1, standardized) -->
          <path
            :d="referenceCurvePath"
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            stroke-width="1"
            stroke-dasharray="4,4"
          />
          <!-- Observed curve (stretch from slider) -->
          <path
            :d="observedCurvePath"
            fill="url(#snia-curve-grad)"
            stroke="#f59e0b"
            stroke-width="2"
          />
          <!-- Phase marker -->
          <line
            :x1="markerX"
            :y1="margin.top"
            :x2="markerX"
            :y2="margin.top + innerHeight"
            stroke="#22d3ee"
            stroke-width="1"
            stroke-dasharray="4,4"
          />
          <circle
            :cx="markerX"
            :cy="markerY"
            r="4"
            fill="#22d3ee"
            stroke="rgba(255,255,255,0.8)"
            stroke-width="1"
          />
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
            font-size="10"
            :transform="`rotate(-90, ${margin.left - 8}, ${margin.top + innerHeight / 2})`"
          >
            {{ t('pages.cosmography.experiments.snia.magLabel') }}
          </text>
          <text
            :x="margin.left + innerWidth / 2"
            :y="height - 8"
            text-anchor="middle"
            fill="rgba(255,255,255,0.7)"
            font-size="10"
          >
            {{ t('pages.cosmography.experiments.snia.daysLabel') }}
          </text>
          <!-- Legend -->
          <text
            :x="margin.left + innerWidth - 4"
            :y="margin.top + 14"
            text-anchor="end"
            fill="#f59e0b"
            font-size="10"
          >
            {{ t('pages.cosmography.experiments.snia.observed') }}
          </text>
          <line
            :x1="margin.left + innerWidth - 75"
            :y1="margin.top + 14"
            :x2="margin.left + innerWidth - 4"
            :y2="margin.top + 14"
            stroke="#f59e0b"
            stroke-width="2"
          />
          <text
            :x="margin.left + innerWidth - 4"
            :y="margin.top + 28"
            text-anchor="end"
            fill="rgba(255,255,255,0.35)"
            font-size="10"
          >
            {{ t('pages.cosmography.experiments.snia.reference') }}
          </text>
          <line
            :x1="margin.left + innerWidth - 75"
            :y1="margin.top + 28"
            :x2="margin.left + innerWidth - 4"
            :y2="margin.top + 28"
            stroke="rgba(255,255,255,0.35)"
            stroke-width="1"
            stroke-dasharray="4,4"
          />
        </svg>
      </div>
    </div>

    <div class="experiment-controls">
      <label class="control-label">
        {{ t('pages.cosmography.experiments.snia.stretchLabel') }}
        <span class="control-value">{{ stretchFactor.toFixed(2) }}</span>
      </label>
      <input
        v-model.number="stretchRaw"
        type="range"
        min="80"
        max="120"
        step="2"
        class="stretch-slider"
      />
      <label class="control-label">
        {{ t('pages.cosmography.experiments.snia.apparentMagLabel') }}
        <span class="control-value">{{ apparentMag.toFixed(1) }} mag</span>
      </label>
      <input
        v-model.number="apparentMag"
        type="range"
        min="18"
        max="26"
        step="0.5"
        class="apparent-slider"
      />
    </div>

    <div class="experiment-data-display">
      <div class="data-item">
        <span class="data-label">{{ t('pages.cosmography.experiments.snia.peakMagnitude') }}</span>
        <span class="data-value">{{ peakMag.toFixed(2) }} mag</span>
      </div>
      <div class="data-item">
        <span class="data-label">{{ t('pages.cosmography.experiments.snia.distanceMpc') }}</span>
        <span class="data-value">{{ distanceMpc.toFixed(0) }} Mpc</span>
      </div>
    </div>

    <p class="experiment-note">{{ t('pages.cosmography.experiments.snia.note') }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * SNIaExperiment
 * Interactive Type Ia supernova light curve inspired by supernovaIa.webp.
 * Stretch slider: slower decline (s>1) = brighter peak. Phillips relation standardizes the candle.
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const chartRef = ref<HTMLElement | null>(null)

const width = 420
const height = 240
const margin = { left: 55, right: 95, top: 45, bottom: 45 }
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom

const dayMin = -15
const dayMax = 60
const magMin = -19.5
const magMax = -15.5

// Stretch factor: 0.8–1.2 (slider 80–120)
const stretchRaw = ref(100)

/** Apparent magnitude: how dim it looks (18 = bright, 26 = faint) */
const apparentMag = ref(22)

/** Stretch s: slower decline = s > 1 */
const stretchFactor = computed(() => stretchRaw.value / 100)

/** Peak magnitude after stretch correction (Phillips: slower decline → brighter) */
const peakMag = computed(() => -19.3 - 1.2 * (stretchFactor.value - 1))

/** Distance from apparent + absolute magnitude */
const distanceMpc = computed(() => {
  const M = peakMag.value
  const m = apparentMag.value
  const dm = m - M
  return Math.pow(10, dm / 5 - 5)
})

/** Explosion brightness: m=18 bright, m=26 dim. Only the explosion, not the graph. */
const apparentBrightness = computed(() => {
  const m = apparentMag.value
  return Math.max(0.25, 1 - (m - 18) / 10)
})

function x(day: number) {
  return margin.left + ((day - dayMin) / (dayMax - dayMin)) * innerWidth
}

function y(mag: number) {
  return margin.top + ((mag - magMin) / (magMax - magMin)) * innerHeight
}

/** Light curve magnitude: rise to peak, then decline. Stretch s widens the decline. */
function magAtDay(day: number, s: number): number {
  const riseTime = 18
  if (day < 0) {
    const t = -day / riseTime
    return magMin + (magMax - magMin) * (1 - Math.exp(-t))
  }
  const declineRate = 0.08 / s
  return magMin + declineRate * day
}

const referenceCurvePath = computed(() => {
  const pts: string[] = []
  for (let i = 0; i <= 80; i++) {
    const d = dayMin + (i / 80) * (dayMax - dayMin)
    const m = magAtDay(d, 1)
    const mx = Math.min(magMax, Math.max(magMin, m))
    pts.push(`${i === 0 ? 'M' : 'L'} ${x(d)} ${y(mx)}`)
  }
  return pts.join(' ')
})

const observedCurvePath = computed(() => {
  const pts: string[] = []
  for (let i = 0; i <= 80; i++) {
    const d = dayMin + (i / 80) * (dayMax - dayMin)
    const m = magAtDay(d, stretchFactor.value)
    const mx = Math.min(magMax, Math.max(magMin, m))
    pts.push(`${i === 0 ? 'M' : 'L'} ${x(d)} ${y(mx)}`)
  }
  pts.push(`L ${x(dayMax)} ${y(magMax)} L ${x(dayMin)} ${y(magMax)} Z`)
  return pts.join(' ')
})

/** Observation phase: 20 days from peak (fixed) */
const phaseDay = 20

const markerX = computed(() => x(phaseDay))
const markerY = computed(() => {
  const m = magAtDay(phaseDay, stretchFactor.value)
  return y(Math.min(magMax, Math.max(magMin, m)))
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

.snia-explosion-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.explosion-caption {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.snia-explosion {
  width: 100px;
  height: 100px;
  transform: scale(var(--explosion-scale, 1));
  transition: transform 0.3s ease;
}

.explosion-burst {
  animation: explosion-pulse 2.5s ease-in-out infinite;
}

.explosion-core {
  animation: explosion-core-pulse 2.5s ease-in-out infinite;
}

.explosion-ring {
  animation: explosion-ring-expand 2s ease-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes explosion-pulse {
  0%, 100% { opacity: 0.85; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes explosion-core-pulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}

@keyframes explosion-ring-expand {
  0% { opacity: 0.6; transform: scale(0.3); }
  70% { opacity: 0; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1.2); }
}

.snia-visual {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 0.75rem;
}

.snia-svg {
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

.stretch-slider,
.apparent-slider {
  width: 100%;
  max-width: 400px;
  accent-color: #f59e0b;
}

.apparent-slider {
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
