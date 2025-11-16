import type { IUser, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for user queries
const defaultUserParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'created_at',
  sort_dir: 'desc',
}

// Create the user store using the base store factory
export const useUserStore = createBaseStore<IUser, IRequestBaseParams>(
  'user',
  defaultUserParams,
  'User'
)

export type UserStore = ReturnType<typeof useUserStore>
