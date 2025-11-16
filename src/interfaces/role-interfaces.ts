import type { IBaseEntity } from './base-interface'

// ============================================================================
// Role Base Schema
// ============================================================================

export interface IRoleBase {
  name: string
  description?: string
  is_system_defined: boolean
}

// ============================================================================
// Role Schemas
// ============================================================================

export interface IRole extends IRoleBase, IBaseEntity {
  // Inherits id, created_at, updated_at, is_deleted, status, version from IBaseEntity
}

export type IRoleCreate = IRoleBase

export interface IRoleUpdate extends Partial<IRoleBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}
