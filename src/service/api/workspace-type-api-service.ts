import type {
  IWorkspaceType,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * Workspace Type API Service
 * Handles all workspace type operations including CRUD and workspace type management
 */
export class WorkspaceTypeApiService extends BaseApiService<IWorkspaceType, IRequestBaseParams> {
  protected readonly endpoint = '/workspace-types'

  constructor(httpClient: Http) {
    super(httpClient)
  }


  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'WorkspaceTypeApiService',
      description: 'API service for workspace type management and operations',
      endpoint: this.endpoint,
    }
  }
}
