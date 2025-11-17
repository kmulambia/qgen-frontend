<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else-if="selectedLayout" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
      <BreadcrumbComponents :items="breadcrumb_items" />

      <!-- Layout Header -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        <div class="p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div class="flex items-start gap-5 flex-1">
              <!-- Layout Logo/Icon Preview -->
              <div class="relative">
                <div v-if="selectedLayout?.logo_file" class="w-24 h-24 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 shadow-lg">
                  <img
                    :src="selectedLayout.logo_file.url"
                    :alt="selectedLayout.name"
                    class="w-full h-full object-contain p-2"
                  />
                </div>
                <div v-else class="w-24 h-24 rounded-lg bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-primary-100 dark:ring-primary-900/30">
                  {{ layoutInitials }}
                </div>
                <div v-if="selectedLayout?.is_default" class="absolute -top-2 -right-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 ring-2 ring-yellow-400 dark:ring-yellow-500">
                    <StarIcon class="w-3 h-3 mr-1" />
                    Default
                  </span>
                </div>
              </div>

              <!-- Layout Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {{ selectedLayout?.name }}
                  </h1>
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset',
                    selectedLayout?.status === 'active'
                      ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-400/30'
                      : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-400/30'
                  ]">
                    <span :class="[
                      'w-1.5 h-1.5 rounded-full mr-1.5',
                      selectedLayout?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    ]"></span>
                    {{ selectedLayout?.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </div>

                <div class="flex flex-col gap-2">
                  <p v-if="selectedLayout?.description" class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {{ selectedLayout.description }}
                  </p>
                  <div class="flex items-center gap-4 text-sm">
                    <span v-if="selectedLayout?.company_name" class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <BuildingOfficeIcon class="w-4 h-4 text-gray-400" />
                      {{ selectedLayout.company_name }}
                    </span>
                    <span v-if="selectedLayout?.email" class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <EnvelopeIcon class="w-4 h-4 text-gray-400" />
                      {{ selectedLayout.email }}
                    </span>
                    <span v-if="selectedLayout?.created_at" class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <CalendarIcon class="w-4 h-4 text-gray-400" />
                      Created {{ formatDate(selectedLayout.created_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 self-start">
              <button
                v-if="canEdit"
                @click="handleEditLayout"
                class="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
              >
                <PencilIcon class="w-4 h-4 mr-2" />
                Edit Layout
              </button>
              <button
                v-if="canEdit"
                @click="showLogoModal = true"
                class="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
              >
                <PhotoIcon class="w-4 h-4 mr-2" />
                {{ selectedLayout?.logo_file ? 'Change Logo' : 'Upload Logo' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quotation Preview -->
      <div class="">
        <LayoutPreviewComponent :layout="selectedLayout" />
      </div>
    </div>

    <!-- Edit Layout Modal -->
    <LayoutForm
      :open="showModal"
      :key="'layout-form-'+showModal+modalMode+selectedLayout?.id+Date.now()"
      :loading="isSubmitting"
      :layout="selectedLayout"
      :title="modalTitle"
      :mode="modalMode"
      :fields="[
        { name: 'name', required: true },
        { name: 'description' },
        { name: 'company_name' },
        { name: 'reference_number' },
        { name: 'email' },
        { name: 'phone' },
        { name: 'address' },
        { name: 'terms_conditions' },
        { name: 'notes' },
        { name: 'is_default' }
      ]"
      @onClose="closeModal"
      @onSubmit="handleLayoutSubmit"
    />

    <!-- Logo Upload Modal -->
    <FileForm
      v-if="showLogoModal"
      :open="showLogoModal"
      :loading="isUploadingLogo"
      :title="selectedLayout?.logo_file ? 'Change Logo' : 'Upload Logo'"
      :mode="'upload'"
      :max-files="1"
      :max-file-size-in-m-b="5"
      :allowed-extensions="['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']"
      @onClose="showLogoModal = false"
      @onSubmit="handleLogoUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useSessionStore } from '@/stores/session-store'
import type { useLayoutStore } from '@/stores/layout-store'
import type { ILayout } from '@/interfaces'
import type { FileApiService } from '@/service/api/file-api-service'
import { useTranslation } from 'i18next-vue'
import { formatErrorMessage } from '@/utils/errors'
import LoadingComponent from '@/components/loading-component.vue'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import LayoutPreviewComponent from './layout-preview-component.vue'
import FileForm from '@/views/file/file-form.vue'
import LayoutForm from './layout-form.vue'
import {
  PencilIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  CalendarIcon,
  StarIcon,
} from '@heroicons/vue/24/outline'
import moment from 'moment'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useTranslation()
const sessionStore = useSessionStore()

// Inject stores and services
const layoutStore = inject<ReturnType<typeof useLayoutStore>>('layoutStore')!
const fileApiService = inject<FileApiService>('fileApiService')!

// State
const layoutId = computed(() => route.params.id as string)
const selectedLayout = ref<ILayout | null>(null)
const isLoadingData = ref(true)
const showModal = ref(false)
const showLogoModal = ref(false)
const isSubmitting = ref(false)
const isUploadingLogo = ref(false)
const modalTitle = ref('Edit Layout')
const modalMode = ref<'edit'>('edit')

// Permissions
const canEdit = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('layout.*') ||
  sessionStore.hasPermission('layout.update')
)

// Layout initials for icon
const layoutInitials = computed(() => {
  if (!selectedLayout.value?.name) return 'L'
  const words = selectedLayout.value.name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return selectedLayout.value.name.substring(0, 2).toUpperCase()
})

// Format date helper
const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A'
  return moment(date).format('MMM DD, YYYY')
}

// Breadcrumbs
const breadcrumb_items = computed(() => [
  { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
  { name: 'Leads & Sale', path: '/admin/leads-sale', is_clickable: false },
  { name: 'Layouts', path: '/admin/leads-sale/layouts' },
  { name: selectedLayout.value?.name || 'Manage Layout', path: '', is_current: true }
])

// Load layout data
const loadLayout = async () => {
  try {
    isLoadingData.value = true
    const layout = await layoutStore.getOne(layoutId.value)
    if (layout) {
      selectedLayout.value = layout
      console.log('Loaded layout:', layout)
    } else {
      toast.error('Layout not found')
      router.push('/admin/leads-sale/layouts')
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    router.push('/admin/leads-sale/layouts')
  } finally {
    isLoadingData.value = false
  }
}

// Refresh layout data
const refreshLayout = async () => {
  try {
    const layout = await layoutStore.getOne(layoutId.value)
    if (layout) {
      selectedLayout.value = layout
    }
  } catch (error) {
    console.error('Failed to refresh layout:', error)
  }
}

// Handle edit layout
const handleEditLayout = () => {
  modalTitle.value = 'Edit Layout'
  modalMode.value = 'edit'
  showModal.value = true
}

// Handle layout submit
const handleLayoutSubmit = async (layoutData: ILayout) => {
  if (!canEdit.value) {
    toast.error('You do not have permission to update layouts')
    return
  }

  isSubmitting.value = true
  try {
    if (selectedLayout.value?.id) {
      await layoutStore.update(selectedLayout.value.id, layoutData)
      toast.success('Layout updated successfully')
      await refreshLayout()
      closeModal()
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isSubmitting.value = false
  }
}

// Close modal
const closeModal = () => {
  showModal.value = false
}

// Handle logo upload
const handleLogoUpload = async (files: File[]) => {
  if (!canEdit.value) {
    toast.error('You do not have permission to update layouts')
    return
  }

  if (!files || files.length === 0) {
    toast.error('Please select a file to upload')
    return
  }

  isUploadingLogo.value = true
  try {
    // Store old logo file ID before uploading new one
    const oldLogoFileId = selectedLayout.value?.logo_file?.id

    // Upload file to file API
    const uploadedFiles = await fileApiService.upload(files)

    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new Error('Failed to upload file')
    }

    const uploadedFile = uploadedFiles[0]

    // Update layout with the new logo file ID
    if (selectedLayout.value?.id) {
      const updatedLayout = await layoutStore.update(selectedLayout.value.id, {
        logo_file_id: uploadedFile.id
      })

      // Delete old logo file if it exists and update was successful
      if (oldLogoFileId && updatedLayout) {
        try {
          await fileApiService.delete(oldLogoFileId, true)
        } catch (deleteError) {
          // Log error but don't fail the operation
          console.error('Failed to delete old logo file:', deleteError)
        }
      }

      // Update local state with the new logo file
      if (updatedLayout) {
        selectedLayout.value = updatedLayout
      }

      toast.success('Logo uploaded successfully')
      showLogoModal.value = false
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isUploadingLogo.value = false
  }
}// Load data on mount
onMounted(() => {
  loadLayout()
})
</script>
