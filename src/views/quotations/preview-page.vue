<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-4">
      <BreadcrumbComponents :items="breadcrumb_items" />

      <!-- Header Actions -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Preview Quotation
        </h1>
        <div class="flex gap-3">
          <button
            type="button"
            @click="goBack"
            class="theme-btn theme-btn-secondary px-4 py-2"
          >
            Back
          </button>
          <button
            v-if="canEdit"
            type="button"
            @click="handleEdit"
            class="theme-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
          >
            Edit
          </button>
          <button
            type="button"
            @click="handlePrint"
            class="theme-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2"
          >
            Print
          </button>
        </div>
      </div>

      <!-- Preview Card - Similar to attached image -->
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
import { ref, computed, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useTranslation } from 'i18next-vue'
import type { IQuotation, IClient, ILayout, ICurrency } from '@/interfaces'
import { IRequestFilterOperator } from '@/interfaces'
import type { useQuotationStore } from '@/stores/quotation-store'
import type { useClientStore } from '@/stores/client-store'
import type { useLayoutStore } from '@/stores/layout-store'
import { CurrencyService } from '@/service/static'
import LoadingComponent from '@/components/loading-component.vue'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import { formatErrorMessage } from '@/utils/errors'
import { useSessionStore } from '@/stores/session-store'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useTranslation()

// Inject stores
const quotationStore = inject<ReturnType<typeof useQuotationStore>>('quotationStore')!
const clientStore = inject<ReturnType<typeof useClientStore>>('clientStore')!
const layoutStore = inject<ReturnType<typeof useLayoutStore>>('layoutStore')!
const sessionStore = useSessionStore()
const currencyService = new CurrencyService()

// State
const isLoadingData = ref(false)
const quotation = ref<IQuotation | null>(null)
const client = ref<IClient | null>(null)
const layout = ref<ILayout | null>(null)
const currencies = ref<ICurrency[]>([])

// Permission checks
const canEdit = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('quotation.*') ||
  sessionStore.hasPermission('quotation.update')
)

// Breadcrumbs
const breadcrumb_items = computed(() => [
  { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
  { name: 'Leads & Sale', path: '/admin/leads-sale', is_clickable: false },
  { name: 'Quotations', path: '/admin/leads-sale/quotations' },
  { name: 'Preview', path: route.path, is_current: true }
])

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
  const curr = currencies.value.find(c => c.code === quotation.value?.currency)
  return curr?.symbol || '$'
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

const handleEdit = () => {
  if (quotation.value?.id) {
    router.push(`/admin/leads-sale/quotations/draft/${quotation.value.id}`)
  }
}

const goBack = () => {
  router.push('/admin/leads-sale/quotations')
}

const handlePrint = () => {
  window.print()
}

const loadData = async () => {
  isLoadingData.value = true
  try {
    const quotationId = route.params.id as string

    // Load quotation
    const quotations = await quotationStore.query({ page: 1, page_size: 1 }, [
      { field: 'id', operator: IRequestFilterOperator.EQUALS, value: quotationId }
    ])

    if (quotations?.items && quotations.items.length > 0) {
      quotation.value = quotations.items[0]

      // Load client
      if (quotation.value.client_id) {
        const clients = await clientStore.query({ page: 1, page_size: 1 }, [
          { field: 'id', operator: IRequestFilterOperator.EQUALS, value: quotation.value.client_id }
        ])
        if (clients?.items && clients.items.length > 0) {
          client.value = clients.items[0]
        }
      }

      // Load layout
      if (quotation.value.layout_id) {
        const layouts = await layoutStore.query({ page: 1, page_size: 1 }, [
          { field: 'id', operator: IRequestFilterOperator.EQUALS, value: quotation.value.layout_id }
        ])
        if (layouts?.items && layouts.items.length > 0) {
          layout.value = layouts.items[0]
        }
      }
    } else {
      toast.error('Quotation not found')
      router.push('/admin/leads-sale/quotations')
    }

    // Load currencies
    await currencyService.initialize()
    const currenciesResponse = await currencyService.getAll()
    if (currenciesResponse?.data) {
      currencies.value = currenciesResponse.data
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    router.push('/admin/leads-sale/quotations')
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
}
</style>
