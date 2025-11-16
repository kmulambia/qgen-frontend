<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</label>
          <p class="text-base text-gray-900 dark:text-white">{{ user.first_name }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</label>
          <p class="text-base text-gray-900 dark:text-white">{{ user.last_name }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
          <p class="text-base text-gray-900 dark:text-white">{{ user.email }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
          <p class="text-base text-gray-900 dark:text-white">{{ user.phone || 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Sex</label>
          <p class="text-base text-gray-900 dark:text-white capitalize">{{ user.sex || 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">ID Type</label>
          <p class="text-base text-gray-900 dark:text-white">{{ user.id_type || 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">ID Number</label>
          <p class="text-base text-gray-900 dark:text-white">{{ user.id_number || 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
          <p class="text-base text-gray-900 dark:text-white capitalize">{{ user.status }}</p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</label>
          <p class="text-base text-gray-900 dark:text-white">{{ user.created_at ? formatDate(user.created_at) : 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
          <p class="text-base text-gray-900 dark:text-white">{{ user.updated_at ? formatDate(user.updated_at) : 'N/A' }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
          <p class="text-base text-gray-900 dark:text-white font-mono text-sm">{{ user.id }}</p>
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Version</label>
          <p class="text-base text-gray-900 dark:text-white">{{ user.version }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import type { IUser } from '@/interfaces'
import moment from 'moment'

defineProps({
  user: {
    type: Object as PropType<IUser>,
    required: true
  }
})

const formatDate = (date: string) => {
  return moment(date).format('MMM DD, YYYY')
}
</script>
