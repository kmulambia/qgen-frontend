import type {
  IClient,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * Client API Service
 * Handles all client operations including CRUD and client management
 */
export class ClientApiService extends BaseApiService<IClient, IRequestBaseParams> {
  protected readonly endpoint = '/clients'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'ClientApiService',
      description: 'API service for client management and operations',
      endpoint: this.endpoint,
    }
  }
}
