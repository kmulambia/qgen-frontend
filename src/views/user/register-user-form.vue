<template>
  <!-- Create/Edit User Registration Modal -->
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
        <!-- Information Alert -->
        <AlertComponent
          :open="true"
          :animated="false"
          type="info"
          title="Registration Requirements"
          data="Important: Users must be assigned to both a workspace and a specific role to complete registration. Please ensure you select both a role and workspace before submitting the form."
        />

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
            :disabled="readonly || isFieldReadonly('email')"
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
              :disabled="readonly || isFieldReadonly('phone')"
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
              :disabled="readonly || isFieldReadonly('sex')"
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
              :disabled="readonly || isFieldReadonly('first_name')"
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
              :disabled="readonly || isFieldReadonly('last_name')"
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
              :disabled="readonly || isFieldReadonly('id_type')"
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
              :disabled="readonly || isFieldReadonly('id_number')"
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


        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="hasField('role_id')">
            <label for="role_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Role <span class="text-red-600 dark:text-red-500">*</span>
            </label>
            <select
              v-model="role_id"
              name="role_id"
              id="role_id"
              :disabled="readonly || isFieldReadonly('role_id')"
              :class="[
                'theme-input w-full',
                errors.role_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('role_id') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            >
              <option value="">Select a role</option>
              <option
                v-for="role in roles"
                :key="role.id"
                :value="role.id"
              >
                {{ role.name }}
              </option>
            </select>
            <div class="mt-1">
              <p v-if="errors.role_id" class="text-red-500 text-sm">{{ errors.role_id }}</p>
              <p v-else class="text-gray-500 text-sm">
                {{ roles.length }} role{{ roles.length !== 1 ? 's' : '' }} available
              </p>
            </div>
          </div>

          <div v-if="hasField('workspace_id')">
            <label for="workspace_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Workspace <span class="text-red-600 dark:text-red-500">*</span>
            </label>
            <select
              v-model="workspace_id"
              name="workspace_id"
              id="workspace_id"
              :disabled="readonly || isFieldReadonly('workspace_id')"
              :class="[
                'theme-input w-full',
                errors.workspace_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('workspace_id') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            >
              <option value="">Select a workspace</option>
              <option
                v-for="workspace in workspaces"
                :key="workspace.id"
                :value="workspace.id"
              >
                {{ workspace.name }}
              </option>
            </select>
            <div class="mt-1">
              <p v-if="errors.workspace_id" class="text-red-500 text-sm">{{ errors.workspace_id }}</p>
              <p v-else class="text-gray-500 text-sm">
                {{ workspaces.length }} workspace{{ workspaces.length !== 1 ? 's' : '' }} available
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="hasField('password')">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Password <span class="text-red-600 dark:text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                id="password"
                autocomplete="off"
                :disabled="readonly || isFieldReadonly('password')"
                placeholder="Enter password"
                :class="[
                  'theme-input w-full pr-10',
                  errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('password') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <EyeIcon v-if="!showPassword" class="h-5 w-5" aria-hidden="true" />
                  <EyeSlashIcon v-else class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <div v-if="hasField('confirm_password')">
            <label for="confirm_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Confirm Password <span class="text-red-600 dark:text-red-500">*</span>
            </label>
            <input
              v-model="confirm_password"
              type="password"
              name="confirm_password"
              id="confirm_password"
              autocomplete="off"
              :disabled="readonly || isFieldReadonly('confirm_password')"
              placeholder="Confirm password"
              :class="[
                'theme-input w-full',
                errors.confirm_password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('confirm_password') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.confirm_password" class="text-red-500 text-sm mt-1">{{ errors.confirm_password }}</p>
          </div>
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
          {{ t('system.crud.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="loading"
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
import {
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/vue/24/outline'
import { useTranslation } from 'i18next-vue'
import { useForm, useField } from 'vee-validate'
import AlertComponent from '@/components/alert-component.vue'
import type {
  IUserRegister,
  IRole,
  IField,
  IIdType,
  ISex,
  IWorkspace,
} from '@/interfaces'
import { UserRegisterSchema } from '@/schemas/user-schemas'
import { useFormFields } from '@/composables/form/use-form-fields'
import { useSessionStore } from '@/stores/session-store'
import type { useRoleStore } from '@/stores/role-store'
import type { useWorkspaceStore } from '@/stores/workspace-store'
import type { IdTypesService, SexService } from '@/service/static'

const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Permission checks with hierarchy consideration
const canCreate = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('users.*') ||
    sessionStore.hasPermission('users.create'),
)

const emit = defineEmits(['onClose', 'onSubmit'])
const showPassword = ref(false)

const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  user: { type: Object as PropType<IUserRegister | null>, default: () => null },
  fields: {
    type: Array as PropType<IField[]>,
    default: () => [
      { name: 'email' },
      { name: 'first_name' },
      { name: 'last_name' },
      { name: 'phone' },
      { name: 'id_type' },
      { name: 'id_number' },
      { name: 'sex' },
      { name: 'role_id' },
      { name: 'workspace_id' },
      { name: 'password' },
      { name: 'confirm_password' },
    ],
  },
  title: { type: String, default: 'Register User' },
  readonly: { type: Boolean, default: false },
})

const { loading, open, user, title, readonly } = toRefs(props)

// Configure fields based on mode
const configuredFields = computed(() => {
  const baseFields = [
    { name: 'email' },
    { name: 'first_name' },
    { name: 'last_name' },
    { name: 'phone' },
    { name: 'id_type' },
    { name: 'id_number' },
    { name: 'sex' },
    { name: 'role_id' },
    { name: 'workspace_id' },
    { name: 'password' },
    { name: 'confirm_password' },
  ]
  return baseFields
})

const { hasField, isFieldReadonly } = useFormFields({ fields: configuredFields.value })

const { handleSubmit, errors, resetForm } = useForm<IUserRegister>({
  validationSchema: UserRegisterSchema(t),
  initialValues: user.value || {
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    id_type: '',
    id_number: '',
    sex: '',
    password: '',
    confirm_password: '',
    role_id: '',
    workspace_id: '',
  },
})

const { value: email } = useField<string>('email')
const { value: first_name } = useField<string>('first_name')
const { value: last_name } = useField<string>('last_name')
const { value: phone } = useField<string>('phone')
const { value: id_type } = useField<string>('id_type')
const { value: id_number } = useField<string>('id_number')
const { value: sex } = useField<string>('sex')
const { value: password } = useField<string>('password')
const { value: role_id } = useField<string>('role_id')
const { value: workspace_id } = useField<string>('workspace_id')
const { value: confirm_password } = useField<string>('confirm_password')

const hasPermission = computed(() => canCreate.value)

// Inject stores and services
const roleStore = inject<ReturnType<typeof useRoleStore>>('roleStore')!
const workspaceStore = inject<ReturnType<typeof useWorkspaceStore>>('workspaceStore')!
const idTypesService = inject<IdTypesService>('idTypesService')!
const sexService = inject<SexService>('sexService')!

// Data
const roles = ref<IRole[]>([])
const workspaces = ref<IWorkspace[]>([])
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
      first_name: '',
      last_name: '',
      phone: '',
      id_type: '',
      id_number: '',
      sex: '',
      password: '',
      confirm_password: '',
      role_id: '',
      workspace_id: '',
    },
  })
}

// Load data
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

const loadWorkspaces = async () => {
  try {
    const response = await workspaceStore.query({
      sort_by: 'name',
      sort_dir: 'asc',
      page_size: 100,
      page: 1,
    })

    if (response && response.items) {
      workspaces.value = response.items
    }
  } catch (error) {
    console.error('Error loading workspaces:', error)
  }
}

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
  loadRoles()
  loadWorkspaces()
  loadStaticData()
})
</script>

