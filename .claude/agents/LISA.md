# LISA.md

**LISA** (Language Integrated Service & Architecture) is your intelligent frontend development assistant for the qgen-frontend project. This file provides guidance to Claude Code (claude.ai/code) when working with the Vue 3 + TypeScript frontend codebase.

## Project Overview

**qgen-frontend** is a modern Vue 3 application built with TypeScript, providing a comprehensive admin interface with role-based access control, multi-service architecture (API and Supabase), and a clean component-based design system.

## Common Commands

### Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## Architecture Overview

### Service Layer Architecture

The frontend supports **dual service architecture** - services can connect to either:
1. **API Service** (`src/service/api/`) - REST API via Axios/HTTP
2. **Supabase Service** (`src/service/supabase/`) - Direct Supabase database connection

All services extend from `BaseService` or its implementations (`BaseApiService`, `BaseSupabaseService`).

### Layered Structure

**Views** → **Stores** (Pinia) → **Services** → **Schemas** (Yup validation)

- **Views**: Vue components in `src/views/` organized by feature
- **Stores**: Pinia stores in `src/stores/` managing state and service integration
- **Services**: Business logic and API/Supabase communication in `src/service/`
- **Schemas**: Yup validation schemas in `src/schemas/`
- **Interfaces**: TypeScript interfaces in `src/interfaces/`
- **Router**: Vue Router configuration in `src/router/`

## Creating New Features with LISA

LISA can generate complete feature modules following the established patterns. Here's the standard workflow:

### Step 1: Define the Interface

Create a new interface file in `src/interfaces/` (e.g., `product-interfaces.ts`):

```typescript
import type { IBaseEntity } from './base-interface'

// ============================================================================
// Product Base Schema
// ============================================================================

export interface IProductBase {
  name: string
  description?: string
  price: number
  category?: string
}

// ============================================================================
// Product Schemas
// ============================================================================

export interface IProduct extends IProductBase, IBaseEntity {
  // Inherits id, created_at, updated_at, is_deleted, status, version from IBaseEntity
}

export type IProductCreate = IProductBase

export interface IProductUpdate extends Partial<IProductBase> {
  updated_at?: string
  status?: string
  is_deleted?: boolean
}
```

**Export it** in `src/interfaces/index.ts`:
```typescript
export * from './product-interfaces'
```

### Step 2: Create Validation Schema

Create Yup validation schema in `src/schemas/` (e.g., `product-schemas.ts`):

```typescript
import * as yup from 'yup'
import type { TFunction } from 'i18next'

export const ProductSchema = (t: TFunction) => {
  return yup.object({
    name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(200, t('validation.string.max', { max: 200 }))
      .required(t('validation.mixed.required')),
    description: yup
      .string()
      .trim()
      .max(1000, t('validation.string.max', { max: 1000 }))
      .nullable()
      .optional(),
    price: yup
      .number()
      .min(0, t('validation.number.min', { min: 0 }))
      .required(t('validation.mixed.required')),
    category: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable()
      .optional(),
    status: yup
      .string()
      .oneOf(['active', 'inactive', 'pending'], t('validation.string.oneOf', { values: 'active, inactive, pending' }))
      .required(t('validation.mixed.required')),
  })
}

export const ProductCreateSchema = (t: TFunction) => {
  return yup.object({
    ...ProductSchema(t).fields,
  })
}

export const ProductUpdateSchema = (t: TFunction) => {
  return yup.object({
    name: yup
      .string()
      .trim()
      .min(2, t('validation.string.min', { min: 2 }))
      .max(200, t('validation.string.max', { max: 200 }))
      .optional(),
    description: yup
      .string()
      .trim()
      .max(1000, t('validation.string.max', { max: 1000 }))
      .nullable()
      .optional(),
    price: yup
      .number()
      .min(0, t('validation.number.min', { min: 0 }))
      .optional(),
    category: yup
      .string()
      .trim()
      .max(100, t('validation.string.max', { max: 100 }))
      .nullable()
      .optional(),
    status: yup
      .string()
      .oneOf(['active', 'inactive', 'pending'], t('validation.string.oneOf', { values: 'active, inactive, pending' }))
      .optional(),
  })
}
```

**Export it** in `src/schemas/index.ts`:
```typescript
export * from './product-schemas'
```

### Step 3: Create Service (API or Supabase)

#### Option A: API Service

Create in `src/service/api/` (e.g., `product-api-service.ts`):

```typescript
import type { IProduct, IRequestBaseParams } from '@/interfaces'
import { BaseApiService } from './base-api-service'
import type { Http } from '@/utils/http'

/**
 * Product API Service
 * Handles all product operations including CRUD and product management
 */
export class ProductApiService extends BaseApiService<IProduct, IRequestBaseParams> {
  protected readonly endpoint = '/products'

  constructor(httpClient: Http) {
    super(httpClient)
  }

  /**
   * Custom methods specific to products can be added here
   */
  async getByCategory(category: string): Promise<IProduct[]> {
    try {
      const response = await this.client.getInstance().get(`${this.endpoint}/category/${category}`)
      return response.data
    } catch (error) {
      throw this.createApiError(error, undefined, 'getByCategory')
    }
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; endpoint: string } {
    return {
      name: 'ProductApiService',
      description: 'API service for product management and operations',
      endpoint: this.endpoint,
    }
  }
}
```

#### Option B: Supabase Service

Create in `src/service/supabase/` (e.g., `product-supabase-service.ts`):

```typescript
import type { IProduct, IRequestBaseParams } from '@/interfaces'
import { BaseSupabaseService } from './base-supabase-service'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Product Supabase Service
 * Handles all product operations using Supabase
 */
export class ProductSupabaseService extends BaseSupabaseService<IProduct, IRequestBaseParams> {
  protected readonly tableName = 'products'

  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient)
  }

  /**
   * Custom methods specific to products can be added here
   */
  async getByCategory(category: string): Promise<IProduct[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('category', category)
      .eq('is_deleted', false)

    if (error) throw error
    return data as IProduct[]
  }

  /**
   * Get service metadata
   */
  getMetadata(): { name: string; version?: string; description?: string; table: string } {
    return {
      name: 'ProductSupabaseService',
      description: 'Supabase service for product management and operations',
      table: this.tableName,
    }
  }
}
```

**Export in appropriate index file**:
- For API: `src/service/api/index.ts`
- For Supabase: `src/service/supabase/index.ts`

### Step 4: Create Pinia Store

Create store in `src/stores/` (e.g., `product-store.ts`):

```typescript
import type { IProduct, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'

// Default parameters for product queries
const defaultProductParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'name',
  sort_dir: 'asc',
}

// Create the product store using the base store factory
export const useProductStore = createBaseStore<IProduct, IRequestBaseParams>(
  'product',
  defaultProductParams,
  'Product'
)

export type ProductStore = ReturnType<typeof useProductStore>
```

**Export it** in `src/stores/index.ts`:
```typescript
export * from './product-store'
```

### Step 5: Initialize Store in main.ts

Add store initialization to `src/main.ts`:

```typescript
import { useProductStore } from '@/stores/product-store'
import { ProductApiService } from '@/service/api/product-api-service'
// or
import { ProductSupabaseService } from '@/service/supabase/product-supabase-service'

// Initialize product store with API service
const productStore = useProductStore()
productStore.setService(new ProductApiService(http))
app.provide('productStore', productStore)

// OR with Supabase service
// productStore.setService(new ProductSupabaseService(supabase))
// app.provide('productStore', productStore)
```

### Step 6: Create Form Component

Create form component in feature views folder (e.g., `src/views/products/product-form.vue`):

```vue
<template>
  <!-- Create/Edit Product Modal -->
  <div
    v-if="open"
    class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
  >
    <div
      class="theme-modal relative w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl animate-in zoom-in-95 duration-200"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <button
          @click="close"
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
        >
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="onSubmit" class="p-4 md:p-5 space-y-4" name="productForm">
        <div v-if="hasField('name')">
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name <span class="text-red-600 dark:text-red-500">*</span>
          </label>
          <input
            v-model="name"
            type="text"
            name="name"
            id="name"
            autocomplete="off"
            :disabled="isFormReadonly || isFieldReadonly('name')"
            placeholder="Enter product name"
            :class="[
              'theme-input w-full',
              errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('name') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div v-if="hasField('description')">
          <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Description
          </label>
          <textarea
            v-model="description"
            name="description"
            id="description"
            rows="4"
            :disabled="isFormReadonly || isFieldReadonly('description')"
            placeholder="Enter product description (optional)"
            :class="[
              'theme-input w-full',
              errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('description') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
        </div>

        <div v-if="hasField('price')">
          <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Price <span class="text-red-600 dark:text-red-500">*</span>
          </label>
          <input
            v-model.number="price"
            type="number"
            step="0.01"
            name="price"
            id="price"
            :disabled="isFormReadonly || isFieldReadonly('price')"
            placeholder="0.00"
            :class="[
              'theme-input w-full',
              errors.price ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('price') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          />
          <p v-if="errors.price" class="text-red-500 text-sm mt-1">{{ errors.price }}</p>
        </div>

        <div v-if="hasField('category')">
          <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Category
          </label>
          <input
            v-model="category"
            type="text"
            name="category"
            id="category"
            :disabled="isFormReadonly || isFieldReadonly('category')"
            placeholder="Enter category (optional)"
            :class="[
              'theme-input w-full',
              errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              isFieldReadonly('category') ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            ]"
          />
          <p v-if="errors.category" class="text-red-500 text-sm mt-1">{{ errors.category }}</p>
        </div>

        <div v-if="hasField('status')">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Status <span class="text-red-600 dark:text-red-500">*</span>
          </label>
          <div class="flex items-center gap-6">
            <div v-for="statusOption in statusOptions" :key="statusOption.value" class="flex items-center space-x-3">
              <div class="flex h-6 shrink-0 items-center">
                <div class="group grid size-4 grid-cols-1">
                  <input
                    v-model="status"
                    :id="`status_${statusOption.value}`"
                    :name="`status`"
                    type="radio"
                    :value="statusOption.value"
                    :disabled="isFormReadonly || isFieldReadonly('status')"
                    class="col-start-1 row-start-1 appearance-none rounded-full border border-gray-300 bg-white checked:border-primary-500 checked:bg-primary-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto dark:border-gray-600 dark:bg-gray-700 dark:checked:border-primary-500 dark:checked:bg-primary-500 transition-all duration-200"
                  />
                  <svg class="pointer-events-none col-start-1 row-start-1 size-2 self-center justify-self-center fill-white group-has-disabled:fill-gray-950/25" viewBox="0 0 8 8" fill="none">
                    <circle class="opacity-0 group-has-[:checked]:opacity-100" cx="4" cy="4" r="3" />
                  </svg>
                </div>
              </div>
              <label :for="`status_${statusOption.value}`" class="text-sm font-medium text-gray-900 dark:text-gray-300 capitalize">
                {{ statusOption.label }}
              </label>
            </div>
          </div>
          <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
        </div>
      </form>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end p-4 md:p-5 space-x-3 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="close"
          class="theme-btn theme-btn-secondary px-5 py-2.5 capitalize focus:ring-4 focus:outline-none"
        >
          {{ isViewMode ? t('system.crud.close') : t('system.crud.cancel') }}
        </button>
        <button
          v-if="!isViewMode"
          type="submit"
          :disabled="loading || !hasPermission"
          @click="onSubmit"
          class="theme-btn theme-btn-primary px-5 py-2.5 capitalize focus:ring-4 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? t('system.crud.submitting', 'Submitting...') : t('system.crud.submit') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, type PropType, computed } from 'vue'
import { useTranslation } from 'i18next-vue'
import { useForm, useField } from 'vee-validate'
import type { IProduct, IField } from '@/interfaces'
import { ProductSchema } from '@/schemas/product-schemas'
import { useFormFields } from '@/composables/form/use-form-fields'
import { useSessionStore } from '@/stores/session-store'

const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Permission checks with hierarchy consideration
const canCreate = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('product.*') ||
  sessionStore.hasPermission('product.create')
)

const canEdit = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('product.*') ||
  sessionStore.hasPermission('product.update')
)

const canView = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('product.*') ||
  sessionStore.hasPermission('product.view')
)

const emit = defineEmits(['onClose', 'onSubmit'])

const props = defineProps({
  loading: { type: Boolean, default: false },
  open: { type: Boolean, default: false },
  product: { type: Object as PropType<IProduct | null>, default: () => null },
  fields: {
    type: Array as PropType<IField[]>,
    default: () => [
      { name: 'name' },
      { name: 'description' },
      { name: 'price' },
      { name: 'category' },
      { name: 'status' }
    ],
  },
  title: { type: String, default: 'Create Product' },
  readonly: { type: Boolean, default: false },
  mode: { type: String as PropType<'create' | 'edit' | 'view'>, default: 'create' },
})

const { loading, open, product, title, readonly, mode } = toRefs(props)

// Status options for radio buttons
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
]

// Configure fields based on mode
const configuredFields = computed(() => {
  const baseFields = [
    { name: 'name', readonly: mode.value === 'view' },
    { name: 'description', readonly: mode.value === 'view' },
    { name: 'price', readonly: mode.value === 'view' },
    { name: 'category', readonly: mode.value === 'view' },
    { name: 'status', readonly: mode.value === 'view' },
  ]
  return baseFields
})

const { hasField, isFieldReadonly } = useFormFields({ fields: configuredFields.value })

const { handleSubmit, errors, resetForm } = useForm<IProduct>({
  validationSchema: ProductSchema(t),
  initialValues: product.value || {
    name: '',
    description: '',
    price: 0,
    category: '',
    status: 'active',
  },
})

const { value: name } = useField<string>('name')
const { value: description } = useField<string>('description')
const { value: price } = useField<number>('price')
const { value: category } = useField<string>('category')
const { value: status } = useField<string>('status')

// Determine if this is create, edit, or view mode
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

const onSubmit = handleSubmit(async (values) => {
  if (!hasPermission.value) {
    return // Permission check will be handled by parent component
  }
  emit('onSubmit', values)
  clearFields()
})

const close = () => {
  emit('onClose')
  clearFields()
}

const clearFields = () => {
  resetForm({
    values: {
      name: '',
      description: '',
      price: 0,
      category: '',
      status: 'active',
    },
  })
}
</script>
```

### Step 7: Create List View Component

Create list view in feature views folder (e.g., `src/views/products/index-page.vue`):

```vue
<template>
  <LoadingComponent v-if="isLoadingData" />
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-2">
      <BreadcrumbComponents :items="breadcrumb_items" />
      
      <!-- Filter and Search Section -->
      <div class="col-span-12">
        <div class="theme-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 mb-4">
          <div class="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
            <!-- Search Input -->
            <div class="flex-1 w-full lg:w-auto">
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 capitalize">
                {{ t('system.table.search') }}
              </label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search products..."
                  class="theme-input w-full pl-10"
                />
              </div>
            </div>

            <!-- Status Filter -->
            <div class="w-full sm:w-40">
              <label for="status-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Status
              </label>
              <select id="status-filter" v-model="statusFilter" class="theme-input w-full cursor-pointer">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 w-full sm:w-auto">
              <button
                v-if="canCreate"
                type="button"
                @click="openCreateModal"
                class="theme-btn theme-btn-primary flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 h-[42px]"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- DataTable -->
      <div class="theme-card bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-600">
        <DataTable ref="table" :columns="columns" :options="tableOptions" />
      </div>
    </div>

    <!-- Create/Edit/View Product Modal -->
    <ProductForm
      :open="showModal"
      :key="showModal+modalMode+selectedProduct?.id+Date.now()"
      :loading="isSubmitting"
      :product="selectedProduct"
      :title="modalTitle"
      :mode="modalMode"
      :fields="[
        { name: 'name' },
        { name: 'description' },
        { name: 'price' },
        { name: 'category' },
        { name: 'status' }
      ]"
      @onClose="closeModal"
      @onSubmit="handleProductSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmationComponent
      :open="showDeleteConfirmation"
      :title="`Delete Product`"
      :description="`Are you sure you want to ${hardDeleteMode ? 'permanently' : 'soft'} delete '${productToDelete?.name}'? ${hardDeleteMode ? 'This action cannot be undone.' : 'You can restore it later.'}`"
      :secure-mode="true"
      confirm-button-text="Delete"
      cancel-button-text="Cancel"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
      @update:open="showDeleteConfirmation = $event"
    >
      <template #content>
        <div class="mt-4 flex items-center space-x-3">
          <div class="flex h-6 shrink-0 items-center">
            <div class="group grid size-4 grid-cols-1">
              <input
                v-model="hardDeleteMode"
                id="hardDeleteMode"
                name="hardDeleteMode"
                type="checkbox"
                class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-red-500 checked:bg-red-500 indeterminate:border-red-500 indeterminate:bg-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto dark:border-gray-600 dark:bg-gray-700 dark:checked:border-red-500 dark:checked:bg-red-500 transition-all duration-200"
              />
              <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
                <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <label for="hardDeleteMode" class="text-sm font-medium text-gray-900 dark:text-gray-300">
            Permanently delete (Hard Delete)
          </label>
        </div>
      </template>
    </ConfirmationComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject, computed } from 'vue'
import type { IProduct, IRequestFilterCondition } from '@/interfaces'
import type { IDataTableCallback } from '@/interfaces/datatables-interfaces'
import { IRequestFilterOperator } from '@/interfaces'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import 'datatables.net-buttons'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'datatables.net-buttons/js/buttons.print.js'
import LoadingComponent from '@/components/loading-component.vue'
import BreadcrumbComponents from '@/components/breadcrumb-components.vue'
import { useDataTableActionButtons, useDataTableQueryBuilder, type DataTableAction } from '@/composables/datatable'
import { useBreadcrumbs } from '@/composables/use-breadcrumbs'
import ConfirmationComponent from '@/components/confirmation-component.vue'
import ProductForm from '@/views/products/product-form.vue'
import moment from 'moment'
import { useToast } from 'vue-toastification'
import { formatErrorMessage } from '@/utils/errors'
import type { useProductStore } from '@/stores/product-store'
import { useTranslation } from 'i18next-vue'
import { useSessionStore } from '@/stores/session-store'

DataTable.use(DataTablesCore)

// DataTable parameter interface
interface DataTableParams {
  draw: number
  start: number
  length: number
  search: { value: string }
  order: Array<{ column: number; dir: 'asc' | 'desc' }>
}

const table = ref()
let dt: any
const toast = useToast()
const { t } = useTranslation()

// Session store for permissions
const sessionStore = useSessionStore()

// Inject product store
const productStore = inject<ReturnType<typeof useProductStore>>('productStore')!

// Permission checks with hierarchy consideration
const canCreate = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('product.*') ||
  sessionStore.hasPermission('product.create')
)

const canView = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('product.*') ||
  sessionStore.hasPermission('product.view')
)

const canEdit = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('product.*') ||
  sessionStore.hasPermission('product.update')
)

const canDelete = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('product.*') ||
  sessionStore.hasPermission('product.delete')
)

const canList = computed(() =>
  sessionStore.hasPermission('*') ||
  sessionStore.hasPermission('product.*') ||
  sessionStore.hasPermission('product.list')
)

// Modal state management
const showModal = ref(false)
const isSubmitting = ref(false)
const selectedProduct = ref<IProduct | null>(null)
const modalTitle = ref('Create Product')
const modalMode = ref<'create' | 'edit' | 'view'>('create')

// Delete confirmation state
const showDeleteConfirmation = ref(false)
const productToDelete = ref<IProduct | null>(null)
const hardDeleteMode = ref(false)

// DataTable loading state
const isLoadingData = ref(false)

// Filter state
const searchQuery = ref('')
const statusFilter = ref('')

// DataTable actions
const dataTableActions = ref<DataTableAction[]>([])
const eventHandlersSetUp = ref(false)

// DataTable composables
const { generateActionButtonsHtml } = useDataTableActionButtons()
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()

const columns = [
  {
    data: 'name',
    title: 'Name',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'capitalize',
  },
  {
    data: 'description',
    title: 'Description',
    exportable: true,
    orderable: true,
    visible: true,
    render: (data: string) => data || 'No description',
  },
  {
    data: 'price',
    title: 'Price',
    exportable: true,
    orderable: true,
    visible: true,
    render: (data: number) => `$${data.toFixed(2)}`,
  },
  {
    data: 'category',
    title: 'Category',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'capitalize',
    render: (data: string) => data || 'N/A',
  },
  {
    data: 'status',
    title: 'Status',
    exportable: true,
    orderable: true,
    visible: true,
    className: 'capitalize',
  },
  {
    data: 'created_at',
    title: 'Created Date',
    exportable: true,
    orderable: true,
    visible: false,
    render: (data: string) => data ? moment(data).format('DD/MM/YYYY') : 'N/A',
  },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    className: 'text-right',
    exportable: false,
    render: (data: IProduct) => generateActionButtonsHtml(data, dataTableActions.value),
  },
]

// DataTable options with server-side processing
const tableOptions: any = {
  dom: `
    <"flex flex-wrap justify-between items-center mb-4 gap-2 sm:flex-nowrap"<"flex items-center gap-2"B>>
    <"table-container overflow-auto"rt>
    <"flex items-center justify-between mt-4 gap-4"<"flex-shrink-0"l><"flex-grow flex justify-center"p><"flex-shrink-0"i>>
  `,
  searching: false,
  serverSide: true,
  name: 'products',
  processing: true,
  responsive: true,
  buttons: [
    {
      extend: 'colvis',
      columns: ':not(:last-child)',
      className: 'capitalize',
      text: t('system.table.columns'),
    },
    {
      extend: 'csvHtml5',
      text: t('system.data.exportToCSV'),
      className: 'capitalize',
      exportOptions: {
        columns: columns
          .map((col, index) => col.exportable ? index : null)
          .filter((index): index is number => index !== null)
      },
      filename: () => `products_${moment().format('YYYY-MM-DD_HH-mm')}`,
    },
  ],
  ajax: async (dtParams: any, callback: (response: IDataTableCallback<IProduct>) => void) => {
    const response = await handleFetch(dtParams)
    callback(response)
  },
  lengthMenu: [10, 25, 50, 100],
  pageLength: 10,
  select: false,
  selectable: false,
  ordering: true,
  order: [[0, 'asc']],
}

// Modal management
const openCreateModal = () => {
  if (!canCreate.value) {
    toast.error('You do not have permission to create products')
    return
  }
  selectedProduct.value = null
  modalTitle.value = 'Create Product'
  modalMode.value = 'create'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

// Delete handlers
const handleDeleteConfirm = async () => {
  if (!productToDelete.value) return

  try {
    await productStore.delete(productToDelete.value.id!, hardDeleteMode.value)
    if (table.value?.dt) {
      table.value.dt.ajax.reload()
    }
    toast.success(`Product ${hardDeleteMode.value ? 'permanently deleted' : 'soft deleted'} successfully`)
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    showDeleteConfirmation.value = false
    productToDelete.value = null
    hardDeleteMode.value = false
  }
}

const handleDeleteCancel = () => {
  showDeleteConfirmation.value = false
  productToDelete.value = null
  hardDeleteMode.value = false
}

const handleProductSubmit = async (productData: IProduct) => {
  if (selectedProduct.value && selectedProduct.value.id) {
    if (!canEdit.value) {
      toast.error('You do not have permission to update products')
      return
    }
  } else {
    if (!canCreate.value) {
      toast.error('You do not have permission to create products')
      return
    }
  }

  isSubmitting.value = true
  try {
    if (selectedProduct.value && selectedProduct.value.id) {
      await productStore.update(selectedProduct.value.id, productData)
      toast.success('Product updated successfully')
    } else {
      await productStore.create(productData)
      toast.success('Product created successfully')
    }

    if (table.value?.dt) {
      table.value.dt.ajax.reload()
    }
    closeModal()
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
  } finally {
    isSubmitting.value = false
  }
}

// DataTable fetch handler
const handleFetch = async (dtParams: DataTableParams): Promise<IDataTableCallback<IProduct>> => {
  try {
    if (!canList.value) {
      toast.error('You do not have permission to view products')
      return buildErrorResponse(dtParams.draw, 'Permission denied')
    }

    const query = buildFilterQuery(dtParams, columns, {
      include_deleted: false,
    })

    if (searchQuery.value) {
      query.search = searchQuery.value
    }

    const filters: IRequestFilterCondition[] = []

    if (statusFilter.value) {
      filters.push({
        field: 'status',
        operator: IRequestFilterOperator.EQUALS,
        value: statusFilter.value
      })
    }

    const response = await productStore.query(query, filters)

    if (response && response.items) {
      return {
        draw: dtParams.draw,
        recordsTotal: response.total || response.items.length,
        recordsFiltered: response.total || response.items.length,
        data: response.items,
      }
    }

    return buildErrorResponse(dtParams.draw, 'No data received')
  } catch (error) {
    toast.error(formatErrorMessage(error, t))
    return buildErrorResponse(dtParams.draw, error)
  }
}

// Breadcrumbs from route metadata
const { breadcrumbs: breadcrumb_items } = useBreadcrumbs()

// Set permissions for DataTable actions
const setPermissions = () => {
  if (sessionStore.hasAnyPermission(['.*', 'product.*', 'product.view'])) {
    dataTableActions.value.push('view')
  }

  if (sessionStore.hasAnyPermission(['.*', 'product.*', 'product.update'])) {
    dataTableActions.value.push('edit')
  }

  if (sessionStore.hasAnyPermission(['.*', 'product.*', 'product.delete'])) {
    dataTableActions.value.push('delete')
  }
}

watch(table, (newValue) => {
  if (newValue && newValue.dt) {
    setupEventHandlers()
  }
}, { immediate: true })

// Watch search query with debounce
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    if (dt) {
      dt.ajax.reload()
    }
  }, 500)
})

// Watch status filter
watch(statusFilter, () => {
  if (dt) {
    dt.ajax.reload()
  }
})

onMounted(() => {
  setPermissions()
})

const setupEventHandlers = () => {
  if (eventHandlersSetUp.value) {
    return
  }

  dt = table.value.dt

  if (!dt) {
    return
  }

  const setupEventHandler = (action: string, handler: (row: any) => void) => {
    dt.on('click', `button[data-action="${action}"]`, (e: any) => {
      e.preventDefault()
      const rowIndex = dt.row(e.target.closest('tr')).index()
      const row = dt.row(rowIndex).data()
      handler(row)
    })
  }

  setupEventHandler('edit', (row) => {
    if (!canEdit.value) {
      toast.error('You do not have permission to edit products')
      return
    }
    selectedProduct.value = row
    modalTitle.value = 'Edit Product'
    modalMode.value = 'edit'
    showModal.value = true
  })

  setupEventHandler('view', (row) => {
    if (!canView.value) {
      toast.error('You do not have permission to view products')
      return
    }
    selectedProduct.value = row
    modalTitle.value = 'View Product'
    modalMode.value = 'view'
    showModal.value = true
  })

  setupEventHandler('delete', (row) => {
    if (!canDelete.value) {
      toast.error('You do not have permission to delete products')
      return
    }
    productToDelete.value = row
    showDeleteConfirmation.value = true
  })

  eventHandlersSetUp.value = true
}
</script>
```

### Step 8: Add Routes

Add routes to appropriate router file (e.g., `src/router/admin-routes.ts` or create new router file):

```typescript
{
  path: 'products',
  children: [
    {
      path: '',
      component: () => import('@/views/products/index-page.vue'),
      beforeEnter: requiresPermissions,
      meta: {
        requiredPermissions: [
          '*',
          'product.*',
          'product.list'
        ],
        requiresAnyPermission: true,
        breadcrumb: [
          { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
          { name: 'Products', path: '/admin/products', is_current: true }
        ]
      }
    },
  ],
}
```

### Step 9: Add Permissions

Add product permissions to your backend's `config/permissions.json`:

```json
{
  "name": "product.*",
  "description": "All product permissions",
  "resource": "product",
  "action": "*"
},
{
  "name": "product.list",
  "description": "View list of products",
  "resource": "product",
  "action": "list"
},
{
  "name": "product.view",
  "description": "View product details",
  "resource": "product",
  "action": "view"
},
{
  "name": "product.create",
  "description": "Create new product",
  "resource": "product",
  "action": "create"
},
{
  "name": "product.update",
  "description": "Update existing product",
  "resource": "product",
  "action": "update"
},
{
  "name": "product.delete",
  "description": "Delete product",
  "resource": "product",
  "action": "delete"
}
```

## Important Patterns & Conventions

### Service Architecture Decision

**When to use API Service:**
- When you need centralized business logic on the backend
- When data needs validation/transformation on the server
- When implementing complex authorization rules
- When data comes from multiple sources
- When you need audit logging on the backend

**When to use Supabase Service:**
- For simpler CRUD operations
- When you want real-time subscriptions
- For rapid prototyping
- When backend API isn't available yet
- For client-side filtering/sorting needs

### Permission Hierarchy

Permissions follow a hierarchical pattern:
- `*` - Universal permission (super admin)
- `resource.*` - All permissions for a resource (e.g., `product.*`)
- `resource.action` - Specific action (e.g., `product.create`)

**Checking permissions:**
```typescript
// Check single permission
sessionStore.hasPermission('product.create')

// Check any of multiple permissions
sessionStore.hasAnyPermission(['product.*', 'product.create'])

// Check all permissions
sessionStore.hasAllPermissions(['product.view', 'product.update'])
```

### Form Field Configuration

Forms support dynamic field configuration:

```typescript
// All fields visible and editable
:fields="[
  { name: 'name' },
  { name: 'description' }
]"

// Some fields readonly
:fields="[
  { name: 'name' },
  { name: 'description', readonly: true }
]"

// Fields hidden in certain modes
:fields="mode === 'create' ? 
  [{ name: 'name' }, { name: 'description' }] : 
  [{ name: 'name' }, { name: 'description' }, { name: 'created_at', readonly: true }]
"
```

### DataTable Composables

**useDataTableActionButtons** - Generates action button HTML:
```typescript
const { generateActionButtonsHtml } = useDataTableActionButtons()

// In column render
render: (data: IProduct) => generateActionButtonsHtml(data, ['view', 'edit', 'delete'])
```

**useDataTableQueryBuilder** - Builds query params and filters:
```typescript
const { buildFilterQuery, buildErrorResponse } = useDataTableQueryBuilder()

// Build query from DataTable params
const query = buildFilterQuery(dtParams, columns, {
  include_deleted: false,
})

// Build error response
return buildErrorResponse(dtParams.draw, 'Error message')
```

### Theme Classes

Use theme classes for consistent styling:

**Buttons:**
- `theme-btn theme-btn-primary` - Primary action button
- `theme-btn theme-btn-secondary` - Secondary action button
- `theme-btn theme-btn-danger` - Destructive action button

**Inputs:**
- `theme-input` - Standard input field

**Cards:**
- `theme-card` - Standard card container

**Modals:**
- `theme-modal` - Standard modal container

### Translation Keys

Standard translation keys (i18next):

```typescript
t('validation.string.min', { min: 2 })
t('validation.string.max', { max: 100 })
t('validation.mixed.required')
t('validation.number.min', { min: 0 })
t('validation.string.oneOf', { values: 'active, inactive' })

t('system.crud.create')
t('system.crud.update')
t('system.crud.delete')
t('system.crud.submit')
t('system.crud.cancel')
t('system.crud.close')

t('system.table.search')
t('system.table.columns')
t('system.data.exportToCSV')
t('system.data.exportToPrint')
```

### Error Handling

Use the `formatErrorMessage` utility for consistent error display:

```typescript
import { formatErrorMessage } from '@/utils/errors'

try {
  // operation
} catch (error) {
  toast.error(formatErrorMessage(error, t))
}
```

### Store Injection Pattern

Stores are provided at the app level and injected in components:

```typescript
// In main.ts
app.provide('productStore', productStore)

// In component
const productStore = inject<ReturnType<typeof useProductStore>>('productStore')!
```

## Common Gotchas

1. **Store initialization**: Always set service before using store operations
2. **Permission checks**: Check permissions before rendering buttons/forms
3. **Form validation**: Use Yup schemas with i18n for translatable errors
4. **DataTable reloading**: Call `table.value.dt.ajax.reload()` after mutations
5. **Modal keys**: Use dynamic keys to force re-render: `:key="showModal+modalMode+selectedItem?.id+Date.now()"`
6. **Service type**: Decide early whether to use API or Supabase service
7. **Readonly fields**: Some fields should always be readonly (e.g., `is_system_defined`)
8. **Event handlers**: Prevent duplicate event handler setup with `eventHandlersSetUp` flag
9. **Search debounce**: Use debounced search to prevent excessive API calls
10. **Hard delete**: Always confirm with user and provide checkbox option

## LISA Quick Commands

When you ask LISA to create a new feature, use this format:

**Example:**
```
LISA, create a Product module with:
- Interface with name, description, price, category fields
- API service (or Supabase service)
- Yup validation schema
- Pinia store
- Form component with create/edit/view modes
- List view with DataTable
- Routes under /admin/products
- Permissions: product.list, product.view, product.create, product.update, product.delete
```

LISA will generate all necessary files following the patterns described in this document.

## File Naming Conventions

- **Interfaces**: `{entity}-interfaces.ts` (e.g., `product-interfaces.ts`)
- **Schemas**: `{entity}-schemas.ts` (e.g., `product-schemas.ts`)
- **API Services**: `{entity}-api-service.ts` (e.g., `product-api-service.ts`)
- **Supabase Services**: `{entity}-supabase-service.ts` (e.g., `product-supabase-service.ts`)
- **Stores**: `{entity}-store.ts` (e.g., `product-store.ts`)
- **Views**: `{entity}/index-page.vue` for list, `{entity}-form.vue` for form
- **Routes**: Add to existing route files or create `{entity}-routes.ts`

## Component Libraries

The project uses:
- **DataTables.net** - Server-side tables with sorting, filtering, pagination
- **VeeValidate** - Form validation with Yup
- **Vue Toastification** - Toast notifications
- **Heroicons** - Icon library (via composable)
- **Tailwind CSS** - Utility-first styling
- **i18next** - Internationalization

## Development Workflow

1. Create interface and export
2. Create Yup schema and export
3. Create service (API or Supabase) and export
4. Create Pinia store and export
5. Initialize store in main.ts
6. Create form component
7. Create list view component
8. Add routes with permissions
9. Add permissions to backend
10. Test CRUD operations
11. Test permissions

---

**LISA is ready to assist you in building consistent, maintainable, and permission-aware frontend features following the qgen-frontend architecture patterns.**
