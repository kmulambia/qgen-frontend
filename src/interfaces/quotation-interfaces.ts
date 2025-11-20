import type { IBaseEntity } from './base-interface'
import type { IClient } from './client-interfaces'
import type { ILayout } from './layout-interfaces'

/**
 * Quotation line item interface
 */
export interface IQuotationItem {
  item_id?: string
  description: string
  quantity: number
  unit_price: number
  unit?: string
  total?: number
  notes?: string
}

/**
 * Base quotation interface
 */
export interface IQuotationBase {
  title: string
  description?: string

  // Required references
  client_id: string
  layout_id: string

  // Required dates
  quotation_date: string
  valid_until: string

  // Line items
  items: IQuotationItem[]

  // Financial fields
  currency?: string
  discount_percentage?: number
  tax_percentage?: number

  // Additional info
  notes?: string
  terms_conditions?: string
  quotation_status?: string
}

/**
 * Full quotation entity with calculated fields
 */
export interface IQuotation extends IQuotationBase, IBaseEntity {
  quotation_number?: string

  // Calculated fields
  subtotal: number
  discount_amount: number
  tax_amount: number
  total: number

  // Approval workflow fields
  sent_at?: string | null
  access_token?: string | null
  token_expires_at?: string | null

  // Relationships
  client?: IClient
  layout?: ILayout
}

/**
 * Quotation creation interface
 */
export type IQuotationCreate = IQuotationBase

/**
 * Quotation update interface - all fields optional except dates if provided
 */
export interface IQuotationUpdate extends Partial<IQuotationBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}

/**
 * Quotation calculation response
 */
export interface IQuotationCalculation {
  items: IQuotationItem[]
  subtotal: number
  discount_percentage: number
  discount_amount: number
  tax_percentage: number
  tax_amount: number
  total: number
  breakdown: {
    items_total: number
    after_discount: number
    tax_base: number
  }
}
