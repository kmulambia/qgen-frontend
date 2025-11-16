<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else-if="sessionStore.isLoggedIn && selectedUser" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
      <BreadcrumbComponents :items="breadcrumb_items" />

      <!-- User Header Component -->
      <UserHeaderComponent
        :user="selectedUser"
        :can-edit="canManageUsers"
        @edit="handleEditUser"
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
          <!-- User Details Tab -->
          <UserProfileComponent v-if="activeTab === 'details'" :user="selectedUser" />

          <!-- Security Tab -->
          <UserSecurityComponent
            v-if="activeTab === 'security'"
            :user="selectedUser"
            :security-summary="securitySummary"
            :can-manage="canManageUsers"
            @status-change="handleStatusChange"
            @change-password="showChangePasswordModal = true"
          />

          <!-- Workspaces Tab -->
          <UserWorkspacesComponent v-if="activeTab === 'workspaces' && userId" :user-id="userId" />

          <!-- Audit Log Tab -->
          <UserAuditComponent v-if="activeTab === 'audit' && userId" :user-id="userId"/>

        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <UserForm
      :open="showModal"
      :key="'user-form-'+showModal+modalMode+selectedUser?.id+Date.now()"
      :loading="isSubmitting"
      :user="selectedUser"
      :title="modalTitle"
      :mode="modalMode"
      :fields="[
        { name: 'email' },
        { name: 'first_name' },
        { name: 'last_name' },
        { name: 'phone' },
        { name: 'sex' },
        { name: 'id_type' },
        { name: 'id_number' }
      ]"
      @onClose="closeModal"
      @onSubmit="handleUserSubmit"
    />


    <!-- Change Password Modal -->
    <ChangePasswordComponent
      :open="showChangePasswordModal"
      :loading="isSubmitting"
      @onClose="showChangePasswordModal = false"
      @onSubmit="handleChangePassword"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useSessionStore } from '@/stores/session-store'
import type { UserStore } from '@/stores/user-store'
import type { AuditStore } from '@/stores/audit-store'
import type { IUser, IUserSecuritySummary } from '@/interfaces'
import { useBreadcrumbs } from '@/composables/use-breadcrumbs'
import { formatErrorMessage } from '@/utils/errors'
import { useTranslation } from 'i18next-vue'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import LoadingComponent from '@/components/loading-component.vue'
import ChangePasswordComponent from '@/views/user/change-password-component.vue'
import UserHeaderComponent from './user-header-component.vue'
import UserProfileComponent from './user-profile-component.vue'
import UserSecurityComponent from './user-security-component.vue'
import UserAuditComponent from './user-audit-component.vue'
import UserWorkspacesComponent from './user-workspaces-component.vue'
import UserForm from './user-form.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useTranslation()

// Store Setup
const sessionStore = useSessionStore()
const userStore = inject<UserStore>('userStore')!
const auditStore = inject<AuditStore>('auditStore')!

// Get user ID from route params
const userId = ref(route.params.userId as string)

// Reactive State
const isLoadingData = ref(false)
const selectedUser = ref<IUser | null>(null)
const securitySummary = ref<IUserSecuritySummary | null>(null)

// Active tab state
const activeTab = ref('details')

// Modal states
const showChangePasswordModal = ref(false)
const showModal = ref(false)
const isSubmitting = ref(false)
const modalMode = ref<'create' | 'edit' | 'view'>('edit')
const modalTitle = ref('Edit User')

// Permission checks
const canManageUsers = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('user.*') ||
  sessionStore.hasPermission('user.manage')
)

// Tab configuration
const tabs = [
  { id: 'details', label: 'User Details', icon: 'UserIcon' },
  { id: 'security', label: 'Security', icon: 'ShieldIcon' },
  { id: 'workspaces', label: 'Workspaces', icon: 'BriefcaseIcon' },
  { id: 'audit', label: 'Audit Log', icon: 'DocumentIcon' },
]

// Load user details
const loadUser = async () => {
  if (!userId.value) return

  try {
    isLoadingData.value = true
    selectedUser.value = await userStore.getOne(userId.value)
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    router.push('/admin/user-management/users')
  } finally {
    isLoadingData.value = false
  }
}

// Load user security summary
const loadSecuritySummary = async () => {
  if (!userId.value) {
    securitySummary.value = null
    return
  }

  try {
    securitySummary.value = await auditStore.getUserSecuritySummary(userId.value)
  } catch (error) {
    console.error('Failed to fetch security summary:', error)
    // Don't show error toast as this is not critical
  }
}

// Breadcrumbs from route metadata
const { breadcrumbs: breadcrumb_items } = useBreadcrumbs()


// Action Handlers
const handleChangePassword = async (passwordData: { password: string; confirm_password: string }) => {
  if (!selectedUser.value || !selectedUser.value.id) return

  if (!canManageUsers.value) {
    toast.error('You do not have permission to manage users')
    return
  }

  isSubmitting.value = true
  try {
    // Use session store's changePassword method with user_id
    await sessionStore.changePassword({
      user_id: selectedUser.value.id,
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

const handleEditUser = () => {
  modalMode.value = 'edit'
  modalTitle.value = 'Edit User'
  showModal.value = true
}

const handleStatusChange = async (newStatus: string) => {
  if (!selectedUser.value || !selectedUser.value.id) return

  if (!canManageUsers.value) {
    toast.error('You do not have permission to manage users')
    return
  }

  try {
    // Only send the status field to update
    const updateData: Partial<IUser> = {
      status: newStatus
    }

    await userStore.update(selectedUser.value.id, updateData)
    selectedUser.value.status = newStatus

    if (newStatus === 'active') {
      toast.success('Account activated successfully')
    } else {
      toast.warning('Account deactivated successfully')
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  }
}

const closeModal = () => {
  showModal.value = false
  modalMode.value = 'edit'
  modalTitle.value = 'Edit User'
}

const handleUserSubmit = async (userData: IUser) => {
  if (!selectedUser.value || !selectedUser.value.id) return

  if (!canManageUsers.value) {
    toast.error('You do not have permission to edit users')
    return
  }

  isSubmitting.value = true
  try {
    await userStore.update(selectedUser.value.id, userData)
    toast.success('User profile updated successfully')
    closeModal()
    // Reload user details
    await loadUser()
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isSubmitting.value = false
  }
}

// Load data on mount
onMounted(async () => {
  if (userId.value) {
    await Promise.all([loadUser(), loadSecuritySummary()])
  } else {
    toast.error('No user ID provided')
    router.push('/admin/user-management/users')
  }
})

// --- AUTH GUARD ---
watch(
  () => sessionStore.isLoggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) router.push('/login')
  },
  { immediate: true },
)
</script>

<style scoped>
/* Icon component stubs for template usage */
.UserIcon,
.ShieldIcon,
.BriefcaseIcon,
.DocumentIcon {
  display: inline-block;
}
</style>

