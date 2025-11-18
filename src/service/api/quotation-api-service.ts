import type {
  IQuotation,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * Quotation API Service
 * Handles all quotation operations including CRUD and quotation management
 */
export class QuotationApiService extends BaseApiService<IQuotation, IRequestBaseParams> {
  protected readonly endpoint = '/quotations'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'QuotationApiService',
      description: 'API service for quotation management and operations',
      endpoint: this.endpoint,
    }
  }
}
