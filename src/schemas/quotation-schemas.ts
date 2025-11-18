import * as yup from 'yup'
import type { TFunction } from 'i18next'

/**
 * Quotation item validation schema
 */
export const QuotationItemSchema = (t: TFunction) => {
  return yup.object({
    item_id: yup.string().trim().nullable(),
    description: yup
      .string()
      .trim()
      .min(1, t('validation.string.min', { min: 1 }))
      .required(t('validation.mixed.required')),
    quantity: yup
      .number()
      .positive(t('validation.number.positive'))
      .required(t('validation.mixed.required')),
    unit_price: yup
      .number()
      .min(0, t('validation.number.min', { min: 0 }))
      .required(t('validation.mixed.required')),
    unit: yup
      .string()
      .trim()
      .default('unit')
      .nullable(),
    total: yup.number().nullable(),
    notes: yup.string().nullable(),
  })
}

/**
 * Main quotation validation schema
 */
export const QuotationSchema = (t: TFunction) => {
  return yup.object({
    title: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(255, t('validation.string.max', { max: 255 }))
      .required(t('validation.mixed.required')),
    description: yup.string().trim().nullable(),

    // Required references
    client_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .required(t('validation.mixed.required')),
    layout_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .required(t('validation.mixed.required')),

    // Required dates
    quotation_date: yup
      .date()
      .required(t('validation.mixed.required')),
    valid_until: yup
      .date()
      .min(
        yup.ref('quotation_date'),
        t('validation.date.after', { field: 'quotation_date' })
      )
      .required(t('validation.mixed.required')),

    // Line items
    items: yup
      .array()
      .of(QuotationItemSchema(t))
      .min(1, t('validation.array.min', { min: 1 }))
      .required(t('validation.mixed.required')),

    // Financial fields
    currency: yup
      .string()
      .trim()
      .default('USD'),
    discount_percentage: yup
      .number()
      .min(0, t('validation.number.min', { min: 0 }))
      .max(100, t('validation.number.max', { max: 100 }))
      .default(0),
    tax_percentage: yup
      .number()
      .min(0, t('validation.number.min', { min: 0 }))
      .max(100, t('validation.number.max', { max: 100 }))
      .default(0),

    // Additional info
    notes: yup.string().nullable(),
    terms_conditions: yup.string().nullable(),
    quotation_status: yup
      .string()
      .oneOf(['draft', 'sent', 'approved', 'rejected', 'expired', 'accepted'])
      .default('draft'),
  })
}

/**
 * Quotation creation schema
 */
export const QuotationCreateSchema = (t: TFunction) => {
  return QuotationSchema(t)
}

/**
 * Quotation update schema - all fields optional
 */
export const QuotationUpdateSchema = (t: TFunction) => {
  return yup.object({
    title: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(255, t('validation.string.max', { max: 255 }))
      .optional(),
    description: yup.string().trim().nullable(),

    client_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .optional(),
    layout_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .optional(),

    quotation_date: yup.date().optional(),
    valid_until: yup.date().optional(),

    items: yup
      .array()
      .of(QuotationItemSchema(t))
      .min(1, t('validation.array.min', { min: 1 }))
      .optional(),

    currency: yup
      .string()
      .trim()
      .optional(),
    discount_percentage: yup
      .number()
      .min(0, t('validation.number.min', { min: 0 }))
      .max(100, t('validation.number.max', { max: 100 }))
      .optional(),
    tax_percentage: yup
      .number()
      .min(0, t('validation.number.min', { min: 0 }))
      .max(100, t('validation.number.max', { max: 100 }))
      .optional(),

    notes: yup.string().nullable(),
    terms_conditions: yup.string().nullable(),
    quotation_status: yup
      .string()
      .oneOf(['draft', 'sent', 'approved', 'rejected', 'expired', 'accepted'])
      .optional(),
  })
}
