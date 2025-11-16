// ============================================================================
// Static Data Interfaces
// ============================================================================

export interface IStaticDataItem {
  name: string
  value?: string
  code?: string
  description?: string
  group?: string
  currency?: string
  phone?: string
}

export interface ICountry extends IStaticDataItem {
  code: string
  currency: string
  phone: string
}

export interface IIdType extends IStaticDataItem {
  value: string
}

export interface ISex extends IStaticDataItem {
  value: string
}

// ============================================================================
// Static Data Response Types
// ============================================================================

export interface IStaticDataResponse<T> {
  data: T[]
  total: number
  lastUpdated?: string
}

export interface IStaticDataFilter {
  search?: string
  group?: string
  code?: string
  value?: string
}

// ============================================================================
// Static Data Service Configuration
// ============================================================================

export interface IStaticDataConfig {
  cacheTimeout?: number
  autoRefresh?: boolean
  fallbackData?: unknown[]
}
