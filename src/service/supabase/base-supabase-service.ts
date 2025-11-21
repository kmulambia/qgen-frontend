import type {
  IBaseEntity,
  IRequestBaseParams,
  IRequestQueryParams,
  IResponsePaginatedResult,
  IRequestFilterCondition,
} from '@/interfaces'
import { BaseService } from '@/service/base-service'
import type { SupabaseClient } from '@supabase/supabase-js'

//TODO: Implement filters and include_deleted in getMany and count
/**
 * Base Supabase service class that implements supabase CRUD operations
 * @template T - The entity type that extends IBaseEntity
 * @template R - The request type that extends IRequestBaseParams (defaults to IRequestBaseParams)
 */
export abstract class BaseSupabaseService<
  T extends Partial<IBaseEntity> = Partial<IBaseEntity>,
  R extends IRequestQueryParams<IRequestBaseParams> = IRequestQueryParams<IRequestBaseParams>,
> extends BaseService<SupabaseClient, T, R> {
  /**
   * The supabase table for this service (e.g., 'users', 'products')
   * Must be implemented by child classes
   */
  protected readonly table_name: string

  constructor(client: SupabaseClient, table_name: string) {
    super(client)
    this.table_name = table_name
  }

  async getMany(
    params?: IRequestQueryParams<R>,
    filters?: IRequestFilterCondition[],
    include_deleted?: boolean,
  ): Promise<IResponsePaginatedResult<T>> {
    const page = params?.page || 1
    const pageSize = params?.page_size || 10
    // Convert 1-based page to 0-based offset for Supabase range
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1

    // First get the total count
    const { count: totalCount, error: countError } = await (this.getClient() as SupabaseClient)
      .from(this.table_name)
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', include_deleted || false)

    if (countError) throw countError

    // If the start index is beyond available records, return empty result
    if (start >= (totalCount || 0)) {
      return {
        items: [],
        total: totalCount || 0,
      }
    }

    // Now get the actual data
    const { data, error } = await this.getClient()
      .from(this.table_name)
      .select('*')
      .eq('is_deleted', include_deleted || false)
      .range(start, end)

    if (error) throw error

    return {
      items: data || [],
      total: totalCount || 0,
    }
  }

  async getOne(params: { id: string }): Promise<T | null> {
    const { data, error } = await this.getClient()
      .from(this.table_name)
      .select('*')
      .eq('id', params.id)
      .single()
    if (error) throw error
    return data
  }

  async create(params: { data: Partial<T> }): Promise<T> {
    const { data, error } = await this.getClient()
      .from(this.table_name)
      .insert(params.data)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async update(params: { id: string; data: Partial<T> }): Promise<T> {
    const { data, error } = await this.getClient()
      .from(this.table_name)
      .update(params.data)
      .eq('id', params.id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async delete(params: { id: string; hard_delete?: boolean }): Promise<boolean> {
    const client = this.getClient()
    if (params.hard_delete) {
      const { error } = await client.from(this.table_name).delete().eq('id', params.id)
      if (error) throw error
    } else {
      // Soft delete - update is_deleted field
      const { error } = await client
        .from(this.table_name)
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', params.id)
      if (error) throw error
    }
    return true
  }

  async exists(id: string): Promise<boolean> {
    const { data, error } = await this.getClient()
      .from(this.table_name)
      .select('id')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
    return !!data
  }

  async count(
    params?: IRequestQueryParams<R>,
    filters?: IRequestFilterCondition[],
    include_deleted?: boolean,
  ): Promise<number> {
    const { count, error } = await this.getClient()
      .from(this.table_name)
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', include_deleted || false)

    if (error) throw error
    return count || 0
  }

  async recover(params: { id: string }): Promise<T> {
    const { data, error } = await this.getClient()
      .from(this.table_name)
      .update({ is_deleted: false, deleted_at: null })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Get service metadata including endpoint information
   */
  getMetadata(): { name: string; version?: string; description?: string; table_name: string } {
    return {
      ...super.getMetadata(),
      table_name: this.table_name,
      description: `Supabase service for ${this.table_name}`,
    }
  }
}
