import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const RoleSchema = (t: TFunction) => {
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
    status: yup
      .string()
      .oneOf(['active', 'inactive', 'pending'], t('validation.string.oneOf', { values: 'active, inactive, pending' }))
      .required(t('validation.mixed.required')),
    is_system_defined: yup
      .boolean()
      .required(t('validation.mixed.required')),
  })
}

export const RoleCreateSchema = (t: TFunction) => {
  return yup.object({
    ...RoleSchema(t).fields,
  })
}

export const RoleUpdateSchema = (t: TFunction) => {
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
    status: yup
      .string()
      .oneOf(['active', 'inactive', 'pending'], t('validation.string.oneOf', { values: 'active, inactive, pending' }))
      .optional(),
    is_system_defined: yup
      .boolean()
      .optional(),
  })
}
