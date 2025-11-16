import type {
  IRole,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * Role API Service
 * Handles all role operations including CRUD and role management
 */
export class RoleApiService extends BaseApiService<IRole, IRequestBaseParams> {
  protected readonly endpoint = '/roles'

  constructor(httpClient: Http) {
    super(httpClient)
  }


  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'RoleApiService',
      description: 'API service for role management and operations',
      endpoint: this.endpoint,
    }
  }
}
