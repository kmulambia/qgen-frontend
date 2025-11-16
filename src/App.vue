<script lang="ts" setup>
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
// initialize flowbite
onMounted(() => {
  initFlowbite()
})
</script>
<template>
  <router-view />
</template>
<style scoped></style>
