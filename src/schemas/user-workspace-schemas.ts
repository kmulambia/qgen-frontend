import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const UserWorkspaceSchema = (t: TFunction) => {
  return yup.object({
    user_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .required(t('validation.mixed.required')),
    workspace_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .required(t('validation.mixed.required')),
    role_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .required(t('validation.mixed.required')),
    is_default: yup
      .boolean()
      .optional(),
  })
}

export const UserWorkspaceCreateSchema = (t: TFunction) => {
  return yup.object({
    ...UserWorkspaceSchema(t).fields,
  })
}

export const UserWorkspaceUpdateSchema = (t: TFunction) => {
  return yup.object({
    user_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .optional(),
    workspace_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .optional(),
    role_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .optional(),
    is_default: yup
      .boolean()
      .optional(),
  })
}

