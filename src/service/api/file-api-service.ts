import { BaseApiService } from '@/service/api/base-api-service'
import type { IFile, IRequestBaseParams } from '@/interfaces'
import type { Http } from '@/utils/http'

/**
 * File API Service
 * Handles all file-related API operations
 */
export class FileApiService extends BaseApiService<IFile, IRequestBaseParams> {
  protected readonly endpoint = '/files'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Download a file
   */
  async download(id: string): Promise<Blob> {
    try {
      const response = await this.client.getInstance().get(`${this.endpoint}/${id}/download`, {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Upload files
   */
  async upload(
    files: File[],
    onProgress?: (percentage: number) => void
  ): Promise<IFile[]> {
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await this.client.getInstance().post(`${this.endpoint}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = (progressEvent.loaded / progressEvent.total) * 100
            onProgress(percentage)
          }
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Update file metadata
   */
  async updateMetadata(id: string, metadata: Partial<IFile>): Promise<IFile> {
    try {
      const response = await this.client.getInstance().patch(
        `${this.endpoint}/${id}/metadata`,
        metadata
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
}
