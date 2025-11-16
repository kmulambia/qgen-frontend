import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const RolePermissionSchema = (t: TFunction) => {
  return yup.object({
    role_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .required(t('validation.mixed.required')),
    permission_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .required(t('validation.mixed.required')),
  })
}

export const RolePermissionCreateSchema = (t: TFunction) => {
  return yup.object({
    ...RolePermissionSchema(t).fields,
  })
}

export const RolePermissionUpdateSchema = (t: TFunction) => {
  return yup.object({
    role_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .optional(),
    permission_id: yup
      .string()
      .uuid(t('validation.string.uuid'))
      .optional(),
  })
}
