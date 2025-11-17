<template>
  <!-- Create/Edit Layout Modal -->
  <div
    v-if="open"
    class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
  >
    <div
      :class="[
        'theme-modal relative w-full bg-white dark:bg-gray-800 shadow-xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col',
        hasField('terms_conditions') || hasField('notes') ? 'max-w-4xl' : 'max-w-2xl'
      ]"
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
      <div class="flex-1 overflow-y-auto">
        <form @submit.prevent="onSubmit" class="p-4 md:p-5 space-y-4" name="layoutForm">
        <!-- Basic Information Section -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
            Basic Information
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="hasField('name')" class="md:col-span-2">
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Layout Name <span class="text-red-600 dark:text-red-500">*</span>
            </label>
            <input
              v-model="name"
              type="text"
              name="name"
              id="name"
              :disabled="isFormReadonly || isFieldReadonly('name')"
              placeholder="Enter layout name"
              :class="[
                'theme-input w-full',
                errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('name') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
              <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
            </div>

            <div v-if="hasField('description')" class="md:col-span-2">
            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <textarea
              v-model="description"
              name="description"
              id="description"
              rows="3"
              :disabled="isFormReadonly || isFieldReadonly('description')"
              placeholder="Enter layout description"
              :class="[
                'theme-input w-full',
                errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('description') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            ></textarea>
              <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
            </div>

            <div v-if="hasField('is_default')" class="md:col-span-2">
              <div class="flex items-center space-x-3">
                <div class="flex h-6 shrink-0 items-center">
                  <div class="group grid size-4 grid-cols-1">
                    <input
                      v-model="is_default"
                      id="is_default"
                      name="is_default"
                      type="checkbox"
                      :disabled="isFormReadonly || isFieldReadonly('is_default')"
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
                    </svg>
                  </div>
                </div>
                <label
                  for="is_default"
                  class="text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Set as Default Layout
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Layout Information Section -->
        <div v-if="hasField('company_name') || hasField('reference_number') || hasField('email') || hasField('phone') || hasField('address')" class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
            Layout Information
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="hasField('company_name')">
              <label for="company_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Company Name
              </label>
              <input
                v-model="company_name"
                type="text"
                name="company_name"
                id="company_name"
                :disabled="isFormReadonly || isFieldReadonly('company_name')"
                placeholder="Enter company name"
                :class="[
                  'theme-input w-full',
                  errors.company_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('company_name') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.company_name" class="text-red-500 text-sm mt-1">{{ errors.company_name }}</p>
            </div>

            <div v-if="hasField('reference_number')">
              <label for="reference_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Reference Number
              </label>
              <input
                v-model="reference_number"
                type="text"
                name="reference_number"
                id="reference_number"
                :disabled="isFormReadonly || isFieldReadonly('reference_number')"
                placeholder="Enter reference number"
                :class="[
                  'theme-input w-full',
                  errors.reference_number ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('reference_number') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.reference_number" class="text-red-500 text-sm mt-1">{{ errors.reference_number }}</p>
            </div>

            <div v-if="hasField('email')">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                v-model="email"
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                :disabled="isFormReadonly || isFieldReadonly('email')"
                placeholder="Enter email"
                :class="[
                  'theme-input w-full',
                  errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('email') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>

            <div v-if="hasField('phone')">
              <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Phone
              </label>
              <input
                v-model="phone"
                type="tel"
                name="phone"
                id="phone"
                autocomplete="tel"
                :disabled="isFormReadonly || isFieldReadonly('phone')"
                placeholder="Enter phone"
                :class="[
                  'theme-input w-full',
                  errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('phone') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
            </div>
          </div>

          <div v-if="hasField('address')">
            <label for="address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Address
            </label>
            <textarea
              v-model="address"
              name="address"
              id="address"
              rows="3"
              :disabled="isFormReadonly || isFieldReadonly('address')"
              placeholder="Enter address"
              :class="[
                'theme-input w-full',
                errors.address ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('address') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            ></textarea>
            <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
          </div>
        </div>

        <!-- Terms & Conditions Section -->
        <div v-if="hasField('terms_conditions')" class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
            Terms & Conditions
          </h4>

          <div>
            <label for="terms_conditions" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Terms & Conditions
            </label>
            <textarea
              v-model="terms_conditions"
              name="terms_conditions"
              id="terms_conditions"
              rows="6"
              :disabled="isFormReadonly || isFieldReadonly('terms_conditions')"
              placeholder="Enter terms and conditions"
              :class="[
                'theme-input w-full',
                errors.terms_conditions ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('terms_conditions') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            ></textarea>
            <p v-if="errors.terms_conditions" class="text-red-500 text-sm mt-1">{{ errors.terms_conditions }}</p>
          </div>
        </div>

        <!-- Additional Information Section -->
        <div v-if="hasField('notes')" class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
            Additional Information
          </h4>

          <div>
            <label for="notes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Notes
            </label>
            <textarea
              v-model="notes"
              name="notes"
              id="notes"
              rows="4"
              :disabled="isFormReadonly || isFieldReadonly('notes')"
              placeholder="Enter any additional notes (optional)"
              :class="[
                'theme-input w-full',
                errors.notes ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('notes') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            ></textarea>
            <p v-if="errors.notes" class="text-red-500 text-sm mt-1">{{ errors.notes }}</p>
          </div>
        </div>
        </form>
      </div>

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
import { toRefs, type PropType, computed, watch } from 'vue'
import { useTranslation } from 'i18next-vue'
import { useForm, useField } from 'vee-validate'
import type { ILayout, IField } from '@/interfaces'
import { LayoutSchema } from '@/schemas/layout-schemas'
import { useFormFields } from '@/composables/form/use-form-fields'
import { useSessionStore } from '@/stores/session-store'

const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Permission checks with hierarchy consideration
const canCreate = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('layout.*') ||
    sessionStore.hasPermission('layout.create'),
)

const canEdit = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('layout.*') ||
    sessionStore.hasPermission('layout.update'),
)

const canView = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('layout.*') ||
    sessionStore.hasPermission('layout.view'),
)

const emit = defineEmits(['onClose', 'onSubmit'])

const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  layout: { type: Object as PropType<ILayout | null>, default: () => null },
  fields: {
    type: Array as PropType<IField[]>,
    default: () => [
      { name: 'name', required: true },
      { name: 'description' },
      { name: 'is_default' },
    ],
  },
  title: { type: String, default: 'Create Layout' },
  readonly: { type: Boolean, default: false },
  mode: { type: String as PropType<'create' | 'edit' | 'view'>, default: 'create' },
})

const { loading, open, layout, title, readonly, mode } = toRefs(props)

// Configure fields based on mode
const configuredFields = computed(() => {
  return props.fields.map(field => ({
    ...field,
    readonly: mode.value === 'view' || field.readonly
  }))
})

const { isFieldReadonly } = useFormFields({ fields: configuredFields.value })

// Custom hasField that only shows fields present in the fields prop
const hasField = (fieldName: string): boolean => {
  return props.fields.some(field => field.name === fieldName)
}

const { handleSubmit, errors, resetForm } = useForm<ILayout>({
  validationSchema: LayoutSchema(t),
  initialValues: layout.value || {
    name: '',
    description: '',
    company_name: '',
    reference_number: '',
    email: '',
    phone: '',
    address: '',
    terms_conditions: '',
    notes: '',
    is_default: false,
  },
})

const { value: name } = useField<string>('name')
const { value: description } = useField<string>('description')
const { value: company_name } = useField<string>('company_name')
const { value: reference_number } = useField<string>('reference_number')
const { value: email } = useField<string>('email')
const { value: phone } = useField<string>('phone')
const { value: address } = useField<string>('address')
const { value: terms_conditions } = useField<string>('terms_conditions')
const { value: notes } = useField<string>('notes')
const { value: is_default } = useField<boolean>('is_default')

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
      company_name: '',
      reference_number: '',
      email: '',
      phone: '',
      address: '',
      terms_conditions: '',
      notes: '',
      is_default: false,
    },
  })
}

// Watch for layout prop changes to populate form
watch(
  () => props.layout,
  (newLayout) => {
    if (newLayout && props.open) {
      resetForm({
        values: {
          name: newLayout.name || '',
          description: newLayout.description || '',
          company_name: newLayout.company_name || '',
          reference_number: newLayout.reference_number || '',
          email: newLayout.email || '',
          phone: newLayout.phone || '',
          address: newLayout.address || '',
          terms_conditions: newLayout.terms_conditions || '',
          notes: newLayout.notes || '',
          is_default: newLayout.is_default || false,
        },
      })
    }
  },
  { immediate: true }
)
</script>
