<template>
  <div class="spacetime-page">
    <router-link to="/" class="back-button">&larr; {{ t('pages.spacetime.backToSky') }}</router-link>
    <div v-if="loading" class="loading-overlay">
      <p>{{ t('pages.spacetime.loading') }}</p>
    </div>
    <canvas ref="canvasRef" class="spacetime-canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)
</script>

<style scoped>
.spacetime-page {
  position: fixed;
  inset: 0;
  background: #000;
}

.spacetime-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

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

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  z-index: 15;
}
</style>
