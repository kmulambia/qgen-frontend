<template>
  <!-- Create/Edit Workspace Modal -->
  <div
    v-if="open"
    class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
  >
    <div
      class="theme-modal relative w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl animate-in zoom-in-95 duration-200"
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <button
          @click="close"
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="onSubmit" class="p-4 md:p-5 space-y-4" name="workspaceForm">
        <div v-if="hasField('name')">
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name <span class="text-red-600 dark:text-red-500">*</span>
          </label>
          <input
            v-model="name"
            type="text"
            name="name"
            id="name"
            autocomplete="off"
            :disabled="isFormReadonly || isFieldReadonly('name')"
            placeholder="Enter workspace name"
            :class="[
              'theme-input w-full',
              errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('name') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div v-if="hasField('description')">
          <label
            for="description"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <textarea
            v-model="description"
            name="description"
            id="description"
            rows="4"
            :disabled="isFormReadonly || isFieldReadonly('description')"
            placeholder="Enter workspace description (optional)"
            :class="[
              'theme-input w-full',
              errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('description') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">
            {{ errors.description }}
          </p>
        </div>

        <div v-if="hasField('workspace_type_id')">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Workspace Type
          </label>
          <select
            v-model="workspace_type_id"
            name="workspace_type_id"
            id="workspace_type_id"
            :disabled="isFormReadonly || isFieldReadonly('workspace_type_id')"
            :class="[
              'theme-input w-full',
              errors.workspace_type_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('workspace_type_id') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          >
            <option value="">Select workspace type</option>
            <option v-for="wt in workspaceTypes" :key="wt.id" :value="wt.id">
              {{ wt.name }}
            </option>
          </select>
          <p v-if="errors.workspace_type_id" class="text-red-500 text-sm mt-1">
            {{ errors.workspace_type_id }}
          </p>
        </div>

        <div v-if="hasField('reference_name')">
          <label
            for="reference_name"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Reference Name
          </label>
          <input
            v-model="reference_name"
            type="text"
            name="reference_name"
            id="reference_name"
            autocomplete="off"
            :disabled="isFormReadonly || isFieldReadonly('reference_name')"
            placeholder="Enter reference name (optional)"
            :class="[
              'theme-input w-full',
              errors.reference_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('reference_name') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          />
          <p v-if="errors.reference_name" class="text-red-500 text-sm mt-1">
            {{ errors.reference_name }}
          </p>
        </div>

        <div v-if="hasField('reference_type')">
          <label
            for="reference_type"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Reference Type
          </label>
          <input
            v-model="reference_type"
            type="text"
            name="reference_type"
            id="reference_type"
            autocomplete="off"
            :disabled="isFormReadonly || isFieldReadonly('reference_type')"
            placeholder="Enter reference type (optional)"
            :class="[
              'theme-input w-full',
              errors.reference_type ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('reference_type') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          />
          <p v-if="errors.reference_type" class="text-red-500 text-sm mt-1">
            {{ errors.reference_type }}
          </p>
        </div>

        <div v-if="hasField('reference_number')">
          <label
            for="reference_number"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Reference Number
          </label>
          <input
            v-model="reference_number"
            type="text"
            name="reference_number"
            id="reference_number"
            autocomplete="off"
            :disabled="isFormReadonly || isFieldReadonly('reference_number')"
            placeholder="Enter reference number (optional)"
            :class="[
              'theme-input w-full',
              errors.reference_number ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('reference_number') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          />
          <p v-if="errors.reference_number" class="text-red-500 text-sm mt-1">
            {{ errors.reference_number }}
          </p>
        </div>
      </form>

      <!-- Modal Footer -->
      <div
        class="flex items-center justify-end p-4 md:p-5 space-x-3 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          type="button"
          @click="close"
          class="theme-btn theme-btn-secondary px-5 py-2.5 capitalize focus:ring-4 focus:outline-none"
        >
          {{ isViewMode ? t('system.crud.close') : t('system.crud.cancel') }}
        </button>
        <button
          v-if="!isViewMode"
          type="submit"
          :disabled="loading || !hasPermission"
          @click="onSubmit"
          class="theme-btn theme-btn-primary px-5 py-2.5 capitalize focus:ring-4 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg
            v-if="loading"
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{
            loading ? t('system.crud.submitting', 'Submitting...') : t('system.crud.submit')
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, type PropType, computed } from 'vue'
import { useTranslation } from 'i18next-vue'
import { useForm, useField } from 'vee-validate'
import type { IWorkspace, IWorkspaceType, IField } from '@/interfaces'
import { WorkspaceSchema } from '@/schemas/workspace-schemas'
import { useFormFields } from '@/composables/form/use-form-fields'
import { useSessionStore } from '@/stores/session-store'

const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Permission checks with hierarchy consideration
const canCreate = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('.*') ||
    sessionStore.hasPermission('workspace.*') ||
    sessionStore.hasPermission('workspace.create'),
)

const canEdit = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('.*') ||
    sessionStore.hasPermission('workspace.*') ||
    sessionStore.hasPermission('workspace.update'),
)

const canView = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('.*') ||
    sessionStore.hasPermission('workspace.*') ||
    sessionStore.hasPermission('workspace.view'),
)

const emit = defineEmits(['onClose', 'onSubmit'])

const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  workspace: { type: Object as PropType<IWorkspace | null>, default: () => null },
  workspaceTypes: { type: Array as PropType<IWorkspaceType[]>, default: () => [] },
  fields: {
    type: Array as PropType<IField[]>,
    default: () => [
      { name: 'name' },
      { name: 'description' },
      { name: 'workspace_type_id' },
      { name: 'reference_name' },
      { name: 'reference_type' },
      { name: 'reference_number' },
    ],
  },
  title: { type: String, default: 'Create Workspace' },
  readonly: { type: Boolean, default: false },
  mode: { type: String as PropType<'create' | 'edit' | 'view'>, default: 'create' },
})

const { loading, open, workspace, workspaceTypes, title, readonly, mode } = toRefs(props)

// Configure fields based on mode
const configuredFields = computed(() => {
  const baseFields = [
    { name: 'name', readonly: mode.value === 'view' },
    { name: 'description', readonly: mode.value === 'view' },
    { name: 'workspace_type_id', readonly: mode.value === 'view' },
    { name: 'reference_name', readonly: mode.value === 'view' },
    { name: 'reference_type', readonly: mode.value === 'view' },
    { name: 'reference_number', readonly: mode.value === 'view' },
  ]
  return baseFields
})

const { hasField, isFieldReadonly } = useFormFields({ fields: configuredFields.value })

const { handleSubmit, errors, resetForm } = useForm<IWorkspace>({
  validationSchema: WorkspaceSchema(t),
  initialValues: workspace.value || {
    name: '',
    description: '',
    workspace_type_id: '',
    reference_name: '',
    reference_type: '',
    reference_number: '',
  },
})

const { value: name } = useField<string>('name')
const { value: description } = useField<string>('description')
const { value: workspace_type_id } = useField<string>('workspace_type_id')
const { value: reference_name } = useField<string>('reference_name')
const { value: reference_type } = useField<string>('reference_type')
const { value: reference_number } = useField<string>('reference_number')

// Determine if this is create, edit, or view mode
const isEditMode = computed(() => mode.value === 'edit')
const isViewMode = computed(() => mode.value === 'view')

const hasPermission = computed(() => {
  if (isViewMode.value) {
    return canView.value
  } else if (isEditMode.value) {
    return canEdit.value
  } else {
    return canCreate.value
  }
})

// Form should be readonly in view mode
const isFormReadonly = computed(() => isViewMode.value || readonly.value)

const onSubmit = handleSubmit(async (values) => {
  if (!hasPermission.value) {
    return // Permission check will be handled by parent component
  }
  emit('onSubmit', values)
  clearFields()
})

const close = () => {
  emit('onClose')
  clearFields()
}

const clearFields = () => {
  resetForm({
    values: {
      name: '',
      description: '',
      workspace_type_id: '',
      reference_name: '',
      reference_type: '',
      reference_number: '',
    },
  })
}
</script>
