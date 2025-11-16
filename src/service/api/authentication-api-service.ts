import type {
  ILogin,
  ISelfRegister,
  IPasswordChange,
  IOTPRequest,
  IPasswordReset,
  ISession,
  ISessionUser
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'
import { createApiError } from '@/utils/errors'
import type { AxiosResponse } from 'axios'

/**
 * Authentication API Service
 * Handles all authentication operations including login, registration, password management, and OTP
 */
export class AuthenticationApiService extends BaseApiService {
  protected readonly endpoint = '/auth'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Self Register endpoint
   * POST /api/v1/auth/self-register
   */
  async selfRegister(registerData: ISelfRegister): Promise<ISessionUser> {
    try {
      const response: AxiosResponse<ISessionUser> = await this.client
        .getInstance()
        .post(`${this.endpoint}/self-register`, registerData)
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'selfRegister')
    }
  }

  /**
   * Change Password endpoint
   * POST /api/v1/auth/change-password
   * Requires authentication (Bearer token)
   */
  async changePassword(passwordData: IPasswordChange): Promise<void> {
    try {
      await this.client
        .getInstance()
        .post(`${this.endpoint}/change-password`, passwordData)
    } catch (error) {
      throw createApiError(error, undefined, 'changePassword')
    }
  }

  /**
   * Login endpoint
   * POST /api/v1/auth/login
   */
  async login(loginData: ILogin): Promise<ISession> {
    try {
      const response: AxiosResponse<ISession> = await this.client
        .getInstance()
        .post(`${this.endpoint}/login`, loginData)
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'login')
    }
  }

  /**
   * Request OTP endpoint
   * POST /api/v1/auth/request-otp
   */
  async requestOTP(otpData: IOTPRequest): Promise<void> {
    try {
      await this.client
        .getInstance()
        .post(`${this.endpoint}/request-otp`, otpData)
    } catch (error) {
      throw createApiError(error, undefined, 'requestOTP')
    }
  }

  /**
   * Reset Password endpoint
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(resetData: IPasswordReset): Promise<void> {
    try {
      await this.client
        .getInstance()
        .post(`${this.endpoint}/reset-password`, resetData)
    } catch (error) {
      throw createApiError(error, undefined, 'resetPassword')
    }
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'AuthenticationApiService',
      description: 'API service for user authentication, registration, and password management',
      endpoint: this.endpoint,
    }
  }
}
