<script setup lang="ts">
import ThemeComponent from '@/components/layouts/authentication/auth-theme-component.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
    <!-- Floating Dark Mode Toggle - Top Right -->
    <div class="fixed top-4 right-4 z-50">
      <ThemeComponent />
    </div>

    <!-- Main Content -->
    <div class="h-full">
      <router-view />
    </div>
  </div>
</template>
