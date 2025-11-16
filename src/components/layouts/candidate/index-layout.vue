<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarComponent from '@/components/layouts/candidate/navbar-component.vue'
import FooterComponent from '@/components/layouts/candidate/footer-component.vue'
import type { CandidateAuthStore } from '@/stores/candidate-auth-store'

const router = useRouter()

// Auth store from provider - direct injection
const authStore = inject<CandidateAuthStore>('authStore')

if (!authStore) {
  throw new Error('Auth store not provided. Make sure it is provided in main.ts')
}

let sessionCheckInterval: number | null = null

// Function to check session validity
const checkSession = () => {
  if (!authStore.validateSession()) {
    console.log('Session expired or invalid, redirecting to login')
    router.push('/auth/candidate-login')
  }
}

// Set up periodic session checking when component mounts
onMounted(() => {
  // Initial session check
  checkSession()
  
  // Set up interval to check session every 30 seconds
  sessionCheckInterval = setInterval(checkSession, 30000) as unknown as number
})

// Clean up interval when component unmounts
onUnmounted(() => {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval)
  }
})
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <navbar-component />
    <main class="flex-1 transition-all duration-75" id="main-content">
      <router-view />
    </main>
    <footer-component class="transition-all duration-75" />
  </div>
</template>
