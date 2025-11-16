export interface INavigation {
  name: string
  path?: string
  icon?: string
  enabled?: boolean
  items?: INavigation[]
  key?: string // For dropdown identification in admin sidebar
  requiredPermissions?: string[] // Required permissions to show this navigation item
}
