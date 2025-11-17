import type { ILayout, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for layout queries
const defaultLayoutParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'name',
  sort_dir: 'asc',
}

// Create the layout store using the base store factory
export const useLayoutStore = createBaseStore<ILayout, IRequestBaseParams>(
  'layout',
  defaultLayoutParams,
  'Layout'
)

export type LayoutStore = ReturnType<typeof useLayoutStore>
