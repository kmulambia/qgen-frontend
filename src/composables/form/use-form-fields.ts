import type { IField } from '@/interfaces'

// ============================================================================
// Form Fields Composable
// ============================================================================

export const useFormFields = ({ fields }: { fields: IField[] }) => {
  /**
   * Check if a field should be visible
   */
  const hasField = (fieldName: string): boolean => {
    const field = fields.find(f => f.name === fieldName)
    return field ? (field.visible !== false) : true
  }

  /**
   * Check if a field should be readonly
   */
  const isFieldReadonly = (fieldName: string): boolean => {
    const field = fields.find(f => f.name === fieldName)
    return field ? (field.readonly === true) : false
  }

  /**
   * Get field configuration
   */
  const getField = (fieldName: string): IField | undefined => {
    return fields.find(f => f.name === fieldName)
  }

  /**
   * Get all visible fields
   */
  const getVisibleFields = (): IField[] => {
    return fields.filter(f => f.visible !== false)
  }

  /**
   * Get all readonly fields
   */
  const getReadonlyFields = (): IField[] => {
    return fields.filter(f => f.readonly === true)
  }

  /**
   * Get all required fields
   */
  const getRequiredFields = (): IField[] => {
    return fields.filter(f => f.required === true)
  }

  /**
   * Check if field is required
   */
  const isFieldRequired = (fieldName: string): boolean => {
    const field = fields.find(f => f.name === fieldName)
    return field ? (field.required === true) : false
  }

  /**
   * Get field type
   */
  const getFieldType = (fieldName: string): string => {
    const field = fields.find(f => f.name === fieldName)
    return field?.type || 'text'
  }

  /**
   * Get field label
   */
  const getFieldLabel = (fieldName: string): string => {
    const field = fields.find(f => f.name === fieldName)
    return field?.label || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  /**
   * Get field placeholder
   */
  const getFieldPlaceholder = (fieldName: string): string => {
    const field = fields.find(f => f.name === fieldName)
    return field?.placeholder || `Enter ${getFieldLabel(fieldName).toLowerCase()}`
  }

  /**
   * Get field help text
   */
  const getFieldHelpText = (fieldName: string): string | undefined => {
    const field = fields.find(f => f.name === fieldName)
    return field?.helpText
  }

  /**
   * Get field options (for select/combobox fields)
   */
  const getFieldOptions = (fieldName: string): Array<{ value: string; label: string }> => {
    const field = fields.find(f => f.name === fieldName)
    return field?.options || []
  }

  return {
    hasField,
    isFieldReadonly,
    getField,
    getVisibleFields,
    getReadonlyFields,
    getRequiredFields,
    isFieldRequired,
    getFieldType,
    getFieldLabel,
    getFieldPlaceholder,
    getFieldHelpText,
    getFieldOptions
  }
}
