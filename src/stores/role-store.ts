import type { IRole, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for role queries
const defaultRoleParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'name',
  sort_dir: 'asc',
}

// Create the role store using the base store factory
export const useRoleStore = createBaseStore<IRole, IRequestBaseParams>(
  'role',
  defaultRoleParams,
  'Role'
)

export type RoleStore = ReturnType<typeof useRoleStore>
