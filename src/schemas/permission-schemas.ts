import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const PermissionSchema = (t: TFunction) => {
  return yup.object({
    name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(100, t('validation.string.max', { max: 100 }))
      .matches(/^[A-Za-z0-9\s\-_]+$/, t('validation.string.alphanumeric'))
      .required(t('validation.mixed.required')),
    description: yup
      .string()
      .trim()
      .max(500, t('validation.string.max', { max: 500 }))
      .nullable()
      .optional(),
    group: yup
      .string()
      .trim()
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable()
      .optional(),
    code: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(50, t('validation.string.max', { max: 50 }))
      .matches(/^[A-Za-z0-9._-]+$/, t('validation.string.alphanumeric'))
      .required(t('validation.mixed.required')),
  })
}

export const PermissionCreateSchema = (t: TFunction) => {
  return yup.object({
    ...PermissionSchema(t).fields,
  })
}

export const PermissionUpdateSchema = (t: TFunction) => {
  return yup.object({
    name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(100, t('validation.string.max', { max: 100 }))
      .matches(/^[A-Za-z0-9\s\-_]+$/, t('validation.string.alphanumeric'))
      .optional(),
    description: yup
      .string()
      .trim()
      .max(500, t('validation.string.max', { max: 500 }))
      .nullable()
      .optional(),
    group: yup
      .string()
      .trim()
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable()
      .optional(),
    code: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(50, t('validation.string.max', { max: 50 }))
      .matches(/^[A-Za-z0-9._-]+$/, t('validation.string.alphanumeric'))
      .optional(),
  })
}
