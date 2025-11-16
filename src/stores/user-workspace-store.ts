import type { IUserWorkspace, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for user workspace queries
const defaultUserWorkspaceParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'created_at',
  sort_dir: 'desc',
}

// Create the user workspace store using the base store factory
export const useUserWorkspaceStore = createBaseStore<IUserWorkspace, IRequestBaseParams>(
  'user-workspace',
  defaultUserWorkspaceParams,
  'UserWorkspace'
)

export type UserWorkspaceStore = ReturnType<typeof useUserWorkspaceStore>

