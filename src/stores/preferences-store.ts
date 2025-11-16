import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import i18next from '@/i18n'

export type Theme = 'light' | 'dark' | 'auto'
export type Language = 'en' | 'es' | 'fr' | 'de' // Add more languages as needed

export interface PreferencesState {
  theme: Theme
  language: Language
  sidebarCollapsed: boolean
  notifications: boolean
}

/**
 * Preferences Store
 * Manages user preferences like theme, language, and UI settings
 * Uses localStorage for persistence across sessions
 */
export const usePreferencesStore = defineStore('preferences', () => {
  // State
  const theme = ref<Theme>('auto')
  const language = ref<Language>('en')
  const sidebarCollapsed = ref(false)
  const notifications = ref(true)

  // Getters
  const isDarkMode = ref(false)
  const isLightMode = ref(true)

  // Actions
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    applyTheme()
  }

  const setLanguage = (newLanguage: Language) => {
    language.value = newLanguage
    applyLanguage()
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  const setNotifications = (enabled: boolean) => {
    notifications.value = enabled
  }

  const toggleTheme = () => {
    if (theme.value === 'light') {
      setTheme('dark')
    } else if (theme.value === 'dark') {
      setTheme('auto')
    } else {
      setTheme('light')
    }
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // Theme application logic
  const applyTheme = () => {
    const html = document.documentElement

    if (theme.value === 'dark') {
      html.classList.add('dark')
      isDarkMode.value = true
      isLightMode.value = false
      localStorage.setItem('color-theme', 'dark')
    } else if (theme.value === 'light') {
      html.classList.remove('dark')
      isDarkMode.value = false
      isLightMode.value = true
      localStorage.setItem('color-theme', 'light')
    } else {
      // Auto mode - follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        html.classList.add('dark')
        isDarkMode.value = true
        isLightMode.value = false
      } else {
        html.classList.remove('dark')
        isDarkMode.value = false
        isLightMode.value = true
      }
      localStorage.setItem('color-theme', 'auto')
    }
  }

  // Language application logic
  const applyLanguage = () => {
    i18next.changeLanguage(language.value)
    document.documentElement.lang = language.value
    localStorage.setItem('i18nextLng', language.value)
  }

  // Initialize preferences from localStorage or system defaults
  const initializePreferences = () => {
    // Initialize theme
    const savedTheme = localStorage.getItem('color-theme') as Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      theme.value = savedTheme
    } else if (prefersDark) {
      theme.value = 'dark'
    } else {
      theme.value = 'light'
    }

    // Initialize language
    const savedLanguage = localStorage.getItem('i18nextLng') as Language
    if (savedLanguage && ['en', 'es', 'fr', 'de'].includes(savedLanguage)) {
      language.value = savedLanguage
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0] as Language
      if (['en', 'es', 'fr', 'de'].includes(browserLang)) {
        language.value = browserLang
      } else {
        language.value = 'en' // Default fallback
      }
    }

    // Initialize other preferences
    const savedSidebarState = localStorage.getItem('sidebar-collapsed')
    if (savedSidebarState !== null) {
      sidebarCollapsed.value = JSON.parse(savedSidebarState)
    }

    const savedNotifications = localStorage.getItem('notifications-enabled')
    if (savedNotifications !== null) {
      notifications.value = JSON.parse(savedNotifications)
    }

    // Apply the loaded preferences
    applyTheme()
    applyLanguage()
  }

  // Listen for system theme changes when in auto mode
  const setupSystemThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (theme.value === 'auto') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }

  // Watchers to persist changes
  watch(theme, () => {
    localStorage.setItem('color-theme', theme.value)
  })

  watch(language, () => {
    localStorage.setItem('i18nextLng', language.value)
  })

  watch(sidebarCollapsed, () => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed.value))
  })

  watch(notifications, () => {
    localStorage.setItem('notifications-enabled', JSON.stringify(notifications.value))
  })

  // Reset preferences to defaults
  const resetPreferences = () => {
    setTheme('auto')
    setLanguage('en')
    setSidebarCollapsed(false)
    setNotifications(true)

    // Clear localStorage
    localStorage.removeItem('color-theme')
    localStorage.removeItem('i18nextLng')
    localStorage.removeItem('sidebar-collapsed')
    localStorage.removeItem('notifications-enabled')
  }

  // Get current preferences as object
  const getCurrentPreferences = (): PreferencesState => ({
    theme: theme.value,
    language: language.value,
    sidebarCollapsed: sidebarCollapsed.value,
    notifications: notifications.value,
  })

  // Available options for UI
  const availableThemes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'auto', label: 'Auto', icon: 'computer-desktop' },
  ]

  const availableLanguages: { value: Language; label: string; flag: string }[] = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ]

  return {
    // State
    theme,
    language,
    sidebarCollapsed,
    notifications,

    // Computed
    isDarkMode,
    isLightMode,

    // Actions
    setTheme,
    setLanguage,
    setSidebarCollapsed,
    setNotifications,
    toggleTheme,
    toggleSidebar,
    initializePreferences,
    setupSystemThemeListener,
    resetPreferences,
    getCurrentPreferences,

    // Options for UI
    availableThemes,
    availableLanguages,
  }
}, {
  persist: {
    key: 'user-preferences',
    storage: localStorage,
    // Only persist specific fields
    // @ts-expect-error: 'paths' is not a standard property, but required by our persistence plugin
    paths: ['theme', 'language', 'sidebarCollapsed', 'notifications'],
  },
})
