import type { IBaseEntity } from './base-interface'

/**
 * Base file interface with all file information
 */
export interface IFileBase {
  // File Information
  original_filename: string
  stored_filename?: string
  full_path?: string
  content_type: string
  size: number

  // Metadata
  file_metadata?: Record<string, unknown>

  // File category/type (optional for organization)
  category?: string
  tags?: string[]

  // Description
  description?: string
}

/**
 * Full file entity with base fields
 */
export interface IFile extends IFileBase, IBaseEntity {}

/**
 * File creation interface
 */
export type IFileCreate = IFileBase

/**
 * File update interface - all fields optional
 */
export interface IFileUpdate extends Partial<IFileBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}
