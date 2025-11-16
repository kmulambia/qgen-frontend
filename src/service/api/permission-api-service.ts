import type {
  IPermission,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'
import { createApiError } from '@/utils/errors'
import type { AxiosResponse } from 'axios'

/**
 * Permission API Service
 * Handles all permission operations including CRUD and permission management
 */
export class PermissionApiService extends BaseApiService<IPermission, IRequestBaseParams> {
  protected readonly endpoint = '/permissions'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Get all unique permission group names
   * @returns Promise<string[]> - Array of unique group names
   */
  async getAllGroups(): Promise<string[]> {
    try {
      const response: AxiosResponse<string[]> = await this.client
        .getInstance()
        .get(`${this.endpoint}/groups`)
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'getAllGroups')
    }
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'PermissionApiService',
      description: 'API service for permission management and operations',
      endpoint: this.endpoint,
    }
  }
}
