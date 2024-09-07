<script setup lang="ts">
import mime from "mime";
import PreviewAudio from "./views/preview-audio/index.vue";
import PreviewImage from "./views/preview-image/index.vue";
import PreviewOther from "./views/preview-other/index.vue";
import PreviewText from "./views/preview-text/index.vue";
import PreviewVideo from "./views/preview-video/index.vue";

const { url = "" } = defineProps<{
  url?: string;
}>();

const type = $computed(() => url ? mime.getType(url) : "");
</script>

<template>
  <div pos="relative" overflow="auto">
    <template v-if="type?.startsWith('image')">
      <preview-image :url pos="absolute" inset="0" />
    </template>

    <template v-else-if="type?.startsWith('video')">
      <preview-video :url pos="absolute" inset="0" />
    </template>

    <template v-else-if="type?.startsWith('audio')">
      <preview-audio :url pos="absolute" inset="0" />
    </template>

    <template v-else-if="type?.startsWith('text')">
      <preview-text :url />
    </template>

    <template v-else>
      <preview-other pos="!absolute" inset="0" :url />
    </template>
  </div>
</template>

<style scoped></style>
