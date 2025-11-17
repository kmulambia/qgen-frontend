import { useSessionStore } from '@/stores/session-store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// Enhanced route meta interface for permission checking
interface RouteMeta {
  breadcrumb?: Array<{
    name: string
    path: string
    icon?: string
    is_current?: boolean
    is_clickable?: boolean
  }>
  requiredPermissions?: string[]
  requiresAnyPermission?: boolean // true = user needs ANY of the permissions, false = user needs ALL permissions
}

// Authentication guard function
const requiresAuth = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const sessionStore = useSessionStore()
  // Validate session
  const isSessionValid = sessionStore.validateSession()

  if (!isSessionValid) {
    // No valid session, redirect to candidate login
    console.log('No valid session found, redirecting to candidate login')
    next('/auth/login')
  } else {
    // Session is valid, proceed
    next()
  }
}

// Permission-based guard function
const requiresPermissions = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const sessionStore = useSessionStore()

  // First check authentication
  const isSessionValid = sessionStore.validateSession()
  if (!isSessionValid) {
    console.log('No valid session found, redirecting to login')
    next('/auth/login')
    return
  }

  // Get permission requirements from route meta
  const meta = to.meta as RouteMeta
  const requiredPermissions = meta.requiredPermissions || []

  // If no permissions required, allow access
  if (requiredPermissions.length === 0) {
    next()
    return
  }

  // Check if user has universal permission
  if (sessionStore.hasPermission('*')) {
    next()
    return
  }

  // Determine if user needs ANY permission or ALL permissions
  const requiresAny = meta.requiresAnyPermission !== false // Default to true (ANY)

  let hasPermission = false

  if (requiresAny) {
    // User needs ANY of the required permissions
    hasPermission = requiredPermissions.some(permission =>
      sessionStore.hasPermission(permission)
    )
  } else {
    // User needs ALL of the required permissions
    hasPermission = requiredPermissions.every(permission =>
      sessionStore.hasPermission(permission)
    )
  }

  if (hasPermission) {
    next()
  } else {
    console.log(`Access denied to ${to.path}. Required permissions:`, requiredPermissions)
    // Redirect to dashboard with error message
    next({
      path: '/admin/dashboard',
      query: {
        error: 'insufficient_permissions',
        attempted_route: to.path,
        required_permissions: requiredPermissions.join(',')
      }
    })
  }
}

const Routes = [
  {
    path: '',
    redirect: 'dashboard',
  },
  {
    path: 'dashboard',
    component: () => import('@/views/dashboard/admin-page.vue'),
    beforeEnter: requiresAuth, // Dashboard accessible to all authenticated users
    meta: {
      breadcrumb: [
        { name: 'Dashboard', path: '/admin/dashboard', is_current: true }
      ]
    }
  },
  {
    path: 'settings',
    component: () => import('@/views/settings/index-page.vue'),
    beforeEnter: requiresAuth, // Settings accessible to all authenticated users
    meta: {
      breadcrumb: [
        { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
        { name: 'My Settings', path: '/admin/settings', is_current: true }
      ]
    }
  },
  {
    path: 'settings/:userId',
    component: () => import('@/views/settings/index-page.vue'),
    beforeEnter: requiresPermissions,
    meta: {
      requiredPermissions: [
        '*',
        'user.*',
        'user.view',
        'user.update'
      ],
      requiresAnyPermission: true,
      breadcrumb: [
        { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
        { name: 'User Management', path: '/admin/user-management', is_clickable: false },
        { name: 'Users', path: '/admin/user-management/users' },
        { name: 'User Settings', path: '', is_current: true }
      ]
    }
  },
  {
    path: 'user-management',
    meta: {
      breadcrumb: [
        { name: 'Home', path: '/admin/dashboard' },
        { name: 'User Management', path: '/admin/user-management', is_clickable: false }
      ]
    },
    children: [
      {
        path: 'users',
        children: [
          {
            path: '',
            component: () => import('@/views/user/index-page.vue'),
            beforeEnter: requiresPermissions,
            meta: {
              requiredPermissions: [
                '*',
                'user.*',
                'user.list'
              ],
              requiresAnyPermission: true,
              breadcrumb: [
                { name: 'Home', path: '/admin/dashboard' ,icon: 'HomeIcon'},
                { name: 'User Management', path: '/admin/user-management', is_clickable: false },
                { name: 'Users', path: '/admin/user-management/users', is_current: true }
              ]
            }
          },
          {
            path: 'manage/:userId',
            component: () => import('@/views/user/manage-user-page.vue'),
            beforeEnter: requiresPermissions,
            meta: {
              requiredPermissions: [
                '*',
                'user.*',
                'user.view',
                'user.update'
              ],
              requiresAnyPermission: true,
              breadcrumb: [
                { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
                { name: 'User Management', path: '/admin/user-management', is_clickable: false },
                { name: 'Users', path: '/admin/user-management/users' },
                { name: 'Manage User', path: '', is_current: true }
              ]
            }
          },
        ],
      },
      {
        path: 'workspaces',
        component: () => import('@/views/workspaces/index-page.vue'),
        beforeEnter: requiresPermissions,
        meta: {
          requiredPermissions: [
            '*',
            'workspace.*',
            'workspace.list'
          ],
          requiresAnyPermission: true,
          breadcrumb: [
            { name: 'Home', path: '/admin/dashboard' ,icon: 'HomeIcon'},
            { name: 'User Management', path: '/admin/user-management', is_clickable: false },
            { name: 'Workspaces', path: '/admin/user-management/workspaces', is_current: true }
          ]
        }
      },
      {
        path: 'roles',
        children: [
          {
            path: '',
            component: () => import('@/views/roles/index-page.vue'),
            beforeEnter: requiresPermissions,
            meta: {
              requiredPermissions: [
                '*',
                'role.*',
                'role.list'
              ],
              requiresAnyPermission: true,
              breadcrumb: [
                { name: 'Home', path: '/admin/dashboard' ,icon: 'HomeIcon'},
                { name: 'User Management', path: '/admin/user-management', is_clickable: false },
                { name: 'Roles', path: '/admin/user-management/roles', is_current: true }
              ]
            }
          },
          {
            path: 'manage-permissions/:roleId',
            component: () => import('@/views/roles/manage-role-permissions-page.vue'),
            beforeEnter: requiresPermissions,
            meta: {
              requiredPermissions: [
                '*',
                'role.*',
                'role.manage'
              ],
              requiresAnyPermission: true,
              breadcrumb: [
                { name: 'Home', path: '/admin/dashboard' ,icon: 'HomeIcon'},
                { name: 'User Management', path: '/admin/user-management', is_clickable: false },
                { name: 'Roles', path: '/admin/user-management/roles' },
                { name: 'Manage Permissions', path: '/admin/user-management/roles/manage-permissions', is_current: true }
              ]
            }
          },
        ],
      },
      {
        path: 'permissions',
        component: () => import('@/views/permissions/index-page.vue'),
        beforeEnter: requiresPermissions,
        meta: {
          requiredPermissions: [
            '*',
            'permission.*',
            'permission.list'
          ],
          requiresAnyPermission: true,
          breadcrumb: [
            { name: 'Home', path: '/admin/dashboard' ,icon: 'HomeIcon'},
            { name: 'User Management', path: '/admin/user-management', is_clickable: false },
            { name: 'Permissions', path: '/admin/user-management/permissions', is_current: true }
          ]
        }
      },
    ],
  },
  {
    path: 'configuration',
    meta: {
      breadcrumb: [
        { name: 'Home', path: '/admin/dashboard' ,icon: 'HomeIcon'},
        { name: 'Configuration', path: '/admin/configuration', is_clickable: false }
      ]
    },
    children: [
      {
        path: 'workspace-types',
        component: () => import('@/views/workspace-types/index-page.vue'),
        beforeEnter: requiresPermissions,
        meta: {
          requiredPermissions: [
            '*',
            'workspace-type.*',
            'workspace-type.list'
          ],
          requiresAnyPermission: true,
          breadcrumb: [
            { name: 'Home', path: '/admin/dashboard' ,icon: 'HomeIcon'},
            { name: 'Configuration', path: '/admin/configuration', is_clickable: false },
            { name: 'Workspace Types', path: '/admin/configuration/workspace-types', is_current: true }
          ]
        }
      },
    ],
  },
  {
    path: 'leads-sale',
    meta: {
      breadcrumb: [
        { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
        { name: 'Leads & Sale', path: '/admin/leads-sale', is_clickable: false }
      ]
    },
    children: [
      {
        path: 'clients',
        component: () => import('@/views/clients/index-page.vue'),
        beforeEnter: requiresPermissions,
        meta: {
          requiredPermissions: [
            '*',
            'client.*',
            'client.list'
          ],
          requiresAnyPermission: true,
          breadcrumb: [
            { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
            { name: 'Leads & Sale', path: '/admin/leads-sale', is_clickable: false },
            { name: 'Clients', path: '/admin/leads-sale/clients', is_current: true }
          ]
        }
      },
      {
        path: 'layouts',
        children: [
          {
            path: '',
            component: () => import('@/views/layouts/index-page.vue'),
            beforeEnter: requiresPermissions,
            meta: {
              requiredPermissions: [
                '*',
                'layout.*',
                'layout.list'
              ],
              requiresAnyPermission: true,
              breadcrumb: [
                { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
                { name: 'Leads & Sale', path: '/admin/leads-sale', is_clickable: false },
                { name: 'Layouts', path: '/admin/leads-sale/layouts', is_current: true }
              ]
            }
          },
          {
            path: ':id',
            component: () => import('@/views/layouts/manage-layout-page.vue'),
            beforeEnter: requiresPermissions,
            meta: {
              requiredPermissions: [
                '*',
                'layout.*',
                'layout.view',
                'layout.update'
              ],
              requiresAnyPermission: true,
              breadcrumb: [
                { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
                { name: 'Leads & Sale', path: '/admin/leads-sale', is_clickable: false },
                { name: 'Layouts', path: '/admin/layouts' },
                { name: 'Manage Layout', path: '', is_current: true }
              ]
            }
          },
        ],
      },
    ],
  },
  {
    path: 'files',
    component: () => import('@/views/file/index-page.vue'),
    beforeEnter: requiresPermissions,
    meta: {
      requiredPermissions: [
        '*',
        'file.*',
        'file.list'
      ],
      requiresAnyPermission: true,
      breadcrumb: [
        { name: 'Home', path: '/admin/dashboard', icon: 'HomeIcon' },
        { name: 'Files', path: '/admin/files', is_current: true }
      ]
    }
  }
]

export { Routes }
