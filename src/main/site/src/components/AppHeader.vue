<template>
  <header class="fixed top-0 left-0 right-0 z-20 flex items-center px-4 py-2 bg-black/50 backdrop-blur-sm">
    <div class="hidden md:flex flex-1 justify-start">
      <router-link to="/" class="text-lg font-light tracking-widest text-white/90 uppercase hover:text-white transition-colors">
        {{ t('header.siteName') }}
      </router-link>
    </div>
    <router-link to="/" class="md:hidden text-lg font-light tracking-widest text-white/90 uppercase hover:text-white transition-colors shrink-0">
      {{ t('header.siteName') }}
    </router-link>

    <!-- Desktop nav (centered) -->
    <nav class="hidden md:flex items-center gap-4 flex-shrink-0">
      <router-link to="/about" class="text-xs text-white/50 hover:text-white/80 transition-colors">
        {{ t('nav.about') }}
      </router-link>
      <router-link to="/tour" class="text-xs text-white/50 hover:text-white/80 transition-colors">
        {{ t('nav.tour') }}
      </router-link>
      <router-link to="/cosmography" class="text-xs text-white/50 hover:text-white/80 transition-colors">
        {{ t('nav.cosmography') }}
      </router-link>
      <router-link to="/map" class="text-xs text-white/50 hover:text-white/80 transition-colors">
        {{ t('nav.map') }}
      </router-link>
      <router-link to="/spacetime" class="text-xs text-white/50 hover:text-white/80 transition-colors">
        {{ t('nav.spacetime') }}
      </router-link>
      <router-link to="/local-group" class="text-xs text-white/50 hover:text-white/80 transition-colors">
        {{ t('nav.localGroup') }}
      </router-link>
    </nav>

    <!-- Desktop tools (right) -->
    <div class="hidden md:flex flex-1 items-center gap-4 justify-end">
      <select
        v-if="isHomePage"
        :value="currentLocation"
        class="bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer"
        @change="$emit('update:location', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="name in locationNames" :key="name" :value="name" class="bg-gray-900">
          {{ name }}
        </option>
      </select>
      <select
        :value="locale"
        class="bg-white/10 text-white/80 text-xs rounded px-2 py-1 border border-white/20 cursor-pointer"
        @change="changeLocale(($event.target as HTMLSelectElement).value)"
      >
        <option value="en-US" class="bg-gray-900">EN</option>
        <option value="pt-BR" class="bg-gray-900">PT</option>
      </select>
    </div>

    <!-- Mobile: hamburger + dropdown (ml-auto pushes to right edge) -->
    <div class="md:hidden flex items-center gap-2 ml-auto">
      <button
        type="button"
        class="hamburger p-2 -mr-2 text-white/80 hover:text-white transition-colors"
        :class="{ 'is-open': menuOpen }"
        :aria-expanded="menuOpen"
        aria-label="Toggle menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="hamburger-bar" />
        <span class="hamburger-bar" />
        <span class="hamburger-bar" />
      </button>
    </div>
  </header>

  <!-- Mobile dropdown overlay -->
  <Transition name="menu">
    <div
      v-show="menuOpen"
      class="mobile-menu-overlay md:hidden"
      @click="menuOpen = false"
    >
      <nav class="mobile-menu" @click.stop>
        <router-link to="/" class="mobile-link" @click="menuOpen = false">
          {{ t('nav.home') }}
        </router-link>
        <router-link to="/tour" class="mobile-link" @click="menuOpen = false">
          {{ t('nav.tour') }}
        </router-link>
        <router-link to="/cosmography" class="mobile-link" @click="menuOpen = false">
          {{ t('nav.cosmography') }}
        </router-link>
        <router-link to="/about" class="mobile-link" @click="menuOpen = false">
          {{ t('nav.about') }}
        </router-link>
        <router-link to="/map" class="mobile-link" @click="menuOpen = false">
          {{ t('nav.map') }}
        </router-link>
        <router-link to="/spacetime" class="mobile-link" @click="menuOpen = false">
          {{ t('nav.spacetime') }}
        </router-link>
        <router-link to="/local-group" class="mobile-link" @click="menuOpen = false">
          {{ t('nav.localGroup') }}
        </router-link>

        <div class="mobile-menu-divider" />

        <div v-if="isHomePage" class="mobile-menu-controls">
          <label class="mobile-label">{{ t('header.location') }}</label>
          <select
            :value="currentLocation"
            class="mobile-select"
            @change="$emit('update:location', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="name in locationNames" :key="name" :value="name" class="bg-gray-900">
              {{ name }}
            </option>
          </select>
        </div>
        <div class="mobile-menu-controls">
          <label class="mobile-label">{{ t('header.language') }}</label>
          <select
            :value="locale"
            class="mobile-select"
            @change="changeLocale(($event.target as HTMLSelectElement).value)"
          >
            <option value="en-US" class="bg-gray-900">EN</option>
            <option value="pt-BR" class="bg-gray-900">PT</option>
          </select>
        </div>
      </nav>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LOCATIONS } from '@/three/constants'

const menuOpen = ref(false)
const route = useRoute()
const isHomePage = computed(() => route.path === '/')

defineProps<{
  currentLocation: string
}>()

defineEmits<{
  'update:location': [name: string]
}>()

const { t, locale } = useI18n()
const locationNames = Object.keys(LOCATIONS)

function changeLocale(newLocale: string) {
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}
</script>

<style scoped>
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 28px;
  height: 28px;
}

.hamburger-bar {
  display: block;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
  transition: transform 0.2s, opacity 0.2s;
}

.hamburger.is-open .hamburger-bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.is-open .hamburger-bar:nth-child(2) {
  opacity: 0;
}

.hamburger.is-open .hamburger-bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  top: var(--header-height, 52px);
  z-index: 25; /* above filter panel (z-20) */
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.mobile-menu {
  background: rgba(0, 0, 0, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-link {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  padding: 10px 0;
  text-decoration: none;
  transition: color 0.2s;
}

.mobile-link:hover {
  color: #fff;
}

.mobile-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 8px 0;
}

.mobile-menu-controls {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.mobile-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mobile-select {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
