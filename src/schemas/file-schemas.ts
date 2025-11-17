import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const FileSchema = (t: TFunction) => {
  return yup.object({
    // File Information
    original_filename: yup
      .string()
      .trim()
      .min(1, t('validation.string.min', { min: 1 }))
      .max(255, t('validation.string.max', { max: 255 }))
      .required(t('validation.mixed.required')),
    stored_filename: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    full_path: yup
      .string()
      .trim()
      .max(500, t('validation.string.max', { max: 500 }))
      .nullable(),
    content_type: yup
      .string()
      .trim()
      .required(t('validation.mixed.required')),
    size: yup
      .number()
      .positive(t('validation.number.positive'))
      .required(t('validation.mixed.required')),

    // Metadata
    file_metadata: yup.mixed().nullable(),

    // Category/Type
    category: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    tags: yup.array().of(yup.string()).nullable(),

    // Description
    description: yup
      .string()
      .trim()
      .max(1000, t('validation.string.max', { max: 1000 }))
      .nullable(),
  })
}

export const FileCreateSchema = (t: TFunction) => {
  return FileSchema(t)
}

export const FileUpdateSchema = (t: TFunction) => {
  return yup.object({
    original_filename: yup
      .string()
      .trim()
      .min(1, t('validation.string.min', { min: 1 }))
      .max(255, t('validation.string.max', { max: 255 }))
      .optional(),
    stored_filename: yup
      .string()
      .trim()
      .max(255, t('validation.string.max', { max: 255 }))
      .nullable(),
    full_path: yup
      .string()
      .trim()
      .max(500, t('validation.string.max', { max: 500 }))
      .nullable(),
    content_type: yup
      .string()
      .trim()
      .optional(),
    size: yup.number().positive(t('validation.number.positive')).optional(),
    file_metadata: yup.mixed().nullable(),
    category: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable(),
    tags: yup.array().of(yup.string()).nullable(),
    description: yup
      .string()
      .trim()
      .max(1000, t('validation.string.max', { max: 1000 }))
      .nullable(),
  })
}
