<template>
  <!-- Create/Edit Client Modal -->
  <div
    v-if="open"
    class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
  >
    <div
      :class="[
        'theme-modal relative w-full bg-white dark:bg-gray-800 shadow-xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col',
        hasField('address_line1') || hasField('notes') ? 'max-w-4xl' : 'max-w-2xl'
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
        <form @submit.prevent="onSubmit" class="p-4 md:p-5 space-y-4" name="clientForm">
        <!-- Company Information Section -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
            Company Information
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="hasField('company_name')" class="md:col-span-2">
            <label for="company_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Company Name <span class="text-red-600 dark:text-red-500">*</span>
            </label>
            <input
              v-model="company_name"
              type="text"
              name="company_name"
              id="company_name"
              autocomplete="organization"
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

            <div v-if="hasField('registration_number')">
            <label for="registration_number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Registration Number
            </label>
            <input
              v-model="registration_number"
              type="text"
              name="registration_number"
              id="registration_number"
              :disabled="isFormReadonly || isFieldReadonly('registration_number')"
              placeholder="Enter registration number"
              :class="[
                'theme-input w-full',
                errors.registration_number ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('registration_number') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.registration_number" class="text-red-500 text-sm mt-1">
                {{ errors.registration_number }}
              </p>
            </div>

            <div v-if="hasField('tax_id')">
            <label for="tax_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tax ID
            </label>
            <input
              v-model="tax_id"
              type="text"
              name="tax_id"
              id="tax_id"
              :disabled="isFormReadonly || isFieldReadonly('tax_id')"
              placeholder="Enter tax ID"
              :class="[
                'theme-input w-full',
                errors.tax_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('tax_id') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
              />
              <p v-if="errors.tax_id" class="text-red-500 text-sm mt-1">{{ errors.tax_id }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="Enter phone number"
                :class="[
                  'theme-input w-full',
                  errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('phone') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
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
                placeholder="Enter email address"
                :class="[
                  'theme-input w-full',
                  errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('email') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>
          </div>

          <div v-if="hasField('website')">
            <label for="website" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Website
            </label>
            <input
              v-model="website"
              type="url"
              name="website"
              id="website"
              autocomplete="url"
              :disabled="isFormReadonly || isFieldReadonly('website')"
              placeholder="https://example.com"
              :class="[
                'theme-input w-full',
                errors.website ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('website') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.website" class="text-red-500 text-sm mt-1">{{ errors.website }}</p>
          </div>
        </div>

        <!-- Address Information Section -->
        <div v-if="hasField('address_line1') || hasField('address_line2') || hasField('city') || hasField('state') || hasField('country') || hasField('postal_code')" class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
            Address Information
          </h4>

          <div v-if="hasField('address_line1')">
            <label for="address_line1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Address Line 1
            </label>
            <input
              v-model="address_line1"
              type="text"
              name="address_line1"
              id="address_line1"
              autocomplete="address-line1"
              :disabled="isFormReadonly || isFieldReadonly('address_line1')"
              placeholder="Enter address line 1"
              :class="[
                'theme-input w-full',
                errors.address_line1 ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('address_line1') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.address_line1" class="text-red-500 text-sm mt-1">{{ errors.address_line1 }}</p>
          </div>

          <div v-if="hasField('address_line2')">
            <label for="address_line2" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Address Line 2
            </label>
            <input
              v-model="address_line2"
              type="text"
              name="address_line2"
              id="address_line2"
              autocomplete="address-line2"
              :disabled="isFormReadonly || isFieldReadonly('address_line2')"
              placeholder="Enter address line 2 (optional)"
              :class="[
                'theme-input w-full',
                errors.address_line2 ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('address_line2') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.address_line2" class="text-red-500 text-sm mt-1">{{ errors.address_line2 }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="hasField('city')">
              <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                City
              </label>
              <input
                v-model="city"
                type="text"
                name="city"
                id="city"
                autocomplete="address-level2"
                :disabled="isFormReadonly || isFieldReadonly('city')"
                placeholder="Enter city"
                :class="[
                  'theme-input w-full',
                  errors.city ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('city') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.city" class="text-red-500 text-sm mt-1">{{ errors.city }}</p>
            </div>

            <div v-if="hasField('state')">
              <label for="state" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                State/Province
              </label>
              <input
                v-model="state"
                type="text"
                name="state"
                id="state"
                autocomplete="address-level1"
                :disabled="isFormReadonly || isFieldReadonly('state')"
                placeholder="Enter state/province"
                :class="[
                  'theme-input w-full',
                  errors.state ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('state') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.state" class="text-red-500 text-sm mt-1">{{ errors.state }}</p>
            </div>

            <div v-if="hasField('postal_code')">
              <label for="postal_code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Postal Code
              </label>
              <input
                v-model="postal_code"
                type="text"
                name="postal_code"
                id="postal_code"
                autocomplete="postal-code"
                :disabled="isFormReadonly || isFieldReadonly('postal_code')"
                placeholder="Enter postal code"
                :class="[
                  'theme-input w-full',
                  errors.postal_code ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('postal_code') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.postal_code" class="text-red-500 text-sm mt-1">{{ errors.postal_code }}</p>
            </div>
          </div>

          <div v-if="hasField('country')">
            <label for="country" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Country
            </label>
            <input
              v-model="country"
              type="text"
              name="country"
              id="country"
              autocomplete="country-name"
              :disabled="isFormReadonly || isFieldReadonly('country')"
              placeholder="Enter country"
              :class="[
                'theme-input w-full',
                errors.country ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                isFieldReadonly('country') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
              ]"
            />
            <p v-if="errors.country" class="text-red-500 text-sm mt-1">{{ errors.country }}</p>
          </div>
        </div>

        <!-- Contact Person Information Section -->
        <div v-if="hasField('contact_person_name') || hasField('contact_person_email') || hasField('contact_person_phone') || hasField('contact_person_position')" class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
            Primary Contact Person
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="hasField('contact_person_name')">
              <label for="contact_person_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Contact Name
              </label>
              <input
                v-model="contact_person_name"
                type="text"
                name="contact_person_name"
                id="contact_person_name"
                :disabled="isFormReadonly || isFieldReadonly('contact_person_name')"
                placeholder="Enter contact person name"
                :class="[
                  'theme-input w-full',
                  errors.contact_person_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('contact_person_name') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.contact_person_name" class="text-red-500 text-sm mt-1">
                {{ errors.contact_person_name }}
              </p>
            </div>

            <div v-if="hasField('contact_person_position')">
              <label for="contact_person_position" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Position
              </label>
              <input
                v-model="contact_person_position"
                type="text"
                name="contact_person_position"
                id="contact_person_position"
                :disabled="isFormReadonly || isFieldReadonly('contact_person_position')"
                placeholder="Enter position/title"
                :class="[
                  'theme-input w-full',
                  errors.contact_person_position ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('contact_person_position') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.contact_person_position" class="text-red-500 text-sm mt-1">
                {{ errors.contact_person_position }}
              </p>
            </div>

            <div v-if="hasField('contact_person_email')">
              <label for="contact_person_email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Contact Email
              </label>
              <input
                v-model="contact_person_email"
                type="email"
                name="contact_person_email"
                id="contact_person_email"
                :disabled="isFormReadonly || isFieldReadonly('contact_person_email')"
                placeholder="Enter contact email"
                :class="[
                  'theme-input w-full',
                  errors.contact_person_email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('contact_person_email') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.contact_person_email" class="text-red-500 text-sm mt-1">
                {{ errors.contact_person_email }}
              </p>
            </div>

            <div v-if="hasField('contact_person_phone')">
              <label for="contact_person_phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Contact Phone
              </label>
              <input
                v-model="contact_person_phone"
                type="tel"
                name="contact_person_phone"
                id="contact_person_phone"
                :disabled="isFormReadonly || isFieldReadonly('contact_person_phone')"
                placeholder="Enter contact phone"
                :class="[
                  'theme-input w-full',
                  errors.contact_person_phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('contact_person_phone') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
                ]"
              />
              <p v-if="errors.contact_person_phone" class="text-red-500 text-sm mt-1">
                {{ errors.contact_person_phone }}
              </p>
            </div>
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
import type { IClient, IField } from '@/interfaces'
import { ClientSchema } from '@/schemas/client-schemas'
import { useFormFields } from '@/composables/form/use-form-fields'
import { useSessionStore } from '@/stores/session-store'

const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Permission checks with hierarchy consideration
const canCreate = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('client.*') ||
    sessionStore.hasPermission('client.create'),
)

const canEdit = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('client.*') ||
    sessionStore.hasPermission('client.update'),
)

const canView = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('client.*') ||
    sessionStore.hasPermission('client.view'),
)

const emit = defineEmits(['onClose', 'onSubmit'])

const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  client: { type: Object as PropType<IClient | null>, default: () => null },
  fields: {
    type: Array as PropType<IField[]>,
    default: () => [
      { name: 'company_name', required: true },
      { name: 'email' },
      { name: 'phone' },
      { name: 'contact_person_name' },
      { name: 'contact_person_email' },
      { name: 'contact_person_phone' },
    ],
  },
  title: { type: String, default: 'Create Client' },
  readonly: { type: Boolean, default: false },
  mode: { type: String as PropType<'create' | 'edit' | 'view'>, default: 'create' },
})

const { loading, open, client, title, readonly, mode } = toRefs(props)

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

const { handleSubmit, errors, resetForm } = useForm<IClient>({
  validationSchema: ClientSchema(t),
  initialValues: client.value || {
    company_name: '',
    registration_number: '',
    tax_id: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    contact_person_position: '',
    notes: '',
  },
})

const { value: company_name } = useField<string>('company_name')
const { value: registration_number } = useField<string>('registration_number')
const { value: tax_id } = useField<string>('tax_id')
const { value: address_line1 } = useField<string>('address_line1')
const { value: address_line2 } = useField<string>('address_line2')
const { value: city } = useField<string>('city')
const { value: state } = useField<string>('state')
const { value: country } = useField<string>('country')
const { value: postal_code } = useField<string>('postal_code')
const { value: phone } = useField<string>('phone')
const { value: email } = useField<string>('email')
const { value: website } = useField<string>('website')
const { value: contact_person_name } = useField<string>('contact_person_name')
const { value: contact_person_email } = useField<string>('contact_person_email')
const { value: contact_person_phone } = useField<string>('contact_person_phone')
const { value: contact_person_position } = useField<string>('contact_person_position')
const { value: notes } = useField<string>('notes')

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
      company_name: '',
      registration_number: '',
      tax_id: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      phone: '',
      email: '',
      website: '',
      contact_person_name: '',
      contact_person_email: '',
      contact_person_phone: '',
      contact_person_position: '',
      notes: '',
    },
  })
}

// Watch for client prop changes to populate form
watch(
  () => props.client,
  (newClient) => {
    if (newClient && props.open) {
      resetForm({
        values: {
          company_name: newClient.company_name || '',
          registration_number: newClient.registration_number || '',
          tax_id: newClient.tax_id || '',
          address_line1: newClient.address_line1 || '',
          address_line2: newClient.address_line2 || '',
          city: newClient.city || '',
          state: newClient.state || '',
          country: newClient.country || '',
          postal_code: newClient.postal_code || '',
          phone: newClient.phone || '',
          email: newClient.email || '',
          website: newClient.website || '',
          contact_person_name: newClient.contact_person_name || '',
          contact_person_email: newClient.contact_person_email || '',
          contact_person_phone: newClient.contact_person_phone || '',
          contact_person_position: newClient.contact_person_position || '',
          notes: newClient.notes || '',
        },
      })
    }
  },
  { immediate: true }
)
</script>
