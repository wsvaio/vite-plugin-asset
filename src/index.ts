import type { Plugin } from "vite";
import { join } from "node:path";
import c from "picocolors";
import sirv from "sirv";
import { context } from "./context";
import { getFile, getFiles, openFile, removeFile, renameFile, resolvePaths } from "./services";
import { DIR_CLIENT } from "./utils";

export default ({ path = [], ignores = [] }: { path?: string | string[]; ignores?: string[] } = {}): Plugin => ({
  name: "vite-plugin-asset",
  enforce: "pre",
  apply: "serve",
  async configResolved(config) {
    context.config = config;
    context.options.paths = await resolvePaths(path);
    context.options.ignores = ignores;
  },
  async configureServer(server) {
    const { config, options: { paths } } = context;

    // 监听文件
    paths.forEach(item => server.watcher.add(item.path));

    // 文件发生改动 告诉客户端 让客户端执行刷新（主要是附带筛选参数）
    server.watcher.on("all", async () => {
      server.ws.send({
        type: "custom",
        event: "vite-plugin-asset:update",
        // 这里不附带data，客户端判断有无data来区分
      });
    });

    // 客户端主动刷新 附带筛选条件
    server.ws.on("vite-plugin-asset:update", async ev => server.ws.send({
      type: "custom",
      event: "vite-plugin-asset:update",
      data: await getFiles(ev),
    }));

    // 客户端获取某个文件详细信息
    server.ws.on("vite-plugin-asset:get", async ev => server.ws.send({
      type: "custom",
      event: "vite-plugin-asset:get",
      data: await getFile(ev),
    }));

    // 客户端更改某个文件名称
    server.ws.on("vite-plugin-asset:rename", async ev => server.ws.send({
      type: "custom",
      event: "vite-plugin-asset:get",
      data: await renameFile(ev) && await getFile({ ...ev, name: ev.newname }),
    }));

    // 客户端删除文件
    server.ws.on("vite-plugin-asset:delete", async ev => await removeFile(ev).then(() => {
      server.ws.send({
        type: "custom",
        event: "vite-plugin-asset:delete",
      });
    }));

    // 客户端打开某个文件
    server.ws.on("vite-plugin-asset:open", async ev => await openFile(ev));

    const base = config?.base || server.config.base;
    // 启动 client
    server.middlewares.use(`${base}__asset`, sirv(DIR_CLIENT, {
      single: true,
      dev: true,
    }));

    // 启动 监听的文件 的 静态资源服务
    paths.forEach(item => {
      server.middlewares.use(join(base, "__asset", item.path), sirv(item.path, {
        dev: true,
      }));
    });

    // 打印链接
    const _print = server.printUrls;
    server.printUrls = () => {
      let host = `${config?.server?.https ? "https" : "http"}://localhost:${config?.server.port || "80"}`;
      const url = server.resolvedUrls?.network[0] || server.resolvedUrls?.local[0];
      if (url) {
        const u = new URL(url);
        host = `${u.protocol}//${u.host}`;
      }
      _print();
      const colorUrl = (url: string) => c.green(url.replace(/:(\d+)\//, (_, port) => `:${c.bold(port)}/`));
      config?.logger.info(`  ${c.green("➜")}  ${c.bold("Asset")}: ${colorUrl(`${host}${base}__asset/`)}`);
    };
  },
});
