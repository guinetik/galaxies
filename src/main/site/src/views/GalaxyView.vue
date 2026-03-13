<template>
  <div class="w-full h-full">
    <GalaxyDetail v-if="galaxy" :galaxy="galaxy" :renderer="renderer" :key="renderer" @active-renderer="activeRenderer = $event" @ready="sceneReady = true" />
    <div v-if="galaxy" class="info-cards-column">
      <GalaxyInfoCard :galaxy="galaxy" />
      <KnownStarsCard :galaxy="galaxy" />
    </div>
    <div class="top-header">
      <div class="top-buttons">
        <button class="info-btn" @click="showInfo = !showInfo" aria-label="Info">
          i
        </button>
        <button v-if="supportsWebGPU" class="data-button renderer-toggle" @click="toggleRenderer">
          {{ activeRenderer === 'webgpu' ? 'WebGPU' : 'WebGL' }}
        </button>
        <button class="data-button" @click="showData = !showData">{{ t('pages.galaxy.dataButton') }}</button>
        <button
          v-if="hasNSAData && galaxy"
          class="data-button"
          @click="router.push(`/g/${galaxy.pgc}/photo`)"
        >
          {{ t('pages.galaxy.photoButton') }}
        </button>
        <button
          v-if="galaxy"
          class="data-button"
          @click="router.push(`/g/${galaxy.pgc}/mosaic`)"
        >
          Mosaic
        </button>
      </div>
      <div v-if="galaxy" class="galaxy-title">PGC {{ galaxy.pgc }}</div>
    </div>
    <GalaxyDataSidebar v-if="galaxy" :galaxy="galaxy" v-model:show="showData" />
    <Transition name="sidebar">
      <div v-if="showInfo" class="info-sidebar">
        <div class="sidebar-content">
          <button class="sidebar-close" @click="showInfo = false" aria-label="Close">×</button>
          <h2 class="sidebar-title">{{ t('pages.galaxy.info.title') }}</h2>
          <div class="sidebar-section">
            <p>{{ t(`pages.galaxy.info.${galaxyInfoKey}`) }}</p>
          </div>
        </div>
      </div>
    </Transition>
    <LoadingOverlay :is-loading="!sceneReady" />
    <div v-if="!galaxy && !isLoading" class="not-found">Galaxy not found</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GalaxyDetail from '@/components/GalaxyDetail.vue'
import GalaxyInfoCard from '@/components/GalaxyInfoCard.vue'
import KnownStarsCard from '@/components/KnownStarsCard.vue'
import GalaxyDataSidebar from '@/components/GalaxyDataSidebar.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { Galaxy } from '@/types/galaxy'
import { GALAXY_IMG_BASE_URL } from '@/three/constants'
import { getGalaxyViewInfoKey } from './galaxyViewInfo'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { ready, isLoading, getGalaxyByPgc } = useGalaxyData()
const galaxy = ref<Galaxy | null>(null)
const showData = ref(false)
const showInfo = ref(false)
const supportsWebGPU = !!navigator.gpu
const renderer = ref<'webgpu' | 'webgl'>(supportsWebGPU ? 'webgpu' : 'webgl')
const activeRenderer = ref<'webgpu' | 'webgl'>('webgl')
const sceneReady = ref(false)
const hasNSAData = ref(false)
const galaxyInfoKey = computed(() => getGalaxyViewInfoKey(hasNSAData.value))

function toggleRenderer() {
  sceneReady.value = false
  renderer.value = renderer.value === 'webgpu' ? 'webgl' : 'webgpu'
}

onMounted(async () => {
  await ready
  galaxy.value = getGalaxyByPgc(Number(route.params.pgc))

  // Check if NSA data exists
  if (galaxy.value) {
    try {
      const response = await fetch(`${GALAXY_IMG_BASE_URL}/${galaxy.value.pgc}/metadata.json`)
      hasNSAData.value = response.ok
    } catch {
      hasNSAData.value = false
    }
  }
})
</script>

<style scoped>
.top-header {
  position: fixed;
  top: var(--header-height);
  left: 24px;
  right: 24px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.top-buttons {
  display: flex;
  gap: 8px;
}

.data-button {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  backdrop-filter: blur(8px);
  transition: color 0.2s, background 0.2s;
  cursor: pointer;
}

.data-button:hover {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
}

.info-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.info-btn:hover {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.28);
}

.renderer-toggle {
  font-family: monospace;
  font-size: 12px;
  letter-spacing: 0.05em;
}

.galaxy-title {
  width: 100%;
  text-align: center;
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  z-index: 20;
  pointer-events: none;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}

.info-cards-column {
  position: fixed;
  top: calc(var(--header-height) + 12px);
  left: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: fit-content;
  max-width: 260px;
  z-index: 10;
}

@media (max-width: 767px) {
  .info-cards-column {
    top: auto;
    bottom: 24px;
    max-height: 45vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.not-found {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
  background: #000;
}

.info-sidebar {
  position: fixed;
  top: calc(var(--header-height) + 56px);
  right: 24px;
  width: min(360px, calc(100vw - 48px));
  z-index: 30;
}

.sidebar-content {
  position: relative;
  padding: 20px;
  border-radius: 16px;
  background: rgba(8, 8, 12, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
}

.sidebar-close {
  position: absolute;
  top: 10px;
  right: 12px;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.sidebar-title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
}

.sidebar-section {
  color: rgba(255, 255, 255, 0.76);
  font-size: 14px;
  line-height: 1.6;
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
