import type {
  IRolePermission,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * Role Permission API Service
 * Handles all role-permission operations including CRUD and role-permission management
 */
export class RolePermissionApiService extends BaseApiService<IRolePermission, IRequestBaseParams> {
  protected readonly endpoint = '/role-permissions'

  constructor(httpClient: Http) {
    super(httpClient)
  }


  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'RolePermissionApiService',
      description: 'API service for role-permission relationship management and operations',
      endpoint: this.endpoint,
    }
  }
}
