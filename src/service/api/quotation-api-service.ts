import type {
  IQuotation,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'
import { createApiError } from '@/utils/errors'
import type { AxiosResponse } from 'axios'

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
   * Approve quotation and send to client
   * POST /api/v1/quotations/{id}/approve
   */
  async approve(quotationId: string, message?: string): Promise<IQuotation> {
    try {
      const response: AxiosResponse<IQuotation> = await this.client
        .getInstance()
        .post(`${this.endpoint}/${quotationId}/approve`, { message: message || undefined })
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'approve')
    }
  }

  /**
   * Resend quotation email to client
   * POST /api/v1/quotations/{id}/resend
   */
  async resend(quotationId: string, message?: string): Promise<IQuotation> {
    try {
      const response: AxiosResponse<IQuotation> = await this.client
        .getInstance()
        .post(`${this.endpoint}/${quotationId}/resend`, { message: message || undefined })
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'resend')
    }
  }

  /**
   * Get public quotation by token (no authentication required)
   * GET /api/v1/quotations/public/{token}
   */
  async getPublic(token: string): Promise<IQuotation> {
    try {
      // For public endpoints, use axios directly to bypass auth interceptors
      const instance = this.client.getInstance()
      const baseURL = instance.defaults.baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/'

      // Import axios directly for a clean request without auth
      const axiosModule = await import('axios')
      const response: AxiosResponse<IQuotation> = await axiosModule.default.get(
        `${baseURL.replace(/\/$/, '')}/quotations/public/${token}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'getPublic')
    }
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
