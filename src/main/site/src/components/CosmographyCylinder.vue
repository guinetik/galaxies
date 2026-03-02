<template>
  <div class="cylinder-wrap">
    <canvas ref="canvasRef" class="cylinder-canvas" />
    <div v-if="loading" class="cylinder-loading">{{ t('pages.cosmography.cylinder.loading') }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGalaxyData } from '@/composables/useGalaxyData'
import { CylinderScene } from '@/three/cosmography/CylinderScene'

const { t } = useI18n()
const { ready, getAllGroups } = useGalaxyData()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)

let scene: CylinderScene | null = null

onMounted(async () => {
  await ready
  if (!canvasRef.value) return

  scene = new CylinderScene(canvasRef.value)
  scene.loadGroups(getAllGroups())
  scene.start()
  loading.value = false
})

onUnmounted(() => {
  scene?.dispose()
  scene = null
})
</script>

<style scoped>
.cylinder-wrap {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.cylinder-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.cylinder-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

@media (max-width: 767px) {
  .cylinder-wrap {
    height: 350px;
  }
}
</style>
