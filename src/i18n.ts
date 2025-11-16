import type { App } from 'vue'
import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'
import englishTranslation from '@/assets/locales/en-locale'

const defaultLanguage = localStorage.getItem('i18nextLng') || 'en'

i18next.use(LanguageDetector).init({
  debug: true,
  lng: defaultLanguage,
  fallbackLng: 'en',
  resources: {
    en: {
      translation: englishTranslation,
    },
  },
})

export default i18next

export function setupI18n(app: App) {
  app.use(I18NextVue, { i18next })
  return app
}
