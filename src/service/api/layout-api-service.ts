import type {
  ILayout,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * Layout API Service
 * Handles all layout operations including CRUD and default layout
 */
export class LayoutApiService extends BaseApiService<ILayout, IRequestBaseParams> {
  protected readonly endpoint = '/layouts'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Get the current default layout
   */
  async getDefault(): Promise<ILayout> {
    const response = await this.client.getInstance().get<ILayout>(
      `${this.endpoint}/default`
    )

    return response.data
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'LayoutApiService',
      description: 'API service for quotation layout template management',
      endpoint: this.endpoint,
    }
  }
}
