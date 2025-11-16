import type { IFiltersRequest, IDataTableCallback  } from '@/types'

interface DataTableParams {
  start: number
  length: number
  search: { value: string }
  order: Array<{ column: number; dir: 'asc' | 'desc' }>
}

export function useDataTableQueryBuilder() {
  const extractPageInfo = (params: DataTableParams) => ({
    page: Math.floor(params.start / params.length) + 1,
    page_size: params.length,
    size: params.length,
  })

  const extractSearchInfo = (params: DataTableParams) => ({
    search: params.search?.value || '',
  })

  const extractSortInfo = (params: DataTableParams, columns: any[]) => {
    const order = params.order?.[0]
    if (!order?.column) return {}

    const columnData = columns[order.column]?.data
    if (!columnData) return {}

    return {
      sort_by: columnData,
      sort_field: columnData,
      sort_direction: order.dir,
    }
  }

  const buildFilterQuery = (
    dtParams: DataTableParams,
    columns: any[],
    options: Partial<IFiltersRequest> = {},
  ): IFiltersRequest => {
    const defaultValues = {
      include_deleted: false,
      sort_direction: 'asc' as const,
      sort_field: '',
      sort_by: '',
    }

    const query = {
      ...defaultValues,
      ...extractPageInfo(dtParams),
      ...extractSearchInfo(dtParams),
      ...extractSortInfo(dtParams, columns),
      ...options,
    }

    return query as IFiltersRequest
  }

  const buildErrorResponse = <T>(draw: number, error: unknown): IDataTableCallback<T> => ({
    draw,
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
    error: error instanceof Error ? error.message : 'Unknown error occurred',
  })

  return {
    buildFilterQuery,
    buildErrorResponse,
  }
}
