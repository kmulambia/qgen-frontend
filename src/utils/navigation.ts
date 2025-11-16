import config from '@/utils/configuration'
import router from '@/router'

export const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = config.developer.website || '/'
  }
}

export const navigateToError = (errorType: '403' | '404' | '500') => {
  router.push(`/${errorType}`)
}

export const navigateToAccessDenied = () => navigateToError('403')
export const navigateToNotFound = () => navigateToError('404')
export const navigateToServerError = () => navigateToError('500')
