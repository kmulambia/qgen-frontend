import { BaseStaticService } from './base-static-service'
import type { ISex, IStaticDataConfig } from '@/interfaces'
import sexData from '@/assets/data/sex.json'

/**
 * Service for managing sex/gender data from JSON configuration
 */
export class SexService extends BaseStaticService<ISex> {
  constructor(config?: IStaticDataConfig) {
    super({
      cacheTimeout: 30 * 60 * 1000, // 30 minutes for sex options (very rarely change)
      autoRefresh: false,
      ...config
    })
  }

  /**
   * Initialize the service by loading sex data
   */
  async initialize(): Promise<void> {
    try {
      // Import JSON directly - Vite will bundle it correctly for production
      const data = sexData as ISex[]
      this.setData(data)
    } catch (error) {
      console.error('Failed to initialize SexService:', error)
      // Fallback to empty array if loading fails
      this.setData([])
    }
  }

  /**
   * Get sex option by value
   */
  async getByValue(value: string): Promise<ISex | null> {
    await this.ensureDataLoaded()
    return this.data.find(sex => sex.value === value) || null
  }

  /**
   * Get all sex values
   */
  async getValues(): Promise<string[]> {
    await this.ensureDataLoaded()
    return this.data.map(sex => sex.value)
  }

  /**
   * Check if a sex value exists
   */
  async hasValue(value: string): Promise<boolean> {
    const sex = await this.getByValue(value)
    return sex !== null
  }
}
