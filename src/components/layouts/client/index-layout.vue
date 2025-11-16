<script setup lang="ts">
import NavbarComponent from '@/components/layouts/client/navbar-component.vue'
import FooterComponent from '@/components/layouts/client/footer-component.vue'
</script>
<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <navbar-component />
    <main class="flex-1 transition-all duration-75 bg-gray-50 dark:bg-gray-900" id="main-content">
      <router-view />
    </main>
    <footer-component class="transition-all duration-75" />
  </div>
</template>
