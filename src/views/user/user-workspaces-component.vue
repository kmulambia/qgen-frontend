<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="space-y-4">
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">User Workspaces</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage the workspaces this user has access to and their roles within each workspace.
        </p>
      </div>
      <button
        v-if="canManage"
        @click="openCreateModal"
        class="theme-btn theme-btn-primary flex items-center gap-2 px-4 py-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Workspace
      </button>
    </div>

    <!-- DataTable -->
    <div class="theme-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
      <DataTable ref="table" :columns="columns" :options="tableOptions" />
    </div>

    <!-- User Workspace Form Modal -->
    <UserWorkspaceForm
      :open="showModal"
      :key="'workspace-form-'+showModal+modalMode+selectedUserWorkspace?.id+Date.now()"
      :loading="isSubmitting"
      :title="modalTitle"
      :mode="modalMode"
      :user-workspace="selectedUserWorkspace"
      :user-id="userId"
      :workspaces="availableWorkspaces"
      :roles="availableRoles"
      @onClose="closeModal"
      @onSubmit="handleWorkspaceSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmationComponent
      :open="showDeleteConfirmation"
      :title="`Remove Workspace`"
      :description="`Are you sure you want to remove '${workspaceToDelete?.workspace?.name}' from this user? This action cannot be undone.`"
      :secure-mode="true"
      confirm-button-text="Remove"
      cancel-button-text="Cancel"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
      @update:open="showDeleteConfirmation = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject, computed } from 'vue'
import type { IUserWorkspace, IWorkspace, IRole, IRequestFilterCondition } from '@/interfaces'
import { IRequestFilterOperator } from '@/interfaces'
import type { IDataTableCallback } from '@/interfaces/datatables-interfaces'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import 'datatables.net-buttons'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'datatables.net-buttons/js/buttons.print.js'
import { useDataTableActionButtons, useDataTableQueryBuilder, type DataTableAction } from '@/composables/datatable'
import moment from 'moment'
import { useToast } from 'vue-toastification'
import { formatErrorMessage } from '@/utils/errors'
import type { UserWorkspaceStore } from '@/stores/user-workspace-store'
import type { WorkspaceStore } from '@/stores/workspace-store'
import type { RoleStore } from '@/stores/role-store'
import { useTranslation } from 'i18next-vue'
import { useSessionStore } from '@/stores/session-store'
import UserWorkspaceForm from './user-workspace-form.vue'
import ConfirmationComponent from '@/components/confirmation-component.vue'

DataTable.use(DataTablesCore)

// DataTable parameter interface
interface DataTableParams {
  draw: number
  start: number
  length: number
  search: { value: string }
  order: Array<{ column: number; dir: 'asc' | 'desc' }>
}

// Props
const props = defineProps<{
  userId: string
}>()

const table = ref()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dt: any
const toast = useToast()
const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Inject stores
const userWorkspaceStore = inject<UserWorkspaceStore>('userWorkspaceStore')!
const workspaceStore = inject<WorkspaceStore>('workspaceStore')!
const roleStore = inject<RoleStore>('roleStore')!

// Permission checks
const canManage = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('user.*') ||
  sessionStore.hasPermission('user.manage')
)

// Modal state
const showModal = ref(false)
const isSubmitting = ref(false)
const selectedUserWorkspace = ref<IUserWorkspace | null>(null)
const modalTitle = ref('Add Workspace')
const modalMode = ref<'create' | 'edit' | 'view'>('create')

// Delete confirmation state
const showDeleteConfirmation = ref(false)
const workspaceToDelete = ref<IUserWorkspace | null>(null)

// Workspace and role data
const availableWorkspaces = ref<IWorkspace[]>([])
const availableRoles = ref<IRole[]>([])

// DataTable actions
const dataTableActions = ref<DataTableAction[]>([])
const eventHandlersSetUp = ref(false)

// DataTable composables
const { generateActionButtonsHtml } = useDataTableActionButtons()
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()

const columns = [
  {
    data: 'workspace',
    title: 'Workspace',
    exportable: true,
    orderable: false,
    visible: true,
    render: function (data: IWorkspace | null) {
      return data?.name || 'N/A'
    },
  },
  {
    data: 'workspace.workspace_type',
    title: 'Type',
    exportable: true,
    orderable: false,
    visible: false,
    render: function (data: { name?: string } | null) {
      return data?.name || 'N/A'
    },
  },
  {
    data: 'role',
    title: 'Role',
    exportable: true,
    orderable: false,
    visible: true,
    render: function (data: IRole | null) {
      return data?.name || 'N/A'
    },
  },
  {
    data: 'is_default',
    title: 'Default',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: boolean) {
      if (data) {
        return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">Default</span>'
      }
      return '<span class="text-gray-400">-</span>'
    },
  },
  {
    data: 'status',
    title: 'Status',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      const colors: Record<string, string> = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
      }
      const colorClass = colors[data?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} capitalize">${data || 'N/A'}</span>`
    },
  },
  {
    data: 'created_at',
    title: 'Added',
    exportable: true,
    orderable: true,
    visible: false,
    render: function (data: string) {
      return data ? moment(data).format('MMM DD, YYYY') : 'N/A'
    },
  },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    className: 'text-right',
    exportable: false,
    render: (data: IUserWorkspace) => {
      return generateActionButtonsHtml(
        { ...data, name: data.workspace?.name || 'Workspace' },
        dataTableActions.value
      )
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
  name: 'user-workspaces',
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
      filename: () => `user_workspaces_${props.userId}_${moment().format('YYYY-MM-DD_HH-mm')}`,
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
      filename: () => `user_workspaces_${props.userId}_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ajax: async (dtParams: any, callback: (response: IDataTableCallback<IUserWorkspace>) => void) => {
    const response = await handleFetch(dtParams)
    callback(response)
  },
  lengthMenu: [10, 25, 50, 100],
  pageLength: 10,
  select: false,
  selectable: false,
  ordering: true,
  order: [[5, 'desc']], // Order by created_at descending
}

// DataTable fetch handler using query builder
const handleFetch = async (dtParams: DataTableParams): Promise<IDataTableCallback<IUserWorkspace>> => {
  try {
    if (!canManage.value) {
      toast.error('You do not have permission to view user workspaces')
      return buildErrorResponse(dtParams.draw, 'Permission denied')
    }

    const query = buildFilterQuery(dtParams, columns, {
      include_deleted: false,
    })

    // Always filter by user_id
    const filters: IRequestFilterCondition[] = [
      {
        field: 'user_id',
        operator: IRequestFilterOperator.EQUALS,
        value: props.userId,
        type: 'string',
      },
    ]

    const response = await userWorkspaceStore.query(query, filters)

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

// Modal management functions
const openCreateModal = () => {
  if (!canManage.value) {
    toast.error('You do not have permission to manage user workspaces')
    return
  }
  selectedUserWorkspace.value = null
  modalTitle.value = 'Add Workspace'
  modalMode.value = 'create'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUserWorkspace.value = null
}

// Delete confirmation handlers
const handleDeleteConfirm = async () => {
  if (!workspaceToDelete.value || !workspaceToDelete.value.id) return

  try {
    await userWorkspaceStore.delete(workspaceToDelete.value.id)
    if (table.value?.dt) {
      table.value.dt.ajax.reload()
    }
    toast.success('Workspace removed successfully')
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    showDeleteConfirmation.value = false
    workspaceToDelete.value = null
  }
}

const handleDeleteCancel = () => {
  showDeleteConfirmation.value = false
  workspaceToDelete.value = null
}

const handleWorkspaceSubmit = async (workspaceData: Record<string, unknown>) => {
  if (!canManage.value) {
    toast.error('You do not have permission to manage user workspaces')
    return
  }

  isSubmitting.value = true
  try {
    if (selectedUserWorkspace.value && selectedUserWorkspace.value.id) {
      // Update existing user workspace
      await userWorkspaceStore.update(selectedUserWorkspace.value.id, workspaceData)
      toast.success('Workspace updated successfully')
    } else {
      // Create new user workspace
      await userWorkspaceStore.create(workspaceData)
      toast.success('Workspace added successfully')
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

// Load available workspaces and roles
const loadWorkspacesAndRoles = async () => {
  try {
    // Load workspaces
    const workspaceResponse = await workspaceStore.query({
      page: 1,
      page_size: 1000,
      sort_by: 'name',
      sort_dir: 'asc',
    }, [{
      field: 'status',
      operator: IRequestFilterOperator.EQUALS,
      value: 'active',
      type: 'string',
    }])
    availableWorkspaces.value = workspaceResponse.items || []

    // Load roles
    const roleResponse = await roleStore.query({
      page: 1,
      page_size: 1000,
      sort_by: 'name',
      sort_dir: 'asc',
    }, [{
      field: 'status',
      operator: IRequestFilterOperator.EQUALS,
      value: 'active',
      type: 'string',
    }])
    availableRoles.value = roleResponse.items || []
  } catch (error) {
    console.error('Failed to load workspaces and roles:', error)
  }
}

// Set permissions for DataTable actions
const setPermissions = () => {
  if (sessionStore.hasAnyPermission(['*', 'user.*', 'user.view', 'user.manage'])) {
    dataTableActions.value.push('view')
  }

  if (sessionStore.hasAnyPermission(['*', 'user.*', 'user.update', 'user.manage'])) {
    dataTableActions.value.push('edit')
  }

  if (sessionStore.hasAnyPermission(['*', 'user.*', 'user.delete', 'user.manage'])) {
    dataTableActions.value.push('delete')
  }
}

watch(table, (newValue) => {
  if (newValue && newValue.dt) {
    setupEventHandlers()
  }
}, { immediate: true })

// Watch userId prop changes
watch(() => props.userId, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

// Load data on mount
onMounted(() => {
  setPermissions()
  loadWorkspacesAndRoles()
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
    if (!canManage.value) {
      toast.error('You do not have permission to edit user workspaces')
      return
    }
    selectedUserWorkspace.value = row
    modalTitle.value = 'Edit Workspace'
    modalMode.value = 'edit'
    showModal.value = true
  })

  setupEventHandler('view', (row) => {
    if (!canManage.value) {
      toast.error('You do not have permission to view user workspaces')
      return
    }
    selectedUserWorkspace.value = row
    modalTitle.value = 'View Workspace'
    modalMode.value = 'view'
    showModal.value = true
  })

  setupEventHandler('delete', (row) => {
    if (!canManage.value) {
      toast.error('You do not have permission to delete user workspaces')
      return
    }
    // Check if it's a default workspace
    if (row.is_default) {
      toast.error('Cannot remove default workspace')
      return
    }
    workspaceToDelete.value = row
    showDeleteConfirmation.value = true
  })

  // Mark as set up
  eventHandlersSetUp.value = true
}
</script>

<style scoped>
/* Styles are handled by global datatable styles */
</style>
