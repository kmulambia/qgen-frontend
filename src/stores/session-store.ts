import { defineStore } from 'pinia'
import type { ILogin, ISession, ISessionUser, IAuthState, ISelfRegister, IOTPRequest, IPasswordReset, IPasswordChange, ISessionPermission, ISessionRole } from '@/interfaces'
import { AuthenticationApiService } from '@/service/api/authentication-api-service'
import type { Http } from '@/utils/http'

export const useSessionStore = defineStore('session', {
  state: (): IAuthState => ({
    session: null,
    email: null,
    isLoggedIn: false,
    loginTimestamp: null,
    expiresAt: null,
    isLoading: false,
    error: null,
    _service: null,
  }),

  getters: {
    /**
     * Check if service is initialized
     */
    isServiceInitialized(state): boolean {
      return state._service !== null
    },

    /**
     * Get current access token
     */
    accessToken(state): string | null {
      return state.session?.token?.jwt_token || null
    },

    /**
     * Get current refresh token
     */
    refreshTokenValue(state): string | null {
      return state.session?.token?.jwt_token || null
    },

    /**
     * Get token type (usually "Bearer")
     */
    tokenType(state): string | null {
      return state.session?.token?.token_type || null
    },

    /**
     * Get current user
     */
    currentUser(state): ISessionUser | null {
      return state.session?.user || null
    },

    /**
     * Check if token is expired
     */
    isTokenExpired(state): boolean {
      if (!state.expiresAt) return true
      return Date.now() >= state.expiresAt
    },

    /**
     * Check if token will expire soon (within 5 minutes)
     */
    isTokenExpiringSoon(state): boolean {
      if (!state.expiresAt) return true
      const fiveMinutes = 5 * 60 * 1000
      return Date.now() >= state.expiresAt - fiveMinutes
    },

    /**
     * Get authorization header value
     */
    authorizationHeader(state): string | null {
      if (!state.session?.token?.token_type || !state.session?.token?.jwt_token) {
        return null
      }
      return `${state.session.token.token_type} ${state.session.token.jwt_token}`
    },

    /**
     * Check if there's an active error
     */
    hasError(state): boolean {
      return state.error !== null
    },

    /**
     * Get session info
     */
    sessionInfo(): {
      email: string | null
      isLoggedIn: boolean
      loginTimestamp: number | null
      expiresAt: number | null
      isTokenExpired: boolean
      isTokenExpiringSoon: boolean
      currentUser: ISessionUser | null
    } {
      return {
        email: this.email,
        isLoggedIn: this.isLoggedIn,
        loginTimestamp: this.loginTimestamp,
        expiresAt: this.expiresAt,
        isTokenExpired: this.isTokenExpired,
        isTokenExpiringSoon: this.isTokenExpiringSoon,
        currentUser: this.currentUser,
      }
    },

    /**
     * Get current user permissions
     */
    userPermissions(state): ISessionPermission[] {
      return state.session?.permissions || []
    },

    /**
     * Get current user role
     */
    userRole(state): ISessionRole | null {
      return state.session?.role || null
    },

    /**
     * Check if user has super admin access (wildcard permission)
     */
    isSuperAdmin(state): boolean {
      const permissions = state.session?.permissions || []
      return permissions.some(permission => permission.code === '*')
    },

    /**
     * Get permission codes as array
     */
    permissionCodes(state): string[] {
      const permissions = state.session?.permissions || []
      return permissions.map(permission => permission.code)
    },

    /**
     * Get permissions by group
     */
    permissionsByGroup(state): Record<string, ISessionPermission[]> {
      const permissions = state.session?.permissions || []
      return permissions.reduce((groups, permission) => {
        const group = permission.group || 'uncategorized'
        if (!groups[group]) {
          groups[group] = []
        }
        groups[group].push(permission)
        return groups
      }, {} as Record<string, ISessionPermission[]>)
    },
  },

  actions: {
    // ==========================================
    // SERVICE MANAGEMENT
    // ==========================================

    /**
     * Set the service instance
     */
    setService(httpClient: Http) {
      this._service = new AuthenticationApiService(httpClient)
      this.error = null
    },

    /**
     * Ensure service is initialized
     */
    ensureServiceInitialized() {
      if (!this._service) {
        throw new Error('AuthenticationApiService not initialized. Call setService() first.')
      }
    },

    // ==========================================
    // ERROR MANAGEMENT
    // ==========================================

    /**
     * Clear the error
     */
    clearError() {
      this.error = null
    },

    /**
     * Set error state
     */
    setError(error: string | Error) {
      this.error = typeof error === 'string' ? error : error.message
      console.error('Auth Store Error:', error)
    },

    // ==========================================
    // AUTHENTICATION OPERATIONS
    // ==========================================

    /**
     * Login with email and password
     */
    async login(loginData: ILogin): Promise<ISession> {
      this.ensureServiceInitialized()
      this.isLoading = true
      this.clearError()

      try {
        const response = await this._service!.login(loginData)

        // Calculate expiration timestamp from token expires_at
        const now = Date.now()
        const expiresAt = response.token?.expires_at
          ? new Date(response.token.expires_at).getTime()
          : now + (24 * 60 * 60 * 1000) // Default to 24 hours

        // Update store state
        this.session = response
        this.email = loginData.email
        this.isLoggedIn = true
        this.loginTimestamp = now
        this.expiresAt = expiresAt

        // Session is automatically persisted by Pinia persist plugin

        return response
      } catch (error) {
        this.setError(error as Error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Refresh authentication token
     * Note: The new AuthenticationApiService doesn't have a refresh token method
     * This would need to be implemented if token refresh is required
     */
    async refreshToken(): Promise<ISession> {
      this.ensureServiceInitialized()

      if (!this.session?.token?.jwt_token) {
        throw new Error('No token available for refresh')
      }

      this.isLoading = true
      this.clearError()

      try {
        // For now, we'll just return the current session
        // In a real implementation, you'd call a refresh endpoint
        const now = Date.now()
        const expiresAt = this.session.token?.expires_at
          ? new Date(this.session.token.expires_at).getTime()
          : now + (24 * 60 * 60 * 1000) // Default to 24 hours

        this.expiresAt = expiresAt

        return this.session
      } catch (error) {
        // If refresh fails, clear session
        this.logout()
        this.setError(error as Error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Set user details (called from components after fetching)
     */
    setUserDetails(userDetails: ISessionUser) {
      if (this.session) {
        this.session.user = userDetails
      }
    },

    /**
     * Clear user details
     */
    clearUserDetails() {
      if (this.session) {
        this.session.user = undefined
      }
    },

    /**
     * Self register a new user
     */
    async selfRegister(registerData: ISelfRegister): Promise<ISessionUser> {
      this.ensureServiceInitialized()
      this.isLoading = true
      this.clearError()

      try {
        const response = await this._service!.selfRegister(registerData)
        return response
      } catch (error) {
        this.setError(error as Error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Request OTP for password reset or email verification
     */
    async requestOTP(otpData: IOTPRequest): Promise<void> {
      this.ensureServiceInitialized()
      this.isLoading = true
      this.clearError()

      try {
        await this._service!.requestOTP(otpData)
      } catch (error) {
        this.setError(error as Error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Reset password using OTP
     */
    async resetPassword(resetData: IPasswordReset): Promise<void> {
      this.ensureServiceInitialized()
      this.isLoading = true
      this.clearError()

      try {
        await this._service!.resetPassword(resetData)
      } catch (error) {
        this.setError(error as Error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Change password (requires authentication)
     */
    async changePassword(passwordData: IPasswordChange): Promise<void> {
      this.ensureServiceInitialized()
      this.isLoading = true
      this.clearError()

      try {
        await this._service!.changePassword(passwordData)
      } catch (error) {
        this.setError(error as Error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Auto-refresh token if it's expiring soon
     */
    async autoRefreshToken(): Promise<boolean> {
      if (!this.isLoggedIn || !this.isTokenExpiringSoon) {
        return false
      }

      try {
        await this.refreshToken()
        return true
      } catch (error) {
        console.warn('Auto token refresh failed:', error)
        return false
      }
    },

    /**
     * Logout and clear session
     */
    logout() {
      // Clear all session data
      this.session = null
      this.email = null
      this.isLoggedIn = false
      this.loginTimestamp = null
      this.expiresAt = null
      this.error = null

      // Session clearing is automatically handled by Pinia persist plugin
    },

    /**
     * Clear all session data (alias for logout)
     */
    clearSession() {
      this.logout()
    },

    // ==========================================
    // SESSION VALIDATION
    // ==========================================

    /**
     * Validate current session
     */
    validateSession(): boolean {
      if (!this.isLoggedIn || !this.session) {
        return false
      }

      if (this.isTokenExpired) {
        this.logout()
        return false
      }

      return true
    },

    /**
     * Initialize store (session is automatically restored by Pinia persist plugin)
     */
    async initialize(): Promise<boolean> {
      // Session is automatically loaded by Pinia persist plugin
      // Just validate and auto-refresh if needed
      if (this.validateSession()) {
        // Auto-refresh if token is expiring soon
        try {
          await this.autoRefreshToken()
        } catch (error) {
          console.warn('Auto refresh during initialization failed:', error)
        }
        return true
      }

      return false
    },

    /**
     * Reset store to initial state
     */
    resetStore() {
      this.logout()
      this.isLoading = false
    },

    // ==========================================
    // PERMISSION CHECKING
    // ==========================================

    /**
     * Check if user has a specific permission
     * @param permissionCode - The permission code to check (e.g., "user-management.user.create")
     * @returns true if user has the permission, false otherwise
     */
    hasPermission(permissionCode: string): boolean {
      if (!this.isLoggedIn || !this.session?.permissions) {
        return false
      }

      // Check for super admin wildcard permission
      if (this.isSuperAdmin) {
        return true
      }

      // Check for exact permission match
      const hasExactPermission = this.session.permissions.some(
        permission => permission.code === permissionCode
      )

      if (hasExactPermission) {
        return true
      }

      // Check for wildcard permissions (e.g., "user-management.*" matches "user-management.user.create")
      const hasWildcardPermission = this.session.permissions.some(permission => {
        if (permission.code.endsWith('.*')) {
          const wildcardPrefix = permission.code.slice(0, -2) // Remove ".*"
          return permissionCode.startsWith(wildcardPrefix + '.')
        }
        return false
      })

      return hasWildcardPermission
    },

    /**
     * Check if user has any of the specified permissions
     * @param permissionCodes - Array of permission codes to check
     * @returns true if user has at least one of the permissions, false otherwise
     */
    hasAnyPermission(permissionCodes: string[]): boolean {
      if (!this.isLoggedIn || !this.session?.permissions || permissionCodes.length === 0) {
        return false
      }

      // Check for super admin wildcard permission
      if (this.isSuperAdmin) {
        return true
      }

      return permissionCodes.some(permissionCode => this.hasPermission(permissionCode))
    },

    /**
     * Check if user has all of the specified permissions
     * @param permissionCodes - Array of permission codes to check
     * @returns true if user has all permissions, false otherwise
     */
    hasAllPermissions(permissionCodes: string[]): boolean {
      if (!this.isLoggedIn || !this.session?.permissions || permissionCodes.length === 0) {
        return false
      }

      // Check for super admin wildcard permission
      if (this.isSuperAdmin) {
        return true
      }

      return permissionCodes.every(permissionCode => this.hasPermission(permissionCode))
    },

    /**
     * Check if user has permissions for a specific group
     * @param groupName - The permission group to check (e.g., "user-management")
     * @returns true if user has any permission in the group, false otherwise
     */
    hasGroupPermission(groupName: string): boolean {
      if (!this.isLoggedIn || !this.session?.permissions) {
        return false
      }

      // Check for super admin wildcard permission
      if (this.isSuperAdmin) {
        return true
      }

      return this.session.permissions.some(permission => permission.group === groupName)
    },

    /**
     * Check if user has a specific permission in a group
     * @param groupName - The permission group
     * @param permissionName - The specific permission name within the group
     * @returns true if user has the permission, false otherwise
     */
    hasGroupSpecificPermission(groupName: string, permissionName: string): boolean {
      const permissionCode = `${groupName}.${permissionName}`
      return this.hasPermission(permissionCode)
    },

    /**
     * Get all permissions for a specific group
     * @param groupName - The permission group name
     * @returns Array of permissions in the group
     */
    getGroupPermissions(groupName: string): ISessionPermission[] {
      if (!this.isLoggedIn || !this.session?.permissions) {
        return []
      }

      return this.session.permissions.filter(permission => permission.group === groupName)
    },

    /**
     * Check if user has a specific role
     * @param roleName - The role name to check
     * @returns true if user has the role, false otherwise
     */
    hasRole(roleName: string): boolean {
      if (!this.isLoggedIn || !this.session?.role) {
        return false
      }

      return this.session.role.name === roleName
    },

    /**
     * Check if user has any of the specified roles
     * @param roleNames - Array of role names to check
     * @returns true if user has at least one of the roles, false otherwise
     */
    hasAnyRole(roleNames: string[]): boolean {
      if (!this.isLoggedIn || !this.session?.role || roleNames.length === 0) {
        return false
      }

      return roleNames.includes(this.session.role.name)
    },

    /**
     * Check if user is a system role (typically admin roles)
     * @returns true if user has a system role, false otherwise
     */
    isSystemRole(): boolean {
      if (!this.isLoggedIn || !this.session?.role) {
        return false
      }

      return this.session.role.is_system
    },

    /**
     * Get permission summary for debugging/logging
     * @returns Object with permission summary information
     */
    getPermissionSummary(): {
      isLoggedIn: boolean
      isSuperAdmin: boolean
      role: string | null
      isSystemRole: boolean
      totalPermissions: number
      permissionGroups: string[]
      permissionCodes: string[]
    } {
      return {
        isLoggedIn: this.isLoggedIn,
        isSuperAdmin: this.isSuperAdmin,
        role: this.session?.role?.name || null,
        isSystemRole: this.isSystemRole(),
        totalPermissions: this.session?.permissions?.length || 0,
        permissionGroups: Object.keys(this.permissionsByGroup),
        permissionCodes: this.permissionCodes,
      }
    },
  },

  persist: {
    storage: sessionStorage,
    pick: [
      'session',
      'email',
      'isLoggedIn',
      'loginTimestamp',
      'expiresAt',
    ],
  },
})

export type SessionStore = ReturnType<typeof useSessionStore>
