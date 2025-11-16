import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const UserSchema = (t: TFunction) => {
  return yup.object({
    email: yup
      .string()
      .email(t('validation.string.email'))
      .required(t('validation.mixed.required')),
    first_name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(50, t('validation.string.max', { max: 50 }))
      .matches(/^[A-Za-z\s'-]+$/, t('validation.string.text'))
      .required(t('validation.mixed.required')),
    last_name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(50, t('validation.string.max', { max: 50 }))
      .matches(/^[A-Za-z\s'-]+$/, t('validation.string.text'))
      .required(t('validation.mixed.required')),
    phone: yup
      .string()
      .matches(/^\+?[0-9\s-()]+$/, t('validation.string.phone'))
      .required(t('validation.mixed.required')),
    sex: yup.string().nullable(),
    id_number: yup.string().nullable(),
    id_type: yup.string().nullable(),
    date_of_birth: yup.string().nullable(),
    status: yup.string().optional(),
  })
}

export const UserCreateSchema = (t: TFunction) => {
  return yup.object({
    ...UserSchema(t).fields,
    password: yup
      .string()
      .min(8, t('validation.string.min', { min: 8 }))
      .matches(/[A-Z]/, t('validation.string.uppercase'))
      .matches(/[a-z]/, t('validation.string.lowercase'))
      .matches(/[0-9]/, t('validation.string.number'))
      .matches(/[^A-Za-z0-9]/, t('validation.string.special'))
      .required(t('validation.mixed.required')),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password')], t('validation.password.mismatch'))
      .required(t('validation.mixed.required')),
    role_id: yup.string().required(t('validation.mixed.required')),
    workspace_id: yup.string().required(t('validation.mixed.required')),
  })
}

export const UserRegisterSchema = (t: TFunction) => {
  return yup.object({
    ...UserSchema(t).fields,
    password: yup
      .string()
      .min(8, t('validation.string.min', { min: 8 }))
      .matches(/[A-Z]/, t('validation.string.uppercase'))
      .matches(/[a-z]/, t('validation.string.lowercase'))
      .matches(/[0-9]/, t('validation.string.number'))
      .matches(/[^A-Za-z0-9]/, t('validation.string.special'))
      .required(t('validation.mixed.required')),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password')], t('validation.password.mismatch'))
      .required(t('validation.mixed.required')),
    role_id: yup.string().required(t('validation.mixed.required')),
    workspace_id: yup.string().required(t('validation.mixed.required')),
  })
}

export const ChangePasswordSchema = (t: TFunction) => {
  return yup.object({
    password: yup
      .string()
      .min(8, t('validation.string.min', { min: 8 }))
      .matches(/[A-Z]/, t('validation.string.uppercase'))
      .matches(/[a-z]/, t('validation.string.lowercase'))
      .matches(/[0-9]/, t('validation.string.number'))
      .matches(/[^A-Za-z0-9]/, t('validation.string.special'))
      .required(t('validation.mixed.required')),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password')], t('validation.password.mismatch'))
      .required(t('validation.mixed.required')),
  })
}
