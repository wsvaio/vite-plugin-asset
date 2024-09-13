import { resolve } from "node:path";
import Vue from "@vitejs/plugin-vue";
import ReactivityTransform from "@vue-macros/reactivity-transform/dist/vite";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "src")}/`,
      "~/": `${resolve(__dirname, "..")}/`,

    },
  },
  plugins: [
    VueRouter({
      root: __dirname,
      exclude: ["**/views"],
    }),
    Vue(),
    ReactivityTransform(),
    AutoImport({
      imports: [
        "vue",
        "pinia",
        {
          "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"],
        },
        "@vueuse/core"
      ],
      // resolvers: [NaiveUiResolver()],
      vueTemplate: true,
      defaultExportByFilename: true,
      dirs: [
        "src/utils",
        "src/composables",
        "src/stores",
      ],
    }),
    Components({
      globs: ["src/components/*/index.vue"],
      resolvers: [NaiveUiResolver()],
    }),
    Unocss(),
  ],

  build: {
    target: "esnext",
    outDir: resolve(__dirname, "../../dist/client"),
    minify: "esbuild",
    emptyOutDir: true,
  },
});
