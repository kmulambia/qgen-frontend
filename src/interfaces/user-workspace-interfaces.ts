import type { IBaseEntity } from './base-interface'
import type { IRole } from './role-interfaces'
import type { IWorkspace } from './workspace-interfaces'

// ============================================================================
// User Workspace Base Schema
// ============================================================================

export interface IUserWorkspaceBase {
  user_id: string
  workspace_id: string
  role_id: string
  is_default?: boolean
}

// ============================================================================
// User Workspace Schemas
// ============================================================================

export interface IUserWorkspace extends IUserWorkspaceBase, IBaseEntity {
  role?: IRole
  workspace?: IWorkspace
}

export type IUserWorkspaceCreate = IUserWorkspaceBase

export interface IUserWorkspaceUpdate extends Partial<IUserWorkspaceBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}

