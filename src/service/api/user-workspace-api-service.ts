import type {
  IUserWorkspace,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * User Workspace API Service
 * Handles all user workspace operations including CRUD and user workspace management
 */
export class UserWorkspaceApiService extends BaseApiService<IUserWorkspace, IRequestBaseParams> {
  protected readonly endpoint = '/user-workspaces'

  constructor(httpClient: Http) {
    super(httpClient)
  }


  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'UserWorkspaceApiService',
      description: 'API service for user workspace relationship management and operations',
      endpoint: this.endpoint,
    }
  }
}

