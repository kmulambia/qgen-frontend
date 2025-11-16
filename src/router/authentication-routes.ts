const Routes = [
  {
    path: '',
    name: 'login',
    redirect: 'login',
  },
  {
    path: 'login',
    name: 'Authenticationlogin',
    component: () => import('@/views/authentication/login-page.vue'),
    meta: {
      requiresAuth: false,
      title: 'Login',
      userGroup: null,
      isPublic: true,
    },
  },
  {
    path: 'forgot-password',
    name: 'AuthenticationForgotPassword',
    component: () => import('@/views/authentication/forgot-password.vue'),
    meta: {
      requiresAuth: false,
      title: 'Forgot Password',
      userGroup: null,
      isPublic: true,
    },
  },
]

export { Routes }
