<template>
  <!-- Upload Logo Modal -->
  <div
    class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    @click.self="$emit('close')"
  >
    <div class="relative w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-lg animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ layout?.logo_file ? 'Change Logo' : 'Upload Logo' }}
        </h3>
        <button
          @click="$emit('close')"
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-centers dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
        >
          <XMarkIcon class="w-5 h-5" />
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-4 md:p-5 space-y-4">
        <!-- Current Logo (if exists) -->
        <div v-if="layout?.logo_file" class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Current Logo</p>
          <div class="flex items-center gap-4">
            <div class="w-24 h-24 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center p-2">
              <img
                :src="layout.logo_file.url"
                :alt="layout.name"
                class="max-w-full max-h-full object-contain"
              />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ layout.logo_file.filename }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ layout.logo_file.content_type }}</p>
            </div>
            <button
              v-if="canManage"
              @click="handleRemoveLogo"
              :disabled="isRemoving"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <TrashIcon class="w-4 h-4 mr-1" />
              {{ isRemoving ? 'Removing...' : 'Remove' }}
            </button>
          </div>
        </div>

        <!-- File Upload Area -->
        <div class="flex items-center justify-center w-full">
          <label
            for="logo-upload"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <CloudArrowUpIcon class="w-16 h-16 mb-4 text-gray-400" />
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF or SVG (MAX. 10MB)
              </p>
            </div>
            <input
              id="logo-upload"
              ref="fileInput"
              type="file"
              class="hidden"
              accept="image/*"
              @change="handleFileSelect"
              :disabled="isUploading"
            />
          </label>
        </div>

        <!-- Selected File Preview -->
        <div v-if="selectedFile" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <DocumentIcon class="w-8 h-8 text-blue-500" />
              <div>
                <p class="text-sm font-medium text-blue-900 dark:text-blue-300">{{ selectedFile.name }}</p>
                <p class="text-xs text-blue-700 dark:text-blue-400">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <button
              @click="clearSelectedFile"
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Image Preview -->
        <div v-if="imagePreview" class="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 p-4">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Preview</p>
          <div class="flex items-center justify-center h-48">
            <img
              :src="imagePreview"
              alt="Logo preview"
              class="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end p-4 md:p-5 space-x-3 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="$emit('close')"
          class="inline-flex items-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Cancel
        </button>
        <button
          v-if="selectedFile"
          type="button"
          @click="handleUploadLogo"
          :disabled="isUploading"
          class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CloudArrowUpIcon v-if="!isUploading" class="w-4 h-4 mr-2" />
          <svg
            v-else
            class="animate-spin h-4 w-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isUploading ? 'Uploading...' : 'Upload Logo' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, type PropType } from 'vue'
import type { ILayout } from '@/interfaces'
import type { LayoutApiService } from '@/service/api/layout-api-service'
import { useToast } from 'vue-toastification'
import { useTranslation } from 'i18next-vue'
import { formatErrorMessage } from '@/utils/errors'
import {
  CloudArrowUpIcon,
  TrashIcon,
  DocumentIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  layout: {
    type: Object as PropType<ILayout>,
    required: true,
  },
  canManage: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'logo-updated'])

const toast = useToast()
const { t } = useTranslation()
const layoutApiService = inject<LayoutApiService>('layoutApiService')!

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const isUploading = ref(false)
const isRemoving = ref(false)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size must be less than 10MB')
    return
  }

  selectedFile.value = file

  // Create image preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const clearSelectedFile = () => {
  selectedFile.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleUploadLogo = async () => {
  if (!selectedFile.value || !props.layout?.id) return

  isUploading.value = true
  try {
    await layoutApiService.uploadLogo(props.layout.id, selectedFile.value)
    toast.success('Logo uploaded successfully')
    clearSelectedFile()
    emit('logo-updated')
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isUploading.value = false
  }
}

const handleRemoveLogo = async () => {
  if (!props.layout?.id) return

  if (!confirm('Are you sure you want to remove the logo?')) {
    return
  }

  isRemoving.value = true
  try {
    await layoutApiService.removeLogo(props.layout.id)
    toast.success('Logo removed successfully')
    emit('logo-updated')
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isRemoving.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>
