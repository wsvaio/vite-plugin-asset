import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import VitePluginAsset from "vite-plugin-asset";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // open: true,
  },
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "src")}/`,
      // "#/": `${resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    vue(),
    {
      name: "custom-loader",
      resolveId(id) {
        return id === "virtual:hi" ? `\0${id}` : undefined;
      },
      load(id) {
        if (id === "\0virtual:hi")
          return "export default 'Hi!'";
      },
    },
    {
      name: "custom-slow-loader",
      // for testing purpose, don't change it
      enforce: "post",
      resolveId(id) {
        return id.startsWith("virtual:slow:") ? `\0${id}` : undefined;
      },
      async load(id) {
        if (!id.startsWith("\0virtual:slow:"))
          return;

        const matcher = /^\0virtual:slow:(\d)$/.exec(id);
        if (matcher) {
          const timeout = +matcher[1];
          await new Promise(resolve => setTimeout(resolve, timeout * 1000));
          return `export default 'Hi after ${timeout} seconds!'`;
        }

        throw new Error("Invalid timeout!");
      },
    },
    VitePluginAsset({
      path: [
        "@/assets"
      ],
    }),
  ],
});
