import '@/assets/styles/base-style.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { setupI18n } from '@/i18n'
import Toast, { POSITION } from 'vue-toastification' // @ts-expect-ignore
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import { Http } from '@/utils/http'
import { useSessionStore } from '@/stores/session-store'
import { useUserStore } from '@/stores/user-store'
import { useWorkspaceTypeStore } from '@/stores/workspace-type-store'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { useRoleStore } from '@/stores/role-store'
import { usePermissionStore } from '@/stores/permission-store'
import { useRolePermissionStore } from '@/stores/role-permission-store'
import { useUserWorkspaceStore } from '@/stores/user-workspace-store'
import { useAuditStore } from '@/stores/audit-store'
import { useClientStore } from '@/stores/client-store'
import { AuthenticationApiService } from '@/service/api/authentication-api-service'
import { UserApiService } from '@/service/api/user-api-service'
import { WorkspaceTypeApiService } from '@/service/api/workspace-type-api-service'
import { WorkspaceApiService } from '@/service/api/workspace-api-service'
import { RoleApiService } from '@/service/api/role-api-service'
import { PermissionApiService } from '@/service/api/permission-api-service'
import { RolePermissionApiService } from '@/service/api/role-permission-api-service'
import { UserWorkspaceApiService } from '@/service/api/user-workspace-api-service'
import { AuditApiService } from '@/service/api/audit-api-service'
import { ClientApiService } from '@/service/api/client-api-service'
import { CountriesService, IdTypesService, SexService } from '@/service/static'

// Initialize global HTTP client
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/'
const httpClient = new Http(apiBaseUrl)

// Application
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Initialize Services
const authenticationApiService = new AuthenticationApiService(httpClient)
const userApiService = new UserApiService(httpClient)
const workspaceTypeApiService = new WorkspaceTypeApiService(httpClient)
const workspaceApiService = new WorkspaceApiService(httpClient)
const roleApiService = new RoleApiService(httpClient)
const permissionApiService = new PermissionApiService(httpClient)
const rolePermissionApiService = new RolePermissionApiService(httpClient)
const userWorkspaceApiService = new UserWorkspaceApiService(httpClient)
const auditApiService = new AuditApiService(httpClient)
const clientApiService = new ClientApiService(httpClient)

// Initialize Static Services
const countriesService = new CountriesService()
const idTypesService = new IdTypesService()
const sexService = new SexService()

// Initialize Stores after Pinia is set up
const sessionStore = useSessionStore()
const userStore = useUserStore()
const workspaceTypeStore = useWorkspaceTypeStore()
const workspaceStore = useWorkspaceStore()
const roleStore = useRoleStore()
const permissionStore = usePermissionStore()
const rolePermissionStore = useRolePermissionStore()
const userWorkspaceStore = useUserWorkspaceStore()
const auditStore = useAuditStore()
const clientStore = useClientStore()

// Set services for stores
sessionStore.setService(httpClient)
userStore.setService(userApiService)
workspaceTypeStore.setService(workspaceTypeApiService)
workspaceStore.setService(workspaceApiService)
roleStore.setService(roleApiService)
permissionStore.setService(permissionApiService)
rolePermissionStore.setService(rolePermissionApiService)
userWorkspaceStore.setService(userWorkspaceApiService)
auditStore.setService(auditApiService)
clientStore.setService(clientApiService)

// Set session store reference in HTTP client for interceptors
httpClient.setSessionStore(sessionStore)

// Provide HTTP client, services, and stores globally via Vue's dependency injection
app.provide('httpClient', httpClient)
app.provide('sessionStore', sessionStore)
app.provide('userStore', userStore)
app.provide('workspaceTypeStore', workspaceTypeStore)
app.provide('workspaceStore', workspaceStore)
app.provide('roleStore', roleStore)
app.provide('permissionStore', permissionStore)
app.provide('rolePermissionStore', rolePermissionStore)
app.provide('userWorkspaceStore', userWorkspaceStore)
app.provide('auditStore', auditStore)
app.provide('clientStore', clientStore)
app.provide('authenticationApiService', authenticationApiService)
app.provide('userApiService', userApiService)
app.provide('workspaceTypeApiService', workspaceTypeApiService)
app.provide('workspaceApiService', workspaceApiService)
app.provide('roleApiService', roleApiService)
app.provide('permissionApiService', permissionApiService)
app.provide('rolePermissionApiService', rolePermissionApiService)
app.provide('userWorkspaceApiService', userWorkspaceApiService)
app.provide('auditApiService', auditApiService)
app.provide('clientApiService', clientApiService)
app.provide('countriesService', countriesService)
app.provide('idTypesService', idTypesService)
app.provide('sexService', sexService)

// Initialize the stores
sessionStore.initialize()

// Initialize static services
await Promise.all([
  countriesService.initialize(),
  idTypesService.initialize(),
  sexService.initialize()
])

app.use(router)
app.use(setupI18n)
app.use(Toast, {
  shareAppContext: true,
  position: POSITION.TOP_RIGHT,
  containerClassName: 'capitalize text-sm',
})

app.mount('#app')
