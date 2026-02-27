<template>
  <div class="galaxy-info-card">
    <div class="info-name">{{ galaxy.name }}</div>
    <div class="info-row">
      <span class="info-label">Catalog</span> {{ galaxy.catalog }}
    </div>
    <div v-if="galaxy.morphology" class="info-row">
      <span class="info-label">Type</span> {{ galaxy.morphology }}
    </div>
    <div v-if="galaxy.redshift != null" class="info-row">
      <span class="info-label">Redshift</span> {{ galaxy.redshift.toFixed(6) }}
    </div>
    <div v-if="galaxy.velocity != null" class="info-row">
      <span class="info-label">Velocity</span> {{ galaxy.velocity.toLocaleString() }} km/s
    </div>
    <div v-if="galaxy.b_mag != null" class="info-row">
      <span class="info-label">B mag</span> {{ galaxy.b_mag.toFixed(2) }}
    </div>
    <div v-if="galaxy.r_mag != null" class="info-row">
      <span class="info-label">R mag</span> {{ galaxy.r_mag.toFixed(2) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Galaxy } from '@/types/galaxy'

defineProps<{
  galaxy: Galaxy
}>()
</script>

<style scoped>
.galaxy-info-card {
  position: fixed;
  top: 24px;
  left: 24px;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 12px;
  color: #e0e0e0;
  z-index: 10;
  backdrop-filter: blur(12px);
  min-width: 180px;
}

.info-name {
  font-weight: 600;
  font-size: 15px;
  color: #ffffff;
  margin-bottom: 6px;
}

.info-row {
  line-height: 1.6;
}

.info-label {
  color: rgba(255, 255, 255, 0.45);
  margin-right: 6px;
}
</style>
