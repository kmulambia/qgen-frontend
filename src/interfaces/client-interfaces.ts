import type { IBaseEntity } from './base-interface'

/**
 * Base client interface with all company and contact information
 */
export interface IClientBase {
  // Company Information
  company_name: string
  registration_number?: string
  tax_id?: string

  // Address Information
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string

  // Company Contact Information
  phone?: string
  email?: string
  website?: string

  // Contact Person Information
  contact_person_name?: string
  contact_person_email?: string
  contact_person_phone?: string
  contact_person_position?: string

  // Additional Information
  notes?: string
}

/**
 * Full client entity with base fields
 */
export interface IClient extends IClientBase, IBaseEntity {}

/**
 * Client creation interface
 */
export type IClientCreate = IClientBase

/**
 * Client update interface - all fields optional
 */
export interface IClientUpdate extends Partial<IClientBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}
