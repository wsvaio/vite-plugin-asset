<script setup lang="ts" generic="T extends object">
defineProps<{
  data?: T
}>()
</script>

<template>
  <slot :="data || {} as T" />
</template>

<style lang="less"></style>
