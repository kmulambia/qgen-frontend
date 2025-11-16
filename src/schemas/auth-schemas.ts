import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const LoginSchema = (t: TFunction) => {
  return yup.object({
    email: yup
      .string()
      .email(t('validation.string.email'))
      .required(t('validation.mixed.required')),
    password: yup
      .string()
      .min(8, t('validation.string.min', { min: 8 }))
      .matches(/[A-Z]/, t('validation.string.uppercase'))
      .matches(/[a-z]/, t('validation.string.lowercase'))
      .matches(/[0-9]/, t('validation.string.number'))
      .matches(/[^A-Za-z0-9]/, t('validation.string.special'))
      .required(t('validation.mixed.required')),
    remember_me: yup.boolean().optional(),
  })
}

export const ForgotPasswordSchema = (t: TFunction) => {
  return yup.object({
    email: yup
      .string()
      .email(t('validation.string.email'))
      .required(t('validation.mixed.required')),
  })
}

export const CandidateLoginSchema = (t: TFunction) => {
  return yup.object({
    examinationNumber: yup
      .string()
      .required(t('validation.mixed.required'))
      .min(8, t('validation.string.min', { min: 8 }))
      .matches(/^[A-Z0-9/]+$/, 'Invalid examination number format'),
    dateOfBirth: yup
      .string()
      .required(t('validation.mixed.required'))
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  })
}
