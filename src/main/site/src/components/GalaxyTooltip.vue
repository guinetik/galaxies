<template>
  <div
    v-if="galaxy"
    class="galaxy-tooltip"
    :class="{ 'has-cta': showCta }"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="tooltip-name">PGC {{ galaxy.pgc }}</div>
    <div class="tooltip-row">
      <span class="tooltip-label">Distance</span> {{ Math.round(galaxy.distance_mly).toLocaleString() }} Mly
    </div>
    <div v-if="galaxy.vcmb != null" class="tooltip-row">
      <span class="tooltip-label">Velocity</span> {{ galaxy.vcmb.toLocaleString() }} km/s
    </div>
    <button
      v-if="showCta"
      type="button"
      class="tooltip-cta"
      @click="$emit('navigate')"
    >
      {{ t('pages.home.goToGalaxy') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Galaxy } from '@/types/galaxy'

defineProps<{
  galaxy: Galaxy | null
  x: number
  y: number
  showCta?: boolean
}>()

defineEmits<{
  navigate: []
}>()

const { t } = useI18n()
</script>

<style scoped>
.galaxy-tooltip {
  position: fixed;
  pointer-events: none;
  transform: translate(12px, -50%);
}

.galaxy-tooltip.has-cta {
  pointer-events: auto;
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

.tooltip-cta {
  margin-top: 10px;
  width: 100%;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #0a0a0a;
  background: rgb(34, 211, 238);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.tooltip-cta:hover {
  background: rgb(56, 220, 245);
}

.tooltip-cta:active {
  transform: scale(0.98);
}
</style>
