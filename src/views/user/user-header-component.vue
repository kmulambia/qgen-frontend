<template>
  <div>
    <!-- User Header Card -->
    <div class="theme-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div class="p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div class="flex items-start gap-5 flex-1">
            <!-- User Avatar -->
            <div class="relative">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-primary-100 dark:ring-primary-900/30">
                {{ userInitials }}
              </div>
              <div :class="[
                'absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800',
                user?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              ]"></div>
            </div>

            <!-- User Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight capitalize">
                  {{ user?.first_name }} {{ user?.last_name }}
                </h1>
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset',
                  user?.status === 'active'
                    ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-400/30'
                    : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-400/30'
                ]">
                  <span :class="[
                    'w-1.5 h-1.5 rounded-full mr-1.5',
                    user?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  ]"></span>
                  {{ user?.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-sm">
                  <EnvelopeIcon class="w-4 h-4 text-gray-400" />
                  <span class="font-medium">{{ user?.email }}</span>
                </p>
                <div class="flex items-center gap-4 text-sm">
                  <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <IdentificationIcon class="w-4 h-4 text-gray-400" />
                    <span class="font-mono text-xs">{{ user?.id }}</span>
                  </span>
                  <span class="text-gray-300 dark:text-gray-700">•</span>
                  <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <CalendarIcon class="w-4 h-4 text-gray-400" />
                    Joined {{ formatDate(user?.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex gap-2 self-start">
            <button
              v-if="canEdit"
              @click="handleEditUser"
              class="theme-btn theme-btn-secondary px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-all hover:scale-105"
            >
              <PencilIcon class="w-4 h-4" />
              Edit User
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { IUser } from '@/interfaces'
import {
  EnvelopeIcon,
  IdentificationIcon,
  CalendarIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'
import moment from 'moment'

// Props
const props = defineProps({
  user: {
    type: Object as PropType<IUser | null>,
    required: true,
    default: null
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})


// Emits
const emit = defineEmits<{
  edit: [user: IUser]
}>()

// Computed
const userInitials = computed(() => {
  if (!props.user) return '??'
  const firstInitial = props.user.first_name?.[0] || '?'
  const lastInitial = props.user.last_name?.[0] || '?'
  return `${firstInitial}${lastInitial}`.toUpperCase()
})

// Methods
const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A'
  return moment(date).format('MMM DD, YYYY')
}

const handleEditUser = () => {
  if (props.user) {
    emit('edit', props.user)
  }
}
</script>

<style scoped>

</style>
