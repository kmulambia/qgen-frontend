<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div class="theme-modal relative w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
        <button
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          type="button"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Workspace Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Workspace <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.workspace_id"
            class="theme-input w-full"
            :disabled="mode === 'view' || mode === 'edit'"
            required
          >
            <option value="">Select workspace...</option>
            <option v-for="ws in workspaces" :key="ws.id" :value="ws.id">
              {{ ws.name }}
            </option>
          </select>
        </div>

        <!-- Role Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.role_id"
            class="theme-input w-full"
            :disabled="mode === 'view'"
            required
          >
            <option value="">Select role...</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <!-- Status Selection (for edit mode) -->
        <div v-if="mode === 'edit' || mode === 'view'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            v-model="formData.status"
            class="theme-input w-full"
            :disabled="mode === 'view'"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Is Default Checkbox -->
        <div class="flex items-center">
          <input
            v-model="formData.is_default"
            type="checkbox"
            id="setDefault"
            class="theme-checkbox"
            :disabled="mode === 'view'"
          />
          <label for="setDefault" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Set as default workspace
          </label>
        </div>
      </form>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="handleClose"
          type="button"
          class="theme-btn theme-btn-secondary px-4 py-2"
        >
          {{ mode === 'view' ? 'Close' : 'Cancel' }}
        </button>
        <button
          v-if="mode !== 'view'"
          @click="handleSubmit"
          type="submit"
          class="theme-btn theme-btn-primary px-4 py-2"
          :disabled="loading"
        >
          <span v-if="loading">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>{{ mode === 'edit' ? 'Update' : 'Add Workspace' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IUserWorkspace, IWorkspace, IRole } from '@/interfaces'

interface Props {
  open: boolean
  loading?: boolean
  title?: string
  mode?: 'create' | 'edit' | 'view'
  userWorkspace?: IUserWorkspace | null
  userId: string
  workspaces: IWorkspace[]
  roles: IRole[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: 'Add Workspace',
  mode: 'create',
  userWorkspace: null,
})

const emit = defineEmits<{
  onClose: []
  onSubmit: [data: Record<string, unknown>]
}>()

const formData = ref({
  workspace_id: '',
  role_id: '',
  is_default: false,
  status: 'active',
})

// Watch for changes to userWorkspace prop
watch(
  () => props.userWorkspace,
  (newValue) => {
    if (newValue && props.mode !== 'create') {
      formData.value = {
        workspace_id: newValue.workspace_id || '',
        role_id: newValue.role_id || '',
        is_default: newValue.is_default || false,
        status: newValue.status || 'active',
      }
    } else {
      // Reset form for create mode
      formData.value = {
        workspace_id: '',
        role_id: '',
        is_default: false,
        status: 'active',
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  emit('onClose')
}

const handleSubmit = () => {
  if (props.mode === 'view') return

  const submitData = {
    ...formData.value,
    user_id: props.userId,
  }

  emit('onSubmit', submitData)
}
</script>

<style scoped>
/* Theme checkbox styles are handled globally */
</style>
