import defineEslintConfig, { vue } from "@wsvaio/eslint-config";

export default defineEslintConfig(
  {
    unocss: true,
    ignores: [
      "node_modules/*",
      "public/*",
      "dist/*",

      "**/* copy*",
      "**.auto-import.d.ts",
      "**/auto-components.d.ts",

    ],
  },
  vue,
  {
    rules: {

    },
  },
);
