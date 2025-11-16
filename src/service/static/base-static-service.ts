/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IStaticDataItem, IStaticDataResponse, IStaticDataFilter, IStaticDataConfig } from '@/interfaces'

/**
 * Base static service class for handling JSON configuration data.
 * This class provides a common interface for all static data services.
 * @template T - The static data item type that extends IStaticDataItem
 */
export abstract class BaseStaticService<T extends IStaticDataItem = IStaticDataItem> {
  protected data: T[] = []
  protected lastUpdated?: string
  protected config: IStaticDataConfig
  private cacheTimeout?: NodeJS.Timeout

  constructor(config: IStaticDataConfig = {}) {
    this.config = {
      cacheTimeout: 5 * 60 * 1000, // 5 minutes default
      autoRefresh: false,
      ...config
    }
  }

  /**
   * Initialize the service by loading data from JSON files
   */
  abstract initialize(): Promise<void>

  /**
   * Get all items with optional filtering
   */
  async getAll(filters?: IStaticDataFilter): Promise<IStaticDataResponse<T>> {
    await this.ensureDataLoaded()

    let filteredData = [...this.data]

    if (filters) {
      filteredData = this.applyFilters(filteredData, filters)
    }

    return {
      data: filteredData,
      total: filteredData.length,
      lastUpdated: this.lastUpdated
    }
  }

  /**
   * Get a single item by name, code, or value
   */
  async getOne(identifier: string): Promise<T | null> {
    await this.ensureDataLoaded()

    return this.data.find(item =>
      item.name === identifier ||
      item.code === identifier ||
      item.value === identifier
    ) || null
  }

  /**
   * Get items by group
   */
  async getByGroup(group: string): Promise<T[]> {
    await this.ensureDataLoaded()

    return this.data.filter(item => item.group === group)
  }

  /**
   * Search items by name or description
   */
  async search(query: string): Promise<T[]> {
    await this.ensureDataLoaded()

    const lowerQuery = query.toLowerCase()
    return this.data.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Get total count of items
   */
  async count(filters?: IStaticDataFilter): Promise<number> {
    const response = await this.getAll(filters)
    return response.total
  }

  /**
   * Check if an item exists
   */
  async exists(identifier: string): Promise<boolean> {
    const item = await this.getOne(identifier)
    return item !== null
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; totalItems: number } {
    return {
      name: this.constructor.name,
      description: 'Static data service implementation',
      totalItems: this.data.length
    }
  }

  /**
   * Refresh data from source
   */
  async refresh(): Promise<void> {
    await this.initialize()
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    this.data = []
    this.lastUpdated = undefined
    if (this.cacheTimeout) {
      clearTimeout(this.cacheTimeout)
      this.cacheTimeout = undefined
    }
  }

  /**
   * Set up auto-refresh if enabled
   */
  protected setupAutoRefresh(): void {
    if (this.config.autoRefresh && this.config.cacheTimeout) {
      this.cacheTimeout = setTimeout(() => {
        this.refresh()
      }, this.config.cacheTimeout)
    }
  }

  /**
   * Ensure data is loaded
   */
  protected async ensureDataLoaded(): Promise<void> {
    if (this.data.length === 0) {
      await this.initialize()
    }
  }

  /**
   * Apply filters to data
   */
  protected applyFilters(data: T[], filters: IStaticDataFilter): T[] {
    return data.filter(item => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          item.name.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower)) ||
          (item.code && item.code.toLowerCase().includes(searchLower)) ||
          (item.value && item.value.toLowerCase().includes(searchLower))

        if (!matchesSearch) return false
      }

      if (filters.group && item.group !== filters.group) {
        return false
      }

      if (filters.code && item.code !== filters.code) {
        return false
      }

      if (filters.value && item.value !== filters.value) {
        return false
      }

      return true
    })
  }

  /**
   * Load data from JSON file
   */
  protected async loadFromJson<TData>(url: string): Promise<TData> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to load data from ${url}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error loading static data from ${url}:`, error)
      throw error
    }
  }

  /**
   * Set data and update timestamp
   */
  protected setData(data: T[]): void {
    this.data = data
    this.lastUpdated = new Date().toISOString()
    this.setupAutoRefresh()
  }
}
