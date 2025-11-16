<template>
  <!-- Create/Edit Role Modal -->
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
      <form @submit.prevent="onSubmit" class="p-4 md:p-5 space-y-4" name="roleForm">
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
            placeholder="Enter role name"
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
            placeholder="Enter role description (optional)"
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

        <div v-if="hasField('status')">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Status <span class="text-red-600 dark:text-red-500">*</span>
          </label>
          <div class="flex items-center gap-6">
            <div
              v-for="statusOption in statusOptions"
              :key="statusOption.value"
              class="flex items-center space-x-3"
            >
              <div class="flex h-6 shrink-0 items-center">
                <div class="group grid size-4 grid-cols-1">
                  <input
                    v-model="status"
                    :id="`status_${statusOption.value}`"
                    :name="`status`"
                    type="radio"
                    :value="statusOption.value"
                    :disabled="isFormReadonly || isFieldReadonly('status')"
                    class="col-start-1 row-start-1 appearance-none rounded-full border border-gray-300 bg-white checked:border-primary-500 checked:bg-primary-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto dark:border-gray-600 dark:bg-gray-700 dark:checked:border-primary-500 dark:checked:bg-primary-500 transition-all duration-200"
                  />
                  <svg
                    class="pointer-events-none col-start-1 row-start-1 size-2 self-center justify-self-center fill-white group-has-disabled:fill-gray-950/25"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <circle
                      class="opacity-0 group-has-[:checked]:opacity-100"
                      cx="4"
                      cy="4"
                      r="3"
                    />
                  </svg>
                </div>
              </div>
              <label
                :for="`status_${statusOption.value}`"
                class="text-sm font-medium text-gray-900 dark:text-gray-300 capitalize"
              >
                {{ statusOption.label }}
              </label>
            </div>
          </div>
          <p v-if="errors.status" class="text-red-500 text-sm mt-1">
            {{ errors.status }}
          </p>
        </div>

        <div v-if="hasField('is_system_defined')" class="mt-6 flex gap-3">
          <div class="flex h-6 shrink-0 items-center">
            <div class="group grid size-4 grid-cols-1">
              <input
                v-model="is_system_defined"
                id="is_system_defined"
                name="is_system_defined"
                type="checkbox"
                :disabled="isFormReadonly || isFieldReadonly('is_system_defined')"
                class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-primary-500 checked:bg-primary-500 indeterminate:border-primary-500 indeterminate:bg-primary-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto dark:border-gray-600 dark:bg-gray-700 dark:checked:border-primary-500 dark:checked:bg-primary-500 transition-all duration-200"
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
                <path
                  class="opacity-0 group-has-indeterminate:opacity-100"
                  d="M3 7H11"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <label
            for="is_system_defined"
            class="text-sm/6 font-medium text-gray-900 dark:text-gray-300"
            >Is System Defined</label
          >
          <p v-if="errors.is_system_defined" class="text-red-500 text-sm mt-1">
            {{ errors.is_system_defined }}
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
import type { IRole, IField } from '@/interfaces'
import { RoleSchema } from '@/schemas/role-schemas'
import { useFormFields } from '@/composables/form/use-form-fields'
import { useSessionStore } from '@/stores/session-store'

const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Permission checks with hierarchy consideration
const canCreate = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('role.*') ||
    sessionStore.hasPermission('role.create'),
)

const canEdit = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('role.*') ||
    sessionStore.hasPermission('role.update'),
)

const canView = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('role.*') ||
    sessionStore.hasPermission('role.view'),
)

const emit = defineEmits(['onClose', 'onSubmit'])

const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  role: { type: Object as PropType<IRole | null>, default: () => null },
  fields: {
    type: Array as PropType<IField[]>,
    default: () => [
      { name: 'name' },
      { name: 'description' },
      { name: 'is_system_defined', readonly: true },
    ],
  },
  title: { type: String, default: 'Create Role' },
  readonly: { type: Boolean, default: false },
  mode: { type: String as PropType<'create' | 'edit' | 'view'>, default: 'create' },
})

const { loading, open, role, title, readonly, mode } = toRefs(props)

// Status options for radio buttons
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
]

// Configure fields based on mode - is_system_defined is always readonly
const configuredFields = computed(() => {
  const baseFields = [
    { name: 'name', readonly: mode.value === 'view' },
    { name: 'description', readonly: mode.value === 'view' },
    { name: 'status', readonly: mode.value === 'view' },
    { name: 'is_system_defined', readonly: true }, // Always readonly
  ]
  return baseFields
})

const { hasField, isFieldReadonly } = useFormFields({ fields: configuredFields.value })

const { handleSubmit, errors, resetForm } = useForm<IRole>({
  validationSchema: RoleSchema(t),
  initialValues: role.value || {
    name: '',
    description: '',
    status: 'active',
    is_system_defined: false,
  },
})

const { value: name } = useField<string>('name')
const { value: description } = useField<string>('description')
const { value: status } = useField<string>('status')
const { value: is_system_defined } = useField<boolean>('is_system_defined')

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
      status: 'active',
      is_system_defined: false,
    },
  })
}
</script>
