<template>
  <div class="w-full h-full">
    <GalaxyDetail v-if="galaxy" :galaxy="galaxy" :renderer="renderer" :key="renderer" @active-renderer="activeRenderer = $event" @ready="sceneReady = true" />
    <GalaxyInfoCard v-if="galaxy" :galaxy="galaxy" />
    <div class="top-header">
      <div class="top-buttons">
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
      </div>
      <div v-if="galaxy" class="galaxy-title">PGC {{ galaxy.pgc }}</div>
    </div>
    <GalaxyDataSidebar v-if="galaxy" :galaxy="galaxy" v-model:show="showData" />
    <LoadingOverlay :is-loading="!sceneReady" />
    <div v-if="!galaxy && !isLoading" class="not-found">Galaxy not found</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GalaxyDetail from '@/components/GalaxyDetail.vue'
import GalaxyInfoCard from '@/components/GalaxyInfoCard.vue'
import GalaxyDataSidebar from '@/components/GalaxyDataSidebar.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { Galaxy } from '@/types/galaxy'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { ready, isLoading, getGalaxyByPgc } = useGalaxyData()
const galaxy = ref<Galaxy | null>(null)
const showData = ref(false)
const supportsWebGPU = !!navigator.gpu
const renderer = ref<'webgpu' | 'webgl'>(supportsWebGPU ? 'webgpu' : 'webgl')
const activeRenderer = ref<'webgpu' | 'webgl'>('webgl')
const sceneReady = ref(false)
const hasNSAData = ref(false)

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
      const response = await fetch(`/galaxy-img/${galaxy.value.pgc}/metadata.json`, {
        method: 'HEAD',
      })
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
</style>
