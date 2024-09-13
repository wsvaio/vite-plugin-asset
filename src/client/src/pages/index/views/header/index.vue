<script setup lang="ts">
const { checks } = defineProps<{
  checks: { name: string; path: string }[];
}>();
defineEmits(["delete"]);
const message = useMessage();
const name = defineModel<string>("name");
const isused = defineModel<number>("isused");
const main = useMainStore();
const isbatch = defineModel<boolean>("isbatch");
</script>

<template>
  <n-layout-header>
    <collapse>
      <n-input v-model:value="name" placeholder="输入我吧……" w="!16em" />

      <n-select v-model:value="isused" :options="[{ label: '未使用', value: 0 }, { label: '已使用', value: 1 }]" clearable w="!16em" />

      <template #suffix>
        <n-checkbox v-model:checked="isbatch">批量操作</n-checkbox>

        <template v-if="isbatch">
          <n-popconfirm @positive-click="checks.length ? $emit('delete') : message.info('请选择文件')">
            <template #trigger>
              <n-button type="error" size="small">删除</n-button>
            </template>
            {{ `确定删除？` }}
          </n-popconfirm>
        </template>

        <!-- <n-divider vertical />

        <n-popover trigger="hover">
          <template #trigger>
            <n-button>排序</n-button>
          </template>

          <n-radio-group>
            <n-radio :value="0">颜色(图片)</n-radio>
            <n-radio :value="1">大小</n-radio>
            <n-radio :value="2">名称</n-radio>
            <n-radio :value="3">类型</n-radio>
          </n-radio-group>
        </n-popover> -->

        <n-divider vertical />

        <n-input-number
          :value="main.size" :min="12" w="8em" text="center"
          button-placement="both" size="small"
          @update:value="val => main.size = val ? val : 12"
        />

        <!-- <n-slider v-model:value="main.size" flex="1" :max="128" :min="16" /> -->

        <n-switch v-model:value="main.theme" checked-value="dark" unchecked-value="light">
          <template #checked-icon>
            🌙
          </template>
          <template #unchecked-icon>
            ☀
          </template>
        </n-switch>
      </template>
    </collapse>
  </n-layout-header>
</template>

<style lang="less" scoped></style>
