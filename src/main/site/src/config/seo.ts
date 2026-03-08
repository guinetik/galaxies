/**
 * SEO configuration for meta tags and Open Graph.
 * SITE_URL should match your production domain (e.g. CNAME).
 */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string) || 'https://galaxies.guinetik.com'

export const SITE_NAME = 'Galaxies'

export const DEFAULT_DESCRIPTION =
  'Journey through billions of light-years. An interactive visualization of tens of thousands of galaxies from Cosmicflows-4 — measured distances, one celestial sphere.'

/** Standard Open Graph image size: 1200×630 px */
export const OG_IMAGE_PATH = '/og_image.png'

export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`
