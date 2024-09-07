// import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  // presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

// @unocss-include
export default defineConfig({
  shortcuts: {

  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      // scale: 1.2,
      extraProperties: {
        display: "block",
      },
    }),
    // presetWebFonts({
    //   fonts: {
    //     mono: "DM Mono",
    //     sans: "DM Sans",
    //   },
    //   processors: createLocalFontProcessor(),
    // }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
