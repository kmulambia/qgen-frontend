import type { IClient, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for client queries
const defaultClientParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'company_name',
  sort_dir: 'asc',
}

// Create the client store using the base store factory
export const useClientStore = createBaseStore<IClient, IRequestBaseParams>(
  'client',
  defaultClientParams,
  'Client'
)

export type ClientStore = ReturnType<typeof useClientStore>
