<template>
  <div class="w-full h-full">
    <GalaxyDetail v-if="galaxy" :galaxy="galaxy" />
    <GalaxyInfoCard v-if="galaxy" :galaxy="galaxy" />
    <div class="top-header">
      <div class="top-buttons">
        <button class="data-button" @click="showData = !showData">{{ t('pages.galaxy.dataButton') }}</button>
        <router-link to="/" class="back-button">&larr; Back</router-link>
      </div>
      <div v-if="galaxy" class="galaxy-title">PGC {{ galaxy.pgc }}</div>
    </div>
    <GalaxyDataSidebar v-if="galaxy" :galaxy="galaxy" v-model:show="showData" />
    <div v-if="!galaxy && !isLoading" class="not-found">Galaxy not found</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GalaxyDetail from '@/components/GalaxyDetail.vue'
import GalaxyInfoCard from '@/components/GalaxyInfoCard.vue'
import GalaxyDataSidebar from '@/components/GalaxyDataSidebar.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { Galaxy } from '@/types/galaxy'

const { t } = useI18n()
const route = useRoute()
const { ready, isLoading, getGalaxyByPgc } = useGalaxyData()
const galaxy = ref<Galaxy | null>(null)
const showData = ref(false)

onMounted(async () => {
  await ready
  galaxy.value = getGalaxyByPgc(Number(route.params.pgc))
})
</script>

<style scoped>
.top-header {
  position: fixed;
  top: 24px;
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

.back-button,
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

.back-button:hover,
.data-button:hover {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
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
