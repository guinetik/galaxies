<template>
  <div class="experiment-container experiment-fullwidth">
    <p class="experiment-intro">{{ t('pages.cosmography.experiments.ceph.intro') }}</p>

    <!-- Observation schematic: Earth → light path → Galaxy with Cepheid -->
    <div class="experiment-schematic" ref="schematicRef">
      <svg
        class="schematic-svg"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="earth-grad">
            <stop offset="0%" stop-color="#4a9eff" />
            <stop offset="70%" stop-color="#1e5fb4" />
            <stop offset="100%" stop-color="#0d3a6e" />
          </radialGradient>
          <radialGradient id="ceph-grad">
            <stop offset="0%" stop-color="#fffacd" />
            <stop offset="50%" stop-color="#ffd700" />
            <stop offset="100%" stop-color="#ff8c00" stop-opacity="0.8" />
          </radialGradient>
          <filter id="ceph-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Light path (dashed line) -->
        <line
          :x1="earthX + 50"
          :y1="centerY"
          :x2="galaxyX - 60"
          :y2="centerY"
          stroke="rgba(34, 211, 238, 0.25)"
          stroke-width="2"
          stroke-dasharray="8 6"
          class="light-path"
        />

        <!-- Earth + telescope -->
        <g class="earth-group" :transform="`translate(${earthX}, ${centerY})`">
          <circle r="28" fill="url(#earth-grad)" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
          <circle r="8" fill="rgba(255,255,255,0.9)" cx="12" cy="-8" />
          <path
            d="M 8 -12 L 16 -12 L 14 -18 L 18 -14 L 18 -10"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            stroke-width="1"
          />
          <text y="45" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="12" font-weight="600">
            {{ t('pages.cosmography.experiments.ceph.earth') }}
          </text>
          <text y="58" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10">
            {{ t('pages.cosmography.experiments.ceph.weObserve') }}
          </text>
        </g>

        <!-- Galaxy with Cepheid -->
        <g class="galaxy-group" :transform="`translate(${galaxyX}, ${centerY})`">
          <!-- Galaxy blob -->
          <ellipse rx="55" ry="25" fill="rgba(80, 80, 120, 0.4)" stroke="rgba(150, 150, 200, 0.3)" stroke-width="1" />
          <!-- Cepheid star (pulses in brightness) -->
          <circle
            :r="cephRadius"
            fill="url(#ceph-grad)"
            filter="url(#ceph-glow)"
            :style="{ filter: `url(#ceph-glow) brightness(${cephBrightness})` }"
          />
          <text y="-45" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="12" font-weight="600">
            {{ t('pages.cosmography.experiments.ceph.distantGalaxy') }}
          </text>
          <text y="-32" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10">
            {{ t('pages.cosmography.experiments.ceph.pulsingStar') }}
          </text>
        </g>

        <!-- Distance callout -->
        <g class="distance-callout" :transform="`translate(${svgWidth / 2}, ${centerY + 55})`">
          <rect x="-55" y="-12" width="110" height="28" rx="4" fill="rgba(0,0,0,0.5)" stroke="rgba(34,211,238,0.5)" stroke-width="1" />
          <text y="4" text-anchor="middle" fill="#22d3ee" font-size="13" font-weight="600">
            {{ t('pages.cosmography.experiments.ceph.distance') }}: {{ distanceMpc.toFixed(1) }} Mpc
          </text>
        </g>
      </svg>
    </div>

    <div class="experiment-controls">
      <label class="control-label">
        {{ t('pages.cosmography.experiments.ceph.periodLabel') }}
        <span class="control-value">{{ periodDisplay }}</span>
      </label>
      <input
        v-model.number="period"
        type="range"
        min="1"
        max="60"
        step="0.5"
        class="period-slider"
      />
      <p class="control-hint">{{ t('pages.cosmography.experiments.ceph.periodHint') }}</p>
    </div>

    <div class="experiment-data-display">
      <div class="data-item">
        <span class="data-label">{{ t('pages.cosmography.experiments.ceph.howBright') }}</span>
        <span class="data-value">{{ absoluteMag.toFixed(1) }}</span>
      </div>
      <div class="data-item">
        <span class="data-label">{{ t('pages.cosmography.experiments.ceph.howDim') }}</span>
        <span class="data-value">{{ apparentMag.toFixed(1) }} mag</span>
      </div>
      <div class="data-item">
        <span class="data-label">{{ t('pages.cosmography.experiments.ceph.distance') }}</span>
        <span class="data-value">{{ distanceMpc.toFixed(1) }} Mpc</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * CepheidExperiment
 * Visual observation schematic: Earth → light path → distant galaxy with pulsing Cepheid.
 * Explains how we measure distance by observing a star that brightens and dims.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { distanceModulusToMpc } from '@/lib/astronomy'

const { t } = useI18n()

const schematicRef = ref<HTMLElement | null>(null)
const svgWidth = 640
const svgHeight = 180
const centerY = svgHeight / 2
const earthX = 90
const galaxyX = svgWidth - 120

// Period in days (1–60)
const period = ref(10)

const periodDisplay = computed(() => `${period.value} days`)

/** Leavitt's law: M_V ≈ -3.43 * log10(P) - 2.76 */
const absoluteMag = computed(() => {
  const logP = Math.log10(period.value)
  return -3.43 * logP - 2.76
})

const APPARENT_MAG = 22
const apparentMag = computed(() => APPARENT_MAG)

const distanceMpc = computed(() => {
  const dm = apparentMag.value - absoluteMag.value
  return distanceModulusToMpc(dm)
})

/** Cepheid radius (longer period = brighter = bigger star) */
const cephRadius = computed(() => {
  const M = absoluteMag.value
  const M_dim = -2.5
  const M_bright = -9
  const scale = Math.max(0, Math.min(1, (M - M_dim) / (M_bright - M_dim)))
  return 6 + scale * 14
})

/** Pulse phase 0–2π, drives brightness animation */
const pulsePhase = ref(0)
let animId = 0

/** Brightness 0.5–1.2: star dims and brightens (like a real Cepheid) */
const cephBrightness = computed(() => {
  const minB = 0.5
  const maxB = 1.2
  const t = (Math.sin(pulsePhase.value) + 1) / 2
  return minB + t * (maxB - minB)
})

onMounted(() => {
  const start = performance.now()
  const tick = () => {
    const elapsed = (performance.now() - start) / 1000
    const cycleSeconds = 2 + period.value / 10
    const cycles = elapsed / cycleSeconds
    pulsePhase.value = (cycles % 1) * Math.PI * 2
    animId = requestAnimationFrame(tick)
  }
  animId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
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
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.experiment-schematic {
  width: 100%;
  min-height: 180px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.schematic-svg {
  display: block;
  width: 100%;
  min-height: 180px;
}

.light-path {
  animation: light-pulse 2s ease-in-out infinite;
}

@keyframes light-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
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
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.control-value {
  font-family: ui-monospace, monospace;
  color: #22d3ee;
  margin-left: 0.5rem;
}

.period-slider {
  width: 100%;
  max-width: 400px;
  accent-color: #22d3ee;
}

.control-hint {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 0.5rem;
}

.experiment-data-display {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}

.data-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.data-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.data-value {
  font-family: ui-monospace, monospace;
  font-size: 1rem;
  color: #22d3ee;
}
</style>
