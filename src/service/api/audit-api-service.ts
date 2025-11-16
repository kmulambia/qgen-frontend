import type {
  IAudit,
  IRequestBaseParams,
  IUserSecuritySummary,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'
import { createApiError } from '@/utils/errors'
import type { AxiosResponse } from 'axios'

/**
 * Audit API Service
 * Handles all audit log operations (read-only)
 */
export class AuditApiService extends BaseApiService<IAudit, IRequestBaseParams> {
  protected readonly endpoint = '/audits'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Get user security summary
   * Optimized endpoint that fetches all security data in a single request
   * @param userId - The user ID to fetch security summary for
   * @returns Promise<IUserSecuritySummary> - Security summary data
   */
  async getUserSecuritySummary(userId: string): Promise<IUserSecuritySummary> {
    try {
      const response: AxiosResponse<IUserSecuritySummary> = await this.client
        .getInstance()
        .get(`${this.endpoint}/users/${userId}/security-summary`)
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'getUserSecuritySummary')
    }
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'AuditApiService',
      description: 'API service for audit log management (read-only)',
      endpoint: this.endpoint,
    }
  }
}


