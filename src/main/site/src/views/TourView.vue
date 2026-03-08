<template>
  <div class="tour-page">
    <h1 class="tour-title">Tour</h1>
    <p class="tour-subtitle">One galaxy per morphology type</p>

    <button
      class="tour-shuffle"
      :disabled="isLoading"
      @click="pick"
    >
      {{ isLoading ? 'Loading…' : 'Shuffle' }}
    </button>

    <ul v-if="picks.length" class="tour-list">
      <li v-for="item in picks" :key="item.galaxy.pgc" class="tour-item">
        <RouterLink :to="`/g/${item.galaxy.pgc}`" class="tour-link">
          {{ item.label }} — PGC {{ item.galaxy.pgc }}
        </RouterLink>
      </li>
    </ul>
    <p v-else-if="!isLoading" class="tour-empty">No picks yet. Click Shuffle.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { Galaxy } from '@/types/galaxy'
import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'
import { selectPreset, assignPresetFromPgc, presetToCategory } from '@/three/galaxy-detail/morphology'

const SAMPLE_SIZE = 3000
const MORPH_TYPES: MorphologyCategory[] = ['spiral', 'barred', 'elliptical', 'lenticular', 'irregular']

interface PickItem {
  galaxy: Galaxy
  label: string
}

const picks = ref<PickItem[]>([])
const { isLoading, ready, getRandomGalaxies } = useGalaxyData()

/** Pick one galaxy per morphology type from a random sample. */
function pick() {
  picks.value = []
  const galaxies = getRandomGalaxies(SAMPLE_SIZE)
  const byType = new Map<MorphologyCategory, Galaxy>()

  for (const g of galaxies) {
    const preset = g.morphology ? selectPreset(g.morphology) : assignPresetFromPgc(g.pgc)
    const morph = presetToCategory(preset)
    if (!byType.has(morph)) {
      byType.set(morph, g)
      if (byType.size === MORPH_TYPES.length) break
    }
  }

  picks.value = MORPH_TYPES
    .filter((m) => byType.has(m))
    .map((m) => ({
      galaxy: byType.get(m)!,
      label: m.charAt(0).toUpperCase() + m.slice(1),
    }))
}

onMounted(async () => {
  await ready
  pick()
})
</script>

<style scoped>
.tour-page {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.tour-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.tour-subtitle {
  font-size: 0.875rem;
  color: var(--color-muted, #666);
}

.tour-shuffle {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: 1px solid currentColor;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}

.tour-shuffle:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
}

.tour-shuffle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tour-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.tour-item {
  padding: 0.25rem 0;
}

.tour-link {
  color: inherit;
  text-decoration: underline;
}

.tour-link:hover {
  text-decoration: none;
}

.tour-empty {
  font-size: 0.875rem;
  color: var(--color-muted, #666);
}
</style>
