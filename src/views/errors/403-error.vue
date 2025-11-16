<script lang="ts" setup>
import config from '@/utils/configuration'
import { goBack } from '@/utils/navigation'
</script>
<template>
  <section
    class="mx-auto flex h-screen flex-col items-center justify-center px-6 dark:bg-gray-900 xl:px-0"
  >
    <div class="block md:max-w-lg">
      <div class="mx-auto mb-4 hidden lg:flex justify-center">
        <svg
          class="h-32 w-32 text-red-500 dark:text-red-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3V12.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm-3.75 8.25v-3a3.75 3.75 0 117.5 0v3h-7.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <div class="text-center xl:max-w-4xl">
      <h1 class="mb-4 text-2xl font-bold leading-tight text-primary-700 dark:text-primary-500">
        403 Access Denied
      </h1>
      <p class="mb-5 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">
        Sorry, you don't have permission to access this resource.
      </p>
      <button
        @click="goBack"
        class="mr-3 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        <svg
          class="-ml-1 mr-2 h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        Go back
      </button>
      <p class="my-4 text-gray-500 dark:text-gray-400 md:mt-8">
        If you believe this is an error, please contact support:
      </p>
      <ul class="flex items-center justify-center space-x-4 text-gray-500 dark:text-gray-400">
        <li>
          <a
            :href="config.developer.website"
            class="underline hover:text-gray-900 dark:hover:text-white"
            target="_blank"
            >Home</a
          >
        </li>
        <li>
          <a
            :href="`mailto:${config.support_email}`"
            class="underline hover:text-gray-900 dark:hover:text-white"
            >Contact Support</a
          >
        </li>
        <li>
          <a
            :href="`tel:${config.support_phone}`"
            class="underline hover:text-gray-900 dark:hover:text-white"
            >{{ config.support_phone }}</a
          >
        </li>
        <li>
          <a
            :href="config.terms_of_service"
            class="underline hover:text-gray-900 dark:hover:text-white"
            target="_blank"
            >Terms of Service</a
          >
        </li>
      </ul>
      <div class="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Possible reasons for this error:</p>
        <ul class="mt-2 list-disc list-inside space-y-1">
          <li>You don't have the required permissions</li>
          <li>Your session has expired</li>
          <li>You need to log in with different credentials</li>
          <li>The resource requires elevated privileges</li>
        </ul>
      </div>
    </div>
  </section>
</template>
