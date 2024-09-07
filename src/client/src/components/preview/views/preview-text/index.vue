<script setup lang="ts">
const { url = "" } = defineProps<{
  url?: string;
}>();

let text = $ref("");
fetch(url).then(data => data.text()).then(data => text = data);
</script>

<template>
  <n-code :code="text" word-wrap />
</template>

<style scoped></style>
