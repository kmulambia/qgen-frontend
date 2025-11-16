/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IBaseEntity } from './base-interface'

/**
 * Audit Interface
 * Represents an audit log entry tracking user actions and system events
 */
export interface IAudit extends IBaseEntity {
  // Audit-specific fields
  user_id?: string
  action: string
  user_metadata?: Record<string, any>
  entity_metadata?: Record<string, any>

  // Related entities (populated from backend relationships)
  user?: {
    id: string
    first_name?: string
    last_name?: string
    email?: string
  }
}

/**
 * Audit Create Interface
 * Used when creating new audit log entries
 */
export interface IAuditCreate {
  user_id?: string
  action: string
  user_metadata?: Record<string, any>
  entity_metadata?: Record<string, any>
}

/**
 * Audit Update Interface
 * Audits are typically immutable, but this interface is provided for completeness
 */
export interface IAuditUpdate {
  action?: string
  user_metadata?: Record<string, any>
  entity_metadata?: Record<string, any>
}

/**
 * User Security Summary Interface
 * Optimized response containing all security-related audit data
 */
export interface IUserSecuritySummary {
  last_login: IAudit | null
  last_password_reset: IAudit | null
  failed_login_count: number
}


