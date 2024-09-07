<script setup lang="ts">
const { url = "" } = defineProps<{
  url?: string;
}>();
</script>

<template>
  <div class="relative flex items-center justify-center text-4em">
    <div class="i-ph:file text-3em text-[#7d7d7d]" />
    <div
      whitespace="normal" break="all" pos="absolute inset-0"
      flex="~ items-center justify-center" overflow="hidden"
    >
      {{ url?.split(".").reverse()[0] }}
    </div>
  </div>
</template>

<style scoped>

</style>
