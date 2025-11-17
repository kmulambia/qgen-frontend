<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import type { INavigation } from '@/interfaces'
import configuration from '@/utils/configuration'
import { useHeroicons } from '@/composables'
import type { SessionStore } from '@/stores/session-store'

const props = defineProps<{
  state: 'hidden' | 'icon-only' | 'full'
}>()

const emit = defineEmits<{
  close: []
  toggle: []
}>()

const { version } = configuration
const route = useRoute()

// Session store for permission checks
const sessionStore = inject<SessionStore>('sessionStore')

if (!sessionStore) {
  throw new Error('Session store not provided')
}

// Dropdown states
const dropdowns = ref<Record<string, boolean>>({})

const toggleDropdown = (section: string) => {
  dropdowns.value[section] = !dropdowns.value[section]
}

// Permission-based navigation with computed visibility
const navigationItems: INavigation[] = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'ChartPieIcon',
    enabled: true, // Dashboard is always accessible
  },
  {
    name: 'User Management',
    key: 'users',
    icon: 'UserGroupIcon',
    enabled: true,
    requiredPermissions: [
      'user.*',
      'workspace.*',
      'role.*',
      'permission.*',
    ],
    items: [
      {
        name: 'Users',
        path: '/admin/user-management/users',
        icon: 'UsersIcon',
        enabled: true,
        requiredPermissions: ['user.*', 'user.list'],
      },
      {
        name: 'Workspaces',
        path: '/admin/user-management/workspaces',
        icon: 'BuildingOffice2Icon',
        enabled: true,
        requiredPermissions: ['workspace.*', 'workspace.list'],
      },
      {
        name: 'Roles',
        path: '/admin/user-management/roles',
        icon: 'ShieldCheckIcon',
        enabled: true,
        requiredPermissions: ['role.*', 'role.list'],
      },
      {
        name: 'Permissions',
        path: '/admin/user-management/permissions',
        icon: 'KeyIcon',
        enabled: true,
        requiredPermissions: ['permission.*', 'permission.list'],
      },
    ],
  },
  {
    name: 'Configuration',
    key: 'configuration',
    icon: 'AdjustmentsHorizontalIcon',
    enabled: true,
    requiredPermissions: [
      'workspace-type.*',
    ],
    items: [
      {
        name: 'Workspace Types',
        path: '/admin/configuration/workspace-types',
        icon: 'BuildingOfficeIcon',
        enabled: true,
        requiredPermissions: [
          'workspace-type.*',
          'workspace-type.list',
        ],
      },
    ],
  },
  {
    name: 'Leads & Sale',
    key: 'leads-sale',
    icon: 'ShoppingCartIcon',
    enabled: true,
    requiredPermissions: [
      'client.*',
      'layout.*',
    ],
    items: [
      {
        name: 'Clients',
        path: '/admin/leads-sale/clients',
        icon: 'BuildingOfficeIcon',
        enabled: true,
        requiredPermissions: [
          'client.*',
          'client.list',
        ],
      },
      {
        name: 'Layouts',
        path: '/admin/leads-sale/layouts',
        icon: 'DocumentTextIcon',
        enabled: true,
        requiredPermissions: [
          'layout.*',
          'layout.list',
        ],
      },
    ],
  },
  {
    name: 'Files',
    path: '/admin/files',
    icon: 'FolderIcon',
    enabled: true,
    requiredPermissions: [
      'file.*',
      'file.list',
    ],
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: 'Cog8ToothIcon',
    enabled: true, // Settings is always accessible
  },
]

// Helper function to check if user has any of the required permissions
const hasAnyPermission = (requiredPermissions: string[]): boolean => {
  if (!sessionStore) return false

  // Always allow if user has universal permission
  if (sessionStore.hasPermission('*')) return true

  // Check if user has any of the required permissions
  return requiredPermissions.some((permission) => sessionStore.hasPermission(permission))
}

// Helper function to check if navigation item should be visible
const isItemVisible = (item: INavigation): boolean => {
  // If no permissions required, item is visible
  if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
    return item.enabled !== false
  }

  // Check if user has required permissions
  return item.enabled !== false && hasAnyPermission(item.requiredPermissions)
}

// Helper function to filter navigation items recursively
const filterNavigationItems = (items: INavigation[]): INavigation[] => {
  return items
    .filter((item) => isItemVisible(item))
    .map((item) => {
      if (item.items && item.items.length > 0) {
        const filteredSubItems = filterNavigationItems(item.items)

        // Only show parent item if it has visible sub-items or a direct path
        if (filteredSubItems.length > 0 || item.path) {
          return {
            ...item,
            items: filteredSubItems,
          }
        }
        return null
      }
      return item
    })
    .filter((item) => item !== null) as INavigation[]
}

// Computed navigation with permission filtering
const navigation = computed(() => {
  return filterNavigationItems(navigationItems)
})

const { get_hero_icon } = useHeroicons()

const bottomNavigation: INavigation[] = [
  {
    name: 'Documentation',
    path: configuration.developer?.website || '#',
    icon: 'BookOpenIcon',
    enabled: !!configuration.developer?.website,
  },
  {
    name: 'Support',
    path: `mailto:${configuration.support_email || configuration.developer?.email}`,
    icon: 'LifebuoyIcon',
    enabled: !!(configuration.support_email || configuration.developer?.email),
  },
  {
    name: 'Help',
    path: '#',
    icon: 'QuestionMarkCircleIcon',
    enabled: true,
  },
  {
    name: 'GitHub',
    path: configuration.developer?.github || '#',
    icon: 'CodeBracketIcon',
    enabled: !!configuration.developer?.github,
  },
]

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const isNestedActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const isParentActive = (items: INavigation[]): boolean => {
  if (!items) return false

  return items.some((item): boolean => {
    // Check if this item is active
    if (item.path && (route.path === item.path || route.path.startsWith(item.path + '/'))) {
      return true
    }

    // Check if any nested items are active
    if (item.items && item.items.length > 0) {
      return isParentActive(item.items)
    }

    return false
  })
}

const hasDropdown = (item: INavigation) => {
  return !!(item.items && item.items.length > 0)
}

const isSingleItemActive = (item: INavigation) => {
  return item.path && route.path === item.path
}

const closeSidebar = () => {
  emit('close')
}
</script>

<template>
  <!-- Backdrop for mobile -->
  <div
    v-if="props.state === 'full'"
    class="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed left-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 ease-in-out',
      // Desktop: normal sidebar with navbar spacing (z-40)
      'lg:top-16 lg:h-screen lg:z-40',
      // Mobile: full height overlay-style sidebar (z-50 to overlay navbar)
      'top-0 h-full z-50 lg:h-screen',
      {
        // Hidden state
        '-translate-x-full': props.state === 'hidden',
        // Icon-only state (desktop only)
        'w-16 translate-x-0': props.state === 'icon-only',
        // Full state
        'w-64 translate-x-0': props.state === 'full',
      },
    ]"
  >
    <div class="h-full overflow-y-auto py-4" :class="props.state === 'icon-only' ? 'px-2' : 'px-3'">
      <!-- Mobile header section (only visible on mobile in full mode) -->
      <div
        v-if="props.state === 'full'"
        class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 lg:hidden"
      >
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center">
            <img
              class="h-8 w-8 drop-shadow-xl filter"
              src="@/assets/images/logo.png"
              :alt="configuration.name"
            />
            <div class="ml-3">
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {{ configuration.name }}
              </div>
              <div
                class="text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 px-2 py-1 rounded-full inline-block"
              >
                v-{{ version }}
              </div>
            </div>
          </div>
          <button
            @click="closeSidebar"
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <ul class="space-y-2">
        <!-- Navigation Items -->
        <li v-for="section in navigation" :key="section.key || section.name">
          <!-- Single Navigation Item (like Dashboard) -->
          <router-link
            v-if="!hasDropdown(section) && section.path && section.enabled !== false"
            :to="section.path"
            :class="[
              'group flex w-full items-center rounded-lg text-base font-medium transition-colors duration-200 relative',
              props.state === 'icon-only' ? 'h-12 p-2 justify-center' : 'h-10 p-2',
              isSingleItemActive(section)
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
            ]"
            :title="props.state === 'icon-only' ? section.name : ''"
          >
            <component
              :is="get_hero_icon(section.icon!)"
              :class="[
                'shrink-0 transition-colors duration-200',
                props.state === 'icon-only' ? 'h-6 w-6' : 'h-5 w-5',
                isSingleItemActive(section)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white',
              ]"
            />
            <span
              v-if="props.state !== 'icon-only'"
              class="ml-3 flex-1 whitespace-nowrap text-left"
            >
              {{ section.name }}
            </span>
          </router-link>

          <!-- Dropdown Navigation Item -->
          <template v-else-if="hasDropdown(section)">
            <!-- Icon-only mode: show disabled icon with tooltip -->
            <div
              v-if="props.state === 'icon-only'"
              :class="[
                'group flex w-full h-12 items-center justify-center rounded-lg p-2 text-base font-medium transition-colors duration-200 cursor-not-allowed opacity-50',
                isParentActive(section.items || [])
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
              ]"
              :title="`${section.name} (Expand sidebar to access)`"
            >
              <component
                :is="get_hero_icon(section.icon!)"
                class="h-6 w-6 shrink-0 transition-colors duration-200 text-gray-400"
              />
            </div>

            <!-- Full mode: show dropdown button -->
            <button
              v-else
              @click="toggleDropdown(section.key!)"
              type="button"
              :class="[
                'group flex h-10 w-full items-center rounded-lg p-2 text-base font-medium transition-colors duration-200',
                isParentActive(section.items || [])
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
              ]"
            >
              <component
                :is="get_hero_icon(section.icon!)"
                :class="[
                  'h-5 w-5 shrink-0 transition-colors duration-200',
                  isParentActive(section.items || [])
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white',
                ]"
              />
              <span class="ml-3 flex-1 whitespace-nowrap text-left">{{ section.name }}</span>
              <svg
                :class="[
                  'h-5 w-5 transition-transform duration-200',
                  dropdowns[section.key!] ? 'rotate-180' : '',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Dropdown Items (only show in full mode) -->
            <ul
              v-show="dropdowns[section.key!] && props.state === 'full'"
              class="space-y-2 py-2 transition-all duration-200 ease-in-out"
            >
              <li v-for="item in section.items" :key="item.path || item.name">
                <!-- Nested dropdown item (like Roles with sub-items) -->
                <template v-if="hasDropdown(item)">
                  <button
                    @click="toggleDropdown(item.name)"
                    type="button"
                    :class="[
                      'group flex h-10 w-full items-center rounded-lg p-2 pl-10 text-base font-medium transition-colors duration-200',
                      isParentActive(item.items || [])
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                    ]"
                  >
                    {{ item.name }}
                    <svg
                      :class="[
                        'ml-auto h-4 w-4 transition-transform duration-200',
                        dropdowns[item.name] ? 'rotate-180' : '',
                      ]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m19 9-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <!-- Third level nested items -->
                  <ul
                    v-show="dropdowns[item.name]"
                    class="space-y-2 py-2 transition-all duration-200 ease-in-out"
                  >
                    <li v-for="subItem in item.items" :key="subItem.path">
                      <router-link
                        v-if="subItem.path && subItem.enabled !== false"
                        :to="subItem.path"
                        :class="[
                          'group flex w-full items-center rounded-lg p-2 pl-16 text-sm font-medium transition-colors duration-200',
                          isNestedActive(subItem.path)
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                        ]"
                      >
                        {{ subItem.name }}
                      </router-link>
                    </li>
                  </ul>
                </template>

                <!-- Regular navigation item -->
                <router-link
                  v-else-if="item.path && item.enabled !== false"
                  :to="item.path"
                  :class="[
                    'group flex w-full items-center rounded-lg p-2 pl-10 text-base font-medium transition-colors duration-200',
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                  ]"
                >
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </template>
        </li>
      </ul>

      <!-- Bottom Section - Configuration Based -->
      <ul class="my-5 space-y-2 border-t border-gray-200 pt-5 dark:border-gray-700">
        <li v-for="item in bottomNavigation" :key="item.name">
          <a
            v-if="item.enabled && item.path"
            :href="item.path"
            :target="item.path.startsWith('http') ? '_blank' : '_self'"
            :rel="item.path.startsWith('http') ? 'noopener noreferrer' : ''"
            :title="props.state === 'icon-only' ? item.name : ''"
            :class="[
              'group flex items-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 transition-colors duration-200',
              props.state === 'icon-only' ? 'h-12 justify-center' : 'h-10',
            ]"
          >
            <component
              :is="get_hero_icon(item.icon!)"
              :class="[
                'shrink-0 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white',
                props.state === 'icon-only' ? 'h-6 w-6' : 'h-5 w-5',
              ]"
            />
            <span v-if="props.state !== 'icon-only'" class="ml-3">
              {{ item.name }}
            </span>
            <!-- External link indicator -->
            <svg
              v-if="item.path.startsWith('http') && props.state !== 'icon-only'"
              class="ml-2 h-3 w-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>
