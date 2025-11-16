import { defineStore } from 'pinia'
import type {
  IBaseEntity,
  IRequestBaseParams,
  IRequestFilterCondition,
  IRequestQueryParams,
  IResponsePaginatedResult
} from '@/interfaces'
import type { BaseService } from '@/service/base-service'

//TODO: Add persistence to the store using sessionStorage or localStorage with Pinia Persist
/**
 * Creates a concrete Pinia store implementation based on BaseService
 * This provides a working store with all CRUD operations implemented
 *
 * @template T - The entity type that extends IBaseEntity
 * @template R - The request/filter type that extends IRequestBaseParams
 * @template S - The service type that extends BaseService
 */
export function createBaseStore<
  T extends Partial<IBaseEntity> = Partial<IBaseEntity>,
  R extends IRequestQueryParams<IRequestBaseParams> = IRequestQueryParams<IRequestBaseParams>,
  S extends BaseService<unknown, T, R> = BaseService<unknown, T, R>
>(
  storeId: string,
  defaultParams: R,
  entityTypeName?: string
) {
  return defineStore(storeId, {
    state: () => ({
      // Service instance
      _service: null as S | null,

      // Params and filters state
      params: defaultParams,
      filters: null as IRequestFilterCondition[] | null,

      // Loading state
      isLoading: false,

      // Error state
      error: null as string | null,
    }),

    getters: {
      /**
       * Check if service is initialized
       */
      isServiceInitialized(state): boolean {
        return state._service !== null
      },

      /**
       * Get current query params
       */
      currentQueryParams(state): R {
        return { ...state.params } as R
      },

      /**
       * Get service metadata
       */
      serviceMetadata(state) {
        return state._service?.getMetadata() || null
      },

      /**
       * Check if there's an active error
       */
      hasError(state): boolean {
        return state.error !== null
      },
    },

    actions: {
      // ==========================================
      // SERVICE MANAGEMENT
      // ==========================================

      /**
       * Set the service instance
       */
      setService(service: S) {
        // @ts-expect-error: Pinia reactivity typing issue
        this._service = service
        this.error = null
      },

      /**
       * Ensure service is initialized
       */
      ensureServiceInitialized() {
        if (!this._service) {
          throw new Error(`${entityTypeName || 'Entity'} service not initialized. Call setService() first.`)
        }
      },

      // ==========================================
      // ERROR MANAGEMENT
      // ==========================================

      /**
       * Clear the error
       */
      clearError() {
        this.error = null
      },

      /**
       * Set error state
       */
      setError(error: string | Error) {
        this.error = typeof error === 'string' ? error : error.message
        console.error(`${entityTypeName || 'Store'} Error:`, error)
      },

      // ==========================================
      // FILTER AND PARAMS MANAGEMENT
      // ==========================================

      /**
       * Update query parameters
       */
      updateParams(params: Partial<R>) {
        // @ts-expect-error: Pinia reactivity typing issue
        this.params = { ...this.params, ...params } as R
        this.clearError()
      },

      /**
       * Reset parameters to default
       */
      resetParams() {
        // @ts-expect-error: Pinia reactivity typing issue
        this.params = { ...defaultParams } as R
        this.clearError()
      },

      /**
       * Update filters
       */
      updateFilters(filters: IRequestFilterCondition[]) {
        this.filters = [...filters]
        this.clearError()
      },

      /**
       * Clear filters
       */
      clearFilters() {
        this.filters = null
        this.clearError()
      },

      /**
       * Set pagination
       */
      setPagination(page: number, pageSize: number) {
        this.updateParams({
          page,
          page_size: pageSize,
        } as Partial<R>)
      },

      /**
       * Set sorting
       */
      setSorting(sortBy: string, sortDir: 'asc' | 'desc') {
        this.updateParams({
          sort_by: sortBy,
          sort_dir: sortDir,
        } as Partial<R>)
      },

      /**
       * Set search query
       */
      setSearch(query: string) {
        this.updateParams({
          search: query,
          page: 1, // Reset to first page on search
        } as Partial<R>)
      },



      // ==========================================
      // CRUD OPERATIONS
      // ==========================================

      /**
       * Get many items with optional custom filters
       */
      async getMany(customParams?: Partial<R>, customFilters?: IRequestFilterCondition[], includeDeleted?: boolean): Promise<IResponsePaginatedResult<T>> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const queryParams = customParams ? { ...this.params, ...customParams } as R : this.params as R
          const filters = customFilters || this.filters || undefined

          const result = await this._service!.getMany(queryParams, filters, includeDeleted)
          return result
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      /**
       * Get a single item by ID
       */
      async getOne(id: string): Promise<T | null> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const entity = await this._service!.getOne({ id })
          return entity
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      /**
       * Create a new item
       */
      async create(data: Partial<T>): Promise<T> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const entity = await this._service!.create({ data })
          return entity
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      /**
       * Update an existing item
       */
      async update(id: string, data: Partial<T>): Promise<T> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const entity = await this._service!.update({ id, data })
          return entity
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      /**
       * Delete an item
       */
      async delete(id: string, hardDelete?: boolean): Promise<boolean> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const result = await this._service!.delete({ id, hard_delete: hardDelete })
          return result
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      /**
       * Recover a soft-deleted item
       */
      async recover(id: string): Promise<T> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const entity = await this._service!.recover({ id })
          return entity
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      /**
       * Check if an item exists
       */
      async exists(id: string): Promise<boolean> {
        this.ensureServiceInitialized()
        this.clearError()

        try {
          return await this._service!.exists(id)
        } catch (error) {
          this.setError(error as Error)
          throw error
        }
      },

      /**
       * Query items with filters using POST endpoint
       */
      async query(customParams?: Partial<R>, customFilters?: IRequestFilterCondition[], includeDeleted?: boolean): Promise<IResponsePaginatedResult<T>> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const queryParams = customParams ? { ...this.params, ...customParams } as R : this.params as R
          const filters = customFilters || this.filters || undefined

          const result = await (this._service as unknown as { query: (params: R, filters?: IRequestFilterCondition[], includeDeleted?: boolean) => Promise<IResponsePaginatedResult<T>> }).query(queryParams, filters, includeDeleted)
          return result
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      /**
       * Count items with optional filters using POST endpoint
       */
      async count(customParams?: Partial<R>, customFilters?: IRequestFilterCondition[], includeDeleted?: boolean): Promise<number> {
        this.ensureServiceInitialized()
        this.clearError()

        try {
          const queryParams = customParams ? { ...this.params, ...customParams } as R : this.params as R
          const filters = customFilters || this.filters || undefined

          const count = await (this._service as unknown as { count: (params?: R, filters?: IRequestFilterCondition[], includeDeleted?: boolean) => Promise<number> }).count(queryParams, filters, includeDeleted)
          return count
        } catch (error) {
          this.setError(error as Error)
          throw error
        }
      },

      /**
       * Call a custom service method by name
       * This allows calling entity-specific methods like register, etc.
       */
      async callServiceMethod(methodName: string, ...args: unknown[]): Promise<unknown> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          if (methodName in this._service! && typeof (this._service as unknown as Record<string, unknown>)[methodName] === 'function') {
            const result = await ((this._service as unknown as Record<string, unknown>)[methodName] as (...args: unknown[]) => Promise<unknown>)(...args)
            return result
          } else {
            throw new Error(`Method '${methodName}' not found on service`)
          }
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      // ==========================================
      // BULK OPERATIONS
      // ==========================================

      /**
       * Bulk create multiple items
       */
      async bulkCreate(items: Partial<T>[]): Promise<T[]> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const itemsWithData = items.map(item => ({ data: item }))
          const entities = await this._service!.bulkCreate(itemsWithData)
          return entities
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      /**
       * Bulk update multiple items
       */
      async bulkUpdate(updates: { id: string; data: Partial<T> }[]): Promise<T[]> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const entities = await this._service!.bulkUpdate(updates)
          return entities
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      /**
       * Bulk delete multiple items
       */
      async bulkDelete(ids: string[], hardDelete?: boolean): Promise<boolean> {
        this.ensureServiceInitialized()
        this.isLoading = true
        this.clearError()

        try {
          const result = await this._service!.bulkDelete(ids, hardDelete)
          return result
        } catch (error) {
          this.setError(error as Error)
          throw error
        } finally {
          this.isLoading = false
        }
      },

      // ==========================================
      // UTILITY METHODS
      // ==========================================

      /**
       * Validate service
       */
      async validateService(): Promise<boolean> {
        if (!this._service) return false

        try {
          return await this._service.validate()
        } catch (error) {
          this.setError(error as Error)
          return false
        }
      },

      /**
       * Get service info
       */
      getServiceInfo() {
        return this._service?.getMetadata() || null
      },

      /**
       * Reset store to initial state
       */
      resetStore() {
        // @ts-expect-error: Pinia reactivity typing issue
        this.params = { ...defaultParams } as R
        this.filters = null
        this.isLoading = false
        this.error = null
      },

      /**
       * Refresh data (reload with current params)
       */
      async refresh(): Promise<IResponsePaginatedResult<T>> {
        return await this.getMany()
      },

      /**
       * Search items
       */
      async search(query: string): Promise<IResponsePaginatedResult<T>> {
        this.setSearch(query)
        return await this.getMany()
      },
    },
  })
}

export type BaseStoreType<
  T extends Partial<IBaseEntity>,
  R extends IRequestQueryParams<IRequestBaseParams>,
  S extends BaseService<unknown, T, R>
> = ReturnType<typeof createBaseStore<T, R, S>>
