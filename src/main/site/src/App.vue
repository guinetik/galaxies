<template>
  <AppHeader
    :current-location="currentLocation"
    @update:location="setLocation"
  />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useAppHeader } from '@/composables/useAppHeader'
import { useSeoHead } from '@/composables/useSeoHead'

const { currentLocation, setLocation } = useAppHeader()
useSeoHead()
</script>
