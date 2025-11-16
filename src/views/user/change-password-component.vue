<template>
  <!-- Change Password Modal -->
  <div
    v-if="open"
    class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    @click.self="close"
  >
    <div
      class="theme-modal relative w-full max-w-md bg-white dark:bg-gray-800 shadow-xl animate-in zoom-in-95 duration-200"
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
        name="changePasswordForm"
      >
        <!-- Information Alert -->
        <AlertComponent
          :open="true"
          :animated="false"
          type="warning"
          title="Password Requirements"
          data="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        />

        <!-- New Password Field -->
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            New Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              placeholder="Enter new password"
              :disabled="loading"
              class="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              :class="[
                errors.password
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600',
                loading ? 'opacity-50 cursor-not-allowed' : '',
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              tabindex="-1"
            >
              <EyeIcon v-if="!showPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="confirm_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Confirm New Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="confirm_password"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirm_password"
              name="confirm_password"
              placeholder="Confirm new password"
              :disabled="loading"
              class="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              :class="[
                errors.confirm_password
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600',
                loading ? 'opacity-50 cursor-not-allowed' : '',
              ]"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              tabindex="-1"
            >
              <EyeIcon v-if="!showConfirmPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
          <p v-if="errors.confirm_password" class="text-red-500 text-sm mt-1">{{ errors.confirm_password }}</p>
        </div>
      </form>

      <!-- Modal Footer -->
      <div
        class="flex items-center justify-end p-4 md:p-5 space-x-3 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          @click="close"
          type="button"
          :disabled="loading"
          class="theme-btn theme-btn-secondary px-5 py-2.5 capitalize focus:ring-4 focus:outline-none"
          :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
        >
          {{ t('system.crud.cancel') }}
        </button>
        <button
          @click="onSubmit"
          type="submit"
          :disabled="loading"
          class="theme-btn theme-btn-primary px-5 py-2.5 capitalize focus:ring-4 focus:outline-none flex items-center justify-center gap-2"
          :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
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
          <span>{{ loading ? t('system.status.processing') : t('system.crud.submit') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { useTranslation } from 'i18next-vue'
import { useForm, useField } from 'vee-validate'
import AlertComponent from '@/components/alert-component.vue'
import { ChangePasswordSchema } from '@/schemas/user-schemas'

const { t } = useTranslation()

interface ChangePasswordForm {
  password: string
  confirm_password: string
}

const emit = defineEmits<{
  'onClose': []
  'onSubmit': [data: ChangePasswordForm]
}>()

const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Change Password' },
})

const { loading, open, title } = toRefs(props)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const { handleSubmit, errors, resetForm } = useForm<ChangePasswordForm>({
  validationSchema: ChangePasswordSchema(t),
  initialValues: {
    password: '',
    confirm_password: '',
  },
})

const { value: password } = useField<string>('password')
const { value: confirm_password } = useField<string>('confirm_password')

const onSubmit = handleSubmit(async (values) => {
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
      password: '',
      confirm_password: '',
    },
  })
}
</script>
