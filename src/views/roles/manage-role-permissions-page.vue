<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else-if="sessionStore.isLoggedIn && selectedRole" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-2">
      <BreadcrumbComponents :items="breadcrumb_items" />

      <!-- Permission Details Card -->
      <div class="theme-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ selectedRole.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedRole.description || 'No description' }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              <span class="text-primary-600 dark:text-primary-400 text-2xl font-bold">{{ assignedPermissionsCount }}</span>
              <span class="text-gray-500 dark:text-gray-400"> / {{ totalPermissionsCount }}</span>
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Permissions Assigned
            </p>
          </div>
        </div>
      </div>

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
                  placeholder="Search permissions..."
                  class="theme-input w-full pl-10"
                />
              </div>
            </div>

            <!-- Group Filter -->
            <div class="w-full sm:w-48">
              <label for="group-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Group
              </label>
              <select
                id="group-filter"
                v-model="groupFilter"
                class="theme-input w-full cursor-pointer"
              >
                <option value="">All Groups</option>
                <option v-for="group in availableGroups" :key="group" :value="group">
                  {{ group.charAt(0).toUpperCase() + group.slice(1) }}
                </option>
              </select>
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
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions DataTable -->
      <div class="theme-card bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 p-4 border border-gray-300 dark:border-gray-600">
        <DataTable ref="table" :columns="columns" :options="tableOptions" />
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmationComponent
      :open="showDeleteConfirmation"
      :title="`Remove Permission`"
      :description="`Are you sure you want to remove the permission '${permissionToDelete?.name}' from the role '${selectedRole?.name}'? This action cannot be undone.`"
      :secure-mode="false"
      confirm-button-text="Remove"
      cancel-button-text="Cancel"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
      @update:open="showDeleteConfirmation = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { IRole, IPermission, IRolePermission, IRequestFilterCondition } from '@/interfaces'
import type { IDataTableCallback } from '@/interfaces/datatables-interfaces'
import { IRequestFilterOperator } from '@/interfaces'
import { useSessionStore } from '@/stores/session-store'
import type { RoleStore } from '@/stores/role-store'
import type { PermissionStore } from '@/stores/permission-store'
import type { RolePermissionStore } from '@/stores/role-permission-store'
import { useBreadcrumbs } from '@/composables/use-breadcrumbs'
import { useDataTableActionButtons, useDataTableQueryBuilder, type DataTableAction } from '@/composables/datatable'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import 'datatables.net-buttons'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'datatables.net-buttons/js/buttons.print.js'
import 'datatables.net-rowgroup'
import LoadingComponent from '@/components/loading-component.vue'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import ConfirmationComponent from '@/components/confirmation-component.vue'
import { useToast } from 'vue-toastification'
import { formatErrorMessage } from '@/utils/errors'
import { useTranslation } from 'i18next-vue'
import moment from 'moment'

DataTable.use(DataTablesCore)

// DataTable parameter interface
interface DataTableParams {
  draw: number
  start: number
  length: number
  search: { value: string }
  order: Array<{ column: number; dir: 'asc' | 'desc' }>
}

// Composables
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useTranslation()

// Store Setup
const sessionStore = useSessionStore()
const roleStore = inject<RoleStore>('roleStore')!
const permissionStore = inject<PermissionStore>('permissionStore')!
const rolePermissionStore = inject<RolePermissionStore>('rolePermissionStore')!

// Reactive State
const isLoadingData = ref(false)
const selectedRoleId = ref<string>('')
const groupFilter = ref<string>('')
const searchQuery = ref<string>('')
const statusFilter = ref<string>('')

const selectedRole = ref<IRole | null>(null)
const rolePermissions = ref<IRolePermission[]>([])
const assignedPermissionsCount = ref<number>(0)
const totalPermissionsCount = ref<number>(0)
const availableGroups = ref<string[]>([])

// DataTable state
const table = ref()
const eventHandlersSetUp = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dt: any

// Delete confirmation state
const showDeleteConfirmation = ref(false)
const permissionToDelete = ref<IPermission | null>(null)

// Permission checks
const canManagePermissions = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('role.*') ||
  sessionStore.hasPermission('role.manage')
)

// Breadcrumbs from route metadata
const { breadcrumbs: breadcrumb_items } = useBreadcrumbs()

// DataTable composables
const { generateActionButtonsHtml } = useDataTableActionButtons()
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()

// Helper function to check if permission is assigned to role
const isPermissionAssigned = (permissionId?: string): boolean => {
  if (!permissionId) return false
  return rolePermissions.value.some((rp) => rp.permission_id === permissionId)
}

// Load available groups for filter
const loadAvailableGroups = async () => {
  try {
    const groups = await permissionStore.getAllGroups()
    availableGroups.value = groups.sort()
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    availableGroups.value = []
  }
}

// Load role details
const loadRole = async () => {
  if (!selectedRoleId.value) return

  try {
    isLoadingData.value = true
    selectedRole.value = await roleStore.getOne(selectedRoleId.value)
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    router.push('/roles')
  } finally {
    isLoadingData.value = false
  }
}

// Load role permissions
const loadRolePermissions = async () => {
  if (!selectedRoleId.value) {
    rolePermissions.value = []
    assignedPermissionsCount.value = 0
    return
  }

  try {
    const filters: IRequestFilterCondition[] = [
      {
        field: 'role_id',
        operator: IRequestFilterOperator.EQUALS,
        value: selectedRoleId.value,
        type: 'string',
      },
    ]

    const response = await rolePermissionStore.query(
      {
        page: 1,
        page_size: 10000,
        search: '',
        sort_by: 'created_at',
        sort_dir: 'asc',
      },
      filters
    )
    rolePermissions.value = response.items

    // Get counts
    assignedPermissionsCount.value = await rolePermissionStore.count(undefined, filters, false)
    totalPermissionsCount.value = await permissionStore.count(undefined, undefined, false)
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  }
}

// DataTable fetch handler using query builder
const handleFetch = async (
  dtParams: DataTableParams
): Promise<IDataTableCallback<IPermission & { isAssigned: boolean }>> => {
  try {
    if (!canManagePermissions.value) {
      toast.error('You do not have permission to manage role permissions')
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

    // Add group filter if selected
    if (groupFilter.value) {
      filters.push({
        field: 'group',
        operator: IRequestFilterOperator.EQUALS,
        value: groupFilter.value
      })
    }

    const response = await permissionStore.query(query, filters)

    if (response && response.items) {
      // Add isAssigned flag to each permission
      const permissionsWithStatus = response.items.map(permission => ({
        ...permission,
        isAssigned: isPermissionAssigned(permission.id),
      }))

      // Apply status filter (client-side since it's based on role permissions)
      let filteredData = permissionsWithStatus
      if (statusFilter.value === 'assigned') {
        filteredData = permissionsWithStatus.filter(p => p.isAssigned)
      } else if (statusFilter.value === 'unassigned') {
        filteredData = permissionsWithStatus.filter(p => !p.isAssigned)
      }

      return {
        draw: dtParams.draw,
        recordsTotal: response.total || response.items.length,
        recordsFiltered: filteredData.length,
        data: filteredData,
      }
    }

    return buildErrorResponse(dtParams.draw, 'No data received')
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    return buildErrorResponse(dtParams.draw, error)
  }
}

// DataTable columns configuration
const columns = [
  {
    data: 'code',
    title: 'Code',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'font-mono text-sm',
    render: function (data: string) {
      return data
    },
  },
  {
    data: 'name',
    title: 'Name',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data
    },
  },
  {
    data: 'group',
    title: 'Group',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data || 'Other'
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
    data: 'isAssigned',
    title: 'Status',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: boolean) {
      return data
        ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Assigned</span>'
        : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">Not Assigned</span>'
    },
  },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    className: 'text-right',
    exportable: false,
    render: (data: IPermission & { isAssigned: boolean }) => {
      const actions: DataTableAction[] = data.isAssigned ? ['delete'] : ['add']
      return generateActionButtonsHtml(data, actions)
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
  name: 'role-permissions',
  processing: true,
  responsive: true,
  // Row grouping configuration
  rowGroup: {
    dataSrc: 'group',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    startRender: function (rows: any, group: string) {
      return `<tr class="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500"><td colspan="6" class="px-4 py-3 text-sm font-semibold text-primary-800 dark:text-primary-200">${group || 'Other'} <span class="text-xs font-normal text-primary-600 dark:text-primary-300">(${rows.count()} permissions)</span></td></tr>`;
    },
  },
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
          .map((col, index) => (col.exportable ? index : null))
          .filter((index): index is number => index !== null),
      },
      filename: () => `role_permissions_${selectedRole.value?.name || 'role'}_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
    {
      extend: 'print',
      text: t('system.data.exportToPrint'),
      className: 'capitalize',
      exportOptions: {
        columns: columns
          .map((col, index) => (col.exportable ? index : null))
          .filter((index): index is number => index !== null),
      },
      filename: () => `role_permissions_${selectedRole.value?.name || 'role'}_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ajax: async (dtParams: any, callback: (response: IDataTableCallback<IPermission & { isAssigned: boolean }>) => void) => {
    const response = await handleFetch(dtParams)
    callback(response)
  },
  lengthMenu: [10, 25, 50, 100],
  pageLength: 25,
  select: false,
  selectable: false,
  ordering: true,
  order: [[2, 'asc'], [0, 'asc']], // Order by group first, then by code
}

// Add permission to role
const addPermission = async (permission: IPermission) => {
  if (!selectedRoleId.value || !permission.id) {
    toast.error('Invalid role or permission')
    return
  }

  if (!canManagePermissions.value) {
    toast.error('You do not have permission to manage role permissions')
    return
  }

  if (selectedRole.value?.is_system_defined) {
    toast.error('Cannot modify permissions for system-defined roles')
    return
  }

  try {
    // Create new role-permission assignment
    await rolePermissionStore.create({
      role_id: selectedRoleId.value,
      permission_id: permission.id,
    })

    toast.success(`Permission "${permission.name}" assigned to role`)

    // Update role permissions in memory
    const newRolePermission: IRolePermission = {
      id: `temp_${Date.now()}`,
      role_id: selectedRoleId.value,
      permission_id: permission.id!,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      version: 1
    }
    rolePermissions.value.push(newRolePermission)

    // Increment assigned permissions count
    assignedPermissionsCount.value++

    // Reload DataTable
    if (dt) {
      dt.ajax.reload()
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  }
}

// Remove permission from role with confirmation
const removePermission = (permission: IPermission) => {
  if (!canManagePermissions.value) {
    toast.error('You do not have permission to manage role permissions')
    return
  }

  if (selectedRole.value?.is_system_defined) {
    toast.error('Cannot modify permissions for system-defined roles')
    return
  }

  permissionToDelete.value = permission
  showDeleteConfirmation.value = true
}

// Handle delete confirmation
const handleDeleteConfirm = async () => {
  if (!permissionToDelete.value || !selectedRoleId.value) return

  try {
    // Find the role-permission record to delete
    const rolePermission = rolePermissions.value.find(
      (rp) => rp.role_id === selectedRoleId.value && rp.permission_id === permissionToDelete.value!.id
    )

    if (rolePermission && rolePermission.id) {
      // Hard delete the role-permission
      await rolePermissionStore.delete(rolePermission.id, true)
      toast.success(`Permission "${permissionToDelete.value.name}" removed from role`)

      // Remove from role permissions in memory
      const permissionIndex = rolePermissions.value.findIndex(rp => rp.id === rolePermission.id)
      if (permissionIndex !== -1) {
        rolePermissions.value.splice(permissionIndex, 1)
      }

      // Decrement assigned permissions count
      assignedPermissionsCount.value--

      // Reload DataTable
      if (dt) {
        dt.ajax.reload()
      }
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    showDeleteConfirmation.value = false
    permissionToDelete.value = null
  }
}

// Handle delete cancel
const handleDeleteCancel = () => {
  showDeleteConfirmation.value = false
  permissionToDelete.value = null
}

// Setup DataTable event handlers
const setupEventHandlers = () => {
  if (eventHandlersSetUp.value) return

  dt = table.value.dt
  if (!dt) return

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

  setupEventHandler('add', (row) => {
    addPermission(row)
  })

  setupEventHandler('delete', (row) => {
    removePermission(row)
  })

  eventHandlersSetUp.value = true
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

// Watch group filter for immediate reload
watch(groupFilter, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

// Watch status filter for immediate reload
watch(statusFilter, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

// Load data on mount
onMounted(async () => {
  // Get role ID from route params
  const roleIdFromRoute = route.params.roleId as string
  if (roleIdFromRoute) {
    selectedRoleId.value = roleIdFromRoute
    await Promise.all([loadRole(), loadRolePermissions(), loadAvailableGroups()])
  } else {
    toast.error('No role ID provided')
    router.push('/roles')
  }
})

// --- AUTH GUARD ---
watch(
  () => sessionStore.isLoggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) router.push('/login')
  },
  { immediate: true },
)
</script>
