import type { IBaseEntity } from './base-interface'
import type { IPermission } from './permission-interfaces'

// ============================================================================
// Role Permission Base Schema
// ============================================================================

export interface IRolePermissionBase {
  role_id: string
  permission_id: string
}

// ============================================================================
// Role Permission Schemas
// ============================================================================

export interface IRolePermission extends IRolePermissionBase, IBaseEntity {
  permission?: IPermission
}

export type IRolePermissionCreate = IRolePermissionBase

export interface IRolePermissionUpdate extends Partial<IRolePermissionBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}
