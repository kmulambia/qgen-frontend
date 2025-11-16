import { BaseStaticService } from './base-static-service'
import type { IIdType, IStaticDataConfig } from '@/interfaces'

/**
 * Service for managing ID types data from JSON configuration
 */
export class IdTypesService extends BaseStaticService<IIdType> {
  constructor(config?: IStaticDataConfig) {
    super({
      cacheTimeout: 30 * 60 * 1000, // 30 minutes for ID types (very rarely change)
      autoRefresh: false,
      ...config
    })
  }

  /**
   * Initialize the service by loading ID types data
   */
  async initialize(): Promise<void> {
    try {
      const data = await this.loadFromJson<IIdType[]>('/src/assets/data/id-types.json')
      this.setData(data)
    } catch (error) {
      console.error('Failed to initialize IdTypesService:', error)
      // Fallback to empty array if loading fails
      this.setData([])
    }
  }

  /**
   * Get ID type by value
   */
  async getByValue(value: string): Promise<IIdType | null> {
    await this.ensureDataLoaded()
    return this.data.find(idType => idType.value === value) || null
  }

  /**
   * Get all ID type values
   */
  async getValues(): Promise<string[]> {
    await this.ensureDataLoaded()
    return this.data.map(idType => idType.value)
  }

  /**
   * Check if an ID type value exists
   */
  async hasValue(value: string): Promise<boolean> {
    const idType = await this.getByValue(value)
    return idType !== null
  }
}
