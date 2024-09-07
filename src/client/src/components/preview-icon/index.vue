<script setup lang="ts">
import mime from "mime";

const { url = "" } = defineProps<{
  url?: string;
}>();
const main = useMainStore();

const type = $computed(() => url ? mime.getType(url) : "");
// todo
const src = $computed(() => type?.startsWith("image") ? url : url);
</script>

<template>
  <n-image
    :src
    :width="main.size" :height="main.size" :style="{ margin: `${main.size / 4}px` }"
    flex="1 justify-center" object-fit="contain" class="drop-shadow" preview-disabled
    lazy
  >
    <template #placeholder>
      <div
        class="relative flex items-center justify-center"
        :style="{
          'width': `${main.size}px`,
          'height': `${main.size}px`,
          'font-size': `${main.size}px`,
          'fontSizeAdjust': '100%',

        }"
      >
        <div class="i-ph:file text-[#7d7d7d]" />
        <div
          text=".25em" whitespace="normal" break="all" pos="absolute inset-0"
          flex="~ items-center justify-center" overflow="hidden"
        >
          {{ url?.split("/").reverse()[0] }}
        </div>
      </div>
    </template>
  </n-image>
</template>

<style scoped>

</style>
