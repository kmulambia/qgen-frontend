<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="isLoadingAudits" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-400">Loading security data...</span>
    </div>

    <!-- Security Overview -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Last Login Card -->
      <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Last Login</p>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ lastLoginDate }}</p>
          </div>
        </div>
        <p class="text-xs text-blue-600/70 dark:text-blue-400/70">IP: {{ lastLoginIp }}</p>
      </div>

      <!-- Password Changed Card -->
      <div class="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-5 border border-purple-200 dark:border-purple-800/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">Password Updated</p>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ lastPasswordResetDate }}</p>
          </div>
        </div>
        <p class="text-xs text-purple-600/70 dark:text-purple-400/70">{{ passwordResetDaysAgo }}</p>
      </div>

      <!-- Security Score Card -->
      <div class="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800/50">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Security Score</p>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ securityScore }}/100</p>
          </div>
        </div>
        <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70">{{ securityScoreLabel }}</p>
      </div>
    </div>

    <!-- Account Status Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Account Access Control</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage user account activation status</p>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1 space-y-4">
            <div class="flex items-start gap-4">
              <div :class="[
                'w-14 h-14 rounded-xl flex items-center justify-center ring-4',
                user.status === 'active'
                  ? 'bg-gradient-to-br from-green-400 to-green-600 ring-green-100 dark:ring-green-900/30'
                  : 'bg-gradient-to-br from-red-400 to-red-600 ring-red-100 dark:ring-red-900/30'
              ]">
                <svg v-if="user.status === 'active'" class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <svg v-else class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="mb-2">
                  <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                    Account {{ user.status === 'active' ? 'Active' : 'Inactive' }}
                  </h4>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {{ user.status === 'active'
                    ? 'This user account is currently active and has full access to the system. The user can log in and perform all authorized actions.'
                    : 'This user account is currently deactivated and cannot access the system. The user will be unable to log in until the account is reactivated.'
                  }}
                </p>
                <div class="flex gap-3">
                  <button
                    v-if="user.status === 'active'"
                    @click="handleStatusToggle('inactive')"
                    :disabled="!canManage"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                      canManage
                        ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Deactivate Account
                  </button>
                  <button
                    v-else
                    @click="handleStatusToggle('active')"
                    :disabled="!canManage"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                      canManage
                        ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Activate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Management Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Password Management</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Update or reset user authentication credentials</p>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center ring-4 ring-blue-100 dark:ring-blue-900/30">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Manage the user's password by directly changing it or sending a password reset link to their registered email address.
              </p>
            </div>
            <button
              @click="emit('change-password')"
              :disabled="!canManage"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                canManage
                  ? 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { IUser, IUserSecuritySummary } from '@/interfaces'
import moment from 'moment'

const props = defineProps({
  user: {
    type: Object as PropType<IUser>,
    required: true
  },
  securitySummary: {
    type: Object as PropType<IUserSecuritySummary | null>,
    default: null
  },
  canManage: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  'status-change': [status: string]
  'change-password': []
}>()

// Computed properties
const isLoadingAudits = computed(() => !props.securitySummary)

const lastLoginDate = computed(() => {
  return props.securitySummary?.last_login?.created_at
    ? formatDateTime(props.securitySummary.last_login.created_at)
    : 'Never'
})

const lastLoginIp = computed(() => {
  return props.securitySummary?.last_login?.entity_metadata?.ip_address || 'N/A'
})

const lastPasswordResetDate = computed(() => {
  return props.securitySummary?.last_password_reset?.created_at
    ? formatDate(props.securitySummary.last_password_reset.created_at)
    : 'Never'
})

const passwordResetDaysAgo = computed(() => {
  if (!props.securitySummary?.last_password_reset?.created_at) return 'N/A'
  const days = moment().diff(moment(props.securitySummary.last_password_reset.created_at), 'days')
  return `${days} days ago`
})

const securityScore = computed(() => {
  let score = 50 // Base score

  // Add points for recent login
  if (props.securitySummary?.last_login?.created_at) {
    const daysSinceLogin = moment().diff(moment(props.securitySummary.last_login.created_at), 'days')
    if (daysSinceLogin < 7) score += 20
    else if (daysSinceLogin < 30) score += 10
  }

  // Add points for recent password change
  if (props.securitySummary?.last_password_reset?.created_at) {
    const daysSinceReset = moment().diff(moment(props.securitySummary.last_password_reset.created_at), 'days')
    if (daysSinceReset < 90) score += 20
    else if (daysSinceReset < 180) score += 10
  }

  // Add points for active status
  if (props.user.status === 'active') score += 10

  // Deduct points for failed login attempts
  const failedCount = props.securitySummary?.failed_login_count || 0
  if (failedCount > 5) score -= 20
  else if (failedCount > 2) score -= 10

  return Math.min(Math.max(score, 0), 100) // Cap between 0 and 100
})

const securityScoreLabel = computed(() => {
  if (securityScore.value >= 80) return 'Excellent'
  if (securityScore.value >= 60) return 'Good'
  if (securityScore.value >= 40) return 'Moderate'
  return 'Needs Attention'
})

// Handle status toggle
const handleStatusToggle = (newStatus: string) => {
  if (!props.canManage) return

  // Emit the status-change event with the new status
  emit('status-change', newStatus)
}

// Format helpers
const formatDate = (date: string) => {
  return moment(date).format('MMM DD, YYYY')
}

const formatDateTime = (date: string) => {
  return moment(date).format('MMM DD, YYYY HH:mm')
}
</script>
