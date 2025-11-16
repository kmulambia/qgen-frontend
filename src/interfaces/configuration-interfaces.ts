export interface IConfiguration {
  id?: string
  name: string
  version: string
  secret: string
  environment: 'development' | 'production'
  support_email?: string
  support_phone?: string
  terms_of_service?: string
  developer: {
    name?: string
    website?: string
    github?: string
    email?: string
    phone?: string
    address?: string
  }
  privacy_policy?: string
}
