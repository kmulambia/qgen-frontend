// Base static service
export { BaseStaticService } from './base-static-service'

// Specific static services
export { CountriesService } from './countries-service'
export { IdTypesService } from './id-types-service'
export { SexService } from './sex-service'

// Re-export types for convenience
export type {
  IStaticDataItem,
  ICountry,
  IIdType,
  ISex,
  IStaticDataResponse,
  IStaticDataFilter,
  IStaticDataConfig
} from '@/interfaces'
