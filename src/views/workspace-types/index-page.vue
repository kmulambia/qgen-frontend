<!-- eslint-disable @typescript-eslint/no-explicit-any -->
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
                  placeholder="Search workspace types..."
                  class="theme-input w-full pl-10"
                />
              </div>
            </div>

            <!-- Status Filter -->
            <div class="w-full sm:w-40">
              <label for="status-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Status
              </label>
              <select
                id="status-filter"
                v-model="statusFilter"
                class="theme-input w-full cursor-pointer"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <!-- System Defined Filter -->
            <div class="w-full sm:w-48">
              <label for="system-defined-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Type
              </label>
              <select
                id="system-defined-filter"
                v-model="systemDefinedFilter"
                class="theme-input w-full cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="true">System Defined</option>
                <option value="false">User Defined</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 w-full sm:w-auto">
              <button
                v-if="canCreate"
                type="button"
                @click="openCreateModal"
                class="theme-btn theme-btn-primary flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 h-[42px]"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Workspace Type
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

    <!-- Create/Edit/View Workspace Type Modal -->
    <WorkspaceTypeForm
      :open="showModal"
      :key="showModal+modalMode+selectedWorkspaceType?.id+Date.now()"
      :loading="isSubmitting"
      :workspace-type="selectedWorkspaceType"
      :title="modalTitle"
      :mode="modalMode"
      :fields="[
        { name: 'name' },
        { name: 'description' },
        { name: 'is_system_defined' }
      ]"
      @onClose="closeModal"
      @onSubmit="handleWorkspaceTypeSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmationComponent
      :open="showDeleteConfirmation"
      :title="`Delete Workspace Type`"
      :description="`Are you sure you want to delete '${workspaceTypeToDelete?.name}'? This action cannot be undone.`"
      :secure-mode="true"
      confirm-button-text="Delete"
      cancel-button-text="Cancel"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
      @update:open="showDeleteConfirmation = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject, computed } from 'vue'
import type { IWorkspaceType,  IRequestFilterCondition } from '@/interfaces'
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
import WorkspaceTypeForm from './workspace-type-form.vue'
import moment from 'moment'
import { useToast } from 'vue-toastification'
import { formatErrorMessage } from '@/utils/errors'
import type { useWorkspaceTypeStore } from '@/stores/workspace-type-store'
import { useTranslation } from 'i18next-vue'
import { useSessionStore } from '@/stores/session-store'

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

// Session store for permissions
const sessionStore = useSessionStore()

// Inject workspace type store
const workspaceTypeStore = inject<ReturnType<typeof useWorkspaceTypeStore>>('workspaceTypeStore')!

// Permission checks with hierarchy consideration
const canCreate = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('workspace-type.*') ||
  sessionStore.hasPermission('workspace-type.create')
)

const canView = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('workspace-type.*') ||
  sessionStore.hasPermission('workspace-type.view')
)

const canEdit = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('workspace-type.*') ||
  sessionStore.hasPermission('workspace-type.update')
)

const canDelete = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('workspace-type.*') ||
  sessionStore.hasPermission('workspace-type.delete')
)

const canManage = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('workspace-type.*') ||
  sessionStore.hasPermission('workspace-type.manage')
)

const canList = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('workspace-type.*') ||
  sessionStore.hasPermission('workspace-type.list')
)

// Modal state management
const showModal = ref(false)
const isSubmitting = ref(false)
const selectedWorkspaceType = ref<IWorkspaceType | null>(null)
const modalTitle = ref('Create Workspace Type')
const modalMode = ref<'create' | 'edit' | 'view'>('create')

// Delete confirmation state
const showDeleteConfirmation = ref(false)
const workspaceTypeToDelete = ref<IWorkspaceType | null>(null)

// DataTable loading state
const isLoadingData = ref(false)

// Filter state
const searchQuery = ref('')
const statusFilter = ref('')
const systemDefinedFilter = ref('')

// DataTable actions
const dataTableActions = ref<DataTableAction[]>([])
const eventHandlersSetUp = ref(false)

// DataTable composables
const { generateActionButtonsHtml } = useDataTableActionButtons()
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()
const columns = [
  {
    data: 'name',
    title: 'Name',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'capitalize',
    render: function (data: string) {
      return data
    },
  },
  {
    data: 'description',
    title: 'Description',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data || 'No description'
    },
  },
  {
    data: 'is_system_defined',
    title: 'Is System Defined',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: boolean) {
      return data ? 'Yes' : 'No'
    },
  },
  {
    data: 'status',
    title: 'Status',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'capitalize',
    render: function (data: string) {
      return data
    },
  },
  {
    data: 'created_at',
    title: 'Created Date',
    exportable: true,
    orderable: true,
    visible: false,
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
    render: (data: IWorkspaceType & { name: string }) => {
      // Filter actions based on system_defined status
      let availableActions = [...dataTableActions.value]

      // For system-defined workspace types, only allow view action
      if (data.is_system_defined) {
        availableActions = availableActions.filter(action => action === 'view')
      }

      return generateActionButtonsHtml(data, availableActions)
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
  name: 'workspace-types',
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
      filename: () => `workspace_types_${moment().format('YYYY-MM-DD_HH-mm')}`,
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
      filename: () => `workspace_types_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ajax: async (dtParams: any, callback: (response: IDataTableCallback<IWorkspaceType>) => void) => {
    const response = await handleFetch(dtParams)
    callback(response)
  },
  lengthMenu: [10, 25, 50, 100],
  pageLength: 10,
  select: false,
  selectable: false,
  ordering: true,
  order: [[0, 'asc']],
}




// Modal management functions
const openCreateModal = () => {
  if (!canCreate.value) {
    toast.error('You do not have permission to create workspace types')
    return
  }
  selectedWorkspaceType.value = null
  modalTitle.value = 'Create Workspace Type'
  modalMode.value = 'create'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedWorkspaceType.value = null
}

// Delete confirmation handlers
const handleDeleteConfirm = async () => {
  if (!workspaceTypeToDelete.value) return

  try {
    await workspaceTypeStore.delete(workspaceTypeToDelete.value.id!)
    if (table.value?.dt) {
      table.value.dt.ajax.reload()
    }
    toast.success('Workspace type deleted successfully')
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    showDeleteConfirmation.value = false
    workspaceTypeToDelete.value = null
  }
}

const handleDeleteCancel = () => {
  showDeleteConfirmation.value = false
  workspaceTypeToDelete.value = null
}

const handleWorkspaceTypeSubmit = async (workspaceTypeData: IWorkspaceType) => {
  // Check permissions before submitting
  if (selectedWorkspaceType.value && selectedWorkspaceType.value.id) {
    // Update existing workspace type
    if (!canEdit.value) {
      toast.error('You do not have permission to update workspace types')
      return
    }
    // Check if trying to edit a system-defined workspace type
    if (selectedWorkspaceType.value.is_system_defined) {
      toast.error('Cannot edit system-defined workspace types')
      return
    }
  } else {
    // Create new workspace type
    if (!canCreate.value) {
      toast.error('You do not have permission to create workspace types')
      return
    }
  }

  isSubmitting.value = true
  try {
    if (selectedWorkspaceType.value && selectedWorkspaceType.value.id) {
      // Update existing workspace type
      await workspaceTypeStore.update(selectedWorkspaceType.value.id, workspaceTypeData)
      toast.success('Workspace type updated successfully')
    } else {
      // Create new workspace type
      await workspaceTypeStore.create(workspaceTypeData)
      toast.success('Workspace type created successfully')
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

// DataTable fetch handler using query builder
const handleFetch = async (dtParams: DataTableParams): Promise<IDataTableCallback<IWorkspaceType>> => {
  try {
    if (!canList.value) {
      toast.error('You do not have permission to view workspace types')
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

    // Add status filter if selected
    if (statusFilter.value) {
      filters.push({
        field: 'status',
        operator: IRequestFilterOperator.EQUALS,
        value: statusFilter.value
      })
    }

    // Add system defined filter if selected
    if (systemDefinedFilter.value !== '') {
      const isSystemDefined = systemDefinedFilter.value === 'true'
      filters.push({
        field: 'is_system_defined',
        operator: IRequestFilterOperator.EQUALS,
        value: isSystemDefined
      })
    }

    const response = await workspaceTypeStore.query(query, filters)

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
  /**
   * permission actions for datatable
   */
  //view permission
  if (sessionStore.hasAnyPermission(['configurations.*', 'configurations.workspace-type.*', 'configurations.workspace-type.view'])) {
    dataTableActions.value.push('view')
  }

  // edit permission
  if (sessionStore.hasAnyPermission(['configurations.*', 'configurations.workspace-type.*', 'configurations.workspace-type.update'])) {
    dataTableActions.value.push('edit')
  }

  // //manage permission
  // if (sessionStore.hasAnyPermission(['configurations.*', 'configurations.workspace-type.*', 'configurations.workspace-type.manage'])) {
  //   dataTableActions.value.push('manage')
  // }

  //delete permission
  if (sessionStore.hasAnyPermission(['configurations.*', 'configurations.workspace-type.*', 'configurations.workspace-type.delete'])) {
    dataTableActions.value.push('delete')
  }

  /**
   * end of permission actions for datatable
   */
}

// Watch for table ref to become available
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
  }, 500) // 500ms debounce
})

// Watch status filter for immediate reload
watch(statusFilter, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

// Watch system defined filter for immediate reload
watch(systemDefinedFilter, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

// Load data on mount
onMounted(() => {
  // Set permissions first
  setPermissions()
})

const setupEventHandlers = () => {
  // Prevent setting up handlers multiple times
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
      toast.error('You do not have permission to edit workspace types')
      return
    }
    if (row.is_system_defined) {
      toast.error('Cannot edit system-defined workspace types')
      return
    }
    selectedWorkspaceType.value = row
    modalTitle.value = 'Edit Workspace Type'
    modalMode.value = 'edit'
    showModal.value = true
  })

  setupEventHandler('view', (row) => {
    if (!canView.value) {
      toast.error('You do not have permission to view workspace types')
      return
    }
    selectedWorkspaceType.value = row
    modalTitle.value = 'View Workspace Type'
    modalMode.value = 'view'
    showModal.value = true
  })

  setupEventHandler('manage', (row) => {
    if (!canManage.value) {
      toast.error('You do not have permission to manage workspace types')
      return
    }
    if (row.is_system_defined) {
      toast.error('Cannot manage system-defined workspace types')
      return
    }
    selectedWorkspaceType.value = row
    modalTitle.value = 'Manage Workspace Type'
    modalMode.value = 'edit'
    showModal.value = true
  })

  setupEventHandler('delete', (row) => {
    if (!canDelete.value) {
      toast.error('You do not have permission to delete workspace types')
      return
    }
    if (row.is_system_defined) {
      toast.error('Cannot delete system-defined workspace types')
      return
    }
    // Open delete confirmation dialog
    workspaceTypeToDelete.value = row
    showDeleteConfirmation.value = true
  })

  // Mark as set up
  eventHandlersSetUp.value = true
}
</script>

<style>
/* Styles moved to datatables.css for better organization */
</style>
