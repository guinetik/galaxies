<template>
  <div class="w-full h-full">
    <GalaxyDetail v-if="galaxy" :galaxy="galaxy" />
    <GalaxyInfoCard v-if="galaxy" :galaxy="galaxy" />
    <router-link to="/" class="back-button">&larr; Back</router-link>
    <div v-if="!galaxy && !isLoading" class="not-found">Galaxy not found</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GalaxyDetail from '@/components/GalaxyDetail.vue'
import GalaxyInfoCard from '@/components/GalaxyInfoCard.vue'
import { useGalaxyData } from '@/composables/useGalaxyData'
import type { Galaxy } from '@/types/galaxy'

const route = useRoute()
const { ready, isLoading, getGalaxyByName } = useGalaxyData()
const galaxy = ref<Galaxy | null>(null)

onMounted(async () => {
  await ready
  const name = decodeURIComponent(route.params.name as string)
  galaxy.value = getGalaxyByName(name)
})
</script>

<style scoped>
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
