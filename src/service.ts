import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { filesize } from "filesize";
import mime from "mime";
import { normalizePath } from "vite";
import { context } from "./context";
import type { ResolvedPath } from "./types";

// 获取某个文件的详细信息
export async function getFile({ path, name }: { path: string; name: string }) {
  const { options } = context;
  const stats = await stat(join(path, name));

  const find = options.paths.find(item => path.startsWith(item.path));

  return {
    path,
    name,
    rawpath: find ? path.replace(find?.path, find?.rawpath) : path,
    type: mime.getType(name.split(".").at(-1) || ""),
    size: filesize(stats.size),
    atime: stats.atime.toLocaleString(),
  };
}

// 扁平化列出监听的文件夹下所有文件
export async function getFiles({ name = [], }: { name?: string | string[] } = {}) {
  const { options } = context;

  const r = async (path: string | string[]) => {
    const paths = Array.isArray(path) ? path : [path];
    const names = Array.isArray(name) ? name : [name];
    const result: { path: string; names: string[] }[] = [];

    for (const item of paths) {
      const active = { path: item, names: [] as string[] };
      result.push(active);

      const readed = await readdir(item).catch(error => {
        console.warn(error);
        return [];
      });

      for (const sub of readed) {
        // 忽略隐藏文件
        if (sub.startsWith("."))
          continue;

        const stats = await stat((join(item, sub)));

        if (stats.isDirectory()) {
          result.push(...await r(join(item, sub)));
        }

        if (stats.isFile()) {
          if (names.length && !names.some(ssub => sub.includes(ssub)))
            continue;
          active.names.push(sub);
        }
      }
    }
    return result;
  };

  return await r(options.paths.map(item => item.path));
}

// 解析alias
export async function resolvePaths(path: string | string[]) {
  if (!context.config)
    return [];
  const { config: { root, resolve: { alias } } } = context;
  const paths: ResolvedPath[] = [];
  for (const rawpath of Array.isArray(path) ? path : [path]) {
    let path = normalizePath(rawpath);
    const finded = alias.find(item =>
    // 针对于uniapp，replacement竟然可能为一个函数（无视掉并无影响）
      typeof item.replacement === "string"
      && (typeof item.find == "string"
        ? path.startsWith(item.find)
        : item.find.test(path)));
    path = finded ? path.replace(finded.find, finded.replacement) : path;
    path = path.replace(`${root}/`, "");
    paths.push({ rawpath, path });
  }
  return paths;
}
