<template>
  <transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div class="text-center">
        <div class="mb-4 text-4xl animate-pulse">&#10026;</div>
        <p class="text-sm text-white/70 tracking-wide">{{ t('app.loading') }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  isLoading: boolean
}>()

const { t } = useI18n()
</script>

<style scoped>
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>
