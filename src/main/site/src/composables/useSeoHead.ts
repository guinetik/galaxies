import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { SITE_URL, OG_IMAGE_URL } from '@/config/seo'

/**
 * Applies SEO meta tags from the current route.
 * Call once in the root layout (e.g. App.vue) to update title, description, and Open Graph on navigation.
 */
export function useSeoHead() {
  const route = useRoute()

  const head = computed(() => {
    const meta = route.meta as { title?: string; description?: string }
    const title = meta.title ?? 'Galaxies'
    const description = meta.description ?? 'An interactive visualization of tens of thousands of galaxies from Cosmicflows-4.'
    const path = route.path === '/' ? '' : route.path
    const url = `${SITE_URL}${path}`

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: OG_IMAGE_URL },
        { property: 'og:url', content: url },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: OG_IMAGE_URL },
      ],
      link: [{ rel: 'canonical', href: url }],
    }
  })

  useHead(head)
}
