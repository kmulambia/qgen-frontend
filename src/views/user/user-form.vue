<template>
  <!-- Create/Edit User Modal -->
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
      <form
        ref="formRef"
        @submit.prevent="onSubmit"
        class="p-4 md:p-5 space-y-4"
        name="userForm"
      >
        <div v-if="hasField('email')">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email <span class="text-red-600 dark:text-red-500">*</span>
          </label>
          <input
            v-model="email"
            type="email"
            name="email"
            id="email"
            autocomplete="off"
            :disabled="isFormReadonly || isFieldReadonly('email')"
            placeholder="Enter email address"
            :class="[
              'theme-input w-full',
              errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('email') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="hasField('phone')">
            <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Phone <span class="text-red-600 dark:text-red-500">*</span>
            </label>
            <input
              v-model="phone"
              type="tel"
              name="phone"
              id="phone"
              autocomplete="off"
              :disabled="isFormReadonly || isFieldReadonly('phone')"
              placeholder="Enter phone number"
              :class="[
                'theme-input w-full',
                errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('phone') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
          </div>

          <div v-if="hasField('sex')">
            <label for="sex" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Sex
            </label>
            <select
              v-model="sex"
              name="sex"
              id="sex"
              :disabled="isFormReadonly || isFieldReadonly('sex')"
              :class="[
                'theme-input w-full',
                errors.sex ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('sex') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            >
              <option value="">Select Sex</option>
              <option
                v-for="sexOption in sexOptions"
                :key="sexOption.value"
                :value="sexOption.value"
              >
                {{ sexOption.name }}
              </option>
            </select>
            <p v-if="errors.sex" class="text-red-500 text-sm mt-1">{{ errors.sex }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="hasField('first_name')">
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              First Name <span class="text-red-600 dark:text-red-500">*</span>
            </label>
            <input
              v-model="first_name"
              type="text"
              name="first_name"
              id="first_name"
              autocomplete="off"
              :disabled="isFormReadonly || isFieldReadonly('first_name')"
              placeholder="Enter first name"
              :class="[
                'theme-input w-full',
                errors.first_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('first_name') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.first_name" class="text-red-500 text-sm mt-1">{{ errors.first_name }}</p>
          </div>

          <div v-if="hasField('last_name')">
            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Last Name <span class="text-red-600 dark:text-red-500">*</span>
            </label>
            <input
              v-model="last_name"
              type="text"
              name="last_name"
              id="last_name"
              autocomplete="off"
              :disabled="isFormReadonly || isFieldReadonly('last_name')"
              placeholder="Enter last name"
              :class="[
                'theme-input w-full',
                errors.last_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('last_name') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.last_name" class="text-red-500 text-sm mt-1">{{ errors.last_name }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="hasField('id_type')">
            <label for="id_type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              ID Type
            </label>
            <select
              v-model="id_type"
              name="id_type"
              id="id_type"
              :disabled="isFormReadonly || isFieldReadonly('id_type')"
              :class="[
                'theme-input w-full',
                errors.id_type ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('id_type') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            >
              <option value="">Select ID Type</option>
              <option v-for="idType in idTypes" :key="idType.value" :value="idType.value">
                {{ idType.name }}
              </option>
            </select>
            <p v-if="errors.id_type" class="text-red-500 text-sm mt-1">{{ errors.id_type }}</p>
          </div>

          <div v-if="hasField('id_number')">
            <label for="id_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              ID Number
            </label>
            <input
              v-model="id_number"
              type="text"
              name="id_number"
              id="id_number"
              autocomplete="off"
              :disabled="isFormReadonly || isFieldReadonly('id_number')"
              placeholder="Enter ID number"
              :class="[
                'theme-input w-full',
                errors.id_number ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('id_number') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.id_number" class="text-red-500 text-sm mt-1">{{ errors.id_number }}</p>
          </div>
        </div>

        <div v-if="hasField('status')">
          <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Status
          </label>
          <select
            v-model="status"
            name="status"
            id="status"
            :disabled="isFormReadonly || isFieldReadonly('status')"
            :class="[
              'theme-input w-full',
              errors.status ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('status') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
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
import { toRefs, type PropType, computed, onMounted, ref, inject } from 'vue'
import { useTranslation } from 'i18next-vue'
import { useForm, useField } from 'vee-validate'
import type { IUser, IField } from '@/interfaces'
import type { IIdType, ISex } from '@/interfaces/static-data-interfaces'
import { UserSchema } from '@/schemas/user-schemas'
import { useSessionStore } from '@/stores/session-store'
import type { IdTypesService, SexService } from '@/service/static'

const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Permission checks with hierarchy consideration
const canCreate = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('user.*') ||
    sessionStore.hasPermission('user.create'),
)

const canEdit = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('user.*') ||
    sessionStore.hasPermission('user.update'),
)

const canView = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('user.*') ||
    sessionStore.hasPermission('user.view'),
)

const emit = defineEmits(['onClose', 'onSubmit'])

const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  user: { type: Object as PropType<IUser | null>, default: () => null },
  fields: {
    type: Array as PropType<IField[]>,
    default: () => [
      { name: 'email' },
      { name: 'phone' },
      { name: 'sex' },
      { name: 'first_name' },
      { name: 'last_name' },
      { name: 'id_type' },
      { name: 'id_number' },
      { name: 'status' },
    ],
  },
  title: { type: String, default: 'Create User' },
  readonly: { type: Boolean, default: false },
  mode: { type: String as PropType<'create' | 'edit' | 'view'>, default: 'create' },
})

const { loading, open, user, title, readonly, mode, fields } = toRefs(props)

// Configure fields based on mode - map the passed fields prop with readonly status
const configuredFields = computed(() => {
  return fields.value.map(field => ({
    ...field,
    readonly: field.readonly !== undefined ? field.readonly : mode.value === 'view'
  }))
})

// Create reactive field checking functions
const hasField = (fieldName: string): boolean => {
  const field = configuredFields.value.find(f => f.name === fieldName)
  return field ? (field.visible !== false) : false
}

const isFieldReadonly = (fieldName: string): boolean => {
  const field = configuredFields.value.find(f => f.name === fieldName)
  return field ? (field.readonly === true) : false
}

const { handleSubmit, errors, resetForm } = useForm<IUser>({
  validationSchema: UserSchema(t),
  initialValues: user.value || {
    email: '',
    phone: '',
    sex: '',
    first_name: '',
    last_name: '',
    id_type: '',
    id_number: '',
    status: 'active',
  },
})

const { value: email } = useField<string>('email')
const { value: phone } = useField<string>('phone')
const { value: sex } = useField<string>('sex')
const { value: first_name } = useField<string>('first_name')
const { value: last_name } = useField<string>('last_name')
const { value: id_type } = useField<string>('id_type')
const { value: id_number } = useField<string>('id_number')
const { value: status } = useField<string>('status')

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

// Inject stores and services
const idTypesService = inject<IdTypesService>('idTypesService')!
const sexService = inject<SexService>('sexService')!

// Data
const idTypes = ref<IIdType[]>([])
const sexOptions = ref<ISex[]>([])

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
      email: '',
      phone: '',
      sex: '',
      first_name: '',
      last_name: '',
      id_type: '',
      id_number: '',
      status: 'active',
    },
  })
}

// Load data
const loadStaticData = async () => {
  try {
    // Load ID types
    const idTypesResponse = await idTypesService.getAll()
    idTypes.value = idTypesResponse.data

    // Load sex options
    const sexResponse = await sexService.getAll()
    sexOptions.value = sexResponse.data
  } catch (error) {
    console.error('Error loading static data:', error)
  }
}

onMounted(() => {
  loadStaticData()
})
</script>
