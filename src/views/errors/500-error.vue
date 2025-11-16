<script lang="ts" setup>
import config from '@/utils/configuration'
import { goBack } from '@/utils/navigation'
</script>
<template>
  <section
    class="mx-auto flex h-screen flex-col items-center justify-center bg-white dark:bg-gray-900"
  >
    <div
      class="max-w-screen-xl grid-cols-2 content-center gap-8 px-4 py-8 md:grid lg:px-6 lg:py-16"
    >
      <div class="self-center">
        <h1 class="mb-4 text-2xl font-bold text-primary-700 dark:text-primary-500">
          500 Internal Error
        </h1>
        <p
          class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl lg:mb-10"
        >
          Whoops! Something went wrong.
        </p>
        <button
          @click="goBack"
          class="mr-3 mb-4 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
        <p class="mb-4 text-gray-500 dark:text-gray-400">Here are some helpful links:</p>
        <ul class="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
          <li>
            <a
              :href="`mailto:${config.support_email}`"
              class="underline hover:text-gray-900 dark:hover:text-white"
              >Support ({{ config.support_email }})</a
            >
          </li>
          <li>
            <a
              :href="`tel:${config.support_phone}`"
              class="underline hover:text-gray-900 dark:hover:text-white"
              >Call Support ({{ config.support_phone }})</a
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
          <li>
            <a
              :href="config.developer.website"
              class="underline hover:text-gray-900 dark:hover:text-white"
              target="_blank"
              >Home</a
            >
          </li>
        </ul>
      </div>
      <div class="hidden md:flex">
        <img class="mx-auto mb-4 dark:hidden" src="@/assets/images/500.svg" alt="illustration" />
        <img
          class="mx-auto mb-4 hidden dark:flex"
          src="@/assets/images/500-dark.svg"
          alt="illustration"
        />
      </div>
    </div>
  </section>
</template>
