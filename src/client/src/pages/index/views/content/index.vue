<script setup lang="ts">
import type { UnwrapPromise } from "@/utils";
import type { getFiles } from "~/services";

const { data } = defineProps<{
  data: UnwrapPromise<ReturnType<typeof getFiles>>;
}>();

// getFile
defineEmits<{
  iconClick: [path: string, name: string];
}>();

let expandedNames = $ref<string[] | null>(null);
watch(() => data, () => expandedNames ??= data.map(item => item.path));
</script>

<template>
  <n-layout-content content-style="padding: 24px;">
    <n-collapse v-if="data?.length" v-model:expanded-names="expandedNames">
      <n-collapse-item v-for="item in data" hoverable :title="item.path" :name="item.path">
        <template #header-extra>
          {{ item.names.length }}
        </template>

        <n-flex v-if="item.names.length">
          <n-tooltip v-for="sub in item.names" trigger="hover" placement="bottom">
            <template #trigger>
              <n-button h="!auto" p="!0" @click="$emit('iconClick', item.path, sub)">
                <preview-icon :url="resolvePath({ path: item.path, name: sub })" />
              </n-button>
            </template>
            {{ sub }}
          </n-tooltip>
        </n-flex>
        <n-empty v-else />
      </n-collapse-item>
    </n-collapse>
    <n-empty v-else />
  </n-layout-content>
</template>
