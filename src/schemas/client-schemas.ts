import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const ClientSchema = (t: TFunction) => {
  return yup.object({
    // Company Information
    company_name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(255, t('validation.string.max', { max: 255 }))
      .required(t('validation.mixed.required')),
    registration_number: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    tax_id: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),

    // Address Information
    address_line1: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    address_line2: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    city: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    state: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    country: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    postal_code: yup
      .string()
      .trim()
      .max(20, t('validation.string.max', { max: 20 }))
      .nullable(),

    // Company Contact Information
    phone: yup
      .string()
      .matches(/^\+?[0-9\s-()]+$/, t('validation.string.phone'))
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable(),
    email: yup
      .string()
      .email(t('validation.string.email'))
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    website: yup
      .string()
      .url(t('validation.string.url'))
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),

    // Contact Person Information
    contact_person_name: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    contact_person_email: yup
      .string()
      .email(t('validation.string.email'))
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    contact_person_phone: yup
      .string()
      .matches(/^\+?[0-9\s-()]+$/, t('validation.string.phone'))
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable(),
    contact_person_position: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),

    // Additional Information
    notes: yup.string().nullable(),
  })
}

export const ClientCreateSchema = (t: TFunction) => {
  return ClientSchema(t)
}

export const ClientUpdateSchema = (t: TFunction) => {
  return yup.object({
    company_name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(255, t('validation.string.max', { max: 255 }))
      .optional(),
    registration_number: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    tax_id: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    address_line1: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    address_line2: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    city: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    state: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    country: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    postal_code: yup
      .string()
      .trim()
      .max(20, t('validation.string.max', { max: 20 }))
      .nullable(),
    phone: yup
      .string()
      .matches(/^\+?[0-9\s-()]+$/, t('validation.string.phone'))
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable(),
    email: yup
      .string()
      .email(t('validation.string.email'))
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    website: yup
      .string()
      .url(t('validation.string.url'))
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    contact_person_name: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    contact_person_email: yup
      .string()
      .email(t('validation.string.email'))
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    contact_person_phone: yup
      .string()
      .matches(/^\+?[0-9\s-()]+$/, t('validation.string.phone'))
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable(),
    contact_person_position: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    notes: yup.string().nullable(),
  })
}
