<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else-if="sessionStore.isLoggedIn && currentUser" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
      <BreadcrumbComponents :items="breadcrumb_items" />

      <!-- Settings Header Component -->
      <SettingsHeaderComponent
        :user="currentUser"
        @edit="handleEditProfile"
      />

      <!-- Tab Navigation -->
      <div class="theme-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Profile Tab -->
          <UserProfileComponent v-if="activeTab === 'profile'" :user="currentUser" />

          <!-- Security Tab -->
          <SettingsSecurityComponent
            v-if="activeTab === 'security'"
            :user="currentUser"
            :security-summary="securitySummary"
            @deactivate="handleDeactivateAccount"
            @change-password="showChangePasswordModal = true"
          />

          <!-- Activity Log Tab -->
          <UserAuditComponent v-if="activeTab === 'activity' && currentUser.id" :user-id="currentUser.id" />
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <UserForm
      :open="showModal"
      :key="'user-form-'+showModal+modalMode+currentUser?.id+Date.now()"
      :loading="isSubmitting"
      :user="currentUser"
      :title="modalTitle"
      :mode="modalMode"
      :fields="[
        { name: 'email', readonly: true },
        { name: 'first_name' },
        { name: 'last_name' },
        { name: 'phone' },
        { name: 'sex' },
        { name: 'id_type' },
        { name: 'id_number' }
      ]"
      @onClose="closeModal"
      @onSubmit="handleProfileSubmit"
    />

    <!-- Change Password Modal -->
    <ChangePasswordComponent
      :open="showChangePasswordModal"
      :loading="isSubmitting"
      @onClose="showChangePasswordModal = false"
      @onSubmit="handleChangePassword"
    />

    <!-- Deactivation Confirmation Modal -->
    <ConfirmationComponent
      :open="showDeactivationModal"
      title="Deactivate Account"
      description="Are you sure you want to deactivate your account? You will be immediately logged out and will need to contact an administrator to reactivate your account."
      confirmButtonText="Yes, Deactivate"
      cancelButtonText="Cancel"
      variant="error"
      @confirm="confirmDeactivation"
      @cancel="showDeactivationModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useSessionStore } from '@/stores/session-store'
import type { UserStore } from '@/stores/user-store'
import type { AuditStore } from '@/stores/audit-store'
import type { IUser, IUserSecuritySummary } from '@/interfaces'
import { formatErrorMessage } from '@/utils/errors'
import { useTranslation } from 'i18next-vue'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import LoadingComponent from '@/components/loading-component.vue'
import ChangePasswordComponent from '@/views/user/change-password-component.vue'
import UserProfileComponent from '@/views/user/user-profile-component.vue'
import UserAuditComponent from '@/views/user/user-audit-component.vue'
import UserForm from '@/views/user/user-form.vue'
import SettingsHeaderComponent from './settings-header-component.vue'
import SettingsSecurityComponent from './settings-security-component.vue'
import ConfirmationComponent from '@/components/confirmation-component.vue'

const router = useRouter()
const toast = useToast()
const { t } = useTranslation()

// Store Setup
const sessionStore = useSessionStore()
const userStore = inject<UserStore>('userStore')!
const auditStore = inject<AuditStore>('auditStore')!

// Reactive State
const isLoadingData = ref(false)
const currentUser = ref<IUser | null>(null)
const securitySummary = ref<IUserSecuritySummary | null>(null)

// Active tab state
const activeTab = ref('profile')

// Modal states
const showChangePasswordModal = ref(false)
const showDeactivationModal = ref(false)
const showModal = ref(false)
const isSubmitting = ref(false)
const modalMode = ref<'create' | 'edit' | 'view'>('edit')
const modalTitle = ref('Edit Profile')

// Tab configuration
const tabs = [
  { id: 'profile', label: 'Profile', icon: 'UserIcon' },
  { id: 'security', label: 'Security', icon: 'ShieldIcon' },
  { id: 'activity', label: 'Activity Log', icon: 'DocumentIcon' },
]

// Breadcrumbs
const breadcrumb_items = computed(() => [
  { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
  { name: 'Settings', path: '/admin/settings', is_current: true }
])

// Load current user details
const loadCurrentUser = async () => {
  const userId = sessionStore.currentUser?.id
  if (!userId) {
    toast.error('User session not found')
    router.push('/auth/login')
    return
  }

  try {
    isLoadingData.value = true
    currentUser.value = await userStore.getOne(userId)
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    router.push('/admin/dashboard')
  } finally {
    isLoadingData.value = false
  }
}

// Load user security summary
const loadSecuritySummary = async () => {
  const userId = sessionStore.currentUser?.id
  if (!userId) {
    securitySummary.value = null
    return
  }

  try {
    securitySummary.value = await auditStore.getUserSecuritySummary(userId)
  } catch (error) {
    console.error('Failed to fetch security summary:', error)
    // Don't show error toast as this is not critical
  }
}

// Action Handlers
const handleChangePassword = async (passwordData: { password: string; confirm_password: string }) => {
  if (!currentUser.value || !currentUser.value.id) return

  isSubmitting.value = true
  try {
    // Use session store's changePassword method with user_id
    await sessionStore.changePassword({
      user_id: currentUser.value.id,
      password: passwordData.password,
    })
    toast.success('Password changed successfully')
    showChangePasswordModal.value = false
    // Reload security summary to show updated password change stats
    await loadSecuritySummary()
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isSubmitting.value = false
  }
}

const handleEditProfile = () => {
  modalMode.value = 'edit'
  modalTitle.value = 'Edit Profile'
  showModal.value = true
}

const handleDeactivateAccount = () => {
  showDeactivationModal.value = true
}

const confirmDeactivation = async () => {
  if (!currentUser.value || !currentUser.value.id) return

  isSubmitting.value = true
  try {
    // Only send the status field to update
    const updateData: Partial<IUser> = {
      status: 'inactive'
    }

    await userStore.update(currentUser.value.id, updateData)
    showDeactivationModal.value = false
    toast.success('Account deactivated successfully. You will now be logged out.')

    // Log the user out after a brief delay
    setTimeout(async () => {
      await sessionStore.logout()
      router.push('/auth/login')
    }, 2000)
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  modalMode.value = 'edit'
  modalTitle.value = 'Edit Profile'
}

const handleProfileSubmit = async (userData: IUser) => {
  if (!currentUser.value || !currentUser.value.id) return

  isSubmitting.value = true
  try {
    await userStore.update(currentUser.value.id, userData)
    toast.success('Profile updated successfully')
    closeModal()
    // Reload user details
    await loadCurrentUser()
    // Update session store with new user data (minimal ISessionUser subset)
    if (currentUser.value && currentUser.value.id) {
      sessionStore.setUserDetails({
        id: currentUser.value.id,
        first_name: currentUser.value.first_name,
        last_name: currentUser.value.last_name,
        email: currentUser.value.email
      })
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isSubmitting.value = false
  }
}

// Load data on mount
onMounted(async () => {
  await Promise.all([loadCurrentUser(), loadSecuritySummary()])
})

// --- AUTH GUARD ---
watch(
  () => sessionStore.isLoggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) router.push('/auth/login')
  },
  { immediate: true },
)
</script>

<style scoped>
/* Icon component stubs for template usage */
.UserIcon,
.ShieldIcon,
.DocumentIcon {
  display: inline-block;
}
</style>
