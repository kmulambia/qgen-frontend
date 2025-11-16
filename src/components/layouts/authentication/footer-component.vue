<script setup lang="ts">
import { useTranslation } from 'i18next-vue'
import configuration from '@/utils/configuration'
const { t } = useTranslation()
const { developer ,privacy_policy , terms_of_service , support_email } = configuration
</script>
<template>
  <footer class="mt-8">
    <div class="flex flex-col items-center justify-center space-y-4 text-white/80">
      <!-- Links -->
      <div class="flex items-center space-x-6 text-sm">
        <a
          :href="privacy_policy"
          target="_blank"
          class="text-white/70 hover:text-white transition-colors duration-200 hover:underline capitalize"
        >
          {{ t('system.pages.privacyPolicy') }}
        </a>
        <span class="text-white/40">•</span>
        <a
          :href="terms_of_service"
          target="_blank"
          class="text-white/70 hover:text-white transition-colors duration-200 hover:underline capitalize"
        >
          {{ t('system.pages.termsOfService') }}
        </a>
        <span class="text-white/40">•</span>
        <a
          :href="`mailto:${support_email}`"
          target="_blank"
          class="text-white/70 hover:text-white transition-colors duration-200 hover:underline capitalize"
        >
          {{ t('system.pages.contact') }}
        </a>
      </div>
      <!-- Copyright -->
      <div class="text-xs text-white/60 text-center">
        <p>&copy; {{ new Date().getFullYear() }} {{ developer.name }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
