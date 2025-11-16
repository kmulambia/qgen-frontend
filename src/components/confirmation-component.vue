<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { generateRandomString } from '@/utils/generators'
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

type VariantType = 'warning' | 'error' | 'info' | 'success' | 'default'

interface Props {
  open: boolean
  title: string
  description: string
  variant?: VariantType
  secureMode?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'warning',
  secureMode: false,
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  confirmButtonClass: '',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  'update:open': [value: boolean]
}>()

const isOpen = ref(props.open)
const userInput = ref('')
const generatedCode = ref('')

// Watch for open prop changes
watch(() => props.open, (newValue) => {
  isOpen.value = newValue
  if (newValue && props.secureMode) {
    // Generate new code when dialog opens in secure mode
    generatedCode.value = generateRandomString(5, true, true)
    userInput.value = ''
  }
})

// Variant configurations
const variantConfig = computed(() => {
  const configs = {
    warning: {
      icon: ExclamationTriangleIcon,
      iconBgClass: 'bg-warning-100 dark:bg-warning-900/30',
      iconColorClass: 'text-warning-600 dark:text-warning-400',
      buttonClass: 'text-white bg-warning-600 hover:bg-warning-700 focus:ring-4 focus:ring-warning-500/50 dark:bg-warning-600 dark:hover:bg-warning-700',
    },
    error: {
      icon: XCircleIcon,
      iconBgClass: 'bg-error-100 dark:bg-error-900/30',
      iconColorClass: 'text-error-600 dark:text-error-400',
      buttonClass: 'text-white bg-error-600 hover:bg-error-700 focus:ring-4 focus:ring-error-500/50 dark:bg-error-600 dark:hover:bg-error-700',
    },
    info: {
      icon: InformationCircleIcon,
      iconBgClass: 'bg-info-100 dark:bg-info-900/30',
      iconColorClass: 'text-info-600 dark:text-info-400',
      buttonClass: 'text-white bg-info-600 hover:bg-info-700 focus:ring-4 focus:ring-info-500/50 dark:bg-info-600 dark:hover:bg-info-700',
    },
    success: {
      icon: CheckCircleIcon,
      iconBgClass: 'bg-success-100 dark:bg-success-900/30',
      iconColorClass: 'text-success-600 dark:text-success-400',
      buttonClass: 'text-white bg-success-600 hover:bg-success-700 focus:ring-4 focus:ring-success-500/50 dark:bg-success-600 dark:hover:bg-success-700',
    },
    default: {
      icon: InformationCircleIcon,
      iconBgClass: 'bg-gray-100 dark:bg-gray-700',
      iconColorClass: 'text-gray-600 dark:text-gray-400',
      buttonClass: 'theme-btn-primary',
    },
  }
  return configs[props.variant]
})

const finalButtonClass = computed(() => {
  return props.confirmButtonClass || variantConfig.value.buttonClass
})

// Check if user input matches the generated code
const isCodeValid = computed(() => {
  if (!props.secureMode) return true
  return userInput.value.toUpperCase() === generatedCode.value
})

const canConfirm = computed(() => {
  if (!props.secureMode) return true
  return isCodeValid.value && userInput.value.length > 0
})

const handleCancel = () => {
  isOpen.value = false
  emit('update:open', false)
  emit('cancel')
  userInput.value = ''
}

const handleConfirm = () => {
  if (!canConfirm.value) return

  isOpen.value = false
  emit('update:open', false)
  emit('confirm')
  userInput.value = ''
}
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="handleCancel">
      <!-- Backdrop with enhanced blur -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="theme-modal relative w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl animate-in zoom-in-95 duration-200">

              <!-- Modal Header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3 flex-1">
                  <!-- Icon -->
                  <div :class="[
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
                    variantConfig.iconBgClass
                  ]">
                    <component :is="variantConfig.icon" :class="['h-6 w-6', variantConfig.iconColorClass]" aria-hidden="true" />
                  </div>

                  <!-- Title -->
                  <DialogTitle as="h3" class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ title }}
                  </DialogTitle>
                </div>

                <!-- Close Button -->
                <button
                  @click="handleCancel"
                  type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-150"
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
              <div class="p-4 md:p-5 space-y-4">
                <!-- Description -->
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {{ description }}
                  </p>
                </div>

                <!-- Custom Content Slot -->
                <slot name="content"></slot>

                <!-- Secure Mode: Code Verification -->
                <div v-if="secureMode">
                  <div class="rounded-lg bg-gradient-to-br from-warning-50 to-warning-100/50 dark:from-warning-900/20 dark:to-warning-900/10 p-4 border border-warning-200 dark:border-warning-800/50">
                    <div class="flex items-start">
                      <div class="flex-1">
                        <h3 class="text-sm font-semibold text-warning-900 dark:text-warning-200 mb-2">
                          Security Verification Required
                        </h3>
                        <p class="text-sm text-warning-800 dark:text-warning-300 mb-3">
                          Please type the following code to confirm this action:
                        </p>
                        <div class="mb-3 text-center">
                          <code class="inline-block px-4 py-2.5 bg-white dark:bg-gray-800 text-xl font-mono font-bold text-gray-900 dark:text-gray-100 border-2 border-warning-300 dark:border-warning-600/50 rounded-md select-all tracking-wider shadow-sm">
                            {{ generatedCode }}
                          </code>
                        </div>
                        <input
                          v-model="userInput"
                          type="text"
                          placeholder="Enter code here"
                          class="theme-input text-center block w-full font-mono uppercase tracking-wider text-base"
                          @keyup.enter="handleConfirm"
                          autocomplete="off"
                        />
                        <p v-if="userInput && !isCodeValid" class="mt-2 text-xs text-error-600 dark:text-error-400 text-center">
                          Code does not match. Please try again.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex items-center justify-end p-4 md:p-5 space-x-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  @click="handleCancel"
                  class="theme-btn theme-btn-secondary px-5 py-2.5 capitalize"
                >
                  {{ cancelButtonText }}
                </button>
                <button
                  type="button"
                  :disabled="!canConfirm"
                  @click="handleConfirm"
                  :class="[
                    'theme-btn px-5 py-2.5 capitalize',
                    canConfirm
                      ? finalButtonClass
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50 hover:bg-gray-300 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ confirmButtonText }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

