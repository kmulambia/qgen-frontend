<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="space-y-4">
    <!-- Filter Section -->
    <div class="theme-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <!-- Search Input -->
        <div class="flex-1 w-full lg:w-auto">
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 capitalize">
            {{ t('system.table.search') }}
          </label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search audit logs..."
              class="theme-input w-full pl-10"
            />
          </div>
        </div>

        <!-- Action Filter -->
        <div class="w-full sm:w-48">
          <label for="action-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Action Type
          </label>
          <select
            id="action-filter"
            v-model="actionFilter"
            class="theme-input w-full cursor-pointer"
          >
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="password_reset">Password Reset</option>
            <option value="access">Access</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Audit Table -->
    <div class="theme-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <DataTable ref="table" :columns="columns" :options="tableOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject, computed } from 'vue'
import type { IAudit, IRequestFilterCondition } from '@/interfaces'
import { IRequestFilterOperator } from '@/interfaces'
import type { IDataTableCallback } from '@/interfaces/datatables-interfaces'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import 'datatables.net-buttons'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'datatables.net-buttons/js/buttons.print.js'
import { useDataTableQueryBuilder } from '@/composables/datatable'
import moment from 'moment'
import { useToast } from 'vue-toastification'
import { formatErrorMessage } from '@/utils/errors'
import type { AuditStore } from '@/stores/audit-store'
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
const auditStore = inject<AuditStore>('auditStore')!

// Permission checks
const canViewAudit = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('audit.*') ||
  sessionStore.hasPermission('audit.view') ||
  sessionStore.hasPermission('audit.list')
)

// Filter state
const searchQuery = ref('')
const actionFilter = ref('')

// DataTable composables
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()

const columns = [
  {
    data: 'action',
    title: 'Action',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      if (!data) return 'N/A'
      // Extract the action type from dot notation (e.g., 'user.login' -> 'login')
      const actionType = data.includes('.') ? data.split('.')[1] : data
      const colors: Record<string, string> = {
        create: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        login: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        logout: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
        password_change: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        password_reset: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        access: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      }
      const colorClass = colors[actionType?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} capitalize">${actionType.replace('_', ' ')}</span>`
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
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      }
      const colorClass = colors[data?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} capitalize">${data || 'N/A'}</span>`
    },
  },
  {
    data: 'user_metadata',
    title: 'Performed By',
    exportable: true,
    orderable: false,
    visible: true,
    render: function (data: string | Record<string, unknown> | null) {
      if (!data || data === 'null') return 'System'
      try {
        const metadata = typeof data === 'string' ? JSON.parse(data) : data
        const name = `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim()
        return name || metadata.email || 'System'
      } catch {
        return 'System'
      }
    },
  },
  {
    data: 'entity_metadata',
    title: 'IP Address',
    exportable: true,
    orderable: false,
    visible: true,
    render: function (data: string | Record<string, unknown> | null) {
      if (!data || data === 'null') return 'N/A'
      try {
        const metadata = typeof data === 'string' ? JSON.parse(data) : data
        return (metadata.ip_address as string) || 'N/A'
      } catch {
        return 'N/A'
      }
    },
  },
  {
    data: 'entity_metadata',
    title: 'Details',
    exportable: true,
    orderable: false,
    visible: true,
    render: function (data: string | Record<string, unknown> | null) {
      if (!data || data === 'null') return 'N/A'
      try {
        const metadata = typeof data === 'string' ? JSON.parse(data) : data
        // Extract meaningful information based on what's available
        const details: string[] = []
        if (metadata.status) details.push(`Status: ${metadata.status}`)
        if (metadata.error) details.push(`Error: ${metadata.error}`)
        if (metadata.email && !metadata.id) details.push(`Email: ${metadata.email}`)

        return details.length > 0 ? details.join(' | ') : 'N/A'
      } catch {
        return 'N/A'
      }
    },
  },
  {
    data: 'created_at',
    title: 'Timestamp',
    exportable: true,
    orderable: true,
    visible: true,
    render: function (data: string) {
      return data ? moment(data).format('MMM DD, YYYY HH:mm:ss') : 'N/A'
    },
  },
]

// DataTable options with server-side processing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableOptions: any = {
  dom: `
    <"flex flex-wrap justify-between items-center p-4 gap-2 sm:flex-nowrap"<"flex items-center gap-2"B>>
    <"table-container overflow-auto px-4"rt>
    <"flex items-center justify-between p-4 gap-4"<"flex-shrink-0"l><"flex-grow flex justify-center"p><"flex-shrink-0"i>>
  `,
  searching: false,
  serverSide: true,
  name: 'user-audits',
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
      filename: () => `user_audit_${props.userId}_${moment().format('YYYY-MM-DD_HH-mm')}`,
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
      filename: () => `user_audit_${props.userId}_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ajax: async (dtParams: any, callback: (response: IDataTableCallback<IAudit>) => void) => {
    const response = await handleFetch(dtParams)
    callback(response)
  },
  lengthMenu: [10, 25, 50, 100],
  pageLength: 10,
  select: false,
  selectable: false,
  ordering: true,
  order: [[5, 'desc']], // Order by timestamp descending
}

// DataTable fetch handler using query builder
const handleFetch = async (dtParams: DataTableParams): Promise<IDataTableCallback<IAudit>> => {
  try {
    if (!canViewAudit.value) {
      toast.error('You do not have permission to view audit logs')
      return buildErrorResponse(dtParams.draw, 'Permission denied')
    }

    const query = buildFilterQuery(dtParams, columns, {
      include_deleted: false,
    })

    // Add search query to params
    if (searchQuery.value) {
      query.search = searchQuery.value
    }

    // Add custom filters - always filter by user_id
    const filters: IRequestFilterCondition[] = [
      {
        field: 'user_id',
        operator: IRequestFilterOperator.EQUALS,
        value: props.userId,
        type: 'string',
      },
    ]

    // Add action filter if selected
    if (actionFilter.value) {
      filters.push({
        field: 'action',
        operator: IRequestFilterOperator.EQUALS,
        value: actionFilter.value,
        type: 'string',
      })
    }

    const response = await auditStore.query(query, filters)

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

watch(table, (newValue) => {
  if (newValue && newValue.dt) {
    dt = newValue.dt
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

// Watch action filter for immediate reload
watch(actionFilter, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

// Watch userId prop changes
watch(() => props.userId, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

// Load data on mount
onMounted(() => {
  // Table will auto-load via ajax option
})
</script>

<style scoped>
/* Styles are handled by global datatable styles */
</style>
