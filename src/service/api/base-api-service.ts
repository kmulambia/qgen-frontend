import type {
  IBaseEntity,
  IRequestBaseParams,
  IRequestFilterCondition,
  IRequestQueryParams,
  IResponsePaginatedResult,
} from '@/interfaces'
import { BaseService } from '@/service/base-service'
import { Http } from '@/utils/http'
import { createApiError, isNotFoundError, isMethodNotAllowedError } from '@/utils/errors'
import type { AxiosResponse } from 'axios'

/**
 * Base API service class that implements HTTP-based CRUD operations
 * @template T - The entity type that extends IBaseEntity
 * @template R - The request params type that extends IRequestBaseParams
 */
export abstract class BaseApiService<
  T extends Partial<IBaseEntity> = Partial<IBaseEntity>,
  R extends IRequestBaseParams = IRequestBaseParams,
> extends BaseService<Http, T, R> {
  /**
   * The API endpoint for this service (e.g., '/users', '/products')
   * Must be implemented by child classes
   */
  protected abstract readonly endpoint: string

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Get all items with optional filtering and pagination
   */
  async getMany(
    params?: IRequestQueryParams<R>,
    filters?: IRequestFilterCondition[],
    include_deleted?: boolean,
  ): Promise<IResponsePaginatedResult<T>> {
    try {
      const queryParams = this.buildQueryParams(params, filters, include_deleted)
      const response: AxiosResponse<IResponsePaginatedResult<T>> = await this.client
        .getInstance()
        .get(this.endpoint, {
          params: queryParams,
        })
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'getMany')
    }
  }

  /**
   * Get a single item by ID
   */
  async getOne(params: { id: string }): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await this.client
        .getInstance()
        .get(`${this.endpoint}/${params.id}`)
      return response.data
    } catch (error) {
      if (isNotFoundError(error)) {
        return null
      }
      throw createApiError(error, undefined, 'getOne')
    }
  }

  /**
   * Create a new item
   */
  async create(params: { data: Partial<T> }): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client
        .getInstance()
        .post(this.endpoint, params.data)
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'create')
    }
  }

  /**
   * Update an existing item
   */
  async update(params: { id: string; data: Partial<T> }): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client
        .getInstance()
        .patch(`${this.endpoint}/${params.id}`, params.data)
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'update')
    }
  }

  /**
   * Delete an item (soft delete by default)
   */
  async delete(params: { id: string; hard_delete?: boolean }): Promise<boolean> {
    try {
      const queryParams = params.hard_delete ? { hard_delete: true } : {}
      await this.client
        .getInstance()
        .delete(`${this.endpoint}/${params.id}`, { params: queryParams })
      return true
    } catch (error) {
      throw createApiError(error, undefined, 'delete')
    }
  }

  /**
   * Check if an item exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      await this.client.getInstance().head(`${this.endpoint}/${id}`)
      return true
    } catch (error) {
      if (isNotFoundError(error)) {
        return false
      }
      throw createApiError(error, undefined, 'exists')
    }
  }

  /**
   * Query items with filters using POST endpoint
   */
  async query(
    params?: IRequestQueryParams<R>,
    filters?: IRequestFilterCondition[],
    include_deleted?: boolean,
  ): Promise<IResponsePaginatedResult<T>> {
    try {
      const queryParams = this.buildQueryParams(params, filters, include_deleted)
      const response: AxiosResponse<IResponsePaginatedResult<T>> = await this.client
        .getInstance()
        .post(`${this.endpoint}/query`, filters || [], {
          params: queryParams,
        })
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'query')
    }
  }

  /**
   * Count total items with optional filtering using POST endpoint
   */
  async count(
    params?: IRequestQueryParams<R>,
    filters?: IRequestFilterCondition[],
    include_deleted?: boolean,
  ): Promise<number> {
    try {
      const queryParams = this.buildQueryParams(params, filters, include_deleted)
      const response: AxiosResponse<{ count: number }> = await this.client
        .getInstance()
        .post(`${this.endpoint}/count`, filters || [], {
          params: queryParams,
        })
      return response.data.count
    } catch (error) {
      throw createApiError(error, undefined, 'count')
    }
  }

  /**
   * Recover a soft-deleted item
   */
  async recover(params: { id: string }): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client
        .getInstance()
        .patch(`${this.endpoint}/${params.id}/recover`)
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'recover')
    }
  }

  /**
   * Get items by multiple IDs
   */
  async getByIds(ids: string[]): Promise<T[]> {
    try {
      const response: AxiosResponse<T[]> = await this.client
        .getInstance()
        .post(`${this.endpoint}/bulk`, { ids })
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'getByIds')
    }
  }

  /**
   * Search items with full-text search
   */
  async search(
    query: string,
    params?: IRequestQueryParams<R>,
    filters?: IRequestFilterCondition[],
  ): Promise<IResponsePaginatedResult<T>> {
    try {
      const searchParams = { ...params, search: query } as IRequestQueryParams<R>
      const queryParams = this.buildQueryParams(searchParams, filters)
      const response: AxiosResponse<IResponsePaginatedResult<T>> = await this.client
        .getInstance()
        .get(`${this.endpoint}/search`, { params: queryParams })
      return response.data
    } catch (error) {
      throw createApiError(error, undefined, 'search')
    }
  }

  /**
   * Bulk create multiple items
   */
  async bulkCreate(items: { data: Partial<T> }[]): Promise<T[]> {
    try {
      const data = items.map((item) => item.data)
      const response: AxiosResponse<T[]> = await this.client
        .getInstance()
        .post(`${this.endpoint}/bulk-create`, {
          items: data,
        })
      return response.data
    } catch (error) {
      // Fallback to parent implementation if bulk endpoint not supported
      if (isNotFoundError(error) || isMethodNotAllowedError(error)) {
        return super.bulkCreate(items)
      }
      throw createApiError(error, undefined, 'bulkCreate')
    }
  }

  /**
   * Bulk update multiple items
   */
  async bulkUpdate(items: { id: string; data: Partial<T> }[]): Promise<T[]> {
    try {
      const response: AxiosResponse<T[]> = await this.client
        .getInstance()
        .patch(`${this.endpoint}/bulk-update`, {
          items,
        })
      return response.data
    } catch (error) {
      // Fallback to parent implementation if bulk endpoint not supported
      if (isNotFoundError(error) || isMethodNotAllowedError(error)) {
        return super.bulkUpdate(items)
      }
      throw createApiError(error, undefined, 'bulkUpdate')
    }
  }

  /**
   * Bulk delete multiple items
   */
  async bulkDelete(ids: string[], hard_delete?: boolean): Promise<boolean> {
    try {
      await this.client.getInstance().delete(`${this.endpoint}/bulk-delete`, {
        data: { ids, hard_delete },
      })
      return true
    } catch (error) {
      // Fallback to parent implementation if bulk endpoint not supported
      if (isNotFoundError(error) || isMethodNotAllowedError(error)) {
        return super.bulkDelete(ids, hard_delete)
      }
      throw createApiError(error, undefined, 'bulkDelete')
    }
  }

  /**
   * Validate if the service is properly configured
   */
  async validate(): Promise<boolean> {
    try {
      // Try to access the endpoint with a HEAD request
      await this.client.getInstance().head(this.endpoint)
      return true
    } catch {
      return false
    }
  }

  /**
   * Build query parameters for API requests
   */
  protected buildQueryParams(
    params?: IRequestQueryParams<R>,
    filters?: IRequestFilterCondition[],
    include_deleted?: boolean,
  ): Record<string, unknown> {
    const queryParams: Record<string, unknown> = {}

    if (params) {
      // Add pagination
      if (params.page !== undefined) queryParams.page = params.page
      if (params.page_size !== undefined) queryParams.page_size = params.page_size

      // Add sorting
      if (params.sort_by) queryParams.sort_by = params.sort_by
      if (params.sort_dir) queryParams.sort_dir = params.sort_dir

      // Add search
      if (params.search) queryParams.search = params.search

      // Add any additional filter properties from params
      Object.keys(params).forEach((key) => {
        if (!['page', 'page_size', 'sort_by', 'sort_dir', 'search'].includes(key)) {
          const value = (params as Record<string, unknown>)[key]
          if (value !== undefined && value !== null) {
            queryParams[key] = value
          }
        }
      })
    }

    // Add filters
    if (filters && filters.length > 0) {
      queryParams.filters = JSON.stringify(filters)
    }

    // Add include_deleted flag
    if (include_deleted !== undefined) {
      queryParams.include_deleted = include_deleted
    }

    return queryParams
  }

  /**
   * Get service metadata including endpoint information
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      ...super.getMetadata(),
      endpoint: this.endpoint,
      description: `API service for ${this.endpoint}`,
    }
  }
}
