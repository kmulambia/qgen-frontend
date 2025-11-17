<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-2">
      <BreadcrumbComponents :items="breadcrumb_items" />
      <!-- Filter and Search Section -->
      <div class="col-span-12">
        <div class="theme-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 mb-4">
          <!-- Single Row Layout -->
          <div class="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
            <!-- Search Input -->
            <div class="flex-1 w-full lg:w-auto">
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 capitalize">
                {{ t('system.table.search') }}
              </label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search files..."
                  class="theme-input w-full pl-10"
                />
              </div>
            </div>

            <!-- Category Filter -->
            <div class="w-full sm:w-40">
              <label for="category-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category
              </label>
              <select
                id="category-filter"
                v-model="categoryFilter"
                class="theme-input w-full cursor-pointer"
              >
                <option value="">All</option>
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 w-full sm:w-auto">
              <button
                v-if="canCreate"
                type="button"
                @click="openUploadModal"
                class="theme-btn theme-btn-primary flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 h-[42px]"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Files
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="theme-card bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-600"
      >
        <DataTable ref="table" :columns="columns" :options="tableOptions" />
      </div>
    </div>

    <!-- Upload Files Modal -->
    <FileForm
      v-if="modalMode === 'upload'"
      :open="showModal"
      :key="`upload-${showModal}-${Date.now()}`"
      :loading="isSubmitting"
      :title="modalTitle"
      :mode="'upload'"
      @onClose="closeModal"
      @onSubmit="handleFileUpload"
    />

    <!-- Edit File Modal -->
    <FileForm
      v-if="modalMode === 'edit'"
      :open="showModal"
      :key="`edit-${showModal}-${selectedFile?.id}-${Date.now()}`"
      :loading="isSubmitting"
      :file="selectedFile"
      :title="modalTitle"
      :mode="'edit'"
      :fields="[
        { name: 'original_filename', required: true },
        { name: 'category' },
        { name: 'tags' },
        { name: 'description' }
      ]"
      @onClose="closeModal"
      @onSubmit="handleFileSubmit"
    />

    <!-- View File Modal -->
    <FileForm
      v-if="modalMode === 'view'"
      :open="showModal"
      :key="`view-${showModal}-${selectedFile?.id}-${Date.now()}`"
      :loading="false"
      :file="selectedFile"
      :title="modalTitle"
      :mode="'view'"
      :fields="[
        { name: 'original_filename', required: true },
        { name: 'content_type' },
        { name: 'size' },
        { name: 'category' },
        { name: 'tags' },
        { name: 'description' }
      ]"
      @onClose="closeModal"
      @onDownload="handleDownload"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmationComponent
      :open="showDeleteConfirmation"
      :title="`Delete File`"
      :description="`Are you sure you want to ${hardDeleteMode ? 'permanently' : 'soft'} delete '${fileToDelete?.original_filename}'? ${hardDeleteMode ? 'This action cannot be undone.' : 'You can restore it later.'}`"
      :secure-mode="true"
      confirm-button-text="Delete"
      cancel-button-text="Cancel"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
      @update:open="showDeleteConfirmation = $event"
    >
      <template #content>
        <div class="mt-4 flex items-center space-x-3">
          <div class="flex h-6 shrink-0 items-center">
            <div class="group grid size-4 grid-cols-1">
              <input
                v-model="hardDeleteMode"
                id="hardDeleteMode"
                name="hardDeleteMode"
                type="checkbox"
                class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-red-500 checked:bg-red-500 indeterminate:border-red-500 indeterminate:bg-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto dark:border-gray-600 dark:bg-gray-700 dark:checked:border-red-500 dark:checked:bg-red-500 transition-all duration-200"
              />
              <svg
                class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  class="opacity-0 group-has-[:checked]:opacity-100"
                  d="M3 8L6 11L11 3.5"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <label
            for="hardDeleteMode"
            class="text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Permanently delete (Hard Delete)
          </label>
        </div>
      </template>
    </ConfirmationComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject, computed } from 'vue'
import type { IFile, IRequestFilterCondition } from '@/interfaces'
import type { IDataTableCallback } from '@/interfaces/datatables-interfaces'
import { IRequestFilterOperator } from '@/interfaces'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import 'datatables.net-buttons'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'datatables.net-buttons/js/buttons.print.js'
import LoadingComponent from '@/components/loading-component.vue'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import { useDataTableActionButtons, useDataTableQueryBuilder, type DataTableAction } from '@/composables/datatable'
import { useBreadcrumbs } from '@/composables/use-breadcrumbs'
import ConfirmationComponent from '@/components/confirmation-component.vue'
import FileForm from './file-form.vue'
import moment from 'moment'
import { useToast } from 'vue-toastification'
import { formatErrorMessage } from '@/utils/errors'
import type { useFileStore } from '@/stores/file-store'
import { useTranslation } from 'i18next-vue'
import { useSessionStore } from '@/stores/session-store'
import { useFileIcon } from '@/composables/useFileIcon'
import { useDataTableIconRenderer } from '@/composables/datatable/icon-renderer'
import type { FileApiService } from '@/service/api/file-api-service'

DataTable.use(DataTablesCore)

// DataTable parameter interface
interface DataTableParams {
  draw: number
  start: number
  length: number
  search: { value: string }
  order: Array<{ column: number; dir: 'asc' | 'desc' }>
}

const table = ref()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dt: any
const toast = useToast()
const { t } = useTranslation()
const { getFileIcon } = useFileIcon()
const { convertIconToHtmlString } = useDataTableIconRenderer()

// Session store for permissions
const sessionStore = useSessionStore()

// Inject file store and service
const fileStore = inject<ReturnType<typeof useFileStore>>('fileStore')!
const fileApiService = inject<FileApiService>('fileApiService')!

// Permission checks with hierarchy consideration
const canCreate = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('file.*') ||
  sessionStore.hasPermission('file.create')
)

const canView = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('file.*') ||
  sessionStore.hasPermission('file.view')
)

const canEdit = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('file.*') ||
  sessionStore.hasPermission('file.update')
)

const canDelete = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('file.*') ||
  sessionStore.hasPermission('file.delete')
)

const canList = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('file.*') ||
  sessionStore.hasPermission('file.list')
)

// Modal state management
const showModal = ref(false)
const isSubmitting = ref(false)
const selectedFile = ref<IFile | null>(null)
const modalTitle = ref('Upload Files')
const modalMode = ref<'upload' | 'edit' | 'view'>('upload')

// Delete confirmation state
const showDeleteConfirmation = ref(false)
const fileToDelete = ref<IFile | null>(null)
const hardDeleteMode = ref(false)

// DataTable loading state
const isLoadingData = ref(false)

// Filter state
const searchQuery = ref('')
const categoryFilter = ref('')

// DataTable actions
const dataTableActions = ref<DataTableAction[]>([])
const eventHandlersSetUp = ref(false)

// DataTable composables
const { generateActionButtonsHtml } = useDataTableActionButtons()
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()

const columns = [
  {
    data: null,
    title: '',
    exportable: false,
    orderable: false,
    sortable: false,
    className: 'text-center w-8',
    render: (data: IFile) => {
      const icon = getFileIcon(data.content_type)
      return `<div class="flex justify-center">${convertIconToHtmlString(icon)}</div>`
    },
  },
  {
    data: 'original_filename',
    title: 'Name',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'font-medium',
    render: function (data: string) {
      return data
    },
  },
  {
    data: 'content_type',
    title: 'Type',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data || 'N/A'
    },
  },
  {
    data: 'size',
    title: 'Size',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: number) {
      return `${(data / (1024 * 1024)).toFixed(2)} MB`
    },
  },
  {
    data: 'category',
    title: 'Category',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'capitalize',
    render: function (data: string) {
      return data || 'N/A'
    },
  },
  {
    data: 'created_at',
    title: 'Created Date',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data ? moment(data).format('DD/MM/YYYY') : 'N/A'
    },
    className: 'capitalize',
  },
  {
    data: 'updated_at',
    title: 'Last Updated',
    exportable: true,
    orderable: true,
    visible: false,
    render: function (data: string) {
      return data ? moment(data).format('DD/MM/YYYY') : 'N/A'
    },
    className: 'capitalize',
  },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    className: 'text-right',
    exportable: false,
    render: (data: IFile & { name: string }) => {
      // Create a version with 'name' property for action buttons
      const fileWithName = {
        ...data,
        name: data.original_filename
      }
      return generateActionButtonsHtml(fileWithName, dataTableActions.value)
    },
  },
]

// DataTable options with server-side processing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableOptions: any = {
  dom: `
    <"flex flex-wrap justify-between items-center mb-4 gap-2 sm:flex-nowrap"<"flex items-center gap-2"B>>
    <"table-container overflow-auto"rt>
    <"flex items-center justify-between mt-4 gap-4"<"flex-shrink-0"l><"flex-grow flex justify-center"p><"flex-shrink-0"i>>
  `,
  searching: false,
  serverSide: true,
  name: 'files',
  processing: true,
  responsive: true,
  buttons: [
    {
      extend: 'colvis',
      columns: ':not(:last-child)',
      className: 'capitalize',
      text: t('system.table.columns'),
    },
    {
      extend: 'csvHtml5',
      text: t('system.data.exportToCSV'),
      className: 'capitalize',
      exportOptions: {
        columns: columns
          .map((col, index) => col.exportable ? index : null)
          .filter((index): index is number => index !== null)
      },
      filename: () => `files_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
    {
      extend: 'print',
      text: t('system.data.exportToPrint'),
      className: 'capitalize',
      exportOptions: {
        columns: columns
          .map((col, index) => col.exportable ? index : null)
          .filter((index): index is number => index !== null)
      },
      filename: () => `files_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ajax: async (dtParams: any, callback: (response: IDataTableCallback<IFile>) => void) => {
    const response = await handleFetch(dtParams)
    callback(response)
  },
  lengthMenu: [10, 25, 50, 100],
  pageLength: 10,
  select: false,
  selectable: false,
  ordering: true,
  order: [[1, 'asc']],
}

// Modal management functions
const openUploadModal = () => {
  if (!canCreate.value) {
    toast.error('You do not have permission to upload files')
    return
  }
  selectedFile.value = null
  modalTitle.value = 'Upload Files'
  modalMode.value = 'upload'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedFile.value = null
}

// Delete confirmation handlers
const handleDeleteConfirm = async () => {
  if (!fileToDelete.value) return

  try {
    await fileStore.delete(fileToDelete.value.id!, hardDeleteMode.value)
    if (table.value?.dt) {
      table.value.dt.ajax.reload()
    }
    toast.success(`File ${hardDeleteMode.value ? 'permanently deleted' : 'soft deleted'} successfully`)
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    showDeleteConfirmation.value = false
    fileToDelete.value = null
    hardDeleteMode.value = false
  }
}

const handleDeleteCancel = () => {
  showDeleteConfirmation.value = false
  fileToDelete.value = null
  hardDeleteMode.value = false
}

const handleFileUpload = async (files: File[]) => {
  if (!canCreate.value) {
    toast.error('You do not have permission to upload files')
    return
  }

  isSubmitting.value = true
  try {
    await fileApiService.upload(files, (percentage) => {
      console.log(`Upload progress: ${percentage}%`)
    })
    toast.success('Files uploaded successfully')

    if (table.value?.dt) {
      table.value.dt.ajax.reload()
    }
    closeModal()
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isSubmitting.value = false
  }
}

const handleFileSubmit = async (fileData: IFile) => {
  if (!canEdit.value) {
    toast.error('You do not have permission to update files')
    return
  }

  isSubmitting.value = true
  try {
    if (selectedFile.value && selectedFile.value.id) {
      await fileStore.update(selectedFile.value.id, fileData)
      toast.success('File updated successfully')
    }

    if (table.value?.dt) {
      table.value.dt.ajax.reload()
    }
    closeModal()
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isSubmitting.value = false
  }
}

const handleDownload = async (id: string) => {
  try {
    const blob = await fileApiService.download(id)
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  }
}

// DataTable fetch handler using query builder
const handleFetch = async (dtParams: DataTableParams): Promise<IDataTableCallback<IFile>> => {
  try {
    if (!canList.value) {
      toast.error('You do not have permission to view files')
      return buildErrorResponse(dtParams.draw, 'Permission denied')
    }

    const query = buildFilterQuery(dtParams, columns, {
      include_deleted: false,
    })

    // Add search query to params
    if (searchQuery.value) {
      query.search = searchQuery.value
    }

    // Add custom filters
    const filters: IRequestFilterCondition[] = []

    // Add category filter if selected
    if (categoryFilter.value) {
      filters.push({
        field: 'category',
        operator: IRequestFilterOperator.EQUALS,
        value: categoryFilter.value
      })
    }

    const response = await fileStore.query(query, filters)

    if (response && response.items) {
      return {
        draw: dtParams.draw,
        recordsTotal: response.total || response.items.length,
        recordsFiltered: response.total || response.items.length,
        data: response.items,
      }
    }

    return buildErrorResponse(dtParams.draw, 'No data received')
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    return buildErrorResponse(dtParams.draw, error)
  }
}

// Breadcrumbs from route metadata
const { breadcrumbs: breadcrumb_items } = useBreadcrumbs()

// Set permissions for DataTable actions
const setPermissions = () => {
  //view permission
  if (sessionStore.hasAnyPermission(['.*', 'file.*', 'file.view'])) {
    dataTableActions.value.push('view')
  }

  // edit permission
  if (sessionStore.hasAnyPermission(['.*', 'file.*', 'file.update'])) {
    dataTableActions.value.push('edit')
  }

  //delete permission
  if (sessionStore.hasAnyPermission(['.*', 'file.*', 'file.delete'])) {
    dataTableActions.value.push('delete')
  }
}

watch(table, (newValue) => {
  if (newValue && newValue.dt) {
    setupEventHandlers()
  }
}, { immediate: true })

// Watch search query with debounce
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    if (dt) {
      dt.ajax.reload()
    }
  }, 500)
})

// Watch category filter for immediate reload
watch(categoryFilter, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

// Load data on mount
onMounted(() => {
  setPermissions()
})

const setupEventHandlers = () => {
  if (eventHandlersSetUp.value) {
    return
  }

  dt = table.value.dt

  if (!dt) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setupEventHandler = (action: string, handler: (row: any) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dt.on('click', `button[data-action="${action}"]`, (e: any) => {
      e.preventDefault()
      const rowIndex = dt.row(e.target.closest('tr')).index()
      const row = dt.row(rowIndex).data()
      handler(row)
    })
  }

  setupEventHandler('edit', (row) => {
    if (!canEdit.value) {
      toast.error('You do not have permission to edit files')
      return
    }
    selectedFile.value = row
    modalTitle.value = 'Edit File'
    modalMode.value = 'edit'
    showModal.value = true
  })

  setupEventHandler('view', (row) => {
    if (!canView.value) {
      toast.error('You do not have permission to view files')
      return
    }
    selectedFile.value = row
    modalTitle.value = 'View File'
    modalMode.value = 'view'
    showModal.value = true
  })

  setupEventHandler('delete', (row) => {
    if (!canDelete.value) {
      toast.error('You do not have permission to delete files')
      return
    }
    fileToDelete.value = row
    showDeleteConfirmation.value = true
  })

  eventHandlersSetUp.value = true
}
</script>

<style>
/* Styles moved to datatables.css for better organization */
</style>
