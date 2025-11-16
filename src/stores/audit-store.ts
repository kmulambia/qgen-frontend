import type { IAudit, IRequestBaseParams, IUserSecuritySummary } from '@/interfaces'
import { createBaseStore } from './base-store'
import type { AuditApiService } from '@/service/api/audit-api-service'

// Default parameters for audit queries
const defaultAuditParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'created_at',
  sort_dir: 'desc',
}

// Create the base audit store using the factory
const baseAuditStore = createBaseStore<IAudit, IRequestBaseParams>(
  'audit',
  defaultAuditParams,
  'Audit'
)

// Extend the audit store with custom actions
export const useAuditStore = () => {
  const store = baseAuditStore()

  // Add custom getUserSecuritySummary action
  return {
    ...store,

    /**
     * Get user security summary
     * Optimized method that fetches all security data in a single request
     * @param userId - The user ID to fetch security summary for
     * @returns Promise<IUserSecuritySummary> - Security summary data
     */
    async getUserSecuritySummary(userId: string): Promise<IUserSecuritySummary> {
      store.ensureServiceInitialized()
      store.clearError()

      try {
        const service = store._service as unknown as AuditApiService
        if (typeof service.getUserSecuritySummary === 'function') {
          const summary = await service.getUserSecuritySummary(userId)
          return summary
        }
        throw new Error('getUserSecuritySummary method not available on audit service')
      } catch (error) {
        store.setError(error as Error)
        throw error
      }
    }
  }
}

export type AuditStore = ReturnType<typeof useAuditStore>


