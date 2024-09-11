import { exec } from "node:child_process";
import { readdir, readFile, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { filesize } from "filesize";
import mime from "mime";
import { normalizePath } from "vite";
import { context } from "./context";
import { locateCodeSnippets } from "./utils";
import type { ResolvedPath } from "./types";

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
    use: await scanFile(name)
  };
}

// 扁平化列出监听的文件夹下所有文件
export async function getFiles({ name = [], }: { name?: string | string[] } = {}) {
  const { options } = context;

  const r = async (path: string | string[]) => {
    const paths = Array.isArray(path) ? path : [path];
    const names = Array.isArray(name) ? name : [name];
    const result: { path: string; names: string[] }[] = [];

    for (const path of paths) {
      const item = { path, names: [] as string[] };
      const items: { path: string; names: string[] }[] = [];

      const readed = await readdir(path).catch(error => {
        console.warn(error);
        return [];
      });

      for (const name of readed) {
        // 忽略隐藏文件
        if (name.startsWith("."))
          continue;

        const stats = await stat((join(path, name)));

        if (stats.isDirectory()) {
          items.push(...await r(join(path, name)));
        }

        if (stats.isFile()) {
          if (names.length && !names.some(_name => name.includes(_name)))
            continue;
          item.names.push(name);
        }
      }

      if (item.names.length)
        result.push(item);
      result.push(...items);
    }
    return result;
  };

  return await r(options.paths.map(item => item.path));
}

// 扫描内容含有关键字的文件
export async function scanFile(key: string) {
  const { options: { excludes } } = context;
  const r = async (path: string) => {
    if (excludes.some(item => typeof item === "string"
      ? path.startsWith(item)
      : item.test(path))) {
      return [];
    }
    const result: { path: string; positions: { row: number; column: number }[] }[] = [];
    const readed = await readdir(path, { withFileTypes: true });
    for (const item of readed) {
      if (item.isDirectory()) {
        result.push(...await r(join(item.parentPath, item.name)));
      }
      if (item.isFile()) {
        const path = join(item.parentPath, item.name);
        // == null，可能是vue等文件
        // if (mime.getType(path) != null && !mime.getType(path)?.startsWith("text"))
        //   continue;
        const readed = await readFile(path, { encoding: "utf8" });
        const positions = locateCodeSnippets(readed, key);
        if (positions.length) {
          result.push({
            path,
            positions,
          });
        }
      }
    }
    return result;
  };

  return await r(".");
}

// 文件改名
export async function renameFile({ path, name, newname }: { path: string; name: string; newname: string }) {
  await rename(join(path, name), join(path, newname));
  return true;
}

// 删除文件
export async function removeFile({ path, name }: { path: string; name: string }) {
  await rm(join(path, name));
  return true;
}

// 打开文件
export async function openFile({ path, row, column }: { path: string; row: number; column: number }) {
  const { config } = context;
  if (!config?.root)
    return;
  exec(`code -g '${join(config?.root, path)}:${row}:${column}'`);
}
