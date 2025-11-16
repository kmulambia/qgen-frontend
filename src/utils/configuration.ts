import type { IConfiguration } from '@/interfaces'

function getConfig(defaults = {}) {
  const {
    VITE_APP_ID = 'App-ID',
    VITE_APP_NAME = 'App Name',
    VITE_APP_VERSION = '1.0.0',
    VITE_APP_SECRET = 'App-Secret',
    VITE_APP_DEVELOPER_NAME = 'Developer Name',
    VITE_APP_DEVELOPER_WEBSITE = 'https://developer.com',
    VITE_APP_DEVELOPER_GITHUB = 'https://github.com/developer',
    VITE_APP_DEVELOPER_EMAIL = 'info@developer.com',
    VITE_APP_DEVELOPER_PHONE = '+265 995 555 555',
    VITE_APP_DEVELOPER_ADDRESS = 'Lilongwe, Malawi',
    VITE_APP_PRIVACY_POLICY = 'https://developer.com/privacy-policy',
    VITE_APP_TERMS_OF_SERVICE = 'https://developer.com/terms-of-service',
    VITE_APP_SUPPORT_EMAIL = 'info@developer.com',
    VITE_APP_SUPPORT_PHONE = '+265 995 555 555',
  } = import.meta.env

  const config: IConfiguration = {
    id: VITE_APP_ID,
    name: VITE_APP_NAME,
    version: VITE_APP_VERSION,
    secret: VITE_APP_SECRET,
    developer: {
      name: VITE_APP_DEVELOPER_NAME,
      website: VITE_APP_DEVELOPER_WEBSITE,
      github: VITE_APP_DEVELOPER_GITHUB,
      email: VITE_APP_DEVELOPER_EMAIL,
      phone: VITE_APP_DEVELOPER_PHONE,
      address: VITE_APP_DEVELOPER_ADDRESS,
    },
    privacy_policy: VITE_APP_PRIVACY_POLICY,
    terms_of_service: VITE_APP_TERMS_OF_SERVICE,
    support_email: VITE_APP_SUPPORT_EMAIL,
    support_phone: VITE_APP_SUPPORT_PHONE,
    environment: import.meta.env.MODE as 'development' | 'production',
  }

  return { ...defaults, ...config }
}
const configuration = getConfig()
export default configuration
