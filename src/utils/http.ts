/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance } from 'axios'
import router from '@/router'

export class Http {
  private axiosInstance: AxiosInstance
  private sessionStore: any = null

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({ baseURL })
    this.setupInterceptors()
  }

  /**
   * Set the auth store reference for interceptors
   */
  setSessionStore(sessionStore: any) {
    this.sessionStore = sessionStore
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use((config: any) => {
      // Use auth store if available
      if (this.sessionStore && this.sessionStore.accessToken) {
        config.headers['Authorization'] = this.sessionStore.authorizationHeader
      }
      return config
    })

    this.axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          // Use auth store if available
          if (this.sessionStore) {
            this.sessionStore.clearSession()
            router.push('/auth/')
          }
        }
        return Promise.reject(error)
      },
    )
  }

  public getInstance() {
    return this.axiosInstance
  }
}
