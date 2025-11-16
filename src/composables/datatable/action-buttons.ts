import { PencilIcon, TrashIcon, ArrowPathIcon, Cog6ToothIcon, EyeIcon, PlusIcon, ArrowDownTrayIcon  } from '@heroicons/vue/24/outline'
import { useDataTableIconRenderer } from './icon-renderer'
import type { IBaseEntity } from '@/interfaces'
import { t } from 'i18next'

// DataTable action types
export type DataTableAction = 'view' | 'edit' | 'delete' | 'restore' | 'manage' | 'add' | 'download'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actionConfig: Record<DataTableAction, { icon: any; title: string; class: string }> = {
  manage: {
    icon: Cog6ToothIcon,
    title: t('system.crud.manage'),
    class: 'text-primary-400 hover:text-primary-600'
  },
  edit: {
    icon: PencilIcon,
    title: t('system.crud.edit'),
    class: 'text-primary-400 hover:text-primary-600'
  },
  delete: {
    icon: TrashIcon,
    title: t('system.crud.delete'),
    class: 'text-red-600 hover:text-red-800'
  },
  restore: {
    icon: ArrowPathIcon,
    title: t('system.crud.restore'),
    class: 'text-green-600 hover:text-green-800'
  },
  view: {
    icon: EyeIcon,
    title: t('system.crud.view'),
    class: 'text-blue-600 hover:text-blue-800'
  },
  add: {
    icon: PlusIcon,
    title: t('system.crud.add'),
    class: 'text-green-600 hover:text-green-800'
  },
  download: {
    icon: ArrowDownTrayIcon,
    title: t('system.crud.download'),
    class: 'text-green-600 hover:text-green-800'
  }
}

export function useDataTableActionButtons() {
  const { convertIconToHtmlString } = useDataTableIconRenderer()

  const generateActionButtonsHtml = <T extends IBaseEntity & { name: string }>(
    data: T,
    actions: DataTableAction[] = []
  ) => {
    if (!data) return ''

    const buttons = actions.map(action => {
      const config = actionConfig[action]
      if (!config) return ''

      return `
        <button type="button" class="inline-flex items-center p-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${config.class}" title="${config.title}" data-action="${action}">
          <span class="sr-only">${config.title} ${data.name}</span>
          ${convertIconToHtmlString(config.icon)}
        </button>
      `
    }).join('')

    return `<div class="flex items-center justify-end space-x-4">${buttons}</div>`
  }

  return {
    generateActionButtonsHtml,
  }
}
