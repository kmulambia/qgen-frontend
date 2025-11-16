import type { IBaseEntity } from './base-interface'

// ============================================================================
// Workspace Type Base Schema
// ============================================================================

export interface IWorkspaceTypeBase {
  name: string
  description?: string
  is_system_defined?: boolean | false
}

// ============================================================================
// Workspace Type Schemas
// ============================================================================

export interface IWorkspaceType extends IWorkspaceTypeBase, IBaseEntity {
  // Inherits id, created_at, updated_at, is_deleted, status, version from IBaseEntity
}

export type IWorkspaceTypeCreate = IWorkspaceTypeBase

export interface IWorkspaceTypeUpdate extends Partial<IWorkspaceTypeBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
  is_system_defined?: boolean
}
