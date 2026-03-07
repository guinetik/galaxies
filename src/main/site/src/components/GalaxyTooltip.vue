<template>
  <div
    v-if="galaxy"
    class="tooltip"
    :class="{ 'has-cta': showCta }"
    :style="{ left: x + 12 + 'px', top: y - 10 + 'px' }"
  >
    <div class="tooltip-pgc">{{ galaxy.name ?? 'PGC ' + galaxy.pgc }}</div>
    <div class="tooltip-row">
      <span class="tooltip-label">Distance</span>
      <span class="tooltip-value">{{ Math.round(galaxy.distance_mly).toLocaleString() }} Mly</span>
    </div>
    <div v-if="galaxy.vcmb != null" class="tooltip-row">
      <span class="tooltip-label">Recession</span>
      <span class="tooltip-value">{{ galaxy.vcmb.toLocaleString() }} km/s</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Constellation</span>
      <span class="tooltip-value">{{ constellation }}</span>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Galaxy } from '@/types/galaxy'
import { getConstellation } from '@/three/constellationLookup'

const props = defineProps<{
  galaxy: Galaxy | null
  x: number
  y: number
  showCta?: boolean
}>()

defineEmits<{
  navigate: []
}>()

const { t } = useI18n()

const constellation = computed(() =>
  props.galaxy ? getConstellation(props.galaxy.ra, props.galaxy.dec) : ''
)
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
  min-width: 180px;
}

.tooltip.has-cta {
  pointer-events: auto;
}

.tooltip-pgc {
  font-size: 13px;
  font-weight: 600;
  color: #22d3ee;
  margin-bottom: 4px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 11px;
  font-family: ui-monospace, monospace;
  line-height: 1.6;
}

.tooltip-label {
  color: rgba(255, 255, 255, 0.4);
}

.tooltip-value {
  color: rgba(255, 255, 255, 0.75);
  text-align: right;
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
