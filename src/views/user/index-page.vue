<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                  placeholder="Search users..."
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

            <!-- Role Filter
            <div class="w-full sm:w-40">
              <label for="role-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Role
              </label>
              <select
                id="role-filter"
                v-model="roleFilter"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer"
              >
                <option value="">All Roles</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </select>
            </div> -->

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
                Register User
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

    <!-- Register User Modal -->
    <RegisterUserForm
      v-if="modalMode === 'create'"
      :open="showModal"
      :key="'register-'+showModal+Date.now()"
      :loading="isSubmitting"
      :user="null"
      :title="modalTitle"
      :fields="[
        { name: 'email' },
        { name: 'first_name' },
        { name: 'last_name' },
        { name: 'phone' },
        { name: 'sex' },
        { name: 'id_type' },
        { name: 'id_number' },
        { name: 'role_id' },
        { name: 'workspace_id' },
        { name: 'password' },
        { name: 'confirm_password' }
      ]"
      @onClose="closeModal"
      @onSubmit="handleUserRegistration"
    />

    <!-- Edit/View User Modal -->
    <UserForm
      v-else
      :open="showModal"
      :key="'user-form-'+showModal+modalMode+selectedUser?.id+Date.now()"
      :loading="isSubmitting"
      :user="selectedUser"
      :title="modalTitle"
      :mode="modalMode"
      :fields="[
        { name: 'email' },
        { name: 'first_name' },
        { name: 'last_name' },
        { name: 'phone' },
        { name: 'sex' },
        { name: 'id_type' },
        { name: 'id_number' },
      ]"
      @onClose="closeModal"
      @onSubmit="handleUserSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmationComponent
      :open="showDeleteConfirmation"
      :title="`Delete User`"
      :description="`Are you sure you want to delete '${userToDelete?.first_name} ${userToDelete?.last_name}'? This action cannot be undone.`"
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
import { useRouter } from 'vue-router'
import type { IUser, IRole, IRequestFilterCondition, IUserRegister } from '@/interfaces'
import { IRequestFilterOperator } from '@/interfaces'
import type { IDataTableCallback } from '@/interfaces/datatables-interfaces'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import 'datatables.net-buttons'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'datatables.net-buttons/js/buttons.print.js'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import ConfirmationComponent from '@/components/confirmation-component.vue'
import UserForm from './user-form.vue'
import RegisterUserForm from './register-user-form.vue'
import { useDataTableActionButtons, useDataTableQueryBuilder, type DataTableAction } from '@/composables/datatable'
import { useBreadcrumbs } from '@/composables/use-breadcrumbs'
import moment from 'moment'
import { useToast } from 'vue-toastification'
import { formatErrorMessage } from '@/utils/errors'
import type { useUserStore } from '@/stores/user-store'
import type { useRoleStore } from '@/stores/role-store'
import type { UserApiService } from '@/service/api/user-api-service'
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
const router = useRouter()

// Session store for permissions
const sessionStore = useSessionStore()

// Inject stores and services
const userStore = inject<ReturnType<typeof useUserStore>>('userStore')!
const roleStore = inject<ReturnType<typeof useRoleStore>>('roleStore')!
const userApiService = inject<UserApiService>('userApiService')!

// Permission checks with hierarchy consideration
const canCreate = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('user.*') ||
  sessionStore.hasPermission('user.create')
)

const canView = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('user.*') ||
  sessionStore.hasPermission('user.view')
)

const canEdit = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('user.*') ||
  sessionStore.hasPermission('user.update')
)

const canDelete = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('user.*') ||
  sessionStore.hasPermission('user.delete')
)

const canList = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('user.*') ||
  sessionStore.hasPermission('user.list')
)

// Modal state management
const showModal = ref(false)
const isSubmitting = ref(false)
const selectedUser = ref<IUser | null>(null)
const modalTitle = ref('Create User')
const modalMode = ref<'create' | 'edit' | 'view'>('create')

// Delete confirmation state
const showDeleteConfirmation = ref(false)
const userToDelete = ref<IUser | null>(null)

// Filter state
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')
const roles = ref<IRole[]>([])

// DataTable actions
const dataTableActions = ref<DataTableAction[]>([])
const eventHandlersSetUp = ref(false)

// DataTable composables
const { generateActionButtonsHtml } = useDataTableActionButtons()
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()

const columns = [
  {
    data: 'first_name',
    title: 'First Name',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'capitalize',
  },
  {
    data: 'last_name',
    title: 'Last Name',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'capitalize',
  },
  {
    data: 'email',
    title: 'Email',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data
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
    render: (data: IUser & { first_name: string; last_name: string }) => {
      // Create an object with the required 'name' property for the action buttons
      const userWithName = {
        ...data,
        name: `${data.first_name} ${data.last_name}`.trim()
      }
      return generateActionButtonsHtml(userWithName, dataTableActions.value)
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
  name: 'users',
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
      filename: () => `users_${moment().format('YYYY-MM-DD_HH-mm')}`,
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
      filename: () => `users_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ajax: async (dtParams: any, callback: (response: IDataTableCallback<IUser>) => void) => {
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
    toast.error('You do not have permission to create users')
    return
  }
  selectedUser.value = null
  modalTitle.value = 'Register User'
  modalMode.value = 'create'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
}

// Delete confirmation handlers
const handleDeleteConfirm = async () => {
  if (!userToDelete.value) return

  try {
    await userStore.delete(userToDelete.value.id!)
    if (table.value?.dt) {
      table.value.dt.ajax.reload()
    }
    toast.success('User deleted successfully')
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    showDeleteConfirmation.value = false
    userToDelete.value = null
  }
}

const handleDeleteCancel = () => {
  showDeleteConfirmation.value = false
  userToDelete.value = null
}

const handleUserRegistration = async (userData: IUserRegister) => {
  // Check permissions before submitting
  if (!canCreate.value) {
    toast.error('You do not have permission to create users')
    return
  }

  isSubmitting.value = true
  try {
    // Register new user using the registration API
    await userApiService.register(userData)
    toast.success('User registered successfully')

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

const handleUserSubmit = async (userData: IUser) => {
  // Check permissions before submitting
  if (selectedUser.value && selectedUser.value.id) {
    // Update existing user
    if (!canEdit.value) {
      toast.error('You do not have permission to update users')
      return
    }
  } else {
    // Create new user
    if (!canCreate.value) {
      toast.error('You do not have permission to create users')
      return
    }
  }

  isSubmitting.value = true
  try {
    if (selectedUser.value && selectedUser.value.id) {
      // Update existing user
      await userStore.update(selectedUser.value.id, userData)
      toast.success('User updated successfully')
    } else {
      // Create new user
      await userStore.create(userData)
      toast.success('User created successfully')
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
const handleFetch = async (dtParams: DataTableParams): Promise<IDataTableCallback<IUser>> => {
  try {
    if (!canList.value) {
      toast.error('You do not have permission to view users')
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

    // Add role filter if selected
    if (roleFilter.value) {
      filters.push({
        field: 'role_id',
        operator: IRequestFilterOperator.EQUALS,
        value: roleFilter.value
      })
    }

    const response = await userStore.query(query, filters)

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

// Load roles for filter dropdown
const loadRoles = async () => {
  try {
    const response = await roleStore.query({
      sort_by: 'name',
      sort_dir: 'asc',
      page_size: 100,
      page: 1,
    })

    if (response && response.items) {
      roles.value = response.items
    }
  } catch (error) {
    console.error('Error loading roles:', error)
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
  if (sessionStore.hasAnyPermission(['*', 'user.*', 'user.view'])) {
    dataTableActions.value.push('view')
  }

  // edit permission
  if (sessionStore.hasAnyPermission(['*', 'user.*', 'user.update'])) {
    dataTableActions.value.push('edit')
  }

  //manage permission
   if (sessionStore.hasAnyPermission(['*', 'user.*', 'user.view', 'user.update', 'user.manage'])) {
    dataTableActions.value.push('manage')
  }


  //delete permission
  if (sessionStore.hasAnyPermission(['*', 'user.*', 'user.delete'])) {
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

// Watch role filter for immediate reload
watch(roleFilter, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

// Load data on mount
onMounted(() => {
  // Set permissions first
  setPermissions()
  loadRoles()
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

  setupEventHandler('manage', (row) => {
    if (!canView.value) {
      toast.error('You do not have permission to manage users')
      return
    }
    // Navigate to manage user page
    router.push(`/admin/user-management/users/manage/${row.id}`)
  })

  setupEventHandler('edit', (row) => {
    if (!canEdit.value) {
      toast.error('You do not have permission to edit users')
      return
    }
    selectedUser.value = row
    modalTitle.value = 'Edit User'
    modalMode.value = 'edit'
    showModal.value = true
  })

  setupEventHandler('view', (row) => {
    if (!canView.value) {
      toast.error('You do not have permission to view users')
      return
    }
    selectedUser.value = row
    modalTitle.value = 'View User'
    modalMode.value = 'view'
    showModal.value = true
  })

  setupEventHandler('delete', (row) => {
    if (!canDelete.value) {
      toast.error('You do not have permission to delete users')
      return
    }
    // Open delete confirmation dialog
    userToDelete.value = row
    showDeleteConfirmation.value = true
  })

  // Mark as set up
  eventHandlersSetUp.value = true
}
</script>

<style>
/* Styles moved to datatables.css for better organization */
</style>
