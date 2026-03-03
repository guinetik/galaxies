<template>
  <div class="cosmo-scroll" ref="scrollContainer" @scroll="onScroll">
    <CosmographyBackground :current-section="currentSection" :scroll-progress="scrollProgress" />

    <div class="cosmo-page">
      <!-- Hero -->
      <section class="cosmo-hero" data-section="0">
        <h1 class="cosmo-hero-title">{{ t('pages.cosmography.title') }}</h1>
        <p class="cosmo-hero-subtitle">{{ t('pages.cosmography.subtitle') }}</p>
      </section>

      <!-- Distance Ladder -->
      <section class="cosmo-section" data-section="1">
        <h2 class="cosmo-section-title">{{ t('pages.cosmography.ladder.title') }}</h2>
        <p class="cosmo-body">{{ t('pages.cosmography.ladder.intro') }}</p>
        <div class="ladder-chart">
          <div class="ladder-axis">
            <span :style="{ left: mpcToPercent(1) + '%' }">1</span>
            <span :style="{ left: mpcToPercent(10) + '%' }">10</span>
            <span :style="{ left: mpcToPercent(100) + '%' }">100</span>
            <span :style="{ left: mpcToPercent(600) + '%' }">600 Mpc</span>
          </div>
          <div class="ladder-rows">
            <div
              v-for="key in methodKeys"
              :key="key"
              class="ladder-row"
              @click="scrollToMethod(key)"
            >
              <div class="ladder-label">{{ t(`pages.cosmography.methods.${key}.name`) }}</div>
              <div class="ladder-track-wrap">
                <div class="ladder-track">
                  <div
                    class="ladder-bar"
                    :style="{
                      left: mpcToPercent(ladderRanges[key][0]) + '%',
                      width: (mpcToPercent(ladderRanges[key][1]) - mpcToPercent(ladderRanges[key][0])) + '%',
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Method Cards -->
      <section class="cosmo-section" data-section="2">
        <h2 class="cosmo-section-title">{{ t('pages.cosmography.methods.sectionTitle') }}</h2>
        <div
          v-for="key in methodKeys"
          :key="key"
          :id="'method-' + key"
          class="method-card"
        >
          <div class="method-card-visual">
            <TelescopeLens
              :telescope-src="`/cosmography/telescopes/${key}.jpg`"
              :telescope-alt="t(`pages.cosmography.methods.${key}.telescopeAlt`)"
              :observation-src="`/cosmography/observations/${key}.jpg`"
              :observation-alt="t(`pages.cosmography.methods.${key}.observationAlt`)"
            />
          </div>
          <div class="method-card-content">
            <h3 class="method-name">{{ t(`pages.cosmography.methods.${key}.name`) }}</h3>
            <div class="method-badge">
              <span class="badge" :class="badgeClass(key)">{{ t(`pages.cosmography.methods.${key}.location`) }}</span>
              <span class="badge-instruments">{{ t(`pages.cosmography.methods.${key}.instruments`) }}</span>
            </div>
            <p class="cosmo-body">{{ t(`pages.cosmography.methods.${key}.desc`) }}</p>
            <div class="method-stats">
              <span>{{ t(`pages.cosmography.methods.${key}.range`) }} Mpc</span>
              <span>{{ t(`pages.cosmography.methods.${key}.count`) }} galaxies</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Catalogs -->
      <section class="cosmo-section" data-section="3">
        <h2 class="cosmo-section-title">{{ t('pages.cosmography.catalogs.title') }}</h2>
        <p class="cosmo-body">{{ t('pages.cosmography.catalogs.intro') }}</p>
        <div class="catalog-grid">
          <div
            v-for="key in catalogKeys"
            :key="key"
            class="catalog-card"
          >
            <h3 class="catalog-name">{{ t(`pages.cosmography.catalogs.${key}.name`) }}</h3>
            <div class="catalog-team">{{ t(`pages.cosmography.catalogs.${key}.team`) }}</div>
            <div class="catalog-count">{{ t(`pages.cosmography.catalogs.${key}.count`) }} galaxies</div>
            <p class="catalog-desc">{{ t(`pages.cosmography.catalogs.${key}.desc`) }}</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <div class="cosmo-footer">
        <a href="https://doi.org/10.3847/1538-4357/ac94d8" target="_blank" rel="noopener">{{ t('pages.cosmography.links.cf4Paper') }} &nearr;</a>
        <a href="https://doi.org/10.3847/1538-3881/ab9813" target="_blank" rel="noopener">{{ t('pages.cosmography.links.alfalfaPaper') }} &nearr;</a>
        <a href="https://edd.ifa.hawaii.edu/" target="_blank" rel="noopener">{{ t('pages.cosmography.links.edd') }} &nearr;</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CosmographyBackground from '@/components/CosmographyBackground.vue'
import TelescopeLens from '@/components/TelescopeLens.vue'

const { t } = useI18n()

const methodKeys = ['ceph', 'trgb', 'mas', 'sbf', 'snii', 'tf', 'fp', 'snia']
const catalogKeys = ['cf4', 'alfalfa', 'fss', 'ugc']

// Distance ladder data: [minMpc, maxMpc] for log-scale bar positioning
const ladderRanges: Record<string, [number, number]> = {
  ceph: [1, 30],
  trgb: [1, 20],
  mas: [1, 170],
  sbf: [5, 120],
  snii: [5, 200],
  tf: [10, 250],
  fp: [20, 300],
  snia: [50, 600],
}

// Log-scale positioning: map Mpc to percentage (1 Mpc = 0%, 600 Mpc = 100%)
const LOG_MIN = Math.log10(1)
const LOG_MAX = Math.log10(600)
function mpcToPercent(mpc: number): number {
  return ((Math.log10(mpc) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100
}

// Scroll tracking (same pattern as AboutView)
const scrollContainer = ref<HTMLElement | null>(null)
const currentSection = ref(0)
const scrollProgress = ref(0)

function onScroll() {
  if (!scrollContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  scrollProgress.value = scrollTop / (scrollHeight - clientHeight)
}

function scrollToMethod(key: string) {
  const el = document.getElementById(`method-${key}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function badgeClass(key: string): string {
  const loc: Record<string, string> = {
    ceph: 'space',
    trgb: 'space',
    mas: 'ground',
    sbf: 'both',
    snii: 'ground',
    tf: 'ground',
    fp: 'ground',
    snia: 'both',
  }
  return 'badge-' + (loc[key] ?? 'ground')
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.getAttribute('data-section'))
          if (!isNaN(idx)) currentSection.value = idx
        }
      })
    },
    { threshold: 0.5 },
  )
  document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el))
})
</script>

<style scoped>
/* ── Page structure (mirrors AboutView) ── */
.cosmo-scroll {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  background: transparent;
  z-index: 1;
}

.cosmo-page {
  width: 100%;
  min-height: 100vh;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  padding: calc(var(--header-height) + 2rem) 1.5rem 4rem;
  position: relative;
  z-index: 10;
}

/* ── Hero ── */
.cosmo-hero {
  text-align: center;
  margin-bottom: 6rem;
  padding-top: 20vh;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cosmo-hero-title {
  font-size: 3.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.cosmo-hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* ── Sections (glassmorphism cards) ── */
.cosmo-section {
  margin-bottom: 15vh;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cosmo-section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
}

.cosmo-body {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.625;
  margin-bottom: 1.5rem;
}

/* ── Distance Ladder ── */
.ladder-chart {
  margin: 2rem 0;
}

.ladder-axis {
  position: relative;
  height: 1.5rem;
  margin-bottom: 0.5rem;
}

.ladder-axis span {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  font-family: ui-monospace, monospace;
  white-space: nowrap;
}

.ladder-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ladder-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  cursor: pointer;
  padding: 8px 0;
}

.ladder-row:hover .ladder-bar {
  opacity: 1;
}

.ladder-row:hover .ladder-label {
  color: #22d3ee;
}

.ladder-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.2s;
}

.ladder-track-wrap {
  width: 100%;
}

.ladder-track {
  position: relative;
  width: 100%;
  height: 22px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.ladder-bar {
  position: absolute;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.35), rgba(34, 211, 238, 0.75));
  transition: opacity 0.2s;
}

/* ── Method Cards ── */
.method-card {
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.method-card-visual {
  flex-shrink: 0;
}

.method-card-content {
  flex: 1;
  min-width: 0;
}

.method-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.method-badge {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.badge-space {
  background: rgba(34, 211, 238, 0.15);
  color: #22d3ee;
  border: 1px solid rgba(34, 211, 238, 0.3);
}

.badge-ground {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-both {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.badge-instruments {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

.method-stats {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
  font-family: ui-monospace, monospace;
}

/* ── Catalog Grid ── */
.catalog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

.catalog-card {
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: background 0.3s, border-color 0.3s;
}

.catalog-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.catalog-name {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.catalog-team {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 0.5rem;
}

.catalog-count {
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
  color: #22d3ee;
  margin-bottom: 0.5rem;
}

.catalog-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin: 0;
}

/* ── Footer ── */
.cosmo-footer {
  text-align: center;
  padding: 2rem;
  margin-bottom: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.5rem;
}

.cosmo-footer a {
  color: rgba(34, 211, 238, 0.7);
  font-size: 0.875rem;
  transition: color 0.2s;
}

.cosmo-footer a:hover {
  color: #22d3ee;
}

/* ── Responsive ── */
@media (min-width: 768px) {
  .cosmo-hero-title {
    font-size: 6rem;
  }

  .cosmo-hero-subtitle {
    font-size: 1.5rem;
  }

  .cosmo-section-title {
    font-size: 2.25rem;
  }

  .method-card {
    flex-direction: row;
  }

  .method-card-visual {
    width: 280px;
  }

  .catalog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .cosmo-hero {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .cosmo-hero-title {
    font-size: 2.25rem;
    word-break: break-word;
  }

  .ladder-label {
    font-size: 0.8rem;
  }
}
</style>
