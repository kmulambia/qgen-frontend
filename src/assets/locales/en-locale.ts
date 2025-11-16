export default {
  // Language selection
  languages: {
    english: 'English',
    chichewa: 'Chichewa',
    french: 'French',
  },

  // Core system functionality
  system: {
    // Navigation
    navigation: {
      goBack: 'go back',
      goHome: 'go home',
      backToHome: 'back to home',
      backToLogin: 'back to login',
    },

    pages: {
      contacts: 'contacts',
      notifications: 'notifications',
      settings: 'settings',
      privacy: 'privacy',
      termsOfService: 'terms of service',
      contact: 'contact us',
      privacyPolicy: 'privacy policy',
    },

    // Authentication
    auth: {
      login: 'login',
      logout: 'logout',
      register: 'register',
      signUp: 'sign up',
      signIn: 'sign in',
      signInToAccount: 'Sign in to your account',
      welcomeBack: 'Welcome back! Please sign in to continue',
      showPassword: 'show password',
      forgotPassword: 'forgot password?',
      rememberMe: 'remember me',
      rememberPassword: 'remember your password?',
      dontHaveAccount: "don't have an account?",
      alreadyHaveAccount: 'already have an account?',
      registerHere: 'register here',
      loginHere: 'login here',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      loggedIn: 'Logged in, redirecting...',
      pleaseWait: 'please wait while authenticating your credentials...',
    },

    // Password management
    password: {
      showPassword: 'show password',
      hidePassword: 'hide password',
      newPassword: 'new password',
      confirmNewPassword: 'confirm new password',
      currentPassword: 'current password',
      resetPassword: 'reset password',
      passwordResetSuccessful: 'Successfully reset your password',
      passwordResetFailed: 'Failed to reset your password',
      passwordResetEmailSent: 'Password reset email sent',
      passwordResetEmailNotSent: 'Failed to send password reset email',
      passwordResetEmailAlreadySent: 'Password reset email already sent',
      resetPasswordDescription:
        "Enter your email address and we'll send you a link to reset your password",
      sendResetLink: 'Send reset link',
      backToSignIn: 'Back to sign in',
    },

    // OTP functionality
    otp: {
      sendOTP: 'send OTP',
      verifyOTP: 'verify OTP',
      enterOTP: 'enter OTP',
      enterCodeBelow: 'Please enter the code shown above',
      otpRequestLimit: 'You can only request one OTP code once every 10 minutes',
    },

    // User profile and settings
    user: {
      profile: 'profile',
      account: 'account',
      security: 'security',
      settings: 'settings',
      preferences: 'preferences',
      manage: 'manage',
    },

    // Data operations
    data: {
      view: 'view',
      preview: 'Preview',
      upload: 'upload',
      download: 'download',
      export: 'export',
      exportToCSV: 'export to CSV',
      exportToPDF: 'export to PDF',
      exportToPrint: 'export to print',
      no_data: 'no data available',
    },

    // CRUD operations
    crud: {
      create: 'create',
      read: 'view',
      update: 'update',
      delete: 'delete',
      edit: 'edit',
      add: 'add',
      remove: 'remove',
      restore: 'restore',
      save: 'save',
      cancel: 'cancel',
      submit: 'submit',
      close: 'close',
      manage: 'manage',
      download: 'download',
      view: 'view',
    },

    // Table and list operations
    table: {
      columns: 'columns',
      select: 'select',
      selectAll: 'select all',
      deselectAll: 'deselect all',
      filter: 'filter',
      sort: 'sort',
      search: 'search',
    },

    // Common actions
    actions: {
      confirm: 'confirm',
      dismiss: 'dismiss',
      close: 'close',
      ok: 'ok',
      yes: 'yes',
      no: 'no',
      are_you_sure: 'are you sure?',
    },

    // Status indicators
    status: {
      loading: 'loading...',
      processing: 'processing...',
      success: 'success',
      failed: 'failed',
    },

    // Form fields
    fields: {
      emailAddress: 'email address',
      password: 'password',
    },
  },

  // Validation messages
  validation: {
    // Mixed validation
    mixed: {
      default: 'is invalid',
      required: 'is required',
      selected: 'must have at least one selection',
      oneOf: 'must be one of: {{ values }}',
      notOneOf: 'must not be one of: {{ values }}',
      notType: 'must be a {{ type }}',
    },

    // Password validation
    password: {
      mismatch: 'passwords do not match',
      invalid: 'password does not meet requirements',
      current: 'current password is incorrect',
      requirements:
        'password must contain at least 8 characters, including uppercase, lowercase, number and special character',
    },

    // String validation
    string: {
      alphanumeric: 'must contain only letters and numbers',
      length: 'must be exactly {{ length }} characters',
      min: 'must be at least {{ min }} characters',
      max: 'must be at most {{ max }} characters',
      matches: "must match pattern: '{{ regex }}'",
      email: 'must be a valid email address',
      text: 'must contain only letters and spaces',
      url: 'must be a valid URL',
      uuid: 'must be a valid UUID',
      trim: 'must not have leading or trailing spaces',
      lowercase: 'must be lowercase',
      uppercase: 'must contain at least one uppercase letter',
      number: 'must contain at least one number',
      special: 'must contain at least one special character',
      selected: 'must be selected',
      phone: 'must be a valid phone number',
      oneOf: 'must be one of: {{ values }}',
    },

    // Number validation
    number: {
      min: 'must be greater than or equal to {{ min }}',
      max: 'must be less than or equal to {{ max }}',
      lessThan: 'must be less than {{ less }}',
      moreThan: 'must be greater than {{ more }}',
      notEqual: 'must not equal {{ notEqual }}',
      positive: 'must be a positive number',
      negative: 'must be a negative number',
      integer: 'must be an integer',
      invalid: 'must be a number',
    },

    // Date validation
    date: {
      min: 'must be after {{ min }}',
      max: 'must be before {{ max }}',
      invalid: 'must be a valid date',
      future: 'must be a future date',
      past: 'must be a past date',
    },

    // Boolean validation
    boolean: {
      invalid: 'must be true or false',
    },

    // Object validation
    object: {
      noUnknown: 'contains invalid keys',
    },

    // Array validation
    array: {
      min: 'must have at least {{ min }} items',
      max: 'must have at most {{ max }} items',
      unique: 'must not contain duplicate values',
    },
  },

  // Error messages
  errors: {
    // HTTP status errors
    http: {
      400: 'invalid credentials',
      401: 'unauthorized access: {{ message }}. please reset your password or contact support',
      403: 'access denied',
      404: 'page not found',
      409: '{{ message }} already exists',
      429: 'too many requests',
      500: 'server error: {{ message }}',
    },

    // Page errors
    pages: {
      pageNotFound: 'page not found',
      noResultsFound: 'no results found',
      notAuthorized: 'not authorized',
      pleaseTryAgain: 'please try again',
    },

    // Session errors
    session: {
      sessionExpired: 'your session has expired, please login again',
    },

    // Specific error types
    types: {
      forbidden: {
        title: 'forbidden',
        message: 'forbidden',
        description: 'you do not have permission to access this resource',
      },
      notFound: {
        title: 'not found',
        message: 'not found',
        description: 'the page you are looking for does not exist',
      },
      validation: {
        title: 'validation error',
        message: 'validation error',
        description: 'please check your input and try again',
      },
    },

    // Network and technical errors
    technical: {
      defaultErrorMessage: 'something went wrong',
      networkError: 'network error, please check your connection',
      timeoutError: 'request timed out, please try again',
    },
  },
}
