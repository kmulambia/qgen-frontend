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
                  placeholder="Search clients..."
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
                Create Client
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

    <!-- Create/Edit/View Client Modal -->
    <ClientForm
      :open="showModal"
      :key="showModal+modalMode+selectedClient?.id+Date.now()"
      :loading="isSubmitting"
      :client="selectedClient"
      :title="modalTitle"
      :mode="modalMode"
      :fields="[
        { name: 'company_name', required: true },
        { name: 'email' },
        { name: 'phone' },
        { name: 'contact_person_name' },
        { name: 'contact_person_email' },
        { name: 'contact_person_phone' }
      ]"
      @onClose="closeModal"
      @onSubmit="handleClientSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmationComponent
      :open="showDeleteConfirmation"
      :title="`Delete Client`"
      :description="`Are you sure you want to ${hardDeleteMode ? 'permanently' : 'soft'} delete '${clientToDelete?.company_name}'? ${hardDeleteMode ? 'This action cannot be undone.' : 'You can restore it later.'}`"
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
import type { IClient, IRequestFilterCondition } from '@/interfaces'
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
import ClientForm from '@/views/clients/client-form.vue'
import moment from 'moment'
import { useToast } from 'vue-toastification'
import { formatErrorMessage } from '@/utils/errors'
import type { useClientStore } from '@/stores/client-store'
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

// Inject client store
const clientStore = inject<ReturnType<typeof useClientStore>>('clientStore')!

// Permission checks with hierarchy consideration
const canCreate = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('client.*') ||
  sessionStore.hasPermission('client.create')
)

const canView = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('client.*') ||
  sessionStore.hasPermission('client.view')
)

const canEdit = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('client.*') ||
  sessionStore.hasPermission('client.update')
)

const canDelete = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('client.*') ||
  sessionStore.hasPermission('client.delete')
)

const canList = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('client.*') ||
  sessionStore.hasPermission('client.list')
)

// Modal state management
const showModal = ref(false)
const isSubmitting = ref(false)
const selectedClient = ref<IClient | null>(null)
const modalTitle = ref('Create Client')
const modalMode = ref<'create' | 'edit' | 'view'>('create')

// Delete confirmation state
const showDeleteConfirmation = ref(false)
const clientToDelete = ref<IClient | null>(null)
const hardDeleteMode = ref(false)

// DataTable loading state
const isLoadingData = ref(false)

// Filter state
const searchQuery = ref('')
const statusFilter = ref('')

// DataTable actions
const dataTableActions = ref<DataTableAction[]>([])
const eventHandlersSetUp = ref(false)

// DataTable composables
const { generateActionButtonsHtml } = useDataTableActionButtons()
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()

const columns = [
  {
    data: 'company_name',
    title: 'Company Name',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'font-medium',
    render: function (data: string) {
      return data
    },
  },
  {
    data: 'email',
    title: 'Email',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data || 'N/A'
    },
  },
  {
    data: 'phone',
    title: 'Phone',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data || 'N/A'
    },
  },
  {
    data: 'contact_person_name',
    title: 'Contact Person',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data || 'N/A'
    },
  },
  {
    data: 'contact_person_phone',
    title: 'Contact Phone',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data || 'N/A'
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
    data: null,
    title: 'Actions',
    orderable: false,
    className: 'text-right',
    exportable: false,
    render: (data: IClient & { company_name: string }) => {
      // Create a version with 'name' property for action buttons
      const clientWithName = {
        ...data,
        name: data.company_name
      }
      return generateActionButtonsHtml(clientWithName, dataTableActions.value)
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
  name: 'clients',
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
      filename: () => `clients_${moment().format('YYYY-MM-DD_HH-mm')}`,
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
      filename: () => `clients_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ajax: async (dtParams: any, callback: (response: IDataTableCallback<IClient>) => void) => {
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
    toast.error('You do not have permission to create clients')
    return
  }
  selectedClient.value = null
  modalTitle.value = 'Create Client'
  modalMode.value = 'create'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedClient.value = null
}

// Delete confirmation handlers
const handleDeleteConfirm = async () => {
  if (!clientToDelete.value) return

  try {
    await clientStore.delete(clientToDelete.value.id!, hardDeleteMode.value)
    if (table.value?.dt) {
      table.value.dt.ajax.reload()
    }
    toast.success(`Client ${hardDeleteMode.value ? 'permanently deleted' : 'soft deleted'} successfully`)
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    showDeleteConfirmation.value = false
    clientToDelete.value = null
    hardDeleteMode.value = false // Reset to default
  }
}

const handleDeleteCancel = () => {
  showDeleteConfirmation.value = false
  clientToDelete.value = null
  hardDeleteMode.value = false // Reset to default
}

const handleClientSubmit = async (clientData: IClient) => {
  // Check permissions before submitting
  if (selectedClient.value && selectedClient.value.id) {
    // Update existing client
    if (!canEdit.value) {
      toast.error('You do not have permission to update clients')
      return
    }
  } else {
    // Create new client
    if (!canCreate.value) {
      toast.error('You do not have permission to create clients')
      return
    }
  }

  isSubmitting.value = true
  try {
    if (selectedClient.value && selectedClient.value.id) {
      // Update existing client
      await clientStore.update(selectedClient.value.id, clientData)
      toast.success('Client updated successfully')
    } else {
      // Create new client
      await clientStore.create(clientData)
      toast.success('Client created successfully')
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
const handleFetch = async (dtParams: DataTableParams): Promise<IDataTableCallback<IClient>> => {
  try {
    if (!canList.value) {
      toast.error('You do not have permission to view clients')
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

    const response = await clientStore.query(query, filters)

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
  if (sessionStore.hasAnyPermission(['.*', 'client.*', 'client.view'])) {
    dataTableActions.value.push('view')
  }

  // edit permission
  if (sessionStore.hasAnyPermission(['.*', 'client.*', 'client.update'])) {
    dataTableActions.value.push('edit')
  }

  //delete permission
  if (sessionStore.hasAnyPermission(['.*', 'client.*', 'client.delete'])) {
    dataTableActions.value.push('delete')
  }

  /**
   * end of permission actions for datatable
   */
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
  }, 500) // 500ms debounce
})

// Watch status filter for immediate reload
watch(statusFilter, () => {
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
      toast.error('You do not have permission to edit clients')
      return
    }
    selectedClient.value = row
    modalTitle.value = 'Edit Client'
    modalMode.value = 'edit'
    showModal.value = true
  })

  setupEventHandler('view', (row) => {
    if (!canView.value) {
      toast.error('You do not have permission to view clients')
      return
    }
    selectedClient.value = row
    modalTitle.value = 'View Client'
    modalMode.value = 'view'
    showModal.value = true
  })

  setupEventHandler('delete', (row) => {
    if (!canDelete.value) {
      toast.error('You do not have permission to delete clients')
      return
    }
    // Open delete confirmation dialog
    clientToDelete.value = row
    showDeleteConfirmation.value = true
  })

  // Mark as set up
  eventHandlersSetUp.value = true
}
</script>

<style>
/* Styles moved to datatables.css for better organization */
</style>
