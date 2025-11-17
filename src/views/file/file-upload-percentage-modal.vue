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
              class="relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-800 text-left shadow-xl transition-all sm:my-6 sm:w-96 p-6">
              <div class="absolute top-4 right-4">
                <button
                  type="button"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  @click="close"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="text-center">
                <DialogTitle as="h3" class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Uploading Files
                </DialogTitle>

                <!-- Progress Circle -->
                <div class="relative mx-auto w-24 h-24 mb-4">
                  <svg class="w-full h-full" viewBox="0 0 100 100">
                    <!-- Background circle -->
                    <circle
                      class="text-gray-200 dark:text-gray-700"
                      stroke-width="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="50"
                      cy="50"
                    />
                    <!-- Progress circle -->
                    <circle
                      class="text-primary-600 dark:text-primary-500"
                      stroke-width="8"
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="dashOffset"
                      stroke-linecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xl font-semibold text-gray-900 dark:text-white">{{ percentage }}%</span>
                  </div>
                </div>

                <!-- Status Text -->
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {{ statusText }}
                </p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  percentage: { type: Number, default: 0 }
})

const emit = defineEmits(['onClose'])

const close = () => {
  emit('onClose')
}

// Calculate circle progress
const circumference = computed(() => 2 * Math.PI * 44)
const dashOffset = computed(() => {
  const progress = (100 - props.percentage) / 100
  return circumference.value * progress
})

// Status text based on percentage
const statusText = computed(() => {
  if (props.percentage === 100) return 'Upload complete!'
  return 'Uploading files...'
})

// Auto close when upload is complete
watch(() => props.percentage, (newValue) => {
  if (newValue === 100) {
    setTimeout(() => {
      close()
    }, 1000)
  }
})
</script>

<style scoped>
circle {
  transform-origin: 50% 50%;
  transform: rotate(-90deg);
  transition: stroke-dashoffset 0.3s ease;
}
</style>
