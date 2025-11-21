import { BaseStaticService } from './base-static-service'
import type { ICurrency, IStaticDataConfig } from '@/interfaces'
import currenciesData from '@/assets/data/currencies.json'

/**
 * Service for managing currencies data from JSON configuration
 */
export class CurrencyService extends BaseStaticService<ICurrency> {
  constructor(config?: IStaticDataConfig) {
    super({
      cacheTimeout: 10 * 60 * 1000, // 10 minutes for currencies
      autoRefresh: false,
      ...config
    })
  }

  /**
   * Initialize the service by loading currencies data
   */
  async initialize(): Promise<void> {
    try {
      // Import JSON directly - Vite will bundle it correctly for production
      const data = currenciesData as ICurrency[]
      this.setData(data)
    } catch (error) {
      console.error('Failed to initialize CurrencyService:', error)
      // Fallback to empty array if loading fails
      this.setData([])
    }
  }

  /**
   * Get currency by code
   */
  async getByCode(code: string): Promise<ICurrency | null> {
    await this.ensureDataLoaded()
    return this.data.find(currency => currency.code === code) || null
  }

  /**
   * Get currencies by symbol
   */
  async getBySymbol(symbol: string): Promise<ICurrency[]> {
    await this.ensureDataLoaded()
    return this.data.filter(currency => currency.symbol === symbol)
  }

  /**
   * Get all currency codes
   */
  async getCodes(): Promise<string[]> {
    await this.ensureDataLoaded()
    return this.data.map(currency => currency.code).sort()
  }

  /**
   * Get all currency symbols
   */
  async getSymbols(): Promise<string[]> {
    await this.ensureDataLoaded()
    const symbols = new Set(this.data.map(currency => currency.symbol))
    return Array.from(symbols).sort()
  }
}
