import type { IBaseEntity } from './base-interface'

/**
 * Base layout interface with all template configuration fields
 */
export interface ILayoutBase {
  // Basic Information
  name: string
  description?: string

  // Logo
  logo_file_id?: string
  logo_file?: {
    id: string
    url: string
    filename: string
    content_type: string
  }

  // Layout Information Fields
  company_name?: string
  reference_number?: string
  email?: string
  phone?: string
  address?: string

  // Terms and Conditions
  terms_conditions?: string

  // Notes
  notes?: string

  // Links (stored as JSON)
  links?: Record<string, string>

  // Custom Fields (stored as JSON)
  custom_fields?: Record<string, unknown>

  // Default Flag
  is_default: boolean
}

/**
 * Full layout entity with base fields
 */
export interface ILayout extends ILayoutBase, IBaseEntity {}

/**
 * Layout creation interface
 */
export type ILayoutCreate = Omit<ILayoutBase, 'is_default' | 'logo_file'> & {
  is_default?: boolean
}

/**
 * Layout update interface - all fields optional
 */
export interface ILayoutUpdate extends Partial<Omit<ILayoutBase, 'logo_file'>> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}

/**
 * Layout logo upload response
 */
export interface ILayoutLogoUploadResponse {
  layout_id: string
  logo_file_id: string
  logo_url: string
  message: string
}
