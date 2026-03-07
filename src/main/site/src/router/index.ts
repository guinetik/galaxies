import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/g/:pgc',
      name: 'galaxy',
      component: () => import('@/views/GalaxyView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/CosmicMapView.vue'),
    },
    {
      path: '/cosmography',
      name: 'cosmography',
      component: () => import('@/views/CosmographyView.vue'),
    },
    {
      path: '/spacetime',
      name: 'spacetime',
      component: () => import('@/views/SpacetimeView.vue'),
    },
    {
      path: '/local-group',
      name: 'localGroup',
      component: () => import('@/views/LocalGroupView.vue'),
    },
    {
      path: '/tour',
      name: 'tour',
      component: () => import('@/views/TourView.vue'),
    },
  ],
})
