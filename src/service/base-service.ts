/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IBaseEntity, IRequestBaseParams, IRequestFilterCondition, IRequestQueryParams, IResponsePaginatedResult } from '@/interfaces'


/**
 * Base service class that provides a common interface for all service implementations.
 * @template C - The client instance type (e.g., SupabaseClient, AxiosInstance)
 * @template T - The entity type that extends IBaseEntity
 * @template R - The request type that extends IRequestBaseParams (defaults to IRequestBaseParams)
 */
export abstract class BaseService<C = unknown, T extends Partial<IBaseEntity> = Partial<IBaseEntity>, R extends IRequestQueryParams<IRequestBaseParams> = IRequestQueryParams<IRequestBaseParams>> {
  protected client: C

  constructor(client: C) {
    this.client = client
  }

  /**
   * Get all items with optional filtering and pagination
   */
  async getMany(params?: IRequestQueryParams<R> , filters?: IRequestFilterCondition[], include_deleted?: boolean): Promise<IResponsePaginatedResult<T>> {
    throw new Error('getMany method must be implemented by child class')
  }

  /**
   * Get a single item by ID
   */
  async getOne(params: { id: string}): Promise<T | null> {
    throw new Error('getOne method must be implemented by child class')
  }

  /**
   * Create a new item
   */
  async create(params: { data: Partial<T> }): Promise<T> {
    throw new Error('create method must be implemented by child class')
  }

  /**
   * Update an existing item
   */
  async update(params: { id: string; data: Partial<T> }): Promise<T> {
    throw new Error('update method must be implemented by child class')
  }

  /**
   * Delete an item (soft delete by default)
   */
  async delete(params: { id: string; hard_delete?: boolean }): Promise<boolean> {
    throw new Error('delete method must be implemented by child class')
  }

  /**
   * Check if an item exists
   */
  async exists(id: string): Promise<boolean> {
    throw new Error('exists method must be implemented by child class')
  }

  /**
   * Count total items with optional filtering
   */
    async count(params?: IRequestQueryParams<R>, filters?: IRequestFilterCondition[], include_deleted?: boolean): Promise<number> {
    throw new Error('count method must be implemented by child class')
  }

  /**
   * Recover a soft-deleted item
   */
  async recover(params: { id: string }): Promise<T> {
    throw new Error('recover method must be implemented by child class')
  }


  //TODO: change the following operations to use the batch service and validate

  /**
   * Validate if the service is properly configured
   */
  async validate(): Promise<boolean> {
    return true
  }

  /**
   * Bulk create multiple items
   * Default implementation creates items one by one - override for better performance
   */
  async bulkCreate(items: { data: Partial<T> }[]): Promise<T[]> {
    const results: T[] = []
    for (const item of items) {
      const created = await this.create(item)
      results.push(created)
    }
    return results
  }

  /**
   * Bulk update multiple items
   * Default implementation updates items one by one - override for better performance
   */
  async bulkUpdate(items: { id: string; data: Partial<T> }[]): Promise<T[]> {
    const results: T[] = []
    for (const item of items) {
      const updated = await this.update(item)
      results.push(updated)
    }
    return results
  }

  /**
   * Bulk delete multiple items
   * Default implementation deletes items one by one - override for better performance
   */
  async bulkDelete(ids: string[], hard_delete?: boolean): Promise<boolean> {
    for (const id of ids) {
      await this.delete({ id, hard_delete })
    }
    return true
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string } {
    return {
      name: this.constructor.name,
      description: 'Base service implementation',
    }
  }

  /**
   * Get the client instance
   */
  getClient(): C {
    return this.client
  }
}
