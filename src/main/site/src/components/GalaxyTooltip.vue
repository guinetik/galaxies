<template>
  <div
    v-if="galaxy"
    class="galaxy-tooltip"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="tooltip-name">{{ galaxy.name }}</div>
    <div class="tooltip-row"><span class="tooltip-label">Catalog</span> {{ galaxy.catalog }}</div>
    <div v-if="galaxy.morphology" class="tooltip-row">
      <span class="tooltip-label">Type</span> {{ galaxy.morphology }}
    </div>
    <div v-if="galaxy.redshift != null" class="tooltip-row">
      <span class="tooltip-label">Redshift</span> {{ galaxy.redshift.toFixed(6) }}
    </div>
    <div v-if="galaxy.velocity != null" class="tooltip-row">
      <span class="tooltip-label">Velocity</span> {{ galaxy.velocity.toLocaleString() }} km/s
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Galaxy } from '@/types/galaxy'

defineProps<{
  galaxy: Galaxy | null
  x: number
  y: number
}>()
</script>

<style scoped>
.galaxy-tooltip {
  position: fixed;
  pointer-events: none;
  transform: translate(12px, -50%);
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  color: #e0e0e0;
  white-space: nowrap;
  z-index: 100;
  backdrop-filter: blur(8px);
}

.tooltip-name {
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
  margin-bottom: 4px;
}

.tooltip-row {
  line-height: 1.5;
}

.tooltip-label {
  color: rgba(255, 255, 255, 0.5);
  margin-right: 6px;
}
</style>
