import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const DIR_DIST = typeof __dirname !== "undefined"
  ? __dirname
  : dirname(fileURLToPath(import.meta.url));

export const DIR_CLIENT = resolve(DIR_DIST, "../dist/client");

// 路径是否存在
// export async function resolvePath(path: string) {
//   if (path.startsWith("/")) {
//     if (await stat(`.${path}`).catch(() => { }))
//       return `.${path}`;
//     if (await stat(path).catch(error => console.warn(error)))
//       return path;
//   }
//   else {
//     if (await stat(path).catch(error => console.warn(error)))
//       return path;
//   }
// }

// 别名解析
// export function resolveAlias(path: string, alias: Alias[]) {
//   path = normalizePath(path);
//   const finded = alias.find(item =>
//     // 针对于uniapp，replacement竟然可能为一个函数（无视掉并无影响）
//     typeof item.replacement === "string"
//     && (typeof item.find == "string"
//       ? path.startsWith(item.find)
//       : item.find.test(path)));
//   return finded ? path.replace(finded.find, finded.replacement) : path;
// }

// export function resolveAlias(path: string, alias: Alias[]) {
//   path = normalizePath(path);
//   const finded = alias.find(item =>
//     // 针对于uniapp，replacement竟然可能为一个函数（无视掉并无影响）
//     typeof item.replacement === "string"
//     && (typeof item.find == "string"
//       ? path.startsWith(item.find)
//       : item.find.test(path)));
//   return finded ? path.replace(finded.find, finded.replacement) : path;
// }
