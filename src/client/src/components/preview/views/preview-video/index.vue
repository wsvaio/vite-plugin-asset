<script setup lang="ts">
defineProps<{
  url?: string;
}>();
</script>

<template>
  <video
    :src="url" w="full" h="full" object="contain"
    controls block
  />
</template>

<style scoped></style>
