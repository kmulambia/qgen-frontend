<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue'
import { useTranslation } from 'i18next-vue'
import { XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/20/solid'
import { formatTextToCamelCase } from '@/utils/formatters'
import { TransitionRoot } from '@headlessui/vue'
import type { Component } from 'vue'

type AlertType = 'info' | 'success' | 'error' | 'warning'

interface AlertConfig {
  icon: Component
  bgClass: string
  iconClass: string
  titleClass: string
  textClass: string
  buttonClass: string
}

const alertConfigs: Record<AlertType, AlertConfig> = {
  success: {
    icon: CheckCircleIcon,
    bgClass: 'bg-success-50 dark:bg-success-800',
    iconClass: 'text-success-500 dark:text-success-100',
    titleClass: 'text-success-800 dark:text-success-300',
    textClass: 'text-success-700 dark:text-success-100',
    buttonClass: 'text-success-700 hover:text-success-600 dark:text-success-100 dark:hover:text-success-300',
  },
  error: {
    icon: XCircleIcon,
    bgClass: 'bg-error-50 dark:bg-error-800',
    iconClass: 'text-error-500 dark:text-error-100',
    titleClass: 'text-error-800 dark:text-error-300',
    textClass: 'text-error-700 dark:text-error-100',
    buttonClass: 'text-error-700 hover:text-error-600 dark:text-error-100 dark:hover:text-error-300',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgClass: 'bg-warning-50 dark:bg-warning-800',
    iconClass: 'text-warning-500 dark:text-warning-100',
    titleClass: 'text-warning-800 dark:text-warning-300',
    textClass: 'text-warning-700 dark:text-warning-100',
    buttonClass: 'text-warning-700 hover:text-warning-600 dark:text-warning-100 dark:hover:text-warning-300',
  },
  info: {
    icon: InformationCircleIcon,
    bgClass: 'bg-info-50 dark:bg-info-800',
    iconClass: 'text-info-500 dark:text-info-100',
    titleClass: 'text-info-800 dark:text-info-300',
    textClass: 'text-info-700 dark:text-info-100',
    buttonClass: 'text-info-700 hover:text-info-600 dark:text-info-100 dark:hover:text-info-300',
  },
}

const props = defineProps({
  open: { type: Boolean, default: true },
  title: { type: String, default: '' },
  type: {
    type: String as () => AlertType,
    default: 'info',
    validator: (value: string): boolean => ['info', 'success', 'error', 'warning'].includes(value),
  },
  data: { type: null },
  animated: { type: Boolean, default: true },
})

const { t } = useTranslation()
const { open, type, title, data, animated } = toRefs(props)
const openAlert = ref(open.value)

onMounted(() => {
  openAlert.value = open.value
})
</script>

<template>
  <div class="my-2">
    <TransitionRoot
      v-if="animated"
      appear
      :show="openAlert"
      enter="transform transition ease-in-out duration-500 sm:duration-700"
      enter-from="-translate-x-full"
      enter-to="translate-x-0"
      leave="transform transition ease-in-out duration-500 sm:duration-700"
      leave-from="translate-x-0"
      leave-to="translate-x-full"
    >
      <div :class="['rounded-md p-4 shadow-sm border border-gray-300 dark:border-gray-600', alertConfigs[type].bgClass]">
        <div class="flex">
          <div class="flex-shrink-0">
            <component
              :is="alertConfigs[type].icon"
              class="h-5 w-5"
              :class="alertConfigs[type].iconClass"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <div class="text-sm">
              <h3 class="font-medium  " :class="alertConfigs[type].titleClass">
                {{ title }}
              </h3>
              <div :class="alertConfigs[type].textClass">
                <template v-if="type === 'error'">
                  <ul role="list" class="list-disc space-y-1 pl-5">
                    <li v-if="typeof data === 'string'">
                      {{ data }}
                    </li>
                    <template v-else>
                      <li v-for="(value, key) in data" :key="key">
                        <span class="capitalize">{{ formatTextToCamelCase(String(key)) }}</span>: {{ value }}
                      </li>
                    </template>
                  </ul>
                </template>
                <template v-else>
                  {{ data }}
                </template>
              </div>
            </div>
            <div class="mt-3 text-sm md:ml-6 md:mt-0">
              <button
                type="button"
                @click="openAlert = false"
                :class="[
                  'whitespace-nowrap font-medium text-right capitalize',
                  alertConfigs[type].buttonClass
                ]"
              >
                {{ t(`system.actions.dismiss`) }}
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionRoot>
    <div
      v-else-if="openAlert"
      :class="['rounded-md p-4 shadow-sm border border-gray-300 dark:border-gray-600', alertConfigs[type].bgClass]"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <component
            :is="alertConfigs[type].icon"
            class="h-5 w-5"
            :class="alertConfigs[type].iconClass"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <div class="text-sm">
            <h3 class="font-medium  " :class="alertConfigs[type].titleClass">
              {{ title }}
            </h3>
            <div :class="alertConfigs[type].textClass">
              <template v-if="type === 'error'">
                <ul role="list" class="list-disc space-y-1 pl-5">
                  <li v-if="typeof data === 'string'">
                    {{ data }}
                  </li>
                  <template v-else>
                    <li v-for="(value, key) in data" :key="key">
                      <span class="capitalize">{{ formatTextToCamelCase(String(key)) }}</span>: {{ value }}
                    </li>
                  </template>
                </ul>
              </template>
              <template v-else>
                {{ data }}
              </template>
            </div>
          </div>
          <div class="mt-3 text-sm md:ml-6 md:mt-0">
            <button
              type="button"
              @click="openAlert = false"
              :class="[
                'whitespace-nowrap font-medium text-right capitalize',
                alertConfigs[type].buttonClass
              ]"
            >
              {{ t(`system.actions.dismiss`) }}
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.translate-x-full { transform: translateX(100%); }
.translate-x-0 { transform: translateX(0); }
.-translate-x-full { transform: translateX(-100%); }
</style>
