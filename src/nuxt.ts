import { addVitePlugin, defineNuxtModule } from "@nuxt/kit";
import VitePluginAsset from ".";

export default defineNuxtModule({
  meta: {
    name: "vite-plugin-asset",
    configKey: "asset",
  },
  setup() {
    addVitePlugin(() => VitePluginAsset());
  },
}) as any;
