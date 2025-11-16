<script lang="ts" setup>
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { useTranslation } from 'i18next-vue'
import { useToast } from 'vue-toastification'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import FooterComponent from '@/components/layouts/authentication/footer-component.vue'
import configuration from '@/utils/configuration'
import { LoginSchema } from '@/schemas'
import { formatErrorMessage } from '@/utils/errors'
import type { ILogin } from '@/interfaces'
import router from '@/router'
import { useSessionStore } from '@/stores/session-store'

const { name: appName, developer ,version ,environment } = configuration
const toast = useToast()
const { t } = useTranslation()
const sessionStore = useSessionStore()

const showPassword = ref(false)
const rememberMe = ref(false)

const initialValues: ILogin = {
  email: '',
  password: '',
}

const { handleSubmit, errors } = useForm<ILogin>({
  validationSchema: LoginSchema(t),
  initialValues,
})

const { value: email } = useField('email')
const { value: password } = useField('password')

const handleLogin = handleSubmit(async (values: ILogin) => {
  try {
    // Call the session store login method (loading state is managed by the store)
    await sessionStore.login(values)

    toast.success(`${t('system.status.success')}\n${t('system.auth.loggedIn')}`, {
      timeout: 3000,
    })

    // Navigate to admin dashboard on successful login
    router.push('/admin/dashboard')
  } catch (error) {
    toast.error(formatErrorMessage(error, t), {
      timeout: 5000,
    })
  }
})
</script>
<template>
  <!-- Background Image with Overlay -->
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

    <!-- Login Form -->
    <div class="mx-auto w-full max-w-md">
      <div class="auth-card px-3 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-9 shadow-2xl rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800">
        <!-- Sign In Title -->
        <h2 class="text-center text-xl font-semibold text-gray-900 dark:text-white mb-6 capitalize"> {{ t('system.auth.signInToAccount') }}</h2>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- Email Address -->
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
              requiprimary
              placeholder="email@email.com"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 capitalize">
              {{ t('system.fields.password') }}
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                id="password"
                autocomplete="current-password"
                requiprimary
                placeholder="••••••••"
                class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <EyeIcon v-if="!showPassword" class="h-4 w-4" />
                <EyeSlashIcon v-else class="h-4 w-4" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-xs text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="rememberMe"
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-200 capitalize">
                {{ t('system.auth.rememberMe') }}
              </label>
            </div>
            <div class="text-sm">
              <router-link
           to="/auth/forgot-password"
                class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
              >
               {{ t('system.auth.forgotPassword') }}
              </router-link>
            </div>
          </div>

          <!-- Demo Cprimaryentials (Development only) -->
          <div
            v-if="environment === 'development'"
            class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-md"
          >
            <p class="text-xs"><strong>Demo Cprimaryentials:</strong></p>
            <p class="text-xs">Email: mulambiakaponda@gmail.com</p>
            <p class="text-xs">Password: #Dev@admin429</p>
          </div>

          <!-- Sign In Button -->
          <button
            type="submit"
            :disabled="sessionStore.isLoading"
            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <template v-if="sessionStore.isLoading">
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
            <template v-else> {{ t('system.auth.login') }} </template>
          </button>
        </form>

        <!-- Call to action  -->
        <!-- <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            --placeholder for call to action --
            <a href="#" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
              call to action link
            </a>
          </p>
        </div> -->
      </div>

      <!-- Student Login Link (Development only) -->
      <!-- <div v-if="environment === 'development'" class="mt-4 text-center">
        <router-link
          to="/auth/client-login"
          class="inline-flex items-center text-sm font-medium text-white/90 hover:text-white"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Client Portal Login
        </router-link>
      </div> -->

      <!-- Copyright Footer -->
      <footer-component :developer="developer" />
    </div>
  </div>

  <!-- Loading Modal -->
  <div v-if="sessionStore.isLoading" class="fixed inset-0 z-50 flex items-center justify-center">
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
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('system.auth.pleaseWait') }}</p>
      </div>
    </div>
  </div>
</template>
