<script lang="ts" setup>
import { useTemplateRef } from "vue";
import ContentView from "./views/content/index.vue";
import DrawerView from "./views/drawer/index.vue";
import HeaderView from "./views/header/index.vue";

const hot = await createHotContext("/");
const drawerViewRef = $(useTemplateRef("drawerViewRef"));

const name = $ref("");
const isused = $ref<number>();
const isbatch = $ref(false);
let checks = $ref<{ name: string;path: string }[]>([]);
watch(() => isbatch, () => checks = []);

let data = $ref<any[]>([]);

hot.on("vite-plugin-asset:update", ev => {
  if (ev) {
    data = ev;
  }
  else {
    hot.send("vite-plugin-asset:update", { name, isused: isused === 1 ? true : isused === 0 ? false : undefined });
  }
});

hot.on("vite-plugin-asset:get", ev => {
  drawerViewRef?.open(ev);
});

hot.on("vite:ws:connect", () => {
  hot.send("vite-plugin-asset:update");
});

hot.on("vite-plugin-asset:delete", () => drawerViewRef?.close());

watch(() => [name, isused], () => {
  hot.send("vite-plugin-asset:update", { name, isused: isused === 1 ? true : isused === 0 ? false : undefined });
});

function handleIconClick(path: string, name: string) {
  if (isbatch) {
    const index = checks.findIndex(item => item.path == path && item.name == name);
    console.log(index);
    if (index === -1) {
      checks.push({ path, name });
    }
    else {
      checks.splice(index, 1);
    }
  }
  else {
    hot.send("vite-plugin-asset:get", { path, name });
  }
}
</script>

<template>
  <n-layout h="full">
    <header-view
      v-model:name="name" v-model:isused="isused" v-model:isbatch="isbatch" :checks
      @delete="hot.send('vite-plugin-asset:delete', checks), checks = []"
    />
    <content-view :data :checks @icon-click="handleIconClick" />
    <drawer-view
      ref="drawerViewRef" @open="hot.send('vite-plugin-asset:open', $event)"
      @delete="hot.send('vite-plugin-asset:delete', $event)" @rename="hot.send('vite-plugin-asset:rename', $event)"
    />
    <n-back-top />
  </n-layout>
</template>
