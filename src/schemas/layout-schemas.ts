import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const LayoutSchema = (t: TFunction) => {
  return yup.object({
    // Basic Information
    name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(255, t('validation.string.max', { max: 255 }))
      .required(t('validation.mixed.required')),
    description: yup
      .string()
      .trim()
      .nullable(),

    // Layout Information Fields
    company_name: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    reference_number: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    email: yup
      .string()
      .email(t('validation.string.email'))
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    phone: yup
      .string()
      .matches(/^\+?[0-9\s-()]+$/, t('validation.string.phone'))
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable(),
    address: yup
      .string()
      .trim()
      .nullable(),

    // Terms and Conditions
    terms_conditions: yup
      .string()
      .trim()
      .nullable(),

    // Notes
    notes: yup
      .string()
      .trim()
      .nullable(),

    // Links (JSON object)
    links: yup
      .object()
      .nullable(),

    // Custom Fields (JSON object)
    custom_fields: yup
      .object()
      .nullable(),

    // Default Flag
    is_default: yup
      .boolean()
      .default(false),
  })
}

export const LayoutCreateSchema = (t: TFunction) => {
  return LayoutSchema(t)
}

export const LayoutUpdateSchema = (t: TFunction) => {
  return yup.object({
    name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(255, t('validation.string.max', { max: 255 }))
      .optional(),
    description: yup
      .string()
      .trim()
      .nullable(),
    company_name: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    reference_number: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    email: yup
      .string()
      .email(t('validation.string.email'))
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    phone: yup
      .string()
      .matches(/^\+?[0-9\s-()]+$/, t('validation.string.phone'))
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable(),
    address: yup
      .string()
      .trim()
      .nullable(),
    terms_conditions: yup
      .string()
      .trim()
      .nullable(),
    notes: yup
      .string()
      .trim()
      .nullable(),
    links: yup
      .object()
      .nullable(),
    custom_fields: yup
      .object()
      .nullable(),
    is_default: yup
      .boolean()
      .optional(),
  })
}
