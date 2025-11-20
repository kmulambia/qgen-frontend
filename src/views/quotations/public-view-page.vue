<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else-if="error" class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
      <div class="mb-4">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Error</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
      <p v-if="error.includes('expired') || error.includes('invalid')" class="text-sm text-gray-500 dark:text-gray-500">
        Please contact support or request a new quotation link.
      </p>
    </div>
  </div>
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-4">
      <!-- Header Actions -->
      <div class="flex justify-end items-center">
        <div class="flex gap-3">
          <button
            type="button"
            @click="handleDownloadPDF"
            :disabled="isGeneratingPDF"
            class="theme-btn theme-btn-secondary px-4 py-2 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!isGeneratingPDF" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isGeneratingPDF ? 'Generating...' : 'Download PDF' }}
          </button>
          <button
            type="button"
            @click="handlePrint"
            class="theme-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 inline-flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      <!-- Preview Card -->
      <div id="printable-area" class="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
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
              <div v-if="quotation?.title" class="text-xs font-semibold text-gray-900 dark:text-white mb-1 uppercase">
                {{ quotation.title }}
              </div>
              <div v-if="quotation?.description" class="text-xs text-gray-600 dark:text-gray-400 max-w-xs">
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
                <span class="font-medium text-gray-900 dark:text-white">{{ quotation?.quotation_number || 'N/A' }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Date</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ quotation?.quotation_date || 'N/A' }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Valid until</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ quotation?.valid_until || 'N/A' }}</span>
              </div>
              <div v-if="quotation?.quotation_date && quotation?.valid_until" class="text-xs text-gray-500 dark:text-gray-400 text-right">
                Within {{ calculateDaysValid }} days
              </div>
            </div>
          </div>

          <!-- Line Items Table -->
          <div v-if="quotation?.items && quotation.items.length > 0" class="mb-6">
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
              <div v-if="quotation?.discount_percentage" class="flex justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Discount ({{ quotation.discount_percentage }}%)</span>
                <span class="font-medium text-red-600 dark:text-red-400">-{{ currencySymbol }}{{ calculatedDiscount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div v-if="quotation?.tax_percentage" class="flex justify-between text-sm">
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
          <div v-if="quotation?.notes" class="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ quotation.notes }}</p>
          </div>

          <!-- Terms & Conditions Section -->
          <div v-if="quotation?.terms_conditions" class="mt-4">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Terms & Conditions</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ quotation.terms_conditions }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useTranslation } from 'i18next-vue'
import type { IQuotation, IClient, ILayout, ICurrency } from '@/interfaces'
import { QuotationApiService } from '@/service/api/quotation-api-service'
import { Http } from '@/utils/http'
import { CurrencyService } from '@/service/static'
import LoadingComponent from '@/components/loading-component.vue'
import { formatErrorMessage } from '@/utils/errors'
import { generateQuotationPDF } from '@/utils/pdf-generator'

const route = useRoute()
const toast = useToast()
const { t } = useTranslation()

// Initialize HTTP client and API service for public access
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/'
const httpClient = new Http(apiBaseUrl)
const quotationApiService = new QuotationApiService(httpClient)
const currencyService = new CurrencyService()

// State
const isLoadingData = ref(false)
const isGeneratingPDF = ref(false)
const error = ref<string | null>(null)
const quotation = ref<IQuotation | null>(null)
const client = ref<IClient | null>(null)
const layout = ref<ILayout | null>(null)
const currencies = ref<ICurrency[]>([])

// Computed values
const businessInitials = computed(() => {
  const name = layout.value?.company_name || 'US'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)
})

const calculatedSubtotal = computed(() => {
  return quotation.value?.items?.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_price)
  }, 0) || 0
})

const calculatedDiscount = computed(() => {
  return calculatedSubtotal.value * ((quotation.value?.discount_percentage || 0) / 100)
})

const calculatedTax = computed(() => {
  const afterDiscount = calculatedSubtotal.value - calculatedDiscount.value
  return afterDiscount * ((quotation.value?.tax_percentage || 0) / 100)
})

const calculatedTotal = computed(() => {
  return calculatedSubtotal.value - calculatedDiscount.value + calculatedTax.value
})

const currencySymbol = computed(() => {
  if (!quotation.value?.currency) return '$'
  const curr = currencies.value.find(c => c.code === quotation.value?.currency)
  return curr?.symbol || quotation.value.currency || '$'
})

const calculateDaysValid = computed(() => {
  if (!quotation.value?.quotation_date || !quotation.value?.valid_until) {
    return 0
  }
  const start = new Date(quotation.value.quotation_date)
  const end = new Date(quotation.value.valid_until)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// Methods
const handlePrint = () => {
  window.print()
}

const handleDownloadPDF = async () => {
  if (!quotation.value) return

  isGeneratingPDF.value = true
  try {
    await generateQuotationPDF(quotation.value, currencySymbol.value)
    toast.success('PDF downloaded successfully')
  } catch (error) {
    console.error('Error generating PDF:', error)
    toast.error('Failed to generate PDF. Please try again.')
  } finally {
    isGeneratingPDF.value = false
  }
}

const loadData = async () => {
  isLoadingData.value = true
  error.value = null

  try {
    // Extract token from URL query parameter
    const token = route.query.token as string

    if (!token) {
      error.value = 'Access token is missing. Please check the link provided in your email.'
      isLoadingData.value = false
      return
    }

    // Load quotation using public endpoint
    const quotationData = await quotationApiService.getPublic(token)

    if (!quotationData) {
      error.value = 'Quotation not found'
      isLoadingData.value = false
      return
    }

    quotation.value = quotationData

    // Set client and layout from quotation data
    if (quotationData.client) {
      client.value = quotationData.client
    }
    if (quotationData.layout) {
      layout.value = quotationData.layout
    }

    // Load currencies for symbol lookup
    await currencyService.initialize()
    const currenciesResponse = await currencyService.getAll()
    if (currenciesResponse?.data) {
      currencies.value = currenciesResponse.data
    }
  } catch (err: any) {
    console.error('Error loading quotation:', err)

    // Handle specific error cases
    if (err.response?.status === 401) {
      error.value = 'Invalid or expired access token. Please request a new quotation link.'
    } else if (err.response?.status === 404) {
      error.value = 'Quotation not found'
    } else if (err.message?.includes('token') || err.message?.includes('expired')) {
      error.value = 'The access link has expired or is invalid. Please contact support or request a new link.'
    } else {
      error.value = formatErrorMessage(err, t) || 'Failed to load quotation. Please try again later.'
    }
  } finally {
    isLoadingData.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-area,
  #printable-area * {
    visibility: visible;
  }
  #printable-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  /* Hide action buttons in print */
  button {
    display: none !important;
  }
}
</style>

