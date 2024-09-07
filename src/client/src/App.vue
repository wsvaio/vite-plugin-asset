<script lang="ts" setup>
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";

import { darkTheme, dateZhCN, lightTheme, zhCN } from "naive-ui";
import useMainStore from "./stores/useMainStore";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("xml", xml);

const main = useMainStore();

// const themeVars = useThemeVars();

// console.log(themeVars);
</script>

<template>
  <n-config-provider
    :theme="main.theme === 'light' ? lightTheme : darkTheme" :locale="zhCN" :date-locale="dateZhCN"
    :hljs abstract :theme-overrides="{
      common: {
        primaryColor: '#EC5E42',
        primaryColorHover: '#CF523A',
        primaryColorPressed: '#963C2A',
        primaryColorSuppl: '#EC5E42',

      },
    }"
  >
    <!-- <n-theme-editor> -->
    <n-message-provider>
      <Suspense>
        <RouterView />
        <template #fallback>
          Loading...
        </template>
      </Suspense>
      <n-global-style />
    </n-message-provider>
    <!-- </n-theme-editor> -->
  </n-config-provider>
</template>
