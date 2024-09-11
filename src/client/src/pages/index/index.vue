<script lang="ts" setup>
import { useTemplateRef } from "vue";
import ContentView from "./views/content/index.vue";
import DrawerView from "./views/drawer/index.vue";
import HeaderView from "./views/header/index.vue";

const hot = await createHotContext("/");
const drawerViewRef = $(useTemplateRef("drawerViewRef"));

let data = $ref<any[]>([]);
hot.on("vite-plugin-asset:update", ev => {
  data = ev;
});

hot.on("vite-plugin-asset:get", ev => {
  drawerViewRef?.open(ev);
});

hot.on("vite:ws:connect", () => {
  hot.send("vite-plugin-asset:update");
});

hot.on("vite-plugin-asset:delete", () => drawerViewRef?.close());

const name = $ref("");
watch(() => name, () => {
  hot.send("vite-plugin-asset:update", { name });
});

function handleIconClick(path: string, name: string) {
  hot.send("vite-plugin-asset:get", { path, name });
}
</script>

<template>
  <n-layout h="full">
    <header-view v-model="name" />
    <content-view :data @icon-click="handleIconClick" />
    <drawer-view ref="drawerViewRef" @open="hot.send('vite-plugin-asset:open', $event)" @delete="hot.send('vite-plugin-asset:delete', $event)" @rename="hot.send('vite-plugin-asset:rename', $event)" />
    <n-back-top />
  </n-layout>
</template>
