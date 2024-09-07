<script setup lang="ts">
defineProps<{
  url?: string;
}>();
</script>

<template>
  <video
    :src="url" w="full" h="full" object="contain"
    controls block poster="@/assets/img/ph-file-audio.svg"
  />
</template>

<style scoped></style>
