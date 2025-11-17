<template>
  <!-- File Modal -->
  <div
    v-if="open"
    class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
  >
    <div
      :class="[
        'theme-modal relative w-full bg-white dark:bg-gray-800 shadow-xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col',
        mode === 'upload' ? 'max-w-2xl' : 'max-w-4xl'
      ]"
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <button
          @click="close"
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto">
        <!-- Upload Mode -->
        <div v-if="mode === 'upload'" class="p-4 md:p-5 space-y-4">
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ allowedExtensions.length > 0 ? allowedExtensions.join(', ').toUpperCase() : 'Any file type' }} (MAX. {{ maxFileSizeInMB }}MB per file)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                class="hidden"
                :multiple="maxFiles > 1"
                :accept="allowedExtensions.length > 0 ? allowedExtensions.map(ext => `.${ext}`).join(',') : '*/*'"
                @change="handleFileSelect"
              />
            </label>
          </div>

          <!-- Selected Files List -->
          <div v-if="selectedFiles.length > 0" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Selected Files ({{ selectedFiles.length }})
            </h4>
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ file.name }}</span>
              <button
                type="button"
                @click="removeFile(index)"
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Edit/View Mode -->
        <form
          v-else
          @submit.prevent="onSubmit"
          class="p-4 md:p-5 space-y-4"
          name="fileForm"
        >
          <!-- File Information Section -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
              File Information
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="hasField('original_filename')">
                <label
                  for="original_filename"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  File Name <span class="text-red-600 dark:text-red-500">*</span>
                </label>
                <input
                  v-model="original_filename"
                  type="text"
                  name="original_filename"
                  id="original_filename"
                  :disabled="isFormReadonly || isFieldReadonly('original_filename')"
                  placeholder="Enter file name"
                  :class="[
                    'theme-input w-full',
                    errors.original_filename
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : '',
                    isFieldReadonly('original_filename')
                      ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                      : '',
                  ]"
                />
                <p v-if="errors.original_filename" class="text-red-500 text-sm mt-1">
                  {{ errors.original_filename }}
                </p>
              </div>

              <div v-if="hasField('content_type')">
                <label
                  for="content_type"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Content Type
                </label>
                <input
                  v-model="content_type"
                  type="text"
                  name="content_type"
                  id="content_type"
                  disabled
                  class="theme-input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>

              <div v-if="hasField('size')">
                <label
                  for="size"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Size
                </label>
                <input
                  v-model="formattedSize"
                  type="text"
                  name="size"
                  id="size"
                  disabled
                  class="theme-input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>

              <div v-if="hasField('category')">
                <label
                  for="category"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Category
                </label>
                <select
                  v-model="category"
                  name="category"
                  id="category"
                  :disabled="isFormReadonly || isFieldReadonly('category')"
                  :class="[
                    'theme-input w-full',
                    errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                    isFieldReadonly('category')
                      ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                      : '',
                  ]"
                >
                  <option value="">Select category</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="other">Other</option>
                </select>
                <p v-if="errors.category" class="text-red-500 text-sm mt-1">{{ errors.category }}</p>
              </div>
            </div>

            <div v-if="hasField('tags')">
              <label
                for="tags"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tags (comma separated)
              </label>
              <input
                v-model="tagsString"
                type="text"
                name="tags"
                id="tags"
                :disabled="isFormReadonly || isFieldReadonly('tags')"
                placeholder="tag1, tag2, tag3"
                :class="[
                  'theme-input w-full',
                  errors.tags ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('tags')
                    ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                    : '',
                ]"
              />
              <p v-if="errors.tags" class="text-red-500 text-sm mt-1">{{ errors.tags }}</p>
            </div>

            <div v-if="hasField('description')">
              <label
                for="description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                v-model="description"
                name="description"
                id="description"
                rows="4"
                :disabled="isFormReadonly || isFieldReadonly('description')"
                placeholder="Enter description (optional)"
                :class="[
                  'theme-input w-full',
                  errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFieldReadonly('description')
                    ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                    : '',
                ]"
              ></textarea>
              <p v-if="errors.description" class="text-red-500 text-sm mt-1">
                {{ errors.description }}
              </p>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div
        class="flex items-center justify-end p-4 md:p-5 space-x-3 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          type="button"
          @click="close"
          class="theme-btn theme-btn-secondary px-5 py-2.5 capitalize focus:ring-4 focus:outline-none"
        >
          {{ isViewMode ? t('system.crud.close') : t('system.crud.cancel') }}
        </button>
        <button
          v-if="mode === 'view' && file"
          type="button"
          @click="$emit('onDownload', file.id)"
          class="theme-btn theme-btn-primary px-5 py-2.5 capitalize focus:ring-4 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </button>
        <button
          v-if="!isViewMode"
          type="submit"
          :disabled="loading || !hasPermission || (mode === 'upload' && selectedFiles.length === 0)"
          @click="onSubmit"
          class="theme-btn theme-btn-primary px-5 py-2.5 capitalize focus:ring-4 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg
            v-if="loading"
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{
            loading
              ? t('system.crud.submitting', 'Submitting...')
              : mode === 'upload'
              ? 'Upload'
              : t('system.crud.submit')
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, type PropType, computed, watch, ref } from 'vue'
import { useTranslation } from 'i18next-vue'
import { useForm, useField } from 'vee-validate'
import type { IFile, IField } from '@/interfaces'
import { FileSchema } from '@/schemas/file-schemas'
import { useFormFields } from '@/composables/form/use-form-fields'
import { useSessionStore } from '@/stores/session-store'

const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Permission checks with hierarchy consideration
const canCreate = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('file.*') ||
    sessionStore.hasPermission('file.create'),
)

const canEdit = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('file.*') ||
    sessionStore.hasPermission('file.update'),
)

const canView = computed(
  () =>
    sessionStore.hasPermission('*') ||
    sessionStore.hasPermission('file.*') ||
    sessionStore.hasPermission('file.view'),
)

const emit = defineEmits(['onClose', 'onSubmit', 'onDownload'])

const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  file: { type: Object as PropType<IFile | null>, default: () => null },
  fields: {
    type: Array as PropType<IField[]>,
    default: () => [
      { name: 'original_filename', required: true },
      { name: 'category' },
      { name: 'tags' },
      { name: 'description' },
    ],
  },
  title: { type: String, default: 'File' },
  readonly: { type: Boolean, default: false },
  mode: { type: String as PropType<'upload' | 'edit' | 'view'>, default: 'upload' },
  maxFiles: { type: Number, default: 10 },
  maxFileSizeInMB: {
    type: Number,
    default: 100,
  },
  allowedExtensions: { type: Array as PropType<string[]>, default: () => [] }
})

const { loading, open, file, title, readonly, mode, maxFiles, maxFileSizeInMB, allowedExtensions } = toRefs(props)

// Upload mode state
const selectedFiles = ref<File[]>([])

// Configure fields based on mode
const configuredFields = computed(() => {
  return props.fields.map((field) => ({
    ...field,
    readonly: mode.value === 'view' || field.readonly,
  }))
})

const { isFieldReadonly } = useFormFields({ fields: configuredFields.value })

// Custom hasField that only shows fields present in the fields prop
const hasField = (fieldName: string): boolean => {
  return props.fields.some((field) => field.name === fieldName)
}

const { handleSubmit, errors, resetForm } = useForm<IFile>({
  validationSchema: mode.value !== 'upload' ? FileSchema(t) : undefined,
  initialValues: file.value || {
    original_filename: '',
    content_type: '',
    size: 0,
    category: '',
    tags: [],
    description: '',
  },
})

const { value: original_filename } = useField<string>('original_filename')
const { value: content_type } = useField<string>('content_type')
const { value: size } = useField<number>('size')
const { value: category } = useField<string>('category')
const { value: tags } = useField<string[]>('tags')
const { value: description } = useField<string>('description')

// Computed for tags string
const tagsString = computed({
  get: () => (tags.value || []).join(', '),
  set: (val: string) => {
    tags.value = val
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t)
  },
})

// Computed for formatted size
const formattedSize = computed(() => {
  if (!size.value) return 'N/A'
  return `${(size.value / (1024 * 1024)).toFixed(2)} MB`
})

// Determine if this is edit or view mode
const isEditMode = computed(() => mode.value === 'edit')
const isViewMode = computed(() => mode.value === 'view')

const hasPermission = computed(() => {
  if (isViewMode.value) {
    return canView.value
  } else if (isEditMode.value) {
    return canEdit.value
  } else {
    return canCreate.value
  }
})

// Form should be readonly in view mode
const isFormReadonly = computed(() => isViewMode.value || readonly.value)

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const files = Array.from(input.files)

  // Limit to maxFiles
  const filesToAdd = files.slice(0, Math.max(0, maxFiles.value - selectedFiles.value.length))

  // Validate file size
  const maxSizeBytes = maxFileSizeInMB.value * 1024 * 1024
  const validFiles = filesToAdd.filter(file => {
    if (file.size > maxSizeBytes) {
      // You can add toast notification here if needed
      console.warn(`File ${file.name} exceeds maximum size of ${maxFileSizeInMB.value}MB`)
      return false
    }

    // Validate file extension if specified
    if (allowedExtensions.value.length > 0) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (!ext || !allowedExtensions.value.includes(ext)) {
        console.warn(`File ${file.name} has invalid extension. Allowed: ${allowedExtensions.value.join(', ')}`)
        return false
      }
    }

    return true
  })

  selectedFiles.value = [...selectedFiles.value, ...validFiles]

  // Reset input
  input.value = ''
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const onSubmit = handleSubmit(async (values) => {
  if (!hasPermission.value) {
    return
  }

  if (mode.value === 'upload') {
    emit('onSubmit', selectedFiles.value)
    clearFields()
  } else {
    emit('onSubmit', values)
    clearFields()
  }
})

const close = () => {
  emit('onClose')
  clearFields()
}

const clearFields = () => {
  if (mode.value === 'upload') {
    selectedFiles.value = []
  } else {
    resetForm({
      values: {
        original_filename: '',
        content_type: '',
        size: 0,
        category: '',
        tags: [],
        description: '',
      },
    })
  }
}

// Watch for file prop changes to populate form
watch(
  () => props.file,
  (newFile) => {
    if (newFile && props.open && mode.value !== 'upload') {
      resetForm({
        values: {
          original_filename: newFile.original_filename || '',
          content_type: newFile.content_type || '',
          size: newFile.size || 0,
          category: newFile.category || '',
          tags: newFile.tags || [],
          description: newFile.description || '',
        },
      })
    }
  },
  { immediate: true }
)
</script>
