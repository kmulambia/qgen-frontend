export interface IBreadcrumbItem {
  name: string
  path?: string
  icon?: string
  is_current?: boolean
  is_clickable?: boolean
}

export interface IBreadcrumbProps {
  items: IBreadcrumbItem[]
  separator_icon?: string
  home_icon?: string
  show_home?: boolean
}
