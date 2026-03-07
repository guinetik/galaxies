<template>
  <!-- Collapsed pill -->
  <button
    v-if="!expanded"
    class="filter-pill"
    @click="expanded = true"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
    <span>{{ t('pages.home.filter') }}</span>
    <span v-if="isFiltered" class="pill-count">{{ formattedFilteredCount }}</span>
  </button>

  <!-- Expanded panel -->
  <Transition name="panel">
    <div v-if="expanded" class="filter-panel">
      <div class="panel-header">
        <span class="panel-title">{{ t('pages.home.filter') }}</span>
        <button class="close-btn" @click="expanded = false" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="section">
        <div class="section-label">{{ t('pages.home.morphologyLabel') }}</div>
        <div class="chip-row">
          <button
            v-for="m in morphologyOptions"
            :key="m"
            class="chip"
            :class="{ active: activeMorphologies.has(m) }"
            @click="toggleMorphology(m)"
          >{{ t('morphology.' + m) }}</button>
        </div>
      </div>

      <div class="section">
        <div class="section-label">{{ t('pages.home.catalogLabel') }}</div>
        <div class="chip-row">
          <button
            v-for="s in sourceOptions"
            :key="s"
            class="chip"
            :class="{ active: activeSources.has(s) }"
            @click="toggleSource(s)"
          >{{ s }}</button>
        </div>
      </div>

      <div class="panel-footer">
        {{ t('pages.home.showing', { count: formattedFilteredCount, total: formattedTotal }) }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'

const { t } = useI18n()

const props = defineProps<{
  totalCount: number
  filteredCount: number
}>()

const emit = defineEmits<{
  'filter-change': [payload: { morphologies: Set<MorphologyCategory>; sources: Set<string> }]
}>()

const expanded = ref(false)

const morphologyOptions: MorphologyCategory[] = ['spiral', 'barred', 'elliptical', 'lenticular', 'irregular']
const sourceOptions = ['CF4', 'ALFALFA', 'FSS', 'UGC']

const activeMorphologies = reactive(new Set<MorphologyCategory>(morphologyOptions))
const activeSources = reactive(new Set<string>(sourceOptions))

const isFiltered = computed(() =>
  activeMorphologies.size < morphologyOptions.length || activeSources.size < sourceOptions.length
)

const formattedFilteredCount = computed(() => props.filteredCount.toLocaleString())
const formattedTotal = computed(() => props.totalCount.toLocaleString())

function toggleMorphology(m: MorphologyCategory) {
  if (activeMorphologies.has(m)) {
    if (activeMorphologies.size > 1) activeMorphologies.delete(m)
  } else {
    activeMorphologies.add(m)
  }
  emitChange()
}

function toggleSource(s: string) {
  if (activeSources.has(s)) {
    if (activeSources.size > 1) activeSources.delete(s)
  } else {
    activeSources.add(s)
  }
  emitChange()
}

function emitChange() {
  emit('filter-change', {
    morphologies: new Set(activeMorphologies),
    sources: new Set(activeSources),
  })
}
</script>

<style scoped>
.filter-pill {
  position: fixed;
  top: 56px;
  left: 24px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  color: #e0e0e0;
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.filter-pill:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.85);
}

.pill-count {
  color: rgb(34, 211, 238);
  font-variant-numeric: tabular-nums;
}

.filter-panel {
  position: fixed;
  top: 56px;
  left: 24px;
  z-index: 20;
  width: 260px;
  background: rgba(0, 0, 0, 0.80);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  backdrop-filter: blur(12px);
  padding: 12px 16px;
  color: #e0e0e0;
  font-size: 12px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.panel-title {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.section {
  margin-bottom: 12px;
}

.section-label {
  color: rgba(255, 255, 255, 0.45);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.chip {
  padding: 3px 10px;
  font-size: 11px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: all 0.15s;
}

.chip:hover {
  border-color: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.7);
}

.chip.active {
  background: rgba(34, 211, 238, 0.12);
  border-color: rgba(34, 211, 238, 0.4);
  color: rgb(34, 211, 238);
}

.panel-footer {
  color: rgba(255, 255, 255, 0.35);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* Panel transition */
.panel-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.panel-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
