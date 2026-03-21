<template>
  <section class="local-group-context-card">
    <div class="local-group-context-header">
      <p class="local-group-context-kicker">{{ kicker }}</p>
      <button
        v-if="landmark"
        class="local-group-context-close"
        type="button"
        @click="emit('clear')"
      >
        ×
      </button>
    </div>

    <template v-if="landmark">
      <h2 class="local-group-context-title">{{ landmark.label }}</h2>
      <p class="local-group-context-body">{{ landmark.description }}</p>
    </template>

    <template v-else-if="pointHit">
      <h2 class="local-group-context-title">PGC {{ pointHit.pgc }}</h2>
      <div class="local-group-context-metrics">
        <div class="local-group-context-metric">
          <span>{{ velocityLabel }}</span>
          <strong>{{ pointHit.velocity.toLocaleString() }} km/s</strong>
        </div>
        <div class="local-group-context-metric">
          <span>{{ distanceLabel }}</span>
          <strong>{{ pointHit.distance.toFixed(1) }} Mpc</strong>
        </div>
      </div>
    </template>

    <template v-else>
      <h2 class="local-group-context-title">{{ idleTitle }}</h2>
      <p class="local-group-context-body">{{ idleBody }}</p>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { LocalGroupLandmark, LocalGroupPointHit } from '@/three/local-group/localGroupTypes'

defineProps<{
  landmark: LocalGroupLandmark | null
  pointHit: LocalGroupPointHit | null
  kicker: string
  velocityLabel: string
  distanceLabel: string
  idleTitle: string
  idleBody: string
}>()

const emit = defineEmits<{
  clear: []
}>()
</script>

<style scoped>
.local-group-context-card {
  width: min(340px, calc(100vw - 40px));
  padding: 16px;
  border: 1px solid rgba(110, 195, 236, 0.16);
  background:
    linear-gradient(180deg, rgba(5, 13, 21, 0.88), rgba(2, 8, 14, 0.78)),
    radial-gradient(circle at top right, rgba(94, 205, 255, 0.14), transparent 48%);
  backdrop-filter: blur(16px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.3);
}

.local-group-context-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.local-group-context-kicker {
  margin: 0 0 6px;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(165, 220, 242, 0.54);
}

.local-group-context-close {
  border: 1px solid rgba(107, 187, 224, 0.24);
  background: rgba(8, 20, 30, 0.72);
  color: rgba(220, 243, 252, 0.85);
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.local-group-context-title {
  margin: 0 0 8px;
  font-family: "Orbitron", "Trebuchet MS", sans-serif;
  font-size: 1.05rem;
  letter-spacing: 0.08em;
  color: rgba(238, 250, 255, 0.94);
}

.local-group-context-body {
  margin: 0;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(214, 241, 252, 0.78);
}

.local-group-context-metrics {
  display: grid;
  gap: 8px;
}

.local-group-context-metric {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  font-size: 12px;
  color: rgba(180, 220, 238, 0.7);
}

.local-group-context-metric strong {
  color: rgba(241, 251, 255, 0.92);
  font-weight: 600;
}
</style>
