import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const DIR_DIST = typeof __dirname !== "undefined"
  ? __dirname
  : dirname(fileURLToPath(import.meta.url));

export const DIR_CLIENT = resolve(DIR_DIST, "../dist/client");

export function locateCodeSnippets(code: string, snippets: string, position = 0) {
  const result: { row: number; column: number }[] = [];

  const index = code.indexOf(snippets, position);
  if (index !== -1) {
    const slicestr = code.slice(0, index + 1).split("\n");
    const row = slicestr.length;
    const column = slicestr.toReversed()[0].length;
    result.push({ row, column });
    result.push(...locateCodeSnippets(code, snippets, index + snippets.length));
  }

  return result;
}
