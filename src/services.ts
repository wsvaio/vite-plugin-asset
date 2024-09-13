import type { ResolvedPath } from "./types";
import { exec } from "node:child_process";
import { readdir, readFile, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { filesize } from "filesize";
import ignore from "ignore";
import mime from "mime";
import { normalizePath } from "vite";
import { context } from "./context";
import { locateCodeSnippets } from "./utils";

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
export async function getFiles({ name = [], isused }: { name?: string | string[]; isused?: boolean } = {}) {
  const { options } = context;
  const names = Array.isArray(name) ? name : [name];
  const result: { path: string; names: string[] }[] = [];

  await deepFile(options.paths.map(item => item.path), async (path, name) => {
    // name过滤
    if (names.length && !names.some(_name => name.includes(_name)))
      return;

    const finded = result.find(item => item.path == path);
    if (finded)
      finded.names.push(name);
    else
      result.push({ path, names: [name] });
  });

  // 过滤 是否 被使用
  if (isused !== undefined) {
    const names: string[] = [];
    await deepFile(".", async (path, name) => {
      path = join(path, name);
      // == null，可能是vue等文件
      if (mime.getType(path) != null && !mime.getType(path)?.startsWith("text"))
        return;
      const readed = await readFile(path, { encoding: "utf8" });
      result.forEach(item => names.push(...item.names.filter(sub => readed.includes(sub))));
    });
    result.forEach(item => item.names = item.names.filter(sub => isused ? names.includes(sub) : !names.includes(sub)));
  }

  return result.filter(item => item.names.length);
}

// 扫描内容含有关键字的文件
export async function scanFile(key: string) {
  const result: { path: string; positions: { row: number; column: number }[] }[] = [];
  await deepFile(".", async (path, name) => {
    path = join(path, name);
    // == null，可能是vue等文件
    if (mime.getType(path) != null && !mime.getType(path)?.startsWith("text"))
      return;
    const readed = await readFile(path, { encoding: "utf8" });
    const positions = locateCodeSnippets(readed, key);
    if (positions.length) {
      result.push({
        path,
        positions,
      });
    }
  });
  return result;
}

// 递归遍历文件
export async function deepFile(path: string | string[], cb: (path: string, name: string) => Promise<void>) {
  const paths = Array.isArray(path) ? path : [path];
  const r = async (path: string) => {
    if (await isIgnore(path))
      return;
    const readed = await readdir(path, { withFileTypes: true });
    for (const item of readed) {
      if (item.isDirectory()) {
        await r(join(item.parentPath, item.name));
      }
      if (item.isFile()) {
        if (await isIgnore(join(item.parentPath, item.name)))
          continue;
        await cb(item.parentPath, item.name);
      }
    }
  };

  for (const path of paths) {
    await r(path);
  }
}

// 文件改名
export async function renameFile({ path, name, newname }: { path: string; name: string; newname: string }) {
  await rename(join(path, name), join(path, newname));
  return true;
}

// 删除文件
export async function removeFile(ev: { path: string; name: string } | { path: string; name: string }[]) {
  ev = Array.isArray(ev) ? ev : [ev];
  for (const { path, name } of ev) await rm(join(path, name));
  return true;
}

// 打开文件
export async function openFile({ path, row = 0, column = 0 }: { path: string; row?: number; column?: number }) {
  const { config } = context;
  if (!config?.root)
    return;
  exec(`code -g '${join(config?.root, path)}:${row}:${column}'`);
}

// 判断文件是否被忽略
export async function isIgnore(path: string) {
  if (!context.ignore) {
    context.ignore = ignore({ allowRelativePaths: true })
      .add(await readFile(".gitignore", { encoding: "utf8" }).then(data => data.split("\n")))
      // .add(".git")
      .add(".?*")
      .add(context.options.ignores);
  }
  return context.ignore.ignores(path);
}
