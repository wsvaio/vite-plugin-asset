<script setup lang="ts">
import type { UnwrapPromise } from "@/utils";
import type { getFile } from "~/service";
import { codeA, codeImg, codeImport } from ".";
// const main = useMainStore();

let show = $ref(false);
let data = $ref<UnwrapPromise<ReturnType<typeof getFile>>>();

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
  }
});
</script>

<template>
  <n-drawer v-model:show="show" placement="bottom" resizable :default-height="300">
    <n-drawer-content
      closable :body-content-style="{
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr minmax(0,768px)',
        gap: '1em',
        overflow: 'hidden',
      }"
    >
      <template #header>
        <n-text>{{ data?.name }}</n-text>
        <n-button
          type="primary" text tag="a"
          ml=".25em"
          download :href="resolvePath({ path: data?.path, name: data?.name })"
        >
          <div class="i-ph:download" />
        </n-button>

        <!-- <n-button type="primary" text tag="a">
          <div class="i-ph:note-pencil" />
        </n-button>

        <n-button type="primary" text tag="a">
          <div class="i-ph:trash" />
        </n-button> -->
      </template>

      <preview class="aspect-ratio-1/1 h-full w-full" :url="resolvePath({ path: data?.path, name: data?.name })" />

      <div
        lh="1.5em" grid="~ rows-[repeat(auto-fit,1.5em)] auto-cols-[max-content_auto] flow-col" gap="y-.5em x-1em"
        justify="start" content="between"
      >
        <div grid="~ cols-subgrid col-span-2" gap="0">
          <n-text text="right">引用地址：</n-text>
          <n-text>
            <span>{{ `${data?.rawpath}/${data?.name}` }}</span>
            <n-button
              ml=".25em" type="primary" tag="a" text
              @click="copy(`${data?.rawpath}/${data?.name}`)"
            >
              <div class="i-ph:copy" />
            </n-button>
          </n-text>
        </div>

        <div grid="~ cols-subgrid col-span-2" gap="0">
          <n-text text="right">文件地址：</n-text>
          <!-- <n-button type="primary" tag="a" text @click="copy(`${data?.filepath}/${data?.name}`)">
            {{ `${data?.filepath}/${data?.name}` }}
          </n-button> -->
          <n-text>
            <span>{{ `${data?.path}/${data?.name}` }}</span>
            <n-button
              ml=".25em" type="primary" tag="a" text
              @click="copy(`${data?.path}/${data?.name}`)"
            >
              <div class="i-ph:copy" />
            </n-button>
          </n-text>
        </div>

        <div grid="~ cols-subgrid col-span-2" gap="0">
          <n-text text="right">类型：</n-text>
          <n-text>{{ data?.type }}</n-text>
        </div>

        <div grid="~ cols-subgrid col-span-2" gap="0">
          <n-text text="right">大小：</n-text>
          <n-text>{{ data?.size }}</n-text>
        </div>

        <div grid="~ cols-subgrid col-span-2" gap="0">
          <n-text text="right">修改日期：</n-text>
          <n-text>{{ data?.atime }}</n-text>
        </div>
      </div>

      <n-tabs type="line" animated placement="left">
        <n-tab-pane name="导入" tab="导入">
          <template #tab>
            导入
            <!-- <n-button
              ml=".25em" type="primary" tag="a" text
              @click.stop="copy(codeImport(data?.rawpath, data?.name))"
            >
              <div class="i-ph:copy" />
            </n-button> -->
          </template>
          <n-code :code="codeImport(data?.rawpath, data?.name)" language="javascript" word-wrap />
        </n-tab-pane>
        <n-tab-pane name="下载" tab="下载">
          <template #tab>
            下载
            <!-- <n-button
              ml=".25em" type="primary" tag="a" text
              @click.stop="copy(codeA(data?.rawpath, data?.name))"
            >
              <div class="i-ph:copy" />
            </n-button> -->
          </template>
          <n-code :code="codeA(data?.rawpath, data?.name)" language="xml" word-wrap />
        </n-tab-pane>
        <n-tab-pane name="图片" tab="图片">
          <template #tab>
            图片
            <!-- <n-button
              ml=".25em" type="primary" tag="a" text
              @click.stop="copy(codeImg(data?.rawpath, data?.name))"
            >
              <div class="i-ph:copy" />
            </n-button> -->
          </template>
          <n-code :code="codeImg(data?.rawpath, data?.name)" language="xml" word-wrap />
        </n-tab-pane>
      </n-tabs>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less" scoped></style>
