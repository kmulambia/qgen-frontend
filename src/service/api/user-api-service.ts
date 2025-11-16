import type {
  IUser,
  IUserRegister,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'
import { createApiError } from '@/utils/errors'
import type { AxiosResponse } from 'axios'

/**
 * User API Service
 * Handles all user operations including CRUD, registration, and user management
 */
export class UserApiService extends BaseApiService<IUser, IRequestBaseParams> {
  protected readonly endpoint = '/users'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Register a new user
   * POST /api/v1/users/register
   */
  async register(registerData: IUserRegister): Promise<IUser> {
    try {
      const response: AxiosResponse<IUser> = await this.client
        .getInstance()
        .post(`${this.endpoint}/register`, registerData)
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'register')
    }
  }


  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'UserApiService',
      description: 'API service for user management, registration, and user operations',
      endpoint: this.endpoint,
    }
  }
}
