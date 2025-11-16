export interface ILogin {
  email: string
  password: string
}

export interface ISelfRegister {
  first_name: string
  last_name: string
  phone: string
  email: string
  sex?: string
  id_number?: string
  id_type?: string
  date_of_birth?: string
  password: string
  role_id?: string
  workspace?: unknown
}

export interface IPasswordChange {
  user_id: string
  password: string
}

export interface IOTPRequest {
  email: string
  otp_type: 'password_reset' | 'email_verification'
}

export interface IPasswordReset {
  email: string
  code: string
  new_password: string
}

export interface ISessionUser {
  id: string
  first_name: string
  last_name: string
  email: string
}

export interface ISessionToken {
  jwt_token: string
  token_type: string
  expires_at: string
}

export interface ISessionWorkspace {
  id: string
  name: string
  description?: string
  workspace_type?: unknown
}

export interface ISessionUserWorkspace {
  id: string
  workspace: ISessionWorkspace
}

export interface ISessionRole {
  id: string
  name: string
  description?: string
  is_system: boolean
}

export interface ISessionPermission {
  id: string
  name: string
  description: string
  group: string
  code: string
}

export interface ISession {
  user?: ISessionUser
  token?: ISessionToken
  current_workspace?: ISessionUserWorkspace
  role?: ISessionRole
  permissions?: ISessionPermission[]
  user_workspaces?: ISessionUserWorkspace[]
}

export interface IOTPVerify {
  email: string
  code: string
  newPassword?: string
}

export interface IForgotPasswordEmail {
  email: string
}

export interface IForgotPasswordOTP {
  otp: string
}

export interface IForgotPasswordReset {
  password: string
  confirmPassword: string
}

export interface ICandidateLogin {
  examinationNumber: string
  dateOfBirth: string
}

export interface IValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface IHTTPValidationError {
  detail: IValidationError[]
}

export interface IAuthState {
  // Authentication data
  session: ISession | null

  // Login credentials (for session management)
  email: string | null

  // Session state
  isLoggedIn: boolean
  loginTimestamp: number | null
  expiresAt: number | null // Calculated timestamp when token expires

  // Loading and error states
  isLoading: boolean
  error: string | null

  // Service instance (will be set at runtime)
  _service: {
    login: (data: ILogin) => Promise<ISession>
    selfRegister: (data: ISelfRegister) => Promise<ISessionUser>
    requestOTP: (data: IOTPRequest) => Promise<void>
    resetPassword: (data: IPasswordReset) => Promise<void>
    changePassword: (data: IPasswordChange) => Promise<void>
  } | null
}
