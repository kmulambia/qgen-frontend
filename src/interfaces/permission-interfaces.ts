import type { IBaseEntity } from './base-interface'

// ============================================================================
// Permission Base Schema
// ============================================================================

export interface IPermissionBase {
  name: string
  description?: string
  group?: string
  code: string
}

// ============================================================================
// Permission Schemas
// ============================================================================

export interface IPermission extends IPermissionBase, IBaseEntity {
  // Inherits id, created_at, updated_at, is_deleted, status, version from IBaseEntity
}

export type IPermissionCreate = IPermissionBase

export interface IPermissionUpdate extends Partial<IPermissionBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}
