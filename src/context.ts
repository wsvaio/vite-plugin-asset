import type { Ignore } from "ignore";
import type { ResolvedConfig } from "vite";
import type { Options } from "./types";

// 全局保存一下配置
export const context: {
  options: Options;
  config?: ResolvedConfig;
  ignore?: Ignore;
} = {
  options: { paths: [], ignores: [] },
};
