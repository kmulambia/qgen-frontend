import type { IWorkspaceType, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for workspace type queries
const defaultWorkspaceTypeParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'name',
  sort_dir: 'asc',
}

// Create the workspace type store using the base store factory
export const useWorkspaceTypeStore = createBaseStore<IWorkspaceType, IRequestBaseParams>(
  'workspace-type',
  defaultWorkspaceTypeParams,
  'WorkspaceType'
)

export type WorkspaceTypeStore = ReturnType<typeof useWorkspaceTypeStore>
