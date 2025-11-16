/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TFunction } from 'i18next'

const errorCodes = [400, 401, 403, 404, 429, 409, 500]

interface ErrorResponse {
  statusCode: number
  name: string
  message: string
  operation?: string
  originalError?: any
  error?: any
}

export const handleError = (error: any, t?: TFunction, operation?: string): ErrorResponse => {
  const statusCode = error?.response?.status || error?.status || 500

  const err: ErrorResponse = {
    statusCode: statusCode,
    name: 'UnknownError',
    message: t ? t('errors.technical.defaultErrorMessage') : 'An unknown error occurred',
    operation: operation,
    originalError: error,
    error: error,
  }

  if (error.response?.data?.detail) {
    err.message = error.response.data.detail
  } else if (error.response?.data?.message) {
    err.message = error.response.data.message
  } else if (error.message) {
    err.message = error.message
  }

  if (!errorCodes.includes(statusCode)) {
    err.statusCode = 500
  }

  // Enhance error message with operation context
  const baseMessage = err.message
  const operationPrefix = operation ? `${operation} operation failed` : ''

  switch (err.statusCode) {
    case 400:
      err.name = 'BadRequestError'
      err.message = baseMessage || (t ? t('errors.http.400') : 'Invalid request')
      break

    case 401:
      err.name = 'UnauthorizedError'
      err.message =
        baseMessage ||
        (t ? t('errors.http.401', { message: baseMessage || '' }) : 'Unauthorized access')
      if (baseMessage === 'Authorization header not found.') {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
      }
      break

    case 403:
      err.name = 'ForbiddenError'
      err.message = baseMessage || (t ? t('errors.http.403') : 'Access forbidden')
      break

    case 404:
      err.name = 'NotFoundError'
      err.message = baseMessage || (t ? t('errors.http.404') : 'Resource not found')
      break

    case 409:
      err.name = 'ConflictError'
      err.message =
        baseMessage ||
        (t
          ? t('errors.http.409', { message: baseMessage || '' })
          : 'A conflict occurred on the server')
      break

    case 429:
      err.name = 'TooManyRequestsError'
      err.message = baseMessage || (t ? t('errors.http.429') : 'Too many requests')
      break

    case 500:
      err.name = 'ServerError'
      err.message =
        baseMessage ||
        (t ? t('errors.http.500', { message: baseMessage || '' }) : 'Internal server error')
      break
  }

  // Add operation context to message if available
  if (operation && !baseMessage) {
    err.message = `${operationPrefix}: ${err.message}`
  }

  return err
}

/**
 * Check if error is a 404 Not Found
 */
export const isNotFoundError = (error: unknown): boolean => {
  const errorObj = error as { response?: { status?: number } }
  return errorObj?.response?.status === 404
}

/**
 * Check if error is a 405 Method Not Allowed
 */
export const isMethodNotAllowedError = (error: unknown): boolean => {
  const errorObj = error as { response?: { status?: number } }
  return errorObj?.response?.status === 405
}

/**
 * Create an enhanced error that throws properly
 */
export const createApiError = (error: unknown, t?: TFunction, operation?: string): Error => {
  const errorResponse = handleError(error, t, operation)

  const enhancedError = new Error(errorResponse.message) as Error & ErrorResponse
  enhancedError.statusCode = errorResponse.statusCode
  enhancedError.name = errorResponse.name
  enhancedError.operation = errorResponse.operation
  enhancedError.originalError = errorResponse.originalError

  return enhancedError
}

export const formatErrorMessage = (error: any, t?: TFunction): string => {
  let error_message = ''
  if (error.statusCode) {
    const err = handleError(error, t)
    error_message = err.message
  } else {
    error_message = error
  }

  const failedText = t ? t('system.status.failed') : 'Failed'
  const defaultErrorText = t ? t('errors.technical.defaultErrorMessage') : 'Something went wrong'

  return `${failedText}\n${error_message || defaultErrorText}`
}

/**
 * Get localized error title based on error type
 */
export const getErrorTitle = (error: any, t?: TFunction): string => {
  const statusCode = error?.response?.status || error?.status || error?.statusCode || 500

  if (!t) {
    switch (statusCode) {
      case 403:
        return 'Forbidden'
      case 404:
        return 'Not Found'
      default:
        return 'Validation Error'
    }
  }

  switch (statusCode) {
    case 403:
      return t('errors.types.forbidden.title')
    case 404:
      return t('errors.types.notFound.title')
    default:
      return t('errors.types.validation.title')
  }
}

/**
 * Get localized error description based on error type
 */
export const getErrorDescription = (error: any, t?: TFunction): string => {
  const statusCode = error?.response?.status || error?.status || error?.statusCode || 500

  if (!t) {
    switch (statusCode) {
      case 403:
        return 'You do not have permission to access this resource'
      case 404:
        return 'The page you are looking for does not exist'
      default:
        return 'Please check your input and try again'
    }
  }

  switch (statusCode) {
    case 403:
      return t('errors.types.forbidden.description')
    case 404:
      return t('errors.types.notFound.description')
    default:
      return t('errors.types.validation.description')
  }
}

/**
 * Check if error is a network error and return localized message
 */
export const getNetworkErrorMessage = (error: any, t?: TFunction): string => {
  if (!t) {
    if (!error.response && error.request) {
      return 'Network error, please check your connection'
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out, please try again'
    }
    return 'Something went wrong'
  }

  if (!error.response && error.request) {
    return t('errors.technical.networkError')
  }
  if (error.code === 'ECONNABORTED') {
    return t('errors.technical.timeoutError')
  }
  return t('errors.technical.defaultErrorMessage')
}

/**
 * Handle session expiry with localized message
 */
export const handleSessionExpiry = (t?: TFunction): string => {
  return t ? t('errors.session.sessionExpired') : 'Your session has expired, please login again'
}
