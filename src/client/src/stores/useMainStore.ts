import { defineStore } from "pinia";

export default defineStore("main", {
  state: () => ({
    size: 32,
    theme: "light" as "light" | "dark",
    select: 0,
  }),
  actions: {

  },
  getters: {},
  persist: true,
});
