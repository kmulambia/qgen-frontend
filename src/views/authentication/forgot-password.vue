<script lang="ts" setup>
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { useTranslation } from 'i18next-vue'
import { useToast } from 'vue-toastification'
import FooterComponent from '@/components/layouts/authentication/footer-component.vue'
import configuration from '@/utils/configuration'
import { ForgotPasswordSchema } from '@/schemas'
import { formatErrorMessage } from '@/utils/errors'
import type { IForgotPasswordEmail } from '@/interfaces'
import router from '@/router'

// TODO: Add API call to send reset password email

const { name: appName, developer, version, } = configuration
const toast = useToast()
const { t } = useTranslation()
const loading = ref(false)

const initialValues: IForgotPasswordEmail = {
  email: '',
}

const { handleSubmit, errors } = useForm<IForgotPasswordEmail>({
  validationSchema: ForgotPasswordSchema(t),
  initialValues,
})

const { value: email } = useField('email')

const handleForgotPassword = handleSubmit(async (values: IForgotPasswordEmail) => {
  loading.value = true
  try {
    // Replace this with real API call to request password reset
    console.log('forgot password values', values)
    toast.success(`${t('system.status.success')}\n${t('system.password.passwordResetEmailSent')}`, {
      timeout: 5000,
    })

    // Optionally navigate back to login
    router.push('/auth/login')
  } catch (error) {
    toast.error(formatErrorMessage(error, t), {
      timeout: 5000,
    })
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <!-- Background Image with Overlay -->
  <div class="fixed inset-0 w-full h-full overflow-hidden">
    <img
      src="@/assets/images/backgrounds/bg-1.jpg"
      width="50"
      alt="Background"
      class="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center sm:object-center md:object-center lg:object-center"
    />
    <div
      class="absolute inset-0 bg-gradient-to-br from-orange-400/80 via-orange-500/85 to-red-500/90 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 transition-colors duration-700"
    ></div>
  </div>
  <!-- Content -->
  <div
    class="relative z-10 flex min-h-screen flex-1 flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8"
  >


    <!-- MANEB Logo and Branding -->
    <div class="mx-auto w-full max-w-md text-center mb-8">
      <img
        class="mx-auto h-24 w-auto mb-4 drop-shadow-lg"
        src="@/assets/images/logo.png"
         :alt="developer.name"
      />
      <h1 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">
        {{ appName }} - {{ version }}
      </h1>
      <p class="text-white/95 text-base font-medium drop-shadow-md">
        {{ developer.name }} - {{ developer.email }}
      </p>
    </div>

    <!-- Reset Password Form -->
    <div class="mx-auto w-full max-w-md">
      <div class="auth-card px-3 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-9 bg-white dark:bg-gray-800 shadow-2xl rounded-xl sm:rounded-2xl">
        <!-- Reset Title -->
        <h2 class="text-center text-xl font-semibold text-gray-900 dark:text-white mb-6 capitalize"> {{ t('system.password.resetPassword') }}</h2>

        <form class="space-y-4" @submit.prevent="handleForgotPassword">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 capitalize">
             {{ t('system.fields.emailAddress') }}
            </label>
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              :placeholder="t('system.auth.enterEmail')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600">
              {{ errors.email }}
            </p>
          </div>


          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <template v-if="loading">
              <span class="inline-flex items-center capitalize">
                <svg
                  class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {{ t('system.status.loading') }}..
              </span>
            </template>
            <template v-else> {{ t('system.password.sendResetLink') }} </template>
          </button>

          <div class="mt-6 text-center">
            <router-link to="/auth/login" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
              {{ t('system.password.backToSignIn') }}
            </router-link>
          </div>
        </form>
      </div>



      <!-- Copyright Footer -->
      <footer-component :developer="developer" />
    </div>
  </div>

  <!-- Loading Modal -->
  <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Modal Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <!-- Modal Content -->
    <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 mx-4 max-w-sm w-full">
      <div class="text-center">
        <!-- Loading Spinner -->
        <div class="mx-auto mb-4 w-12 h-12 flex items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        <!-- Modal Title -->
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ t('system.status.loading') }}...</h3>

        <!-- Modal Message -->
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('system.password.pleaseWait') }}</p>
      </div>
    </div>
  </div>
</template>
