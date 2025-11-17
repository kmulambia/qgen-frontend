<template>
  <div class="space-y-6">
    <!-- Preview Container -->
    <div class="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <!-- Header Section with Logo -->
      <div class="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
        <div class="flex-1">
          <div v-if="layout?.logo_file" class="mb-4">
            <img
              :src="layout.logo_file.url"
              :alt="layout.name"
              class="h-16 w-auto object-contain"
            />
          </div>
          <div v-if="layout?.company_name" class="mb-2">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ layout.company_name }}
            </h2>
          </div>
          <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p v-if="layout?.address">{{ layout.address }}</p>
            <p v-if="layout?.phone">Phone: {{ layout.phone }}</p>
            <p v-if="layout?.email">Email: {{ layout.email }}</p>
            <p v-if="layout?.reference_number">Ref: {{ layout.reference_number }}</p>
          </div>
        </div>

        <div class="text-right">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">QUOTATION</h1>
          <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p><span class="font-semibold">Quote #:</span> QT-2025-0001</p>
            <p><span class="font-semibold">Date:</span> {{ currentDate }}</p>
            <p><span class="font-semibold">Valid Until:</span> {{ validUntilDate }}</p>
          </div>
        </div>
      </div>

      <!-- Client Information Section -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bill To:</h3>
        <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <p class="font-semibold text-gray-900 dark:text-white">Sample Client Name</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">123 Client Street</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">City, State 12345</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">client@example.com</p>
        </div>
      </div>

      <!-- Items Table -->
      <div class="mb-6">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-900">
              <th class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
              <th class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-white">Qty</th>
              <th class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-white">Unit Price</th>
              <th class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Sample Product/Service 1</td>
              <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">2</td>
              <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">$150.00</td>
              <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">$300.00</td>
            </tr>
            <tr>
              <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Sample Product/Service 2</td>
              <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">1</td>
              <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">$250.00</td>
              <td class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">$250.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals Section -->
      <div class="flex justify-end mb-6">
        <div class="w-64">
          <div class="flex justify-between py-2 text-sm">
            <span class="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span class="font-semibold text-gray-900 dark:text-white">$550.00</span>
          </div>
          <div class="flex justify-between py-2 text-sm">
            <span class="text-gray-600 dark:text-gray-400">Tax (10%):</span>
            <span class="font-semibold text-gray-900 dark:text-white">$55.00</span>
          </div>
          <div class="flex justify-between py-2 border-t-2 border-gray-300 dark:border-gray-700 text-base font-bold">
            <span class="text-gray-900 dark:text-white">Total:</span>
            <span class="text-primary-600 dark:text-primary-400">$605.00</span>
          </div>
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div v-if="layout?.terms_conditions" class="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Terms & Conditions</h4>
        <p class="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ layout.terms_conditions }}</p>
      </div>

      <!-- Notes -->
      <div v-if="layout?.notes" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Notes</h4>
        <p class="text-xs text-blue-700 dark:text-blue-400 whitespace-pre-line">{{ layout.notes }}</p>
      </div>

      <!-- Footer -->
      <div class="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-500">
          Thank you for your business!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { ILayout } from '@/interfaces'
import moment from 'moment'

const props = defineProps({
  layout: {
    type: Object as PropType<ILayout>,
    required: true,
  },
})

const currentDate = computed(() => moment().format('MMMM DD, YYYY'))
const validUntilDate = computed(() => moment().add(30, 'days').format('MMMM DD, YYYY'))
</script>
