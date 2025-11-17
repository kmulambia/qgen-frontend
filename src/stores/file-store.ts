import type { IFile, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for file queries
const defaultFileParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'original_filename',
  sort_dir: 'asc',
}

// Create the file store using the base store factory
export const useFileStore = createBaseStore<IFile, IRequestBaseParams>(
  'file',
  defaultFileParams,
  'File'
)

export type FileStore = ReturnType<typeof useFileStore>
