import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { IBreadcrumbItem } from '@/interfaces/breadcrumb-interfaces'

/**
 * Composable to automatically generate breadcrumbs from route metadata
 * @returns breadcrumbs - Computed property containing breadcrumb items from route meta
 */
export function useBreadcrumbs() {
  const route = useRoute()

  const breadcrumbs = computed<IBreadcrumbItem[]>(() => {
    // Get breadcrumbs from route meta, default to empty array
    const routeBreadcrumbs = (route.meta?.breadcrumb as IBreadcrumbItem[]) || []

    // Return breadcrumbs if they exist in route meta
    if (routeBreadcrumbs.length > 0) {
      return routeBreadcrumbs
    }

    // Fallback: Generate basic breadcrumbs from route path if no meta defined
    const pathSegments = route.path.split('/').filter((segment) => segment !== '')
    const fallbackBreadcrumbs: IBreadcrumbItem[] = []

    // Build breadcrumbs from path segments
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      // Format segment name (capitalize, replace hyphens with spaces)
      const name = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      fallbackBreadcrumbs.push({
        name,
        path: isLast ? undefined : currentPath,
        is_current: isLast,
        is_clickable: !isLast,
      })
    })

    return fallbackBreadcrumbs
  })

  return {
    breadcrumbs,
  }
}

