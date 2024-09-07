import { defineConfig } from "tsup";
// 暂时保留配置，与unbuild对比 打包体积更大
export default defineConfig({
  entry: ["src/index.ts", "src/nuxt.ts"],
  clean: false,
  dts: true,
  external: [
    "vite",
    "@nuxt/kit",
    "@nuxt/schema",
  ],

  format: ["esm", "cjs"],
  // minify: true
  // bundle: false,
  outExtension(ctx) {
    return {
      js: `.${{ cjs: "cjs", esm: "mjs", iife: "iife.js" }[ctx.format]}`,
      dts: `.d.${{ cjs: "cjs", esm: "mjs", iife: "iife.js" }[ctx.format]}`,
    };
  },
});
