import type { IPermission, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'
import type { PermissionApiService } from '@/service/api/permission-api-service'

// Default parameters for permission queries
const defaultPermissionParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'name',
  sort_dir: 'asc',
}

// Create the base permission store using the factory
const basePermissionStore = createBaseStore<IPermission, IRequestBaseParams>(
  'permission',
  defaultPermissionParams,
  'Permission'
)

// Extend the permission store with custom actions
export const usePermissionStore = () => {
  const store = basePermissionStore()

  // Add custom getAllGroups action
  return {
    ...store,

    /**
     * Get all unique permission group names
     * @returns Promise<string[]> - Array of unique group names
     */
    async getAllGroups(): Promise<string[]> {
      store.ensureServiceInitialized()
      store.clearError()

      try {
        const service = store._service as unknown as PermissionApiService
        if (typeof service.getAllGroups === 'function') {
          const groups = await service.getAllGroups()
          return groups
        }
        throw new Error('getAllGroups method not available on permission service')
      } catch (error) {
        store.setError(error as Error)
        throw error
      }
    }
  }
}

export type PermissionStore = ReturnType<typeof usePermissionStore>
