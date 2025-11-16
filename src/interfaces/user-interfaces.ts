import type { IBaseEntity  } from './base-interface'

// ============================================================================
// User Base Schema
// ============================================================================

export interface IUserBase {
  first_name: string
  last_name: string
  phone: string
  email: string
  sex?: string
  id_number?: string
  id_type?: string
  date_of_birth?: string // ISO date string
  role_id?: string
}

// ============================================================================
// User Schemas
// ============================================================================

export interface IUser extends IUserBase, IBaseEntity {
  // Inherits id, created_at, updated_at, is_deleted, status, version from IBaseEntity
}

export interface IUserCreate extends IUserBase {
  password: string
}

export interface IUserUpdate extends Partial<IUserBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}

export interface IUserRegister extends IUserBase {
  password: string
  confirm_password: string
  role_id?: string
  workspace_id?: string
}


