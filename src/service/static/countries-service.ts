import { BaseStaticService } from './base-static-service'
import type { ICountry, IStaticDataConfig } from '@/interfaces'

/**
 * Service for managing countries data from JSON configuration
 */
export class CountriesService extends BaseStaticService<ICountry> {
  constructor(config?: IStaticDataConfig) {
    super({
      cacheTimeout: 10 * 60 * 1000, // 10 minutes for countries (rarely change)
      autoRefresh: false,
      ...config
    })
  }

  /**
   * Initialize the service by loading countries data
   */
  async initialize(): Promise<void> {
    try {
      const data = await this.loadFromJson<ICountry[]>('/src/assets/data/countries.json')
      this.setData(data)
    } catch (error) {
      console.error('Failed to initialize CountriesService:', error)
      // Fallback to empty array if loading fails
      this.setData([])
    }
  }

  /**
   * Get countries by currency
   */
  async getByCurrency(currency: string): Promise<ICountry[]> {
    await this.ensureDataLoaded()
    return this.data.filter(country => country.currency === currency)
  }

  /**
   * Get countries by phone code
   */
  async getByPhoneCode(phoneCode: string): Promise<ICountry[]> {
    await this.ensureDataLoaded()
    return this.data.filter(country => country.phone === phoneCode)
  }

  /**
   * Get country by ISO code
   */
  async getByIsoCode(isoCode: string): Promise<ICountry | null> {
    await this.ensureDataLoaded()
    return this.data.find(country => country.code === isoCode) || null
  }

  /**
   * Get all unique currencies
   */
  async getCurrencies(): Promise<string[]> {
    await this.ensureDataLoaded()
    const currencies = new Set(this.data.map(country => country.currency))
    return Array.from(currencies).sort()
  }

  /**
   * Get all unique phone codes
   */
  async getPhoneCodes(): Promise<string[]> {
    await this.ensureDataLoaded()
    const phoneCodes = new Set(this.data.map(country => country.phone))
    return Array.from(phoneCodes).sort()
  }
}
