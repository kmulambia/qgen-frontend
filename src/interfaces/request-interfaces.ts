export type SortDir = 'asc' | 'desc'

export enum IRequestFilterOperator {
  EQUALS = "eq",
  NOT_EQUALS = "neq",
  GREATER_THAN = "gt",
  LESS_THAN = "lt",
  GREATER_THAN_EQUALS = "gte",
  LESS_THAN_EQUALS = "lte",
  LIKE = "like",
  IN = "in",
  NOT_IN = "not_in",
  IS_NULL = "is_null",
  IS_NOT_NULL = "is_not_null"
}

export interface IRequestFilterCondition {
  field: string;
  operator: IRequestFilterOperator;
  value: string | number | boolean;
  type?: string | null | undefined;
}

export interface IRequestBaseParams {
  search?: string
  page?: number
  page_size?: number
  sort_by?: string | null
  sort_dir?: SortDir | null
}

export interface IResponsePaginatedResult<T> {
  items: T[]
  total: number
}

export type IRequestQueryParams<F extends IRequestBaseParams> = F
