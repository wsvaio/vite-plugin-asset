<script setup lang="ts">
defineProps<{
  url?: string;
}>();
</script>

<template>
  <img
    :src="url" block w="full" h="full"
    object="contain" filter="drop-shadow"
  />
</template>

<style scoped></style>
