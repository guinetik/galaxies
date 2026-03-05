<template>
  <div
    v-if="galaxy"
    class="tooltip"
    :class="{ 'has-cta': showCta }"
    :style="{ left: x + 12 + 'px', top: y - 10 + 'px' }"
  >
    <div class="tooltip-pgc">PGC {{ galaxy.pgc }}</div>
    <div class="tooltip-detail">{{ Math.round(galaxy.distance_mly).toLocaleString() }} Mly</div>
    <div v-if="galaxy.vcmb != null" class="tooltip-detail">{{ galaxy.vcmb.toLocaleString() }} km/s</div>
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
.tooltip {
  position: fixed;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 8px 12px;
  z-index: 30;
  backdrop-filter: blur(8px);
}

.tooltip.has-cta {
  pointer-events: auto;
}

.tooltip-pgc {
  font-size: 13px;
  font-weight: 600;
  color: #22d3ee;
  margin-bottom: 2px;
}

.tooltip-detail {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  font-family: ui-monospace, monospace;
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
