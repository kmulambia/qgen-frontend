import type {
  ILayout,
  ILayoutLogoUploadResponse,
  IRequestBaseParams,
} from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * Layout API Service
 * Handles all layout operations including CRUD, logo management, and default layout
 */
export class LayoutApiService extends BaseApiService<ILayout, IRequestBaseParams> {
  protected readonly endpoint = '/layouts'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Upload or update logo for a layout
   */
  async uploadLogo(layoutId: string, file: File): Promise<ILayoutLogoUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.httpClient.post<ILayoutLogoUploadResponse>(
      `${this.endpoint}/${layoutId}/logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  }

  /**
   * Remove logo from a layout
   */
  async removeLogo(layoutId: string): Promise<{ message: string; layout_id: string }> {
    const response = await this.httpClient.delete<{ message: string; layout_id: string }>(
      `${this.endpoint}/${layoutId}/logo`
    )

    return response.data
  }

  /**
   * Set a layout as the default
   */
  async setDefault(layoutId: string): Promise<ILayout> {
    const response = await this.httpClient.post<ILayout>(
      `${this.endpoint}/${layoutId}/set-default`
    )

    return response.data
  }

  /**
   * Get the current default layout
   */
  async getDefault(): Promise<ILayout> {
    const response = await this.httpClient.get<ILayout>(
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
