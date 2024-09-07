<script setup lang="ts">
const modelValue = defineModel<string>();
const main = useMainStore();
</script>

<template>
  <n-layout-header grid="~ cols-[max-content_1fr_max-content] items-center gap-16px" p="y-8px x-16px">
    <n-input v-model:value="modelValue" placeholder="输入我吧……" />

    <n-slider v-model:value="main.size" flex="1" :max="128" :min="16" />

    <n-switch v-model:value="main.theme" checked-value="dark" unchecked-value="light">
      <template #checked-icon>
        🌙
      </template>
      <template #unchecked-icon>
        ☀
      </template>
    </n-switch>
  </n-layout-header>
</template>

<style lang="less" scoped></style>
