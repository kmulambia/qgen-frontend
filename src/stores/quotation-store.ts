import type { IQuotation, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for quotation queries
const defaultQuotationParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'quotation_date',
  sort_dir: 'desc',
}

// Create the quotation store using the base store factory
export const useQuotationStore = createBaseStore<IQuotation, IRequestBaseParams>(
  'quotation',
  defaultQuotationParams,
  'Quotation'
)

export type QuotationStore = ReturnType<typeof useQuotationStore>
