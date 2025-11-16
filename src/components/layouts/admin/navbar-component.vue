<script setup lang="ts">
import { computed, inject } from 'vue'
import { useToast } from 'vue-toastification'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import configuration from '@/utils/configuration'
import type { SessionStore } from '@/stores/session-store'
import AdminThemeComponent from '@/components/layouts/admin/admin-theme-component.vue'

const { name: appName ,version } = configuration

// Props for sidebar control
const props = defineProps<{
  sidebarState: 'hidden' | 'icon-only' | 'full'
}>()

const emit = defineEmits<{
  toggleSidebar: []
  logout: []
}>()

const toast = useToast()

// Session store from provider
const sessionStore = inject<SessionStore>('sessionStore')

// Get user data from session store
const user = computed(() => {
  const currentUser = sessionStore?.currentUser
  return {
    name: currentUser?.first_name && currentUser?.last_name
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : currentUser?.email || 'Admin User',
    email: currentUser?.email || 'admin@email.com',
    avatar: null,
    initials: currentUser?.first_name && currentUser?.last_name
      ? `${currentUser.first_name.charAt(0)}${currentUser.last_name.charAt(0)}`.toUpperCase()
      : currentUser?.email?.charAt(0).toUpperCase() || 'A'
  }
})

const logout = () => {
  toast.success('Successfully logged out!')
  emit('logout')
}
</script>

<template>
  <nav class="fixed z-10 flex h-16 w-full items-center border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div class="flex w-full items-center justify-between">
      <div class="flex items-center justify-start">
        <!-- Sidebar Toggle Button -->
        <button
          @click="emit('toggleSidebar')"
          class="me-3 cursor-pointer rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200"
          :title="`${props.sidebarState === 'hidden' ? 'Show sidebar' : props.sidebarState === 'icon-only' ? 'Expand sidebar' : 'Hide sidebar'}`"
        >
          <!-- Hidden state - show hamburger -->
          <svg v-if="props.sidebarState === 'hidden'" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <!-- Icon-only state - show expand icon -->
          <svg v-else-if="props.sidebarState === 'icon-only'" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
          </svg>
          <!-- Full state - show collapse icon -->
          <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M19 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Logo -->
        <div class="flex items-center">
          <img
            class="h-10 w-10 drop-shadow-xl filter transition-transform duration-300 hover:scale-105"
            src="@/assets/images/logo.png"
            :alt="appName"
          />
          <span class="ml-2 text-lg font-bold text-gray-900 dark:text-white">{{ appName }}</span>
          <span class="ml-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full">v{{ version }}</span>
        </div>


      </div>

      <div class="flex items-center space-x-3">
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
        <admin-theme-component size="lg" />

        <!-- User Menu -->
        <Menu as="div" class="relative">
          <MenuButton class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <span class="sr-only">Open user menu</span>
            <div class="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span class="text-primary-600 dark:text-primary-300 font-medium text-xs">
                {{ user.initials }}
              </span>
            </div>
            <span class="ml-2 text-gray-700 dark:text-gray-300 hidden sm:block capitalize truncate max-w-32">{{ user.name }}</span>
            <ChevronDownIcon class="ml-1 h-4 w-4 text-gray-400" aria-hidden="true" />
          </MenuButton>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems class="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-200 dark:divide-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
              <!-- User Info Header -->
              <div class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                <div class="font-medium capitalize truncate">{{ user.name }}</div>
                <div class="text-gray-500 dark:text-gray-400 lowercase truncate">{{ user.email }}</div>
              </div>

              <!-- Settings -->
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <router-link
                    to="/admin/settings"
                    :class="[
                      active
                        ? 'bg-gray-100 text-gray-900 dark:bg-primary-700 dark:text-white'
                        : 'text-gray-700 dark:text-gray-400',
                      'group flex items-center gap-x-3 px-4 py-2 text-sm transition-colors duration-200'
                    ]"
                  >
                    <Cog6ToothIcon
                      :class="[
                        active
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-500',
                        'h-5 w-5'
                      ]"
                      aria-hidden="true"
                    />
                    Settings
                  </router-link>
                </MenuItem>
              </div>

              <!-- Logout -->
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    @click.prevent="logout"
                    :class="[
                      active
                        ? 'bg-gray-100 text-gray-900 dark:bg-primary-700 dark:text-white'
                        : 'text-gray-700 dark:text-gray-400',
                      'group flex items-center gap-x-3 px-4 py-2 text-sm transition-colors duration-200'
                    ]"
                  >
                    <ArrowRightOnRectangleIcon
                      :class="[
                        active
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-500',
                        'h-5 w-5'
                      ]"
                      aria-hidden="true"
                    />
                    Logout
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </nav>
</template>
