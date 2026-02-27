import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US.json'
import ptBR from './locales/pt-BR.json'

function detectLocale(): string {
  const stored = localStorage.getItem('locale')
  if (stored) return stored
  const nav = navigator.language
  if (nav.startsWith('pt')) return 'pt-BR'
  return 'en-US'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'pt-BR': ptBR,
  },
})
