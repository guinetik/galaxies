import { createRouter, createWebHistory } from 'vue-router'
import { DEFAULT_DESCRIPTION } from '@/config/seo'

const GA_MEASUREMENT_ID = 'G-CZHW5P8EXH'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: 'Galaxies — Journey through billions of light-years',
        description: DEFAULT_DESCRIPTION,
      },
    },
    {
      path: '/g/:pgc',
      name: 'galaxy',
      component: () => import('@/views/GalaxyView.vue'),
      meta: {
        title: 'Galaxy | Galaxies',
        description: 'Explore a galaxy from the Cosmicflows-4 catalog. View 3D morphology, distance, and physical properties.',
      },
    },
    {
      path: '/g/:pgc/photo',
      name: 'galaxyPhoto',
      component: () => import('@/views/GalaxyPhotoView.vue'),
      meta: {
        title: 'Galaxy Photo | Galaxies',
        description: 'True-color astronomical photo of a galaxy from the NASA Sloan Atlas.',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: {
        title: 'About | Galaxies',
        description: 'Tens of thousands of galaxies. Measured distances. One celestial sphere. Learn about the data, measurements, and procedural galaxy rendering.',
      },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/CosmicMapView.vue'),
      meta: {
        title: 'Cosmic Map | Galaxies',
        description: 'Galaxy groups and individual galaxies plotted in supergalactic coordinates — a three-dimensional atlas of the local universe.',
      },
    },
    {
      path: '/cosmography',
      name: 'cosmography',
      component: () => import('@/views/CosmographyView.vue'),
      meta: {
        title: 'Cosmography | Galaxies',
        description: 'How we measure the universe — the distance ladder, Cepheids, Tully-Fisher, supernovae, and the science behind cosmic distances.',
      },
    },
    {
      path: '/spacetime',
      name: 'spacetime',
      component: () => import('@/views/SpacetimeView.vue'),
      meta: {
        title: 'Spacetime Fabric | Galaxies',
        description: 'Gravity warps the fabric of spacetime. Where galaxies cluster, the grid sinks into deep wells — revealing the invisible architecture of mass.',
      },
    },
    {
      path: '/local-group',
      name: 'localGroup',
      component: () => import('@/views/LocalGroupView.vue'),
      meta: {
        title: 'Local Group | Galaxies',
        description: 'Galaxy groups within 100 megaparsecs plotted inside a cylinder aligned with the supergalactic plane — a 3D atlas of the local universe.',
      },
    },
    {
      path: '/tour',
      name: 'tour',
      component: () => import('@/views/TourView.vue'),
      meta: {
        title: 'Galaxy Tour | Galaxies',
        description: 'Explore iconic galaxies by morphology — spirals, ellipticals, barred spirals, lenticulars, and irregulars.',
      },
    },
  ],
})

/** Track page views in Google Analytics on SPA route changes (production only) */
router.afterEach((to) => {
  if (!import.meta.env.PROD) return
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag === 'function') {
    gtag('config', GA_MEASUREMENT_ID, { page_path: to.fullPath })
  }
})
