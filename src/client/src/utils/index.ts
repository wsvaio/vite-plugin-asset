import type { ViteHotContext } from "vite/types/hot";

export async function createHotContext(path: string): Promise<ViteHotContext> {
  const base = location.pathname.replace(/__asset\/?/, "");
  return (await import(/* @vite-ignore */`${base}@vite/client`)).createHotContext(path);
}

export function resolvePath({ prefix = false, path = "", name = "" }: { prefix?: boolean; path?: string; name?: string } = {}) {
  return `${prefix ? "/__asset" : ""}${path ? "/" : ""}${path}${name ? "/" : ""}${name}`;
}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
