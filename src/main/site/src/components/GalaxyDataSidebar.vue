<template>
  <transition name="slide-right">
    <div v-if="show" class="data-sidebar">
      <div class="sidebar-scroll">
        <button class="sidebar-close" @click="$emit('update:show', false)">&times;</button>

        <!-- Identity -->
        <h2 class="sidebar-title">{{ t('pages.galaxy.sections.identity') }}</h2>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.pgc.label') }}</div>
          <div class="data-value">{{ galaxy.pgc }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.pgc.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.group_pgc.label') }}</div>
          <div class="data-value">{{ galaxy.group_pgc ?? '—' }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.group_pgc.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.t17.label') }}</div>
          <div class="data-value">{{ galaxy.t17 ?? '—' }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.t17.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.morphology.label') }}</div>
          <div class="data-value">{{ t('morphology.' + morphology) }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.morphology.desc') }}</div>
        </div>

        <!-- Distance -->
        <h2 class="sidebar-section">{{ t('pages.galaxy.sections.distance') }}</h2>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.dm.label') }}</div>
          <div class="data-value">{{ galaxy.dm.toFixed(2) }} mag</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.dm.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.e_dm.label') }}</div>
          <div class="data-value">{{ galaxy.e_dm != null ? '± ' + galaxy.e_dm.toFixed(2) + ' mag' : '—' }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.e_dm.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.distance_mpc.label') }}</div>
          <div class="data-value">{{ galaxy.distance_mpc.toFixed(1) }} Mpc</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.distance_mpc.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.distance_mly.label') }}</div>
          <div class="data-value">{{ Math.round(galaxy.distance_mly).toLocaleString() }} Mly</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.distance_mly.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.vcmb.label') }}</div>
          <div class="data-value">{{ galaxy.vcmb != null ? galaxy.vcmb.toLocaleString() + ' km/s' : '—' }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.vcmb.desc') }}</div>
        </div>

        <!-- Coordinates -->
        <h2 class="sidebar-section">{{ t('pages.galaxy.sections.coordinates') }}</h2>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.ra.label') }}</div>
          <div class="data-value">{{ galaxy.ra.toFixed(4) }}°</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.ra.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.dec.label') }}</div>
          <div class="data-value">{{ formatSigned(galaxy.dec, 4) }}°</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.dec.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.glon.label') }}</div>
          <div class="data-value">{{ galaxy.glon != null ? galaxy.glon.toFixed(4) + '°' : '—' }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.glon.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.glat.label') }}</div>
          <div class="data-value">{{ galaxy.glat != null ? formatSigned(galaxy.glat, 4) + '°' : '—' }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.glat.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.sgl.label') }}</div>
          <div class="data-value">{{ galaxy.sgl != null ? galaxy.sgl.toFixed(3) + '°' : '—' }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.sgl.desc') }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">{{ t('pages.galaxy.fields.sgb.label') }}</div>
          <div class="data-value">{{ galaxy.sgb != null ? formatSigned(galaxy.sgb, 3) + '°' : '—' }}</div>
          <div class="data-desc">{{ t('pages.galaxy.fields.sgb.desc') }}</div>
        </div>

        <!-- Distance Methods (only non-null) -->
        <template v-if="distanceMethods.length > 0">
          <h2 class="sidebar-section">{{ t('pages.galaxy.sections.methods') }}</h2>
          <div v-for="m in distanceMethods" :key="m.key" class="data-row">
            <div class="data-label">{{ t('pages.galaxy.fields.' + m.key + '.label') }}</div>
            <div class="data-value">{{ m.value }}</div>
            <div class="data-desc">{{ t('pages.galaxy.fields.' + m.key + '.desc') }}</div>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Galaxy } from '@/types/galaxy'
import { assignMorphology } from '@/types/galaxy'

const { t } = useI18n()

const props = defineProps<{
  galaxy: Galaxy
  show: boolean
}>()

defineEmits<{
  'update:show': [value: boolean]
}>()

const morphology = computed(() => assignMorphology(props.galaxy.pgc))

function formatSigned(v: number, decimals: number): string {
  const s = v.toFixed(decimals)
  return v >= 0 ? '+' + s : s
}

function formatMethod(dm: number | null, err: number | null): string | null {
  if (dm == null) return null
  const base = dm.toFixed(2)
  return err != null ? `${base} ± ${err.toFixed(2)}` : base
}

const distanceMethods = computed(() => {
  const g = props.galaxy
  const methods: { key: string; value: string }[] = []
  const pairs: [string, number | null, number | null][] = [
    ['dm_snia', g.dm_snia, g.e_dm_snia],
    ['dm_tf', g.dm_tf, g.e_dm_tf],
    ['dm_fp', g.dm_fp, g.e_dm_fp],
    ['dm_sbf', g.dm_sbf, g.e_dm_sbf],
    ['dm_snii', g.dm_snii, g.e_dm_snii],
    ['dm_trgb', g.dm_trgb, g.e_dm_trgb],
    ['dm_ceph', g.dm_ceph, g.e_dm_ceph],
    ['dm_mas', g.dm_mas, g.e_dm_mas],
  ]
  for (const [key, dm, err] of pairs) {
    const v = formatMethod(dm, err)
    if (v) methods.push({ key, value: v })
  }
  return methods
})
</script>

<style scoped>
.data-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 340px;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 25;
  backdrop-filter: blur(20px);
}

.sidebar-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 24px 20px 40px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

.sidebar-close {
  position: absolute;
  top: 20px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.4);
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.sidebar-close:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  padding-right: 40px;
}

.sidebar-section {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 24px;
  margin-bottom: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.data-row {
  margin-bottom: 12px;
}

.data-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2px;
}

.data-value {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-family: ui-monospace, monospace;
}

.data-desc {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.25);
  margin-top: 2px;
}

/* Slide-right transition */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 640px) {
  .data-sidebar {
    width: 100%;
  }
}
</style>
