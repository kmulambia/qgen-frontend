<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else-if="sessionStore.isLoggedIn" class="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div
        class="theme-card bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 p-4 border border-gray-300 dark:border-gray-600"
      >
        <DataTable ref="table" :columns="columns" :options="tableOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { IPermission, IRequestFilterCondition } from '@/interfaces'
import type { IDataTableCallback } from '@/interfaces/datatables-interfaces'
import { IRequestFilterOperator } from '@/interfaces'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import 'datatables.net-buttons'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'datatables.net-buttons/js/buttons.print.js'
import 'datatables.net-rowgroup'
import LoadingComponent from '@/components/loading-component.vue'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import { useDataTableQueryBuilder } from '@/composables/datatable'
import { useBreadcrumbs } from '@/composables/use-breadcrumbs'
import moment from 'moment'
import { useToast } from 'vue-toastification'
import { formatErrorMessage } from '@/utils/errors'
import type { usePermissionStore } from '@/stores/permission-store'
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

const router = useRouter()
const table = ref()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dt: any
const toast = useToast()
const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Inject permission store
const permissionStore = inject<ReturnType<typeof usePermissionStore>>('permissionStore')!

// Permission checks
const canList = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('permission.*') ||
  sessionStore.hasPermission('permission.list')
)

// DataTable loading state
const isLoadingData = ref(false)

// Filter state
const searchQuery = ref('')
const groupFilter = ref('')
const statusFilter = ref('')
const availableGroups = ref<string[]>([])

// Event handlers setup flag
const eventHandlersSetUp = ref(false)

// Load available groups for filter
const loadAvailableGroups = async () => {
  try {
    // Use the efficient getAllGroups endpoint
    const groups = await permissionStore.getAllGroups()
    availableGroups.value = groups.sort()
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    // Fallback to empty array if API fails
    availableGroups.value = []
  }
}

// DataTable composables
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()

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
]

// DataTable options with server-side processing and row grouping
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableOptions: any = {
  dom: `
    <"flex flex-wrap justify-between items-center mb-4 gap-2 sm:flex-nowrap"<"flex items-center gap-2"B>>
    <"table-container overflow-auto"rt>
    <"flex items-center justify-between mt-4 gap-4"<"flex-shrink-0"l><"flex-grow flex justify-center"p><"flex-shrink-0"i>>
  `,
  searching: false,
  serverSide: true,
  name: 'permissions',
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
      filename: () => `permissions_${moment().format('YYYY-MM-DD_HH-mm')}`,
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
      filename: () => `permissions_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ajax: async (dtParams: any, callback: (response: IDataTableCallback<IPermission>) => void) => {
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

// DataTable fetch handler using query builder
const handleFetch = async (
  dtParams: DataTableParams
): Promise<IDataTableCallback<IPermission>> => {
  try {
    if (!canList.value) {
      toast.error('You do not have permission to view permissions')
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

    // Add status filter if selected
    if (statusFilter.value) {
      filters.push({
        field: 'status',
        operator: IRequestFilterOperator.EQUALS,
        value: statusFilter.value
      })
    }

    const response = await permissionStore.query(query, filters)

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

// Set permissions for DataTable actions (none needed for read-only)
const setPermissions = () => {
  // Permissions are read-only, no actions needed
  // If you want to add a view detail action in the future, you can add it here
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
onMounted(() => {
  // Set permissions first
  setPermissions()
  // Load available groups for filter
  loadAvailableGroups()
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

  // No event handlers needed for read-only permissions
  // If you add a view action in the future, set it up here

  // Mark as set up
  eventHandlersSetUp.value = true
}

// --- AUTH GUARD ---
watch(
  () => sessionStore.isLoggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) router.push('/login')
  },
  { immediate: true },
)
</script>

<style>
/* Styles moved to datatables.css for better organization */
</style>
