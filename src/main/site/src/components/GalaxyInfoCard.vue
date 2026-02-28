<template>
  <div class="galaxy-info-card">
    <div class="info-name">PGC {{ galaxy.pgc }}</div>
    <div class="info-row">
      <span class="info-label">Distance</span> {{ galaxy.distance_mpc.toFixed(1) }} Mpc ({{ Math.round(galaxy.distance_mly).toLocaleString() }} Mly)
    </div>
    <div v-if="galaxy.vcmb != null" class="info-row">
      <span class="info-label">CMB Velocity</span> {{ galaxy.vcmb.toLocaleString() }} km/s
    </div>
    <div class="info-row">
      <span class="info-label">DM</span> {{ galaxy.dm.toFixed(2) }}<span v-if="galaxy.e_dm != null"> &plusmn; {{ galaxy.e_dm.toFixed(2) }}</span>
    </div>
    <div v-if="methods.length > 0" class="info-row">
      <span class="info-label">Methods</span> {{ methods.join(', ') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Galaxy } from '@/types/galaxy'

const props = defineProps<{
  galaxy: Galaxy
}>()

const methods = computed(() => {
  const g = props.galaxy
  const list: string[] = []
  if (g.dm_snia != null) list.push('SNIa')
  if (g.dm_tf != null) list.push('TF')
  if (g.dm_fp != null) list.push('FP')
  if (g.dm_sbf != null) list.push('SBF')
  if (g.dm_snii != null) list.push('SNII')
  if (g.dm_trgb != null) list.push('TRGB')
  if (g.dm_ceph != null) list.push('Ceph')
  if (g.dm_mas != null) list.push('Mas')
  return list
})
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
