<script setup lang="ts">
import type { UnwrapPromise } from "@/utils";
import type { getFile } from "~/services";
import { codeAudio, codeDownload, codeImage, codeImport, codeVideo } from ".";
// const main = useMainStore();
defineEmits(["open", "rename", "delete"]);
let show = $ref(false);
let data = $ref<UnwrapPromise<ReturnType<typeof getFile>>>();

const name = $ref("");

const message = useMessage();
async function copy(text?: string) {
  if (!text)
    return;
  await navigator.clipboard.writeText(text);
  message.success("复制成功");
}

defineExpose({
  open: (_data: any) => {
    data = _data;
    show = true;
  },
  close: () => {
    show = false;
  }
});
</script>

<template>
  <n-drawer v-model:show="show" placement="right" resizable :default-width="512">
    <n-drawer-content body-content-class="flex flex-col" closable>
      <template #header>
        <n-text>{{ data?.name }}</n-text>
        <n-button
          type="primary" text tag="a" ml=".5em"
          class="text-1em" download
          :href="resolvePath({ path: data?.path, name: data?.name })" title="下载"
        >
          <div class="i-ph:download" />
        </n-button>

        <n-button
          ml=".25em" class="text-1em" type="primary" text
          tag="a" title="访达"
          @click="$emit('open', { path: `${data?.path}/${data?.name}` })"
        >
          <div class="i-ion:open-outline" />
        </n-button>

        <n-popconfirm
          :show-icon="false"
          @positive-click="$emit('rename', { path: data?.path, name: data?.name, newname: name }), name = ''"
        >
          <template #trigger>
            <n-button
              ml=".25em" class="text-1em" type="primary" text
              tag="a" title="改名"
              @click="name = data?.name || ''"
            >
              <div class="i-ph:note-pencil" />
            </n-button>
          </template>
          <n-input v-model:value="name" />
        </n-popconfirm>

        <n-popconfirm @positive-click="$emit('delete', { path: data?.path, name: data?.name })">
          <template #trigger>
            <n-button
              ml=".25em" class="text-1em" type="primary" text
              tag="a" title="删除"
            >
              <div class="i-ph:trash" />
            </n-button>
          </template>
          确定删除？
        </n-popconfirm>
      </template>

      <n-card>
        <preview class="aspect-ratio-16/9 w-full" :url="resolvePath({ path: data?.path, name: data?.name })" />
      </n-card>

      <n-descriptions
        :columns="1" label-placement="left" label-class="font-bold" mt="1.5em"
        mb=".5em"
      >
        <n-descriptions-item label="引用地址">
          <span>{{ `${data?.rawpath}/${data?.name}` }}</span>
          <n-button
            ml=".25em" type="primary" tag="a" text
            @click="copy(`${data?.rawpath}/${data?.name}`)"
          >
            <div class="i-ph:copy" />
          </n-button>
        </n-descriptions-item>

        <n-descriptions-item label="文件地址">
          <span>{{ `${data?.path}/${data?.name}` }}</span>
          <n-button
            ml=".25em" type="primary" tag="a" text
            @click="copy(`${data?.path}/${data?.name}`)"
          >
            <div class="i-ph:copy" />
          </n-button>
        </n-descriptions-item>

        <n-descriptions-item label="类型">
          {{ data?.type }}
        </n-descriptions-item>

        <n-descriptions-item label="大小">
          {{ data?.size }}
        </n-descriptions-item>

        <n-descriptions-item label="修改日期">
          {{ data?.atime }}
        </n-descriptions-item>
      </n-descriptions>

      <templated
        :data="data?.use?.flatMap(item => item.positions.map(sub => ({ path: item.path, ...sub })))"
        #="uselist"
      >
        <n-tabs type="line" animated mt="auto" aspect-ratio="1/1">
          <n-tab-pane name="示例" tab="示例">
            <n-list hoverable clickable show-divider>
              <n-list-item @click="copy(codeImport(data?.rawpath, data?.name))">
                <n-code :code="codeImport(data?.rawpath, data?.name)" language="javascript" word-wrap />
              </n-list-item>
              <n-list-item @click="copy(codeDownload(data?.rawpath, data?.name))">
                <n-code :code="codeDownload(data?.rawpath, data?.name)" language="xml" word-wrap />
              </n-list-item>
              <n-list-item v-if="data?.type?.startsWith('image')" @click="copy(codeImage(data?.rawpath, data?.name))">
                <n-code :code="codeImage(data?.rawpath, data?.name)" language="xml" word-wrap />
              </n-list-item>
              <n-list-item
                v-if="data?.type?.startsWith('video')"
                @click="codeVideo(codeImage(data?.rawpath, data?.name))"
              >
                <n-code :code="codeVideo(data?.rawpath, data?.name)" language="xml" word-wrap />
              </n-list-item>
              <n-list-item
                v-if="data?.type?.startsWith('audio')"
                @click="codeAudio(codeImage(data?.rawpath, data?.name))"
              >
                <n-code :code="codeAudio(data?.rawpath, data?.name)" language="xml" word-wrap />
              </n-list-item>
            </n-list>
          </n-tab-pane>

          <n-tab-pane name="使用" tab="使用">
            <template #tab>
              <n-badge :value="uselist?.length" color="grey" show-zero>
                使用
              </n-badge>
            </template>
            <n-list v-if="uselist?.length" hoverable clickable show-divider>
              <n-list-item v-for="item in uselist" @click="$emit('open', item)">
                {{ item.path }}
                <template #suffix>
                  <span whitespace="nowrap">{{ `${item.row}:${item.column}` }}</span>
                </template>
              </n-list-item>
            </n-list>
            <n-empty v-else />
          </n-tab-pane>
        </n-tabs>
      </templated>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less" scoped></style>
