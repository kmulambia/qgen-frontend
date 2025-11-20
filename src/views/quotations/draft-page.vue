<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-4">
      <BreadcrumbComponents :items="breadcrumb_items" />

      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        <div class="p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row items-start justify-between gap-6">
            <!-- Quotation Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {{ quotationId ? `Edit Estimate #${formData.quotation_number || quotationId}` : 'Draft Estimate' }}
                </h1>
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset',
                    formData.quotation_status === 'draft' ? 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/20 dark:text-gray-400 dark:ring-gray-400/30' : '',
                    formData.quotation_status === 'approved' ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/30' : '',
                    formData.quotation_status === 'sent' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-400/30' : ''
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full mr-1.5',
                      formData.quotation_status === 'draft' ? 'bg-gray-500' : '',
                      formData.quotation_status === 'approved' ? 'bg-blue-500' : '',
                      formData.quotation_status === 'sent' ? 'bg-green-500' : ''
                    ]"
                  ></span>
                  {{ formData.quotation_status === 'draft' ? 'Draft' : formData.quotation_status === 'approved' ? 'Approved' : 'Sent' }}
                </span>
              </div>

              <div class="flex flex-col gap-2">
                <p v-if="formData.title" class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ formData.title }}
                </p>
                <div class="flex items-center gap-4 text-sm">
                  <span v-if="selectedClient" class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {{ selectedClient.company_name }}
                  </span>
                  <span v-if="formData.quotation_date" class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formData.quotation_date }}
                  </span>
                  <span v-if="calculatedTotal > 0" class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ currencySymbol }}{{ formatNumber(calculatedTotal.toFixed(2)) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 self-start">
              <button
                type="button"
                @click="handlePreview"
                class="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
              >
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>

              <!-- Draft Status: Save & Approve & Send buttons -->
              <template v-if="formData.quotation_status === 'draft' || formData.quotation_status === 'approved'">
                <button
                  type="button"
                  @click="handleSaveDraft"
                  :disabled="isSaving"
                  class="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="!isSaving" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSaving ? 'Saving...' : 'Save Draft' }}
                </button>
                <button
                  type="button"
                  @click="openApproveConfirmation"
                  :disabled="isSaving || !quotationId"
                  class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="!isSaving" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSaving ? 'Sending...' : 'Approve & Send' }}
                </button>
              </template>

              <!-- Sent Status: Resend button -->
              <template v-if="formData.quotation_status === 'sent'">
                <button
                  type="button"
                  @click="openResendConfirmation"
                  :disabled="isSaving"
                  class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="!isSaving" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSaving ? 'Resending...' : 'Resend Email' }}
                </button>
                <span v-if="formData.sent_at" class="inline-flex items-center px-4 py-2.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sent: {{ formatDate(formData.sent_at) }}
                </span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleSaveDraft" class="space-y-4">
        <!-- Business Address and Contact Details Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="toggleSection('business')"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Business address and contact details, title, summary, and logo
            </span>
            <svg
              :class="['w-5 h-5 text-gray-500 transition-transform', expandedSections.business ? 'rotate-180' : '']"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-show="expandedSections.business" class="p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700">
            <!-- Layout Selection -->
            <div class="mb-6">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Layout <span class="text-red-600 dark:text-red-500">*</span>
              </label>
              <select
                v-model="formData.layout_id"
                @change="onLayoutChange"
                :disabled="isFormDisabled"
                :class="[
                  'theme-input w-full max-w-md',
                  errors.layout_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
                  isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''
                ]"
              >
                <option value="">Choose a layout</option>
                <option v-for="layout in layouts" :key="layout.id" :value="layout.id">
                  {{ layout.name }}
                </option>
              </select>
              <p v-if="errors.layout_id" class="text-red-500 text-sm mt-1">{{ errors.layout_id }}</p>
            </div>

            <!-- Layout Preview Header -->
            <div v-if="selectedLayout" class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
              <div class="flex items-start gap-6">
                <!-- Logo Preview -->
                <div class="relative flex-shrink-0">
                  <div v-if="selectedLayout.logo_file?.url" class="w-20 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-900 shadow-md">
                    <img
                      :src="selectedLayout.logo_file.url"
                      :alt="selectedLayout.name"
                      class="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div v-else class="w-20 h-20 rounded-lg bg-gradient-to-br from-primary via-primary-600 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-md ring-2 ring-primary-200 dark:ring-primary-900/30">
                    {{ getInitials(selectedLayout.company_name) }}
                  </div>
                </div>

                <!-- Layout Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {{ selectedLayout.company_name || 'UMODZI SOURCE' }}
                      </h3>
                      <p v-if="selectedLayout.description" class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {{ selectedLayout.description }}
                      </p>

                      <div class="space-y-1 text-sm">
                        <p v-if="selectedLayout.email" class="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {{ selectedLayout.email }}
                        </p>
                        <p v-if="selectedLayout.phone" class="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {{ selectedLayout.phone }}
                        </p>
                        <p v-if="selectedLayout.address" class="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {{ selectedLayout.address }}
                        </p>
                      </div>
                    </div>

                    <!-- Quotation Label -->
                    <div class="text-right">
                      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Quotation</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-sm text-gray-500 dark:text-gray-400">Please select a layout to preview your quotation header</p>
            </div>
          </div>
        </div>

        <!-- Bill To Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Client Selection -->
            <div>
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Bill to</h3>

              <div v-if="selectedClient" class="space-y-2">
                <p class="font-semibold text-gray-900 dark:text-white">{{ selectedClient.company_name }}</p>
                <p v-if="selectedClient.email" class="text-sm text-gray-600 dark:text-gray-400">{{ selectedClient.email }}</p>
                <p v-if="selectedClient.phone" class="text-sm text-gray-600 dark:text-gray-400">{{ selectedClient.phone }}</p>
                <p v-if="selectedClient.address_line1 || selectedClient.city" class="text-sm text-gray-600 dark:text-gray-400">
                  {{ selectedClient.address_line1 }}{{ selectedClient.address_line2 ? ', ' + selectedClient.address_line2 : '' }}{{ selectedClient.city ? ', ' + selectedClient.city : '' }}{{ selectedClient.country ? ', ' + selectedClient.country : '' }}
                </p>
                <button
                  type="button"
                  @click="openClientModal"
                  :disabled="isFormDisabled"
                  class="text-sm text-primary hover:text-primary-dark font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Choose a different customer
                </button>
              </div>

              <div v-else>
                <button
                  type="button"
                  @click="openClientModal"
                  :disabled="isFormDisabled"
                  :class="[
                    'w-full px-4 py-2 border-2 border-dashed rounded-lg text-sm font-medium transition-colors',
                    errors.client_id
                      ? 'border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                    isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''
                  ]"
                >
                  Select a client <span class="text-red-600 dark:text-red-500">*</span>
                </button>
                <p v-if="errors.client_id" class="text-red-500 text-sm mt-1">{{ errors.client_id }}</p>
              </div>
            </div>

            <!-- Quotation Details -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Estimate number</label>
                <input
                  v-model="formData.quotation_number"
                  type="text"
                  class="theme-input w-40 text-right"
                  readonly
                />
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Date <span class="text-red-600">*</span></label>
                <input
                  v-model="formData.quotation_date"
                  type="date"
                  :disabled="isFormDisabled"
                  :class="[
                    'theme-input w-40 text-right',
                    errors.quotation_date ? 'border-red-300' : '',
                    isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''
                  ]"
                />
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Valid until <span class="text-red-600">*</span></label>
                <input
                  v-model="formData.valid_until"
                  type="date"
                  :disabled="isFormDisabled"
                  :class="[
                    'theme-input w-40 text-right',
                    errors.valid_until ? 'border-red-300' : '',
                    isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''
                  ]"
                />
              </div>

              <div v-if="formData.quotation_date && formData.valid_until" class="text-xs text-gray-500 dark:text-gray-400 text-right">
                Within {{ calculateDaysValid }} days
              </div>
            </div>
          </div>
        </div>

        <!-- Title Input (top level) -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Title <span class="text-red-600 dark:text-red-500">*</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            id="title"
            placeholder="Enter quotation title"
            :disabled="isFormDisabled"
            :class="[
              'theme-input w-full',
              errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFormDisabled ? 'opacity-60 cursor-not-allowed' : ''
            ]"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
        </div>

        <!-- Client Selection Modal -->
        <div
          v-if="showClientModal"
          class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          @click.self="closeClientModal"
        >
          <div class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Select Client</h3>
              <button
                @click="closeClientModal"
                type="button"
                class="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
              </button>
            </div>

            <!-- Search -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <input
                v-model="clientSearchQuery"
                type="text"
                placeholder="Search clients..."
                class="theme-input w-full"
                autofocus
              />
            </div>

            <!-- Client List -->
            <div class="max-h-96 overflow-y-auto">
              <div
                v-for="client in filteredClients"
                :key="client.id"
                @click="selectClient(client)"
                class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors"
              >
                <p class="font-medium text-gray-900 dark:text-white">{{ client.company_name }}</p>
                <p v-if="client.email" class="text-sm text-gray-600 dark:text-gray-400">{{ client.email }}</p>
              </div>
              <div v-if="filteredClients.length === 0" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No clients found
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="closeClientModal"
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Line Items Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Line Items <span class="text-red-600 dark:text-red-500">*</span>
            </h2>
            <button
              type="button"
              @click="addItem"
              :disabled="isFormDisabled"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </button>
          </div>

          <div v-if="!formData.items || formData.items.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No items added yet. Click "Add Item" to start.
          </div>

          <div v-if="formData.items && formData.items.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-24">
                    Quantity
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-32">
                    Price
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-32">
                    Amount
                  </th>
                  <th class="px-3 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-16">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in formData.items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-3 py-2">
                    <textarea
                      v-model="item.description"
                      rows="2"
                      placeholder="Enter item description"
                      :disabled="isFormDisabled"
                      class="theme-input w-full text-sm"
                    ></textarea>
                  </td>
                  <td class="px-3 py-2">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      :disabled="isFormDisabled"
                      class="theme-input w-full text-sm"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <input
                      v-model.number="item.unit_price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      :disabled="isFormDisabled"
                      class="theme-input w-full text-sm"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <input
                      :value="formatNumber((item.quantity * item.unit_price).toFixed(2))"
                      type="text"
                      disabled
                      class="theme-input w-full text-sm bg-gray-100 dark:bg-gray-700 font-medium"
                    />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <button
                      type="button"
                      @click="removeItem(index)"
                      :disabled="isFormDisabled"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove item"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="errors.items" class="text-red-500 text-sm mt-1">{{ errors.items }}</p>
        </div>

        <!-- Financial Information Section -->
        <div class="theme-card bg-white dark:bg-gray-800 p-6 border border-gray-300 dark:border-gray-600">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
            Financial Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="currency" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Currency
              </label>
              <select
                v-model="formData.currency"
                id="currency"
                :disabled="isFormDisabled"
                class="theme-input w-full"
              >
                <option value="">Select currency</option>
                <option v-for="curr in currencies" :key="curr.code" :value="curr.code">
                  {{ curr.code }} - {{ curr.name }}
                </option>
              </select>
            </div>

            <div>
              <label for="discount_percentage" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Discount (%)
              </label>
              <input
                v-model.number="formData.discount_percentage"
                type="number"
                id="discount_percentage"
                min="0"
                max="100"
                step="0.01"
                placeholder="0"
                :disabled="isFormDisabled"
                class="theme-input w-full"
              />
            </div>

            <div>
              <label for="tax_percentage" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tax (%)
              </label>
              <input
                v-model.number="formData.tax_percentage"
                type="number"
                id="tax_percentage"
                min="0"
                max="100"
                step="0.01"
                placeholder="0"
                :disabled="isFormDisabled"
                class="theme-input w-full"
              />
            </div>
          </div>

          <!-- Calculation Summary -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-700 dark:text-gray-300">Subtotal:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ currencySymbol }}{{ formatNumber(calculatedSubtotal.toFixed(2)) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-700 dark:text-gray-300">Discount ({{ formData.discount_percentage || 0 }}%):</span>
              <span class="font-medium text-gray-900 dark:text-white">-{{ currencySymbol }}{{ formatNumber(calculatedDiscount.toFixed(2)) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-700 dark:text-gray-300">Tax ({{ formData.tax_percentage || 0 }}%):</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ currencySymbol }}{{ formatNumber(calculatedTax.toFixed(2)) }}</span>
            </div>
            <div class="flex justify-between text-lg font-semibold border-t border-gray-300 dark:border-gray-600 pt-2">
              <span class="text-gray-900 dark:text-white">Total:</span>
              <span class="text-gray-900 dark:text-white">{{ currencySymbol }}{{ formatNumber(calculatedTotal.toFixed(2)) }}</span>
            </div>
          </div>
        </div>

        <!-- Additional Information Section -->
        <div class="theme-card bg-white dark:bg-gray-800 p-6 border border-gray-300 dark:border-gray-600">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
            Additional Information
          </h2>

          <div class="space-y-4">
            <div>
              <label for="notes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Notes
              </label>
              <textarea
                v-model="formData.notes"
                id="notes"
                rows="3"
                placeholder="Enter any additional notes"
                :disabled="isFormDisabled"
                class="theme-input w-full"
              ></textarea>
            </div>

            <div>
              <label for="terms_conditions" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Terms & Conditions
              </label>
              <textarea
                v-model="formData.terms_conditions"
                id="terms_conditions"
                rows="4"
                placeholder="Enter terms and conditions"
                :disabled="isFormDisabled"
                class="theme-input w-full"
              ></textarea>
            </div>
          </div>
        </div>
      </form>

      <!-- Preview Modal Component -->
      <QuotationPreviewModal
        :open="showPreviewModal"
        :quotation="formData"
        :client="selectedClient"
        :layout="selectedLayout"
        :currencies="currencies"
        @close="closePreviewModal"
      />

      <!-- Approve Confirmation Dialog -->
      <ConfirmationComponent
        :open="showApproveConfirmation"
        title="Approve & Send Quotation"
        :description="`Are you sure you want to approve and send this quotation to ${selectedClient?.company_name || 'the client'}? An email will be sent with a secure link.`"
        :secure-mode="true"
        confirm-button-text="Approve & Send"
        cancel-button-text="Cancel"
        @confirm="handleApproveConfirm"
        @cancel="handleApproveCancel"
        @update:open="showApproveConfirmation = $event"
      />

      <!-- Resend Confirmation Dialog -->
      <ConfirmationComponent
        :open="showResendConfirmation"
        title="Resend Quotation Email"
        :description="`Are you sure you want to resend this quotation to ${selectedClient?.company_name || 'the client'}? A new email will be sent with the secure link.`"
        :secure-mode="true"
        confirm-button-text="Resend Email"
        cancel-button-text="Cancel"
        @confirm="handleResendConfirm"
        @cancel="handleResendCancel"
        @update:open="showResendConfirmation = $event"
      />
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
import QuotationPreviewModal from '@/views/quotations/quotation-preview-modal.vue'
import ConfirmationComponent from '@/components/confirmation-component.vue'
import { formatErrorMessage } from '@/utils/errors'
import { formatNumber } from '@/utils/formatters'
import moment from 'moment'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useTranslation()

// Inject stores
const quotationStore = inject<ReturnType<typeof useQuotationStore>>('quotationStore')!
const clientStore = inject<ReturnType<typeof useClientStore>>('clientStore')!
const layoutStore = inject<ReturnType<typeof useLayoutStore>>('layoutStore')!
const currencyService = new CurrencyService()

// State
const isLoadingData = ref(false)
const isSaving = ref(false)
const quotationId = ref<string | null>(null)
const clients = ref<IClient[]>([])
const layouts = ref<ILayout[]>([])
const currencies = ref<ICurrency[]>([])
const errors = ref<Record<string, string>>({})

// UI State
const showClientModal = ref(false)
const showPreviewModal = ref(false)
const showApproveConfirmation = ref(false)
const showResendConfirmation = ref(false)
const clientSearchQuery = ref('')
const selectedClient = ref<IClient | null>(null)
const selectedLayout = ref<ILayout | null>(null)
const expandedSections = ref({
  business: true,
  items: true,
  financial: true,
  additional: true
})

// Form data
const formData = ref<Partial<IQuotation>>({
  title: '',
  description: '',
  client_id: '',
  layout_id: '',
  quotation_date: new Date().toISOString().split('T')[0],
  valid_until: '',
  items: [],
  currency: 'MWK',
  discount_percentage: 0,
  tax_percentage: 16.5,
  notes: '',
  terms_conditions: '',
  quotation_status: 'draft',
  quotation_number: '',
})

// Breadcrumbs
const breadcrumb_items = computed(() => {
  const items = [
    { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
    { name: 'Leads & Sale', path: '/admin/leads-sale', is_clickable: false },
    { name: 'Quotations', path: '/admin/leads-sale/quotations' }
  ]

  if (quotationId.value) {
    items.push({ name: 'Draft', path: route.path })
  } else {
    items.push({ name: 'Draft', path: route.path })
  }

  return items
})

// Calculated values
const calculatedSubtotal = computed(() => {
  return formData.value.items?.reduce((sum, item) => {
    return sum + (item.quantity * item.unit_price)
  }, 0) || 0
})

const calculatedDiscount = computed(() => {
  return calculatedSubtotal.value * ((formData.value.discount_percentage || 0) / 100)
})

const calculatedTax = computed(() => {
  const afterDiscount = calculatedSubtotal.value - calculatedDiscount.value
  return afterDiscount * ((formData.value.tax_percentage || 0) / 100)
})

const calculatedTotal = computed(() => {
  return calculatedSubtotal.value - calculatedDiscount.value + calculatedTax.value
})

const currencySymbol = computed(() => {
  const curr = currencies.value.find(c => c.code === formData.value.currency)
  return curr?.symbol || '$'
})

const calculateDaysValid = computed(() => {
  if (!formData.value.quotation_date || !formData.value.valid_until) {
    return 0
  }
  const start = new Date(formData.value.quotation_date)
  const end = new Date(formData.value.valid_until)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

const isFormDisabled = computed(() => {
  return formData.value.quotation_status === 'approved' || formData.value.quotation_status === 'sent'
})

const filteredClients = computed(() => {
  if (!clientSearchQuery.value) {
    return clients.value
  }
  const query = clientSearchQuery.value.toLowerCase()
  return clients.value.filter(client =>
    client.company_name?.toLowerCase().includes(query) ||
    client.email?.toLowerCase().includes(query)
  )
})

// Methods
const toggleSection = (section: string) => {
  expandedSections.value[section as keyof typeof expandedSections.value] = !expandedSections.value[section as keyof typeof expandedSections.value]
}

const getInitials = (name?: string) => {
  if (!name) return 'U'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)
}

const onLayoutChange = () => {
  selectedLayout.value = layouts.value.find(l => l.id === formData.value.layout_id) || null
}

const openClientModal = () => {
  showClientModal.value = true
  clientSearchQuery.value = ''
}

const closeClientModal = () => {
  showClientModal.value = false
  clientSearchQuery.value = ''
}

const selectClient = (client: IClient) => {
  selectedClient.value = client
  formData.value.client_id = client.id!
  closeClientModal()
}

const addItem = () => {
  if (!formData.value.items) {
    formData.value.items = []
  }
  formData.value.items.push({
    description: '',
    quantity: 1,
    unit_price: 0,
    unit: 'unit',
    notes: '',
  })
}

const removeItem = (index: number) => {
  formData.value.items?.splice(index, 1)
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.title) {
    errors.value.title = 'Title is required'
  }

  if (!formData.value.client_id) {
    errors.value.client_id = 'Client is required'
  }

  if (!formData.value.layout_id) {
    errors.value.layout_id = 'Layout is required'
  }

  if (!formData.value.quotation_date) {
    errors.value.quotation_date = 'Quotation date is required'
  }

  if (!formData.value.valid_until) {
    errors.value.valid_until = 'Valid until date is required'
  }

  if (!formData.value.items || formData.value.items.length === 0) {
    errors.value.items = 'At least one item is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSaveDraft = async () => {
  if (!validateForm()) {
    toast.error('Please fill in all required fields')
    return
  }

  isSaving.value = true
  try {
    // Ensure items have calculated totals
    const processedItems = (formData.value.items || []).map(item => ({
      description: item.description,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      unit: item.unit || 'unit',
      notes: item.notes || '',
      total: Number(item.quantity) * Number(item.unit_price)
    }))

    const dataToSave: Partial<IQuotation> = {
      title: formData.value.title,
      description: formData.value.description,
      client_id: formData.value.client_id,
      layout_id: formData.value.layout_id,
      quotation_date: formData.value.quotation_date,
      valid_until: formData.value.valid_until,
      items: processedItems,
      currency: formData.value.currency,
      discount_percentage: Number(formData.value.discount_percentage) || 0,
      tax_percentage: Number(formData.value.tax_percentage) || 0,
      notes: formData.value.notes,
      terms_conditions: formData.value.terms_conditions,
      quotation_status: 'draft',
      quotation_number: formData.value.quotation_number,
      subtotal: parseFloat(calculatedSubtotal.value.toFixed(2)),
      discount_amount: parseFloat(calculatedDiscount.value.toFixed(2)),
      tax_amount: parseFloat(calculatedTax.value.toFixed(2)),
      total: parseFloat(calculatedTotal.value.toFixed(2)),
    }

    if (quotationId.value) {
      await quotationStore.update(quotationId.value, dataToSave)
      toast.success('Draft saved successfully')
    } else {
      const created = await quotationStore.create(dataToSave)
      toast.success('Draft saved successfully')
      if (created?.id) {
        quotationId.value = created.id
        formData.value = { ...formData.value, ...created }
      }
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isSaving.value = false
  }
}

const openApproveConfirmation = () => {
  if (!quotationId.value) {
    // Save draft first if no ID
    handleSaveDraft().then(() => {
      if (quotationId.value) {
        showApproveConfirmation.value = true
      }
    })
    return
  }
  showApproveConfirmation.value = true
}

const handleApproveCancel = () => {
  showApproveConfirmation.value = false
}

const handleApproveConfirm = async () => {
  showApproveConfirmation.value = false

  if (!quotationId.value) {
    toast.error('Please save the quotation first')
    return
  }

  // Ensure form is saved first
  if (!validateForm()) {
    toast.error('Please fill in all required fields before sending')
    return
  }

  // Save draft first to ensure all data is up to date
  await handleSaveDraft()

  if (!quotationId.value) {
    toast.error('Failed to save quotation. Please try again.')
    return
  }

  isSaving.value = true
  try {
    // Use approve API endpoint which sends the quotation
    const result = await quotationStore.approve(quotationId.value)

    // Update form data with response
    formData.value = {
      ...formData.value,
      ...result,
      quotation_date: result.quotation_date?.split('T')[0] || formData.value.quotation_date,
      valid_until: result.valid_until?.split('T')[0] || formData.value.valid_until,
    }

    toast.success('Quotation approved and sent to client successfully')

    // Redirect to quotations list after sending
    setTimeout(() => {
      router.push('/admin/leads-sale/quotations')
    }, 1500)
  } catch (error: any) {
    console.error('Error approving quotation:', error)
    if (error.message?.includes('email')) {
      toast.error('Cannot send quotation: Client email address is required. Please add an email to the client profile.')
    } else if (error.message?.includes('status')) {
      toast.error('Quotation cannot be approved in its current status')
    } else {
      toast.error(formatErrorMessage(error, t))
    }
  } finally {
    isSaving.value = false
  }
}

const openResendConfirmation = () => {
  showResendConfirmation.value = true
}

const handleResendCancel = () => {
  showResendConfirmation.value = false
}

const handleResendConfirm = async () => {
  showResendConfirmation.value = false

  if (!quotationId.value) {
    toast.error('Quotation ID is missing')
    return
  }

  isSaving.value = true
  try {
    // Use resend API endpoint
    const result = await quotationStore.resend(quotationId.value)

    // Update form data with response
    formData.value = {
      ...formData.value,
      ...result,
      quotation_date: result.quotation_date?.split('T')[0] || formData.value.quotation_date,
      valid_until: result.valid_until?.split('T')[0] || formData.value.valid_until,
    }

    toast.success('Quotation email resent to client successfully')
  } catch (error: any) {
    console.error('Error resending quotation:', error)
    if (error.message?.includes('email')) {
      toast.error('Cannot resend quotation: Client email address is required. Please add an email to the client profile.')
    } else {
      toast.error(formatErrorMessage(error, t))
    }
  } finally {
    isSaving.value = false
  }
}

// Helper function to format date
const formatDate = (date?: string | null) => {
  if (!date) return 'N/A'
  return moment(date).format('DD/MM/YYYY HH:mm')
}

const handlePreview = () => {
  showPreviewModal.value = true
}

const closePreviewModal = () => {
  showPreviewModal.value = false
}

const loadData = async () => {
  isLoadingData.value = true
  try {
    // Load clients
    const clientsResponse = await clientStore.query({ page: 1, page_size: 1000 })
    if (clientsResponse?.items) {
      clients.value = clientsResponse.items
    }

    // Load layouts
    const layoutsResponse = await layoutStore.query({ page: 1, page_size: 1000 })
    if (layoutsResponse?.items) {
      layouts.value = layoutsResponse.items
    }

    // Load currencies
    await currencyService.initialize()
    const currenciesResponse = await currencyService.getAll()
    if (currenciesResponse?.data) {
      currencies.value = currenciesResponse.data
    }

    // Load quotation if editing
    if (route.params.id) {
      quotationId.value = route.params.id as string
      const quotations = await quotationStore.query({ page: 1, page_size: 1 }, [
        { field: 'id', operator: IRequestFilterOperator.EQUALS, value: quotationId.value }
      ])
      if (quotations?.items && quotations.items.length > 0) {
        const quotation = quotations.items[0]
        formData.value = {
          ...quotation,
          quotation_date: quotation.quotation_date?.split('T')[0] || '',
          valid_until: quotation.valid_until?.split('T')[0] || '',
        }

        // Load selected client
        if (formData.value.client_id) {
          selectedClient.value = clients.value.find(c => c.id === formData.value.client_id) || null
        }

        // Load selected layout
        if (formData.value.layout_id) {
          selectedLayout.value = layouts.value.find(l => l.id === formData.value.layout_id) || null
        }
      }
    }
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isLoadingData.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
