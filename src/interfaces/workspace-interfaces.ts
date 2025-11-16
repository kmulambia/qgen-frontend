import type { IBaseEntity } from './base-interface'
import type { IWorkspaceType } from './workspace-type-interfaces'

// ============================================================================
// Workspace Base Schema
// ============================================================================

export interface IWorkspaceBase {
  name: string
  description?: string
  workspace_type_id?: string
  owner_id?: string
  reference_name?: string
  reference_type?: string
  reference_number?: string
}

// ============================================================================
// Workspace Schemas
// ============================================================================

export interface IWorkspace extends IWorkspaceBase, IBaseEntity {
  workspace_type?: IWorkspaceType
}

export type IWorkspaceCreate = IWorkspaceBase

export interface IWorkspaceUpdate extends Partial<IWorkspaceBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}
