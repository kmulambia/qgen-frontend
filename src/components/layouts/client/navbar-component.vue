<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import configuration from '@/utils/configuration'
import type { INavigation } from '@/interfaces'
import ThemeComponent from '@/components/theme-component.vue'

const { name: appName } = configuration

// Mock client user - replace with actual auth
const user = ref({
  name: 'Client User',
  email: 'client@email.com',
  avatar: null
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const logout = () => {
  toast.success('Successfully logged out!')
  showUserMenu.value = false
  router.push('/auth/client-login')
}

const navigation: INavigation[] = [
  { name: 'Dashboard', path: '/client/dashboard', enabled: true },
  { name: 'Content', path: '/client/content', enabled: true },
  { name: 'Documents', path: '/client/documents', enabled: true },
  { name: 'Reports', path: '/client/reports', enabled: true },
  { name: 'Schedule', path: '/client/events', enabled: true },
]

// Computed property for filtered navigation items with guaranteed path
const enabledNavigation = computed(() =>
  navigation.filter((item): item is INavigation & { path: string } =>
    Boolean(item.path && item.enabled !== false)
  )
)
</script>
<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
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
            <span class="ml-2 text-sm font-bold text-gray-900 dark:text-white">{{ appName }}</span>
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
                  ? 'border-primary-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <!-- Notifications -->
          <button
            type="button"
            class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600"
          >
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.133 12.632v-1.8a5.407 5.407 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.933.933 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z"/>
            </svg>
          </button>

          <!-- Theme Toggle -->
          <div class="ml-1">
            <ThemeComponent size="lg" />
          </div>

          <!-- Mobile menu button -->
          <div class="lg:hidden ml-3">
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
              <div class="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 font-medium text-xs capitalize">
                  {{ user ? user.name.charAt(0).toUpperCase()  : 'S' }}
                </span>
              </div>
              <span v-if="user" class="ml-2 text-gray-700 dark:text-gray-300 hidden sm:block capitalize ">{{ user.name }}</span>
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

            <!-- User Dropdown -->
            <div
              v-if="showUserMenu"
              v-click-outside="() => showUserMenu = false"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
            >
              <div v-if="user" class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                <div class="font-medium capitalize">{{ user.name }}</div>
                <div class="text-gray-500 dark:text-gray-400">{{ user.email }}</div>
              </div>
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200',
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div v-if="user" class="flex items-center px-4">
            <div class="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-medium text-xs">
                {{ user.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800 dark:text-gray-200 capitalize">{{ user.name }}</div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ user.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
