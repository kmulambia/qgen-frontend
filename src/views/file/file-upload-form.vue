<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="close" :style="{ zIndex: 1000 }">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />
      </TransitionChild>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-3 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-800 text-left shadow-xl transition-all sm:my-6  md:w-3/12 sm:w-4/12 p-4 pb-6">
              <DialogTitle as="h3"
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white capitalize mb-2">
                {{ title }}
              </DialogTitle>
              <form @submit.prevent="onSubmit" class="space-y-4">
                <div class="border-b border-gray-200 dark:border-slate-600/40 pb-4">
                  <!-- File Upload Errors -->
                  <div class="space-y-2 mb-4">
                    <TransitionGroup
                      :tag="'div'"
                      :enter-active-class="'transform ease-out duration-300'"
                      :enter-from-class="'translate-y-2 opacity-0'"
                      :enter-to-class="'translate-y-0 opacity-100'"
                      :leave-active-class="'transition ease-in duration-200'"
                      :leave-from-class="'opacity-100'"
                      :leave-to-class="'opacity-0'"
                    >
                      <div
                        v-for="(error, index) in fileErrors"
                        :key="index"
                        class="flex items-center justify-between p-3 rounded-lg text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                      >
                        <span>{{ error }}</span>
                        <button
                          type="button"
                          @click="removeError(index)"
                          class="p-1 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                        >
                          <XMarkIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </TransitionGroup>
                  </div>

                  <!-- Hide dropzone when max files reached -->
                  <div v-if="selectedFiles.length < maxFiles" class="flex items-center justify-center w-full px-4 sm:px-0">
                    <label for="dropzone-file"
                      class="flex flex-col items-center justify-center w-full max-w-xl mx-auto h-48 sm:h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors duration-200">
                      <div class="flex flex-col items-center justify-center px-4 text-center">
                        <CloudArrowUpIcon class="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                        <p class="mb-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                          <span class="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {{ allowedExtensions.length > 0 ? `Formats: ${allowedExtensions.join(', ')}` : 'All formats' }}
                        </p>
                        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          ({{ maxFileSizeInMB }} MB Max per file)
                        </p>
                        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {{ maxFiles - selectedFiles.length }} more {{ maxFiles - selectedFiles.length === 1 ? 'file' : 'files' }} allowed
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        class="hidden"
                        :multiple="maxFiles - selectedFiles.length > 1"
                        @change="handleFileSelect"
                        :accept="allowedExtensions.map(ext => `.${ext}`).join(',')"
                      />
                    </label>
                  </div>

                  <!-- File Preview Section -->
                  <div v-if="selectedFiles.length > 0"
                    :class="{'mt-4': selectedFiles.length < maxFiles}"
                    class="space-y-3">
                    <div v-for="(file, index) in selectedFiles" :key="index"
                      class="group relative flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/20 hover:border-primary-100 dark:hover:border-primary-500/20 transition-all duration-200">
                      <div class="flex items-center space-x-3 overflow-hidden">
                        <!-- Thumbnail/Icon Section -->
                        <div class="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-600/50 flex items-center justify-center">
                          <img v-if="isImageFile(file) && filePreviewUrls[index]"
                            :src="filePreviewUrls[index]"
                            class="w-full h-full object-cover"
                            alt="preview"
                          />
                          <component
                            v-else
                            :is="getFileIcon(file?.type??'')"
                            class="w-6 h-6 text-gray-400 dark:text-gray-300"
                          />
                        </div>

                        <!-- File Info -->
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                              {{ file.name }}
                            </span>
                            <span class="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                              {{ formatFileSize(file.size) }}
                            </span>
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {{ getFileType(file) }}
                          </div>
                        </div>
                      </div>

                      <!-- Remove Button -->
                      <button
                        type="button"
                        @click="removeFile(index)"
                        class="ml-2 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 group-hover:bg-red-50 dark:group-hover:bg-red-500/20 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200"
                      >
                        <XMarkIcon class="w-5 h-5" />
                      </button>
                    </div>

                    <!-- File Count -->
                    <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {{ selectedFiles.length }} of {{ maxFiles }} files selected
                    </div>
                  </div>
                </div>
                <!-- Form Actions -->
                <div class="sm:flex sm:flex-row-reverse gap-2">
                  <button type="submit" :disabled="loading"
                    class="inline-flex w-full justify-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto transition-colors duration-200">
                    <span v-if="loading">
                      <component :is="LoadingComponent" />
                    </span>
                    <span v-else class="capitalize">{{ t(`common.submit`) }}</span>
                  </button>
                  <button type="button"
                    class="mt-2 sm:mt-0 inline-flex w-full justify-center rounded-lg bg-white dark:bg-slate-700 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 sm:w-auto transition-colors duration-200 capitalize"
                    @click="close">
                    {{ t(`common.cancel`) }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, toRefs, onBeforeUnmount, type PropType } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  XMarkIcon,
  CloudArrowUpIcon,
} from '@heroicons/vue/24/outline'
import { useTranslation } from 'i18next-vue'
import LoadingComponent from '@/components/loading-component.vue'
import { useFileIcon } from '@/composables/useFileIcon'

const { t } = useTranslation()
const emit = defineEmits(['onClose', 'onSubmit'])
const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Upload Files' },
  maxFiles: { type: Number, default: 1 },
  maxFileSizeInMB: {
    type: Number,
    default: 50,
    function: (value: number) => {
      return value * 1024 * 1024
    }
  },
  allowedExtensions: { type: Array as PropType<string[]>, default: () => [] }
})
const { loading, open, title, maxFiles, maxFileSizeInMB, allowedExtensions } = toRefs(props)

const selectedFiles = ref<File[]>([])
const filePreviewUrls = ref<string[]>([])
const fileErrors = ref<string[]>([])

const { getFileIcon } = useFileIcon()

const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

const getFileType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE'
  const type = file.type.split('/')[0].toUpperCase()
  return `${type} ${extension}`
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const files = Array.from(input.files)
  const remainingSlots = maxFiles.value - selectedFiles.value.length

  // Take only the number of files that can still be added
  const filesToProcess = files.slice(0, remainingSlots)

  // Validate file size
  const invalidFiles = filesToProcess.filter(file => file.size > maxFileSizeInMB.value * 1024 * 1024)
  if (invalidFiles.length > 0) {
    invalidFiles.forEach(file => {
      fileErrors.value.push(`File "${file.name}" exceeds the maximum size of ${maxFileSizeInMB.value}MB`)
    })
    return
  }

  // Validate file extensions if specified
  if (allowedExtensions.value.length > 0) {
    const invalidExtFiles = filesToProcess.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      return !ext || !allowedExtensions.value.includes(ext)
    })
    if (invalidExtFiles.length > 0) {
      invalidExtFiles.forEach(file => {
        fileErrors.value.push(`File "${file.name}" has an invalid file extension. Allowed: ${allowedExtensions.value.join(', ')}`)
      })
      return
    }
  }

  // Generate preview URLs for images
  const newFiles = filesToProcess
  const newPreviewUrls = await Promise.all(
    newFiles.map(file => {
      if (isImageFile(file)) {
        return URL.createObjectURL(file)
      }
      return ''
    })
  )

  selectedFiles.value = [...selectedFiles.value, ...newFiles]
  filePreviewUrls.value = [...filePreviewUrls.value, ...newPreviewUrls]

  input.value = ''
}

const removeFile = (index: number) => {
  // Cleanup preview URL if exists
  if (filePreviewUrls.value[index]) {
    URL.revokeObjectURL(filePreviewUrls.value[index])
  }
  filePreviewUrls.value.splice(index, 1)
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const clearFiles = () => {
  // Cleanup all preview URLs
  filePreviewUrls.value.forEach(url => {
    if (url) URL.revokeObjectURL(url)
  })
  filePreviewUrls.value = []
  selectedFiles.value = []
}

const close = () => {
  clearFiles()
  fileErrors.value = []
  emit('onClose')
}

const onSubmit = () => {
  emit('onSubmit', selectedFiles.value)
  clearFiles()
}

const removeError = (index: number) => {
  fileErrors.value.splice(index, 1)
}

onBeforeUnmount(() => {
  clearFiles()
})

</script>
