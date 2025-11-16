<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import AdminNavbar from '@/components/layouts/admin/navbar-component.vue'
import AdminSidebar from '@/components/layouts/admin/sidebar-component.vue'
import AdminFooter from '@/components/layouts/admin/footer-component.vue'
import type { SessionStore } from '@/stores/session-store'

// Sidebar states: 'hidden', 'icon-only', 'full'
type SidebarState = 'hidden' | 'icon-only' | 'full'

const router = useRouter()

// Session store from provider - direct injection
const sessionStore = inject<SessionStore>('sessionStore')

if (!sessionStore) {
  throw new Error('Session store not provided. Make sure it is provided in main.ts')
}

const sidebarState = ref<SidebarState>('full')
const isMobile = ref(false)

let sessionCheckInterval: number | null = null

const toggleSidebar = () => {
  if (isMobile.value) {
    // On mobile: toggle between hidden and full
    sidebarState.value = sidebarState.value === 'hidden' ? 'full' : 'hidden'
  } else {
    // On desktop: cycle through hidden -> icon-only -> full
    switch (sidebarState.value) {
      case 'hidden':
        sidebarState.value = 'icon-only'
        break
      case 'icon-only':
        sidebarState.value = 'full'
        break
      case 'full':
        sidebarState.value = 'hidden'
        break
    }
  }
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    sidebarState.value = 'hidden'
  } else {
    if (sidebarState.value === 'hidden') {
      sidebarState.value = 'full'
    }
  }
}

// Function to check session validity
const checkSession = () => {
  if (!sessionStore.validateSession()) {
    console.log('Session expired or invalid, redirecting to login')
    sessionStore.logout()
    router.push('/auth/login')
  }
}

// Function to handle logout
const handleLogout = () => {
  sessionStore.logout()
  router.push('/auth/login')
}

// Set up periodic session checking when component mounts
onMounted(() => {
  // Initial session check
  checkSession()

  // Set up interval to check session every 30 seconds
  sessionCheckInterval = setInterval(checkSession, 30000) as unknown as number

  // Set up screen size checking
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

// Clean up interval when component unmounts
onUnmounted(() => {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval)
  }
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Admin Navbar -->
    <admin-navbar
      @toggle-sidebar="toggleSidebar"
      :sidebar-state="sidebarState"
      @logout="handleLogout"
    />

    <div class="flex overflow-hidden pt-16">
      <!-- Admin Sidebar -->
      <admin-sidebar
        :state="sidebarState"
        @close="sidebarState = 'hidden'"
        @toggle="toggleSidebar"
      />

      <!-- Main Content -->
      <div
        id="main-content"
        :class="[
          'relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300',
          {
            'lg:ml-64': sidebarState === 'full' && !isMobile,
            'lg:ml-16': sidebarState === 'icon-only' && !isMobile,
            'ml-0': sidebarState === 'hidden' || isMobile
          }
        ]"
      >
        <main class="flex-1">
          <router-view />
        </main>

        <!-- Admin Footer -->
        <admin-footer />
      </div>
    </div>
  </div>
</template>
