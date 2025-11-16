import type {
  IWorkspace,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * Workspace API Service
 * Handles all workspace operations including CRUD and workspace management
 */
export class WorkspaceApiService extends BaseApiService<IWorkspace, IRequestBaseParams> {
  protected readonly endpoint = '/workspaces'

  constructor(httpClient: Http) {
    super(httpClient)
  }


  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'WorkspaceApiService',
      description: 'API service for workspace management and operations',
      endpoint: this.endpoint,
    }
  }
}
