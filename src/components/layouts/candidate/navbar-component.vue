<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import configuration from '@/utils/configuration'
import type { INavigation } from '@/interfaces'
import type { CandidateAuthStore } from '@/stores/candidate-auth-store'

const { name: appName } = configuration

// Auth store from provider - direct injection
const authStore = inject<CandidateAuthStore>('authStore')

if (!authStore) {
  throw new Error('Auth store not provided. Make sure it is provided in main.ts')
}

// Format examination number for display
const formatExaminationNumber = (examNumber: string): string => {
  if (!examNumber) return examNumber

  // Remove any existing spaces or special characters except forward slashes
  const cleaned = examNumber.replace(/[^\w/]/g, '')

  // Check if it follows common patterns and format accordingly
  // Pattern: PSLCE/2024/001234 or similar
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/')
    if (parts.length >= 3) {
      // Format as: PSLCE/2024/001234
      return parts.join('/')
    }
  }

  // Pattern: 001 25 158 039 (space-separated groups)
  if (cleaned.length >= 9 && /^\d+$/.test(cleaned)) {
    // Format as: 001 25 158 039
    return cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{3})/, '$1 $2 $3 $4')
  }

  // Pattern: 00125158039 (continuous digits)
  if (cleaned.length >= 9 && /^\d+$/.test(cleaned)) {
    // Format as: 001-25-158-039
    return cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{3})/, '$1-$2-$3-$4')
  }

  // Default: return as-is if no pattern matches
  return cleaned
}

// Format date for display
const formatDateOfBirth = (dateStr: string): string => {
  if (!dateStr) return 'N/A'

  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// Computed user data from auth store
const user = computed(() => {
  if (!authStore.isLoggedIn || !authStore.examinationNumber) {
    return null
  }

  const formattedExamNumber = formatExaminationNumber(authStore.examinationNumber)
  const formattedDOB = formatDateOfBirth(authStore.dateOfBirth || '')

  return {
    name: formattedExamNumber,
    email: `DOB: ${formattedDOB}`,
    examinationNumber: formattedExamNumber,
    dateOfBirth: authStore.dateOfBirth,
    displayName: formattedExamNumber,
  }
})

// Watch for session state changes
watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) {
      // Session has been cleared/expired, redirect to login
      console.log('Session cleared, redirecting to login')
      router.push('/auth/candidate-login')
    }
  },
)

// Watch for token expiration
watch(
  () => authStore.isTokenExpired,
  (isExpired) => {
    if (isExpired && authStore.isLoggedIn) {
      // Token has expired, try to refresh or logout
      console.log('Token expired, attempting to logout')
      logout()
    }
  },
)

const route = useRoute()
const router = useRouter()
const toast = useToast()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// Enhanced logout function with navigation and toast
const logout = () => {
  authStore.logout()
  toast.success('Successfully logged out!')
  showUserMenu.value = false
  router.push('/auth/candidate-login')
}

const navigation: INavigation[] = [
  { name: 'Dashboard', path: '/candidate/dashboard', enabled: true },
  { name: 'Results', path: '/candidate/results', enabled: true },
  { name: 'Certificates', path: '/candidate/certificates', enabled: true },
  { name: 'Remarks', path: '/candidate/remarks', enabled: true },
  { name: 'Timetable', path: '/candidate/timetable', enabled: true },
]

// Computed property for filtered navigation items with guaranteed path
const enabledNavigation = computed(() =>
  navigation.filter((item): item is INavigation & { path: string } =>
    Boolean(item.path && item.enabled !== false),
  ),
)
</script>
<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <img
              class="mx-auto h-10 sm:h-10 lg:h-10 w-auto drop-shadow-xl filter transition-transform duration-300 hover:scale-105"
              src="@/assets/images/logo.png"
              :alt="appName"
            />
            <span class="ml-2 text-sm font-bold text-gray-900">{{ appName }}</span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:ml-6 lg:flex lg:space-x-8">
            <router-link
              v-for="item in enabledNavigation"
              :key="item.name"
              :to="item.path"
              :class="[
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                route.path === item.path
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <!-- Mobile menu button -->
          <div class="lg:hidden">
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                v-if="showMobileMenu"
                class="block h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <svg
                v-else
                class="block h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <!-- User menu -->
          <div class="relative ml-3">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span v-if="user" class="text-gray-700 font-medium">{{
                user.examinationNumber || user.name
              }}</span>
              <svg
                class="ml-1 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="lg:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in enabledNavigation"
            :key="item.name"
            :to="item.path!"
            @click="showMobileMenu = false"
            :class="[
              'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
              route.path === item.path
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div v-if="user" class="flex items-center px-4">
            <div class="ml-0">
              <div class="text-base font-medium text-gray-800">
                {{ user.examinationNumber || user.name }}
              </div>
              <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
