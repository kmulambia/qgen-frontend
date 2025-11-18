<template>
  <!-- Preview Modal -->
  <div
    v-if="open"
    class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
    @click.self="close"
  >
    <div class="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-primary/20 dark:border-primary/30 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Preview Quotation</h3>
        <div class="flex items-center gap-3">
          <button
            @click="handlePrint"
            type="button"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            @click="close"
            type="button"
            class="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview Content -->
      <div id="printable-preview" class="bg-white dark:bg-gray-800">
        <!-- Header Section -->
        <div class="border-b border-gray-300 dark:border-gray-600 px-6 py-4">
          <div class="flex justify-between items-start gap-8">
            <!-- Business Info -->
            <div class="flex-1">
              <div class="flex items-start gap-3 mb-3">
                <div v-if="layout?.logo_file?.url" class="w-16 h-16 border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 flex-shrink-0">
                  <img :src="layout.logo_file.url" alt="Logo" class="w-full h-full object-contain p-1" />
                </div>
                <div v-else class="w-16 h-16 bg-primary flex items-center justify-center flex-shrink-0">
                  <span class="text-2xl font-bold text-white">{{ businessInitials }}</span>
                </div>
                <div class="flex-1">
                  <h2 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {{ layout?.company_name || 'UMODZI SOURCE' }}
                  </h2>
                  <p v-if="layout?.description" class="text-xs text-gray-600 dark:text-gray-400">
                    {{ layout?.description || 'SOFTWARE DEVELOPMENT' }}
                  </p>
                </div>
              </div>
              <div class="space-y-0.5 text-xs text-gray-700 dark:text-gray-300 ml-19">
                <p v-if="layout?.email">{{ layout.email }}</p>
                <p v-if="layout?.phone">{{ layout.phone }}</p>
                <p v-if="layout?.address">{{ layout.address }}</p>
              </div>
            </div>

            <!-- Quotation Title -->
            <div class="text-right flex-shrink-0">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">QUOTATION</h1>
              <div v-if="quotation.title" class="text-xs font-semibold text-gray-900 dark:text-white mb-1 uppercase">
                {{ quotation.title }}
              </div>
              <div v-if="quotation.description" class="text-xs text-gray-600 dark:text-gray-400 max-w-xs">
                {{ quotation.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="p-6">
          <div class="grid grid-cols-2 gap-8 mb-6">
            <!-- Bill To -->
            <div>
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Bill to</h3>
              <p class="font-semibold text-gray-900 dark:text-white text-base">{{ client?.company_name || 'Client Name' }}</p>
              <p v-if="client?.email" class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ client.email }}</p>
              <p v-if="client?.phone" class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ client.phone }}</p>
            </div>

            <!-- Quotation Info -->
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Estimate number</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ quotation.quotation_number || 'N/A' }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Date</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ quotation.quotation_date || 'N/A' }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Valid until</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ quotation.valid_until || 'N/A' }}</span>
              </div>
              <div v-if="quotation.quotation_date && quotation.valid_until" class="text-xs text-gray-500 dark:text-gray-400 text-right">
                Within {{ calculateDaysValid }} days
              </div>
            </div>
          </div>

          <!-- Line Items Table -->
          <div v-if="quotation.items && quotation.items.length > 0" class="mb-6">
            <table class="w-full border border-gray-300 dark:border-gray-600">
              <thead class="bg-primary text-white">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Items</th>
                  <th class="px-4 py-3 text-center text-sm font-semibold w-24">Quantity</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold w-32">Price</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold w-32">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                <tr v-for="(item, index) in quotation.items" :key="index" class="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                  <td class="px-4 py-3">
                    <div class="font-medium text-gray-900 dark:text-white">{{ item.description?.split('\n')[0] || 'Item ' + (index + 1) }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ item.description?.substring(item.description.indexOf('\n') + 1) }}</div>
                  </td>
                  <td class="px-4 py-3 text-center text-gray-900 dark:text-white">{{ item.quantity }}</td>
                  <td class="px-4 py-3 text-right text-gray-900 dark:text-white">{{ currencySymbol }}{{ item.unit_price.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-right font-semibold text-primary dark:text-primary-light">
                    {{ currencySymbol }}{{ (item.quantity * item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totals Section -->
          <div class="flex justify-end">
            <div class="w-80 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Subtotal</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ currencySymbol }}{{ calculatedSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div v-if="quotation.discount_percentage" class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Discount ({{ quotation.discount_percentage }}%)</span>
                <span class="font-medium text-red-600 dark:text-red-400">-{{ currencySymbol }}{{ calculatedDiscount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div v-if="quotation.tax_percentage" class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Tax ({{ quotation.tax_percentage }}%)</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ currencySymbol }}{{ calculatedTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div class="flex justify-between text-base font-bold border-t-2 border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <span class="text-gray-900 dark:text-white">Total</span>
                <span class="text-gray-900 dark:text-white">{{ currencySymbol }}{{ calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div v-if="quotation.notes" class="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ quotation.notes }}</p>
          </div>

          <!-- Terms & Conditions Section -->
          <div v-if="quotation.terms_conditions" class="mt-4">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Terms & Conditions</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ quotation.terms_conditions }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { IQuotation, IClient, ILayout, ICurrency } from '@/interfaces'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  quotation: {
    type: Object as PropType<Partial<IQuotation>>,
    required: true
  },
  client: {
    type: Object as PropType<IClient | null>,
    default: null
  },
  layout: {
    type: Object as PropType<ILayout | null>,
    default: null
  },
  currencies: {
    type: Array as PropType<ICurrency[]>,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const handlePrint = () => {
  window.print()
}

const businessInitials = computed(() => {
  const name = props.layout?.company_name || 'US'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)
})

const calculateDaysValid = computed(() => {
  if (!props.quotation.quotation_date || !props.quotation.valid_until) {
    return 0
  }
  const start = new Date(props.quotation.quotation_date)
  const end = new Date(props.quotation.valid_until)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

const currencySymbol = computed(() => {
  const curr = props.currencies.find(c => c.code === props.quotation.currency)
  return curr?.symbol || '$'
})

const calculatedSubtotal = computed(() => {
  return props.quotation.items?.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_price)
  }, 0) || 0
})

const calculatedDiscount = computed(() => {
  return calculatedSubtotal.value * ((props.quotation.discount_percentage || 0) / 100)
})

const calculatedTax = computed(() => {
  const afterDiscount = calculatedSubtotal.value - calculatedDiscount.value
  return afterDiscount * ((props.quotation.tax_percentage || 0) / 100)
})

const calculatedTotal = computed(() => {
  return calculatedSubtotal.value - calculatedDiscount.value + calculatedTax.value
})
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-preview,
  #printable-preview * {
    visibility: visible;
  }
  #printable-preview {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
