import { ref } from 'vue'
import { DEFAULT_LOCATION } from '@/three/constants'

/** Singleton refs shared across app for persistent header state */
const currentLocation = ref(DEFAULT_LOCATION)
const locationSetter = ref<((name: string) => void) | null>(null)

/**
 * Shared state for the persistent app header.
 * Used by App.vue (AppHeader) and HomeView (to supply location).
 */
export function useAppHeader() {
  function setLocation(name: string) {
    currentLocation.value = name
    locationSetter.value?.(name)
  }

  return { currentLocation, locationSetter, setLocation }
}
