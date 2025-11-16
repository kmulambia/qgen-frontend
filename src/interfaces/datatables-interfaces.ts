export interface IDataTableColumn {
  title: string
  data: string
  render?: (data: unknown) => string
  className?: string
  orderable?: boolean
  searchable?: boolean
}

export interface IDataTableCallback<T> {
  draw: number
  recordsTotal: number
  recordsFiltered: number
  data: T[]
  error?: string
}
