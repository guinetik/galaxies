<template>
  <div class="about-scroll">
    <div class="about-page">
    <router-link to="/" class="back-button">&larr; {{ t('pages.about.backToSky') }}</router-link>

    <!-- Hero -->
    <section class="about-hero">
      <h1 class="about-hero-title">{{ t('pages.about.title') }}</h1>
      <p class="about-hero-subtitle">{{ t('pages.about.subtitle') }}</p>
    </section>

    <!-- The Data -->
    <section class="about-section">
      <h2 class="about-section-title">{{ t('pages.about.data.title') }}</h2>
      <p class="about-body">{{ t('pages.about.data.intro') }}</p>

      <h3 class="about-subsection-title">{{ t('pages.about.data.methodsTitle') }}</h3>
      <p class="about-body">{{ t('pages.about.data.methodsIntro') }}</p>

      <div class="about-methods-grid">
        <div v-for="key in methodKeys" :key="key" class="about-method-card">
          <div class="about-method-header">
            <span class="about-method-abbr">{{ t(`pages.about.data.methods.${key}.abbr`) }}</span>
            <span class="about-method-name">{{ t(`pages.about.data.methods.${key}.name`) }}</span>
          </div>
          <p class="about-method-desc">{{ t(`pages.about.data.methods.${key}.desc`) }}</p>
        </div>
      </div>

      <div class="about-links">
        <a href="https://doi.org/10.3847/1538-4357/ac94d8" target="_blank" rel="noopener" class="about-link">
          {{ t('pages.about.data.paperLink') }} &nearr;
        </a>
        <a href="https://edd.ifa.hawaii.edu/" target="_blank" rel="noopener" class="about-link">
          {{ t('pages.about.data.dataLink') }} &nearr;
        </a>
      </div>
    </section>

    <!-- From Data to Sky -->
    <section class="about-section">
      <h2 class="about-section-title">{{ t('pages.about.mapping.title') }}</h2>
      <div class="about-image-placeholder">
        <span><!-- alt: Celestial sphere showing galaxies at different zoom levels, from wide-angle sparse view to deep-field dense view --></span>
      </div>
      <p class="about-body">{{ t('pages.about.mapping.positioning') }}</p>
      <p class="about-body">{{ t('pages.about.mapping.visibility') }}</p>
      <p class="about-body">{{ t('pages.about.mapping.sizing') }}</p>
    </section>

    <!-- Procedural Rendering -->
    <section class="about-section">
      <h2 class="about-section-title">{{ t('pages.about.rendering.title') }}</h2>
      <p class="about-body">{{ t('pages.about.rendering.intro') }}</p>
      <div class="about-image-placeholder">
        <span><!-- alt: Side-by-side comparison of five procedurally generated galaxy types: spiral, barred spiral, elliptical, lenticular, and irregular --></span>
      </div>
      <p class="about-body">{{ t('pages.about.rendering.morphology') }}</p>
      <p class="about-body">{{ t('pages.about.rendering.particles') }}</p>
      <p class="about-body">{{ t('pages.about.rendering.blackhole') }}</p>
    </section>

    <!-- Credits -->
    <section class="about-credits">
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const methodKeys = ['snia', 'tf', 'fp', 'sbf', 'snii', 'trgb', 'ceph', 'mas']
const techStack = ['Vue 3', 'TypeScript', 'Three.js', 'GLSL Shaders', 'sql.js', 'SQLite', 'Tailwind', 'Vite']
</script>

<style scoped>
.about-scroll {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  background: #000;
  z-index: 1;
}

.about-page {
  width: 100%;
  min-height: 100vh;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  padding: 4rem 1.5rem;
}

/* Hero */
.about-hero {
  text-align: center;
  margin-bottom: 6rem;
  padding-top: 3rem;
}

.about-hero-title {
  font-size: 3.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.about-hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
}

/* Sections */
.about-section {
  margin-bottom: 6rem;
}

.about-section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
}

.about-subsection-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.about-body {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.625;
  margin-bottom: 1.5rem;
}

/* Method cards */
.about-methods-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin: 2rem 0;
}

.about-method-card {
  padding: 1.25rem;
  border-radius: 0.5rem;
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.04), transparent);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.about-method-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.about-method-abbr {
  font-family: ui-monospace, monospace;
  color: #22d3ee;
  font-size: 0.875rem;
  font-weight: 600;
}

.about-method-name {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.about-method-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  line-height: 1.625;
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

/* Image placeholders */
.about-image-placeholder {
  width: 100%;
  height: 12rem;
  border-radius: 0.5rem;
  margin: 2rem 0;
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
}

/* Credits */
.about-credits {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
  margin-bottom: 4rem;
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

/* Back button (matches GalaxyView) */
.back-button {
  position: fixed;
  top: 24px;
  right: 24px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  z-index: 20;
  backdrop-filter: blur(8px);
  transition: color 0.2s, background 0.2s;
}

.back-button:hover {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
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

  .about-methods-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-image-placeholder {
    height: 16rem;
  }
}
</style>
