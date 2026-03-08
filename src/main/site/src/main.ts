import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import './assets/main.css'

/** Initialize Google Analytics only in production */
if (import.meta.env.PROD) {
  const GA_ID = 'G-CZHW5P8EXH'
  ;(window as Window & { dataLayer?: unknown[] }).dataLayer =
    (window as Window & { dataLayer?: unknown[] }).dataLayer ?? []
  const gtag = (...args: unknown[]) =>
    ((window as Window & { dataLayer?: unknown[] }).dataLayer ?? []).push(args)
  ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

const app = createApp(App)
app.use(createHead())
app.use(router)
app.use(i18n)
app.mount('#app')
