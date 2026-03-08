<template>
  <div class="galaxy-info-card">
    <div class="info-row">
      <span class="info-label">{{ t('pages.galaxy.fields.morphology.label') }}</span> {{ t('morphology.' + morphology) }}<span v-if="galaxy.morphology" class="catalog-type">({{ galaxy.morphology }})</span><sup v-else class="procedural-mark" title="Procedurally assigned">p</sup>
    </div>
    <div class="info-row">
      <span class="info-label">Constellation</span> {{ constellation }}
    </div>
    <div class="info-row">
      <span class="info-label">Distance</span> {{ galaxy.distance_mpc.toFixed(1) }} Mpc ({{ Math.round(galaxy.distance_mly).toLocaleString() }} Mly)
    </div>
    <div class="info-row">
      <span class="info-label">{{ t('pages.galaxy.size') }}</span> {{ sizeEstimate.diameterKpc.toFixed(1) }} kpc ({{ (sizeEstimate.diameterKpc * 3.26).toFixed(1) }} kly) <span class="size-source">{{ t('pages.galaxy.size' + sizeSourceKey) }}</span>
    </div>
    <div v-if="galaxy.vcmb != null" class="info-row">
      <span class="info-label">CMB Velocity</span> {{ galaxy.vcmb.toLocaleString() }} km/s
    </div>
    <div class="info-row">
      <span class="info-label">DM</span> {{ galaxy.dm.toFixed(2) }}<span v-if="galaxy.e_dm != null"> &plusmn; {{ galaxy.e_dm.toFixed(2) }}</span>
    </div>
    <div v-if="methodEntries.length > 0" class="info-row info-methods">
      <span class="info-label">Methods</span>
      <span class="method-list">
        <span
          v-for="m in methodEntries"
          :key="m.abbr"
          class="method-tag"
          :title="t(`pages.about.data.methods.${m.key}.desc`)"
        >{{ m.abbr }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Galaxy } from '@/types/galaxy'
import { selectPreset, assignPresetFromPgc, presetToCategory, mapGalaxyToRenderParams } from '@/three/galaxy-detail/morphology'
import { getConstellation } from '@/three/constellationLookup'

const { t } = useI18n()

const props = defineProps<{
  galaxy: Galaxy
}>()

const constellation = computed(() => getConstellation(props.galaxy.ra, props.galaxy.dec))

const morphology = computed(() => {
  const preset = props.galaxy.morphology ? selectPreset(props.galaxy.morphology) : assignPresetFromPgc(props.galaxy.pgc)
  return presetToCategory(preset)
})

const renderParams = computed(() => mapGalaxyToRenderParams(props.galaxy))

const sizeEstimate = computed(() => ({
  diameterKpc: renderParams.value.diameterKpc,
  source: renderParams.value.sizeSource,
}))

const sizeSourceKey = computed(() => {
  switch (sizeEstimate.value.source) {
    case 'observed': return 'Observed'
    case 'mass': return 'Mass'
    default: return 'Estimated'
  }
})

const methodEntries = computed(() => {
  const g = props.galaxy
  const list: { key: string; abbr: string }[] = []
  if (g.dm_snia != null) list.push({ key: 'snia', abbr: 'SNIa' })
  if (g.dm_tf != null) list.push({ key: 'tf', abbr: 'TF' })
  if (g.dm_fp != null) list.push({ key: 'fp', abbr: 'FP' })
  if (g.dm_sbf != null) list.push({ key: 'sbf', abbr: 'SBF' })
  if (g.dm_snii != null) list.push({ key: 'snii', abbr: 'SNII' })
  if (g.dm_trgb != null) list.push({ key: 'trgb', abbr: 'TRGB' })
  if (g.dm_ceph != null) list.push({ key: 'ceph', abbr: 'Ceph' })
  if (g.dm_mas != null) list.push({ key: 'mas', abbr: 'Mas' })
  return list
})
</script>

<style scoped>
.galaxy-info-card {
  position: fixed;
  top: calc(var(--header-height) + 12px);
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

@media (max-width: 767px) {
  .galaxy-info-card {
    top: auto;
    bottom: 24px;
  }
}

.info-row {
  line-height: 1.6;
}

.info-label {
  color: rgba(255, 255, 255, 0.45);
  margin-right: 6px;
}

.info-methods {
  display: flex;
  align-items: baseline;
  pointer-events: auto;
}

.method-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.method-tag {
  font-family: ui-monospace, monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 3px;
  padding: 1px 5px;
  cursor: help;
  transition: color 0.2s, border-color 0.2s;
}

.method-tag:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.35);
}

.size-source {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.catalog-type {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  margin-left: 4px;
}

.procedural-mark {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.3);
  margin-left: 2px;
  cursor: help;
}
</style>
