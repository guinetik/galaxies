<template>
  <header class="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm">
    <h1 class="text-lg font-light tracking-widest text-white/90 uppercase">
      {{ t('header.siteName') }}
    </h1>

    <div class="flex items-center gap-4">
      <span v-if="galaxyCount > 0" class="text-xs text-white/50">
        {{ t('app.loaded', { count: galaxyCount.toLocaleString() }) }}
      </span>

      <select
        :value="locale"
        class="bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer"
        @change="changeLocale(($event.target as HTMLSelectElement).value)"
      >
        <option value="en-US" class="bg-gray-900">EN</option>
        <option value="pt-BR" class="bg-gray-900">PT</option>
      </select>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  galaxyCount: number
}>()

const { t, locale } = useI18n()

function changeLocale(newLocale: string) {
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}
</script>
