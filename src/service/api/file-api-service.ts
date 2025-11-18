import { BaseApiService } from '@/service/api/base-api-service'
import type { IFile, IRequestBaseParams } from '@/interfaces'
import type { Http } from '@/utils/http'
import { createApiError } from '@/utils/errors'
import type { AxiosResponse } from 'axios'

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
      const response: AxiosResponse<Blob> = await this.client
        .getInstance()
        .get(`${this.endpoint}/${id}/download`, {
          responseType: 'blob',
        })
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'download')
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

      const response: AxiosResponse<IFile[]> = await this.client
        .getInstance()
        .post(this.endpoint, formData, {
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentage = (progressEvent.loaded / progressEvent.total) * 100
              onProgress(percentage)
            }
          },
        })
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'upload')
    }
  }

  /**
   * Update file metadata
   */
  async updateMetadata(id: string, metadata: Partial<IFile>): Promise<IFile> {
    try {
      const response: AxiosResponse<IFile> = await this.client
        .getInstance()
        .patch(`${this.endpoint}/${id}/metadata`, metadata)
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'updateMetadata')
    }
  }

  /**
   * Delete a file (overrides base class to match expected signature)
   */
  async delete(params: { id: string; hard_delete?: boolean }): Promise<boolean> {
    try {
      const queryParams = params.hard_delete ? { hard_delete: true } : {}
      await this.client
        .getInstance()
        .delete(`${this.endpoint}/${params.id}`, {
          params: queryParams
        })
      return true
    } catch (error) {
      throw createApiError(error, undefined, 'delete')
    }
  }
}
