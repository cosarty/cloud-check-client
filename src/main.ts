import { createSSRApp } from "vue";

import { createPinia } from "pinia";
import httpIntercept from "./plugins/http-intercept";
import App from "./App.vue";
import uviewPlus from "uview-plus";
export function createApp() {
  const app = createSSRApp(App);
  app.use(createPinia());
  app.use(uviewPlus);
  app.use(httpIntercept);
  return {
    app,
  };
}
