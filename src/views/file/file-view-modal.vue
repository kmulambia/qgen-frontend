<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="close">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="px-4 py-5 sm:p-6">
                <!-- Header with centered large icon -->
                <div class="space-y-4">
                  <div class="border-b border-gray-900/10 dark:border-slate-200/20 pb-6">
                    <div class="text-center">
                      <div class="inline-flex p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl mb-4 ring-1 ring-gray-200 dark:ring-slate-600">
                        <component
                          :is="getFileIcon(file?.content_type??'')"
                          class="w-12 h-12 text-gray-600 dark:text-gray-300"
                        />
                      </div>
                      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        {{ file?.original_filename }}
                      </DialogTitle>
                      <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {{ formatFileSize(file?.size??0) }} • {{ file?.content_type }}
                      </div>
                    </div>
                  </div>

                  <!-- File Details -->
                  <div class="mt-4">
                    <dl class="divide-y divide-gray-200 dark:divide-slate-700">
                      <div v-for="field in visibleFields" :key="field.key"
                        class="py-3 flex justify-between text-sm">
                        <dt class="text-gray-500 dark:text-gray-400">{{ field.label }}</dt>
                        <dd class="text-gray-900 dark:text-white font-medium">
                          {{ formatFieldValue(field.key, (file as any)[field.key]) }}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-900/10 dark:border-slate-200/20 ">
                <button
                  v-if="canDownload"
                  type="button"
                  @click="handleDownload"
                  class="  capitalize inline-flex w-full justify-center items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                >

                  {{ t(`common.preview`) }}
                </button>
                <button
                  type="button"
                  @click="close"
                  class=" capitalize mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 sm:mt-0 sm:w-auto"
                >
                  {{ t(`common.close`) }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowDownTrayIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import moment from 'moment'
import { useFileIcon } from '@/composables/useFileIcon'
import type { IFile } from '@/types'
import { useSessionStore } from '@/stores/session-store'
import { useFileStore } from '@/stores/file-store'
import { useToast } from 'vue-toastification'
import { useTranslation } from 'i18next-vue'

const { t } = useTranslation()

const props = defineProps({
  open: { type: Boolean, default: false },
  file: { type: Object as PropType<IFile | null>, default: () => null }
})

const emit = defineEmits(['onClose', 'onDownload'])
const sessionStore = useSessionStore()
const { getFileIcon } = useFileIcon()
const fileStore = useFileStore()
const toast = useToast()

// Field definitions
const visibleFields = [
  { key: 'created_at', label: 'Created' },
  { key: 'updated_at', label: 'Modified' }
]

// Computed properties
const fileObj = computed(() => new File([], props.file?.original_filename || 'N/A', { type: props.file?.content_type || 'N/A' }))
const isImage = computed(() => props.file?.content_type?.startsWith('image/'))
const canDownload = computed(() => sessionStore.hasPermission(['file.*', 'files.download']))

// Methods
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const formatDate = (date: string): string => {
  return moment(date).format('DD/MM/YYYY HH:mm')
}

const formatFieldValue = (key: string, value: any): string => {
  if (key.includes('_at')) {
    return formatDate(value)
  }
  return value?.toString() || 'N/A'
}

const handleDownload = async () => {
  try {
    emit('onDownload', props.file?.id)
  } catch (error) {
    console.error('Download failed:', error)
  }
}

const close = () => {
  emit('onClose')
}
</script>
