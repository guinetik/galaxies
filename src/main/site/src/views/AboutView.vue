<template>
  <div class="about-scroll" ref="scrollContainer" @scroll="onScroll">
    <AboutBackground :current-section="currentSection" :scroll-progress="scrollProgress" />

    <div class="about-page">
      <!-- Hero -->
      <section class="about-hero" data-section="0">
        <h1 class="about-hero-title">{{ t('pages.about.title') }}</h1>
        <p class="about-hero-subtitle">{{ t('pages.about.subtitle') }}</p>
      </section>

      <!-- The Data -->
      <section class="about-section" data-section="1">
        <h2 class="about-section-title">{{ t('pages.about.data.title') }}</h2>
        <p class="about-body">{{ t('pages.about.data.intro') }}</p>
        <div class="about-links">
          <a href="https://doi.org/10.3847/1538-4357/ac94d8" target="_blank" rel="noopener" class="about-link">
            {{ t('pages.about.data.paperLink') }} &nearr;
          </a>
          <a href="https://edd.ifa.hawaii.edu/" target="_blank" rel="noopener" class="about-link">
            {{ t('pages.about.data.dataLink') }} &nearr;
          </a>
          <a href="/data/galaxies.db" download="galaxies.db" class="about-link about-link-download">
            {{ t('pages.about.data.downloadDb') }} &darr;
          </a>
        </div>
      </section>

      <!-- Measurements Tutorial -->
      <section class="about-section" data-section="2">
        <h2 class="about-section-title">{{ t('pages.about.measurements.title') }}</h2>
        <p class="about-body">{{ t('pages.about.measurements.intro') }}</p>

        <div class="about-measurements-grid">
          <div v-for="key in measurementKeys" :key="key" class="about-measurement-card">
            <h3 class="about-measurement-title">{{ t(`pages.about.measurements.${key}.title`) }}</h3>
            <p class="about-measurement-desc">{{ t(`pages.about.measurements.${key}.desc`) }}</p>
            <div class="about-measurement-visual">
              <TelescopeLens
                v-if="key === 'mly'"
                :telescope-src="measurementSrc(key, 'base')"
                :telescope-alt="t(`pages.about.measurements.${key}.baseAlt`)"
                :observation-src="measurementSrc(key, 'zoom')"
                :observation-alt="t(`pages.about.measurements.${key}.zoomAlt`)"
              />
              <ExpansionSimulation v-else-if="key === 'velocity'" />
              <CMBSimulation v-else-if="key === 'cmb'" />
              <DMSimulation v-else-if="key === 'dm'" />
            </div>
          </div>
        </div>
      </section>

      <!-- From Data to Sky -->
      <section class="about-section" data-section="3">
        <h2 class="about-section-title">{{ t('pages.about.mapping.title') }}</h2>
        <div class="about-image-placeholder" :class="{ 'has-image': mappingImageLoaded }">
          <img
            v-show="mappingImageLoaded"
            src="/about/mapping-celestial-sphere.webp"
            :alt="t('pages.about.mapping.imageAlt')"
            class="about-image"
            @load="mappingImageLoaded = true"
          />
          <span v-show="!mappingImageLoaded">{{ t('pages.about.mapping.imageAlt') }}</span>
        </div>
        <p class="about-body">{{ t('pages.about.mapping.positioning') }}</p>
        <p class="about-body">{{ t('pages.about.mapping.visibility') }}</p>
        <p class="about-body">{{ t('pages.about.mapping.sizing') }}</p>
      </section>

      <!-- Procedural Rendering -->
      <section class="about-section" data-section="4">
        <h2 class="about-section-title">{{ t('pages.about.rendering.title') }}</h2>
        <p class="about-body">{{ t('pages.about.rendering.intro') }}</p>
        <div class="about-image-placeholder" :class="{ 'has-image': renderingImageLoaded }">
          <img
            v-show="renderingImageLoaded"
            src="/about/rendering-morphology.webp"
            :alt="t('pages.about.rendering.imageAlt')"
            class="about-image"
            @load="renderingImageLoaded = true"
          />
          <span v-show="!renderingImageLoaded">{{ t('pages.about.rendering.imageAlt') }}</span>
        </div>
        <p class="about-body">{{ t('pages.about.rendering.morphology') }}</p>
        <p class="about-body">{{ t('pages.about.rendering.particles') }}</p>
        <p class="about-body">{{ t('pages.about.rendering.blackhole') }}</p>
      </section>

      <!-- Credits -->
      <section class="about-credits" data-section="5">
        <h2 class="about-section-title">{{ t('pages.about.credits.title') }}</h2>
        <p>
          {{ t('pages.about.credits.builtBy') }}
          <a href="https://github.com/guinetik" target="_blank" rel="noopener">guinetik</a>
        </p>
        <p>
          {{ t('pages.about.credits.dataSource') }}
          <a href="https://edd.ifa.hawaii.edu/" target="_blank" rel="noopener">
            {{ t('pages.about.credits.dataName') }}
          </a>
          — {{ t('pages.about.credits.dataCitation') }}
        </p>
        <div class="about-tech">
          <h3 class="about-tech-title">{{ t('pages.about.credits.techTitle') }}</h3>
          <div class="about-tech-list">
            <span v-for="tech in techStack" :key="tech" class="about-tech-item">{{ tech }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AboutBackground from '@/components/AboutBackground.vue'
import TelescopeLens from '@/components/TelescopeLens.vue'
import ExpansionSimulation from '@/components/about/ExpansionSimulation.vue'
import CMBSimulation from '@/components/about/CMBSimulation.vue'
import DMSimulation from '@/components/about/DMSimulation.vue'

const { t } = useI18n()

const measurementKeys = ['mly', 'velocity', 'cmb', 'dm'] as const
const mappingImageLoaded = ref(false)
const renderingImageLoaded = ref(false)
const techStack = ['Vue 3', 'TypeScript', 'Three.js', 'GLSL Shaders', 'sql.js', 'SQLite', 'Tailwind', 'Vite']

/** Base path for measurement tutorial images. Add images to public/about/measurements/ */
function measurementSrc(key: string, variant: 'base' | 'zoom'): string {
  const name = variant === 'base' ? key : `${key}-detail`
  return `/about/measurements/${name}.webp`
}

const scrollContainer = ref<HTMLElement | null>(null)
const currentSection = ref(0)
const scrollProgress = ref(0)

function onScroll() {
  if (!scrollContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  scrollProgress.value = scrollTop / (scrollHeight - clientHeight)
}

onMounted(() => {
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
  document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el))
})
</script>

<style scoped>
.about-scroll {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  background: transparent;
  z-index: 1;
}

.about-page {
  width: 100%;
  min-height: 100vh;
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;
  padding: calc(var(--header-height) + 2rem) 1.5rem 4rem;
  position: relative;
  z-index: 10;
}

/* Hero */
.about-hero {
  text-align: center;
  margin-bottom: 6rem;
  padding-top: 20vh;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.about-hero-title {
  font-size: 3.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.about-hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* Sections */
.about-section {
  margin-bottom: 15vh;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.about-section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
}

.about-body {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.625;
  margin-bottom: 1.5rem;
}

/* Links */
.about-links {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}

.about-link {
  color: rgba(34, 211, 238, 0.7);
  transition: color 0.2s;
  font-size: 0.875rem;
}

.about-link:hover {
  color: #22d3ee;
}

/* Measurement cards */
.about-measurements-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.about-measurement-card {
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.about-measurement-card:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.35);
}

.about-measurement-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #22d3ee;
  margin-bottom: 0.75rem;
  font-family: ui-monospace, monospace;
}

.about-measurement-desc {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.about-measurement-visual {
  width: 100%;
  max-width: 480px;
  margin-top: 0.5rem;
}

/* Image placeholders */
.about-image-placeholder {
  width: 100%;
  min-height: 12rem;
  border-radius: 0.5rem;
  margin: 2rem 0;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.about-image-placeholder span {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
  text-align: center;
  padding: 1rem;
}

.about-image-placeholder.has-image .about-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Credits */
.about-credits {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin-bottom: 4rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
}

.about-credits > * + * {
  margin-top: 0.75rem;
}

.about-credits a {
  color: rgba(34, 211, 238, 0.7);
  transition: color 0.2s;
}

.about-credits a:hover {
  color: #22d3ee;
}

/* Tech stack */
.about-tech {
  margin-top: 2rem;
}

.about-tech-title {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.about-tech-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 1rem;
  row-gap: 0.25rem;
}

.about-tech-item {
  font-family: ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

.about-tech-item:not(:last-child)::after {
  content: '\00b7';
  margin-left: 1rem;
  color: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (min-width: 768px) {
  .about-hero-title {
    font-size: 6rem;
  }

  .about-hero-subtitle {
    font-size: 1.5rem;
  }

  .about-section-title {
    font-size: 2.25rem;
  }

  .about-measurements-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-measurement-visual {
    max-width: 100%;
  }

  .about-image-placeholder {
    min-height: 16rem;
  }
}
</style>
