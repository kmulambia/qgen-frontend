import type { IRolePermission, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for role permission queries
const defaultRolePermissionParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'created_at',
  sort_dir: 'desc',
}

// Create the role permission store using the base store factory
export const useRolePermissionStore = createBaseStore<IRolePermission, IRequestBaseParams>(
  'role-permission',
  defaultRolePermissionParams,
  'RolePermission'
)

export type RolePermissionStore = ReturnType<typeof useRolePermissionStore>
