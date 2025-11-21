import type { IQuotation, IRequestBaseParams } from '@/interfaces'
import { createBaseStore } from './base-store'
import { QuotationApiService } from '@/service/api/quotation-api-service'
import type { Http } from '@/utils/http'

// Default parameters for quotation queries
const defaultQuotationParams: IRequestBaseParams = {
  page: 1,
  page_size: 10,
  search: '',
  sort_by: 'quotation_date',
  sort_dir: 'desc',
}

// Create the base quotation store
const baseQuotationStore = createBaseStore<IQuotation, IRequestBaseParams>(
  'quotation',
  defaultQuotationParams,
  'Quotation'
)

// Extend the base store with quotation-specific actions
export const useQuotationStore = () => {
  const store = baseQuotationStore()

  // Add custom approve, resend, and getPublic actions
  return {
    ...store,

    // Explicitly delegate setService to ensure it works in production builds
    setService(service: QuotationApiService) {
      store.setService(service)
    },

    // Explicit getter for _service to ensure it accesses the store's state directly
    get _service() {
      return store._service
    },

    /**
     * Approve quotation and send to client
     */
    async approve(quotationId: string, message?: string): Promise<IQuotation> {
      store.ensureServiceInitialized()
      store.clearError()

      try {
        store.isLoading = true
        const service = store._service as unknown as QuotationApiService
        if (typeof service.approve === 'function') {
          const result = await service.approve(quotationId, message)
          return result
        }
        throw new Error('approve method not available on quotation service')
      } catch (error: any) {
        store.setError(error)
        throw error
      } finally {
        store.isLoading = false
      }
    },

    /**
     * Resend quotation email to client
     */
    async resend(quotationId: string, message?: string): Promise<IQuotation> {
      store.ensureServiceInitialized()
      store.clearError()

      try {
        store.isLoading = true
        const service = store._service as unknown as QuotationApiService
        if (typeof service.resend === 'function') {
          const result = await service.resend(quotationId, message)
          return result
        }
        throw new Error('resend method not available on quotation service')
      } catch (error: any) {
        store.setError(error)
        throw error
      } finally {
        store.isLoading = false
      }
    },

    /**
     * Get public quotation by token (no authentication required)
     */
    async getPublic(token: string): Promise<IQuotation> {
      store.clearError()

      try {
        store.isLoading = true

        // Create a temporary service instance for public access
        const service = store._service
        if (!service) {
          throw new Error('Service not initialized')
        }
        const httpClient = service.getClient() as Http
        if (!httpClient) {
          throw new Error('HTTP client not initialized')
        }

        const publicService = new QuotationApiService(httpClient)
        const result = await publicService.getPublic(token)

        return result
      } catch (error: any) {
        store.setError(error)
        throw error
      } finally {
        store.isLoading = false
      }
    },
  }
}

export type QuotationStore = ReturnType<typeof useQuotationStore>
