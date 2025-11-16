import type { IWorkspace, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for workspace queries
const defaultWorkspaceParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'name',
  sort_dir: 'asc',
}

// Create the workspace store using the base store factory
export const useWorkspaceStore = createBaseStore<IWorkspace, IRequestBaseParams>(
  'workspace',
  defaultWorkspaceParams,
  'Workspace'
)

export type WorkspaceStore = ReturnType<typeof useWorkspaceStore>
