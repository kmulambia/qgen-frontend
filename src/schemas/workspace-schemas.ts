import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const WorkspaceSchema = (t: TFunction) => {
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
    workspace_type_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .nullable()
      .optional(),
    owner_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .nullable()
      .optional(),
    reference_name: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable()
      .optional(),
    reference_type: yup
      .string()
      .trim()
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable()
      .optional(),
    reference_number: yup
      .string()
      .trim()
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable()
      .optional(),
  })
}

export const WorkspaceCreateSchema = (t: TFunction) => {
  return yup.object({
    ...WorkspaceSchema(t).fields,
  })
}

export const WorkspaceUpdateSchema = (t: TFunction) => {
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
    workspace_type_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .nullable()
      .optional(),
    owner_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .nullable()
      .optional(),
    reference_name: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable()
      .optional(),
    reference_type: yup
      .string()
      .trim()
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable()
      .optional(),
    reference_number: yup
      .string()
      .trim()
      .max(50, t('validation.string.max', { max: 50 }))
      .nullable()
      .optional(),
  })
}
