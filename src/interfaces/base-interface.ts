// ============================================================================
// Base Entity
// ============================================================================

export interface IBaseEntity {
  id?: string
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  status?: string
  version?: number
}

// ============================================================================
// Field Configuration
// ============================================================================

export interface IField {
  name: string
  readonly?: boolean
  visible?: boolean
  required?: boolean
  type?: 'text' | 'email' | 'tel' | 'password' | 'select' | 'date' | 'combobox'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  label?: string
  helpText?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: (value: unknown) => boolean | string
  }
}


