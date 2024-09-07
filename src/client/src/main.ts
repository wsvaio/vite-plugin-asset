import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

const modules = import.meta.glob("@/modules/*/index.ts", { eager: true });

Object.values<any>(modules).forEach(item => item?.default && item?.default(app));

app.mount("#app");
