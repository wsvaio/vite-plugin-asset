import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import type { App } from "vue";

export default (app: App) => {
  app.use(createRouter({
    history: createWebHashHistory(),
    routes
  }));
};
