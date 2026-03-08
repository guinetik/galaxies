<template>
  <div class="tour-scroll" ref="scrollContainerRef" @scroll="onScroll">
    <AboutBackground
      :current-section="aboutSection"
      :scroll-progress="scrollProgress"
    />
    <div class="tour-page">
      <!-- Hero -->
      <section class="tour-hero" data-section="0">
        <h1 class="tour-hero-title">{{ t('pages.tour.title') }}</h1>
        <p class="tour-hero-subtitle">{{ t('pages.tour.subtitle') }}</p>
      </section>

      <!-- Category carousels from tour.json -->
      <section
        v-for="(cat, idx) in categoryOrder"
        :key="cat"
        v-show="categories[cat]?.length"
        class="tour-section tour-carousel-section"
        :data-section="1 + idx"
      >
        <h2 class="tour-section-title">{{ t(`pages.tour.categories.${cat}`) }}</h2>
        <GalaxyCoverflowCarousel :items="categories[cat]" />
      </section>

      <!-- Original shuffle section -->
      <section class="tour-section tour-shuffle-section" :data-section="categoryOrder.length + 1">
        <h2 class="tour-section-title">{{ t('pages.tour.shuffleSubtitle') }}</h2>
        <button
          class="tour-shuffle"
          :disabled="isLoading"
          @click="pick"
        >
          {{ isLoading ? 'Loading…' : t('pages.tour.shuffle') }}
        </button>
        <ul v-if="picks.length" class="tour-list">
          <li v-for="item in picks" :key="item.galaxy.pgc" class="tour-item">
            <RouterLink :to="`/g/${item.galaxy.pgc}`" class="tour-link">
              {{ item.label }} — PGC {{ item.galaxy.pgc }}
            </RouterLink>
          </li>
        </ul>
        <p v-else-if="!isLoading" class="tour-empty">{{ t('pages.tour.shuffleEmpty') }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import AboutBackground from '@/components/AboutBackground.vue'
import GalaxyCoverflowCarousel from '@/components/tour/GalaxyCoverflowCarousel.vue'
import type { Galaxy } from '@/types/galaxy'
import type { MorphologyCategory } from '@/three/galaxy-detail/morphology'
import { selectPreset, assignPresetFromPgc, presetToCategory } from '@/three/galaxy-detail/morphology'

const SAMPLE_SIZE = 3000
const MORPH_TYPES: MorphologyCategory[] = ['spiral', 'barred', 'elliptical', 'lenticular', 'irregular']

const CATEGORY_ORDER: (MorphologyCategory | 'unknown')[] = ['spiral', 'barred', 'elliptical', 'lenticular', 'irregular', 'unknown']

interface TourEntry {
  names: string[]
  type: string
  category?: string
  constellation?: string
  description?: string
}

interface PickItem {
  galaxy: Galaxy
  label: string
}

const { t } = useI18n()
const picks = ref<PickItem[]>([])
const { isLoading, ready, getRandomGalaxies, getGalaxiesByPgcList } = useGalaxyData()

const tourData = ref<Record<string, TourEntry>>({})
const categories = ref<Record<string, Array<{
  pgc: number
  names: string[]
  type: string
  category: string
  constellation?: string
  description?: string
  galaxy?: Galaxy | null
}>>>({})

const categoryOrder = computed(() => CATEGORY_ORDER)

/** Map Tour section to AboutBackground section: 0 = hero galaxy, 1+ = morphology showcase */
const aboutSection = computed(() => (currentSection.value === 0 ? 0 : 3))

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
      label: t(`morphology.${m}`),
    }))
}

async function loadTourData() {
  try {
    const res = await fetch('/tour.json')
    const data = (await res.json()) as Record<string, TourEntry>
    tourData.value = data

    const pgcList = Object.keys(data).map(Number)
    const galaxies = getGalaxiesByPgcList(pgcList)
    const galaxyMap = new Map(galaxies.map((g) => [g.pgc, g]))

    const byCategory: Record<string, typeof categories.value[string]> = {}

    for (const [pgcStr, entry] of Object.entries(data)) {
      const pgc = Number(pgcStr)
      const cat = entry.category ?? 'unknown'
      if (!byCategory[cat]) byCategory[cat] = []
      byCategory[cat].push({
        pgc,
        names: entry.names ?? [],
        type: entry.type ?? '',
        category: cat,
        constellation: entry.constellation,
        description: entry.description,
        galaxy: galaxyMap.get(pgc) ?? null,
      })
    }

    categories.value = byCategory
  } catch (err) {
    console.error('Failed to load tour.json:', err)
  }
}

const scrollContainerRef = ref<HTMLElement | null>(null)
const currentSection = ref(0)
const scrollProgress = ref(0)

function onScroll() {
  if (!scrollContainerRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.value
  scrollProgress.value = scrollTop / Math.max(1, scrollHeight - clientHeight)
}

onMounted(async () => {
  await ready
  pick()
  await loadTourData()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = Number(entry.target.getAttribute('data-section'))
          if (!isNaN(sectionIndex)) {
            currentSection.value = sectionIndex
          }
        }
      })
    },
    { threshold: 0.5 },
  )
  scrollContainerRef.value?.querySelectorAll('[data-section]').forEach((el) => observer.observe(el))
})
</script>

<style scoped>
.tour-scroll {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  background: transparent;
  z-index: 1;
}

.tour-page {
  width: 100%;
  min-height: 100vh;
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;
  padding: calc(var(--header-height) + 2rem) 1.5rem 4rem;
  position: relative;
  z-index: 10;
}

.tour-hero {
  text-align: center;
  margin-bottom: 4rem;
  padding-top: 12vh;
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tour-hero-title {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.tour-hero-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.tour-section {
  margin-bottom: 4rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tour-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.tour-shuffle-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.tour-shuffle {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.2s, border-color 0.2s;
}

.tour-shuffle:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(34, 211, 238, 0.5);
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
  width: 100%;
  max-width: 24rem;
}

.tour-item {
  padding: 0.25rem 0;
}

.tour-link {
  color: rgba(34, 211, 238, 0.9);
  text-decoration: none;
  transition: color 0.2s;
}

.tour-link:hover {
  color: #22d3ee;
}

.tour-empty {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
}

.tour-carousel-section {
  padding: 2rem 1rem;
}
</style>
