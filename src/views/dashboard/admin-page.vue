<template>
  <!-- Show loading indicator while checking auth status -->
  <LoadingComponent v-if="isLoading" />

  <!-- Main content, shown only when loading is complete and user is authenticated -->
  <div v-else-if="user" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Breadcrumb Navigation -->
      <BreadcrumbComponents :items="breadcrumb_items" />

      <!-- Permission Error Alert -->
      <div v-if="permissionError" class="mb-6">
        <div class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                Access Denied
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ permissionError.message }}</p>
                <p v-if="permissionError.attemptedRoute" class="mt-1">
                  <strong>Attempted Route:</strong> {{ permissionError.attemptedRoute }}
                </p>
                <p v-if="permissionError.requiredPermissions" class="mt-1">
                  <strong>Required Permissions:</strong> {{ permissionError.requiredPermissions.join(', ') }}
                </p>
              </div>
              <div class="mt-4">
                <button
                  @click="clearPermissionError"
                  type="button"
                  class="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md p-1.5 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  <span class="sr-only">Dismiss</span>
                  <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Information Header -->
      <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold text-lg">
                    {{ user?.first_name?.charAt(0)?.toUpperCase() }}{{ user?.last_name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
              </div>
              <div class="ml-4">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white capitalize">Welcome, {{ user?.first_name }} {{ user?.last_name }}</h1>
                <p v-if="user?.email" class="text-sm text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
                <p v-if="currentWorkspace?.name" class="text-sm text-gray-500 dark:text-gray-400">Workspace: {{ currentWorkspace.name }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 mb-1">
                {{ userRole }}
              </span>
              <p v-if="sessionStore?.loginTimestamp" class="text-xs text-gray-400 dark:text-gray-500">Last login: {{ moment(new Date(sessionStore.loginTimestamp)).format('LLL') }}</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
import LoadingComponent from '@/components/loading-component.vue'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import { useBreadcrumbs } from '@/composables/use-breadcrumbs'
import type { SessionStore } from '@/stores/session-store'

// --- VUE 3 COMPOSITION API SCRIPT ---

const router = useRouter()
const route = useRoute()
const sessionStore = inject<SessionStore>('sessionStore')

// Computed properties for user data from session store
const user = computed(() => sessionStore?.currentUser || null)
const isLoading = computed(() => sessionStore?.isLoading || false)
const userRole = computed(() => sessionStore?.session?.role?.name || 'User')
const currentWorkspace = computed(() => sessionStore?.session?.current_workspace?.workspace || null)

// Permission error handling
const permissionError = ref<{
  message: string
  attemptedRoute?: string
  requiredPermissions?: string[]
} | null>(null)

// Check for permission error in route query
const checkPermissionError = () => {
  const { error, attempted_route, required_permissions } = route.query

  if (error === 'insufficient_permissions') {
    permissionError.value = {
      message: 'You do not have the required permissions to access the requested page.',
      attemptedRoute: attempted_route as string,
      requiredPermissions: required_permissions ? (required_permissions as string).split(',') : undefined
    }

    // Clear the error query parameters from the URL
    router.replace({
      path: route.path,
      query: {}
    })
  }
}

// Clear permission error
const clearPermissionError = () => {
  permissionError.value = null
}


// Breadcrumbs from route metadata
const { breadcrumbs: breadcrumb_items } = useBreadcrumbs()

// Load dashboard data on component mount
onMounted(() => {
  // Check for permission errors from route query
  checkPermissionError()

  // In a real application, this would fetch actual dashboard data from an API
  console.log('Loading dashboard data...')
})
</script>
