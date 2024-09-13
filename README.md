<center>

# vite-plugin-asset

一个 vite 插件，可以帮助开发者方便的使用资源文件

[![Size](https://img.shields.io/bundlephobia/minzip/vite-plugin-asset/latest)](https://www.npmjs.com/package/vite-plugin-asset) [![Version](https://img.shields.io/npm/v/vite-plugin-asset)](https://www.npmjs.com/package/vite-plugin-asset) [![Languages](https://img.shields.io/github/languages/top/wsvaio/vite-plugin-asset)](https://www.npmjs.com/package/vite-plugin-asset) [![License](https://img.shields.io/npm/l/vite-plugin-asset)](https://www.npmjs.com/package/vite-plugin-asset) [![Star](https://img.shields.io/github/stars/wsvaio/vite-plugin-asset)](https://github.com/wsvaio/vite-plugin-asset) [![Download](https://img.shields.io/npm/dm/vite-plugin-asset)](https://www.npmjs.com/package/vite-plugin-asset)

</center>

## 特性
- ✨ 可方便快捷的寻找要使用的资源文件（尤其是图片）
- 🚀 对资源文件改名、删除、下载、访达等操作
- 🎉 可查看资源文件的使用情况，快速剔除未使用的资源文件
- 🎨 对图片、视频、音频等资源文件预览
- 🎇 快速在编辑器中打开资源文件或其使用处（需要安装code命令）

## 安装

```bash
npm i -D vite-plugin-asset
```

添加至您的 vite.config.ts：

```ts
// vite.config.ts
import VitePluginAsset from "vite-plugin-asset";

export default {
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    VitePluginAsset({
      // 配置静态资源存放的路径（可以解析配置的resolve.alias）
      path: "@/assets", // or "/src/assets" or ["@/assets", ...]
      // 依赖扫描时忽略的文件夹或文件 支持 glob 语法
      ignores: ["public/**"]
    }),
  ],
};
```

之后执行`vite dev`您便可在`localhost:5173/__asset/`打开查看

## 源码

源码可以在 [GitHub 仓库](https://github.com/wsvaio/vite-plugin-asset) 中找到。

## 贡献

如果您发现`vite-plugin-asset`中有任何问题或缺少某些功能，请随时提交问题或请求。

我们欢迎您的贡献，包括提交错误修复、添加新功能或改进文档。
